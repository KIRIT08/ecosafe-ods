import { Droplets, Leaf, Recycle, Trees } from 'lucide-react'

const particles = [
  ['8%', '18%', '8s', '0s'],
  ['18%', '72%', '11s', '-2s'],
  ['34%', '28%', '9s', '-4s'],
  ['52%', '78%', '12s', '-1s'],
  ['70%', '22%', '10s', '-5s'],
  ['84%', '62%', '13s', '-3s'],
]

const floatingSymbols = [
  ['12%', '28%', '10s', '-1s', Leaf],
  ['24%', '86%', '13s', '-4s', Recycle],
  ['76%', '16%', '11s', '-2s', Droplets],
  ['88%', '72%', '12s', '-5s', Trees],
]

function AmbientBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 ambient-grid opacity-45" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="ambient-wave ambient-wave-a" />
        <div className="ambient-wave ambient-wave-b" />
        {floatingSymbols.map(([left, top, duration, delay, Icon]) => (
          <span
            key={`${left}-${top}`}
            className="ambient-symbol"
            style={{
              left,
              top,
              '--duration': duration,
              '--delay': delay,
            }}
          >
            <Icon className="size-5" />
          </span>
        ))}
      </div>
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
