import { Navigate, useLocation } from 'react-router-dom'
import Logo from '../components/layout/Logo'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 px-4 text-white">
        <div className="glass-panel rounded-lg p-8 text-center">
          <div className="mx-auto mb-5 w-fit">
            <Logo />
          </div>
          <div className="mx-auto size-10 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
          <p className="mt-4 text-sm font-semibold text-slate-300">Validando sesion...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
