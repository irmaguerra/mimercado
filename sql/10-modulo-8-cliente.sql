-- sql/10 · Módulo 8: cliente (favoritos, reseñas y contador). Pegar completo en Supabase → SQL Editor → Run.
-- Mismo contenido que supabase/migrations/20261108000800_cliente.sql

-- =====================================================================
-- Módulo 8 — Cliente: favoritos, reseñas y contador (aprobado 14/11/2026, decisiones 27 a 32)
--   El cliente no tiene cuenta: su teléfono se reconoce por un id guardado en una cookie.
--   Ese id es privado: nadie (ni el vendedor) puede leerlo, porque con él se podría
--   opinar o ver favoritos en nombre de otra persona.
--   1. Contactos: se guarda el id del cliente; el vendedor ya no lo puede ver.
--   2. Favoritos: guardar, quitar, "mis favoritos" y "lo nuevo de tus favoritos".
--   3. Reseñas: solo quien escribió o llamó desde Lokl (decisión 28); una por teléfono y tienda;
--      el vendedor responde una vez; se reportan y se ocultan con 3 reportes.
--   4. Contador semanal del vendedor.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Enlaces reservados nuevos
-- ---------------------------------------------------------------------
create or replace function slug_reservado(s text) returns boolean
language sql stable as $$
  select s = any (array[
      'super','panel','admin','buscar','entrar','salir','auth','ubicacion','precios',
      'presupuesto','presupuestos','favoritos','mis-pedidos','conoce','vende','verificado',
      'p','c','api','contacto','sin-conexion','iconos','lokl','usalokl','ayuda','soporte',
      'terminos','privacidad','404','favicon','robots','sitemap','manifest','sw','www',
      'reportar','opinar','opiniones'])
      or exists (select 1 from estados where slug = s)
$$;

-- ---------------------------------------------------------------------
-- 1. El id del cliente es privado
-- ---------------------------------------------------------------------
revoke select on contactos from anon, authenticated;
grant select (id, vendedor_id, publicacion_id, tipo, creado_en) on contactos to anon, authenticated;
create index if not exists contactos_cliente_idx on contactos (cliente_id, vendedor_id) where cliente_id is not null;

-- Favoritos y reseñas solo se crean por las funciones de abajo
drop policy if exists anon_crear on favoritos;
drop policy if exists anon_crear on resenas;

-- Reseñas: respuesta del vendedor (decisión 30)
alter table resenas add column if not exists respuesta text check (char_length(respuesta) <= 400);
alter table resenas add column if not exists respondida_en timestamptz;
alter table resenas add column if not exists actualizada_en timestamptz;
create index if not exists resenas_vendedor_idx on resenas (vendedor_id, creado_en desc) where estado = 'publicada';

revoke select on resenas from anon, authenticated;
grant select (id, vendedor_id, nombre, estrellas, texto, estado, creado_en, actualizada_en, respuesta, respondida_en)
  on resenas to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. Favoritos (solo tiendas, no personas de clasificados: decisión 32)
-- ---------------------------------------------------------------------
create or replace function guardar_favorito(p_cliente uuid, p_slug text, p_guardar boolean default true)
returns text language plpgsql volatile security definer set search_path = public as $$
declare v_id uuid;
begin
  if p_cliente is null then raise exception 'Falta el cliente'; end if;
  select id into v_id from vendedores where slug = p_slug and estado = 'activo' and tipo <> 'persona';
  if v_id is null then return 'no_existe'; end if;
  if p_guardar then
    insert into favoritos (cliente_id, vendedor_id) values (p_cliente, v_id) on conflict do nothing;
    return 'guardado';
  end if;
  delete from favoritos where cliente_id = p_cliente and vendedor_id = v_id;
  return 'quitado';
end $$;

create or replace function mis_favoritos(p_cliente uuid)
returns table (slug text, nombre text, logo_url text, zona text, verificado boolean, abierto boolean,
               servicio boolean, a_domicilio boolean, atiende_24h boolean, guardado_en timestamptz)
language sql stable security definer set search_path = public as $$
  select v.slug, v.nombre, v.logo_url, z.nombre, v.verificado_en is not null,
         esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto),
         v.seccion_principal = 'servicios', v.a_domicilio, v.atiende_24h, f.creado_en
    from favoritos f
    join vendedores v on v.id = f.vendedor_id and v.estado = 'activo'
    join zonas z on z.id = v.zona_id
   where f.cliente_id = p_cliente
   order by esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto) desc, v.nombre
   limit 200
$$;

-- "Lo nuevo de tus favoritos": lo publicado en los últimos días por las tiendas guardadas
create or replace function novedades_favoritos(p_cliente uuid, p_dias integer default 7, p_limite integer default 24)
returns table (id bigint, titulo text, precio numeric, moneda moneda, foto_mini text, zona text,
               agotado boolean, vendedor_nombre text, vendedor_slug text, creado_en timestamptz)
language sql stable security definer set search_path = public as $$
  select p.id, p.titulo, p.precio, p.moneda,
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

-- ---------------------------------------------------------------------
-- 3. Reseñas
-- ---------------------------------------------------------------------

-- ¿Este teléfono le escribió o lo llamó desde Lokl? (decisión 28)
create or replace function puede_opinar(p_cliente uuid, p_slug text)
returns text language sql stable security definer set search_path = public as $$
  select case
    when v.id is null then 'no_existe'
    when not exists (select 1 from contactos c where c.cliente_id = p_cliente and c.vendedor_id = v.id
                      and c.tipo in ('whatsapp', 'llamada')) then 'sin_contacto'
    else 'si' end
  from (select 1) uno
  left join vendedores v on v.slug = p_slug and v.estado = 'activo' and v.tipo <> 'persona'
$$;

-- Su reseña (para editarla). Devuelve una fila o ninguna.
create or replace function mi_resena(p_cliente uuid, p_slug text)
returns table (estrellas smallint, texto text, nombre text, estado estado_resena)
language sql stable security definer set search_path = public as $$
  select r.estrellas, r.texto, r.nombre, r.estado
    from resenas r join vendedores v on v.id = r.vendedor_id
   where r.cliente_id = p_cliente and v.slug = p_slug
$$;

-- Crear o cambiar su reseña. Devuelve 'ok', 'sin_contacto', 'no_existe', 'limite' o 'revision'.
create or replace function opinar(p_cliente uuid, p_slug text, p_estrellas integer, p_texto text default null, p_nombre text default null)
returns text language plpgsql volatile security definer set search_path = public as $$
declare
  v_id uuid;
  permiso text := puede_opinar(p_cliente, p_slug);
  t text := left(nullif(trim(p_texto), ''), 600);
  n text := left(nullif(trim(p_nombre), ''), 40);
  accion accion_palabra;
  nueva_estado estado_resena := 'publicada';
begin
  if permiso <> 'si' then return permiso; end if;
  if p_estrellas not between 1 and 5 then raise exception 'Estrellas no válidas'; end if;
  select id into v_id from vendedores where slug = p_slug;

  -- Freno anti-abuso: un teléfono deja hasta 5 reseñas nuevas por día; una tienda recibe hasta 20.
  if not exists (select 1 from resenas where cliente_id = p_cliente and vendedor_id = v_id) and (
       (select count(*) from resenas where cliente_id = p_cliente and creado_en > now() - interval '1 day') >= 5
    or (select count(*) from resenas where vendedor_id = v_id and creado_en > now() - interval '1 day') >= 20) then
    return 'limite';
  end if;

  accion := moderar_texto(coalesce(t, '') || ' ' || coalesce(n, ''));
  if accion = 'bloquear' then raise exception 'Palabra no permitida en Lokl'; end if;
  if accion = 'revisar' then nueva_estado := 'oculta'; end if;

  insert into resenas (vendedor_id, cliente_id, nombre, estrellas, texto, estado)
  values (v_id, p_cliente, n, p_estrellas, t, nueva_estado)
  on conflict (vendedor_id, cliente_id) do update
     set nombre = excluded.nombre, estrellas = excluded.estrellas, texto = excluded.texto,
         actualizada_en = now(),
         -- si Lokl la ocultó, editarla no la vuelve a mostrar
         estado = case when resenas.estado = 'oculta' then 'oculta'::estado_resena else excluded.estado end;
  return case when nueva_estado = 'oculta' then 'revision' else 'ok' end;
end $$;

-- El vendedor responde una vez (puede corregir su respuesta)
create or replace function responder_resena(p_id bigint, p_texto text)
returns void language plpgsql volatile security definer set search_path = public as $$
declare t text := left(nullif(trim(p_texto), ''), 400);
begin
  if not exists (select 1 from resenas where id = p_id and vendedor_id = mi_vendedor_id()) then
    raise exception 'Esa reseña no es de tu tienda';
  end if;
  if moderar_texto(t) = 'bloquear' then raise exception 'Palabra no permitida en Lokl'; end if;
  update resenas set respuesta = t, respondida_en = case when t is null then null else now() end where id = p_id;
end $$;

-- Promedio y cantidad (el promedio se muestra desde 3 reseñas: decisión 29, lo decide la página)
create or replace function resumen_resenas(p_vendedor uuid)
returns table (cantidad bigint, promedio numeric)
language sql stable security definer set search_path = public as $$
  select count(*), round(avg(estrellas), 1) from resenas where vendedor_id = p_vendedor and estado = 'publicada'
$$;

-- ---------------------------------------------------------------------
-- 4. Reportar reseñas (decisión 31): mismas reglas que las publicaciones
-- ---------------------------------------------------------------------
create or replace function reportar(
  p_objetivo objetivo_reporte, p_objetivo_id text, p_cliente_id uuid, p_motivo text, p_detalle text default null
) returns text language plpgsql volatile security definer set search_path = public as $$
begin
  if p_motivo not in ('estafa', 'prohibido', 'ofensivo', 'no_existe', 'otro') or p_cliente_id is null then
    raise exception 'Reporte no válido';
  end if;
  if p_objetivo = 'publicacion' then
    if not exists (select 1 from publicaciones where id::text = p_objetivo_id and estado = 'publicada') then return 'no_existe'; end if;
  elsif p_objetivo = 'vendedor' then
    if not exists (select 1 from vendedores where id::text = p_objetivo_id and estado = 'activo') then return 'no_existe'; end if;
  elsif p_objetivo = 'resena' then
    if not exists (select 1 from resenas where id::text = p_objetivo_id and estado = 'publicada') then return 'no_existe'; end if;
  else
    raise exception 'Reporte no válido';
  end if;

  insert into reportes (objetivo, objetivo_id, cliente_id, motivo, detalle)
  values (p_objetivo, p_objetivo_id, p_cliente_id, p_motivo, left(nullif(trim(p_detalle), ''), 500))
  on conflict (objetivo, objetivo_id, cliente_id) do nothing;
  return case when found then 'ok' else 'repetido' end;
end $$;

create or replace function reportes_auto_ocultar() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int; limite int := (select (valor)::int from configuracion where clave = 'reportes_para_ocultar');
begin
  if new.objetivo = 'vendedor' then return new; end if;   -- las tiendas nunca se suspenden solas
  select count(*) into n from reportes
   where objetivo = new.objetivo and objetivo_id = new.objetivo_id and resuelto_en is null;
  if n >= limite then
    if new.objetivo = 'publicacion' then
      update publicaciones set estado = 'oculta_reportes',
             motivo_estado = 'Varias personas lo reportaron. Lo estamos revisando.'
       where id = new.objetivo_id::bigint and estado = 'publicada';
    elsif new.objetivo = 'resena' then
      update resenas set estado = 'oculta' where id = new.objetivo_id::bigint and estado = 'publicada';
    end if;
  end if;
  return new;
end $$;

-- Admin: reseñas ocultas (por reportes o por el filtro) o con reportes sin resolver
create or replace function cola_resenas()
returns table (id bigint, vendedor_nombre text, vendedor_slug text, nombre text, estrellas smallint, texto text,
               estado estado_resena, reportes bigint, motivos text[], detalles text[], creado_en timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  perform exigir_admin();
  return query
  select r.id, v.nombre, v.slug, r.nombre, r.estrellas, r.texto, r.estado,
         count(x.id), coalesce(array_agg(x.motivo) filter (where x.id is not null), '{}'),
         coalesce(array_agg(x.detalle) filter (where x.detalle is not null), '{}'), r.creado_en
    from resenas r
    join vendedores v on v.id = r.vendedor_id
    left join reportes x on x.objetivo = 'resena' and x.objetivo_id = r.id::text and x.resuelto_en is null
   where r.estado = 'oculta' and not exists (
           select 1 from moderacion_log l where l.objetivo = 'resena' and l.objetivo_id = r.id::text and l.accion = 'ocultar')
      or exists (select 1 from reportes y where y.objetivo = 'resena' and y.objetivo_id = r.id::text and y.resuelto_en is null)
   group by r.id, v.id
   order by count(x.id) desc, r.creado_en;
end $$;

-- p_accion: 'aprobar' (se vuelve a ver) u 'ocultar' (queda oculta para siempre)
create or replace function moderar_resena(p_id bigint, p_accion text, p_nota text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform exigir_admin();
  if not exists (select 1 from resenas where id = p_id) then raise exception 'Esa reseña no existe'; end if;
  if p_accion = 'aprobar' then update resenas set estado = 'publicada' where id = p_id;
  elsif p_accion = 'ocultar' then update resenas set estado = 'oculta' where id = p_id;
  else raise exception 'Acción no válida';
  end if;
  update reportes set resuelto_en = now() where objetivo = 'resena' and objetivo_id = p_id::text and resuelto_en is null;
  perform anotar(p_accion, 'resena', p_id::text, p_nota);
end $$;

-- La bitácora también nombra las reseñas
create or replace function bitacora(p_limite integer default 100)
returns table (accion text, objetivo objetivo_reporte, objetivo_id text, nombre text, nota text,
               admin_correo text, creado_en timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  perform exigir_admin();
  return query
  select l.accion, l.objetivo, l.objetivo_id,
         case l.objetivo
           when 'publicacion' then (select p.titulo from publicaciones p where p.id::text = l.objetivo_id)
           when 'vendedor' then (select v.nombre from vendedores v where v.id::text = l.objetivo_id)
           when 'resena' then (select r.estrellas || '★ en ' || v.nombre from resenas r join vendedores v on v.id = r.vendedor_id
                                where r.id::text = l.objetivo_id)
         end,
         l.nota, (select u.email::text from auth.users u where u.id = l.admin_id), l.creado_en
    from moderacion_log l
   order by l.creado_en desc
   limit least(greatest(p_limite, 1), 500);
end $$;

-- ---------------------------------------------------------------------
-- 5. Contador semanal del vendedor (decisión 27, punto 4 del plan)
-- ---------------------------------------------------------------------
create or replace function mi_resumen_semana()
returns table (whatsapp bigint, llamadas bigint, personas bigint, favoritos bigint, resenas_nuevas bigint)
language sql stable security definer set search_path = public as $$
  select
    (select count(*) from contactos where vendedor_id = mi_vendedor_id() and tipo = 'whatsapp' and creado_en > now() - interval '7 days'),
    (select count(*) from contactos where vendedor_id = mi_vendedor_id() and tipo = 'llamada' and creado_en > now() - interval '7 days'),
    (select count(distinct coalesce(cliente_id::text, id::text)) from contactos
      where vendedor_id = mi_vendedor_id() and tipo in ('whatsapp', 'llamada') and creado_en > now() - interval '7 days'),
    (select count(*) from favoritos where vendedor_id = mi_vendedor_id() and creado_en > now() - interval '7 days'),
    (select count(*) from resenas where vendedor_id = mi_vendedor_id() and estado = 'publicada' and creado_en > now() - interval '7 days')
$$;

-- Sus reseñas (todas, también las ocultas, para que sepa qué pasó)
create or replace function mis_resenas()
returns table (id bigint, nombre text, estrellas smallint, texto text, estado estado_resena,
               creado_en timestamptz, respuesta text)
language sql stable security definer set search_path = public as $$
  select id, nombre, estrellas, texto, estado, creado_en, respuesta
    from resenas where vendedor_id = mi_vendedor_id()
   order by creado_en desc limit 200
$$;
