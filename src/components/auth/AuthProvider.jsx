import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getCurrentSession,
  onAuthStateChange,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from '../../services/authService'
import { hasSupabaseUrlPath, isSupabaseConfigured } from '../../services/supabaseClient'
import { AuthContext } from '../../contexts/authContext'

function getDisplayName(user) {
  return user?.user_metadata?.nombre || user?.email?.split('@')[0] || 'EcoUsuario'
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [authError, setAuthError] = useState(
    isSupabaseConfigured ? null : 'Supabase aun no esta configurado en .env.local.',
  )

  useEffect(() => {
    let mounted = true

    if (!isSupabaseConfigured) {
      return undefined
    }

    getCurrentSession()
      .then((currentSession) => {
        if (!mounted) return
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
      })
      .catch((error) => {
        if (!mounted) return
        setAuthError(error.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    const subscription = onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setAuthError(null)
    const data = await signInWithEmail({ email, password })
    setSession(data.session)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async ({ email, password, nombre }) => {
    setAuthError(null)
    const data = await signUpWithEmail({ email, password, nombre })
    setSession(data.session)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    if (isSupabaseConfigured && session) {
      await signOut()
    }

    setSession(null)
    setUser(null)
  }, [session])

  const value = useMemo(
    () => ({
      authError,
      displayName: getDisplayName(user),
      hasSupabaseUrlPath,
      isAuthenticated: Boolean(session?.user),
      isDemoMode: false,
      isSupabaseConfigured,
      loading,
      login,
      logout,
      register,
      session,
      user,
    }),
    [authError, loading, login, logout, register, session, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
