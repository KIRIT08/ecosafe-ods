import { getSupabaseClient } from './supabaseClient'

export async function getZonasRiesgo() {
  const { data, error } = await getSupabaseClient()
    .from('zonas_riesgo')
    .select('*')
    .order('nivel_riesgo', { ascending: true })
    .order('region', { ascending: true })

  if (error) throw error
  return data
}

export async function getZonasRiesgoByNivel(nivelRiesgo) {
  const { data, error } = await getSupabaseClient()
    .from('zonas_riesgo')
    .select('*')
    .eq('nivel_riesgo', nivelRiesgo)
    .order('region', { ascending: true })

  if (error) throw error
  return data
}
