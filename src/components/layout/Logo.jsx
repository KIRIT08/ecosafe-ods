import { Leaf, Shield } from 'lucide-react'

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid size-12 place-items-center rounded-2xl border border-emerald-300/30 bg-emerald-400/10 text-emerald-300 soft-glow">
        <Shield className="size-8" strokeWidth={2.2} />
        <Leaf className="absolute size-5 translate-x-1 translate-y-1 text-lime-300" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-xl font-black tracking-normal text-white">EcoSafe ODS</p>
          <p className="text-xs font-medium text-slate-300">
            Conciencia - Sostenibilidad - Futuro
          </p>
        </div>
      )}
    </div>
  )
}

export default Logo
