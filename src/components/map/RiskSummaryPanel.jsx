import { AlertTriangle, MapPinned, ShieldCheck } from 'lucide-react'
import Card from '../ui/Card'
import RiskBadge from '../ui/RiskBadge'

function countByLevel(zones, level) {
  return zones.filter((zone) => zone.nivel_riesgo === level).length
}

function RiskSummaryPanel({ zones }) {
  const total = zones.length
  const high = countByLevel(zones, 'Alto')
  const medium = countByLevel(zones, 'Medio')
  const low = countByLevel(zones, 'Bajo')

  return (
    <aside className="space-y-4">
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
