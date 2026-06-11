# EcoSafe ODS

EcoSafe ODS es una plataforma web multimedia enfocada en los Objetivos de Desarrollo Sostenible. El proyecto fue desarrollado para el curso de Programacion Multimedia y prioriza una experiencia visual, animada, interactiva y educativa.

La aplicacion permite aprender sobre sostenibilidad mediante dashboard, mapa interactivo, videojuego Canvas, biblioteca educativa, reportes visuales y perfil gamificado. La informacion principal se obtiene desde Supabase PostgreSQL.

## Objetivo del MVP

Crear una aplicacion React moderna que conecte aprendizaje ambiental, interaccion multimedia y datos persistentes en Supabase.

ODS trabajados:

- ODS 4: Educacion de calidad.
- ODS 6: Agua limpia y saneamiento.
- ODS 11: Ciudades y comunidades sostenibles.
- ODS 12: Produccion y consumo responsables.
- ODS 13: Accion por el clima.
- ODS 15: Vida de ecosistemas terrestres.

## Tecnologias usadas

- React.
- Vite.
- Tailwind CSS.
- JavaScript.
- Supabase Auth.
- Supabase PostgreSQL.
- Supabase Realtime.
- Canvas API.
- Chart.js y react-chartjs-2.
- Leaflet y React Leaflet.
- Framer Motion.
- Lucide React.
- Web Audio API.
- Vercel.

## Funcionalidades principales

- Registro e inicio de sesion real con Supabase Auth.
- Rutas protegidas para usuarios autenticados.
- Inicio con resumen de progreso ODS.
- Dashboard con graficos usando datos desde Supabase.
- Mapa interactivo de riesgos ambientales.
- Videojuego Canvas EcoGuard ODS.
- Guardado de puntajes en Supabase.
- Ranking del videojuego con Realtime.
- Perfil gamificado con puntos, niveles e insignias.
- Biblioteca ODS con contenido educativo y fuentes oficiales en espanol.
- Reportes de Impacto ODS con filtros, hallazgos y recomendaciones.
- Sonidos de interfaz con Web Audio API.
- Diseno responsivo.

## Instalacion

Clonar o abrir el proyecto y entrar a la carpeta:

```bash
cd ecosafe-iso
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en local:

```bash
npm run dev
```

Crear version de produccion:

```bash
npm run build
```

Previsualizar build:

```bash
npm run preview
```

## Variables de entorno

Crear un archivo `.env.local` en la raiz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_publica
```

No subir `.env.local` a GitHub. El archivo ya esta protegido por `.gitignore`.

## Configuracion de Supabase

En Supabase SQL Editor ejecutar los archivos de la carpeta `supabase` en este orden recomendado:

1. `supabase/schema.sql`
2. `supabase/policies.sql`
3. `supabase/seed.sql`

Si la base ya existia antes de las mejoras, ejecutar tambien:

1. `supabase/migracion_preguntas_ods_pedagogicas.sql`
2. `supabase/migracion_biblioteca_ods_enriquecida.sql`

## Tablas principales

- `perfiles_usuario`
- `indicadores_ods`
- `metricas_mensuales`
- `tipos_residuos`
- `emisiones_mensuales`
- `indicadores_radar`
- `zonas_riesgo`
- `preguntas_ods`
- `puntajes_juego`
- `insignias`
- `usuario_insignias`
- `biblioteca_ods`
- `reportes_ods`
- `actividad_usuario`

## Despliegue en Vercel

1. Subir el proyecto a GitHub.
2. Crear un nuevo proyecto en Vercel.
3. Seleccionar el repositorio.
4. Configurar estas variables en Vercel:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_publica
```

5. Usar la configuracion por defecto:

- Framework: Vite.
- Build Command: `npm run build`.
- Output Directory: `dist`.

## Fuentes oficiales

La Biblioteca ODS usa enlaces oficiales en espanol, principalmente de Naciones Unidas:

- https://www.un.org/es/impacto-acad%C3%A9mico/page/educaci%C3%B3n-de-calidad
- https://www.un.org/es/global-issues/water
- https://www.un.org/sustainabledevelopment/es/cities/
- https://www.un.org/sustainabledevelopment/es/sustainable-consumption-production/
- https://www.un.org/es/global-issues/climate-change
- https://www.un.org/sustainabledevelopment/es/2023/08/explainer-what-is-biodiversity/

## Notas importantes

- El acceso interno requiere Supabase Auth real.
- El boton temporal de modo demo fue retirado para la entrega final.
- `localStorage` solo se usa para preferencias menores, como activar o desactivar sonido.
- Los datos principales deben venir desde Supabase PostgreSQL.
- La carpeta `dist` se genera con `npm run build` y no debe editarse manualmente.
