-- sql/11 · Módulo 9: al mayor y precios de origen. Pegar completo en Supabase → SQL Editor → Run.
-- Mismo contenido que supabase/migrations/20261108000900_al_mayor.sql

-- =====================================================================
-- Módulo 9 — Al mayor y precios de origen (aprobado 14/11/2026, decisiones 33 a 38)
--   1. Campos al mayor: unidad (lista aprobada), pedido mínimo, cuándo hay.
--      Los productores (sección al mayor) siempre venden al mayor; las tiendas, si lo marcan.
--   2. Fecha del precio: cambia sola al cambiar el precio; "Mi precio sigue igual" la renueva.
--   3. precios_origen(): la tabla pública de /precios (solo lo actualizado en 30 días).
--   4. productores_nacionales(): quienes envían a todo el país (puerta al mundo).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Campos al mayor
-- ---------------------------------------------------------------------
alter table publicaciones drop constraint if exists unidad_valida;
alter table publicaciones add constraint unidad_valida check (
  unidad is null or unidad in ('kilo', 'litro', 'unidad', 'docena', 'cesta', 'saco', 'caja', 'cabeza', 'tonelada'));
alter table publicaciones drop constraint if exists disponibilidad_largo;
alter table publicaciones add constraint disponibilidad_largo check (char_length(disponibilidad) <= 100);
alter table publicaciones drop constraint if exists cantidad_minima_positiva;
alter table publicaciones add constraint cantidad_minima_positiva check (cantidad_minima is null or cantidad_minima > 0);

alter table publicaciones add column if not exists precio_actualizado_en timestamptz not null default now();

-- Quién vende al mayor y cuándo cambia la fecha del precio
create or replace function publicaciones_al_mayor() returns trigger
language plpgsql as $$
begin
  if new.seccion = 'al_mayor' then
    new.es_al_mayor := true;                       -- los productores siempre
  elsif new.seccion <> 'tiendas' then
    new.es_al_mayor := false;                      -- comida, servicios y clasificados, nunca
  end if;
  if not new.es_al_mayor then
    new.unidad := null; new.cantidad_minima := null; new.disponibilidad := null;
  end if;
  if tg_op = 'INSERT' then
    new.precio_actualizado_en := now();
  elsif new.precio is distinct from old.precio or new.moneda is distinct from old.moneda
        or new.unidad is distinct from old.unidad then
    new.precio_actualizado_en := now();
  elsif new.precio_actualizado_en is distinct from old.precio_actualizado_en then
    new.precio_actualizado_en := least(new.precio_actualizado_en, now());   -- nunca en el futuro
  end if;
  return new;
end $$;
drop trigger if exists publicaciones_2_al_mayor on publicaciones;
create trigger publicaciones_2_al_mayor before insert or update on publicaciones
  for each row execute function publicaciones_al_mayor();

-- Lo ya publicado por productores pasa a ser al mayor
update publicaciones set es_al_mayor = true where seccion = 'al_mayor' and not es_al_mayor;

-- "Mi precio sigue igual": renueva la fecha sin editar nada (decisión 36)
create or replace function precio_sigue_igual(p_id bigint) returns void
language plpgsql volatile security definer set search_path = public as $$
begin
  update publicaciones set precio_actualizado_en = now()
   where id = p_id and vendedor_id = mi_vendedor_id() and es_al_mayor;
  if not found then raise exception 'Esa publicación no es tuya o no es al mayor'; end if;
end $$;

create index if not exists publicaciones_precios_idx on publicaciones (precio_actualizado_en desc)
  where es_al_mayor and estado = 'publicada';

-- ---------------------------------------------------------------------
-- 2. Tabla pública de precios de origen (/precios)
--    Filtros opcionales: estado, municipio, categoría, solo los que envían a todo el país.
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
  select p.id, p.titulo, p.precio, p.moneda, p.unidad, p.cantidad_minima, p.disponibilidad,
         coalesce(c.nombre, 'Otros'), coalesce(c.slug, 'otros'), coalesce(c.orden, 99::smallint),
         z.nombre, m.nombre, e.nombre, v.nombre, v.slug,
         v.verificado_en is not null, v.alcance_envio = 'nacional', p.precio_actualizado_en
    from publicaciones p
    join vendedores v on v.id = p.vendedor_id and v.estado = 'activo'
    join zonas z on z.id = p.zona_id
    join municipios m on m.id = z.municipio_id
    join estados e on e.id = m.estado_id
    left join categorias c on c.id = p.categoria_id
   where p.es_al_mayor and p.estado = 'publicada' and not p.agotado and p.precio is not null
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
-- 3. Productores y tiendas que envían a todo el país (decisión 37)
-- ---------------------------------------------------------------------
create or replace function productores_nacionales(p_limite integer default 30)
returns table (slug text, nombre text, logo_url text, zona text, municipio text, estado text,
               verificado boolean, envio_detalle text, seccion seccion)
language sql stable security definer set search_path = public as $$
  select v.slug, v.nombre, v.logo_url, z.nombre, m.nombre, e.nombre,
         v.verificado_en is not null, v.envio_detalle, v.seccion_principal
    from vendedores v
    join zonas z on z.id = v.zona_id
    join municipios m on m.id = z.municipio_id
    join estados e on e.id = m.estado_id
   where v.estado = 'activo' and v.alcance_envio = 'nacional' and v.tipo <> 'persona'
   order by (v.seccion_principal = 'al_mayor') desc, (v.verificado_en is not null) desc, v.creado_en desc
   limit least(greatest(p_limite, 1), 100)
$$;
