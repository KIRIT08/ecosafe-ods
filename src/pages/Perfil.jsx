import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Award,
  Gamepad2,
  Lock,
  Medal,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserRound,
} from 'lucide-react'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import { useAuth } from '../hooks/useAuth'
import {
  getAvailableBadges,
  getLastScore,
  getUserActivity,
  getUserBadges,
  getUserProfile,
  getUserScores,
  upsertUserProfile,
} from '../services/profileService'

const demoProfile = {
  user_id: 'demo-user',
  nombre: 'Yair',
  nivel: 'Guardian Ambiental',
  puntos_totales: 1250,
  progreso_ods: 82,
  ods_favoritos: [6, 11, 12, 13, 15],
}

const demoScores = [
  { id: 'score-1', puntaje: 360, nivel_alcanzado: 5, vidas_restantes: 2, created_at: '2026-06-07' },
  { id: 'score-2', puntaje: 280, nivel_alcanzado: 4, vidas_restantes: 1, created_at: '2026-06-06' },
  { id: 'score-3', puntaje: 190, nivel_alcanzado: 3, vidas_restantes: 3, created_at: '2026-06-05' },
]

const demoBadges = [
  {
    id: 'ub-1',
    insignias: {
      id: 'badge-1',
      nombre: 'Explorador ODS',
      descripcion: 'Conoce los primeros objetivos sostenibles.',
      color: '#38bdf8',
      puntos_requeridos: 0,
      ods_numero: 4,
    },
  },
  {
    id: 'ub-2',
    insignias: {
      id: 'badge-2',
      nombre: 'Guardian del Agua',
      descripcion: 'Impulsa acciones sobre agua limpia.',
      color: '#22c55e',
      puntos_requeridos: 150,
      ods_numero: 6,
    },
  },
  {
    id: 'ub-3',
    insignias: {
      id: 'badge-3',
      nombre: 'Reciclador Responsable',
      descripcion: 'Recolecta y separa residuos correctamente.',
      color: '#86efac',
      puntos_requeridos: 450,
      ods_numero: 12,
    },
  },
]

const demoAvailableBadges = [
  ...demoBadges.map((item) => item.insignias),
  {
    id: 'badge-4',
    nombre: 'Defensor del Clima',
    descripcion: 'Completa retos de accion climatica.',
    color: '#22c55e',
    puntos_requeridos: 650,
    ods_numero: 13,
  },
  {
    id: 'badge-5',
    nombre: 'Protector de Ecosistemas',
    descripcion: 'Cuida bosques y biodiversidad.',
    color: '#14b8a6',
    puntos_requeridos: 850,
    ods_numero: 15,
  },
]

const demoActivity = [
  {
    id: 'act-1',
    tipo: 'videojuego',
    descripcion: 'Completaste una mision EcoGuard ODS.',
    puntos: 360,
    ods_numero: 12,
    created_at: '2026-06-07',
  },
  {
    id: 'act-2',
    tipo: 'biblioteca',
    descripcion: 'Revisaste contenidos de agua limpia.',
    puntos: 20,
    ods_numero: 6,
    created_at: '2026-06-06',
  },
  {
    id: 'act-3',
    tipo: 'mapa',
    descripcion: 'Exploraste zonas de riesgo ambiental.',
    puntos: 15,
    ods_numero: 13,
    created_at: '2026-06-05',
  },
]

const levelThresholds = [
  { name: 'Aprendiz Sostenible', min: 0 },
  { name: 'Reciclador Responsable', min: 300 },
  { name: 'Guardian Ambiental', min: 700 },
  { name: 'Auditor de Impacto', min: 1200 },
  { name: 'EcoLider ODS', min: 1800 },
]

function isMissingProfile(error) {
  return error?.code === 'PGRST116' || error?.message?.includes('JSON object requested')
}

async function loadProfile(user) {
  try {
    return await getUserProfile(user.id)
  } catch (error) {
    if (!isMissingProfile(error)) throw error

    return upsertUserProfile({
      user_id: user.id,
      nombre: user.user_metadata?.nombre || user.email?.split('@')[0] || 'EcoUsuario',
      nivel: 'Aprendiz Sostenible',
      puntos_totales: 0,
      progreso_ods: 0,
    })
  }
}

function getLevelProgress(points) {
  const currentIndex = levelThresholds.findLastIndex((level) => points >= level.min)
  const current = levelThresholds[Math.max(0, currentIndex)]
  const next = levelThresholds[currentIndex + 1]

  if (!next) {
    return { current, next: null, progress: 100, remaining: 0 }
  }

  const progress = ((points - current.min) / (next.min - current.min)) * 100
  return {
    current,
    next,
    progress: Math.min(100, Math.max(0, progress)),
    remaining: Math.max(0, next.min - points),
  }
}

function formatDate(date) {
  if (!date) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(date))
}

function Perfil() {
  const { isDemoMode, isSupabaseConfigured, user } = useAuth()
  const [profile, setProfile] = useState(isDemoMode ? demoProfile : null)
  const [scores, setScores] = useState(isDemoMode ? demoScores : [])
  const [lastScore, setLastScore] = useState(isDemoMode ? demoScores[0] : null)
  const [userBadges, setUserBadges] = useState(isDemoMode ? demoBadges : [])
  const [availableBadges, setAvailableBadges] = useState(isDemoMode ? demoAvailableBadges : [])
  const [activity, setActivity] = useState(isDemoMode ? demoActivity : [])
  const [loading, setLoading] = useState(!isDemoMode)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadProfileData() {
      if (isDemoMode) {
        setProfile(demoProfile)
        setScores(demoScores)
        setLastScore(demoScores[0])
        setUserBadges(demoBadges)
        setAvailableBadges(demoAvailableBadges)
        setActivity(demoActivity)
        setLoading(false)
        setError('')
        return
      }

      if (!user || !isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const [nextProfile, nextScores, nextLastScore, nextBadges, nextAvailable, nextActivity] =
          await Promise.all([
            loadProfile(user),
            getUserScores(user.id),
            getLastScore(user.id),
            getUserBadges(user.id),
            getAvailableBadges(),
            getUserActivity(user.id),
          ])

        if (!mounted) return
        setProfile(nextProfile)
        setScores(nextScores)
        setLastScore(nextLastScore)
        setUserBadges(nextBadges)
        setAvailableBadges(nextAvailable)
        setActivity(nextActivity)
      } catch (loadError) {
        if (!mounted) return
        setError(loadError.message || 'No se pudo cargar el perfil.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProfileData()

    return () => {
      mounted = false
    }
  }, [isDemoMode, isSupabaseConfigured, user])

  const safeProfile = profile || demoProfile
  const points = Number(safeProfile.puntos_totales) || 0
  const odsProgress = Number(safeProfile.progreso_ods) || 0
  const bestScore = useMemo(
    () => scores.reduce((best, score) => Math.max(best, Number(score.puntaje) || 0), 0),
    [scores],
  )
  const levelProgress = useMemo(() => getLevelProgress(points), [points])
  const earnedBadgeIds = useMemo(
    () => new Set(userBadges.map((item) => item.insignias?.id).filter(Boolean)),
    [userBadges],
  )
  const badgeGrid = useMemo(() => {
    const knownBadges = availableBadges.length
      ? availableBadges
      : userBadges.map((item) => item.insignias).filter(Boolean)

    return knownBadges.map((badge) => ({
      ...badge,
      earned: earnedBadgeIds.has(badge.id) || points >= Number(badge.puntos_requeridos || 0),
    }))
  }, [availableBadges, earnedBadgeIds, points, userBadges])

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge icon={UserRound}>Perfil gamificado</Badge>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-white">
            Perfil del Usuario
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Progreso, puntos, insignias y actividad reciente conectados al avance ODS.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300">
          {loading ? 'Actualizando perfil...' : isDemoMode ? 'Modo demo visual' : 'Perfil actualizado'}
        </div>
      </header>

      {error && (
        <Card className="border-amber-300/30 bg-amber-400/10">
          <p className="text-sm font-semibold leading-6 text-amber-100">
            No se pudo cargar todo el perfil: {error}
          </p>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_1.1fr]">
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden rounded-lg p-6"
        >
          <div className="flex flex-wrap items-center gap-5">
            <div className="relative grid size-28 place-items-center rounded-full bg-gradient-to-br from-emerald-300 via-lime-200 to-sky-300 text-emerald-950 shadow-xl shadow-emerald-950/30">
              <UserRound className="size-16" />
              <span className="absolute -bottom-2 rounded-lg border border-lime-300/40 bg-slate-950 px-3 py-1 text-xs font-black text-lime-200">
                ODS
              </span>
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-normal text-white">{safeProfile.nombre}</h2>
              <p className="mt-2 text-xl font-bold text-lime-300">{safeProfile.nivel}</p>
              <p className="mt-2 inline-flex rounded-lg bg-emerald-400/15 px-4 py-2 font-black text-emerald-200">
                {levelProgress.current.name}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <ProgressBar label="Progreso ODS" value={odsProgress} />
            <ProgressBar
              label={
                levelProgress.next
                  ? `Camino a ${levelProgress.next.name}`
                  : 'Nivel maximo alcanzado'
              }
              value={levelProgress.progress}
            />
            {levelProgress.next && (
              <p className="text-sm font-semibold text-slate-400">
                Faltan {levelProgress.remaining} puntos para el siguiente nivel.
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { value: points, label: 'Puntos totales', icon: Star, tone: 'text-lime-300' },
              { value: scores.length, label: 'Partidas jugadas', icon: Gamepad2, tone: 'text-sky-300' },
              { value: bestScore, label: 'Mejor puntaje', icon: Trophy, tone: 'text-amber-300' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <item.icon className={`mb-3 size-7 ${item.tone}`} />
                <p className="text-2xl font-black text-white">
                  <AnimatedCounter value={item.value} />
                </p>
                <p className="text-sm text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-panel rounded-lg p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge icon={Award}>Insignias</Badge>
              <h2 className="mt-3 text-xl font-black tracking-normal text-white">
                Logros sostenibles
              </h2>
            </div>
            <p className="text-sm font-black text-lime-300">
              {badgeGrid.filter((badge) => badge.earned).length}/{badgeGrid.length}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {badgeGrid.map((badge) => (
              <div
                key={badge.id}
                className={[
                  'min-h-36 rounded-lg border p-4 text-center transition duration-300',
                  badge.earned
                    ? 'border-lime-300/30 bg-lime-400/10 shadow-lg shadow-lime-950/20'
                    : 'border-white/10 bg-white/5 opacity-70',
                ].join(' ')}
              >
                <div
                  className="mx-auto grid size-12 place-items-center rounded-lg border border-white/10"
                  style={{ backgroundColor: `${badge.color || '#22c55e'}22` }}
                >
                  {badge.earned ? (
                    <Award className="size-7 text-lime-300" />
                  ) : (
                    <Lock className="size-7 text-slate-500" />
                  )}
                </div>
                <p className="mt-3 text-sm font-black text-white">{badge.nombre}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {badge.earned ? `ODS ${badge.ods_numero || '-'}` : `${badge.puntos_requeridos} pts`}
                </p>
              </div>
            ))}
          </div>
        </motion.article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <Badge icon={Medal}>Ultima partida</Badge>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold text-slate-400">Puntaje</p>
              <p className="mt-2 text-3xl font-black text-lime-300">
                <AnimatedCounter value={lastScore?.puntaje || 0} />
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold text-slate-400">Nivel</p>
              <p className="mt-2 text-3xl font-black text-amber-300">
                {lastScore?.nivel_alcanzado || 0}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold text-slate-400">Vidas</p>
              <p className="mt-2 text-3xl font-black text-sky-300">
                {lastScore?.vidas_restantes ?? 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <Badge icon={Activity}>Actividad reciente</Badge>
          <div className="mt-5 space-y-3">
            {activity.length > 0 ? (
              activity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-lg bg-emerald-400/10 text-emerald-200">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{item.descripcion}</p>
                      <p className="text-xs font-semibold text-slate-500">
                        ODS {item.ods_numero || '-'} - {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-lime-300">+{item.puntos}</p>
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-semibold text-slate-400">
                Aun no hay actividad registrada. Juega una partida para empezar.
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <Badge icon={ShieldCheck}>ODS favoritos</Badge>
        <div className="mt-5 flex flex-wrap gap-3">
          {(safeProfile.ods_favoritos || [4, 6, 11, 12, 13, 15]).map((ods) => (
            <span
              key={ods}
              className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-black text-emerald-100"
            >
              ODS {ods}
            </span>
          ))}
        </div>
      </Card>
    </section>
  )
}

export default Perfil
