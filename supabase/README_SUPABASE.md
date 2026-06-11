# Configuracion Supabase - EcoSafe ODS

## 1. Crear proyecto en Supabase

Crear un proyecto nuevo en Supabase y copiar:

- Project URL.
- anon public key.

Luego colocar esos valores en `.env.local`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_publica
```

No subir `.env.local` a GitHub. El archivo `.env.example` queda como plantilla segura.

## 2. Ejecutar SQL

En Supabase SQL Editor ejecutar los archivos en este orden:

1. `schema.sql`
2. `seed.sql`
3. `policies.sql`

## 3. Tablas principales

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

## 4. Auth

El esquema incluye un trigger sobre `auth.users` para crear automaticamente un perfil basico en `perfiles_usuario` cuando se registre un usuario.

## 5. Seguridad

`policies.sql` activa Row Level Security. Las tablas educativas y simuladas son de lectura publica. Las tablas de usuario limitan lectura/escritura al usuario autenticado correspondiente.
