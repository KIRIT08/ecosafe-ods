import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Menu, Search, Trophy, UserRound, Volume2, VolumeX } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useAudio } from '../../hooks/useAudio'
import Logo from './Logo'

const quickSearchItems = [
  {
    title: 'Inicio',
    description: 'Resumen, impacto social y acciones sostenibles',
    path: '/inicio',
    keywords: 'inicio impacto social acciones sostenibles comunidad',
  },
  {
    title: 'Dashboard',
    description: 'Graficos, metricas e indicadores ODS',
    path: '/dashboard',
    keywords: 'dashboard graficos indicadores metricas datos ods',
  },
  {
    title: 'Mapa de Riesgos',
    description: 'Zonas ambientales y riesgos por region',
    path: '/mapa-riesgos',
    keywords: 'mapa riesgos zonas regiones ambiental leaflet',
  },
  {
    title: 'Videojuego',
    description: 'EcoGuard ODS, misiones y ranking',
    path: '/videojuego',
    keywords: 'juego videojuego ecoguard canvas misiones ranking puntos',
  },
  {
    title: 'Biblioteca ODS',
    description: 'Temas, fuentes oficiales y acciones educativas',
    path: '/biblioteca',
    keywords: 'biblioteca ods fuentes temas educacion agua clima consumo ecosistemas',
  },
  {
    title: 'Perfil',
    description: 'Nivel, puntos, insignias y progreso personal',
    path: '/perfil',
    keywords: 'perfil usuario puntos nivel insignias progreso',
  },
  {
    title: 'Reportes',
    description: 'Impacto ODS, hallazgos y recomendaciones',
    path: '/reportes',
    keywords: 'reportes impacto hallazgos recomendaciones descargar compartir',
  },
]

function Navbar({ onMenuClick }) {
  const navigate = useNavigate()
  const { displayName, logout } = useAuth()
  const { enabled, play, toggleSound } = useAudio()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const searchResults = quickSearchItems.filter((item) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return false

    return [item.title, item.description, item.keywords]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })

  function handleToggleSound() {
    toggleSound()
    if (!enabled) {
      window.setTimeout(() => play('toggle'), 0)
    }
  }

  function goToSearchResult(item) {
    play('click')
    setSearchTerm('')
    navigate(item.path)
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
    const [firstResult] = searchResults

    if (firstResult) {
      goToSearchResult(firstResult)
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => {
            play('click')
            onMenuClick()
          }}
          className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/5 text-white lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden sm:block lg:hidden">
          <Logo compact />
        </div>

        <form onSubmit={handleSearchSubmit} className="relative hidden w-full max-w-md sm:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-12 w-full rounded-lg border border-white/10 bg-slate-950/60 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-4 focus:ring-emerald-400/10"
            placeholder="Buscar seccion..."
            type="search"
          />
          {searchTerm.trim() && (
            <div className="absolute left-0 right-0 top-14 z-40 overflow-hidden rounded-lg border border-white/10 bg-slate-950/95 shadow-2xl shadow-emerald-950/35 backdrop-blur-xl">
              {searchResults.length > 0 ? (
                searchResults.slice(0, 5).map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => goToSearchResult(item)}
                    className="block w-full border-b border-white/10 px-4 py-3 text-left transition last:border-b-0 hover:bg-emerald-400/10"
                  >
                    <span className="block text-sm font-black text-white">{item.title}</span>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-slate-400">
                      {item.description}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm font-semibold text-slate-400">
                  No se encontro una seccion con ese nombre.
                </div>
              )}
            </div>
          )}
        </form>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleSound}
            className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:text-white"
            aria-label={enabled ? 'Desactivar sonido' : 'Activar sonido'}
            title={enabled ? 'Sonido activado' : 'Sonido desactivado'}
          >
            {enabled ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                play('click')
                setNotificationsOpen((current) => !current)
              }}
              className="relative grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:text-white"
              aria-label="Ver notificaciones"
            >
              <Bell className="size-5" />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-emerald-400 text-xs font-black text-emerald-950">
                3
              </span>
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 rounded-lg border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl">
                <p className="text-sm font-black text-white">Notificaciones</p>
                <div className="mt-3 space-y-2">
                  {[
                    'Nuevo contenido disponible en Biblioteca ODS.',
                    'Tu ranking EcoGuard puede actualizarse en tiempo real.',
                    'Revisa los reportes de impacto para ver recomendaciones.',
                  ].map((item) => (
                    <p
                      key={item}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold leading-5 text-slate-300"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              play('success')
              navigate('/videojuego')
            }}
            className="hidden size-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:text-white sm:grid"
            aria-label="Ver ranking del videojuego"
            title="Ver EcoGuard ODS"
          >
            <Trophy className="size-5" />
          </button>
          <div className="flex items-center gap-3 border-l border-white/10 pl-3">
            <button
              type="button"
              onClick={() => {
                play('click')
                navigate('/perfil')
              }}
              className="flex items-center gap-3 rounded-lg px-2 py-1 text-left transition hover:bg-white/5"
              aria-label="Ver perfil"
            >
            <div className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-emerald-300 to-sky-300 text-emerald-950">
              <UserRound className="size-6" />
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-bold text-white">{displayName}</p>
              <p className="text-xs font-semibold text-lime-300">Nivel 3</p>
            </div>
            <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
            </button>
            <button
              type="button"
              onClick={() => {
                play('warning')
                logout()
              }}
              className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-red-300/30 hover:bg-red-400/10 hover:text-red-100"
              aria-label="Cerrar sesion"
              title="Cerrar sesion"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
