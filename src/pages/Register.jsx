import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf, Lock, Mail, UserRound } from 'lucide-react'
import AuthShell from '../components/auth/AuthShell'
import { useAuth } from '../hooks/useAuth'

function Register() {
  const navigate = useNavigate()
  const { hasSupabaseUrlPath, isAuthenticated, isSupabaseConfigured, register } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/inicio', { replace: true })
    }
  }, [isAuthenticated, navigate])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isSupabaseConfigured) {
      setStatus({
        type: 'error',
        message: 'Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local.',
      })
      return
    }

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
      const data = await register({ email, password, nombre })

      if (data.session) {
        navigate('/inicio', { replace: true })
        return
      }

      setStatus({
        type: 'success',
        message:
          'Registro creado. Revisa tu correo si Supabase solicita confirmacion antes de iniciar sesion.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'No se pudo crear la cuenta.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Registro sostenible"
      title="Unete a EcoSafe ODS"
      subtitle="Crea tu cuenta para guardar puntos, insignias, actividad y progreso en Supabase."
    >
      <div className="text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl border border-emerald-300/25 bg-emerald-400/10 text-lime-300 soft-glow">
          <UserRound className="size-9" />
        </div>
        <h1 className="text-4xl font-black tracking-normal text-white">Crear cuenta</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Tu perfil gamificado se creara automaticamente al registrarte.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="mt-6 rounded-lg border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
          Supabase aun no tiene credenciales en `.env.local`. El registro queda preparado
          para funcionar cuando las agregues.
        </div>
      )}

      {hasSupabaseUrlPath && (
        <div className="mt-6 rounded-lg border border-sky-300/30 bg-sky-400/10 p-4 text-sm leading-6 text-sky-100">
          Detecte que la URL de Supabase tiene una ruta extra. Corrige `.env.local` para
          usar solo `https://xxxxx.supabase.co`.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-bold text-white">Nombre</span>
          <span className="relative mt-2 block">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className="h-12 w-full rounded-lg border border-white/10 bg-slate-950/55 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-4 focus:ring-emerald-400/10"
              placeholder="Tu nombre"
              type="text"
              autoComplete="name"
              required
            />
          </span>
        </label>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-white">Contrasena</span>
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
            <span className="text-sm font-bold text-white">Confirmar</span>
            <span className="relative mt-2 block">
              <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="h-12 w-full rounded-lg border border-white/10 bg-slate-950/55 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-4 focus:ring-emerald-400/10"
                placeholder="Repite la clave"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
              />
            </span>
          </label>
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
          {submitting ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-300">
        Ya tienes cuenta?{' '}
        <Link className="font-black text-lime-300" to="/login">
          Inicia sesion
        </Link>
      </p>
    </AuthShell>
  )
}

export default Register
