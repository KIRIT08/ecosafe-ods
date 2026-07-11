import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf, Lock, ShieldCheck } from 'lucide-react'
import AuthShell from '../components/auth/AuthShell'
import { updatePassword } from '../services/authService'

function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (password.length < 6) {
      setStatus({ type: 'error', message: 'La contrasena debe tener al menos 6 caracteres.' })
      return
    }

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Las contrasenas no coinciden.' })
      return
    }

    setSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      await updatePassword(password)
      setStatus({
        type: 'success',
        message: 'Contrasena actualizada. Ya puedes iniciar sesion con tu nueva clave.',
      })
      window.setTimeout(() => navigate('/login', { replace: true }), 1600)
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.message ||
          'No se pudo actualizar la contrasena. Abre nuevamente el enlace de recuperacion.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Recuperacion segura"
      title="EcoSafe ODS"
      subtitle="Crea una nueva contrasena para recuperar el acceso a tu progreso ODS."
    >
      <div className="text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl border border-emerald-300/25 bg-emerald-400/10 text-lime-300 soft-glow">
          <ShieldCheck className="size-9" />
        </div>
        <h1 className="text-4xl font-black tracking-normal text-white">Nueva contrasena</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Usa una clave facil de recordar y segura.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-bold text-white">Nueva contrasena</span>
          <span className="relative mt-2 block">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-lg border border-white/10 bg-slate-950/55 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-4 focus:ring-emerald-400/10"
              placeholder="Min. 6 caracteres"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-300 transition hover:bg-white/5 hover:text-white"
              aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-white">Confirmar contrasena</span>
          <span className="relative mt-2 block">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-12 w-full rounded-lg border border-white/10 bg-slate-950/55 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-4 focus:ring-emerald-400/10"
              placeholder="Repite tu clave"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
            />
          </span>
        </label>

        {status.message && (
          <div
            className={[
              'rounded-lg border p-4 text-sm leading-6',
              status.type === 'error'
                ? 'border-red-300/30 bg-red-400/10 text-red-100'
                : 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100',
            ].join(' ')}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 px-5 font-black text-emerald-950 shadow-lg shadow-emerald-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Leaf className="size-5" />
          {submitting ? 'Actualizando...' : 'Actualizar contrasena'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-300">
        Ya recordaste tu clave?{' '}
        <Link className="font-black text-lime-300" to="/login">
          Volver al login
        </Link>
      </p>
    </AuthShell>
  )
}

export default ResetPassword
