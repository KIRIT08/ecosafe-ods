import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  Lightbulb,
  Search,
  Share2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import RiskBadge from '../components/ui/RiskBadge'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../hooks/useAuth'
import { getReportesOds } from '../services/reportsService'

const demoReports = [
  {
    id: 'demo-report-1',
    titulo: 'Reporte de Impacto Ambiental ODS',
    area_evaluada: 'Planta de Produccion',
    ods_numero: 12,
    cumplimiento: 78,
    nivel_riesgo: 'Medio',
    impacto_estimado: 'Reduccion parcial de residuos y mejora de buenas practicas.',
    hallazgos: [
      'Separacion inadecuada de residuos reciclables',
      'Falta de senaletica ambiental visible',
      'Control adecuado de emisiones en caldera',
    ],
    recomendaciones: [
      'Implementar contenedores diferenciados',
      'Instalar senaletica visible',
      'Realizar mantenimiento preventivo',
    ],
    estado: 'Completado',
    created_at: '2026-06-02',
  },
  {
    id: 'demo-report-2',
    titulo: 'Reporte de Agua y Comunidad',
    area_evaluada: 'Zona educativa comunitaria',
    ods_numero: 6,
    cumplimiento: 84,
    nivel_riesgo: 'Bajo',
    impacto_estimado: 'Mejora en cultura de ahorro de agua.',
    hallazgos: ['Uso responsable en puntos de consumo', 'Necesidad de reforzar mensajes visuales'],
    recomendaciones: ['Agregar medidores visibles', 'Crear campana multimedia de ahorro'],
    estado: 'Completado',
    created_at: '2026-06-04',
  },
  {
    id: 'demo-report-3',
    titulo: 'Reporte de Accion Climatica Escolar',
    area_evaluada: 'Modulo de aprendizaje ambiental',
    ods_numero: 13,
    cumplimiento: 69,
    nivel_riesgo: 'Medio',
    impacto_estimado: 'Participacion positiva con oportunidad de mejora.',
    hallazgos: ['Baja participacion en retos climaticos', 'Buen resultado en acciones educativas'],
    recomendaciones: ['Activar ranking semanal', 'Agregar recompensas visuales por reto'],
    estado: 'Completado',
    created_at: '2026-06-06',
  },
]

const riskOrder = ['Todos', 'Alto', 'Medio', 'Bajo']

function parseList(value) {
  if (Array.isArray(value)) return value

  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function formatDate(value) {
  if (!value) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function getRiskTone(level) {
  if (level === 'Alto') return 'red'
  if (level === 'Medio') return 'amber'
  return 'emerald'
}

function buildReportText(report) {
  if (!report) return ''

  const hallazgos = parseList(report.hallazgos)
  const recomendaciones = parseList(report.recomendaciones)

  return [
    'EcoSafe ODS - Reporte de Impacto',
    '',
    `Titulo: ${report.titulo}`,
    `Area evaluada: ${report.area_evaluada}`,
    `ODS relacionado: ODS ${report.ods_numero}`,
    `Fecha: ${formatDate(report.created_at)}`,
    `Cumplimiento: ${Math.round(Number(report.cumplimiento) || 0)}%`,
    `Nivel de riesgo: ${report.nivel_riesgo}`,
    `Estado: ${report.estado || 'Completado'}`,
    '',
    'Impacto estimado:',
    report.impacto_estimado || 'Sin impacto estimado registrado.',
    '',
    'Hallazgos:',
    ...(hallazgos.length ? hallazgos.map((item) => `- ${item}`) : ['- Sin hallazgos registrados.']),
    '',
    'Recomendaciones:',
    ...(recomendaciones.length
      ? recomendaciones.map((item) => `- ${item}`)
      : ['- Sin recomendaciones registradas.']),
  ].join('\n')
}

function downloadReport(report) {
  const content = buildReportText(report)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const safeName = report.titulo
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  link.href = url
  link.download = `${safeName || 'reporte-ods'}.txt`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function Reportes() {
  const { isDemoMode, isSupabaseConfigured } = useAuth()
  const [reports, setReports] = useState(isDemoMode ? demoReports : [])
  const [selectedRisk, setSelectedRisk] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReportId, setSelectedReportId] = useState(demoReports[0].id)
  const [simulatedAction, setSimulatedAction] = useState('')
  const [loading, setLoading] = useState(!isDemoMode)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadReports() {
      if (isDemoMode) {
        setReports(demoReports)
        setSelectedReportId(demoReports[0].id)
        setLoading(false)
        setError('')
        return
      }

      if (!isSupabaseConfigured) {
        setLoading(false)
        setError('No se pudo cargar la data de reportes.')
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await getReportesOds()

        if (!mounted) return
        setReports(data)
        setSelectedReportId(data[0]?.id || '')
      } catch (loadError) {
        if (!mounted) return
        setError(loadError.message || 'No se pudo cargar la data de reportes.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadReports()

    return () => {
      mounted = false
    }
  }, [isDemoMode, isSupabaseConfigured])

  const filteredReports = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return reports.filter((report) => {
      const matchesRisk = selectedRisk === 'Todos' || report.nivel_riesgo === selectedRisk
      const matchesSearch =
        !query ||
        [report.titulo, report.area_evaluada, report.impacto_estimado, `ODS ${report.ods_numero}`]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))

      return matchesRisk && matchesSearch
    })
  }, [reports, searchTerm, selectedRisk])

  const selectedReport =
    filteredReports.find((report) => report.id === selectedReportId) ||
    filteredReports[0] ||
    reports[0]

  const summary = useMemo(() => {
    const total = reports.length
    const average = total
      ? Math.round(
          reports.reduce((sum, report) => sum + (Number(report.cumplimiento) || 0), 0) / total,
        )
      : 0
    const mediumHigh = reports.filter((report) =>
      ['Alto', 'Medio'].includes(report.nivel_riesgo),
    ).length
    const recommendations = reports.reduce(
      (sum, report) => sum + parseList(report.recomendaciones).length,
      0,
    )

    return { total, average, mediumHigh, recommendations }
  }, [reports])

  const hallazgos = parseList(selectedReport?.hallazgos)
  const recomendaciones = parseList(selectedReport?.recomendaciones)

  function triggerSimulatedAction(action) {
    setSimulatedAction(action)
    window.setTimeout(() => setSimulatedAction(''), 2200)
  }

  async function handleShareReport() {
    const reportText = buildReportText(selectedReport)

    try {
      await navigator.clipboard.writeText(reportText)
      triggerSimulatedAction('Reporte copiado al portapapeles.')
    } catch {
      triggerSimulatedAction('No se pudo copiar automaticamente. Usa la descarga del reporte.')
    }
  }

  function handleDownloadReport() {
    downloadReport(selectedReport)
    triggerSimulatedAction('Archivo TXT del reporte descargado.')
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge icon={FileText}>Impacto sostenible</Badge>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-white">
            Reportes de Impacto ODS
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Evaluaciones simuladas con cumplimiento, riesgo, hallazgos y recomendaciones.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300">
          {loading ? 'Cargando reportes...' : isDemoMode ? 'Modo demo visual' : 'Reportes actualizados'}
        </div>
      </header>

      {error && (
        <Card className="border-amber-300/30 bg-amber-400/10">
          <p className="text-sm font-semibold leading-6 text-amber-100">
            No se pudo cargar toda la data de reportes: {error}
          </p>
        </Card>
      )}

      {simulatedAction && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-lime-300/30 bg-lime-400/10 px-4 py-3 text-sm font-black text-lime-100"
        >
          {simulatedAction}
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} label="Reportes totales" value={summary.total} />
        <StatCard
          icon={CheckCircle2}
          label="Cumplimiento promedio"
          value={summary.average}
          suffix="%"
          progress={summary.average}
          tone="lime"
        />
        <StatCard
          icon={AlertTriangle}
          label="Riesgos medios/altos"
          value={summary.mediumHigh}
          meta="Prioridad de mejora"
          tone="amber"
        />
        <StatCard
          icon={Lightbulb}
          label="Recomendaciones"
          value={summary.recommendations}
          meta="Acciones sugeridas"
          tone="sky"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="space-y-4">
          <Card>
            <Badge icon={Filter}>Filtros</Badge>
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/55 pl-10 pr-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/40"
                placeholder="Buscar reporte..."
              />
            </div>
            <div className="mt-4 space-y-2">
              {riskOrder.map((risk) => (
                <button
                  key={risk}
                  onClick={() => setSelectedRisk(risk)}
                  className={[
                    'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-bold transition',
                    selectedRisk === risk
                      ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:bg-emerald-400/10',
                  ].join(' ')}
                >
                  {risk === 'Todos' ? 'Todos los riesgos' : `Riesgo ${risk}`}
                  <span className="rounded-full bg-slate-950/50 px-2 py-1 text-xs">
                    {risk === 'Todos'
                      ? reports.length
                      : reports.filter((report) => report.nivel_riesgo === risk).length}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <Badge icon={Sparkles}>Lista</Badge>
            <div className="mt-4 space-y-2">
              {filteredReports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={[
                    'w-full rounded-lg border px-4 py-3 text-left transition',
                    selectedReport?.id === report.id
                      ? 'border-lime-300/40 bg-lime-400/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10',
                  ].join(' ')}
                >
                  <p className="text-sm font-black text-white">{report.titulo}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    ODS {report.ods_numero} - {report.area_evaluada}
                  </p>
                </button>
              ))}
              {!loading && filteredReports.length === 0 && (
                <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-semibold text-slate-400">
                  No hay reportes con ese filtro.
                </p>
              )}
            </div>
          </Card>
        </aside>

        {selectedReport && (
          <motion.article
            key={selectedReport.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-lg p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge icon={ShieldAlert}>ODS {selectedReport.ods_numero}</Badge>
                  <RiskBadge level={selectedReport.nivel_riesgo} />
                </div>
                <h2 className="mt-4 text-2xl font-black tracking-normal text-white">
                  {selectedReport.titulo}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  {selectedReport.impacto_estimado || 'Reporte visual de impacto sostenible.'}
                </p>
              </div>
              <span className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-100">
                {selectedReport.estado || 'Completado'}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-bold text-slate-400">Area evaluada</p>
                <p className="mt-2 font-black text-white">{selectedReport.area_evaluada}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-bold text-slate-400">Fecha</p>
                <p className="mt-2 font-black text-white">{formatDate(selectedReport.created_at)}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-bold text-slate-400">Cumplimiento</p>
                <p className="mt-2 text-2xl font-black text-lime-300">
                  {Math.round(Number(selectedReport.cumplimiento) || 0)}%
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-bold text-slate-400">Nivel de riesgo</p>
                <p
                  className={[
                    'mt-2 text-2xl font-black',
                    getRiskTone(selectedReport.nivel_riesgo) === 'red'
                      ? 'text-red-300'
                      : getRiskTone(selectedReport.nivel_riesgo) === 'amber'
                        ? 'text-amber-300'
                        : 'text-emerald-300',
                  ].join(' ')}
                >
                  {selectedReport.nivel_riesgo}
                </p>
              </div>
            </div>

            <ProgressBar
              className="mt-6"
              label="Cumplimiento del reporte"
              value={Number(selectedReport.cumplimiento) || 0}
            />

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                <h3 className="flex items-center gap-2 text-lg font-black tracking-normal text-white">
                  <AlertTriangle className="size-5 text-amber-300" />
                  Hallazgos
                </h3>
                <div className="mt-4 space-y-3">
                  {hallazgos.map((item) => (
                    <p
                      key={item}
                      className="rounded-lg border border-amber-300/15 bg-amber-400/10 px-4 py-3 text-sm font-semibold leading-6 text-amber-50"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                <h3 className="flex items-center gap-2 text-lg font-black tracking-normal text-white">
                  <Lightbulb className="size-5 text-lime-300" />
                  Recomendaciones
                </h3>
                <div className="mt-4 space-y-3">
                  {recomendaciones.map((item) => (
                    <p
                      key={item}
                      className="rounded-lg border border-lime-300/15 bg-lime-400/10 px-4 py-3 text-sm font-semibold leading-6 text-lime-50"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                variant="ghost"
                icon={Share2}
                onClick={handleShareReport}
              >
                Compartir
              </Button>
              <Button
                icon={Download}
                onClick={handleDownloadReport}
              >
                Descargar TXT
              </Button>
            </div>
          </motion.article>
        )}
      </div>
    </section>
  )
}

export default Reportes
