import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function normalizeSupabaseUrl(url) {
  if (!url) return ''

  try {
    const parsedUrl = new URL(url)

    return parsedUrl.origin
  } catch {
    return url
  }
}

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const hasSupabaseUrlPath = Boolean(
  rawSupabaseUrl && supabaseUrl && rawSupabaseUrl.replace(/\/$/, '') !== supabaseUrl,
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      'Supabase no esta configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local.',
    )
  }

  return supabase
}
