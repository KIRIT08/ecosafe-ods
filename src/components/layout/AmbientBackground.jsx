const particles = [
  ['8%', '18%', '8s', '0s'],
  ['18%', '72%', '11s', '-2s'],
  ['34%', '28%', '9s', '-4s'],
  ['52%', '78%', '12s', '-1s'],
  ['70%', '22%', '10s', '-5s'],
  ['84%', '62%', '13s', '-3s'],
]

function AmbientBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 ambient-grid opacity-45" />
      <div className="pointer-events-none fixed left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-8 right-6 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="particle-field fixed">
        {particles.map(([left, top, duration, delay]) => (
          <span
            key={`${left}-${top}`}
            style={{
              left,
              top,
              '--duration': duration,
              '--delay': delay,
            }}
          />
        ))}
      </div>
    </>
  )
}

export default AmbientBackground
