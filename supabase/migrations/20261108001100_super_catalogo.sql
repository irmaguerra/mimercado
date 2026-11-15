-- =====================================================================
-- Módulo 10A · Lokl Súper: catálogo y administración (decisiones 45 a 53)
--   1. Pasillos del Súper, cada uno con su margen (vacío = margen general).
--   2. Productos: código de barras, pasillo, "en el catálogo" (elegido por el admin)
--      y precio vacío mientras no tenga costo. El cliente solo ve lo que está en el
--      catálogo, disponible y con precio.
--   3. Precio = costo × (1 + margen). Margen: el del producto, si no el del pasillo,
--      si no el general (7%). Costos y márgenes son INTERNOS: solo el admin los ve.
--   4. Configuración: margen general (interno), tasa del día y reglas de envío (públicas).
-- =====================================================================

-- 1. Pasillos ----------------------------------------------------------
create table if not exists super_pasillos (
  id         integer generated always as identity primary key,
  nombre     text not null unique,
  slug       text not null unique,
  orden      smallint not null default 0,
  margen_pct numeric(5,2) check (margen_pct is null or (margen_pct >= 0 and margen_pct <= 100))
);
alter table super_pasillos enable row level security;
drop policy if exists lectura_publica on super_pasillos;
create policy lectura_publica on super_pasillos for select using (true);
drop policy if exists admin_cambia on super_pasillos;
create policy admin_cambia on super_pasillos for update using (es_admin()) with check (es_admin());
-- El margen del pasillo es interno: el público solo lee nombre, slug y orden.
revoke select on super_pasillos from anon, authenticated;
grant select (id, nombre, slug, orden) on super_pasillos to anon, authenticated;
grant update (margen_pct) on super_pasillos to authenticated;

insert into super_pasillos (nombre, slug, orden) values
  ('Harinas, arroz y granos',       'harinas-arroz-granos', 1),
  ('Pastas',                        'pastas',               2),
  ('Aceites, margarina y mayonesa', 'aceites',              3),
  ('Café, azúcar y desayuno',       'cafe-desayuno',        4),
  ('Lácteos y huevos',              'lacteos-huevos',       5),
  ('Carnes, pollo y charcutería',   'carnes',               6),
  ('Frutas y verduras',             'frutas-verduras',      7),
  ('Enlatados',                     'enlatados',            8),
  ('Salsas y condimentos',          'salsas-condimentos',   9),
  ('Galletas, dulces y snacks',     'galletas-snacks',     10),
  ('Bebidas',                       'bebidas',             11),
  ('Limpieza del hogar',            'limpieza',            12),
  ('Cuidado personal',              'cuidado-personal',    13),
  ('Bebé',                          'bebe',                14)
on conflict (slug) do nothing;

-- 2. Productos -----------------------------------------------------------
alter table super_productos add column if not exists pasillo_id  integer references super_pasillos(id);
alter table super_productos add column if not exists codigo      text;
alter table super_productos add column if not exists en_catalogo boolean not null default false;
alter table super_productos add column if not exists foto_fuente text;
alter table super_productos alter column precio drop not null;
alter table super_productos drop constraint if exists super_productos_foto_fuente_check;
alter table super_productos add constraint super_productos_foto_fuente_check
  check (foto_fuente is null or foto_fuente in ('open_food_facts', 'propia'));
alter table super_productos drop constraint if exists super_productos_codigo_check;
alter table super_productos add constraint super_productos_codigo_check
  check (codigo is null or codigo ~ '^[0-9]{6,14}$');
create unique index if not exists super_productos_codigo_uq on super_productos (municipio_id, codigo) where codigo is not null;
create unique index if not exists super_productos_nombre_uq on super_productos (municipio_id, lower(nombre), lower(coalesce(presentacion, '')));
create index if not exists super_productos_pasillo_idx on super_productos (municipio_id, pasillo_id) where en_catalogo;

drop policy if exists lectura_publica on super_productos;
create policy lectura_publica on super_productos for select
  using ((en_catalogo and disponible and precio is not null) or es_admin());
drop policy if exists admin_crea on super_productos;
create policy admin_crea on super_productos for insert with check (es_admin());
drop policy if exists admin_cambia on super_productos;
create policy admin_cambia on super_productos for update using (es_admin()) with check (es_admin());
drop policy if exists admin_borra on super_productos;
create policy admin_borra on super_productos for delete using (es_admin());

-- Texto para buscar: nombre, marca y presentación, sin acentos.
create or replace function super_productos_busqueda() returns trigger
language plpgsql set search_path = public as $$
begin
  new.busqueda := to_tsvector('es_lokl', concat_ws(' ', new.nombre, new.marca, new.presentacion));
  new.actualizado_en := now();
  return new;
end $$;
drop trigger if exists super_productos_1_busqueda on super_productos;
create trigger super_productos_1_busqueda before insert or update of nombre, marca, presentacion
  on super_productos for each row execute function super_productos_busqueda();

-- 3. Margen y precio -----------------------------------------------------
insert into configuracion (clave, valor) values
  ('super_margen', '7'),
  ('super_tasa',   '{"bs": null, "fecha": null}'),
  ('super_envio',  '{"zona": "Casco central de San Fernando", "gratis_desde": 20, "tarifa": 1, "minimo": 5}')
on conflict (clave) do nothing;

drop policy if exists lectura_publica on configuracion;
create policy lectura_publica on configuracion for select
  using (clave in ('super_abierto', 'super_tasa', 'super_envio') or es_admin());

-- El margen del producto pasa a ser opcional (vacío = el del pasillo o el general).
alter table super_costos alter column margen_pct drop not null;
alter table super_costos alter column margen_pct drop default;

-- Margen que aplica: producto → pasillo → general.
create or replace function super_margen_de(p_margen_producto numeric, p_pasillo_id integer)
returns numeric language sql stable security definer set search_path = public as $$
  select coalesce(
    p_margen_producto,
    (select margen_pct from super_pasillos where id = p_pasillo_id),
    (select (valor #>> '{}')::numeric from configuracion where clave = 'super_margen'),
    7);
$$;
revoke execute on function super_margen_de(numeric, integer) from public, anon, authenticated;

create or replace function super_precio(p_costo numeric, p_margen numeric)
returns numeric language sql immutable as $$
  select case when p_costo is null then null else round(p_costo * (1 + p_margen / 100), 2) end;
$$;

-- Al guardar o borrar un costo, el precio público se recalcula (o queda vacío).
create or replace function super_recalcular_precio() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    update super_productos set precio = null, actualizado_en = now() where id = old.producto_id;
    return old;
  end if;
  update super_productos p
     set precio = super_precio(new.costo, super_margen_de(new.margen_pct, p.pasillo_id)),
         actualizado_en = now()
   where p.id = new.producto_id;
  return new;
end $$;
drop trigger if exists super_costos_precio on super_costos;
create trigger super_costos_precio after insert or update or delete on super_costos
  for each row execute function super_recalcular_precio();

-- Si el producto cambia de pasillo, su precio sigue el margen del pasillo nuevo.
create or replace function super_productos_pasillo() returns trigger
language plpgsql security definer set search_path = public as $$
declare c record;
begin
  select costo, margen_pct into c from super_costos where producto_id = new.id;
  if found then new.precio := super_precio(c.costo, super_margen_de(c.margen_pct, new.pasillo_id)); end if;
  return new;
end $$;
drop trigger if exists super_productos_2_pasillo on super_productos;
create trigger super_productos_2_pasillo before update of pasillo_id on super_productos
  for each row execute function super_productos_pasillo();

-- Recalcula todos los precios (al cambiar el margen general o el de un pasillo).
create or replace function super_recalcular_todo(p_pasillo_id integer default null)
returns integer language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  update super_productos p
     set precio = super_precio(c.costo, super_margen_de(c.margen_pct, p.pasillo_id)),
         actualizado_en = now()
    from super_costos c
   where c.producto_id = p.id
     and (p_pasillo_id is null or p.pasillo_id = p_pasillo_id);
  get diagnostics n = row_count;
  return n;
end $$;
revoke execute on function super_recalcular_todo(integer) from public, anon, authenticated;

create or replace function super_pasillos_margen() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform super_recalcular_todo(new.id);
  return new;
end $$;
drop trigger if exists super_pasillos_margen on super_pasillos;
create trigger super_pasillos_margen after update of margen_pct on super_pasillos
  for each row execute function super_pasillos_margen();

-- 4. Acciones del admin ------------------------------------------------
create or replace function super_poner_margen(p_margen numeric) returns integer
language plpgsql security definer set search_path = public as $$
begin
  perform exigir_admin();
  if p_margen is null or p_margen < 0 or p_margen > 100 then raise exception 'Margen entre 0 y 100'; end if;
  update configuracion set valor = to_jsonb(p_margen) where clave = 'super_margen';
  return super_recalcular_todo(null);
end $$;

create or replace function super_poner_tasa(p_bs numeric) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform exigir_admin();
  if p_bs is null or p_bs <= 0 then raise exception 'Escribe la tasa en bolívares por dólar'; end if;
  update configuracion
     set valor = jsonb_build_object('bs', p_bs, 'fecha', to_char(now() at time zone 'America/Caracas', 'YYYY-MM-DD'))
   where clave = 'super_tasa';
end $$;

create or replace function super_poner_envio(p_gratis_desde numeric, p_tarifa numeric, p_minimo numeric) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform exigir_admin();
  if p_gratis_desde < 0 or p_tarifa < 0 or p_minimo < 0 then raise exception 'Montos inválidos'; end if;
  update configuracion
     set valor = valor || jsonb_build_object('gratis_desde', p_gratis_desde, 'tarifa', p_tarifa, 'minimo', p_minimo)
   where clave = 'super_envio';
end $$;

-- Guardar muchos costos de una vez: [{"id": 1, "costo": 1.10}, {"id": 2, "costo": null}, ...]
-- costo vacío = borra el costo (el producto queda sin precio y el cliente no lo ve).
create or replace function super_guardar_costos(p_items jsonb) returns integer
language plpgsql security definer set search_path = public as $$
declare it jsonb; n integer := 0; v numeric;
begin
  perform exigir_admin();
  for it in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) loop
    v := nullif(it->>'costo', '')::numeric;
    if v is null then
      delete from super_costos where producto_id = (it->>'id')::bigint;
    elsif v < 0 then
      raise exception 'Costo inválido';
    else
      insert into super_costos (producto_id, costo, margen_pct, actualizado_en)
      values ((it->>'id')::bigint, v, nullif(it->>'margen', '')::numeric, now())
      on conflict (producto_id) do update
        set costo = excluded.costo,
            margen_pct = case when it ? 'margen' then excluded.margen_pct else super_costos.margen_pct end,
            actualizado_en = now();
    end if;
    n := n + 1;
  end loop;
  return n;
end $$;

-- Lista para el admin: productos con su costo, margen que aplica y precio.
create or replace function super_admin_productos(p_municipio_id integer, p_en_catalogo boolean default null)
returns table (id bigint, nombre text, marca text, presentacion text, pasillo_id integer, codigo text,
               foto_url text, en_catalogo boolean, disponible boolean, precio numeric,
               costo numeric, margen_producto numeric, margen numeric, costo_actualizado timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  perform exigir_admin();
  return query
    select p.id, p.nombre, p.marca, p.presentacion, p.pasillo_id, p.codigo, p.foto_url,
           p.en_catalogo, p.disponible, p.precio, c.costo, c.margen_pct,
           super_margen_de(c.margen_pct, p.pasillo_id), c.actualizado_en
      from super_productos p
      left join super_costos c on c.producto_id = p.id
      left join super_pasillos s on s.id = p.pasillo_id
     where p.municipio_id = p_municipio_id
       and (p_en_catalogo is null or p.en_catalogo = p_en_catalogo)
     order by s.orden nulls last, p.nombre, p.presentacion;
end $$;

-- Pasillos con su margen (solo admin).
create or replace function super_admin_pasillos()
returns table (id integer, nombre text, orden smallint, margen_pct numeric, margen numeric, productos bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  perform exigir_admin();
  return query
    select s.id, s.nombre, s.orden, s.margen_pct, super_margen_de(null, s.id),
           (select count(*) from super_productos p where p.pasillo_id = s.id and p.en_catalogo)
      from super_pasillos s order by s.orden;
end $$;

-- 5. Catálogo público ----------------------------------------------------
-- Buscar en el Súper: por palabras y perdonando errores ("arros" = arroz).
create or replace function super_buscar(p_municipio_id integer, p_q text, p_limite integer default 40)
returns setof super_productos language sql stable security definer set search_path = public as $$
  -- Cada palabra escrita (de 2 letras o más) tiene que aparecer, igual o parecida al oído.
  with q as (select public.f_unaccent(lower(trim(p_q))) as t),
       palabras as (select w from q, regexp_split_to_table(q.t, '[^a-z0-9ñ]+') w where length(w) >= 2)
  select p.* from super_productos p, q
   where p.municipio_id = p_municipio_id and p.en_catalogo and p.disponible and p.precio is not null
     and exists (select 1 from palabras)
     and not exists (
       select 1 from palabras
        where public.f_unaccent(lower(concat_ws(' ', p.nombre, p.marca, p.presentacion))) not like '%' || w || '%'
          and public.f_fonetico(concat_ws(' ', p.nombre, p.marca)) not like '%' || public.f_fonetico(w) || '%'
          and not p.busqueda @@ plainto_tsquery('es_lokl', w))
   order by (p.busqueda @@ websearch_to_tsquery('es_lokl', q.t)) desc, p.nombre
   limit least(greatest(coalesce(p_limite, 40), 1), 100);
$$;
grant execute on function super_buscar(integer, text, integer) to anon, authenticated;
