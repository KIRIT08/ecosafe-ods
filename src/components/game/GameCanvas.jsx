import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Gamepad2, Play, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { rectanglesCollide } from '../../game/collisions'
import { drawObject, drawPlayer, drawScene } from '../../game/drawing'
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_Y,
  WIN_SCORE,
  gameMissions,
  initialStats,
  playerConfig,
} from '../../game/gameConfig'
import { createInputController, getMovement } from '../../game/input'
import { createFallingObject, isObjectOutOfBounds, updateObject } from '../../game/objects'

function createInitialPlayer() {
  return {
    x: GAME_WIDTH / 2 - playerConfig.width / 2,
    y: GROUND_Y - playerConfig.height + 12,
    width: playerConfig.width,
    height: playerConfig.height,
  }
}

function createEndlessMission(stats) {
  const cycle = gameMissions.filter((mission) => mission.level > 0)
  const template = cycle[(stats.round - 1) % cycle.length]
  const bonus = Math.floor(stats.round / cycle.length)

  return {
    ...template,
    id: `${template.id}-round-${stats.round}`,
    level: Math.min(stats.level + 1, 99),
    target: template.target + bonus,
    title: `${template.title} (${stats.round + 1})`,
    needsQuestion: false,
  }
}

function getCurrentMission(stats) {
  return gameMissions[stats.missionIndex] || createEndlessMission(stats)
}

function useAudioEngine() {
  const audioRef = useRef(null)

  const play = useCallback((type) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    const context = audioRef.current || new AudioContext()
    audioRef.current = context

    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const sounds = {
      collect: [740, 0.08, 0.05],
      hit: [150, 0.12, 0.08],
      correct: [880, 0.14, 0.07],
      wrong: [190, 0.16, 0.08],
      start: [520, 0.12, 0.06],
      end: [90, 0.22, 0.08],
      win: [980, 0.26, 0.08],
    }
    const [frequency, duration, volume] = sounds[type] || sounds.collect

    oscillator.frequency.value = frequency
    oscillator.type = type === 'hit' || type === 'wrong' || type === 'end' ? 'sawtooth' : 'sine'
    gain.gain.setValueAtTime(volume, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + duration)
  }, [])

  return play
}

const GameCanvas = forwardRef(function GameCanvas({ onStatsChange, onStatusChange, onGameEnd }, ref) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const inputRef = useRef(null)
  const playerRef = useRef(createInitialPlayer())
  const objectsRef = useRef([])
  const tickRef = useRef(0)
  const spawnTimerRef = useRef(0)
  const feedbackTimerRef = useRef(null)
  const statsRef = useRef(initialStats)
  const statusRef = useRef('idle')
  const endedRef = useRef(false)
  const playSound = useAudioEngine()
  const [, setStats] = useState(initialStats)
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState(null)

  const syncStats = useCallback(
    (nextStats) => {
      statsRef.current = nextStats
      setStats(nextStats)
      onStatsChange(nextStats)
    },
    [onStatsChange],
  )

  const syncStatus = useCallback(
    (nextStatus) => {
      statusRef.current = nextStatus
      setStatus(nextStatus)
      onStatusChange(nextStatus)
    },
    [onStatusChange],
  )

  const showFeedback = useCallback((message, tone = 'good') => {
    window.clearTimeout(feedbackTimerRef.current)
    setFeedback({ id: Date.now(), message, tone })
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), 1800)
  }, [])

  const finishGame = useCallback(
    (nextStatus, finalStats) => {
      if (endedRef.current) return

      endedRef.current = true
      syncStatus(nextStatus)
      playSound(nextStatus === 'victory' ? 'win' : 'end')
      onGameEnd({ ...finalStats, status: nextStatus })
    },
    [onGameEnd, playSound, syncStatus],
  )

  const completeMission = useCallback(
    (baseStats, mission) => {
      const nextMissionIndex = baseStats.missionIndex + 1
      const nextMission =
        gameMissions[nextMissionIndex] ||
        createEndlessMission({
          ...baseStats,
          missionIndex: nextMissionIndex,
          round: baseStats.round + 1,
        })
      const nextLevel = mission.level === 0 ? 1 : nextMission.level
      const completedStats = {
        ...baseStats,
        score: baseStats.score + 25,
        level: nextLevel,
        missionIndex: nextMissionIndex,
        missionProgress: 0,
        collected: 0,
        target: nextMission?.target || 3,
        round: mission.level === 0 ? 1 : baseStats.round + 1,
        tutorialDone: true,
      }

      syncStats(completedStats)
      showFeedback(
        mission.level === 0 ? 'Tutorial completado. Ahora empieza el reto.' : `Nivel superado. ${mission.message}`,
        'success',
      )
      return completedStats
    },
    [showFeedback, syncStats],
  )

  const resetGame = useCallback(() => {
    const nextStats = { ...initialStats, status: 'running' }
    playerRef.current = createInitialPlayer()
    objectsRef.current = []
    tickRef.current = 0
    spawnTimerRef.current = 0
    endedRef.current = false
    syncStats(nextStats)
    syncStatus('running')
    showFeedback('Aprende jugando. Recoge objetos buenos.', 'info')
    playSound('start')
  }, [playSound, showFeedback, syncStats, syncStatus])

  const pauseGame = useCallback(() => {
    if (statusRef.current !== 'running') return
    syncStatus('paused')
  }, [syncStatus])

  const resumeGame = useCallback(() => {
    if (statusRef.current !== 'paused') return
    syncStatus('running')
  }, [syncStatus])

  useImperativeHandle(
    ref,
    () => ({
      pause: pauseGame,
      resume: resumeGame,
      restart: resetGame,
    }),
    [pauseGame, resetGame, resumeGame],
  )

  const handleGoodCollision = useCallback(
    (object) => {
      const currentStats = statsRef.current
      const mission = getCurrentMission(currentStats)
      const matchesMission = mission?.type === 'collect' && mission.objectType === object.type
      const missionProgress = matchesMission
        ? currentStats.missionProgress + 1
        : currentStats.missionProgress
      const nextStats = {
        ...currentStats,
        score: currentStats.score + object.points,
        collected: missionProgress,
        missionProgress,
      }

      syncStats(nextStats)
      showFeedback(object.message, 'success')
      playSound('collect')

      if (nextStats.score >= WIN_SCORE) {
        showFeedback('Gran puntaje. Puedes seguir jugando para mejorar.', 'success')
      }

      if (mission && matchesMission && missionProgress >= mission.target) {
        completeMission(nextStats, mission)
      }
    },
    [completeMission, playSound, showFeedback, syncStats],
  )

  const handleBadCollision = useCallback(
    (object) => {
      const losesLife = statsRef.current.tutorialDone
      const nextStats = {
        ...statsRef.current,
        score: Math.max(0, statsRef.current.score - 4),
        lives: losesLife ? statsRef.current.lives - object.damage : statsRef.current.lives,
      }

      syncStats(nextStats)
      showFeedback(object.message, 'help')
      playSound('hit')

      if (nextStats.lives <= 0) {
        finishGame('gameOver', nextStats)
      }
    },
    [finishGame, playSound, showFeedback, syncStats],
  )

  const handleAvoidedObject = useCallback(
    (object) => {
      const currentStats = statsRef.current
      const mission = getCurrentMission(currentStats)
      const matchesMission = mission?.type === 'avoid' && mission.objectType === object.type

      if (!matchesMission) return

      const missionProgress = currentStats.missionProgress + 1
      const nextStats = {
        ...currentStats,
        score: currentStats.score + 10,
        missionProgress,
        collected: missionProgress,
      }

      syncStats(nextStats)
      showFeedback('Bien hecho. Evitaste contaminacion.', 'success')

      if (missionProgress >= mission.target) {
        completeMission(nextStats, mission)
      }
    },
    [completeMission, showFeedback, syncStats],
  )

  const drawCurrentFrame = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    drawScene(ctx)
    objectsRef.current.forEach((object) => drawObject(ctx, object))
    drawPlayer(ctx, playerRef.current, tickRef.current)
  }, [])

  const updateGame = useCallback(() => {
    if (statusRef.current !== 'running') {
      drawCurrentFrame()
      return
    }

    tickRef.current += 1
    spawnTimerRef.current += 1

    const movement = getMovement(inputRef.current?.activeKeys || inputRef.current?.keys || new Set())
    const player = playerRef.current
    playerRef.current = {
      ...player,
      x: Math.max(10, Math.min(GAME_WIDTH - player.width - 10, player.x + movement.x * playerConfig.speed)),
      y: Math.max(160, Math.min(GROUND_Y - player.height + 12, player.y + movement.y * playerConfig.speed)),
    }

    if (spawnTimerRef.current > Math.max(22, 68 - statsRef.current.level * 7)) {
      objectsRef.current = [...objectsRef.current, createFallingObject(statsRef.current.level)]
      spawnTimerRef.current = 0
    }

    const remainingObjects = []
    objectsRef.current.map(updateObject).forEach((object) => {
      if (rectanglesCollide(playerRef.current, object)) {
        if (object.kind === 'good') {
          handleGoodCollision(object)
        } else {
          handleBadCollision(object)
        }
        return
      }

      if (isObjectOutOfBounds(object)) {
        handleAvoidedObject(object)
      } else {
        remainingObjects.push(object)
      }
    })
    objectsRef.current = remainingObjects
    drawCurrentFrame()
  }, [drawCurrentFrame, handleAvoidedObject, handleBadCollision, handleGoodCollision])

  useEffect(() => {
    inputRef.current = createInputController()

    function loop() {
      updateGame()
      animationRef.current = window.requestAnimationFrame(loop)
    }

    drawCurrentFrame()
    animationRef.current = window.requestAnimationFrame(loop)

    return () => {
      inputRef.current?.destroy()
      window.cancelAnimationFrame(animationRef.current)
      window.clearTimeout(feedbackTimerRef.current)
    }
  }, [drawCurrentFrame, updateGame])

  const overlay =
    status === 'idle' || status === 'paused' || status === 'gameOver' || status === 'victory'

  const touchButtons = [
    { direction: 'up', label: 'Arriba', icon: ArrowUp, className: 'col-start-2 row-start-1' },
    { direction: 'left', label: 'Izquierda', icon: ArrowLeft, className: 'col-start-1 row-start-2' },
    { direction: 'down', label: 'Abajo', icon: ArrowDown, className: 'col-start-2 row-start-2' },
    { direction: 'right', label: 'Derecha', icon: ArrowRight, className: 'col-start-3 row-start-2' },
  ]

  function handleTouchDirection(direction, active) {
    inputRef.current?.setTouchDirection(direction, active)
  }

  return (
    <div className="relative min-h-[21rem] overflow-hidden rounded-b-lg bg-slate-950 sm:min-h-0">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="block h-full min-h-[21rem] w-full sm:h-auto sm:min-h-0"
        aria-label="Videojuego Canvas EcoGuard ODS"
      />

      {overlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 grid place-items-center overflow-y-auto bg-slate-950/55 px-3 py-4 text-center backdrop-blur-[2px] sm:px-4"
        >
          <div className="max-w-md rounded-lg border border-white/10 bg-slate-950/85 p-4 shadow-2xl shadow-emerald-950/40 sm:p-6">
            <Gamepad2 className="mx-auto size-10 text-emerald-300 sm:size-12" />
            <h3 className="mt-3 text-xl font-black tracking-normal text-white sm:mt-4 sm:text-2xl">
              {status === 'victory'
                ? 'Mision completada'
                : status === 'gameOver'
                  ? 'Fin de la partida'
                  : status === 'paused'
                    ? 'Juego en pausa'
                    : 'EcoGuard ODS'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Usa flechas, WASD o los botones tactiles. Recoge objetos buenos. Evita
              contaminantes. Cada accion ayuda a un ODS.
            </p>
            {status === 'idle' && (
              <div className="mt-3 grid gap-2 text-left text-xs font-bold text-slate-300 sm:mt-4">
                <span>1. Muevete con flechas o botones tactiles.</span>
                <span>2. Recoge botellas, agua y arboles.</span>
                <span>3. Evita humo y basura peligrosa.</span>
              </div>
            )}
            <div className="mt-5 flex justify-center gap-3">
              {status === 'paused' ? (
                <Button icon={Play} onClick={resumeGame}>
                  Reanudar
                </Button>
              ) : (
                <Button icon={status === 'idle' ? Play : RotateCcw} onClick={resetGame}>
                  {status === 'idle' ? 'Iniciar juego' : 'Jugar otra vez'}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs font-bold text-slate-300">
        Teclado / Tactil
      </div>

      <div className="absolute bottom-3 right-3 grid grid-cols-3 grid-rows-2 gap-2 sm:hidden">
        {touchButtons.map(({ direction, label, icon: Icon, className }) => (
          <button
            key={direction}
            type="button"
            aria-label={label}
            onPointerDown={(event) => {
              event.preventDefault()
              handleTouchDirection(direction, true)
            }}
            onPointerUp={(event) => {
              event.preventDefault()
              handleTouchDirection(direction, false)
            }}
            onPointerCancel={() => handleTouchDirection(direction, false)}
            onPointerLeave={() => handleTouchDirection(direction, false)}
            className={[
              'grid size-11 touch-none place-items-center rounded-lg border border-emerald-200/25 bg-slate-950/75 text-emerald-200 shadow-lg shadow-slate-950/30 backdrop-blur transition active:scale-95 active:bg-emerald-300 active:text-emerald-950',
              className,
            ].join(' ')}
          >
            <Icon className="size-5" />
          </button>
        ))}
      </div>

      {feedback && (
        <motion.div
          key={feedback.id}
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={[
            'pointer-events-none absolute left-1/2 top-4 max-w-[88%] -translate-x-1/2 rounded-lg border px-4 py-3 text-center text-sm font-black shadow-xl',
            feedback.tone === 'help'
              ? 'border-amber-300/40 bg-amber-400/20 text-amber-50'
              : feedback.tone === 'info'
                ? 'border-sky-300/40 bg-sky-400/20 text-sky-50'
                : 'border-lime-300/40 bg-lime-400/20 text-lime-50',
          ].join(' ')}
        >
          {feedback.message}
        </motion.div>
      )}
    </div>
  )
})

export default GameCanvas
