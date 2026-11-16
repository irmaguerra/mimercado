-- =====================================================================
-- Módulo 11 — Pedir presupuesto a varios (aprobado 16/11/2026, decisiones 64 a 73)
--   1. El cliente pide sin cuenta (código anónimo del teléfono). Su WhatsApp NUNCA
--      llega a los vendedores: ellos responden en Lokl y el cliente elige a quién escribir.
--   2. Lo reciben hasta 8 vendedores de esa categoría en el municipio: primero los de su
--      sector y los verificados, y se reparte entre quienes recibieron menos esa semana.
--      Tiendas, Comida, Al mayor y Servicios; Clasificados no. Cada uno puede apagarlo.
--   3. Vence a los 3 días (se calcula al leer: no hace falta un reloj) o al tocar "Ya lo conseguí".
--   4. Una respuesta por vendedor (precio o "desde"), que puede corregir mientras siga abierto.
--   5. Avisos en el teléfono: las funciones devuelven a quién avisar y el servidor lo envía.
--   6. Máximo 3 pedidos por día por teléfono, palabras prohibidas y reportes.
--   7. Admin: lo que piden y nadie atiende (para saber qué negocios invitar).
-- =====================================================================

-- 0. Reportes: dos cosas nuevas que se pueden reportar ----------------
-- (Los valores nuevos solo se usan dentro de funciones plpgsql, que se leen al ejecutarse.)
alter type objetivo_reporte add value if not exists 'presupuesto';
alter type objetivo_reporte add value if not exists 'respuesta';

-- 1. Tablas -----------------------------------------------------------
alter table vendedores add column if not exists recibe_presupuestos boolean not null default true;

alter table presupuestos alter column zona_id drop not null;       -- "mi sector no está en la lista"
alter table presupuestos add column if not exists municipio_id integer references municipios(id);
alter table presupuestos add column if not exists oculto boolean not null default false;
alter table presupuestos add column if not exists revisar boolean not null default false;
alter table presupuestos add column if not exists cerrado_en timestamptz;
create index if not exists presupuestos_cliente_idx on presupuestos (cliente_id, creado_en desc);
create index if not exists presupuestos_whatsapp_idx on presupuestos (cliente_whatsapp, creado_en desc);
create index if not exists presupuestos_fecha_idx on presupuestos (creado_en desc);
-- Nadie inserta directo: todo pasa por presupuesto_crear() (límites y filtro de palabras).
drop policy if exists anon_crear on presupuestos;

alter table presupuesto_respuestas add column if not exists desde boolean not null default false;
alter table presupuesto_respuestas add column if not exists oculta boolean not null default false;
alter table presupuesto_respuestas add column if not exists enviado_en timestamptz not null default now();
alter table presupuesto_respuestas drop constraint if exists respuesta_precio_valido;
alter table presupuesto_respuestas add constraint respuesta_precio_valido
  check (precio is null or (precio > 0 and precio < 1000000));
alter table presupuesto_respuestas drop constraint if exists respuesta_mensaje_largo;
alter table presupuesto_respuestas add constraint respuesta_mensaje_largo check (char_length(mensaje) <= 300);
create index if not exists presupuesto_resp_enviado_idx on presupuesto_respuestas (vendedor_id, enviado_en desc);

-- Un mismo teléfono puede recibir avisos como vendedor y como cliente.
alter table push_suscripciones alter column vendedor_id drop not null;
alter table push_suscripciones add column if not exists cliente_id uuid;
alter table push_suscripciones drop constraint if exists push_con_dueno;
alter table push_suscripciones add constraint push_con_dueno check (vendedor_id is not null or cliente_id is not null);
create index if not exists push_vendedor_idx on push_suscripciones (vendedor_id) where vendedor_id is not null;
create index if not exists push_cliente_idx on push_suscripciones (cliente_id) where cliente_id is not null;

-- Foto del pedido: carpeta pública, una por presupuesto, solo en los 15 minutos después de crearlo.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('presupuestos', 'presupuestos', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create or replace function presupuesto_foto_permitida(p_carpeta text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from presupuestos
                  where id::text = p_carpeta and foto_url is null and creado_en > now() - interval '15 minutes')
$$;
grant execute on function presupuesto_foto_permitida(text) to anon, authenticated;

drop policy if exists "foto del presupuesto" on storage.objects;
create policy "foto del presupuesto" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'presupuestos' and presupuesto_foto_permitida((storage.foldername(name))[1]));
drop policy if exists "admin borra fotos de presupuestos" on storage.objects;
create policy "admin borra fotos de presupuestos" on storage.objects for delete to authenticated
  using (bucket_id = 'presupuestos' and es_admin());

-- 2. Quiénes lo reciben -------------------------------------------------
-- Hasta 8 vendedores de la categoría (o de sus subcategorías) en el municipio.
create or replace function presupuesto_destinatarios(
  p_categoria_id integer, p_municipio_id integer, p_zona_id integer, p_limite integer default 8
) returns setof uuid language sql volatile security definer set search_path = public as $$
  select v.id
    from vendedores v
    join zonas z on z.id = v.zona_id
   where v.estado = 'activo' and v.recibe_presupuestos and v.tipo <> 'persona'
     and z.municipio_id = p_municipio_id
     and v.seccion_principal in ('tiendas', 'comida', 'al_mayor', 'servicios')
     and exists (select 1 from vendedor_categorias vc
                  where vc.vendedor_id = v.id
                    and vc.categoria_id in (select c.id from categorias c
                                             where c.id = p_categoria_id or c.padre_id = p_categoria_id))
   order by coalesce(v.zona_id = p_zona_id
                     or exists (select 1 from vendedor_zonas vz where vz.vendedor_id = v.id and vz.zona_id = p_zona_id),
                     false) desc,
            (v.verificado_en is not null) desc,
            (select count(*) from presupuesto_respuestas r
              where r.vendedor_id = v.id and r.enviado_en > now() - interval '7 days'),
            random()
   limit least(greatest(p_limite, 1), 8)
$$;
revoke execute on function presupuesto_destinatarios(integer, integer, integer, integer) from public, anon, authenticated;

-- Para decirle al cliente, antes de enviar, a cuántos les llegaría (máximo 8).
create or replace function presupuesto_cuantos(p_categoria_id integer, p_municipio_id integer)
returns integer language sql stable security definer set search_path = public as $$
  select count(*)::int from (
    select 1 from vendedores v join zonas z on z.id = v.zona_id
     where v.estado = 'activo' and v.recibe_presupuestos and v.tipo <> 'persona'
       and z.municipio_id = p_municipio_id
       and v.seccion_principal in ('tiendas', 'comida', 'al_mayor', 'servicios')
       and exists (select 1 from vendedor_categorias vc
                    where vc.vendedor_id = v.id
                      and vc.categoria_id in (select c.id from categorias c
                                               where c.id = p_categoria_id or c.padre_id = p_categoria_id))
     limit 8) x
$$;
grant execute on function presupuesto_cuantos(integer, integer) to anon, authenticated;

-- Estado que ve la gente: un pedido abierto con la fecha pasada ya está vencido.
create or replace function presupuesto_estado(p presupuestos) returns text
language sql stable as $$
  select case when p.estado = 'abierto' and p.vence_en <= now() then 'vencido' else p.estado::text end
$$;

-- Avisos en el teléfono de una lista de vendedores o de un cliente.
create or replace function push_de_vendedores(p_ids uuid[]) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('endpoint', endpoint, 'claves', claves)), '[]'::jsonb)
    from push_suscripciones where vendedor_id = any (p_ids)
$$;
revoke execute on function push_de_vendedores(uuid[]) from public, anon, authenticated;

create or replace function push_de_cliente(p_cliente uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('endpoint', endpoint, 'claves', claves)), '[]'::jsonb)
    from push_suscripciones where cliente_id = p_cliente
$$;
revoke execute on function push_de_cliente(uuid) from public, anon, authenticated;

-- 3. El cliente ----------------------------------------------------------
-- Crea el pedido y lo reparte. Devuelve {id, enviados, revisar, avisos[]}.
create or replace function presupuesto_crear(
  p_cliente uuid, p_nombre text, p_whatsapp text, p_categoria_id integer,
  p_municipio_id integer, p_zona_id integer, p_descripcion text
) returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_nombre text := left(trim(coalesce(p_nombre, '')), 60);
  v_desc   text := trim(coalesce(p_descripcion, ''));
  v_id     uuid;
  v_filtro accion_palabra;
  v_frenar boolean;
  v_ids    uuid[];
begin
  if p_cliente is null then raise exception 'Falta el código del teléfono'; end if;
  if char_length(v_nombre) < 2 then raise exception 'Escribe tu nombre.'; end if;
  if coalesce(p_whatsapp, '') !~ '^58[0-9]{10}$' then
    raise exception 'Escribe tu número de WhatsApp (ej. 0414 123 4567).';
  end if;
  if char_length(v_desc) < 10 then raise exception 'Escribe qué necesitas con un poco más de detalle.'; end if;
  if char_length(v_desc) > 1000 then raise exception 'Escribe qué necesitas en menos de 1000 letras.'; end if;
  if not exists (select 1 from categorias c where c.id = p_categoria_id and c.activa
                    and c.seccion in ('tiendas', 'comida', 'al_mayor', 'servicios')) then
    raise exception 'Elige qué tipo de negocio lo tiene.';
  end if;
  if not exists (select 1 from municipios where id = p_municipio_id) then raise exception 'Elige tu municipio.'; end if;
  if p_zona_id is not null and not exists (
       select 1 from zonas where id = p_zona_id and municipio_id = p_municipio_id and activa) then
    raise exception 'Elige tu sector.';
  end if;
  -- Decisión 72: máximo 3 por día por teléfono (por número y por código del teléfono)
  if (select count(*) from presupuestos
       where (cliente_whatsapp = p_whatsapp or cliente_id = p_cliente)
         and creado_en > now() - interval '24 hours') >= 3 then
    raise exception 'Hiciste 3 pedidos de presupuesto hoy. Podrás pedir otro mañana.';
  end if;
  v_filtro := moderar_texto(v_desc || ' ' || v_nombre);
  if v_filtro = 'bloquear' then raise exception 'Tu pedido tiene una palabra no permitida en Lokl. Cámbiala para enviarlo.'; end if;
  v_frenar := coalesce(v_filtro = 'revisar', false);

  -- Con una palabra "a revisar" se guarda frenado: les llega a los vendedores cuando el admin lo aprueba.
  insert into presupuestos (cliente_id, cliente_nombre, cliente_whatsapp, categoria_id, municipio_id, zona_id,
                            descripcion, oculto, revisar)
  values (p_cliente, v_nombre, p_whatsapp, p_categoria_id, p_municipio_id, p_zona_id,
          v_desc, v_frenar, v_frenar)
  returning id into v_id;

  select array_agg(d) into v_ids from presupuesto_destinatarios(p_categoria_id, p_municipio_id, p_zona_id) d;
  insert into presupuesto_respuestas (presupuesto_id, vendedor_id)
  select v_id, unnest(coalesce(v_ids, '{}'));

  return jsonb_build_object(
    'id', v_id,
    'enviados', coalesce(array_length(v_ids, 1), 0),
    'revisar', v_frenar,
    'avisos', case when v_frenar then '[]'::jsonb else push_de_vendedores(v_ids) end);
end $$;
grant execute on function presupuesto_crear(uuid, text, text, integer, integer, integer, text) to anon, authenticated;

-- La foto se sube aparte (a la carpeta del pedido) y aquí se anota.
create or replace function presupuesto_poner_foto(p_cliente uuid, p_id uuid, p_url text) returns boolean
language plpgsql volatile security definer set search_path = public as $$
begin
  if p_url is null or p_url !~ ('/storage/v1/object/public/presupuestos/' || p_id::text || '/[a-z0-9.]+$') then
    return false;
  end if;
  update presupuestos set foto_url = p_url
   where id = p_id and cliente_id = p_cliente and foto_url is null and creado_en > now() - interval '15 minutes';
  return found;
end $$;
grant execute on function presupuesto_poner_foto(uuid, uuid, text) to anon, authenticated;

-- Lo que ve el cliente: su pedido y las respuestas, de menor a mayor precio.
create or replace function presupuesto_ver(p_cliente uuid, p_id uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'id', p.id, 'descripcion', p.descripcion, 'foto_url', p.foto_url, 'nombre', p.cliente_nombre,
    'categoria', c.nombre, 'zona', z.nombre, 'estado', presupuesto_estado(p),
    'oculto', p.oculto, 'revisar', p.revisar, 'creado_en', p.creado_en, 'vence_en', p.vence_en,
    'enviados', (select count(*) from presupuesto_respuestas r where r.presupuesto_id = p.id),
    'vistos', (select count(*) from presupuesto_respuestas r where r.presupuesto_id = p.id and r.estado <> 'enviado'),
    'respuestas', coalesce((
      select jsonb_agg(jsonb_build_object(
               'vendedor_id', v.id, 'nombre', v.nombre, 'slug', v.slug, 'logo_url', v.logo_url,
               'verificado', v.verificado_en is not null, 'precio', r.precio, 'desde', r.desde,
               'mensaje', r.mensaje, 'respondido_en', r.respondido_en,
               'resenas', (select count(*) from resenas e where e.vendedor_id = v.id and e.estado = 'publicada'),
               'estrellas', (select round(avg(e.estrellas), 1) from resenas e where e.vendedor_id = v.id and e.estado = 'publicada'))
             order by r.precio nulls last, r.respondido_en)
        from presupuesto_respuestas r
        join vendedores v on v.id = r.vendedor_id and v.estado = 'activo'
       where r.presupuesto_id = p.id and r.estado = 'respondido' and not r.oculta), '[]'::jsonb))
    from presupuestos p
    join categorias c on c.id = p.categoria_id
    left join zonas z on z.id = p.zona_id
   where p.id = p_id and p.cliente_id = p_cliente
$$;
grant execute on function presupuesto_ver(uuid, uuid) to anon, authenticated;

create or replace function mis_presupuestos(p_cliente uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x order by x->>'creado_en' desc), '[]'::jsonb) from (
    select jsonb_build_object(
             'id', p.id, 'descripcion', left(p.descripcion, 140), 'categoria', c.nombre,
             'estado', presupuesto_estado(p), 'oculto', p.oculto, 'revisar', p.revisar,
             'creado_en', p.creado_en, 'vence_en', p.vence_en,
             'respuestas', (select count(*) from presupuesto_respuestas r
                             where r.presupuesto_id = p.id and r.estado = 'respondido' and not r.oculta)) as x
      from presupuestos p join categorias c on c.id = p.categoria_id
     where p.cliente_id = p_cliente
     order by p.creado_en desc limit 20) t
$$;
grant execute on function mis_presupuestos(uuid) to anon, authenticated;

-- "Ya lo conseguí": se cierra y deja de salirles a los vendedores como abierto.
create or replace function presupuesto_cerrar(p_cliente uuid, p_id uuid) returns boolean
language plpgsql volatile security definer set search_path = public as $$
begin
  update presupuestos set estado = 'cerrado', cerrado_en = now()
   where id = p_id and cliente_id = p_cliente and estado = 'abierto';
  return found;
end $$;
grant execute on function presupuesto_cerrar(uuid, uuid) to anon, authenticated;

-- El cliente reporta una respuesta (se le oculta de una vez y el admin la revisa).
create or replace function reportar_respuesta(
  p_cliente uuid, p_id uuid, p_vendedor uuid, p_motivo text, p_detalle text default null
) returns text language plpgsql volatile security definer set search_path = public as $$
begin
  if p_motivo not in ('estafa', 'prohibido', 'ofensivo', 'no_existe', 'otro') then raise exception 'Reporte no válido'; end if;
  if not exists (select 1 from presupuestos p join presupuesto_respuestas r on r.presupuesto_id = p.id
                  where p.id = p_id and p.cliente_id = p_cliente and r.vendedor_id = p_vendedor) then
    return 'no_existe';
  end if;
  insert into reportes (objetivo, objetivo_id, cliente_id, motivo, detalle)
  values ('respuesta', p_id::text || ':' || p_vendedor::text, p_cliente, p_motivo, left(nullif(trim(p_detalle), ''), 500))
  on conflict (objetivo, objetivo_id, cliente_id) do nothing;
  update presupuesto_respuestas set oculta = true where presupuesto_id = p_id and vendedor_id = p_vendedor;
  return 'ok';
end $$;
grant execute on function reportar_respuesta(uuid, uuid, uuid, text, text) to anon, authenticated;

-- 4. El vendedor ----------------------------------------------------------
-- Los pedidos que le llegaron (30 días). Los nuevos pasan a "visto".
create or replace function mis_solicitudes() returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare v uuid := mi_vendedor_id(); lista jsonb;
begin
  if v is null then raise exception 'Necesitas una tienda'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', p.id, 'descripcion', p.descripcion, 'foto_url', p.foto_url, 'categoria', c.nombre,
           'zona', z.nombre, 'cliente', split_part(p.cliente_nombre, ' ', 1),
           'estado', presupuesto_estado(p), 'creado_en', p.creado_en, 'vence_en', p.vence_en,
           'nuevo', r.estado = 'enviado', 'respondido', r.estado = 'respondido',
           'precio', r.precio, 'desde', r.desde, 'mensaje', r.mensaje)
         order by presupuesto_estado(p) = 'abierto' desc, p.creado_en desc), '[]'::jsonb)
    into lista
    from presupuesto_respuestas r
    join presupuestos p on p.id = r.presupuesto_id
    join categorias c on c.id = p.categoria_id
    left join zonas z on z.id = p.zona_id
   where r.vendedor_id = v and r.estado <> 'descartado' and not p.oculto
     and p.creado_en > now() - interval '30 days';
  update presupuesto_respuestas r set estado = 'visto'
    from presupuestos p
   where p.id = r.presupuesto_id and r.vendedor_id = v and r.estado = 'enviado' and not p.oculto;
  return lista;
end $$;
grant execute on function mis_solicitudes() to authenticated;

-- Cuántos pedidos nuevos y abiertos tiene (para el panel).
create or replace function solicitudes_nuevas() returns integer
language sql stable security definer set search_path = public as $$
  select count(*)::int from presupuesto_respuestas r join presupuestos p on p.id = r.presupuesto_id
   where r.vendedor_id = mi_vendedor_id() and r.estado = 'enviado' and not p.oculto
     and presupuesto_estado(p) = 'abierto'
$$;
grant execute on function solicitudes_nuevas() to authenticated;

-- Responder o corregir. Devuelve {primera, avisos[]}: al cliente se le avisa solo la primera vez.
create or replace function responder_presupuesto(p_id uuid, p_precio numeric, p_desde boolean, p_mensaje text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v uuid := mi_vendedor_id(); p presupuestos; antes estado_destinatario; msj text := nullif(trim(coalesce(p_mensaje, '')), '');
begin
  if v is null then raise exception 'Necesitas una tienda'; end if;
  select * into p from presupuestos where id = p_id;
  select r.estado into antes from presupuesto_respuestas r where r.presupuesto_id = p_id and r.vendedor_id = v;
  if p.id is null or antes is null or p.oculto then raise exception 'Ese pedido no está en tu lista.'; end if;
  if presupuesto_estado(p) <> 'abierto' then raise exception 'Ese pedido ya cerró: no se puede responder.'; end if;
  if p_precio is null or p_precio <= 0 or p_precio >= 1000000 then raise exception 'Escribe tu precio en dólares (ej. 25).'; end if;
  if char_length(msj) > 300 then raise exception 'El mensaje va en menos de 300 letras.'; end if;
  if moderar_texto(msj) = 'bloquear' then raise exception 'Tu mensaje tiene una palabra no permitida en Lokl. Cámbiala para enviarlo.'; end if;
  update presupuesto_respuestas
     set estado = 'respondido', precio = round(p_precio, 2), desde = coalesce(p_desde, false),
         mensaje = msj, respondido_en = now()
   where presupuesto_id = p_id and vendedor_id = v;
  return jsonb_build_object(
    'primera', antes <> 'respondido',
    'avisos', case when antes <> 'respondido' then push_de_cliente(p.cliente_id) else '[]'::jsonb end);
end $$;
grant execute on function responder_presupuesto(uuid, numeric, boolean, text) to authenticated;

-- "No lo tengo": sale de su lista (y si había respondido, se quita su respuesta).
create or replace function descartar_presupuesto(p_id uuid) returns void
language sql volatile security definer set search_path = public as $$
  update presupuesto_respuestas set estado = 'descartado', precio = null, mensaje = null, desde = false
   where presupuesto_id = p_id and vendedor_id = mi_vendedor_id()
$$;
grant execute on function descartar_presupuesto(uuid) to authenticated;

-- El vendedor reporta un pedido (sale de su lista; con varios reportes se oculta para todos).
create or replace function reportar_presupuesto(p_id uuid, p_motivo text, p_detalle text default null)
returns text language plpgsql volatile security definer set search_path = public as $$
declare v uuid := mi_vendedor_id();
begin
  if v is null then raise exception 'Necesitas una tienda'; end if;
  if p_motivo not in ('estafa', 'prohibido', 'ofensivo', 'no_existe', 'otro') then raise exception 'Reporte no válido'; end if;
  if not exists (select 1 from presupuesto_respuestas where presupuesto_id = p_id and vendedor_id = v) then return 'no_existe'; end if;
  insert into reportes (objetivo, objetivo_id, cliente_id, motivo, detalle)
  values ('presupuesto', p_id::text, v, p_motivo, left(nullif(trim(p_detalle), ''), 500))
  on conflict (objetivo, objetivo_id, cliente_id) do nothing;
  perform descartar_presupuesto(p_id);
  return 'ok';
end $$;
grant execute on function reportar_presupuesto(uuid, text, text) to authenticated;

-- Con N reportes de vendedores distintos el pedido se oculta para todos (mismo número que las publicaciones).
create or replace function reportes_auto_ocultar() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int; limite int := (select (valor)::int from configuracion where clave = 'reportes_para_ocultar');
begin
  if new.objetivo::text in ('vendedor', 'respuesta') then return new; end if;   -- las tiendas nunca se suspenden solas
  select count(*) into n from reportes
   where objetivo = new.objetivo and objetivo_id = new.objetivo_id and resuelto_en is null;
  if n >= limite then
    if new.objetivo::text = 'publicacion' then
      update publicaciones set estado = 'oculta_reportes',
             motivo_estado = 'Varias personas lo reportaron. Lo estamos revisando.'
       where id = new.objetivo_id::bigint and estado = 'publicada';
    elsif new.objetivo::text = 'resena' then
      update resenas set estado = 'oculta' where id = new.objetivo_id::bigint and estado = 'publicada';
    elsif new.objetivo::text = 'presupuesto' then
      update presupuestos set oculto = true where id = new.objetivo_id::uuid;
    end if;
  end if;
  return new;
end $$;

-- 5. Avisos en el teléfono -----------------------------------------------
create or replace function push_valida(p_endpoint text, p_claves jsonb) returns void
language plpgsql immutable as $$
begin
  if coalesce(p_endpoint, '') !~ '^https://[^ ]+$' or char_length(p_endpoint) > 1000 or coalesce(p_claves->>'p256dh', '') = '' or coalesce(p_claves->>'auth', '') = '' then
    raise exception 'Aviso no válido';
  end if;
end $$;

create or replace function guardar_push_vendedor(p_endpoint text, p_claves jsonb) returns void
language plpgsql volatile security definer set search_path = public as $$
declare v uuid := mi_vendedor_id();
begin
  if v is null then raise exception 'Necesitas una tienda'; end if;
  perform push_valida(p_endpoint, p_claves);
  insert into push_suscripciones (vendedor_id, endpoint, claves) values (v, p_endpoint, p_claves)
  on conflict (endpoint) do update set vendedor_id = v, claves = excluded.claves;
end $$;
grant execute on function guardar_push_vendedor(text, jsonb) to authenticated;

create or replace function guardar_push_cliente(p_cliente uuid, p_endpoint text, p_claves jsonb) returns void
language plpgsql volatile security definer set search_path = public as $$
begin
  if p_cliente is null then raise exception 'Falta el código del teléfono'; end if;
  perform push_valida(p_endpoint, p_claves);
  insert into push_suscripciones (cliente_id, endpoint, claves) values (p_cliente, p_endpoint, p_claves)
  on conflict (endpoint) do update set cliente_id = p_cliente, claves = excluded.claves;
end $$;
grant execute on function guardar_push_cliente(uuid, text, jsonb) to anon, authenticated;

-- El servicio de avisos dijo que ese teléfono ya no existe (o la persona quitó el permiso).
create or replace function borrar_push(p_endpoint text) returns void
language sql volatile security definer set search_path = public as $$
  delete from push_suscripciones where endpoint = p_endpoint
$$;
grant execute on function borrar_push(text) to anon, authenticated;

-- 6. Admin ------------------------------------------------------------------
-- Pedidos frenados por el filtro o reportados, y respuestas reportadas.
create or replace function cola_presupuestos() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform exigir_admin();
  return jsonb_build_object(
    'presupuestos', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', p.id, 'descripcion', p.descripcion, 'foto_url', p.foto_url, 'categoria', c.nombre,
               'nombre', p.cliente_nombre, 'revisar', p.revisar, 'oculto', p.oculto, 'creado_en', p.creado_en,
               'reportes', (select count(*) from reportes x where x.objetivo::text = 'presupuesto' and x.objetivo_id = p.id::text and x.resuelto_en is null),
               'motivos', coalesce((select array_agg(x.motivo) from reportes x where x.objetivo::text = 'presupuesto' and x.objetivo_id = p.id::text and x.resuelto_en is null), '{}'))
             order by p.creado_en)
        from presupuestos p join categorias c on c.id = p.categoria_id
       where p.revisar
          or exists (select 1 from reportes x where x.objetivo::text = 'presupuesto' and x.objetivo_id = p.id::text and x.resuelto_en is null)), '[]'::jsonb),
    'respuestas', coalesce((
      select jsonb_agg(jsonb_build_object(
               'presupuesto_id', r.presupuesto_id, 'vendedor_id', r.vendedor_id, 'vendedor', v.nombre, 'slug', v.slug,
               'precio', r.precio, 'desde', r.desde, 'mensaje', r.mensaje, 'pedido', left(p.descripcion, 140),
               'motivo', x.motivo, 'detalle', x.detalle)
             order by x.creado_en)
        from reportes x
        join presupuesto_respuestas r on x.objetivo_id = r.presupuesto_id::text || ':' || r.vendedor_id::text
        join vendedores v on v.id = r.vendedor_id
        join presupuestos p on p.id = r.presupuesto_id
       where x.objetivo::text = 'respuesta' and x.resuelto_en is null), '[]'::jsonb));
end $$;
grant execute on function cola_presupuestos() to authenticated;

-- p_accion: 'aprobar' (sale o vuelve a salir) u 'ocultar'. Al aprobar uno frenado,
-- devuelve a quién avisar (no se les avisó al crearlo).
create or replace function moderar_presupuesto(p_id uuid, p_accion text, p_nota text default null)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare p presupuestos; ids uuid[];
begin
  perform exigir_admin();
  select * into p from presupuestos where id = p_id;
  if p.id is null then raise exception 'Ese pedido no existe'; end if;
  if p_accion = 'aprobar' then
    update presupuestos set oculto = false, revisar = false where id = p_id;
  elsif p_accion = 'ocultar' then
    update presupuestos set oculto = true, revisar = false where id = p_id;
  else raise exception 'Acción no válida';
  end if;
  update reportes set resuelto_en = now() where objetivo::text = 'presupuesto' and objetivo_id = p_id::text and resuelto_en is null;
  insert into moderacion_log (admin_id, accion, objetivo, objetivo_id, nota)
  values (auth.uid(), p_accion, 'presupuesto', p_id::text, nullif(trim(p_nota), ''));
  if p_accion = 'aprobar' and p.revisar and presupuesto_estado(p) = 'abierto' then
    select array_agg(vendedor_id) into ids from presupuesto_respuestas where presupuesto_id = p_id and estado = 'enviado';
    return jsonb_build_object('avisos', push_de_vendedores(coalesce(ids, '{}')));
  end if;
  return jsonb_build_object('avisos', '[]'::jsonb);
end $$;
grant execute on function moderar_presupuesto(uuid, text, text) to authenticated;

-- p_accion: 'aprobar' (el cliente la vuelve a ver) u 'ocultar' (queda oculta).
create or replace function moderar_respuesta(p_id uuid, p_vendedor uuid, p_accion text, p_nota text default null)
returns void language plpgsql volatile security definer set search_path = public as $$
begin
  perform exigir_admin();
  if p_accion not in ('aprobar', 'ocultar') then raise exception 'Acción no válida'; end if;
  update presupuesto_respuestas set oculta = (p_accion = 'ocultar') where presupuesto_id = p_id and vendedor_id = p_vendedor;
  if not found then raise exception 'Esa respuesta no existe'; end if;
  update reportes set resuelto_en = now()
   where objetivo::text = 'respuesta' and objetivo_id = p_id::text || ':' || p_vendedor::text and resuelto_en is null;
  insert into moderacion_log (admin_id, accion, objetivo, objetivo_id, nota)
  values (auth.uid(), p_accion, 'respuesta', p_id::text || ':' || p_vendedor::text, nullif(trim(p_nota), ''));
end $$;
grant execute on function moderar_respuesta(uuid, uuid, text, text) to authenticated;

-- Lo que la gente pide (decisión 73): por categoría, cuántos no tuvieron a quién llegar
-- y cuántos se quedaron sin respuesta. Sin nombres ni números de los clientes.
create or replace function resumen_presupuestos(p_dias integer default 30) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform exigir_admin();
  return (
    with base as (
      select p.*, c.nombre as categoria, c.seccion,
             (select count(*) from presupuesto_respuestas r where r.presupuesto_id = p.id) as enviados,
             (select count(*) from presupuesto_respuestas r where r.presupuesto_id = p.id and r.estado = 'respondido') as respuestas
        from presupuestos p join categorias c on c.id = p.categoria_id
       where p.creado_en > now() - make_interval(days => greatest(p_dias, 1)))
    select jsonb_build_object(
      'pedidos', (select count(*) from base),
      'con_respuesta', (select count(*) from base where respuestas > 0),
      'sin_vendedores', (select count(*) from base where enviados = 0),
      'por_categoria', coalesce((
        select jsonb_agg(jsonb_build_object('categoria', categoria, 'seccion', seccion, 'pedidos', n,
                                            'sin_vendedores', sv, 'sin_respuesta', sr)
                         order by sv desc, sr desc, n desc)
          from (select categoria, seccion, count(*) n,
                       count(*) filter (where enviados = 0) sv,
                       count(*) filter (where enviados > 0 and respuestas = 0) sr
                  from base group by categoria, seccion) g), '[]'::jsonb),
      'recientes', coalesce((
        select jsonb_agg(jsonb_build_object('id', id, 'descripcion', left(descripcion, 140), 'categoria', categoria,
                                            'zona', (select nombre from zonas where id = base.zona_id),
                                            'estado', case when estado = 'abierto' and vence_en <= now() then 'vencido' else estado::text end,
                                            'oculto', oculto, 'revisar', revisar, 'vence_en', vence_en,
                                            'enviados', enviados, 'respuestas', respuestas, 'creado_en', creado_en)
                         order by creado_en desc)
          from (select * from base order by creado_en desc limit 40) base), '[]'::jsonb)));
end $$;
grant execute on function resumen_presupuestos(integer) to authenticated;
