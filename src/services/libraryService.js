import { getSupabaseClient } from './supabaseClient'

export async function getBibliotecaOds() {
  const { data, error } = await getSupabaseClient()
    .from('biblioteca_ods')
    .select('*')
    .order('ods_numero', { ascending: true })
    .order('orden', { ascending: true })

  if (error) throw error
  return data
}

export async function searchBibliotecaOds(searchTerm) {
  const { data, error } = await getSupabaseClient()
    .from('biblioteca_ods')
    .select('*')
    .or(`titulo.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%,contenido.ilike.%${searchTerm}%`)
    .order('ods_numero', { ascending: true })

  if (error) throw error
  return data
}

export async function getBibliotecaOdsByCategoria(categoria) {
  const { data, error } = await getSupabaseClient()
    .from('biblioteca_ods')
    .select('*')
    .eq('categoria', categoria)
    .order('orden', { ascending: true })

  if (error) throw error
  return data
}
