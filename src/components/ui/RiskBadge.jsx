const riskStyles = {
  Alto: 'border-red-300/30 bg-red-400/10 text-red-100',
  Medio: 'border-amber-300/30 bg-amber-400/10 text-amber-100',
  Bajo: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100',
}

function RiskBadge({ level }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black',
        riskStyles[level] || riskStyles.Bajo,
      ].join(' ')}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full rounded-full bg-current opacity-60 [animation:pulse-ring_1.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <span className="relative inline-flex size-2 rounded-full bg-current" />
      </span>
      Riesgo {level}
    </span>
  )
}

export default RiskBadge
