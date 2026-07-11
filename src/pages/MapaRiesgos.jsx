import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, Leaf, MapPinned, RefreshCw } from 'lucide-react'
import RiskMap from '../components/map/RiskMap'
import RiskSummaryPanel from '../components/map/RiskSummaryPanel'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { getZonasRiesgo } from '../services/mapService'

const demoZones = [
  {
    id: 'demo-piura',
    region: 'Piura',
    provincia: 'Piura',
    distrito: 'Piura',
    latitud: -5.1945,
    longitud: -80.6328,
    ods: 6,
    nivel_riesgo: 'Alto',
    problema: 'Riesgo hidrico e inundaciones',
    descripcion: 'Zona referenciada por lluvia intensa, activacion de quebradas y presion sobre agua y saneamiento.',
    recomendacion: 'Reforzar ahorro de agua, monitoreo comunitario y preparacion ante lluvias.',
    institucion_fuente: 'SENAMHI / Geoservidor MINAM',
    fuente_url: 'https://www.senamhi.gob.pe/',
    fecha_consulta: '2026-06-17',
  },
  {
    id: 'demo-lima',
    region: 'Lima',
    provincia: 'Lima',
    distrito: 'Lima',
    latitud: -12.0464,
    longitud: -77.0428,
    ods: 11,
    nivel_riesgo: 'Alto',
    problema: 'Contaminacion urbana y presion metropolitana',
    descripcion: 'Capital con alta concentracion urbana, transporte, residuos y presion sobre calidad ambiental.',
    recomendacion: 'Promover movilidad sostenible, segregacion de residuos y consulta de indicadores ambientales.',
    institucion_fuente: 'SINIA / MINAM',
    fuente_url: 'https://sinia.minam.gob.pe/',
    fecha_consulta: '2026-06-17',
  },
  {
    id: 'demo-loreto',
    region: 'Loreto',
    provincia: 'Maynas',
    distrito: 'Iquitos',
    latitud: -3.7491,
    longitud: -73.2538,
    ods: 15,
    nivel_riesgo: 'Alto',
    problema: 'Deforestacion y presion sobre ecosistemas amazonicos',
    descripcion: 'Region amazonica prioritaria para observar cobertura vegetal, biodiversidad y ecosistemas.',
    recomendacion: 'Impulsar educacion ambiental, vigilancia participativa y restauracion.',
    institucion_fuente: 'Geoservidor MINAM / GeoBosques',
    fuente_url: 'https://geoservidor.minam.gob.pe/',
    fecha_consulta: '2026-06-17',
  },
  {
    id: 'demo-cusco',
    region: 'Cusco',
    provincia: 'Cusco',
    distrito: 'Cusco',
    latitud: -13.5319,
    longitud: -71.9675,
    ods: 13,
    nivel_riesgo: 'Medio',
    problema: 'Riesgo climatico en zona altoandina',
    descripcion: 'Region altoandina usada para explicar variabilidad climatica, lluvias y adaptacion territorial.',
    recomendacion: 'Revisar avisos meteorologicos y promover preparacion comunitaria.',
    institucion_fuente: 'SENAMHI',
    fuente_url: 'https://www.senamhi.gob.pe/',
    fecha_consulta: '2026-06-17',
  },
  {
    id: 'demo-arequipa',
    region: 'Arequipa',
    provincia: 'Arequipa',
    distrito: 'Arequipa',
    latitud: -16.409,
    longitud: -71.5375,
    ods: 12,
    nivel_riesgo: 'Medio',
    problema: 'Residuos solidos y consumo urbano',
    descripcion: 'Zona urbana referenciada para trabajar educacion sobre residuos, consumo responsable y segregacion.',
    recomendacion: 'Promover reduccion, reutilizacion, reciclaje y gestion de residuos.',
    institucion_fuente: 'SINIA / SIGERSOL MINAM',
    fuente_url: 'https://sinia.minam.gob.pe/',
    fecha_consulta: '2026-06-17',
  },
  {
    id: 'demo-ucayali',
    region: 'Ucayali',
    provincia: 'Coronel Portillo',
    distrito: 'Calleria',
    latitud: -8.3791,
    longitud: -74.5539,
    ods: 15,
    nivel_riesgo: 'Alto',
    problema: 'Perdida de cobertura vegetal',
    descripcion: 'Region amazonica incluida como caso educativo sobre cobertura forestal y presion sobre ecosistemas.',
    recomendacion: 'Promover vigilancia ciudadana, proteccion de bosques y consulta de visores oficiales.',
    institucion_fuente: 'Geoservidor MINAM / GeoBosques',
    fuente_url: 'https://geoservidor.minam.gob.pe/',
    fecha_consulta: '2026-06-17',
  },
]

function normalizeZones(zones) {
  return zones
    .filter((zone) => zone.latitud && zone.longitud)
    .map((zone) => ({
      ...zone,
      latitud: Number(zone.latitud),
      longitud: Number(zone.longitud),
      ods: Number(zone.ods || zone.ods_relacionados?.[0] || 0),
      problema: zone.problema || zone.tipo_riesgo || 'Problema ambiental',
      fuente_url: zone.fuente_url || '',
      institucion_fuente: zone.institucion_fuente || 'Referencia educativa',
    }))
}

function uniqueValues(items, getter) {
  return [...new Set(items.map(getter).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)))
}

function MapaRiesgos() {
  const { isDemoMode, isSupabaseConfigured } = useAuth()
  const [zones, setZones] = useState(isDemoMode ? demoZones : [])
  const [loading, setLoading] = useState(!isDemoMode)
  const [error, setError] = useState('')
  const [selectedOds, setSelectedOds] = useState('Todos')
  const [selectedRisk, setSelectedRisk] = useState('Todos')
  const [selectedRegion, setSelectedRegion] = useState('Todos')
  const [selectedProblem, setSelectedProblem] = useState('Todos')
  const [selectedZone, setSelectedZone] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadZones() {
      if (isDemoMode) {
        setZones(demoZones)
        setLoading(false)
        setError('')
        return
      }

      if (!isSupabaseConfigured) {
        setLoading(false)
        setError('No se pudo conectar con los datos del mapa.')
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await getZonasRiesgo()

        if (!mounted) return
        setZones(normalizeZones(data))
      } catch (loadError) {
        if (!mounted) return
        setError(loadError.message || 'No se pudo cargar el mapa.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadZones()

    return () => {
      mounted = false
    }
  }, [isDemoMode, isSupabaseConfigured])

  const safeZones = useMemo(
    () => (zones.length ? normalizeZones(zones) : isDemoMode ? demoZones : []),
    [isDemoMode, zones],
  )

  const filterOptions = useMemo(
    () => ({
      ods: uniqueValues(safeZones, (zone) => zone.ods).filter(Boolean),
      regions: uniqueValues(safeZones, (zone) => zone.region),
      problems: uniqueValues(safeZones, (zone) => zone.problema),
    }),
    [safeZones],
  )

  const filteredZones = useMemo(
    () =>
      safeZones.filter((zone) => {
        const matchesOds = selectedOds === 'Todos' || Number(zone.ods) === Number(selectedOds)
        const matchesRisk = selectedRisk === 'Todos' || zone.nivel_riesgo === selectedRisk
        const matchesRegion = selectedRegion === 'Todos' || zone.region === selectedRegion
        const matchesProblem = selectedProblem === 'Todos' || zone.problema === selectedProblem

        return matchesOds && matchesRisk && matchesRegion && matchesProblem
      }),
    [safeZones, selectedOds, selectedProblem, selectedRegion, selectedRisk],
  )

  const visibleSelectedZone = useMemo(() => {
    if (!filteredZones.length) return null
    if (selectedZone && filteredZones.some((zone) => zone.id === selectedZone.id)) {
      return selectedZone
    }

    return filteredZones[0]
  }, [filteredZones, selectedZone])

  function resetFilters() {
    setSelectedOds('Todos')
    setSelectedRisk('Todos')
    setSelectedRegion('Todos')
    setSelectedProblem('Todos')
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_24rem]">
      <div className="space-y-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge icon={Leaf}>Mapa ODS Peru</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-normal text-white">
              Mapa ODS de problemáticas ambientales
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Explora zonas del Peru con problemas ambientales referenciados desde SINIA,
              MINAM, SENAMHI y Datos Abiertos.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300">
            {loading ? 'Cargando mapa...' : isDemoMode ? 'Modo demo visual' : 'Datos actualizados'}
          </div>
        </header>

        {error && (
          <Card className="border-amber-300/30 bg-amber-400/10">
            <p className="text-sm font-semibold leading-6 text-amber-100">
              No se pudo cargar toda la data del mapa: {error}
            </p>
          </Card>
        )}

        <Card className="p-4">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-lime-300">
                <Filter className="size-4" />
                Filtros del mapa
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">
                {filteredZones.length} zona{filteredZones.length === 1 ? '' : 's'} visible
                {safeZones.length ? ` de ${safeZones.length}` : ''}.
              </p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-black text-slate-200 transition hover:bg-white/10"
            >
              <RefreshCw className="size-4" />
              Limpiar
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-400">ODS</span>
              <select
                value={selectedOds}
                onChange={(event) => setSelectedOds(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-slate-950/55 px-3 text-sm font-bold text-white outline-none"
              >
                <option>Todos</option>
                {filterOptions.ods.map((ods) => (
                  <option key={ods} value={ods}>
                    ODS {ods}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-400">Riesgo</span>
              <select
                value={selectedRisk}
                onChange={(event) => setSelectedRisk(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-slate-950/55 px-3 text-sm font-bold text-white outline-none"
              >
                {['Todos', 'Alto', 'Medio', 'Bajo'].map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-400">Region</span>
              <select
                value={selectedRegion}
                onChange={(event) => setSelectedRegion(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-slate-950/55 px-3 text-sm font-bold text-white outline-none"
              >
                <option>Todos</option>
                {filterOptions.regions.map((region) => (
                  <option key={region}>{region}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-400">Problema</span>
              <select
                value={selectedProblem}
                onChange={(event) => setSelectedProblem(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-slate-950/55 px-3 text-sm font-bold text-white outline-none"
              >
                <option>Todos</option>
                {filterOptions.problems.map((problem) => (
                  <option key={problem}>{problem}</option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="glass-panel relative overflow-hidden rounded-lg p-5"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,197,94,0.18),transparent_18rem),linear-gradient(145deg,rgba(14,116,144,0.14),rgba(6,24,38,0.08))]" />
          <div className="relative">
            <RiskMap
              zones={filteredZones}
              onZoneSelect={setSelectedZone}
              selectedZone={visibleSelectedZone}
            />
          </div>
          <div className="relative mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/45 px-4 py-3 text-xs font-medium leading-5 text-slate-400">
            <MapPinned className="size-4 shrink-0 text-emerald-300" />
            Datos resumidos en Supabase. Cada punto muestra fuente institucional y fecha
            de consulta. No se guardan archivos pesados ni capas geoespaciales completas.
          </div>
        </motion.div>

      </div>

      <RiskSummaryPanel zones={filteredZones} selectedZone={visibleSelectedZone} />
    </section>
  )
}

export default MapaRiesgos
