-- =====================================================================
-- Módulo 5 — Buscador y listados (aprobado 14/11/2026, decisiones 12 a 15)
--   1. Hasta 10 categorías por vendedor (antes 3).
--   2. listar_vendedores(): tiendas de una sección en un municipio,
--      abiertas primero, luego las del sector elegido, verificadas, nuevas.
--   3. listar_publicaciones(): clasificados y "Lo nuevo" de la portada.
--   4. buscar(): la zona del cliente ORDENA sin esconder; devuelve si está
--      abierto, la sección del vendedor y deja los agotados al final.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Hasta 10 categorías por vendedor
-- ---------------------------------------------------------------------
drop trigger if exists vendedor_categorias_max on vendedor_categorias;
drop function if exists max_tres_categorias();

create or replace function max_categorias() returns trigger language plpgsql as $$
begin
  if (select count(*) from vendedor_categorias where vendedor_id = new.vendedor_id) >= 10 then
    raise exception 'Máximo 10 categorías por vendedor';
  end if;
  return new;
end $$;
create trigger vendedor_categorias_max before insert on vendedor_categorias
  for each row execute function max_categorias();

create index if not exists vendedor_categorias_categoria_idx on vendedor_categorias (categoria_id);
create index if not exists vendedores_seccion_idx on vendedores (seccion_principal, zona_id) where estado = 'activo';
create index if not exists publicaciones_categoria_idx on publicaciones (categoria_id) where estado = 'publicada';

-- ---------------------------------------------------------------------
-- 2. Tiendas de una sección en un municipio
--    p_categorias: ids de categoría (incluidas sus subcategorías); null = todas.
--    p_zona_id: el sector que eligió el cliente; solo ORDENA.
-- ---------------------------------------------------------------------
create or replace function listar_vendedores(
  p_municipio_id integer,
  p_seccion seccion,
  p_categorias integer[] default null,
  p_zona_id integer default null,
  p_limite integer default 30,
  p_desde integer default 0
) returns table (
  slug text, nombre text, logo_url text, zona text, verificado boolean, abierto boolean,
  modalidad_cocina modalidad_cocina, hora_desde time, hora_hasta time, descripcion text
) language sql stable security definer set search_path = public as $$
  select v.slug, v.nombre, v.logo_url, z.nombre, v.verificado_en is not null,
         esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto),
         v.modalidad_cocina, v.hora_desde, v.hora_hasta, left(v.descripcion, 140)
    from vendedores v
    join zonas z on z.id = v.zona_id
   where v.estado = 'activo'
     and z.municipio_id = p_municipio_id
     and v.seccion_principal = p_seccion
     and (p_categorias is null or exists (
           select 1 from vendedor_categorias vc
            where vc.vendedor_id = v.id and vc.categoria_id = any (p_categorias)))
   order by esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto) desc,
            coalesce(v.zona_id = p_zona_id
                     or exists (select 1 from vendedor_zonas vz
                                 where vz.vendedor_id = v.id and vz.zona_id = p_zona_id), false) desc,
            (v.verificado_en is not null) desc,
            v.creado_en desc
   limit least(greatest(p_limite, 1), 601) offset greatest(p_desde, 0)
$$;

-- ---------------------------------------------------------------------
-- 3. Publicaciones de un municipio (clasificados, "Lo nuevo")
--    Las del sector elegido primero; después lo más nuevo.
-- ---------------------------------------------------------------------
create or replace function listar_publicaciones(
  p_municipio_id integer,
  p_seccion seccion default null,
  p_categorias integer[] default null,
  p_zona_id integer default null,
  p_limite integer default 30,
  p_desde integer default 0,
  p_solo_con_foto boolean default false
) returns table (
  id bigint, titulo text, precio numeric, moneda moneda, foto_mini text,
  zona text, agotado boolean, vendedor_nombre text, vendedor_slug text
) language sql stable security definer set search_path = public as $$
  select p.id, p.titulo, p.precio, p.moneda,
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

-- ---------------------------------------------------------------------
-- 4a. "Cómo suena": perdona errores típicos al escribir en Venezuela
--     kezo = queso, mototasi = moto taxi, vaca = baca, hielo = ielo.
--     Sin acentos, minúsculas y sin espacios repetidos.
-- ---------------------------------------------------------------------
create or replace function f_fonetico(t text) returns text
language sql immutable parallel safe as $$
  select regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(
         regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(
           public.f_unaccent(lower(coalesce(t, ''))),
           'qu', 'k', 'g'),            -- queso → keso
           'c([eiy])', 's\1', 'g'),    -- cebolla → sebolla
           'c', 'k', 'g'),             -- casa → kasa
           'z', 's', 'g'),             -- kezo → keso
           'x', 's', 'g'),             -- taxi → tasi
           'v', 'b', 'g'),             -- vaca → baca
           'll', 'y', 'g'),            -- pollo → poyo
           'h', '', 'g'),              -- hielo → ielo
           '([a-z])\1+', '\1', 'g'),   -- letras repetidas: carro → karo
           '\s+', ' ', 'g')
$$;

create index if not exists publicaciones_titulo_fon_idx on publicaciones using gin (f_fonetico(titulo) gin_trgm_ops);
create index if not exists vendedores_nombre_fon_idx on vendedores using gin (f_fonetico(nombre) gin_trgm_ops);

-- ---------------------------------------------------------------------
-- 4b. Buscador: una sola función para todo Lokl
--    p_municipio_id  → FILTRA (cuando el cliente lo pide explícitamente)
--    p_cerca_municipio_id / p_zona_id → solo ORDENAN: lo cercano primero
-- ---------------------------------------------------------------------
drop function if exists buscar(text, integer, integer, seccion, boolean, integer);

create or replace function buscar(
  q text,
  p_zona_id integer default null,
  p_municipio_id integer default null,
  p_cerca_municipio_id integer default null,
  p_seccion seccion default null,
  p_solo_abiertos boolean default false,
  p_limite integer default 60
) returns table (
  tipo text, id text, titulo text, subtitulo text, precio numeric, moneda moneda,
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
    select 'publicacion'::text, p.id::text, p.titulo, v.nombre, p.precio, p.moneda,
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
    select 'vendedor'::text, v.id::text, v.nombre, left(v.descripcion, 140), null::numeric, null::moneda,
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
  order by 14 desc
  limit least(greatest(p_limite, 1), 100);

  get diagnostics total = row_count;
  insert into busquedas (texto, zona_id, municipio_id, resultados) values (qn, p_zona_id, muni, total);
end $$;
