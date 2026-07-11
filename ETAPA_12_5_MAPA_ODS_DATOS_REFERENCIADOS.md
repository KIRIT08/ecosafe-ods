# Etapa 12.5: Mapa ODS con datos reales o referenciados

## Objetivo

Convertir el mapa en una herramienta interactiva ODS sobre problematicas ambientales del Peru, usando datos resumidos en Supabase y referencias de instituciones oficiales.

## Enfoque aplicado

No se guardan archivos pesados, capas completas ni datasets grandes en Supabase. La base solo guarda registros livianos:

- region
- ubicacion aproximada
- ODS relacionado
- problema ambiental
- nivel de riesgo
- descripcion
- recomendacion
- institucion fuente
- enlace fuente
- fecha de consulta

Esto evita saturar el limite de almacenamiento y mantiene el mapa conectado a Supabase PostgreSQL.

## Fuentes usadas como referencia

- SINIA / MINAM: informacion ambiental, mapas, indicadores y tematicas como agua, aire, biodiversidad, residuos y cambio climatico.
- Geoservidor MINAM: informacion territorial, ecosistemas, deforestacion, riesgos, GeoBosques y visualizadores geograficos.
- SENAMHI: avisos meteorologicos, indicadores meteorologicos e hidrologicos, reportes y clima.
- Datos Abiertos Peru: catalogo de datasets del Estado peruano, incluyendo medio ambiente y recursos naturales.

## Nueva tabla

Se creo la migracion:

```txt
supabase/migracion_mapa_ods_datos_referenciados.sql
```

Tabla:

```txt
zonas_riesgo_ods
```

Campos principales:

```txt
id
region
provincia
distrito
latitud
longitud
ods
problema
nivel_riesgo
descripcion
recomendacion
institucion_fuente
fuente_url
fecha_consulta
```

## Cambios en frontend

- El mapa consulta `zonas_riesgo_ods` desde Supabase.
- Si la nueva tabla aun no existe, el servicio intenta leer temporalmente la tabla antigua `zonas_riesgo`.
- Se agregaron filtros por ODS, region, nivel de riesgo y tipo de problema.
- Se agrego busqueda por region, problema, recomendacion, fuente u ODS.
- Se agregaron chips rapidos para explorar zonas criticas, agua, ciudades, consumo, clima y ecosistemas.
- Se agrego filtro por institucion fuente.
- Se agrego panel lateral con detalle de zona seleccionada.
- Se mantuvo la interaccion principal desde marcadores y panel lateral para evitar saturar la interfaz.
- El mapa enfoca con animacion la zona seleccionada.
- Se agrego boton "Ver fuente".
- Se agregaron fuentes e institucion de referencia en popups.
- Se actualizo el texto para indicar que son datos resumidos y referenciados.

## Zonas iniciales

La migracion incluye casos educativos referenciados para:

- Piura: ODS 6, riesgo hidrico e inundaciones.
- Lima: ODS 11, contaminacion urbana.
- Loreto: ODS 15, deforestacion y ecosistemas.
- Madre de Dios: ODS 15, deforestacion.
- Arequipa: ODS 12, residuos solidos.
- Cusco: ODS 13, riesgo climatico.
- Ancash: ODS 13, riesgo climatico de montana.
- Ucayali: ODS 15, cobertura vegetal.
- Tumbes: ODS 6, lluvias e inundaciones.
- Callao: ODS 11, presion urbana costera.

## Nota de transparencia

Los registros son resumidos y referenciados para fines educativos. No se presentan como monitoreo en tiempo real ni como dataset tecnico oficial completo.
