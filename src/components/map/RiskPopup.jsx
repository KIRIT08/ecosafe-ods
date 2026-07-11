import { CalendarDays, Droplets, ExternalLink, Leaf, MapPinned, Users } from 'lucide-react'
import { getRiskMeta } from '../../utils/riskColors'

function RiskPopup({ zone, onViewDetails }) {
  const meta = getRiskMeta(zone.nivel_riesgo)
  const ods = zone.ods || zone.ods_relacionados?.[0]
  const problem = zone.problema || zone.tipo_riesgo

  return (
    <article className="bg-white text-slate-950">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-black">{zone.region}</p>
            <p className="mt-1 text-sm text-slate-500">{problem}</p>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-black"
            style={{ backgroundColor: meta.bg, color: '#06110f' }}
          >
            {zone.nivel_riesgo}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4 text-sm">
        <p className="leading-6 text-slate-700">{zone.descripcion}</p>
        <div className="grid gap-2">
          <p className="flex items-center gap-2 text-slate-600">
            <MapPinned className="size-4 text-emerald-700" />
            Lat {Number(zone.latitud).toFixed(2)}, Lng {Number(zone.longitud).toFixed(2)}
          </p>
          <p className="flex items-center gap-2 text-slate-600">
            <Leaf className="size-4 text-emerald-700" />
            ODS: {ods || 'Ambiental'}
          </p>
          <p className="flex items-center gap-2 text-slate-600">
            <CalendarDays className="size-4 text-emerald-700" />
            Consulta: {zone.fecha_consulta || zone.fecha_actualizacion || 'Actualizado'}
          </p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3">
          <p className="mb-1 flex items-center gap-2 font-black text-emerald-900">
            <Droplets className="size-4" />
            Recomendacion
          </p>
          <p className="leading-5 text-emerald-900">{zone.recomendacion}</p>
        </div>
        <p className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Users className="size-4" />
          Fuente: {zone.institucion_fuente || 'Referencia educativa'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onViewDetails}
            className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-black text-white"
          >
            Ver detalle
          </button>
          {zone.fuente_url && (
            <a
              href={zone.fuente_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700"
            >
              Fuente
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default RiskPopup
