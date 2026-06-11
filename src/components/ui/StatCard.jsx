import AnimatedCounter from './AnimatedCounter'
import Card from './Card'
import ProgressBar from './ProgressBar'

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = '',
  meta,
  progress,
  tone = 'emerald',
}) {
  const tones = {
    emerald: 'text-emerald-300 bg-emerald-400/10 border-emerald-300/20',
    lime: 'text-lime-300 bg-lime-400/10 border-lime-300/20',
    sky: 'text-sky-300 bg-sky-400/10 border-sky-300/20',
    amber: 'text-amber-300 bg-amber-400/10 border-amber-300/20',
  }

  return (
    <Card className="flex h-full min-h-44 flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="min-h-10 text-sm font-semibold leading-5 text-slate-300">{label}</p>
          <p className="mt-4 text-3xl font-black tracking-normal text-white">
            <AnimatedCounter
              value={value}
              formatter={(current) =>
                `${Math.round(current).toLocaleString('es-PE')}${suffix}`
              }
            />
          </p>
        </div>
        {Icon && (
          <div
            className={[
              'grid size-12 place-items-center rounded-lg border',
              tones[tone] || tones.emerald,
            ].join(' ')}
          >
            <Icon className="size-7" />
          </div>
        )}
      </div>
      <div className="mt-auto pt-4">
        <p className="min-h-5 text-sm font-semibold text-lime-300">{meta || ''}</p>
        {typeof progress === 'number' && <ProgressBar className="mt-4" value={progress} />}
      </div>
    </Card>
  )
}

export default StatCard
