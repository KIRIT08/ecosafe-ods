import { getSupabaseClient } from './supabaseClient'

export async function getIndicadoresOds() {
  const { data, error } = await getSupabaseClient()
    .from('indicadores_ods')
    .select('*')
    .order('ods_numero', { ascending: true })

  if (error) throw error
  return data
}

export async function getMetricasMensuales(tipoMetrica = 'avance_ods') {
  const { data, error } = await getSupabaseClient()
    .from('metricas_mensuales')
    .select('*')
    .eq('tipo_metrica', tipoMetrica)
    .order('anio', { ascending: true })
    .order('mes_orden', { ascending: true })

  if (error) throw error
  return data
}

export async function getTiposResiduos() {
  const { data, error } = await getSupabaseClient()
    .from('tipos_residuos')
    .select('*')
    .order('porcentaje', { ascending: false })

  if (error) throw error
  return data
}

export async function getEmisionesMensuales() {
  const { data, error } = await getSupabaseClient()
    .from('emisiones_mensuales')
    .select('*')
    .order('anio', { ascending: true })
    .order('mes_orden', { ascending: true })

  if (error) throw error
  return data
}

export async function getIndicadoresRadar() {
  const { data, error } = await getSupabaseClient()
    .from('indicadores_radar')
    .select('*')
    .order('orden', { ascending: true })

  if (error) throw error
  return data
}

export async function getDashboardData() {
  const [indicadoresOds, metricasMensuales, tiposResiduos, emisionesMensuales, indicadoresRadar] =
    await Promise.all([
      getIndicadoresOds(),
      getMetricasMensuales(),
      getTiposResiduos(),
      getEmisionesMensuales(),
      getIndicadoresRadar(),
    ])

  return {
    indicadoresOds,
    metricasMensuales,
    tiposResiduos,
    emisionesMensuales,
    indicadoresRadar,
  }
}
