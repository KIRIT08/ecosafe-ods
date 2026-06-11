import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, BarChart3, Droplets, Leaf, Recycle, ShieldCheck, Trees } from 'lucide-react'
import BarChart from '../components/charts/BarChart'
import ChartPanel from '../components/charts/ChartPanel'
import DoughnutChart from '../components/charts/DoughnutChart'
import LineChart from '../components/charts/LineChart'
import RadarChart from '../components/charts/RadarChart'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../hooks/useAuth'
import { getDashboardData } from '../services/dashboardService'

const demoDashboardData = {
  indicadoresOds: [
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
      id: 'demo-11',
      ods_numero: 11,
      titulo: 'Zonas evaluadas',
      valor: 24,
      unidad: 'zonas',
      tendencia: '+3 nuevas zonas',
    },
    {
      id: 'demo-15',
      ods_numero: 15,
      titulo: 'Ecosistemas protegidos',
      valor: 63,
      unidad: 'areas',
      tendencia: '+4 areas',
    },
  ],
  metricasMensuales: [
    { mes: 'Ene', valor: 58 },
    { mes: 'Feb', valor: 63 },
    { mes: 'Mar', valor: 66 },
    { mes: 'Abr', valor: 71 },
    { mes: 'May', valor: 74 },
    { mes: 'Jun', valor: 82 },
  ],
  tiposResiduos: [
    { tipo: 'Reciclable', porcentaje: 46, color: '#22c55e' },
    { tipo: 'Organico', porcentaje: 28, color: '#84cc16' },
    { tipo: 'Peligroso', porcentaje: 16, color: '#f97316' },
    { tipo: 'No peligroso', porcentaje: 10, color: '#86efac' },
  ],
  emisionesMensuales: [
    { mes: 'Ene', toneladas: 38 },
    { mes: 'Feb', toneladas: 45 },
    { mes: 'Mar', toneladas: 42 },
    { mes: 'Abr', toneladas: 36 },
    { mes: 'May', toneladas: 33 },
    { mes: 'Jun', toneladas: 31 },
  ],
  indicadoresRadar: [
    { indicador: 'Educacion', valor: 78 },
    { indicador: 'Agua', valor: 70 },
    { indicador: 'Ciudades', valor: 72 },
    { indicador: 'Residuos', valor: 75 },
    { indicador: 'Clima', valor: 82 },
    { indicador: 'Ecosistemas', valor: 68 },
  ],
}

const iconByOds = {
  6: Droplets,
  11: Activity,
  12: Recycle,
  13: Leaf,
  15: Trees,
}

function pickIndicator(indicadores, predicate, fallbackIndex = 0) {
  return indicadores.find(predicate) || indicadores[fallbackIndex]
}

function Dashboard() {
  const { isDemoMode, isSupabaseConfigured } = useAuth()
  const [dashboardData, setDashboardData] = useState(isDemoMode ? demoDashboardData : null)
  const [loading, setLoading] = useState(!isDemoMode)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadDashboard() {
      if (isDemoMode) {
        setDashboardData(demoDashboardData)
        setLoading(false)
        setError('')
        return
      }

      if (!isSupabaseConfigured) {
        setLoading(false)
        setError('No se pudo conectar con los datos del dashboard.')
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await getDashboardData()

        if (!mounted) return
        setDashboardData(data)
      } catch (loadError) {
        if (!mounted) return
        setError(loadError.message || 'No se pudo cargar el dashboard.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      mounted = false
    }
  }, [isDemoMode, isSupabaseConfigured])

  const data = dashboardData || demoDashboardData
  const indicadores = useMemo(() => data.indicadoresOds || [], [data.indicadoresOds])
  const metricasMensuales = data.metricasMensuales || []
  const tiposResiduos = data.tiposResiduos || []
  const emisionesMensuales = data.emisionesMensuales || []
  const indicadoresRadar = data.indicadoresRadar || []

  const statItems = useMemo(() => {
    const avance = pickIndicator(indicadores, (item) => item.ods_numero === 13, 0)
    const residuos = pickIndicator(indicadores, (item) => item.ods_numero === 12, 1)
    const zonas = pickIndicator(indicadores, (item) => item.ods_numero === 11, 2)
    const ecosistemas = pickIndicator(indicadores, (item) => item.ods_numero === 15, 3)

    return [
      {
        icon: ShieldCheck,
        label: avance?.titulo || 'Avance ODS general',
        value: Number(avance?.valor) || 0,
        suffix: avance?.unidad === '%' ? '%' : '',
        meta: avance?.tendencia,
        progress: avance?.unidad === '%' ? Number(avance?.valor) || 0 : undefined,
        tone: 'emerald',
      },
      {
        icon: Recycle,
        label: residuos?.titulo || 'Consumo responsable',
        value: Number(residuos?.valor) || 0,
        suffix: residuos?.unidad === '%' ? '%' : '',
        meta: residuos?.tendencia,
        progress: residuos?.unidad === '%' ? Number(residuos?.valor) || 0 : undefined,
        tone: 'lime',
      },
      {
        icon: iconByOds[zonas?.ods_numero] || Activity,
        label: zonas?.titulo || 'Zonas evaluadas',
        value: Number(zonas?.valor) || 0,
        meta: zonas?.tendencia || zonas?.unidad,
        tone: 'sky',
      },
      {
        icon: iconByOds[ecosistemas?.ods_numero] || BarChart3,
        label: ecosistemas?.titulo || 'Ecosistemas protegidos',
        value: Number(ecosistemas?.valor) || 0,
        meta: ecosistemas?.tendencia || ecosistemas?.unidad,
        tone: 'emerald',
      },
    ]
  }, [indicadores])

  const lineLabels = metricasMensuales.map((item) => item.mes)
  const lineValues = metricasMensuales.map((item) => Number(item.valor) || 0)
  const wasteLabels = tiposResiduos.map((item) => item.tipo)
  const wasteValues = tiposResiduos.map((item) => Number(item.porcentaje) || 0)
  const wasteColors = tiposResiduos.map((item) => item.color).filter(Boolean)
  const emissionsLabels = emisionesMensuales.map((item) => item.mes)
  const emissionsValues = emisionesMensuales.map((item) => Number(item.toneladas) || 0)
  const radarLabels = indicadoresRadar.map((item) => item.indicador)
  const radarValues = indicadoresRadar.map((item) => Number(item.valor) || 0)

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge icon={Leaf}>Indicadores ODS</Badge>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-white">
            Dashboard Ambiental ODS
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Indicadores, tendencias y graficos educativos sobre sostenibilidad.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300">
          {loading ? 'Sincronizando...' : isDemoMode ? 'Modo demo visual' : 'Datos actualizados'}
        </div>
      </header>

      {error && (
        <Card className="border-amber-300/30 bg-amber-400/10">
          <p className="text-sm font-semibold leading-6 text-amber-100">
            No se pudo cargar el dashboard: {error}
          </p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.36 }}
            className="h-full"
          >
            <StatCard {...item} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartPanel title="Avance ODS mensual" footer="Tabla: metricas_mensuales">
          <LineChart labels={lineLabels} values={lineValues} />
        </ChartPanel>

        <ChartPanel title="Tipos de residuos" footer="Tabla: tipos_residuos">
          <DoughnutChart labels={wasteLabels} values={wasteValues} colors={wasteColors} />
        </ChartPanel>

        <ChartPanel title="Emisiones de CO2" footer="Tabla: emisiones_mensuales">
          <BarChart labels={emissionsLabels} values={emissionsValues} />
        </ChartPanel>

        <ChartPanel title="Indicadores sostenibles" footer="Tabla: indicadores_radar">
          <RadarChart labels={radarLabels} values={radarValues} />
        </ChartPanel>
      </div>
    </section>
  )
}

export default Dashboard
