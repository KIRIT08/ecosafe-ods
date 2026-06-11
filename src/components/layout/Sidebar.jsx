import { NavLink } from 'react-router-dom'
import { HelpCircle, Settings } from 'lucide-react'
import Logo from './Logo'
import { appRoutes } from '../../routes/routeConfig'
import { useAudio } from '../../hooks/useAudio'

const secondaryLinks = [
  { label: 'Configuracion', icon: Settings },
  { label: 'Ayuda', icon: HelpCircle },
]

function Sidebar({ onHelp, onSettings }) {
  const { play } = useAudio()
  const actions = {
    Configuracion: onSettings,
    Ayuda: onHelp,
  }

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-emerald-200/10 bg-slate-950/55 px-5 py-6 backdrop-blur-xl lg:block">
      <Logo />

      <nav className="mt-10 space-y-2">
        {appRoutes.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => play('click')}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition duration-300',
                  isActive
                    ? 'bg-emerald-500/20 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              <Icon className="size-5 text-emerald-200 transition group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="mb-3 px-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Herramientas
        </p>
        <div className="space-y-2">
          {secondaryLinks.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  play('click')
                  actions[item.label]?.()
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-400 transition duration-300 hover:bg-white/5 hover:text-white"
              >
                <Icon className="size-5 text-slate-300" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="glass-panel mt-10 rounded-lg p-5">
        <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-lime-400/15 text-sm font-black text-lime-300">
          ODS
        </div>
        <p className="font-bold text-white">Progreso ODS simulado</p>
        <div className="mt-4 h-2 rounded-full bg-slate-800">
          <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-emerald-400 to-lime-300" />
        </div>
        <p className="mt-3 text-sm text-slate-300">82% - Nivel 3</p>
      </div>
    </aside>
  )
}

export default Sidebar
