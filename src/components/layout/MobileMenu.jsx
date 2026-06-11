import { NavLink } from 'react-router-dom'
import { HelpCircle, Settings, X } from 'lucide-react'
import Logo from './Logo'
import { appRoutes } from '../../routes/routeConfig'

function MobileMenu({ open, onClose, onHelp, onSettings }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden">
      <aside className="h-full w-80 max-w-[86vw] border-r border-white/10 bg-slate-950 p-5">
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5"
            aria-label="Cerrar menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-2">
          {appRoutes.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition',
                    isActive ? 'bg-emerald-500/20 text-white' : 'text-slate-300',
                  ].join(' ')
                }
              >
                <Icon className="size-5 text-emerald-200" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="mb-3 px-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Herramientas
          </p>
          <button
            type="button"
            onClick={() => {
              onSettings()
              onClose()
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <Settings className="size-5 text-slate-300" />
            Configuracion
          </button>
          <button
            type="button"
            onClick={() => {
              onHelp()
              onClose()
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <HelpCircle className="size-5 text-slate-300" />
            Ayuda
          </button>
        </div>
      </aside>
    </div>
  )
}

export default MobileMenu
