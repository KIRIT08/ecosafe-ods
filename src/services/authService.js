import { getSupabaseClient } from './supabaseClient'

function withFriendlyAuthError(error) {
  if (error?.message?.includes('Invalid path specified in request URL')) {
    return new Error(
      'La URL de Supabase parece incluir una ruta extra. Usa solo el Project URL, por ejemplo https://xxxxx.supabase.co, reinicia Vite y vuelve a intentar.',
    )
  }

  return error
}

export async function getCurrentSession() {
  const { data, error } = await getSupabaseClient().auth.getSession()

  if (error) throw withFriendlyAuthError(error)
  return data.session
}

export async function getCurrentUser() {
  const { data, error } = await getSupabaseClient().auth.getUser()

  if (error) throw withFriendlyAuthError(error)
  return data.user
}

export async function signInWithEmail({ email, password }) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw withFriendlyAuthError(error)
  return data
}

export async function signUpWithEmail({ email, password, nombre }) {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre,
      },
    },
  })

  if (error) throw withFriendlyAuthError(error)
  return data
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut()

  if (error) throw withFriendlyAuthError(error)
}

export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = getSupabaseClient().auth.onAuthStateChange(callback)

  return subscription
}
