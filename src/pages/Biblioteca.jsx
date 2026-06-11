import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Droplets,
  ExternalLink,
  GraduationCap,
  Leaf,
  MapPin,
  Recycle,
  Search,
  ShieldCheck,
  Sparkles,
  Trees,
  X,
} from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { getBibliotecaOds } from '../services/libraryService'

const demoLibrary = [
  {
    id: 'demo-ods-4',
    titulo: 'ODS 4: Educacion de calidad',
    categoria: 'Educacion',
    ods_numero: 4,
    descripcion: 'Aprendizaje para construir comunidades sostenibles.',
    contenido:
      'La educacion de calidad ayuda a comprender problemas ambientales y tomar mejores decisiones en casa, escuela y comunidad.',
    resumen: 'Todas las personas deben tener oportunidades para aprender.',
    porque_importa:
      'La educacion ayuda a comprender problemas ambientales y participar mejor en la comunidad.',
    acciones: ['Leer sobre un ODS', 'Compartir lo aprendido', 'Hacer una pregunta'],
    ejemplo_cotidiano: 'En clase puedes explicar una accion sostenible con tus palabras.',
    reto_practico: 'Ensenale a alguien una accion sostenible que aprendiste hoy.',
    fuente_titulo: 'Naciones Unidas - Educacion de calidad',
    fuente_url: 'https://www.un.org/es/impacto-acad%C3%A9mico/page/educaci%C3%B3n-de-calidad',
    nivel_lectura: 'basico',
    color: '#38bdf8',
    orden: 1,
  },
  {
    id: 'demo-ods-6',
    titulo: 'ODS 6: Agua limpia y saneamiento',
    categoria: 'Agua',
    ods_numero: 6,
    descripcion: 'Acciones para proteger el agua y usarla responsablemente.',
    contenido:
      'Cuidar el agua significa ahorrar, evitar contaminar rios y valorar el acceso seguro para todas las personas.',
    resumen: 'El agua limpia es necesaria para la salud, la higiene y la vida diaria.',
    porque_importa:
      'Sin agua segura, las personas pueden enfermar y las comunidades tienen mas dificultades.',
    acciones: ['Cerrar el cano', 'No tirar basura al agua', 'Avisar si ves una fuga'],
    ejemplo_cotidiano: 'Cerrar el cano mientras te cepillas ayuda a ahorrar agua.',
    reto_practico: 'Identifica tres formas de ahorrar agua durante el dia.',
    fuente_titulo: 'Naciones Unidas - Agua',
    fuente_url: 'https://www.un.org/es/global-issues/water',
    nivel_lectura: 'basico',
    color: '#22c55e',
    orden: 2,
  },
  {
    id: 'demo-ods-11',
    titulo: 'ODS 11: Ciudades sostenibles',
    categoria: 'Ciudades',
    ods_numero: 11,
    descripcion: 'Ideas para comunidades seguras, inclusivas y sostenibles.',
    contenido:
      'Una ciudad sostenible reduce residuos, cuida areas verdes y promueve espacios seguros para vivir.',
    resumen: 'Una ciudad sostenible cuida sus espacios y mejora la vida de sus habitantes.',
    porque_importa:
      'Las ciudades concentran personas, residuos y transporte; por eso necesitan orden y cuidado ambiental.',
    acciones: ['Usar tachos correctos', 'Cuidar parques', 'Respetar espacios publicos'],
    ejemplo_cotidiano: 'Mantener limpio un parque ayuda a que mas personas lo usen con seguridad.',
    reto_practico: 'Observa tu calle y escribe una mejora sostenible posible.',
    fuente_titulo: 'Naciones Unidas - Ciudades',
    fuente_url: 'https://www.un.org/sustainabledevelopment/es/cities/',
    nivel_lectura: 'basico',
    color: '#facc15',
    orden: 3,
  },
  {
    id: 'demo-ods-12',
    titulo: 'ODS 12: Consumo responsable',
    categoria: 'Consumo',
    ods_numero: 12,
    descripcion: 'Buenas practicas de reduccion, reutilizacion y reciclaje.',
    contenido:
      'Consumir responsablemente implica comprar lo necesario, reciclar y reducir residuos desde acciones cotidianas.',
    resumen: 'Consumir responsablemente significa usar solo lo necesario y reducir desperdicios.',
    porque_importa:
      'Cada producto usa agua, energia y materiales; consumir mejor reduce impacto ambiental.',
    acciones: ['Separar residuos', 'Reutilizar materiales', 'Evitar compras innecesarias'],
    ejemplo_cotidiano: 'Una botella limpia puede ir al reciclaje en lugar de la basura comun.',
    reto_practico: 'Separa tres residuos correctamente durante el dia.',
    fuente_titulo: 'Naciones Unidas - Consumo y produccion sostenibles',
    fuente_url: 'https://www.un.org/sustainabledevelopment/es/sustainable-consumption-production/',
    nivel_lectura: 'basico',
    color: '#86efac',
    orden: 4,
  },
  {
    id: 'demo-ods-13',
    titulo: 'ODS 13: Accion por el clima',
    categoria: 'Clima',
    ods_numero: 13,
    descripcion: 'Medidas para reducir emisiones y adaptarse al cambio climatico.',
    contenido:
      'La accion climatica empieza con ahorro de energia, movilidad sostenible y cuidado del entorno.',
    resumen: 'La accion por el clima busca reducir danos causados por el cambio climatico.',
    porque_importa:
      'El clima afecta el agua, los alimentos, la salud y la seguridad de las personas.',
    acciones: ['Apagar luces', 'Caminar cuando sea posible', 'Cuidar areas verdes'],
    ejemplo_cotidiano: 'Apagar una luz innecesaria ayuda a ahorrar energia.',
    reto_practico: 'Durante una tarde, apaga aparatos que no estes usando.',
    fuente_titulo: 'Naciones Unidas - Cambio climatico',
    fuente_url: 'https://www.un.org/es/global-issues/climate-change',
    nivel_lectura: 'basico',
    color: '#22c55e',
    orden: 5,
  },
  {
    id: 'demo-ods-15',
    titulo: 'ODS 15: Ecosistemas terrestres',
    categoria: 'Ecosistemas',
    ods_numero: 15,
    descripcion: 'Proteccion de bosques, suelos y biodiversidad.',
    contenido:
      'Cuidar ecosistemas terrestres protege animales, plantas, suelos y el equilibrio natural.',
    resumen: 'Los ecosistemas terrestres incluyen bosques, suelos, animales y plantas.',
    porque_importa:
      'La biodiversidad mantiene el equilibrio natural y ayuda a tener aire, agua y alimentos.',
    acciones: ['Cuidar plantas', 'No danar arboles', 'Evitar basura en areas verdes'],
    ejemplo_cotidiano: 'Cuidar una planta o un arbol ayuda a proteger la vida terrestre.',
    reto_practico: 'Identifica un arbol o planta cercana y piensa como cuidarla.',
    fuente_titulo: 'Naciones Unidas - Biodiversidad',
    fuente_url: 'https://www.un.org/sustainabledevelopment/es/2023/08/explainer-what-is-biodiversity/',
    nivel_lectura: 'basico',
    color: '#14b8a6',
    orden: 6,
  },
]

const iconByOds = {
  4: GraduationCap,
  6: Droplets,
  11: MapPin,
  12: Recycle,
  13: Leaf,
  15: Trees,
}

const enrichmentByOds = {
  4: {
    resumen: 'Todas las personas deben tener oportunidades para aprender.',
    porque_importa:
      'La educacion ayuda a comprender problemas ambientales, participar mejor en la comunidad y tomar decisiones responsables.',
    acciones: ['Leer sobre un ODS', 'Compartir lo aprendido', 'Hacer una pregunta'],
    ejemplo_cotidiano: 'En clase puedes explicar una accion sostenible con tus palabras.',
    reto_practico: 'Ensenale a alguien una accion sostenible que aprendiste hoy.',
    fuente_titulo: 'Naciones Unidas - Educacion de calidad',
    fuente_url: 'https://www.un.org/es/impacto-acad%C3%A9mico/page/educaci%C3%B3n-de-calidad',
    nivel_lectura: 'basico',
  },
  6: {
    resumen: 'El agua limpia es necesaria para la salud, la higiene y la vida diaria.',
    porque_importa:
      'Sin agua segura, las personas pueden enfermar y las comunidades tienen mas dificultades para vivir bien.',
    acciones: ['Cerrar el cano', 'No tirar basura al agua', 'Avisar si ves una fuga'],
    ejemplo_cotidiano: 'Cerrar el cano mientras te cepillas ayuda a ahorrar agua.',
    reto_practico: 'Identifica tres formas de ahorrar agua durante el dia.',
    fuente_titulo: 'Naciones Unidas - Agua',
    fuente_url: 'https://www.un.org/es/global-issues/water',
    nivel_lectura: 'basico',
  },
  11: {
    resumen: 'Una ciudad sostenible cuida sus espacios y mejora la vida de sus habitantes.',
    porque_importa:
      'Las ciudades concentran personas, residuos y transporte; por eso necesitan orden, seguridad y cuidado ambiental.',
    acciones: ['Usar tachos correctos', 'Cuidar parques', 'Respetar espacios publicos'],
    ejemplo_cotidiano: 'Mantener limpio un parque ayuda a que mas personas lo usen con seguridad.',
    reto_practico: 'Observa tu calle y escribe una mejora sostenible posible.',
    fuente_titulo: 'Naciones Unidas - Ciudades',
    fuente_url: 'https://www.un.org/sustainabledevelopment/es/cities/',
    nivel_lectura: 'basico',
  },
  12: {
    resumen: 'Consumir responsablemente significa usar solo lo necesario y reducir desperdicios.',
    porque_importa:
      'Cada producto usa agua, energia y materiales; si consumimos mejor, reducimos impacto ambiental.',
    acciones: ['Separar residuos', 'Reutilizar materiales', 'Evitar compras innecesarias'],
    ejemplo_cotidiano: 'Una botella limpia puede ir al reciclaje en lugar de la basura comun.',
    reto_practico: 'Separa tres residuos correctamente durante el dia.',
    fuente_titulo: 'Naciones Unidas - Consumo y produccion sostenibles',
    fuente_url: 'https://www.un.org/sustainabledevelopment/es/sustainable-consumption-production/',
    nivel_lectura: 'basico',
  },
  13: {
    resumen: 'La accion por el clima busca reducir danos causados por el cambio climatico.',
    porque_importa:
      'El clima afecta el agua, los alimentos, la salud y la seguridad de las personas.',
    acciones: ['Apagar luces', 'Caminar cuando sea posible', 'Cuidar areas verdes'],
    ejemplo_cotidiano: 'Apagar una luz innecesaria ayuda a ahorrar energia.',
    reto_practico: 'Durante una tarde, apaga aparatos que no estes usando.',
    fuente_titulo: 'Naciones Unidas - Cambio climatico',
    fuente_url: 'https://www.un.org/es/global-issues/climate-change',
    nivel_lectura: 'basico',
  },
  15: {
    resumen: 'Los ecosistemas terrestres incluyen bosques, suelos, animales y plantas.',
    porque_importa:
      'La biodiversidad mantiene el equilibrio natural y ayuda a que las personas tengan aire, agua y alimentos.',
    acciones: ['Cuidar plantas', 'No danar arboles', 'Evitar basura en areas verdes'],
    ejemplo_cotidiano: 'Cuidar una planta o un arbol ayuda a proteger la vida terrestre.',
    reto_practico: 'Identifica un arbol o planta cercana y piensa como cuidarla.',
    fuente_titulo: 'Naciones Unidas - Biodiversidad',
    fuente_url: 'https://www.un.org/sustainabledevelopment/es/2023/08/explainer-what-is-biodiversity/',
    nivel_lectura: 'basico',
  },
}

function normalizeText(text) {
  return String(text || '').toLowerCase()
}

function getActions(item) {
  if (Array.isArray(item.acciones)) return item.acciones

  try {
    const parsed = JSON.parse(item.acciones || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function enrichItem(item) {
  const fallback = enrichmentByOds[item?.ods_numero] || {}
  const actions = getActions(item)

  return {
    ...item,
    resumen: item?.resumen || fallback.resumen || item?.descripcion,
    porque_importa: item?.porque_importa || fallback.porque_importa || item?.contenido,
    acciones: actions.length ? actions : fallback.acciones || [],
    ejemplo_cotidiano:
      item?.ejemplo_cotidiano ||
      fallback.ejemplo_cotidiano ||
      'Aplica una accion pequena relacionada con este ODS en casa o en clase.',
    reto_practico:
      item?.reto_practico ||
      fallback.reto_practico ||
      'Completa una accion sostenible relacionada con este ODS durante el dia.',
    fuente_titulo: item?.fuente_titulo || fallback.fuente_titulo || 'Fuente oficial en espanol',
    fuente_url: item?.fuente_url || fallback.fuente_url,
    nivel_lectura: item?.nivel_lectura || fallback.nivel_lectura || 'basico',
  }
}

function Biblioteca() {
  const { isDemoMode, isSupabaseConfigured } = useAuth()
  const [items, setItems] = useState(isDemoMode ? demoLibrary : [])
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(!isDemoMode)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadLibrary() {
      if (isDemoMode) {
        setItems(demoLibrary.map(enrichItem))
        setLoading(false)
        setError('')
        return
      }

      if (!isSupabaseConfigured) {
        setLoading(false)
        setError('No se pudo cargar la biblioteca educativa.')
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await getBibliotecaOds()

        if (!mounted) return
        setItems(data.map(enrichItem))
      } catch (loadError) {
        if (!mounted) return
        setError(loadError.message || 'No se pudo cargar la biblioteca educativa.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadLibrary()

    return () => {
      mounted = false
    }
  }, [isDemoMode, isSupabaseConfigured])

  const categories = useMemo(() => {
    const counts = items.reduce(
      (accumulator, item) => {
        accumulator.Todos += 1
        accumulator[item.categoria] = (accumulator[item.categoria] || 0) + 1
        return accumulator
      },
      { Todos: 0 },
    )

    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [items])

  const filteredItems = useMemo(() => {
    const query = normalizeText(searchTerm)

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Todos' || item.categoria === selectedCategory
      const matchesSearch =
        !query ||
        [item.titulo, item.descripcion, item.contenido, item.categoria, `ODS ${item.ods_numero}`]
          .map(normalizeText)
          .some((value) => value.includes(query))

      return matchesCategory && matchesSearch
    })
  }, [items, searchTerm, selectedCategory])

  const detailItem = selectedItem ? enrichItem(selectedItem) : null

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <header>
          <Badge icon={BookOpen}>Conocimiento ODS</Badge>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-white">Biblioteca ODS</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Recursos educativos breves sobre sostenibilidad, ambiente y acciones cotidianas.
          </p>
        </header>

        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-12 w-full rounded-lg border border-white/10 bg-slate-950/55 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/40"
            placeholder="Buscar tema, ODS o accion..."
          />
        </div>
      </div>

      {error && (
        <Card className="border-amber-300/30 bg-amber-400/10">
          <p className="text-sm font-semibold leading-6 text-amber-100">
            No se pudo cargar toda la biblioteca: {error}
          </p>
        </Card>
      )}

      <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
        <aside className="glass-panel rounded-lg p-5">
          <p className="mb-4 text-sm font-black uppercase tracking-wide text-slate-300">
            Filtrar por categoria
          </p>
          <div className="space-y-2">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedCategory(item.name)}
                className={[
                  'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-bold transition',
                  selectedCategory === item.name
                    ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:bg-emerald-400/10',
                ].join(' ')}
              >
                {item.name === 'Todos' ? 'Todos los temas' : item.name}
                <span className="rounded-full bg-slate-950/50 px-2 py-1 text-xs">{item.count}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-lime-300/20 bg-lime-400/10 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-lime-100">
              <Sparkles className="size-4" />
              Lectura rapida
            </p>
            <p className="mt-2 text-xs font-semibold leading-5 text-lime-100/70">
              Selecciona una card para ver contenido, accion sugerida y ODS relacionado.
            </p>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-400">
              {loading
                ? 'Cargando recursos...'
                : `${filteredItems.length} recurso${filteredItems.length === 1 ? '' : 's'} encontrado${filteredItems.length === 1 ? '' : 's'}`}
            </p>
            <Badge variant="sky">{isDemoMode ? 'Modo demo visual' : 'Contenido actualizado'}</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item, index) => {
              const Icon = iconByOds[item.ods_numero] || ShieldCheck

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.32 }}
                  className="glass-panel flex min-h-80 flex-col rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/35"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="grid size-16 place-items-center rounded-lg border border-white/10 text-lime-100"
                      style={{ backgroundColor: `${item.color || '#22c55e'}22` }}
                    >
                      <Icon className="size-8" />
                    </div>
                    <Badge variant="lime">ODS {item.ods_numero}</Badge>
                  </div>

                  <h2 className="mt-6 text-xl font-black tracking-normal text-white">
                    {item.titulo}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{item.descripcion}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-slate-300">
                      {item.categoria}
                    </span>
                    <Button variant="secondary" onClick={() => setSelectedItem(enrichItem(item))}>
                      Leer mas
                    </Button>
                  </div>
                </motion.article>
              )
            })}
          </div>

          {!loading && filteredItems.length === 0 && (
            <div className="glass-panel rounded-lg p-8 text-center">
              <BookOpen className="mx-auto size-12 text-slate-500" />
              <p className="mt-4 text-lg font-black text-white">No hay recursos con ese filtro</p>
              <p className="mt-2 text-sm text-slate-400">
                Prueba con otra categoria o una palabra mas simple.
              </p>
            </div>
          )}
        </div>
      </div>

      {detailItem && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 px-4 backdrop-blur-md">
          <motion.article
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-emerald-300/25 bg-slate-950/95 p-6 shadow-2xl shadow-emerald-950/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge icon={BookOpen}>ODS {detailItem.ods_numero}</Badge>
                <h2 className="mt-4 text-2xl font-black tracking-normal text-white">
                  {detailItem.titulo}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar detalle"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mt-4 text-base leading-7 text-slate-300">
              {detailItem.resumen || detailItem.descripcion}
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-black uppercase tracking-wide text-emerald-200">
                  Por que importa
                </p>
                <p className="mt-3 leading-7 text-slate-300">
                  {detailItem.porque_importa ||
                    detailItem.contenido ||
                    'Este recurso refuerza acciones sostenibles cotidianas.'}
                </p>
              </div>

              <div className="rounded-lg border border-sky-300/20 bg-sky-400/10 p-5">
                <p className="text-sm font-black uppercase tracking-wide text-sky-100">
                  Ejemplo cotidiano
                </p>
                <p className="mt-3 leading-7 text-sky-100/80">
                  {detailItem.ejemplo_cotidiano ||
                    'Aplica una accion pequena relacionada con este ODS en casa o en clase.'}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-lime-300/20 bg-lime-400/10 p-5">
                <p className="text-sm font-black text-lime-100">Acciones que puedes hacer</p>
                <ul className="mt-3 space-y-2">
                  {getActions(detailItem).map((action) => (
                    <li key={action} className="flex gap-2 text-sm font-semibold text-lime-100/80">
                      <span className="mt-1 size-2 rounded-full bg-lime-300" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-lime-300/20 bg-lime-400/10 p-4">
                <p className="text-sm font-black text-lime-100">Reto EcoGuard</p>
                <p className="mt-2 text-sm leading-6 text-lime-100/75">
                  {detailItem.reto_practico ||
                    'Completa una accion sostenible relacionada con este ODS durante el dia.'}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-white">
                  {detailItem.fuente_titulo || 'Fuente oficial en espanol'}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Categoria: {detailItem.categoria} - Lectura {detailItem.nivel_lectura || 'basica'}
                </p>
              </div>
              {detailItem.fuente_url && (
                <a
                  href={detailItem.fuente_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-5 text-sm font-black text-emerald-100 transition hover:bg-emerald-400/15"
                >
                  Ver fuente oficial
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>
          </motion.article>
        </div>
      )}
    </section>
  )
}

export default Biblioteca
