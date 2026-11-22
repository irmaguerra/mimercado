-- =====================================================================
-- 18 · Un negocio en varias secciones y cuántos hay por categoría (decisión 86, 22/11/2026)
--   1. listar_vendedores: un negocio sale en una sección si es la suya
--      O si marcó alguna categoría de esa sección (ej. DORCAS: Tiendas y Servicios).
--   2. contar_categorias: cuántos negocios activos hay en cada categoría
--      de un municipio (para el numerito de las tarjetas).
-- Se puede correr dos veces sin problema.
-- =====================================================================

-- 1. Listado de una sección: la suya o las de sus categorías
create or replace function listar_vendedores(
  p_municipio_id integer,
  p_seccion seccion,
  p_categorias integer[] default null,
  p_zona_id integer default null,
  p_limite integer default 30,
  p_desde integer default 0,
  p_a_domicilio boolean default false,
  p_24h boolean default false
) returns table (
  slug text, nombre text, logo_url text, zona text, verificado boolean, abierto boolean,
  modalidad_cocina modalidad_cocina, hora_desde time, hora_hasta time, descripcion text,
  a_domicilio boolean, atiende_24h boolean, servicio boolean
) language sql stable security definer set search_path = public as $$
  select v.slug, v.nombre, v.logo_url, z.nombre, v.verificado_en is not null,
         esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto),
         v.modalidad_cocina, v.hora_desde, v.hora_hasta, left(v.descripcion, 140),
         v.a_domicilio, v.atiende_24h, v.seccion_principal = 'servicios'
    from vendedores v
    join zonas z on z.id = v.zona_id
   where v.estado = 'activo'
     and z.municipio_id = p_municipio_id
     and (v.seccion_principal = p_seccion
          or exists (select 1 from vendedor_categorias vc join categorias c on c.id = vc.categoria_id
                      where vc.vendedor_id = v.id and c.seccion = p_seccion))
     and (not p_a_domicilio or v.a_domicilio)
     and (not p_24h or v.atiende_24h)
     and (p_categorias is null or exists (
           select 1 from vendedor_categorias vc
            where vc.vendedor_id = v.id and vc.categoria_id = any (p_categorias)))
   order by esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto) desc,
            -- quien vive o va a tu sector, primero (ordena, no esconde)
            coalesce(v.zona_id = p_zona_id
                     or exists (select 1 from vendedor_zonas vz
                                 where vz.vendedor_id = v.id and vz.zona_id = p_zona_id), false) desc,
            -- los de esta sección antes que los que vienen de otra
            (v.seccion_principal = p_seccion) desc,
            (v.verificado_en is not null) desc,
            v.creado_en desc
   limit least(greatest(p_limite, 1), 601) offset greatest(p_desde, 0)
$$;

-- 2. Cuántos negocios activos hay en cada categoría (y en cada grupo, sumando sus oficios sin repetir)
create or replace function contar_categorias(p_municipio_id integer, p_seccion seccion)
returns table (categoria_id integer, total integer)
language sql stable security definer set search_path = public as $$
  with marcadas as (
    select vc.categoria_id, vc.vendedor_id
      from vendedor_categorias vc
      join vendedores v on v.id = vc.vendedor_id and v.estado = 'activo'
      join zonas z on z.id = v.zona_id and z.municipio_id = p_municipio_id
  )
  select c.id, count(distinct m.vendedor_id)::integer
    from categorias c
    join categorias h on h.id = c.id or h.padre_id = c.id
    join marcadas m on m.categoria_id = h.id
   where c.seccion = p_seccion and c.activa
   group by c.id
$$;

grant execute on function contar_categorias(integer, seccion) to anon, authenticated;
grant execute on function listar_vendedores(integer, seccion, integer[], integer, integer, integer, boolean, boolean) to anon, authenticated;

-- Revisión: cuántos hay por categoría en San Fernando (Tiendas)
select c.nombre, x.total
  from contar_categorias((select id from municipios where slug = 'san-fernando' limit 1), 'tiendas') x
  join categorias c on c.id = x.categoria_id;
