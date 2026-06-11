alter table public.biblioteca_ods
  add column if not exists resumen text,
  add column if not exists porque_importa text,
  add column if not exists acciones jsonb not null default '[]'::jsonb,
  add column if not exists ejemplo_cotidiano text,
  add column if not exists reto_practico text,
  add column if not exists fuente_titulo text,
  add column if not exists fuente_url text,
  add column if not exists nivel_lectura text not null default 'basico';

update public.biblioteca_ods
set
  resumen = coalesce(resumen, descripcion),
  porque_importa = coalesce(porque_importa, contenido),
  acciones = case
    when acciones = '[]'::jsonb then '["Leer el recurso", "Aplicar una accion sostenible"]'::jsonb
    else acciones
  end,
  ejemplo_cotidiano = coalesce(ejemplo_cotidiano, 'Aplica una accion pequena relacionada con este ODS en casa o en clase.'),
  reto_practico = coalesce(reto_practico, 'Completa una accion sostenible durante el dia.'),
  fuente_titulo = coalesce(fuente_titulo, 'Naciones Unidas'),
  fuente_url = coalesce(fuente_url, 'https://www.un.org/es/common-agenda/sustainable-development-goals'),
  nivel_lectura = coalesce(nivel_lectura, 'basico');

update public.biblioteca_ods
set
  resumen = 'Todas las personas deben tener oportunidades para aprender.',
  porque_importa = 'La educacion ayuda a comprender problemas ambientales, participar mejor en la comunidad y tomar decisiones responsables.',
  acciones = '["Leer sobre un ODS", "Compartir lo aprendido", "Hacer una pregunta"]'::jsonb,
  ejemplo_cotidiano = 'En clase puedes explicar una accion sostenible con tus palabras.',
  reto_practico = 'Ensenale a alguien una accion sostenible que aprendiste hoy.',
  fuente_titulo = 'Naciones Unidas - Educacion de calidad',
  fuente_url = 'https://www.un.org/es/impacto-acad%C3%A9mico/page/educaci%C3%B3n-de-calidad',
  nivel_lectura = 'basico'
where ods_numero = 4;

update public.biblioteca_ods
set
  resumen = 'El agua limpia es necesaria para la salud, la higiene y la vida diaria.',
  porque_importa = 'Sin agua segura, las personas pueden enfermar y las comunidades tienen mas dificultades para vivir bien.',
  acciones = '["Cerrar el cano", "No tirar basura al agua", "Avisar si ves una fuga"]'::jsonb,
  ejemplo_cotidiano = 'Cerrar el cano mientras te cepillas ayuda a ahorrar agua.',
  reto_practico = 'Identifica tres formas de ahorrar agua durante el dia.',
  fuente_titulo = 'Naciones Unidas - Agua',
  fuente_url = 'https://www.un.org/es/global-issues/water',
  nivel_lectura = 'basico'
where ods_numero = 6;

update public.biblioteca_ods
set
  resumen = 'Una ciudad sostenible cuida sus espacios y mejora la vida de sus habitantes.',
  porque_importa = 'Las ciudades concentran personas, residuos y transporte; por eso necesitan orden, seguridad y cuidado ambiental.',
  acciones = '["Usar tachos correctos", "Cuidar parques", "Respetar espacios publicos"]'::jsonb,
  ejemplo_cotidiano = 'Mantener limpio un parque ayuda a que mas personas lo usen con seguridad.',
  reto_practico = 'Observa tu calle y escribe una mejora sostenible posible.',
  fuente_titulo = 'Naciones Unidas - Ciudades',
  fuente_url = 'https://www.un.org/sustainabledevelopment/es/cities/',
  nivel_lectura = 'basico'
where ods_numero = 11;

update public.biblioteca_ods
set
  resumen = 'Consumir responsablemente significa usar solo lo necesario y reducir desperdicios.',
  porque_importa = 'Cada producto usa agua, energia y materiales; si consumimos mejor, reducimos impacto ambiental.',
  acciones = '["Separar residuos", "Reutilizar materiales", "Evitar compras innecesarias"]'::jsonb,
  ejemplo_cotidiano = 'Una botella limpia puede ir al reciclaje en lugar de la basura comun.',
  reto_practico = 'Separa tres residuos correctamente durante el dia.',
  fuente_titulo = 'Naciones Unidas - Consumo y produccion sostenibles',
  fuente_url = 'https://www.un.org/sustainabledevelopment/es/sustainable-consumption-production/',
  nivel_lectura = 'basico'
where ods_numero = 12;

update public.biblioteca_ods
set
  resumen = 'La accion por el clima busca reducir danos causados por el cambio climatico.',
  porque_importa = 'El clima afecta el agua, los alimentos, la salud y la seguridad de las personas.',
  acciones = '["Apagar luces", "Caminar cuando sea posible", "Cuidar areas verdes"]'::jsonb,
  ejemplo_cotidiano = 'Apagar una luz innecesaria ayuda a ahorrar energia.',
  reto_practico = 'Durante una tarde, apaga aparatos que no estes usando.',
  fuente_titulo = 'Naciones Unidas - Cambio climatico',
  fuente_url = 'https://www.un.org/es/global-issues/climate-change',
  nivel_lectura = 'basico'
where ods_numero = 13;

update public.biblioteca_ods
set
  resumen = 'Los ecosistemas terrestres incluyen bosques, suelos, animales y plantas.',
  porque_importa = 'La biodiversidad mantiene el equilibrio natural y ayuda a que las personas tengan aire, agua y alimentos.',
  acciones = '["Cuidar plantas", "No danar arboles", "Evitar basura en areas verdes"]'::jsonb,
  ejemplo_cotidiano = 'Cuidar una planta o un arbol ayuda a proteger la vida terrestre.',
  reto_practico = 'Identifica un arbol o planta cercana y piensa como cuidarla.',
  fuente_titulo = 'Naciones Unidas - Biodiversidad',
  fuente_url = 'https://www.un.org/sustainabledevelopment/es/2023/08/explainer-what-is-biodiversity/',
  nivel_lectura = 'basico'
where ods_numero = 15;
