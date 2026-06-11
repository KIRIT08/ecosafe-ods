create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.perfiles_usuario (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default 'EcoUsuario',
  avatar_url text,
  nivel text not null default 'Aprendiz Sostenible',
  puntos_totales integer not null default 0,
  progreso_ods numeric not null default 0 check (progreso_ods >= 0 and progreso_ods <= 100),
  ods_favoritos integer[] not null default array[4, 6, 11, 12, 13, 15],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_perfiles_usuario_updated_at on public.perfiles_usuario;
create trigger set_perfiles_usuario_updated_at
before update on public.perfiles_usuario
for each row execute function public.set_updated_at();

create table if not exists public.indicadores_ods (
  id uuid primary key default gen_random_uuid(),
  ods_numero integer not null,
  titulo text not null unique,
  categoria text not null,
  valor numeric not null,
  unidad text,
  descripcion text,
  tendencia text,
  color text,
  icono text,
  created_at timestamptz not null default now()
);

create table if not exists public.metricas_mensuales (
  id uuid primary key default gen_random_uuid(),
  tipo_metrica text not null,
  ods_numero integer,
  mes text not null,
  mes_orden integer not null check (mes_orden between 1 and 12),
  anio integer not null,
  valor numeric not null,
  unidad text,
  created_at timestamptz not null default now(),
  unique (tipo_metrica, mes_orden, anio, ods_numero)
);

create table if not exists public.tipos_residuos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null unique,
  porcentaje numeric not null check (porcentaje >= 0),
  color text,
  descripcion text
);

create table if not exists public.emisiones_mensuales (
  id uuid primary key default gen_random_uuid(),
  mes text not null,
  mes_orden integer not null check (mes_orden between 1 and 12),
  anio integer not null,
  toneladas numeric not null check (toneladas >= 0),
  created_at timestamptz not null default now(),
  unique (mes_orden, anio)
);

create table if not exists public.indicadores_radar (
  id uuid primary key default gen_random_uuid(),
  indicador text not null unique,
  valor numeric not null check (valor >= 0 and valor <= 100),
  ods_numero integer,
  orden integer not null default 0
);

create table if not exists public.zonas_riesgo (
  id uuid primary key default gen_random_uuid(),
  region text not null unique,
  latitud numeric not null,
  longitud numeric not null,
  nivel_riesgo text not null check (nivel_riesgo in ('Alto', 'Medio', 'Bajo')),
  tipo_riesgo text not null,
  ods_relacionados integer[] not null default '{}',
  descripcion text,
  recomendacion text,
  fecha_actualizacion date not null default current_date
);

create table if not exists public.preguntas_ods (
  id uuid primary key default gen_random_uuid(),
  pregunta text not null unique,
  opcion_a text not null,
  opcion_b text not null,
  opcion_c text not null,
  opcion_d text not null,
  respuesta_correcta text not null,
  explicacion text,
  ods_relacionado integer not null,
  dificultad text not null default 'facil' check (dificultad in ('facil', 'medio', 'avanzado')),
  tema text,
  opciones jsonb,
  ods_numero integer,
  created_at timestamptz not null default now()
);

create table if not exists public.puntajes_juego (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfiles_usuario(user_id) on delete cascade,
  puntaje integer not null check (puntaje >= 0),
  nivel_alcanzado integer not null default 1,
  vidas_restantes integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists puntajes_juego_puntaje_idx on public.puntajes_juego (puntaje desc);
create index if not exists puntajes_juego_user_id_idx on public.puntajes_juego (user_id);

create table if not exists public.insignias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  descripcion text,
  icono text,
  color text,
  puntos_requeridos integer not null default 0,
  ods_numero integer,
  created_at timestamptz not null default now()
);

create table if not exists public.usuario_insignias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfiles_usuario(user_id) on delete cascade,
  insignia_id uuid not null references public.insignias(id) on delete cascade,
  fecha_obtenida timestamptz not null default now(),
  unique (user_id, insignia_id)
);

create table if not exists public.biblioteca_ods (
  id uuid primary key default gen_random_uuid(),
  titulo text not null unique,
  categoria text not null,
  ods_numero integer not null,
  descripcion text not null,
  contenido text,
  resumen text,
  porque_importa text,
  acciones jsonb not null default '[]'::jsonb,
  ejemplo_cotidiano text,
  reto_practico text,
  fuente_titulo text,
  fuente_url text,
  nivel_lectura text not null default 'basico',
  icono text,
  color text,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.reportes_ods (
  id uuid primary key default gen_random_uuid(),
  titulo text not null unique,
  area_evaluada text not null,
  ods_numero integer,
  cumplimiento numeric not null check (cumplimiento >= 0 and cumplimiento <= 100),
  nivel_riesgo text not null check (nivel_riesgo in ('Alto', 'Medio', 'Bajo')),
  impacto_estimado text,
  hallazgos jsonb not null default '[]'::jsonb,
  recomendaciones jsonb not null default '[]'::jsonb,
  estado text not null default 'Completado',
  created_at timestamptz not null default now()
);

create table if not exists public.actividad_usuario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfiles_usuario(user_id) on delete cascade,
  tipo text not null,
  descripcion text not null,
  puntos integer not null default 0,
  ods_numero integer,
  created_at timestamptz not null default now()
);

create index if not exists actividad_usuario_user_id_idx on public.actividad_usuario (user_id);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles_usuario (user_id, nombre)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', split_part(new.email, '@', 1), 'EcoUsuario')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();
