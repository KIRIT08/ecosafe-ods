import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf, Lock, Mail, ShieldCheck } from 'lucide-react'
import AuthShell from '../components/auth/AuthShell'
import { useAuth } from '../hooks/useAuth'
import { sendPasswordRecoveryEmail } from '../services/authService'

const rememberedEmailKey = 'ecosafe_ods_remembered_email'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { hasSupabaseUrlPath, isAuthenticated, isSupabaseConfigured, login } = useAuth()
  const [email, setEmail] = useState(() =>
    typeof window !== 'undefined' ? window.localStorage.getItem(rememberedEmailKey) || '' : '',
  )
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/inicio'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTo])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isSupabaseConfigured) {
      setStatus({
        type: 'error',
        message: 'Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local.',
      })
      return
    }

    setSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      await login({ email, password })
      if (remember) {
        window.localStorage.setItem(rememberedEmailKey, email)
      } else {
        window.localStorage.removeItem(rememberedEmailKey)
      }
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'No se pudo iniciar sesion.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRecoverAccess() {
    if (!isSupabaseConfigured) {
      setStatus({
        type: 'error',
        message: 'Configura Supabase antes de recuperar acceso.',
      })
      return
    }

    if (!email) {
      setStatus({
        type: 'error',
        message: 'Escribe tu correo electronico para enviarte el enlace de recuperacion.',
      })
      return
    }

    setSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      await sendPasswordRecoveryEmail(email)
      setStatus({
        type: 'success',
        message: 'Te enviamos un enlace de recuperacion. Revisa tu correo.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'No se pudo enviar el correo de recuperacion.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Plataforma multimedia ODS"
      title="EcoSafe ODS"
      subtitle="Conciencia, sostenibilidad y futuro en una experiencia interactiva conectada a Supabase."
    >
      <div className="text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl border border-emerald-300/25 bg-emerald-400/10 text-lime-300 soft-glow">
          <ShieldCheck className="size-9" />
        </div>
        <h1 className="text-4xl font-black tracking-normal text-white">Iniciar sesion</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Ingresa para continuar tu progreso en los ODS.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="mt-6 rounded-lg border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
          Supabase aun no tiene credenciales en `.env.local`. El formulario queda preparado
          para usarlas cuando las agregues.
        </div>
      )}

      {hasSupabaseUrlPath && (
        <div className="mt-6 rounded-lg border border-sky-300/30 bg-sky-400/10 p-4 text-sm leading-6 text-sky-100">
          Detecte que la URL de Supabase tiene una ruta extra. El cliente intentara usar
          solo el dominio, pero conviene corregir `.env.local` y dejarlo como
          `https://xxxxx.supabase.co`.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-bold text-white">Correo electronico</span>
          <span className="relative mt-2 block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-lg border border-white/10 bg-slate-950/55 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-4 focus:ring-emerald-400/10"
              placeholder="tu-correo@ejemplo.com"
              type="email"
              autoComplete="email"
              required
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-white">Contrasena</span>
          <span className="relative mt-2 block">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-lg border border-white/10 bg-slate-950/55 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-4 focus:ring-emerald-400/10"
              placeholder="Ingresa tu contrasena"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex cursor-pointer items-center gap-3 font-semibold text-slate-300">
            <input
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-4 accent-emerald-400"
              type="checkbox"
            />
            Recordarme
          </label>
          <button
            type="button"
            onClick={handleRecoverAccess}
            disabled={submitting}
            className="font-bold text-lime-300 transition hover:text-lime-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Recuperar acceso
          </button>
        </div>

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
          {submitting ? 'Validando...' : 'Iniciar sesion'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-300">
        No tienes cuenta?{' '}
        <Link className="font-black text-lime-300" to="/register">
          Registrate
        </Link>
      </p>
    </AuthShell>
  )
}

export default Login
