import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Leaf } from 'lucide-react'
import GameCanvas from '../components/game/GameCanvas'
import GameHUD from '../components/game/GameHUD'
import ScorePanel from '../components/game/ScorePanel'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import { initialStats } from '../game/gameConfig'
import { useAuth } from '../hooks/useAuth'
import { getPreguntasOds, getRanking, saveGameScore } from '../services/gameService'
import { getUserProfile, upsertUserProfile } from '../services/profileService'
import { supabase } from '../services/supabaseClient'

const demoQuestions = [
  {
    id: 'demo-ods-13',
    pregunta: 'Que debemos evitar para cuidar el aire?',
    opcion_a: 'Humo contaminante',
    opcion_b: 'Agua limpia',
    opcion_c: 'Arboles',
    opcion_d: 'Botellas recicladas',
    respuesta_correcta: 'Humo contaminante',
    explicacion: 'Evitar humo ayuda a cuidar el clima.',
    ods_relacionado: 13,
    dificultad: 'facil',
  },
  {
    id: 'demo-ods-12',
    pregunta: 'Que objeto debe ir al reciclaje?',
    opcion_a: 'Botella reciclable',
    opcion_b: 'Humo',
    opcion_c: 'Fuego',
    opcion_d: 'Derrame',
    respuesta_correcta: 'Botella reciclable',
    explicacion: 'Reciclar ayuda al consumo responsable.',
    ods_relacionado: 12,
    dificultad: 'facil',
  },
  {
    id: 'demo-ods-6',
    pregunta: 'Que accion ayuda a cuidar el agua?',
    opcion_a: 'Tirar basura al rio',
    opcion_b: 'Cuidar las gotas de agua',
    opcion_c: 'Quemar residuos',
    opcion_d: 'Tocar humo',
    respuesta_correcta: 'Cuidar las gotas de agua',
    explicacion: 'El agua limpia es importante para todos.',
    ods_relacionado: 6,
    dificultad: 'medio',
  },
  {
    id: 'demo-ods-15',
    pregunta: 'Plantar arboles ayuda a que ODS?',
    opcion_a: 'ODS 4',
    opcion_b: 'ODS 6',
    opcion_c: 'ODS 13',
    opcion_d: 'ODS 15',
    respuesta_correcta: 'ODS 15',
    explicacion: 'El ODS 15 protege ecosistemas terrestres.',
    ods_relacionado: 15,
    dificultad: 'avanzado',
  },
]

const demoRanking = [
  {
    id: 'demo-rank-1',
    puntaje: 420,
    nivel_alcanzado: 4,
    perfiles_usuario: { nombre: 'EcoLider', nivel: 'EcoLider ODS' },
  },
  {
    id: 'demo-rank-2',
    puntaje: 360,
    nivel_alcanzado: 3,
    perfiles_usuario: { nombre: 'Guardian Verde', nivel: 'Guardian Ambiental' },
  },
  {
    id: 'demo-rank-3',
    puntaje: 290,
    nivel_alcanzado: 2,
    perfiles_usuario: { nombre: 'Aprendiz ODS', nivel: 'Aprendiz Sostenible' },
  },
]

function getLevelName(totalPoints) {
  if (totalPoints >= 1800) return 'EcoLider ODS'
  if (totalPoints >= 1200) return 'Auditor de Impacto'
  if (totalPoints >= 700) return 'Guardian Ambiental'
  if (totalPoints >= 300) return 'Reciclador Responsable'
  return 'Aprendiz Sostenible'
}

function normalizeQuestion(question) {
  const options = Array.isArray(question.opciones)
    ? question.opciones
    : [question.opcion_a, question.opcion_b, question.opcion_c, question.opcion_d].filter(Boolean)

  return {
    ...question,
    opciones: options,
    dificultad: question.dificultad === 'basico' ? 'facil' : question.dificultad,
    ods_relacionado: question.ods_relacionado || question.ods_numero,
  }
}

function Videojuego() {
  const { user, isDemoMode, isSupabaseConfigured } = useAuth()
  const userId = user?.id
  const gameRef = useRef(null)
  const [questions, setQuestions] = useState(isDemoMode ? demoQuestions : [])
  const [ranking, setRanking] = useState(isDemoMode ? demoRanking : [])
  const [stats, setStats] = useState(initialStats)
  const [status, setStatus] = useState('idle')
  const [lastSavedScore, setLastSavedScore] = useState(null)
  const [loading, setLoading] = useState(!isDemoMode)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadGameData() {
      if (isDemoMode) {
        setQuestions(demoQuestions)
        setRanking(demoRanking)
        setLoading(false)
        setError('')
        return
      }

      if (!isSupabaseConfigured) {
        setLoading(false)
        setError('No se pudo cargar la data del videojuego.')
        return
      }

      try {
        setLoading(true)
        setError('')
        const [questionData, rankingData] = await Promise.all([getPreguntasOds(), getRanking(8)])

        if (!mounted) return
        setQuestions(questionData.map(normalizeQuestion))
        setRanking(rankingData)
      } catch (loadError) {
        if (!mounted) return
        setError(loadError.message || 'No se pudo cargar la data del videojuego.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadGameData()

    return () => {
      mounted = false
    }
  }, [isDemoMode, isSupabaseConfigured])

  const handleStatsChange = useCallback((nextStats) => {
    setStats(nextStats)
  }, [])

  const handleStatusChange = useCallback((nextStatus) => {
    setStatus(nextStatus)
  }, [])

  const refreshRanking = useCallback(async () => {
    if (isDemoMode || !isSupabaseConfigured) return

    const rankingData = await getRanking(8)
    setRanking(rankingData)
  }, [isDemoMode, isSupabaseConfigured])

  useEffect(() => {
    if (isDemoMode || !isSupabaseConfigured || !supabase) return undefined

    const channel = supabase
      .channel('ranking-juego-ods')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'puntajes_juego' },
        () => {
          refreshRanking()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isDemoMode, isSupabaseConfigured, refreshRanking])

  const updateUserProgress = useCallback(
    async (finalStats) => {
      if (isDemoMode || !isSupabaseConfigured || !userId) return

      const currentProfile = await getUserProfile(userId)
      const currentPoints = Number(currentProfile.puntos_totales) || 0
      const totalPoints = currentPoints + finalStats.score
      const currentProgress = Number(currentProfile.progreso_ods) || 0
      const nextProgress = Math.min(100, currentProgress + Math.max(2, Math.round(finalStats.score / 55)))

      await upsertUserProfile({
        ...currentProfile,
        puntos_totales: totalPoints,
        progreso_ods: nextProgress,
        nivel: getLevelName(totalPoints),
      })
    },
    [isDemoMode, isSupabaseConfigured, userId],
  )

  const handleGameEnd = useCallback(
    async (finalStats) => {
      setLastSavedScore(finalStats.score)

      if (isDemoMode) {
        setRanking((currentRanking) => [
          {
            id: `demo-current-${Date.now()}`,
            puntaje: finalStats.score,
            nivel_alcanzado: finalStats.level,
            perfiles_usuario: { nombre: 'Tu partida', nivel: 'Jugador demo' },
          },
          ...currentRanking,
        ])
        return
      }

      if (!isSupabaseConfigured || !userId) {
        setError('No se pudo guardar el puntaje de esta partida.')
        return
      }

      try {
        setError('')
        await saveGameScore({
          userId,
          puntaje: finalStats.score,
          nivelAlcanzado: finalStats.level,
          vidasRestantes: Math.max(0, finalStats.lives),
        })
        await updateUserProgress(finalStats)
        await refreshRanking()
      } catch (saveError) {
        setError(saveError.message || 'No se pudo guardar el puntaje de esta partida.')
      }
    },
    [isDemoMode, isSupabaseConfigured, refreshRanking, updateUserProgress, userId],
  )

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge icon={Gamepad2}>Videojuego Canvas</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-normal text-white">EcoGuard ODS</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Empieza con tutorial, supera misiones y aprende ODS con acciones simples.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300">
            {loading ? 'Preparando partida...' : isDemoMode ? 'Modo demo visual' : 'Misiones listas'}
          </div>
        </header>

        {error && (
          <Card className="border-amber-300/30 bg-amber-400/10">
            <p className="text-sm font-semibold leading-6 text-amber-100">{error}</p>
          </Card>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden rounded-lg"
        >
          <GameHUD
            stats={stats}
            status={status}
            onPause={() => gameRef.current?.pause()}
            onResume={() => gameRef.current?.resume()}
            onRestart={() => gameRef.current?.restart()}
          />
          <GameCanvas
            ref={gameRef}
            onStatsChange={handleStatsChange}
            onStatusChange={handleStatusChange}
            onGameEnd={handleGameEnd}
          />
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Tutorial', 'Practica sin perder vidas.'],
            ['Misiones', 'Completa acciones para subir de nivel.'],
            ['Continuo', 'Cada ronda sube velocidad y dificultad.'],
          ].map(([title, description]) => (
            <article key={title} className="glass-panel rounded-lg p-4">
              <p className="flex items-center gap-2 text-sm font-black text-emerald-200">
                <Leaf className="size-4" />
                {title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </div>

        <article className="glass-panel rounded-lg p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-emerald-200">Trivia ODS opcional</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Las preguntas quedan preparadas como actividad extra, fuera del juego principal.
              </p>
            </div>
            <span className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-slate-300">
              {questions.length} preguntas
            </span>
          </div>
        </article>
      </div>

      <ScorePanel
        ranking={ranking}
        stats={stats}
        status={status}
        lastSavedScore={lastSavedScore}
      />
    </section>
  )
}

export default Videojuego
