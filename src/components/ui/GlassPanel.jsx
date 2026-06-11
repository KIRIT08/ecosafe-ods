function GlassPanel({ children, className = '', as: Component = 'div' }) {
  return (
    <Component className={['glass-panel rounded-lg', className].join(' ')}>
      {children}
    </Component>
  )
}

export default GlassPanel
