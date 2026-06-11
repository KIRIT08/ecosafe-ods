import { motion } from 'framer-motion'
import { Leaf, ShieldCheck } from 'lucide-react'
import AmbientBackground from '../layout/AmbientBackground'
import Logo from '../layout/Logo'

function AuthShell({ children, eyebrow, title, subtitle }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,197,94,0.26),transparent_24rem),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.16),transparent_24rem),linear-gradient(135deg,#06110f_0%,#0b2e1a_45%,#061826_100%)]" />
      <AmbientBackground />

      <section className="relative z-10 grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_32rem] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -26 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="hidden lg:block"
        >
          <Logo />
          <div className="mt-16 max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-200">
              <ShieldCheck className="size-4" />
              {eyebrow}
            </p>
            <h1 className="text-6xl font-black leading-tight tracking-normal text-white">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">{subtitle}</p>
          </div>

          <div className="glass-panel mt-12 flex max-w-lg items-center gap-4 rounded-lg p-5">
            <div className="grid size-12 place-items-center rounded-full bg-lime-300/15 text-lime-300">
              <Leaf className="size-6" />
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Aprende, actua y suma puntos mientras exploras los Objetivos de Desarrollo
              Sostenible.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="glass-panel mx-auto w-full max-w-lg rounded-lg p-6 sm:p-8"
        >
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          {children}
        </motion.div>
      </section>
    </main>
  )
}

export default AuthShell
