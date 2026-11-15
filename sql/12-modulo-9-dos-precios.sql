-- sql/12 · Módulo 9 (ajuste): más tipos al mayor y dos precios (detal y mayor). Pegar completo en Supabase → SQL Editor → Run.
-- Mismo contenido que supabase/migrations/20261108001000_dos_precios.sql

-- =====================================================================
-- Módulo 9 (ajuste, aprobado 14/11/2026, decisiones 39 y 40)
--   1. Una sola lista de tipos para vender al mayor: los del campo + los de Tiendas,
--      con 3 nuevos (Productos de limpieza, Artesanía, Alimentos procesados).
--      "Cirugías" (tratamientos para alisar el cabello) se encuentran en Belleza y cosméticos.
--   2. Dos precios en una sola publicación: "precio" es al detal y "precio_mayor" es al mayor
--      (con su unidad y pedido mínimo). /precios usa el precio al mayor.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tipos nuevos (en Tiendas, así también los puede marcar una tienda al detal)
-- ---------------------------------------------------------------------
insert into categorias (seccion, nombre, slug, palabras_clave, orden) values
  ('tiendas', 'Productos de limpieza', 'limpieza', '{cloro,desinfectante,jabon,detergente,lavaplatos,suavizante}', 14),
  ('tiendas', 'Artesanía', 'artesania', '{artesano,tejido,chinchorro,ceramica,cesteria,madera}', 15),
  ('tiendas', 'Alimentos procesados', 'alimentos-procesados', '{salsa,conserva,encurtido,mermelada,embutido}', 16)
on conflict (seccion, padre_id, slug) do nothing;

update categorias
   set palabras_clave = (select array_agg(distinct x) from unnest(palabras_clave || '{cirugia,cirugia capilar,alisado,keratina,botox capilar}'::text[]) x)
 where seccion = 'tiendas' and slug = 'cosmeticos' and padre_id is null;

-- Que el buscador ya las encuentre en tiendas y productos de esa categoría
select vendedores_busqueda(vc.vendedor_id)
  from vendedor_categorias vc join categorias c on c.id = vc.categoria_id
 where c.seccion = 'tiendas' and c.slug = 'cosmeticos';
update publicaciones set categoria_id = categoria_id
 where categoria_id in (select id from categorias where seccion = 'tiendas' and slug = 'cosmeticos')
   and vendedor_id in (select id from vendedores where estado = 'activo');  -- las suspendidas no se pueden tocar

-- ---------------------------------------------------------------------
-- 2. Precio al mayor aparte del precio al detal
-- ---------------------------------------------------------------------
alter table publicaciones add column if not exists precio_mayor numeric(12,2) check (precio_mayor >= 0);

create or replace function publicaciones_al_mayor() returns trigger
language plpgsql as $$
begin
  if new.seccion = 'al_mayor' then
    new.es_al_mayor := true;                       -- los productores siempre
  elsif new.seccion <> 'tiendas' then
    new.es_al_mayor := false;                      -- comida, servicios y clasificados, nunca
  end if;
  if not new.es_al_mayor then
    new.unidad := null; new.cantidad_minima := null; new.disponibilidad := null; new.precio_mayor := null;
  end if;
  if tg_op = 'INSERT' then
    new.precio_actualizado_en := now();
  elsif new.precio_mayor is distinct from old.precio_mayor or new.moneda is distinct from old.moneda
        or new.unidad is distinct from old.unidad then
    new.precio_actualizado_en := now();
  elsif new.precio_actualizado_en is distinct from old.precio_actualizado_en then
    new.precio_actualizado_en := least(new.precio_actualizado_en, now());   -- nunca en el futuro
  end if;
  return new;
end $$;

-- Lo ya publicado al mayor: su precio era el precio al mayor. Se mueve sin cambiar la fecha.
alter table publicaciones disable trigger publicaciones_2_al_mayor;
update publicaciones set precio_mayor = precio, precio = null
 where es_al_mayor and precio_mayor is null and precio is not null;
alter table publicaciones enable trigger publicaciones_2_al_mayor;

-- ---------------------------------------------------------------------
-- 3. Tabla de /precios con el precio al mayor
-- ---------------------------------------------------------------------
create or replace function precios_origen(
  p_estado_id integer default null,
  p_municipio_id integer default null,
  p_categoria_id integer default null,
  p_solo_nacional boolean default false,
  p_dias integer default 30,
  p_limite integer default 300
) returns table (
  id bigint, titulo text, precio numeric, moneda moneda, unidad text, cantidad_minima numeric,
  disponibilidad text, categoria text, categoria_slug text, categoria_orden smallint,
  zona text, municipio text, estado text, vendedor_nombre text, vendedor_slug text,
  verificado boolean, nacional boolean, actualizado timestamptz
) language sql stable security definer set search_path = public as $$
  select p.id, p.titulo, p.precio_mayor, p.moneda, p.unidad, p.cantidad_minima, p.disponibilidad,
         coalesce(c.nombre, 'Otros'), coalesce(c.slug, 'otros'), coalesce(c.orden, 99::smallint),
         z.nombre, m.nombre, e.nombre, v.nombre, v.slug,
         v.verificado_en is not null, v.alcance_envio = 'nacional', p.precio_actualizado_en
    from publicaciones p
    join vendedores v on v.id = p.vendedor_id and v.estado = 'activo'
    join zonas z on z.id = p.zona_id
    join municipios m on m.id = z.municipio_id
    join estados e on e.id = m.estado_id
    left join categorias c on c.id = p.categoria_id
   where p.es_al_mayor and p.estado = 'publicada' and not p.agotado and p.precio_mayor is not null
     and p.vence_en > now()
     and p.precio_actualizado_en > now() - make_interval(days => least(greatest(p_dias, 1), 90))
     and (p_estado_id is null or e.id = p_estado_id)
     and (p_municipio_id is null or m.id = p_municipio_id)
     and (p_categoria_id is null or p.categoria_id = p_categoria_id)
     and (not p_solo_nacional or v.alcance_envio = 'nacional')
   order by coalesce(c.orden, 99), coalesce(c.nombre, 'Otros'), p.titulo, p.precio_actualizado_en desc
   limit least(greatest(p_limite, 1), 500)
$$;

-- ---------------------------------------------------------------------
-- 4. Listas y buscador devuelven también el precio al mayor y su unidad
--    (si no hay precio al detal, se muestra "$4 el kilo")
-- ---------------------------------------------------------------------
drop function if exists listar_publicaciones(integer, seccion, integer[], integer, integer, integer, boolean);
create or replace function listar_publicaciones(
  p_municipio_id integer,
  p_seccion seccion default null,
  p_categorias integer[] default null,
  p_zona_id integer default null,
  p_limite integer default 30,
  p_desde integer default 0,
  p_solo_con_foto boolean default false
) returns table (
  id bigint, titulo text, precio numeric, moneda moneda, precio_mayor numeric, unidad text, foto_mini text,
  zona text, agotado boolean, vendedor_nombre text, vendedor_slug text
) language sql stable security definer set search_path = public as $$
  select p.id, p.titulo, p.precio, p.moneda, p.precio_mayor, p.unidad,
         (select f.url_mini from publicacion_fotos f where f.publicacion_id = p.id order by f.orden limit 1),
         z.nombre, p.agotado, v.nombre, v.slug
    from publicaciones p
    join vendedores v on v.id = p.vendedor_id and v.estado = 'activo'
    join zonas z on z.id = p.zona_id
   where p.estado = 'publicada'
     and p.vence_en > now()
     and z.municipio_id = p_municipio_id
     and (p_seccion is null or p.seccion = p_seccion)
     and (p_categorias is null or p.categoria_id = any (p_categorias))
     and (not p_solo_con_foto or (not p.agotado and exists (
           select 1 from publicacion_fotos f where f.publicacion_id = p.id)))
   order by p.agotado,
            coalesce(p.zona_id = p_zona_id, false) desc,
            p.creado_en desc
   limit least(greatest(p_limite, 1), 601) offset greatest(p_desde, 0)
$$;

drop function if exists novedades_favoritos(uuid, integer, integer);
create or replace function novedades_favoritos(p_cliente uuid, p_dias integer default 7, p_limite integer default 24)
returns table (id bigint, titulo text, precio numeric, moneda moneda, precio_mayor numeric, unidad text, foto_mini text, zona text,
               agotado boolean, vendedor_nombre text, vendedor_slug text, creado_en timestamptz)
language sql stable security definer set search_path = public as $$
  select p.id, p.titulo, p.precio, p.moneda, p.precio_mayor, p.unidad,
         (select f.url_mini from publicacion_fotos f where f.publicacion_id = p.id order by f.orden limit 1),
         z.nombre, p.agotado, v.nombre, v.slug, p.creado_en
    from favoritos fa
    join vendedores v on v.id = fa.vendedor_id and v.estado = 'activo'
    join publicaciones p on p.vendedor_id = v.id
    join zonas z on z.id = p.zona_id
   where fa.cliente_id = p_cliente
     and p.estado = 'publicada' and p.vence_en > now() and not p.agotado
     and p.creado_en > now() - make_interval(days => least(greatest(p_dias, 1), 60))
   order by p.creado_en desc
   limit least(greatest(p_limite, 1), 60)
$$;

drop function if exists buscar(text, integer, integer, integer, seccion, boolean, integer);
create or replace function buscar(
  q text,
  p_zona_id integer default null,
  p_municipio_id integer default null,
  p_cerca_municipio_id integer default null,
  p_seccion seccion default null,
  p_solo_abiertos boolean default false,
  p_limite integer default 60
) returns table (
  tipo text, id text, titulo text, subtitulo text, precio numeric, moneda moneda, precio_mayor numeric, unidad text,
  foto_mini text, vendedor_slug text, verificado boolean, zona text, seccion seccion,
  abierto boolean, agotado boolean, puntaje real
) language plpgsql volatile security definer set search_path = public as $$
#variable_conflict use_column
declare
  qn text := f_unaccent(lower(trim(coalesce(q, ''))));
  qf text := f_fonetico(q);
  qx text;
  tsq tsquery;
  total int;
  muni int := coalesce(p_municipio_id, p_cerca_municipio_id,
                       (select municipio_id from zonas where id = p_zona_id));
begin
  if length(qn) < 2 then return; end if;

  -- Expandir sinónimos: "queso duro" → "queso duro or queso llanero"
  select string_agg(distinct t, ' or ') into qx from (
    select qn as t
    union select f_unaccent(lower(equivalente)) from sinonimos where f_unaccent(lower(termino)) = qn
    union select f_unaccent(lower(termino)) from sinonimos where f_unaccent(lower(equivalente)) = qn
  ) s;
  tsq := websearch_to_tsquery('es_lokl', qx);

  return query
  with pubs as (
    select 'publicacion'::text, p.id::text, p.titulo, v.nombre, p.precio, p.moneda, p.precio_mayor, p.unidad,
           (select f.url_mini from publicacion_fotos f where f.publicacion_id = p.id order by f.orden limit 1),
           v.slug, v.verificado_en is not null, z.nombre, p.seccion,
           esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto),
           p.agotado,
           ( coalesce(ts_rank(p.busqueda, tsq), 0) + greatest(word_similarity(qn, f_unaccent(lower(p.titulo))), word_similarity(qf, f_fonetico(p.titulo)))
             + case when p.zona_id = p_zona_id then 0.6 when z.municipio_id = muni then 0.3 else 0 end
             + case when v.verificado_en is not null then 0.15 else 0 end
             - case when p.agotado then 1 else 0 end )::real
      from publicaciones p
      join vendedores v on v.id = p.vendedor_id and v.estado = 'activo'
      join zonas z on z.id = p.zona_id
     where p.estado = 'publicada' and p.vence_en > now()
       and (p_seccion is null or p.seccion = p_seccion)
       and (p_municipio_id is null or z.municipio_id = p_municipio_id)
       and (p.busqueda @@ tsq or qn <% f_unaccent(lower(p.titulo)) or qf <% f_fonetico(p.titulo))
       and (not p_solo_abiertos or esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto))
  ), vends as (
    select 'vendedor'::text, v.id::text, v.nombre, left(v.descripcion, 140), null::numeric, null::moneda, null::numeric, null::text,
           v.logo_url, v.slug, v.verificado_en is not null, z.nombre, v.seccion_principal,
           esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto),
           false,
           ( coalesce(ts_rank(v.busqueda, tsq), 0) + greatest(word_similarity(qn, f_unaccent(lower(v.nombre))), word_similarity(qf, f_fonetico(v.nombre)))
             + case when v.zona_id = p_zona_id
                      or exists (select 1 from vendedor_zonas vz where vz.vendedor_id = v.id and vz.zona_id = p_zona_id)
                    then 0.6 when z.municipio_id = muni then 0.3 else 0 end
             + case when v.verificado_en is not null then 0.15 else 0 end )::real
      from vendedores v join zonas z on z.id = v.zona_id
     where v.estado = 'activo'
       and v.tipo <> 'persona'   -- quien solo vende algo aparece por sus anuncios, no como tienda
       and (p_seccion is null or v.seccion_principal = p_seccion)
       and (p_municipio_id is null or z.municipio_id = p_municipio_id)
       and (v.busqueda @@ tsq or qn <% f_unaccent(lower(v.nombre)) or qf <% f_fonetico(v.nombre))
       and (not p_solo_abiertos or esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto))
  )
  select * from (select * from pubs union all select * from vends) r
  order by 16 desc
  limit least(greatest(p_limite, 1), 100);

  get diagnostics total = row_count;
  insert into busquedas (texto, zona_id, municipio_id, resultados) values (qn, p_zona_id, muni, total);
end $$;
