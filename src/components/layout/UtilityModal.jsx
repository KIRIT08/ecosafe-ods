import { HelpCircle, Settings, Volume2, X } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'
import Button from '../ui/Button'

function UtilityModal({ type, onClose }) {
  const { enabled, toggleSound } = useAudio()

  if (!type) return null

  const isHelp = type === 'help'

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/75 px-4 backdrop-blur-md">
      <article className="w-full max-w-2xl rounded-lg border border-emerald-300/25 bg-slate-950/95 p-6 shadow-2xl shadow-emerald-950/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-100">
              {isHelp ? <HelpCircle className="size-4" /> : <Settings className="size-4" />}
              {isHelp ? 'Ayuda' : 'Configuracion'}
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-normal text-white">
              {isHelp ? 'Como usar EcoSafe ODS' : 'Preferencias de interfaz'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        {isHelp ? (
          <div className="mt-5 grid gap-3">
            {[
              ['Dashboard', 'Revisa indicadores ODS y graficos ambientales.'],
              ['Mapa', 'Explora zonas de riesgo y recomendaciones.'],
              ['Videojuego', 'Aprende jugando con misiones EcoGuard ODS.'],
              ['Biblioteca', 'Consulta informacion educativa con fuentes oficiales.'],
              ['Reportes', 'Revisa hallazgos, riesgos y recomendaciones.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="font-black text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 font-black text-white">
                <Volume2 className="size-5 text-lime-300" />
                Sonido de interfaz
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Activa o desactiva los sonidos de clic, logro y aviso.
              </p>
              <Button variant="secondary" className="mt-4" onClick={toggleSound}>
                {enabled ? 'Desactivar sonido' : 'Activar sonido'}
              </Button>
            </div>
            <div className="rounded-lg border border-lime-300/20 bg-lime-400/10 p-4">
              <p className="font-black text-lime-100">Preferencias guardadas</p>
              <p className="mt-2 text-sm leading-6 text-lime-100/75">
                La preferencia de sonido se guarda localmente en este navegador.
              </p>
            </div>
          </div>
        )}
      </article>
    </div>
  )
}

export default UtilityModal
