import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Droplets,
  FileText,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  Leaf,
  MapPin,
  Recycle,
  ShieldCheck,
  Target,
  Trees,
  User,
  Users,
} from 'lucide-react'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import ModuleCard from '../components/ui/ModuleCard'
import ProgressBar from '../components/ui/ProgressBar'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../hooks/useAuth'
import { getIndicadoresOds } from '../services/dashboardService'
import { getUserProfile, upsertUserProfile } from '../services/profileService'

const modules = [
  {
    title: 'Dashboard',
    description: 'Indicadores ambientales, metricas ODS y graficos dinamicos.',
    icon: BarChart3,
    to: '/dashboard',
    tone: 'emerald',
  },
  {
    title: 'Mapa de Riesgos',
    description: 'Zonas georreferenciadas con niveles de riesgo ambiental.',
    icon: MapPin,
    to: '/mapa-riesgos',
    tone: 'sky',
  },
  {
    title: 'Videojuego',
    description: 'EcoGuard ODS con Canvas, puntaje, vidas y preguntas.',
    icon: Gamepad2,
    to: '/videojuego',
    tone: 'amber',
  },
  {
    title: 'Biblioteca ODS',
    description: 'Recursos educativos sobre sostenibilidad y accion ambiental.',
    icon: BookOpen,
    to: '/biblioteca',
    tone: 'emerald',
  },
  {
    title: 'Perfil',
    description: 'Progreso, insignias, actividad y nivel del usuario.',
    icon: User,
    to: '/perfil',
    tone: 'cyan',
  },
  {
    title: 'Reportes',
    description: 'Hallazgos, recomendaciones y avance de impacto.',
    icon: FileText,
    to: '/reportes',
    tone: 'sky',
  },
]

const demoProfile = {
  nombre: 'Yair',
  nivel: 'Guardian Ambiental',
  puntos_totales: 1250,
  progreso_ods: 82,
}

const demoIndicadores = [
  {
    id: 'demo-13',
    ods_numero: 13,
    titulo: 'Accion climatica',
    valor: 82,
    unidad: '%',
    tendencia: '+6% vs. mes anterior',
  },
  {
    id: 'demo-12',
    ods_numero: 12,
    titulo: 'Consumo responsable',
    valor: 64,
    unidad: '%',
    tendencia: '+12% vs. mes anterior',
  },
  {
    id: 'demo-6',
    ods_numero: 6,
    titulo: 'Agua limpia monitoreada',
    valor: 70,
    unidad: '%',
    tendencia: '+5% vs. mes anterior',
  },
]

const iconByOds = {
  4: GraduationCap,
  6: Droplets,
  11: MapPin,
  12: Recycle,
  13: Leaf,
  15: Trees,
}

const rotatingPhrases = [
  'Aprende acciones sostenibles que puedes aplicar en tu colegio o comunidad.',
  'Explora datos, juega misiones y entiende por que los ODS importan.',
  'La educacion ambiental funciona mejor cuando tambien se practica.',
]

const actionRibbon = [
  'Separar residuos',
  'Cuidar el agua',
  'Reducir humo',
  'Plantar arboles',
  'Aprender ODS',
  'Compartir buenas practicas',
  'Medir participacion',
  'Actuar en comunidad',
]

const socialImpactCards = [
  {
    title: 'Educa con interaccion',
    description: 'Convierte los ODS en una experiencia visual, sencilla y cercana para estudiantes.',
    icon: GraduationCap,
    tone: 'text-sky-200 bg-sky-400/10 border-sky-300/25',
  },
  {
    title: 'Motiva habitos reales',
    description: 'Refuerza acciones como reciclar, cuidar agua, evitar humo y proteger areas verdes.',
    icon: HeartHandshake,
    tone: 'text-lime-200 bg-lime-400/10 border-lime-300/25',
  },
  {
    title: 'Mide participacion',
    description: 'Usa puntos, niveles, reportes y ranking para visualizar avance educativo.',
    icon: Target,
    tone: 'text-amber-200 bg-amber-400/10 border-amber-300/25',
  },
  {
    title: 'Apoya talleres',
    description: 'Puede usarse en clases, ferias ambientales y actividades de sensibilizacion.',
    icon: Users,
    tone: 'text-emerald-200 bg-emerald-400/10 border-emerald-300/25',
  },
]

const impactStats = [
  ['6', 'ODS trabajados', 'Educacion, agua, ciudades, consumo, clima y ecosistemas'],
  ['4', 'modos de aprender', 'Datos, mapa, biblioteca y videojuego Canvas'],
  ['100%', 'enfoque multimedia', 'Animaciones, sonidos, interaccion y gamificacion'],
]

const taughtActions = [
  { label: 'Reciclar residuos', icon: Recycle, ods: 'ODS 12' },
  { label: 'Cuidar el agua', icon: Droplets, ods: 'ODS 6' },
  { label: 'Evitar contaminacion', icon: ShieldCheck, ods: 'ODS 13' },
  { label: 'Proteger ecosistemas', icon: Trees, ods: 'ODS 15' },
]

const floatingTokens = [
  { icon: Droplets, label: 'ODS 6', className: 'left-[64%] top-[18%] animation-delay-0' },
  { icon: Recycle, label: 'ODS 12', className: 'left-[82%] top-[46%] animation-delay-2' },
  { icon: Trees, label: 'ODS 15', className: 'left-[56%] top-[66%] animation-delay-4' },
]

function getLevelNumber(level) {
  if (!level) return 1
  if (level.includes('EcoLider')) return 5
  if (level.includes('Defensor') || level.includes('Auditor')) return 4
  if (level.includes('Guardian')) return 3
  if (level.includes('Reciclador')) return 2
  return 1
}

function isMissingProfile(error) {
  return error?.code === 'PGRST116' || error?.message?.includes('JSON object requested')
}

async function loadProfile(user) {
  try {
    return await getUserProfile(user.id)
  } catch (error) {
    if (!isMissingProfile(error)) {
      throw error
    }

    return upsertUserProfile({
      user_id: user.id,
      nombre: user.user_metadata?.nombre || user.email?.split('@')[0] || 'EcoUsuario',
      nivel: 'Aprendiz Sostenible',
      puntos_totales: 0,
      progreso_ods: 0,
    })
  }
}

function Inicio() {
  const { isDemoMode, isSupabaseConfigured, user } = useAuth()
  const [profile, setProfile] = useState(isDemoMode ? demoProfile : null)
  const [indicadores, setIndicadores] = useState(isDemoMode ? demoIndicadores : [])
  const [loading, setLoading] = useState(!isDemoMode)
  const [error, setError] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % rotatingPhrases.length)
    }, 4200)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    let mounted = true

    async function loadInicioData() {
      if (isDemoMode) {
        setProfile(demoProfile)
        setIndicadores(demoIndicadores)
        setLoading(false)
        setError('')
        return
      }

      if (!user || !isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        setError('')
        const [nextProfile, nextIndicadores] = await Promise.all([
          loadProfile(user),
          getIndicadoresOds(),
        ])

        if (!mounted) return
        setProfile(nextProfile)
        setIndicadores(nextIndicadores)
      } catch (loadError) {
        if (!mounted) return
        setError(loadError.message || 'No se pudo cargar el inicio.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadInicioData()

    return () => {
      mounted = false
    }
  }, [isDemoMode, isSupabaseConfigured, user])

  const summaryIndicators = useMemo(() => indicadores.slice(0, 3), [indicadores])
  const safeProfile = profile || demoProfile
  const progress = Number(safeProfile.progreso_ods) || 0
  const levelNumber = getLevelNumber(safeProfile.nivel)

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-lg border border-lime-100/10 bg-[linear-gradient(135deg,rgba(28,74,62,0.96),rgba(20,62,74,0.9)),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:auto,56px_56px,56px_56px] p-6 shadow-2xl sm:p-8"
      >
        <div className="absolute inset-0 opacity-50">
          <div className="impact-scanline" />
        </div>
        {floatingTokens.map(({ icon: Icon, label, className }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={[
              'absolute hidden rounded-lg border border-white/10 bg-slate-950/45 px-3 py-2 text-xs font-black text-emerald-100 shadow-xl shadow-emerald-950/20 backdrop-blur md:flex md:items-center md:gap-2 animate-float-slow',
              className,
            ].join(' ')}
          >
            <Icon className="size-4 text-lime-300" />
            {label}
          </motion.div>
        ))}

        <div className="relative max-w-3xl">
          <Badge icon={Leaf}>{safeProfile.nivel}</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-normal text-white sm:text-5xl">
            Aprende ODS con acciones para tu comunidad
          </h1>
          <motion.p
            key={phraseIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-4 max-w-2xl text-base leading-7 text-slate-300"
          >
            {rotatingPhrases[phraseIndex]}
          </motion.p>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-emerald-100">
            Hola, {safeProfile.nombre}. EcoSafe ODS ayuda a explicar sostenibilidad con
            actividades visuales: datos, mapa, biblioteca, reportes y un juego que enseña
            habitos ambientales simples.
          </p>
          <ProgressBar className="mt-8 max-w-xl" label="Progreso ODS" value={progress} />
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#impacto-social"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-300/25 bg-emerald-400/15 px-4 text-sm font-black text-emerald-50 transition hover:border-emerald-200/60 hover:bg-emerald-300/20"
            >
              Ver contribucion social
              <ArrowRight className="size-4" />
            </a>
            <Link
              to="/videojuego"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-amber-300/25 bg-amber-400/10 px-4 text-sm font-black text-amber-50 transition hover:border-amber-200/60 hover:bg-amber-300/20"
            >
              Aprender jugando
              <Gamepad2 className="size-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="overflow-hidden rounded-lg border border-emerald-300/15 bg-slate-950/45 py-3">
        <div className="animate-marquee flex w-max gap-6 text-sm font-black uppercase text-emerald-100">
          {[...actionRibbon, ...actionRibbon].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-3">
              <Leaf className="size-4 text-lime-300" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <Card className="border-amber-300/30 bg-amber-400/10">
          <p className="text-sm font-semibold leading-6 text-amber-100">
            No se pudo cargar toda la data de Inicio: {error}
          </p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Leaf}
          label="Puntos totales"
          value={safeProfile.puntos_totales}
          meta={loading ? 'Cargando datos...' : 'Datos del perfil'}
        />
        <StatCard
          icon={User}
          label="Nivel actual"
          value={levelNumber}
          meta={safeProfile.nivel}
          tone="sky"
        />
        <StatCard
          icon={BarChart3}
          label="Avance ODS"
          value={progress}
          suffix="%"
          meta={loading ? 'Sincronizando...' : 'Perfil conectado'}
          progress={progress}
          tone="lime"
        />
      </div>

      <section id="impacto-social" className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute -right-10 -top-10 size-36 rounded-full bg-lime-300/10 blur-2xl" />
          <div className="relative">
            <Badge icon={HeartHandshake}>Contribucion social</Badge>
            <h2 className="mt-4 text-2xl font-black tracking-normal text-white">
              EcoSafe ODS sirve como apoyo educativo para hablar de sostenibilidad.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              El proyecto organiza informacion y actividades para que estudiantes entiendan
              mejor como acciones cotidianas pueden ayudar al agua, al clima, a las ciudades
              y a los ecosistemas.
            </p>
            <div className="mt-5 grid gap-3">
              {impactStats.map(([value, label, description]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="text-3xl font-black tracking-normal text-lime-300">{value}</p>
                  <p className="mt-1 text-sm font-black text-white">{label}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {socialImpactCards.map(({ title, description, icon: Icon, tone }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="glass-panel rounded-lg p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/35"
            >
              <div className={['grid size-12 place-items-center rounded-lg border', tone].join(' ')}>
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-black tracking-normal text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="glass-panel overflow-hidden rounded-lg p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge icon={Activity}>Acciones que enseña</Badge>
            <h2 className="mt-3 text-2xl font-black tracking-normal text-white">
              De la pantalla a la vida diaria
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Cada modulo refuerza una accion sencilla que puede convertirse en habito:
            aprender, reciclar, cuidar recursos y proteger el entorno.
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {taughtActions.map(({ label, icon: Icon, ods }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-sky-300 to-amber-300 opacity-60 transition group-hover:opacity-100" />
              <Icon className="size-8 text-emerald-200" />
              <p className="mt-4 text-sm font-black text-white">{label}</p>
              <p className="mt-1 text-xs font-black uppercase text-lime-300">{ods}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {summaryIndicators.map((indicator) => {
          const Icon = iconByOds[indicator.ods_numero] || Leaf

          return (
            <Card key={indicator.id} className="animate-fade-rise">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="sky">ODS {indicator.ods_numero}</Badge>
                  <h2 className="mt-4 text-xl font-black tracking-normal text-white">
                    {indicator.titulo}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-lime-300">
                    {indicator.tendencia || 'Indicador actualizado'}
                  </p>
                </div>
                <div className="grid size-12 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-400/10 text-emerald-200">
                  <Icon className="size-7" />
                </div>
              </div>
              <ProgressBar
                className="mt-5"
                label={`${Math.round(Number(indicator.valor) || 0)}${indicator.unidad || ''}`}
                value={Number(indicator.valor) || 0}
              />
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {modules.map((module) => (
          <ModuleCard key={module.title} {...module} />
        ))}
      </div>
    </section>
  )
}

export default Inicio
