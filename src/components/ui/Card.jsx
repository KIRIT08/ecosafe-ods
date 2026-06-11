function Card({ children, className = '', as: Component = 'article' }) {
  return (
    <Component
      className={[
        'glass-panel rounded-lg p-5 transition duration-300 hover:border-emerald-300/35',
        className,
      ].join(' ')}
    >
      {children}
    </Component>
  )
}

export default Card
