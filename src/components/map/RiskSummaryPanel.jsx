import { AlertTriangle, ExternalLink, MapPinned, ShieldCheck } from 'lucide-react'
import Card from '../ui/Card'
import RiskBadge from '../ui/RiskBadge'

function countByLevel(zones, level) {
  return zones.filter((zone) => zone.nivel_riesgo === level).length
}

function RiskSummaryPanel({ zones, selectedZone }) {
  const total = zones.length
  const high = countByLevel(zones, 'Alto')
  const medium = countByLevel(zones, 'Medio')
  const low = countByLevel(zones, 'Bajo')
  const detail = selectedZone || zones[0]
  const ods = detail?.ods || detail?.ods_relacionados?.[0]

  return (
    <aside className="space-y-4">
      {detail && (
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-lime-300">
                Zona seleccionada
              </p>
              <h2 className="mt-2 text-xl font-black tracking-normal text-white">
                {detail.region}
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                {[detail.provincia, detail.distrito].filter(Boolean).join(' / ') || 'Peru'}
              </p>
            </div>
            <RiskBadge level={detail.nivel_riesgo} />
          </div>

          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <p>
              <span className="font-black text-white">ODS:</span> {ods || 'Ambiental'}
            </p>
            <p>
              <span className="font-black text-white">Problema:</span>{' '}
              {detail.problema || detail.tipo_riesgo}
            </p>
            <p>{detail.descripcion}</p>
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-3">
              <p className="font-black text-emerald-100">Recomendacion</p>
              <p className="mt-1 text-emerald-50/80">{detail.recomendacion}</p>
            </div>
            <p className="text-xs font-bold text-slate-400">
              Fuente: {detail.institucion_fuente || 'Referencia educativa'}
            </p>
            <p className="text-xs font-bold text-slate-400">
              Fecha de consulta: {detail.fecha_consulta || detail.fecha_actualizacion || 'No indicada'}
            </p>
            {detail.fuente_url && (
              <a
                href={detail.fuente_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-emerald-300/25 bg-emerald-400/10 px-4 text-sm font-black text-emerald-100 transition hover:bg-emerald-400/15"
              >
                Ver fuente
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </Card>
      )}

      <Card>
        <MapPinned className="mb-4 size-8 text-emerald-300" />
        <p className="text-sm font-semibold text-slate-300">Regiones monitoreadas</p>
        <p className="mt-3 text-3xl font-black tracking-normal text-white">{total} / 25</p>
        <p className="mt-2 text-sm font-semibold text-lime-300">
          {Math.round((total / 25) * 100)}% del territorio referencial
        </p>
      </Card>

      <Card>
        <AlertTriangle className="mb-4 size-8 text-amber-300" />
        <p className="text-sm font-semibold text-slate-300">Alertas de riesgo</p>
        <p className="mt-3 text-3xl font-black tracking-normal text-white">{high + medium}</p>
        <p className="mt-2 text-sm font-semibold text-amber-200">Niveles medio y alto</p>
      </Card>

      <Card>
        <ShieldCheck className="mb-4 size-8 text-cyan-300" />
        <p className="text-sm font-semibold text-slate-300">Zonas de bajo riesgo</p>
        <p className="mt-3 text-3xl font-black tracking-normal text-white">{low}</p>
        <p className="mt-2 text-sm font-semibold text-cyan-200">Monitoreo estable</p>
      </Card>

      <Card>
        <p className="mb-4 text-lg font-black tracking-normal text-white">Resumen por nivel</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <RiskBadge level="Alto" />
            <span className="font-black text-white">{high}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <RiskBadge level="Medio" />
            <span className="font-black text-white">{medium}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <RiskBadge level="Bajo" />
            <span className="font-black text-white">{low}</span>
          </div>
        </div>
      </Card>
    </aside>
  )
}

export default RiskSummaryPanel
