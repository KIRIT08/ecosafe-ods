alter table public.perfiles_usuario enable row level security;
alter table public.indicadores_ods enable row level security;
alter table public.metricas_mensuales enable row level security;
alter table public.tipos_residuos enable row level security;
alter table public.emisiones_mensuales enable row level security;
alter table public.indicadores_radar enable row level security;
alter table public.zonas_riesgo enable row level security;
alter table public.preguntas_ods enable row level security;
alter table public.puntajes_juego enable row level security;
alter table public.insignias enable row level security;
alter table public.usuario_insignias enable row level security;
alter table public.biblioteca_ods enable row level security;
alter table public.reportes_ods enable row level security;
alter table public.actividad_usuario enable row level security;

grant usage on schema public to anon, authenticated;

grant select on public.indicadores_ods to anon, authenticated;
grant select on public.metricas_mensuales to anon, authenticated;
grant select on public.tipos_residuos to anon, authenticated;
grant select on public.emisiones_mensuales to anon, authenticated;
grant select on public.indicadores_radar to anon, authenticated;
grant select on public.zonas_riesgo to anon, authenticated;
grant select on public.preguntas_ods to anon, authenticated;
grant select on public.insignias to anon, authenticated;
grant select on public.biblioteca_ods to anon, authenticated;
grant select on public.reportes_ods to anon, authenticated;

grant select, insert, update on public.perfiles_usuario to authenticated;
grant select, insert on public.puntajes_juego to authenticated;
grant select, insert on public.usuario_insignias to authenticated;
grant select, insert on public.actividad_usuario to authenticated;

drop policy if exists "Public read indicadores ods" on public.indicadores_ods;
create policy "Public read indicadores ods"
on public.indicadores_ods for select
to anon, authenticated
using (true);

drop policy if exists "Public read metricas mensuales" on public.metricas_mensuales;
create policy "Public read metricas mensuales"
on public.metricas_mensuales for select
to anon, authenticated
using (true);

drop policy if exists "Public read tipos residuos" on public.tipos_residuos;
create policy "Public read tipos residuos"
on public.tipos_residuos for select
to anon, authenticated
using (true);

drop policy if exists "Public read emisiones mensuales" on public.emisiones_mensuales;
create policy "Public read emisiones mensuales"
on public.emisiones_mensuales for select
to anon, authenticated
using (true);

drop policy if exists "Public read indicadores radar" on public.indicadores_radar;
create policy "Public read indicadores radar"
on public.indicadores_radar for select
to anon, authenticated
using (true);

drop policy if exists "Public read zonas riesgo" on public.zonas_riesgo;
create policy "Public read zonas riesgo"
on public.zonas_riesgo for select
to anon, authenticated
using (true);

drop policy if exists "Public read preguntas ods" on public.preguntas_ods;
create policy "Public read preguntas ods"
on public.preguntas_ods for select
to anon, authenticated
using (true);

drop policy if exists "Public read insignias" on public.insignias;
create policy "Public read insignias"
on public.insignias for select
to anon, authenticated
using (true);

drop policy if exists "Public read biblioteca ods" on public.biblioteca_ods;
create policy "Public read biblioteca ods"
on public.biblioteca_ods for select
to anon, authenticated
using (true);

drop policy if exists "Public read reportes ods" on public.reportes_ods;
create policy "Public read reportes ods"
on public.reportes_ods for select
to anon, authenticated
using (true);

drop policy if exists "Users read own profile" on public.perfiles_usuario;
create policy "Users read own profile"
on public.perfiles_usuario for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users insert own profile" on public.perfiles_usuario;
create policy "Users insert own profile"
on public.perfiles_usuario for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users update own profile" on public.perfiles_usuario;
create policy "Users update own profile"
on public.perfiles_usuario for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Authenticated read ranking" on public.puntajes_juego;
create policy "Authenticated read ranking"
on public.puntajes_juego for select
to authenticated
using (true);

drop policy if exists "Users insert own score" on public.puntajes_juego;
create policy "Users insert own score"
on public.puntajes_juego for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users read own badges" on public.usuario_insignias;
create policy "Users read own badges"
on public.usuario_insignias for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users insert own badges" on public.usuario_insignias;
create policy "Users insert own badges"
on public.usuario_insignias for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users read own activity" on public.actividad_usuario;
create policy "Users read own activity"
on public.actividad_usuario for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users insert own activity" on public.actividad_usuario;
create policy "Users insert own activity"
on public.actividad_usuario for insert
to authenticated
with check (auth.uid() = user_id);
