import { getSupabaseClient } from './supabaseClient'

export async function getReportesOds() {
  const { data, error } = await getSupabaseClient()
    .from('reportes_ods')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getReportesOdsByNivel(nivelRiesgo) {
  const { data, error } = await getSupabaseClient()
    .from('reportes_ods')
    .select('*')
    .eq('nivel_riesgo', nivelRiesgo)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getReporteOdsById(id) {
  const { data, error } = await getSupabaseClient()
    .from('reportes_ods')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
