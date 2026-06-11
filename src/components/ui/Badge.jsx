const variants = {
  emerald: 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100',
  lime: 'border-lime-300/25 bg-lime-400/10 text-lime-100',
  sky: 'border-sky-300/25 bg-sky-400/10 text-sky-100',
  amber: 'border-amber-300/25 bg-amber-400/10 text-amber-100',
  red: 'border-red-300/25 bg-red-400/10 text-red-100',
}

function Badge({ children, className = '', icon: Icon, variant = 'emerald' }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black',
        variants[variant],
        className,
      ].join(' ')}
    >
      {Icon && <Icon className="size-4" />}
      {children}
    </span>
  )
}

export default Badge
