-- =====================================================================
-- Lokl · Datos iniciales (Módulo 2) — BORRADOR PARA REVISIÓN
-- Se puede correr varias veces: no duplica (on conflict do nothing).
-- Los sectores que falten los proponen los vendedores ("No está mi zona") y se aprueban en el admin.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Estados de Venezuela (los 24). Sus slugs quedan reservados:
--    ningún vendedor puede usar "apure" o "zulia" como su enlace.
-- ---------------------------------------------------------------------
insert into estados (nombre, slug) values
  ('Amazonas', 'amazonas'), ('Anzoátegui', 'anzoategui'), ('Apure', 'apure'),
  ('Aragua', 'aragua'), ('Barinas', 'barinas'), ('Bolívar', 'bolivar'),
  ('Carabobo', 'carabobo'), ('Cojedes', 'cojedes'), ('Delta Amacuro', 'delta-amacuro'),
  ('Distrito Capital', 'distrito-capital'), ('Falcón', 'falcon'), ('Guárico', 'guarico'),
  ('La Guaira', 'la-guaira'), ('Lara', 'lara'), ('Mérida', 'merida'),
  ('Miranda', 'miranda'), ('Monagas', 'monagas'), ('Nueva Esparta', 'nueva-esparta'),
  ('Portuguesa', 'portuguesa'), ('Sucre', 'sucre'), ('Táchira', 'tachira'),
  ('Trujillo', 'trujillo'), ('Yaracuy', 'yaracuy'), ('Zulia', 'zulia')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- 2. Municipios de Apure (los 7). Solo San Fernando arranca "activo"
--    (aparece en "¿Dónde estás?"). Los demás existen para que los
--    productores de toda Apure puedan registrarse desde ya.
-- ---------------------------------------------------------------------
insert into municipios (estado_id, nombre, slug, activo)
select e.id, m.nombre, m.slug, m.activo
from estados e, (values
  ('San Fernando',     'san-fernando',     true),
  ('Biruaca',          'biruaca',          false),
  ('Achaguas',         'achaguas',         false),
  ('Muñoz',            'munoz',            false),
  ('Páez',             'paez',             false),
  ('Pedro Camejo',     'pedro-camejo',     false),
  ('Rómulo Gallegos',  'romulo-gallegos',  false)
) as m(nombre, slug, activo)
where e.slug = 'apure'
on conflict (estado_id, slug) do nothing;

-- ---------------------------------------------------------------------
-- 3. Zonas. Por ahora: los pueblos (capitales de parroquia) de cada
--    municipio y las zonas de San Fernando que conocemos.
--    Los demás sectores, barrios y urbanizaciones se agregan con el uso.
-- ---------------------------------------------------------------------
insert into zonas (municipio_id, nombre, slug, tipo)
select m.id, z.nombre, z.slug, z.tipo::tipo_zona
from municipios m
join estados e on e.id = m.estado_id and e.slug = 'apure'
join (values
  -- San Fernando: ciudad. El resto de sectores los proponen los vendedores ("No está mi zona")
  ('san-fernando', 'Centro',                    'centro',                   'sector'),
  ('san-fernando', 'El Recreo',                 'el-recreo',                'sector'),
  ('san-fernando', 'Parque de Ferias',          'parque-de-ferias',         'sector'),
  -- San Fernando: pueblos de sus parroquias
  ('san-fernando', 'Puerto Miranda (Peñalver)', 'puerto-miranda',           'pueblo'),
  ('san-fernando', 'San Rafael de Atamaica',    'san-rafael-de-atamaica',   'pueblo'),
  -- Biruaca
  ('biruaca',      'Biruaca',                   'biruaca',                  'pueblo'),
  -- Achaguas
  ('achaguas',     'Achaguas',                  'achaguas',                 'pueblo'),
  ('achaguas',     'Apurito',                   'apurito',                  'pueblo'),
  ('achaguas',     'El Yagual',                 'el-yagual',                'pueblo'),
  ('achaguas',     'Guachara',                  'guachara',                 'pueblo'),
  ('achaguas',     'Mucuritas',                 'mucuritas',                'pueblo'),
  ('achaguas',     'Queseras del Medio',        'queseras-del-medio',       'pueblo'),
  -- Muñoz
  ('munoz',        'Bruzual',                   'bruzual',                  'pueblo'),
  ('munoz',        'Mantecal',                  'mantecal',                 'pueblo'),
  ('munoz',        'Quintero',                  'quintero',                 'pueblo'),
  ('munoz',        'Rincón Hondo',              'rincon-hondo',             'pueblo'),
  ('munoz',        'San Vicente',               'san-vicente',              'pueblo'),
  -- Páez
  ('paez',         'Guasdualito',               'guasdualito',              'pueblo'),
  ('paez',         'Aramendi',                  'aramendi',                 'pueblo'),
  ('paez',         'El Amparo',                 'el-amparo',                'pueblo'),
  ('paez',         'San Camilo',                'san-camilo',               'pueblo'),
  ('paez',         'Urdaneta',                  'urdaneta',                 'pueblo'),
  -- Pedro Camejo
  ('pedro-camejo', 'San Juan de Payara',        'san-juan-de-payara',       'pueblo'),
  ('pedro-camejo', 'Codazzi',                   'codazzi',                  'pueblo'),
  ('pedro-camejo', 'Cunaviche',                 'cunaviche',                'pueblo'),
  ('pedro-camejo', 'La Macanilla',              'la-macanilla',             'caserio'),
  -- Rómulo Gallegos
  ('romulo-gallegos', 'Elorza',                 'elorza',                   'pueblo'),
  ('romulo-gallegos', 'La Trinidad',            'la-trinidad',              'pueblo')
  -- Más caseríos productores: los proponen los vendedores con "No está mi zona"
) as z(municipio, nombre, slug, tipo) on z.municipio = m.slug
on conflict (municipio_id, slug) do nothing;

-- ---------------------------------------------------------------------
-- 4. Categorías y subcategorías por sección.
--    Cada vendedor elige hasta 3. Los vendedores pueden sugerir nuevas
--    (tabla categorias_sugeridas) y tú las apruebas desde el admin.
-- ---------------------------------------------------------------------
drop table if exists _cat;
create temporary table _cat (
  seccion seccion, padre text, nombre text, slug text, icono text, palabras text[], orden smallint
);

insert into _cat values
-- ===== COMIDA (Feria de comida): los "botones por antojo"
  ('comida', null, 'Pizza',             'pizza',           null, '{pizzeria}', 1),
  ('comida', null, 'Hamburguesas',      'hamburguesas',    null, '{burger,hamburguesa}', 2),
  ('comida', null, 'Perros calientes',  'perros',          null, '{perro,hot dog,perrocaliente}', 3),
  ('comida', null, 'Arepas',            'arepas',          null, '{arepera,arepa}', 4),
  ('comida', null, 'Empanadas',         'empanadas',       null, '{empanada,pastelitos}', 5),
  ('comida', null, 'Parrilla',          'parrilla',        null, '{carne en vara,asado,parrillada}', 6),
  ('comida', null, 'Pollo',             'pollo',           null, '{pollo en brasa,pollo frito}', 7),
  ('comida', null, 'Comida casera',     'comida-casera',   null, '{almuerzo,menu del dia,pabellon}', 8),
  ('comida', null, 'Pescado',           'pescado',         null, '{pescado frito,cachama,bagre,coporo}', 9),
  ('comida', null, 'Comida china',      'comida-china',    null, '{chino,arroz chino,lumpia}', 10),
  ('comida', null, 'Sushi',             'sushi',           null, '{sushi,japones}', 11),
  ('comida', null, 'Postres y tortas',  'postres-tortas',  null, '{torta,quesillo,dulces,golfeado,tres leches}', 12),
  ('comida', null, 'Panadería',         'panaderia',       null, '{pan,cachito,pan de jamon}', 13),
  ('comida', null, 'Saludable',         'saludable',       null, '{fit,ensalada,vegetariano}', 14),
  ('comida', null, 'Bebidas y jugos',   'bebidas',         null, '{jugo,batido,merengada,cafe}', 15),
  ('comida', null, 'Helados',           'helados',         null, '{helado,raspado,cepillado}', 16),
-- ===== TIENDAS
  ('tiendas', null, 'Víveres y bodegas',          'viveres',        'super',    '{bodega,abasto,charcuteria}', 1),
  ('tiendas', null, 'Ropa y calzado',             'ropa-calzado',   'tiendas',  '{ropa,zapatos,boutique}', 2),
  ('tiendas', null, 'Celulares y accesorios',     'celulares',      null,       '{telefono,forro,cargador}', 3),
  ('tiendas', null, 'Electrodomésticos y hogar',  'hogar',          null,       '{nevera,cocina,ventilador,muebles}', 4),
  ('tiendas', null, 'Ferretería',                 'ferreteria',     null,       '{herramientas,construccion,pintura}', 5),
  ('tiendas', null, 'Repuestos',                  'repuestos',      null,       '{autopartes,moto,repuesto,cauchos}', 6),
  ('tiendas', null, 'Farmacia y cuidado personal','farmacia',       'salud',    '{medicinas,perfumeria}', 7),
  ('tiendas', null, 'Belleza y cosméticos',       'cosmeticos',     'belleza',  '{maquillaje,uñas,cabello}', 8),
  ('tiendas', null, 'Papelería y librería',       'papeleria',      'educacion','{utiles,fotocopias}', 9),
  ('tiendas', null, 'Mascotas',                   'mascotas',       null,       '{perrarina,gatarina,alimento mascotas}', 10),
  ('tiendas', null, 'Agro e insumos',             'agro',           'al-mayor', '{agropecuaria,veterinaria,semillas,alambre}', 11),
  ('tiendas', null, 'Licorería',                  'licoreria',      null,       '{cerveza,ron,licores}', 12),
  ('tiendas', null, 'Regalos y fiestas',          'regalos',        null,       '{piñata,cotillon,globos}', 13),
-- ===== AL MAYOR (productores, precios de origen)
  ('al_mayor', null, 'Queso y lácteos',      'queso-lacteos',   'queso',    '{queso llanero,queso duro,queso blanco,suero,leche,cuajada}', 1),
  ('al_mayor', null, 'Ganado y carne',       'ganado-carne',    'al-mayor', '{res,becerro,novillo,cerdo,carne}', 2),
  ('al_mayor', null, 'Pescado de río',       'pescado-rio',     'al-mayor', '{cachama,bagre,coporo,palometa,valenton}', 3),
  ('al_mayor', null, 'Frutas y verduras',    'frutas-verduras', 'al-mayor', '{cambur,platano,yuca,auyama,patilla,mango}', 4),
  ('al_mayor', null, 'Granos y cereales',    'granos',          'al-mayor', '{maiz,arroz,caraotas,frijol}', 5),
  ('al_mayor', null, 'Aves y huevos',        'aves-huevos',     'al-mayor', '{huevos,gallina,pollo}', 6),
  ('al_mayor', null, 'Dulces y artesanales', 'artesanales',     'al-mayor', '{miel,papelon,dulce de leche,catalinas}', 7),
-- ===== SERVICIOS (páginas amarillas)
  ('servicios', null,            'Transporte',              'transporte',     'transporte',    '{}', 1),
  ('servicios', 'transporte',    'Moto taxi',               'moto-taxi',      'transporte',    '{mototaxi,moto}', 1),
  ('servicios', 'transporte',    'Taxi',                    'taxi',           'transporte',    '{carro,linea}', 2),
  ('servicios', 'transporte',    'Fletes y mudanzas',       'fletes',         'transporte',    '{flete,mudanza,camion}', 3),
  ('servicios', 'transporte',    'Encomiendas y delivery',  'encomiendas',    'transporte',    '{envios,mandados,delivery}', 4),
  ('servicios', null,            'Hogar y oficios',         'hogar-oficios',  'hogar-oficios', '{}', 2),
  ('servicios', 'hogar-oficios', 'Plomería',                'plomeria',       'hogar-oficios', '{plomero,tuberia,fuga}', 1),
  ('servicios', 'hogar-oficios', 'Electricidad',            'electricidad',   'hogar-oficios', '{electricista,instalacion}', 2),
  ('servicios', 'hogar-oficios', 'Aire acondicionado y refrigeración','refrigeracion','hogar-oficios','{aire,split,nevera,tecnico}', 3),
  ('servicios', 'hogar-oficios', 'Albañilería y construcción','albanileria',  'hogar-oficios', '{albañil,obra,maestro de obra}', 4),
  ('servicios', 'hogar-oficios', 'Herrería y soldadura',    'herreria',       'hogar-oficios', '{herrero,soldador,rejas}', 5),
  ('servicios', 'hogar-oficios', 'Carpintería',             'carpinteria',    'hogar-oficios', '{carpintero,muebles}', 6),
  ('servicios', 'hogar-oficios', 'Pintura',                 'pintura',        'hogar-oficios', '{pintor}', 7),
  ('servicios', 'hogar-oficios', 'Cerrajería',              'cerrajeria',     'hogar-oficios', '{cerrajero,llaves}', 8),
  ('servicios', 'hogar-oficios', 'Limpieza',                'limpieza',       'hogar-oficios', '{limpieza,fumigacion}', 9),
  ('servicios', null,            'Vehículos',               'vehiculos',      'transporte',    '{}', 3),
  ('servicios', 'vehiculos',     'Mecánica',                'mecanica',       'transporte',    '{mecanico,taller}', 1),
  ('servicios', 'vehiculos',     'Cauchera',                'cauchera',       'transporte',    '{caucho,vulcanizadora}', 2),
  ('servicios', 'vehiculos',     'Electroauto',             'electroauto',    'transporte',    '{bateria,electricidad automotriz}', 3),
  ('servicios', 'vehiculos',     'Autolavado',              'autolavado',     'transporte',    '{lavado,lavacarro}', 4),
  ('servicios', null,            'Salud',                   'salud',          'salud',         '{}', 4),
  ('servicios', 'salud',         'Médicos',                 'medicos',        'salud',         '{doctor,consulta,pediatra}', 1),
  ('servicios', 'salud',         'Odontología',             'odontologia',    'salud',         '{dentista,odontologo}', 2),
  ('servicios', 'salud',         'Laboratorio',             'laboratorio',    'salud',         '{examenes,analisis}', 3),
  ('servicios', 'salud',         'Enfermería a domicilio',  'enfermeria',     'salud',         '{enfermera,inyecciones}', 4),
  ('servicios', 'salud',         'Veterinaria',             'veterinaria',    'salud',         '{veterinario,vacunas}', 5),
  ('servicios', null,            'Belleza',                 'belleza',        'belleza',       '{}', 5),
  ('servicios', 'belleza',       'Peluquería',              'peluqueria',     'belleza',       '{peluquera,cabello,alisado}', 1),
  ('servicios', 'belleza',       'Barbería',                'barberia',       'belleza',       '{barbero,corte}', 2),
  ('servicios', 'belleza',       'Uñas',                    'unas',           'belleza',       '{manicure,pedicure,manicurista}', 3),
  ('servicios', 'belleza',       'Estética y maquillaje',   'estetica',       'belleza',       '{maquilladora,cejas,pestañas}', 4),
  ('servicios', null,            'Hospedaje',               'hospedaje',      'hospedaje',     '{hotel,posada,habitacion}', 6),
  ('servicios', null,            'Educación',               'educacion',      'educacion',     '{}', 7),
  ('servicios', 'educacion',     'Clases y tareas dirigidas','clases',        'educacion',     '{profesor,tareas,matematica,ingles}', 1),
  ('servicios', 'educacion',     'Cursos y talleres',       'cursos',         'educacion',     '{curso,taller}', 2),
  ('servicios', null,            'Tecnología',              'tecnologia',     'servicios',     '{}', 8),
  ('servicios', 'tecnologia',    'Reparación de celulares', 'reparacion-celulares','servicios','{pantalla,celular}', 1),
  ('servicios', 'tecnologia',    'Computadoras e internet', 'computadoras',   'servicios',     '{computadora,laptop,internet,redes}', 2),
  ('servicios', null,            'Eventos',                 'eventos',        'servicios',     '{}', 9),
  ('servicios', 'eventos',       'Decoración',              'decoracion',     'servicios',     '{fiestas,globos}', 1),
  ('servicios', 'eventos',       'Fotografía y video',      'fotografia',     'servicios',     '{fotografo}', 2),
  ('servicios', 'eventos',       'Sonido y DJ',             'sonido',         'servicios',     '{dj,cornetas,musica}', 3),
  ('servicios', 'eventos',       'Música llanera',          'musica-llanera', 'servicios',     '{arpa,cuatro,maracas,coplero,parranda}', 4),
  ('servicios', null,            'Profesionales',           'profesionales',  'servicios',     '{}', 10),
  ('servicios', 'profesionales', 'Abogados',                'abogados',       'servicios',     '{abogado,documentos}', 1),
  ('servicios', 'profesionales', 'Contadores',              'contadores',     'servicios',     '{contador,seniat,impuestos}', 2),
  ('servicios', 'profesionales', 'Gestoría y trámites',     'gestoria',       'servicios',     '{gestor,tramites}', 3),
-- ===== CLASIFICADOS (ventas de una vez)
  ('clasificados', null, 'Vehículos y motos',      'vehiculos',     'transporte',   '{carro,moto,camioneta}', 1),
  ('clasificados', null, 'Inmuebles',              'inmuebles',     'inicio',       '{casa,apartamento,terreno,alquiler,local}', 2),
  ('clasificados', null, 'Celulares y electrónica','electronica',   'clasificados', '{telefono,tv,consola}', 3),
  ('clasificados', null, 'Hogar y muebles',        'hogar-muebles', 'clasificados', '{mueble,nevera,cama}', 4),
  ('clasificados', null, 'Ropa y accesorios',      'ropa',          'clasificados', '{ropa,zapatos}', 5),
  ('clasificados', null, 'Animales',               'animales',      'clasificados', '{ganado,caballo,perro,gallos}', 6),
  ('clasificados', null, 'Empleos',                'empleos',       'clasificados', '{trabajo,vacante,se busca}', 7),
  ('clasificados', null, 'Otros',                  'otros',         'clasificados', '{}', 99);

-- Primero las categorías (sin padre)…
insert into categorias (seccion, nombre, slug, icono, palabras_clave, orden)
select c.seccion, c.nombre, c.slug, c.icono, c.palabras, c.orden
from _cat c
where c.padre is null
  and not exists (select 1 from categorias x
                   where x.seccion = c.seccion and x.padre_id is null and x.slug = c.slug);

-- …después las subcategorías, enganchadas a su categoría
insert into categorias (seccion, padre_id, nombre, slug, icono, palabras_clave, orden)
select c.seccion, p.id, c.nombre, c.slug, c.icono, c.palabras, c.orden
from _cat c
join categorias p on p.seccion = c.seccion and p.padre_id is null and p.slug = c.padre
where c.padre is not null
on conflict (seccion, padre_id, slug) do nothing;

drop table _cat;

-- ---------------------------------------------------------------------
-- (fin de categorías)
-- ---------------------------------------------------------------------
-- 5. Sinónimos: cómo se dice en Venezuela → cómo puede estar escrito.
--    Tú los manejas desde el admin; el buscador los usa en ambos sentidos.
-- ---------------------------------------------------------------------
insert into sinonimos (termino, equivalente) values
  ('cambur', 'banano'), ('caraota', 'frijol'), ('mototaxi', 'moto taxi'),
  ('perro caliente', 'hot dog'), ('cachapa', 'cachapas'), ('chuleta', 'costilla'),
  ('pasapalos', 'bocadillos'), ('torta', 'pastel'), ('refresco', 'gaseosa'),
  ('caucho', 'neumatico'), ('nevera', 'refrigerador'), ('carro', 'auto'),
  ('celular', 'telefono'), ('pañal', 'pañales'), ('harina pan', 'harina de maiz'),
  ('queso duro', 'queso llanero'), ('queso de mano', 'queso fresco'),
  ('delivery', 'domicilio'), ('plomero', 'fontanero'), ('aire', 'aire acondicionado')
on conflict (termino, equivalente) do nothing;
