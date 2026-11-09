-- ===== Lokl · Módulo 4: Publicar =====
-- Decisiones de Irma (8/11/2026):
--   · Solo los clasificados vencen (30 días). Tiendas, comida, al mayor y servicios no vencen:
--     el vendedor los marca "agotado".
--   · Hasta 3 fotos por producto (lo controla la app).
--   · Precio opcional, en dólares o bolívares, siempre exacto.

-- ---------------------------------------------------------------------
-- 1. "Agotado": el producto sigue en la tienda, marcado, y al final de la lista.
-- ---------------------------------------------------------------------
alter table publicaciones add column agotado boolean not null default false;

-- ---------------------------------------------------------------------
-- 2. Vencimiento solo para clasificados. Los demás quedan con vence_en = 'infinity'
--    (así el buscador y la tarea de las 12 a. m. siguen funcionando sin cambios).
-- ---------------------------------------------------------------------
create or replace function publicaciones_vencimiento() returns trigger
language plpgsql as $$
begin
  if new.seccion = 'clasificados' then
    if tg_op = 'INSERT' or old.seccion is distinct from 'clasificados' then
      new.vence_en := now() + interval '30 days';
    end if;
  else
    new.vence_en := 'infinity';
  end if;
  return new;
end $$;

create trigger publicaciones_1_vence before insert or update of seccion, vence_en on publicaciones
  for each row execute function publicaciones_vencimiento();

update publicaciones set vence_en = 'infinity' where seccion <> 'clasificados';

-- ---------------------------------------------------------------------
-- 3. Lo que el vendedor NO puede cambiar por su cuenta (solo el admin):
--    · sacar de revisión u ocultamiento una publicación moderada
--    · ponerle estados que no son suyos
--    · alargar el vencimiento más de 30 días, cambiar de dueño o de sección
--    (el nombre empieza con 0 para que corra antes que los demás triggers)
--    Sin usuario (auth.uid() vacío) es el SQL Editor de Supabase: ahí sí se permite.
-- ---------------------------------------------------------------------
create or replace function publicaciones_proteger_campos() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not es_admin() then
    new.vendedor_id   := old.vendedor_id;
    new.seccion       := old.seccion;
    new.motivo_estado := old.motivo_estado;
    if new.estado is distinct from old.estado and (
         old.estado in ('en_revision', 'oculta_reportes', 'oculta_admin', 'borrada')
         or new.estado not in ('publicada', 'vendida')) then
      new.estado := old.estado;
    end if;
    if new.vence_en is distinct from old.vence_en then
      new.vence_en := least(new.vence_en, now() + interval '30 days');
    end if;
  end if;
  return new;
end $$;

create trigger publicaciones_0_proteger before update on publicaciones
  for each row execute function publicaciones_proteger_campos();

-- Al crear, siempre nace "publicada" (el filtro de palabras puede pasarla a revisión).
alter policy crear_publicacion on publicaciones
  with check (vendedor_id = mi_vendedor_id() and estado = 'publicada');

-- El vendedor puede borrar sus publicaciones (las fotos se borran con ellas).
create policy borrar_publicacion on publicaciones for delete
  using (vendedor_id = mi_vendedor_id() or es_admin());

-- ---------------------------------------------------------------------
-- 4. Fotos de las publicaciones: se ven si la publicación se ve; las maneja su dueño.
-- ---------------------------------------------------------------------
create policy ver on publicacion_fotos for select
  using (exists (select 1 from publicaciones p where p.id = publicacion_id));
create policy duenio on publicacion_fotos for all
  using (exists (select 1 from publicaciones p where p.id = publicacion_id
                  and (p.vendedor_id = mi_vendedor_id() or es_admin())))
  with check (exists (select 1 from publicaciones p where p.id = publicacion_id
                  and (p.vendedor_id = mi_vendedor_id() or es_admin())));

-- Lo mismo para las tiendas (sql/03): desde el SQL Editor se debe poder suspender o verificar.
create or replace function vendedores_proteger_campos() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not es_admin() then
    new.estado            := old.estado;
    new.motivo_suspension := old.motivo_suspension;
    new.verificado_en     := old.verificado_en;
    new.usuario_id        := old.usuario_id;
  end if;
  return new;
end $$;

-- Para listar rápido los productos de una tienda (disponibles primero).
create index publicaciones_tienda_idx on publicaciones (vendedor_id, agotado, creado_en desc)
  where estado = 'publicada';

-- Comprobación: debe decir "agotado: sí" y "fotos con permisos: 2"
select
  (select case when count(*) = 1 then 'sí' else 'no' end from information_schema.columns
    where table_name = 'publicaciones' and column_name = 'agotado') as agotado,
  (select count(*) from pg_policies where tablename = 'publicacion_fotos') as fotos_con_permisos;
