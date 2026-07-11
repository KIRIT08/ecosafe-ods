import { getSupabaseClient } from './supabaseClient'

async function readFromLegacyRiskTable(nivelRiesgo) {
  let query = getSupabaseClient()
    .from('zonas_riesgo')
    .select('*')
    .order('region', { ascending: true })

  if (nivelRiesgo) {
    query = query.eq('nivel_riesgo', nivelRiesgo)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getZonasRiesgo() {
  const { data, error } = await getSupabaseClient()
    .from('zonas_riesgo_ods')
    .select('*')
    .order('region', { ascending: true })
    .order('problema', { ascending: true })

  if (!error) return data
  if (error.code === '42P01') return readFromLegacyRiskTable()

  throw error
}

export async function getZonasRiesgoByNivel(nivelRiesgo) {
  const { data, error } = await getSupabaseClient()
    .from('zonas_riesgo_ods')
    .select('*')
    .eq('nivel_riesgo', nivelRiesgo)
    .order('region', { ascending: true })

  if (!error) return data
  if (error.code === '42P01') return readFromLegacyRiskTable(nivelRiesgo)

  throw error
}

export async function getZonasRiesgoOds() {
  return getZonasRiesgo()
}

export async function getZonasRiesgoOdsByNivel(nivelRiesgo) {
  return getZonasRiesgoByNivel(nivelRiesgo)
}
