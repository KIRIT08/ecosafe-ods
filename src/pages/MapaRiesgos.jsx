import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, MapPinned } from 'lucide-react'
import RiskMap from '../components/map/RiskMap'
import RiskSummaryPanel from '../components/map/RiskSummaryPanel'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { getZonasRiesgo } from '../services/mapService'

const demoZones = [
  {
    id: 'demo-piura',
    region: 'Piura',
    latitud: -5.1945,
    longitud: -80.6328,
    nivel_riesgo: 'Medio',
    tipo_riesgo: 'Residuos solidos',
    ods_relacionados: [11, 12],
    descripcion: 'Aumento de residuos urbanos y puntos criticos de acumulacion.',
    recomendacion: 'Fortalecer segregacion, rutas de reciclaje y educacion comunitaria.',
    fecha_actualizacion: '2026-06-07',
  },
  {
    id: 'demo-lima',
    region: 'Lima',
    latitud: -12.0464,
    longitud: -77.0428,
    nivel_riesgo: 'Alto',
    tipo_riesgo: 'Emisiones urbanas',
    ods_relacionados: [11, 13],
    descripcion: 'Alta concentracion de emisiones por transporte y actividad urbana.',
    recomendacion: 'Promover movilidad sostenible y monitoreo de calidad del aire.',
    fecha_actualizacion: '2026-06-07',
  },
  {
    id: 'demo-loreto',
    region: 'Loreto',
    latitud: -3.7491,
    longitud: -73.2538,
    nivel_riesgo: 'Alto',
    tipo_riesgo: 'Deforestacion y agua',
    ods_relacionados: [6, 13, 15],
    descripcion: 'Riesgo por perdida de cobertura vegetal y contaminacion de cuencas.',
    recomendacion: 'Impulsar vigilancia ambiental y restauracion de ecosistemas.',
    fecha_actualizacion: '2026-06-07',
  },
  {
    id: 'demo-cusco',
    region: 'Cusco',
    latitud: -13.5319,
    longitud: -71.9675,
    nivel_riesgo: 'Bajo',
    tipo_riesgo: 'Turismo ambiental',
    ods_relacionados: [11, 15],
    descripcion: 'Zonas con turismo monitoreado y acciones de conservacion.',
    recomendacion: 'Mantener buenas practicas y educacion al visitante.',
    fecha_actualizacion: '2026-06-07',
  },
  {
    id: 'demo-arequipa',
    region: 'Arequipa',
    latitud: -16.409,
    longitud: -71.5375,
    nivel_riesgo: 'Medio',
    tipo_riesgo: 'Consumo de agua',
    ods_relacionados: [6, 12],
    descripcion: 'Presion sobre recursos hidricos por consumo urbano y productivo.',
    recomendacion: 'Reforzar ahorro de agua y medicion comunitaria.',
    fecha_actualizacion: '2026-06-07',
  },
  {
    id: 'demo-puno',
    region: 'Puno',
    latitud: -15.8402,
    longitud: -70.0219,
    nivel_riesgo: 'Bajo',
    tipo_riesgo: 'Conservacion natural',
    ods_relacionados: [6, 15],
    descripcion: 'Ecosistemas altoandinos con acciones de cuidado ambiental.',
    recomendacion: 'Sostener monitoreo ciudadano y educacion ambiental.',
    fecha_actualizacion: '2026-06-07',
  },
]

function normalizeZones(zones) {
  return zones
    .filter((zone) => zone.latitud && zone.longitud)
    .map((zone) => ({
      ...zone,
      latitud: Number(zone.latitud),
      longitud: Number(zone.longitud),
      ods_relacionados: zone.ods_relacionados || [],
    }))
}

function MapaRiesgos() {
  const { isDemoMode, isSupabaseConfigured } = useAuth()
  const [zones, setZones] = useState(isDemoMode ? demoZones : [])
  const [loading, setLoading] = useState(!isDemoMode)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadZones() {
      if (isDemoMode) {
        setZones(demoZones)
        setLoading(false)
        setError('')
        return
      }

      if (!isSupabaseConfigured) {
        setLoading(false)
        setError('No se pudo conectar con los datos del mapa.')
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await getZonasRiesgo()

        if (!mounted) return
        setZones(normalizeZones(data))
      } catch (loadError) {
        if (!mounted) return
        setError(loadError.message || 'No se pudo cargar el mapa.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadZones()

    return () => {
      mounted = false
    }
  }, [isDemoMode, isSupabaseConfigured])

  const safeZones = useMemo(
    () => (zones.length ? normalizeZones(zones) : isDemoMode ? demoZones : []),
    [isDemoMode, zones],
  )

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <div className="space-y-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge icon={Leaf}>Gestion ambiental ODS</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-normal text-white">
              Mapa de Riesgos
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Visualiza y monitorea regiones con riesgos ambientales simulados.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300">
            {loading ? 'Cargando mapa...' : isDemoMode ? 'Modo demo visual' : 'Datos actualizados'}
          </div>
        </header>

        {error && (
          <Card className="border-amber-300/30 bg-amber-400/10">
            <p className="text-sm font-semibold leading-6 text-amber-100">
              No se pudo cargar toda la data del mapa: {error}
            </p>
          </Card>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="glass-panel relative overflow-hidden rounded-lg p-5"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,197,94,0.18),transparent_18rem),linear-gradient(145deg,rgba(14,116,144,0.14),rgba(6,24,38,0.08))]" />
          <div className="relative">
            <RiskMap zones={safeZones} />
          </div>
          <div className="relative mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/45 px-4 py-3 text-xs font-medium leading-5 text-slate-400">
            <MapPinned className="size-4 shrink-0 text-emerald-300" />
            Los niveles de riesgo se muestran con fines educativos y se alimentan desde la
            tabla de zonas ambientales.
          </div>
        </motion.div>
      </div>

      <RiskSummaryPanel zones={safeZones} />
    </section>
  )
}

export default MapaRiesgos
