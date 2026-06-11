import { Heart, Pause, Play, RotateCcw, Trophy } from 'lucide-react'
import Button from '../ui/Button'

function GameHUD({ stats, status, onPause, onResume, onRestart }) {
  const maxLives = Math.max(4, stats.lives)
  const hearts = Array.from({ length: maxLives }, (_, index) => index < stats.lives)

  return (
    <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Puntos</p>
          <p className="text-2xl font-black text-lime-300">{stats.score}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Nivel</p>
          <p className="text-2xl font-black text-amber-300">
            {stats.level === 0 ? 'Tutorial' : stats.level}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Meta</p>
          <p className="text-2xl font-black text-sky-300">
            {stats.collected}/{stats.target}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Vidas</p>
          <div className="mt-1 flex items-center gap-1 text-red-400">
            {hearts.map((active, index) => (
              <Heart
                key={`${active}-${index}`}
                className={active ? 'size-6 fill-current' : 'size-6 text-slate-600'}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {status === 'running' && (
          <Button variant="secondary" icon={Pause} onClick={onPause}>
            Pausar
          </Button>
        )}
        {status === 'paused' && (
          <Button variant="secondary" icon={Play} onClick={onResume}>
            Reanudar
          </Button>
        )}
        {(status === 'gameOver' || status === 'victory') && (
          <Button variant="secondary" icon={RotateCcw} onClick={onRestart}>
            Reiniciar
          </Button>
        )}
        {status === 'victory' && (
          <span className="inline-flex h-11 items-center gap-2 rounded-lg border border-lime-300/30 bg-lime-300/10 px-4 text-sm font-black text-lime-100">
            <Trophy className="size-5" />
            Victoria
          </span>
        )}
      </div>
    </div>
  )
}

export default GameHUD
