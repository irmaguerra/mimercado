-- =====================================================================
-- 17 · Servicios: Rutas y viajes, y grupo Turismo (decisión 84, 22/11/2026)
--   - Transporte → "Rutas y viajes" (viajes entre ciudades), como en la app vieja.
--   - Grupo nuevo "Turismo" con "Hospedaje" (se mueve aquí, conserva sus tiendas)
--     y "Fincas y paseos".
-- Se puede correr dos veces sin duplicar nada.
-- =====================================================================

-- 1. Rutas y viajes, dentro de Transporte
insert into categorias (seccion, padre_id, nombre, slug, icono, palabras_clave, orden)
select 'servicios', p.id, 'Rutas y viajes', 'rutas', 'transporte',
       '{ruta,rutas,viaje,viajes,pasaje,pasajes,interurbano,autobus,buseta,expreso,por puesto}', 5
  from categorias p
 where p.seccion = 'servicios' and p.padre_id is null and p.slug = 'transporte'
on conflict (seccion, padre_id, slug) do nothing;

-- 2. Grupo Turismo (va donde estaba Hospedaje, en el orden 6)
insert into categorias (seccion, nombre, slug, icono, palabras_clave, orden)
select 'servicios', 'Turismo', 'turismo', 'hospedaje', '{turismo,turista,vacaciones}', 6
 where not exists (select 1 from categorias where seccion = 'servicios' and padre_id is null and slug = 'turismo');

-- 3. Hospedaje pasa a ser parte de Turismo (las tiendas que lo marcaron lo conservan)
update categorias h
   set padre_id = t.id, orden = 1
  from categorias t
 where t.seccion = 'servicios' and t.padre_id is null and t.slug = 'turismo'
   and h.seccion = 'servicios' and h.padre_id is null and h.slug = 'hospedaje';

-- 4. Fincas y paseos, dentro de Turismo
insert into categorias (seccion, padre_id, nombre, slug, icono, palabras_clave, orden)
select 'servicios', t.id, 'Fincas y paseos', 'fincas-paseos', 'hospedaje',
       '{finca,fincas,paseo,paseos,tour,tours,excursion,pesca,pesca deportiva,llano,rio,ecoturismo}', 2
  from categorias t
 where t.seccion = 'servicios' and t.padre_id is null and t.slug = 'turismo'
on conflict (seccion, padre_id, slug) do nothing;

-- 5. Que el buscador de las tiendas de hospedaje quede al día
select vendedores_busqueda(vc.vendedor_id)
  from vendedor_categorias vc join categorias c on c.id = vc.categoria_id
 where c.seccion = 'servicios' and c.slug = 'hospedaje';

-- Revisión: debe mostrar Turismo con Hospedaje y Fincas y paseos, y Rutas y viajes en Transporte
select p.nombre as grupo, c.nombre as oficio
  from categorias c join categorias p on p.id = c.padre_id
 where c.seccion = 'servicios' and p.slug in ('transporte', 'turismo')
 order by p.orden, c.orden;
