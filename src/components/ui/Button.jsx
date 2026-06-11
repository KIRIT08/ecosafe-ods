const variants = {
  primary:
    'bg-gradient-to-r from-emerald-500 to-lime-400 text-emerald-950 shadow-lg shadow-emerald-950/30 hover:brightness-110',
  secondary:
    'border border-emerald-300/30 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/15',
  ghost: 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white',
  danger: 'border border-red-300/25 bg-red-400/10 text-red-100 hover:bg-red-400/15',
}

function Button({
  children,
  className = '',
  icon: Icon,
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      type={type}
      className={[
        'inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black transition duration-300 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {Icon && <Icon className="size-5" />}
      {children}
    </button>
  )
}

export default Button
