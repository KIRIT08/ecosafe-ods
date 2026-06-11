insert into public.indicadores_ods
  (ods_numero, titulo, categoria, valor, unidad, descripcion, tendencia, color, icono)
values
  (4, 'Educacion sostenible', 'Aprendizaje', 78, '%', 'Avance en contenidos educativos sobre sostenibilidad.', '+8% vs. mes anterior', '#38bdf8', 'book-open'),
  (6, 'Agua limpia monitoreada', 'Agua', 70, '%', 'Cobertura simulada de acciones para agua limpia y saneamiento.', '+5% vs. mes anterior', '#22c55e', 'droplets'),
  (11, 'Comunidades sostenibles', 'Ciudades', 24, 'zonas', 'Zonas urbanas evaluadas con criterios de sostenibilidad.', '+3 nuevas zonas', '#facc15', 'map-pin'),
  (12, 'Consumo responsable', 'Residuos', 64, '%', 'Reduccion simulada de residuos y mejor separacion.', '+12% vs. mes anterior', '#86efac', 'recycle'),
  (13, 'Accion climatica', 'Clima', 82, '%', 'Avance general de acciones climaticas simuladas.', '+6% vs. mes anterior', '#22c55e', 'leaf'),
  (15, 'Ecosistemas protegidos', 'Biodiversidad', 63, 'areas', 'Areas naturales y ecosistemas con acciones de proteccion.', '+4 areas', '#14b8a6', 'trees')
on conflict (titulo) do update set
  valor = excluded.valor,
  descripcion = excluded.descripcion,
  tendencia = excluded.tendencia;

insert into public.metricas_mensuales
  (tipo_metrica, ods_numero, mes, mes_orden, anio, valor, unidad)
values
  ('avance_ods', 13, 'Ene', 1, 2026, 58, '%'),
  ('avance_ods', 13, 'Feb', 2, 2026, 63, '%'),
  ('avance_ods', 13, 'Mar', 3, 2026, 66, '%'),
  ('avance_ods', 13, 'Abr', 4, 2026, 71, '%'),
  ('avance_ods', 13, 'May', 5, 2026, 74, '%'),
  ('avance_ods', 13, 'Jun', 6, 2026, 82, '%')
on conflict (tipo_metrica, mes_orden, anio, ods_numero) do update set
  valor = excluded.valor;

insert into public.tipos_residuos
  (tipo, porcentaje, color, descripcion)
values
  ('Reciclable', 46, '#22c55e', 'Materiales que pueden volver al ciclo productivo.'),
  ('Organico', 28, '#84cc16', 'Residuos biodegradables aprovechables.'),
  ('Peligroso', 16, '#f97316', 'Elementos que requieren manejo especial.'),
  ('No peligroso', 10, '#86efac', 'Residuos comunes de bajo riesgo.')
on conflict (tipo) do update set
  porcentaje = excluded.porcentaje,
  color = excluded.color;

insert into public.emisiones_mensuales
  (mes, mes_orden, anio, toneladas)
values
  ('Ene', 1, 2026, 38),
  ('Feb', 2, 2026, 45),
  ('Mar', 3, 2026, 42),
  ('Abr', 4, 2026, 36),
  ('May', 5, 2026, 33),
  ('Jun', 6, 2026, 31)
on conflict (mes_orden, anio) do update set
  toneladas = excluded.toneladas;

insert into public.indicadores_radar
  (indicador, valor, ods_numero, orden)
values
  ('Educacion', 78, 4, 1),
  ('Agua', 70, 6, 2),
  ('Ciudades', 72, 11, 3),
  ('Residuos', 75, 12, 4),
  ('Clima', 82, 13, 5),
  ('Ecosistemas', 68, 15, 6)
on conflict (indicador) do update set
  valor = excluded.valor,
  ods_numero = excluded.ods_numero,
  orden = excluded.orden;

insert into public.zonas_riesgo
  (region, latitud, longitud, nivel_riesgo, tipo_riesgo, ods_relacionados, descripcion, recomendacion)
values
  ('Piura', -5.1945, -80.6328, 'Medio', 'Residuos solidos', array[11, 12], 'Aumento de residuos urbanos y puntos criticos de acumulacion.', 'Fortalecer segregacion, rutas de reciclaje y educacion comunitaria.'),
  ('Lima', -12.0464, -77.0428, 'Alto', 'Emisiones urbanas', array[11, 13], 'Alta concentracion de emisiones por transporte y actividad urbana.', 'Promover movilidad sostenible y monitoreo de calidad del aire.'),
  ('Loreto', -3.7491, -73.2538, 'Alto', 'Deforestacion y agua', array[6, 13, 15], 'Riesgo por perdida de cobertura vegetal y contaminacion de cuencas.', 'Impulsar vigilancia ambiental y restauracion de ecosistemas.'),
  ('Cusco', -13.5319, -71.9675, 'Bajo', 'Turismo ambiental', array[11, 15], 'Zonas con turismo monitoreado y acciones de conservacion.', 'Mantener buenas practicas y educacion al visitante.'),
  ('Arequipa', -16.4090, -71.5375, 'Medio', 'Consumo de agua', array[6, 12], 'Presion sobre recursos hidricos por consumo urbano y productivo.', 'Reforzar ahorro de agua y medicion comunitaria.'),
  ('Ica', -14.0678, -75.7286, 'Medio', 'Estres hidrico', array[6, 13], 'Escasez de agua y alta demanda agricola simulada.', 'Priorizar eficiencia hidrica y cultura de ahorro.'),
  ('Puno', -15.8402, -70.0219, 'Bajo', 'Conservacion natural', array[6, 15], 'Ecosistemas altoandinos con acciones de cuidado ambiental.', 'Sostener monitoreo ciudadano y educacion ambiental.'),
  ('La Libertad', -8.1091, -79.0215, 'Medio', 'Residuos urbanos', array[11, 12], 'Crecimiento de residuos en zonas urbanas y periurbanas.', 'Instalar puntos limpios y campanas educativas.')
on conflict (region) do update set
  nivel_riesgo = excluded.nivel_riesgo,
  tipo_riesgo = excluded.tipo_riesgo,
  ods_relacionados = excluded.ods_relacionados,
  descripcion = excluded.descripcion,
  recomendacion = excluded.recomendacion;

insert into public.preguntas_ods
  (
    pregunta,
    opcion_a,
    opcion_b,
    opcion_c,
    opcion_d,
    respuesta_correcta,
    explicacion,
    ods_relacionado,
    dificultad,
    tema
  )
values
  ('Que accion ayuda a cuidar el agua?', 'Cuidar las gotas de agua', 'Tirar basura al rio', 'Tocar humo', 'Quemar residuos', 'Cuidar las gotas de agua', 'El agua limpia es importante para todos.', 6, 'facil', 'Agua limpia'),
  ('Que objeto debe ir al reciclaje?', 'Botella reciclable', 'Humo contaminante', 'Fuego', 'Derrame quimico', 'Botella reciclable', 'Reciclar ayuda al consumo responsable.', 12, 'facil', 'Reciclaje'),
  ('Que debemos evitar para cuidar el aire?', 'Humo contaminante', 'Arboles', 'Agua limpia', 'Botellas reciclables', 'Humo contaminante', 'Evitar humo ayuda a cuidar el clima.', 13, 'facil', 'Aire limpio'),
  ('Que accion ayuda a los bosques?', 'Plantar arboles', 'Talar arboles', 'Quemar basura', 'Contaminar rios', 'Plantar arboles', 'Los arboles cuidan la vida terrestre.', 15, 'medio', 'Ecosistemas'),
  ('Reciclar botellas ayuda a que ODS?', 'ODS 4', 'ODS 6', 'ODS 12', 'ODS 15', 'ODS 12', 'El ODS 12 impulsa consumo responsable.', 12, 'medio', 'Consumo responsable'),
  ('Cuidar el agua se relaciona con que ODS?', 'ODS 6', 'ODS 11', 'ODS 13', 'ODS 15', 'ODS 6', 'El ODS 6 habla de agua limpia y saneamiento.', 6, 'avanzado', 'Agua limpia'),
  ('Evitar contaminacion del aire se relaciona con que ODS?', 'ODS 4', 'ODS 6', 'ODS 13', 'ODS 15', 'ODS 13', 'El ODS 13 impulsa accion por el clima.', 13, 'avanzado', 'Accion climatica'),
  ('Plantar arboles ayuda principalmente a que ODS?', 'ODS 6', 'ODS 11', 'ODS 12', 'ODS 15', 'ODS 15', 'El ODS 15 protege ecosistemas terrestres.', 15, 'avanzado', 'Ecosistemas')
on conflict (pregunta) do update set
  opcion_a = excluded.opcion_a,
  opcion_b = excluded.opcion_b,
  opcion_c = excluded.opcion_c,
  opcion_d = excluded.opcion_d,
  respuesta_correcta = excluded.respuesta_correcta,
  ods_relacionado = excluded.ods_relacionado,
  dificultad = excluded.dificultad,
  explicacion = excluded.explicacion;

insert into public.insignias
  (nombre, descripcion, icono, color, puntos_requeridos, ods_numero)
values
  ('Explorador ODS', 'Conoce los primeros objetivos sostenibles.', 'compass', '#38bdf8', 0, 4),
  ('Guardian del Agua', 'Impulsa acciones sobre agua limpia.', 'droplets', '#22c55e', 150, 6),
  ('Ciudadano Sostenible', 'Promueve comunidades mas sostenibles.', 'building-2', '#facc15', 300, 11),
  ('Reciclador Responsable', 'Recolecta y separa residuos correctamente.', 'recycle', '#86efac', 450, 12),
  ('Defensor del Clima', 'Completa retos de accion climatica.', 'cloud-sun', '#22c55e', 650, 13),
  ('Protector de Ecosistemas', 'Cuida bosques y biodiversidad.', 'trees', '#14b8a6', 850, 15)
on conflict (nombre) do update set
  descripcion = excluded.descripcion,
  puntos_requeridos = excluded.puntos_requeridos,
  ods_numero = excluded.ods_numero;

insert into public.biblioteca_ods
  (
    titulo,
    categoria,
    ods_numero,
    descripcion,
    contenido,
    resumen,
    porque_importa,
    acciones,
    ejemplo_cotidiano,
    reto_practico,
    fuente_titulo,
    fuente_url,
    nivel_lectura,
    icono,
    color,
    orden
  )
values
  (
    'ODS 4: Educacion de calidad',
    'Educacion',
    4,
    'Aprendizaje para construir comunidades sostenibles.',
    'La educacion de calidad ayuda a comprender problemas ambientales y tomar mejores decisiones.',
    'Todas las personas deben tener oportunidades para aprender y desarrollar sus capacidades.',
    'La educacion permite entender problemas ambientales, participar mejor en la comunidad y tomar decisiones responsables.',
    '["Leer sobre un ODS", "Compartir lo aprendido con un companero", "Hacer una pregunta sobre sostenibilidad"]',
    'En clase, puedes explicar con tus palabras que accion ayuda al planeta y por que importa.',
    'Ensenale a alguien una accion sostenible que aprendiste hoy.',
    'Naciones Unidas - Educacion de calidad',
    'https://www.un.org/es/impacto-acad%C3%A9mico/page/educaci%C3%B3n-de-calidad',
    'basico',
    'book-open',
    '#38bdf8',
    1
  ),
  (
    'ODS 6: Agua limpia y saneamiento',
    'Agua',
    6,
    'Acciones para proteger el agua y usarla responsablemente.',
    'El cuidado del agua incluye ahorro, saneamiento y reduccion de contaminantes.',
    'El agua limpia es necesaria para la salud, la higiene y la vida diaria.',
    'Sin agua segura, las personas pueden enfermar y las comunidades tienen mas dificultades para vivir bien.',
    '["Cerrar el cano mientras te cepillas", "No tirar basura al agua", "Avisar si ves una fuga"]',
    'En casa, cerrar el cano mientras te lavas los dientes ayuda a ahorrar agua.',
    'Durante un dia, identifica tres formas de ahorrar agua.',
    'Naciones Unidas - Agua',
    'https://www.un.org/es/global-issues/water',
    'basico',
    'droplets',
    '#22c55e',
    2
  ),
  (
    'ODS 11: Ciudades sostenibles',
    'Ciudades',
    11,
    'Ideas para comunidades seguras, inclusivas y sostenibles.',
    'Las ciudades sostenibles priorizan movilidad, residuos, areas verdes y resiliencia.',
    'Una ciudad sostenible cuida sus espacios, reduce riesgos y mejora la vida de sus habitantes.',
    'Las ciudades concentran muchas personas, residuos y transporte; por eso necesitan orden, seguridad y cuidado ambiental.',
    '["Usar tachos correctos", "Cuidar parques", "Respetar espacios publicos"]',
    'En tu barrio, mantener limpio un parque ayuda a que mas personas lo usen con seguridad.',
    'Observa tu calle y escribe una mejora sostenible posible.',
    'Naciones Unidas - Ciudades',
    'https://www.un.org/sustainabledevelopment/es/cities/',
    'basico',
    'map-pin',
    '#facc15',
    3
  ),
  (
    'ODS 12: Consumo responsable',
    'Consumo',
    12,
    'Buenas practicas de reduccion, reutilizacion y reciclaje.',
    'Consumir responsablemente reduce residuos y mejora el uso de recursos.',
    'Consumir responsablemente significa usar solo lo necesario y reducir desperdicios.',
    'Cada producto usa agua, energia y materiales; si consumimos mejor, reducimos impacto ambiental.',
    '["Separar residuos", "Reutilizar materiales", "Evitar compras innecesarias"]',
    'Antes de botar una botella, puedes colocarla en reciclaje si esta limpia y seca.',
    'Separa tres residuos correctamente durante el dia.',
    'Naciones Unidas - Consumo y produccion sostenibles',
    'https://www.un.org/sustainabledevelopment/es/sustainable-consumption-production/',
    'basico',
    'recycle',
    '#86efac',
    4
  ),
  (
    'ODS 13: Accion por el clima',
    'Clima',
    13,
    'Medidas para reducir emisiones y adaptarse al cambio climatico.',
    'La accion climatica implica reducir CO2, ahorrar energia y educar a la comunidad.',
    'La accion por el clima busca reducir danos causados por el cambio climatico.',
    'El clima afecta el agua, los alimentos, la salud y la seguridad de las personas.',
    '["Apagar luces que no usas", "Caminar o usar transporte sostenible", "Cuidar areas verdes"]',
    'Apagar una luz innecesaria ayuda a ahorrar energia y reducir emisiones.',
    'Durante una tarde, apaga aparatos que no estes usando.',
    'Naciones Unidas - Cambio climatico',
    'https://www.un.org/es/global-issues/climate-change',
    'basico',
    'leaf',
    '#22c55e',
    5
  ),
  (
    'ODS 15: Ecosistemas terrestres',
    'Ecosistemas',
    15,
    'Proteccion de bosques, suelos y biodiversidad.',
    'Cuidar ecosistemas terrestres protege la vida natural y los servicios ambientales.',
    'Los ecosistemas terrestres incluyen bosques, suelos, animales y plantas.',
    'La biodiversidad mantiene el equilibrio natural y ayuda a que las personas tengan aire, agua y alimentos.',
    '["Cuidar plantas", "No danar arboles", "Evitar basura en areas verdes"]',
    'Cuidar una planta o un arbol ayuda a proteger la vida terrestre.',
    'Identifica un arbol o planta cercana y piensa como cuidarla.',
    'Naciones Unidas - Biodiversidad',
    'https://www.un.org/sustainabledevelopment/es/2023/08/explainer-what-is-biodiversity/',
    'basico',
    'trees',
    '#14b8a6',
    6
  )
on conflict (titulo) do update set
  descripcion = excluded.descripcion,
  contenido = excluded.contenido,
  resumen = excluded.resumen,
  porque_importa = excluded.porque_importa,
  acciones = excluded.acciones,
  ejemplo_cotidiano = excluded.ejemplo_cotidiano,
  reto_practico = excluded.reto_practico,
  fuente_titulo = excluded.fuente_titulo,
  fuente_url = excluded.fuente_url,
  nivel_lectura = excluded.nivel_lectura,
  orden = excluded.orden;

insert into public.reportes_ods
  (titulo, area_evaluada, ods_numero, cumplimiento, nivel_riesgo, impacto_estimado, hallazgos, recomendaciones, estado)
values
  (
    'Reporte de Impacto Ambiental ODS',
    'Planta de Produccion',
    12,
    78,
    'Medio',
    'Reduccion parcial de residuos y mejora de buenas practicas.',
    '["Separacion inadecuada de residuos reciclables", "Falta de senaletica ambiental visible", "Control adecuado de emisiones en caldera"]',
    '["Implementar contenedores diferenciados", "Instalar senaletica visible", "Realizar mantenimiento preventivo"]',
    'Completado'
  ),
  (
    'Reporte de Agua y Comunidad',
    'Zona educativa comunitaria',
    6,
    84,
    'Bajo',
    'Mejora en cultura de ahorro de agua.',
    '["Uso responsable en puntos de consumo", "Necesidad de reforzar mensajes visuales"]',
    '["Agregar medidores visibles", "Crear campana multimedia de ahorro"]',
    'Completado'
  ),
  (
    'Reporte de Accion Climatica Escolar',
    'Modulo de aprendizaje ambiental',
    13,
    69,
    'Medio',
    'Participacion positiva con oportunidad de mejora.',
    '["Baja participacion en retos climaticos", "Buen resultado en preguntas educativas"]',
    '["Activar ranking semanal", "Agregar recompensas visuales por reto"]',
    'Completado'
  )
on conflict (titulo) do update set
  area_evaluada = excluded.area_evaluada,
  ods_numero = excluded.ods_numero,
  cumplimiento = excluded.cumplimiento,
  nivel_riesgo = excluded.nivel_riesgo,
  impacto_estimado = excluded.impacto_estimado,
  hallazgos = excluded.hallazgos,
  recomendaciones = excluded.recomendaciones,
  estado = excluded.estado;
