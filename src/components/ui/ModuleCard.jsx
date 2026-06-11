import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function ModuleCard({ title, description, icon: Icon, to, tone = 'emerald' }) {
  const tones = {
    emerald: 'from-emerald-400/20 text-emerald-200 ring-emerald-300/20',
    sky: 'from-sky-400/20 text-sky-200 ring-sky-300/20',
    amber: 'from-amber-400/20 text-amber-200 ring-amber-300/20',
    cyan: 'from-cyan-400/20 text-cyan-200 ring-cyan-300/20',
  }

  return (
    <Link
      to={to}
      className="glass-panel group flex min-h-36 items-center gap-5 rounded-lg p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/40"
    >
      <div
        className={[
          'grid size-16 shrink-0 place-items-center rounded-lg bg-gradient-to-br to-white/5 ring-1',
          tones[tone],
        ].join(' ')}
      >
        <Icon className="size-8" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-xl font-black tracking-normal text-white">{title}</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">{description}</p>
      </div>
      <div className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 text-emerald-200 transition group-hover:translate-x-1 group-hover:bg-emerald-400/15">
        <ArrowRight className="size-5" />
      </div>
    </Link>
  )
}

export default ModuleCard
