import { getSupabaseClient } from './supabaseClient'

export async function getUserProfile(userId) {
  const { data, error } = await getSupabaseClient()
    .from('perfiles_usuario')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function upsertUserProfile(profile) {
  const { data, error } = await getSupabaseClient()
    .from('perfiles_usuario')
    .upsert(profile, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserBadges(userId) {
  const { data, error } = await getSupabaseClient()
    .from('usuario_insignias')
    .select('id, fecha_obtenida, insignias(*)')
    .eq('user_id', userId)
    .order('fecha_obtenida', { ascending: false })

  if (error) throw error
  return data
}

export async function getAvailableBadges() {
  const { data, error } = await getSupabaseClient()
    .from('insignias')
    .select('*')
    .order('puntos_requeridos', { ascending: true })

  if (error) throw error
  return data
}

export async function getUserActivity(userId, limit = 8) {
  const { data, error } = await getSupabaseClient()
    .from('actividad_usuario')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getUserScores(userId, limit = 12) {
  const { data, error } = await getSupabaseClient()
    .from('puntajes_juego')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getLastScore(userId) {
  const { data, error } = await getSupabaseClient()
    .from('puntajes_juego')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}
