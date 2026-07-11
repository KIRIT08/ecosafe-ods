create table if not exists public.zonas_riesgo_ods (
  id uuid primary key default gen_random_uuid(),
  region text not null,
  provincia text,
  distrito text,
  latitud numeric not null,
  longitud numeric not null,
  ods integer not null check (ods in (4, 6, 11, 12, 13, 15)),
  problema text not null,
  nivel_riesgo text not null check (nivel_riesgo in ('Alto', 'Medio', 'Bajo')),
  descripcion text not null,
  recomendacion text not null,
  institucion_fuente text not null,
  fuente_url text not null,
  fecha_consulta date not null,
  created_at timestamptz not null default now(),
  unique (region, problema, ods)
);

alter table public.zonas_riesgo_ods enable row level security;

grant select on public.zonas_riesgo_ods to anon, authenticated;

drop policy if exists "Public read zonas riesgo ods" on public.zonas_riesgo_ods;
create policy "Public read zonas riesgo ods"
on public.zonas_riesgo_ods for select
to anon, authenticated
using (true);

insert into public.zonas_riesgo_ods
  (
    region,
    provincia,
    distrito,
    latitud,
    longitud,
    ods,
    problema,
    nivel_riesgo,
    descripcion,
    recomendacion,
    institucion_fuente,
    fuente_url,
    fecha_consulta
  )
values
  (
    'Piura',
    'Piura',
    'Piura',
    -5.1945,
    -80.6328,
    6,
    'Riesgo hidrico e inundaciones',
    'Alto',
    'Zona referenciada por su exposicion a eventos de lluvia intensa, activacion de quebradas y presion sobre servicios de agua y saneamiento.',
    'Reforzar cultura de ahorro de agua, monitoreo comunitario de quebradas y planes familiares ante lluvias intensas.',
    'SENAMHI / Geoservidor MINAM',
    'https://www.senamhi.gob.pe/',
    '2026-06-17'
  ),
  (
    'Lima',
    'Lima',
    'Lima',
    -12.0464,
    -77.0428,
    11,
    'Contaminacion urbana y presion metropolitana',
    'Alto',
    'Capital con alta concentracion urbana, transporte, generacion de residuos y presion sobre calidad ambiental.',
    'Promover movilidad sostenible, segregacion de residuos, areas verdes y consulta ciudadana de indicadores ambientales.',
    'SINIA / MINAM',
    'https://sinia.minam.gob.pe/',
    '2026-06-17'
  ),
  (
    'Loreto',
    'Maynas',
    'Iquitos',
    -3.7491,
    -73.2538,
    15,
    'Deforestacion y presion sobre ecosistemas amazonicos',
    'Alto',
    'Region amazonica prioritaria para observar perdida de cobertura, biodiversidad y presion sobre ecosistemas terrestres.',
    'Impulsar educacion ambiental, vigilancia participativa y restauracion de areas degradadas.',
    'Geoservidor MINAM / GeoBosques',
    'https://geoservidor.minam.gob.pe/',
    '2026-06-17'
  ),
  (
    'Madre de Dios',
    'Tambopata',
    'Tambopata',
    -12.5933,
    -69.1891,
    15,
    'Deforestacion asociada a cambio de uso del suelo',
    'Alto',
    'Zona amazonica usada como caso educativo por presion sobre bosques, biodiversidad y areas degradadas.',
    'Fortalecer vigilancia ambiental, consumo responsable de recursos y difusion de informacion oficial sobre bosques.',
    'Geoservidor MINAM / GeoBosques',
    'https://geoservidor.minam.gob.pe/',
    '2026-06-17'
  ),
  (
    'Arequipa',
    'Arequipa',
    'Arequipa',
    -16.409,
    -71.5375,
    12,
    'Residuos solidos y consumo urbano',
    'Medio',
    'Zona urbana referenciada para trabajar educacion sobre residuos, consumo responsable y segregacion en origen.',
    'Promover reduccion, reutilizacion, reciclaje y lectura de informacion de gestion de residuos.',
    'SINIA / SIGERSOL MINAM',
    'https://sinia.minam.gob.pe/',
    '2026-06-17'
  ),
  (
    'Cusco',
    'Cusco',
    'Cusco',
    -13.5319,
    -71.9675,
    13,
    'Riesgo climatico en zona altoandina',
    'Medio',
    'Region altoandina usada para explicar variabilidad climatica, lluvias, friaje y necesidad de adaptacion territorial.',
    'Revisar avisos meteorologicos, promover preparacion comunitaria y relacionar acciones locales con adaptacion climatica.',
    'SENAMHI',
    'https://www.senamhi.gob.pe/',
    '2026-06-17'
  ),
  (
    'Ancash',
    'Huaraz',
    'Huaraz',
    -9.5278,
    -77.5278,
    13,
    'Riesgo climatico de montana y glaciares',
    'Medio',
    'Zona andina referenciada para explicar efectos del clima en ecosistemas de montana, agua y seguridad de comunidades.',
    'Fortalecer educacion sobre cambio climatico, cuidado de cuencas y preparacion ante eventos de origen natural.',
    'SENAMHI / SINIA',
    'https://sinia.minam.gob.pe/',
    '2026-06-17'
  ),
  (
    'Ucayali',
    'Coronel Portillo',
    'Calleria',
    -8.3791,
    -74.5539,
    15,
    'Perdida de cobertura vegetal',
    'Alto',
    'Region amazonica incluida como caso de seguimiento educativo sobre cobertura forestal y presion sobre ecosistemas.',
    'Promover vigilancia ciudadana, proteccion de bosques y consulta de visores oficiales.',
    'Geoservidor MINAM / GeoBosques',
    'https://geoservidor.minam.gob.pe/',
    '2026-06-17'
  ),
  (
    'Tumbes',
    'Tumbes',
    'Tumbes',
    -3.5669,
    -80.4515,
    6,
    'Lluvias intensas e inundaciones',
    'Medio',
    'Region costera norte usada para explicar riesgos asociados a lluvia, agua, saneamiento y preparacion comunitaria.',
    'Consultar avisos oficiales, proteger fuentes de agua y preparar rutas de evacuacion familiares.',
    'SENAMHI',
    'https://www.senamhi.gob.pe/',
    '2026-06-17'
  ),
  (
    'Callao',
    'Callao',
    'Callao',
    -12.0566,
    -77.1181,
    11,
    'Presion urbana costera',
    'Medio',
    'Zona urbana costera usada para explicar contaminacion, residuos, transporte y relacion con ciudades sostenibles.',
    'Impulsar limpieza de espacios publicos, reciclaje y movilidad responsable en zonas urbanas.',
    'SINIA / Datos Abiertos Peru',
    'https://www.datosabiertos.gob.pe/',
    '2026-06-17'
  )
on conflict (region, problema, ods)
do update set
  provincia = excluded.provincia,
  distrito = excluded.distrito,
  latitud = excluded.latitud,
  longitud = excluded.longitud,
  nivel_riesgo = excluded.nivel_riesgo,
  descripcion = excluded.descripcion,
  recomendacion = excluded.recomendacion,
  institucion_fuente = excluded.institucion_fuente,
  fuente_url = excluded.fuente_url,
  fecha_consulta = excluded.fecha_consulta;
