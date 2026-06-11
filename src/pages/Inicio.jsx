import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  Droplets,
  FileText,
  Gamepad2,
  GraduationCap,
  Leaf,
  MapPin,
  Recycle,
  Trees,
  User,
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
  'Cada decision sostenible suma al futuro que queremos construir.',
  'Aprender sobre los ODS tambien es una forma de actuar.',
  'La sostenibilidad empieza con acciones pequenas y constantes.',
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
        className="overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_75%_20%,rgba(134,239,172,0.22),transparent_22rem),linear-gradient(135deg,rgba(15,42,53,0.95),rgba(6,24,38,0.84))] p-6 shadow-2xl sm:p-8"
      >
        <div className="max-w-3xl">
          <Badge icon={Leaf}>{safeProfile.nivel}</Badge>
          <h1 className="mt-4 text-4xl font-black tracking-normal text-white sm:text-5xl">
            Bienvenido, {safeProfile.nombre}
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
          <ProgressBar className="mt-8 max-w-xl" label="Progreso ODS" value={progress} />
        </div>
      </motion.div>

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
