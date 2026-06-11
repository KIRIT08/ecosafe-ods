import { getRiskMeta } from '../../utils/riskColors'

const levels = [
  ['Alto', 'Riesgo elevado'],
  ['Medio', 'Riesgo moderado'],
  ['Bajo', 'Riesgo bajo'],
]

function RiskLegend() {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-xl">
      <p className="mb-3 text-sm font-black text-white">Niveles de riesgo</p>
      <div className="space-y-3">
        {levels.map(([level, description]) => {
          const meta = getRiskMeta(level)

          return (
            <div key={level} className="flex items-center gap-3 text-sm">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: meta.bg }}
              />
              <span className="font-bold text-white">{level}</span>
              <span className="text-xs text-slate-400">{description}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RiskLegend
