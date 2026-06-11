import { Award, ClipboardList, Medal, Sparkles } from 'lucide-react'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'
import { gameMissions } from '../../game/gameConfig'

function ScorePanel({ ranking, stats, status, lastSavedScore }) {
  const baseMission = gameMissions[stats.missionIndex]
  const mission =
    baseMission ||
    gameMissions.filter((item) => item.level > 0)[stats.round % (gameMissions.length - 1)]
  const progress = Math.min(Math.round((stats.missionProgress / stats.target) * 100), 100)
  const levelText =
    stats.level === 0
      ? 'Tutorial: aprende sin castigo'
      : stats.level <= 2
        ? `Nivel ${stats.level}: misiones faciles`
        : stats.level <= 5
          ? `Nivel ${stats.level}: mas velocidad`
          : `Ronda ${stats.round}: modo continuo`

  return (
    <aside className="space-y-4">
      <article className="glass-panel rounded-lg p-5">
        <Badge icon={ClipboardList}>Mision actual</Badge>
        <h2 className="mt-3 text-lg font-black tracking-normal text-white">
          {baseMission?.title || `${mission?.title || 'Mision sostenible'} extra`}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {mission
            ? `Esta accion ayuda al ODS ${mission.ods}.`
            : 'Sigue jugando y aprendiendo por acciones.'}
        </p>
        <p className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-emerald-100">
          {levelText}
        </p>
        <div className="mt-5">
          <ProgressBar value={progress} label={mission?.shortTitle || 'Progreso'} />
        </div>
      </article>

      <article className="glass-panel rounded-lg p-5">
        <Badge icon={Medal}>Ranking EcoGuard</Badge>
        <div className="mt-4 space-y-3">
          {ranking.length > 0 ? (
            ranking.slice(0, 5).map((item, index) => (
              <div
                key={item.id || `${item.user_id}-${index}`}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-lg bg-emerald-400/15 text-sm font-black text-emerald-200">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-black text-white">
                      {item.perfiles_usuario?.nombre || 'Eco jugador'}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      Nivel {item.nivel_alcanzado || 1}
                    </p>
                  </div>
                </div>
                <p className="font-black text-lime-300">{item.puntaje}</p>
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-semibold text-slate-400">
              Juega una partida para activar el ranking.
            </p>
          )}
        </div>
      </article>

      <article className="glass-panel rounded-lg p-5">
        <Badge icon={Award}>Logros</Badge>
        <div className="mt-4 grid gap-3">
          <div className="rounded-lg border border-lime-300/20 bg-lime-400/10 p-3">
            <p className="text-sm font-black text-lime-100">Guardian ODS</p>
            <p className="mt-1 text-xs font-semibold text-lime-100/70">
              Aprende con acciones y llega a 420 puntos.
            </p>
          </div>
          <div className="rounded-lg border border-sky-300/20 bg-sky-400/10 p-3">
            <p className="text-sm font-black text-sky-100">Estado</p>
            <p className="mt-1 text-xs font-semibold text-sky-100/70">
              {status === 'running' ? 'En accion' : 'Listo para jugar'}
            </p>
          </div>
          {lastSavedScore && (
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-3">
              <p className="flex items-center gap-2 text-sm font-black text-emerald-100">
                <Sparkles className="size-4" />
                Puntaje guardado
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                Ultima partida: {lastSavedScore} puntos.
              </p>
            </div>
          )}
        </div>
      </article>
    </aside>
  )
}

export default ScorePanel
