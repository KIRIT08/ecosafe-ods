import { getSupabaseClient } from './supabaseClient'

export async function getPreguntasOds({ dificultad } = {}) {
  let query = getSupabaseClient().from('preguntas_ods').select('*')

  if (dificultad) {
    query = query.eq('dificultad', dificultad)
  }

  const { data, error } = await query.order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function saveGameScore({ userId, puntaje, nivelAlcanzado, vidasRestantes }) {
  const { data, error } = await getSupabaseClient()
    .from('puntajes_juego')
    .insert({
      user_id: userId,
      puntaje,
      nivel_alcanzado: nivelAlcanzado,
      vidas_restantes: vidasRestantes,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getRanking(limit = 10) {
  const { data, error } = await getSupabaseClient()
    .from('puntajes_juego')
    .select(
      `
      id,
      user_id,
      puntaje,
      nivel_alcanzado,
      created_at,
      perfiles_usuario(nombre, nivel)
    `,
    )
    .order('puntaje', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
