alter table public.preguntas_ods
  add column if not exists opcion_a text,
  add column if not exists opcion_b text,
  add column if not exists opcion_c text,
  add column if not exists opcion_d text,
  add column if not exists ods_relacionado integer;

alter table public.preguntas_ods
  drop constraint if exists preguntas_ods_dificultad_check;

update public.preguntas_ods
set
  opcion_a = coalesce(opcion_a, opciones ->> 0, respuesta_correcta),
  opcion_b = coalesce(opcion_b, opciones ->> 1, 'Cuidar el planeta'),
  opcion_c = coalesce(opcion_c, opciones ->> 2, 'Evitar contaminacion'),
  opcion_d = coalesce(opcion_d, opciones ->> 3, 'Reciclar'),
  ods_relacionado = coalesce(ods_relacionado, ods_numero, 12),
  dificultad = case
    when dificultad = 'basico' then 'facil'
    else dificultad
  end
where opcion_a is null
  or opcion_b is null
  or opcion_c is null
  or opcion_d is null
  or ods_relacionado is null
  or dificultad = 'basico';

alter table public.preguntas_ods
  add constraint preguntas_ods_dificultad_check
  check (dificultad in ('facil', 'medio', 'avanzado'));

alter table public.preguntas_ods
  alter column opciones drop not null,
  alter column ods_numero drop not null,
  alter column opcion_a set not null,
  alter column opcion_b set not null,
  alter column opcion_c set not null,
  alter column opcion_d set not null,
  alter column ods_relacionado set not null;
