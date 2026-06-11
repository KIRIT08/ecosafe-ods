function ProgressBar({ label, value = 0, max = 100, className = '', showValue = true }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          {label && <span className="font-bold text-slate-200">{label}</span>}
          {showValue && <span className="font-black text-lime-300">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800/90">
        <div
          className="progress-shine relative h-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-sky-300 transition-[width] duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
