-- =====================================================================
-- Módulo 10B · Lokl Súper: carrito y pedidos (decisiones 54 a 63)
--   1. Configuración pública: WhatsApp del Súper, horario (todos los días 7:30 a 20:00)
--      y formas de pago (solo digitales: pago móvil, transferencia, Zelle, Binance).
--   2. El pedido se arma en la base: precios, envío y total salen de aquí (nunca del teléfono).
--      Fuera de horario se recibe igual y se atiende al día siguiente.
--   3. "Mis pedidos" y "Repetir pedido" con el código anónimo del teléfono.
--   4. Tablero del admin: estados, resumen de ventas y de qué sectores piden.
-- =====================================================================

-- 1. Configuración -------------------------------------------------------
insert into configuracion (clave, valor) values
  ('super_whatsapp', '"584243232671"'),
  ('super_horario',  '{"abre": "07:30", "cierra": "20:00"}'),
  ('super_pagos',    '["pago_movil", "transferencia", "zelle", "binance"]')
on conflict (clave) do nothing;

drop policy if exists lectura_publica on configuracion;
create policy lectura_publica on configuracion for select
  using (clave in ('super_abierto', 'super_tasa', 'super_envio', 'super_whatsapp', 'super_horario', 'super_pagos') or es_admin());

-- ¿El Súper está atendiendo ahora? (hora de Venezuela)
create or replace function super_atendiendo(p_cuando timestamptz default now()) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((valor->>'abre')::time <= (p_cuando at time zone 'America/Caracas')::time
              and (p_cuando at time zone 'America/Caracas')::time < (valor->>'cierra')::time, true)
    from configuracion where clave = 'super_horario';
$$;
grant execute on function super_atendiendo(timestamptz) to anon, authenticated;

-- 2. Pedidos -------------------------------------------------------------
alter table super_pedidos alter column zona_id drop not null;
alter table super_pedidos alter column envio drop not null;
alter table super_pedidos alter column total drop not null;
alter table super_pedidos add column if not exists en_casco boolean not null default true;
alter table super_pedidos add column if not exists sector text;
alter table super_pedidos add column if not exists forma_pago text;
alter table super_pedidos add column if not exists si_falta text;
alter table super_pedidos add column if not exists nota text;
alter table super_pedidos add column if not exists tasa_bs numeric(14,2);
alter table super_pedidos add column if not exists fuera_de_horario boolean not null default false;
alter table super_pedidos add column if not exists actualizado_en timestamptz not null default now();

alter table super_pedidos drop constraint if exists super_pedidos_forma_pago_check;
alter table super_pedidos add constraint super_pedidos_forma_pago_check
  check (forma_pago is null or forma_pago in ('pago_movil', 'transferencia', 'zelle', 'binance'));
alter table super_pedidos drop constraint if exists super_pedidos_si_falta_check;
alter table super_pedidos add constraint super_pedidos_si_falta_check
  check (si_falta is null or si_falta in ('parecido', 'quitar', 'escribeme'));
create index if not exists super_pedidos_whatsapp_idx on super_pedidos (whatsapp, creado_en desc);

drop policy if exists solo_admin on super_pedidos;
create policy solo_admin on super_pedidos for select using (es_admin());

-- Crear el pedido. p_items: [{"id": 12, "cantidad": 2}, ...]
-- Devuelve el pedido armado (con precios de HOY) para mandarlo por WhatsApp.
create or replace function super_crear_pedido(
  p_cliente uuid, p_items jsonb, p_nombre text, p_whatsapp text, p_en_casco boolean,
  p_sector text, p_direccion text, p_pago text, p_si_falta text, p_nota text
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  env jsonb := (select valor from configuracion where clave = 'super_envio');
  tasa numeric := nullif((select valor->>'bs' from configuracion where clave = 'super_tasa'), '')::numeric;
  muni integer := (select id from municipios where slug = 'san-fernando');
  lineas jsonb;
  sub numeric;
  envio numeric;
  nuevo_id bigint;
  fuera boolean := not super_atendiendo(now());
begin
  if p_cliente is null then raise exception 'Falta el código del teléfono'; end if;
  if length(trim(coalesce(p_nombre, ''))) < 2 then raise exception 'Escribe tu nombre'; end if;
  if coalesce(p_whatsapp, '') !~ '^584(12|14|16|22|24|26)[0-9]{7}$' then raise exception 'Escribe un WhatsApp válido'; end if;
  if length(trim(coalesce(p_sector, ''))) < 2 then raise exception 'Escribe tu sector'; end if;
  if length(trim(coalesce(p_direccion, ''))) < 5 then raise exception 'Escribe tu dirección con un punto de referencia'; end if;
  if p_pago not in ('pago_movil', 'transferencia', 'zelle', 'binance') then raise exception 'Elige cómo vas a pagar'; end if;
  if coalesce(p_si_falta, 'escribeme') not in ('parecido', 'quitar', 'escribeme') then raise exception 'Opción inválida'; end if;

  -- Límites para que nadie llene el tablero de pedidos falsos.
  if (select count(*) from super_pedidos where cliente_id = p_cliente and creado_en > now() - interval '1 hour') >= 5
     or (select count(*) from super_pedidos where whatsapp = p_whatsapp and creado_en > now() - interval '1 day') >= 10 then
    raise exception 'Hiciste muchos pedidos seguidos. Escríbenos por WhatsApp.';
  end if;

  -- Los productos y precios salen de la base: solo lo que está a la venta ahora.
  with pedidos as (
    select (e->>'id')::bigint as id, sum(least(greatest((e->>'cantidad')::int, 0), 50)) as cantidad
      from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) e
     group by 1
  )
  select jsonb_agg(jsonb_build_object(
           'id', p.id, 'nombre', p.nombre, 'marca', p.marca, 'presentacion', p.presentacion,
           'precio', p.precio, 'cantidad', x.cantidad, 'total', round(p.precio * x.cantidad, 2))
           order by s.orden, p.nombre),
         sum(round(p.precio * x.cantidad, 2))
    into lineas, sub
    from pedidos x
    join super_productos p on p.id = x.id
    left join super_pasillos s on s.id = p.pasillo_id
   where x.cantidad > 0 and p.municipio_id = muni
     and p.en_catalogo and p.disponible and p.precio is not null;

  if lineas is null then raise exception 'Tu carrito está vacío o esos productos ya no están disponibles'; end if;
  if jsonb_array_length(lineas) > 80 then raise exception 'El pedido es muy grande: escríbenos por WhatsApp'; end if;
  if sub < coalesce((env->>'minimo')::numeric, 0) then
    raise exception 'El pedido mínimo es de $%', replace(replace(to_char(coalesce((env->>'minimo')::numeric, 0), 'FM999990.00'), '.00', ''), '.', ',');
  end if;

  envio := case when not p_en_casco then null
                when sub >= coalesce((env->>'gratis_desde')::numeric, 20) then 0
                else coalesce((env->>'tarifa')::numeric, 1) end;

  insert into super_pedidos (cliente_id, nombre, whatsapp, en_casco, sector, direccion, items, subtotal, envio, total,
                             forma_pago, si_falta, nota, tasa_bs, fuera_de_horario)
  values (p_cliente, left(trim(p_nombre), 60), p_whatsapp, p_en_casco, left(trim(p_sector), 60), left(trim(p_direccion), 200),
          lineas, sub, envio, case when envio is null then null else sub + envio end,
          p_pago, coalesce(p_si_falta, 'escribeme'), nullif(left(trim(coalesce(p_nota, '')), 300), ''), tasa, fuera)
  returning id into nuevo_id;

  return jsonb_build_object('id', nuevo_id, 'items', lineas, 'subtotal', sub, 'envio', envio,
                            'total', case when envio is null then null else sub + envio end,
                            'tasa_bs', tasa, 'fuera_de_horario', fuera);
end $$;
grant execute on function super_crear_pedido(uuid, jsonb, text, text, boolean, text, text, text, text, text) to anon, authenticated;

-- 3. Mis pedidos (para "Repetir pedido") ---------------------------------
create or replace function super_mis_pedidos(p_cliente uuid)
returns table (id bigint, creado_en timestamptz, items jsonb, subtotal numeric, envio numeric, total numeric, estado estado_pedido)
language sql stable security definer set search_path = public as $$
  select id, creado_en, items, subtotal, envio, total, estado
    from super_pedidos where cliente_id = p_cliente
   order by creado_en desc limit 10;
$$;
grant execute on function super_mis_pedidos(uuid) to anon, authenticated;

-- Un pedido de este teléfono, completo (para la página "Pedido listo" y su mensaje de WhatsApp).
create or replace function super_mi_pedido(p_cliente uuid, p_id bigint) returns jsonb
language sql stable security definer set search_path = public as $$
  select to_jsonb(p) - 'cliente_id' from super_pedidos p where p.id = p_id and p.cliente_id = p_cliente;
$$;
grant execute on function super_mi_pedido(uuid, bigint) to anon, authenticated;

-- 4. Admin ---------------------------------------------------------------
create or replace function super_cambiar_estado(p_id bigint, p_estado estado_pedido) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform exigir_admin();
  update super_pedidos set estado = p_estado, actualizado_en = now() where id = p_id;
  if not found then raise exception 'Pedido no encontrado'; end if;
end $$;

-- Ventas de los últimos p_dias (sin cancelados) y de qué sectores piden.
create or replace function super_resumen_pedidos(p_dias integer default 7) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare r jsonb;
begin
  perform exigir_admin();
  with base as (
    select * from super_pedidos
     where creado_en > now() - make_interval(days => greatest(coalesce(p_dias, 7), 1)) and estado <> 'cancelado'
  ), sectores as (
    select initcap(min(trim(sector))) as sector, bool_or(en_casco) as en_casco, count(*) as pedidos
      from base group by public.f_unaccent(lower(trim(sector)))
     order by count(*) desc limit 15
  )
  select jsonb_build_object(
    'pedidos', (select count(*) from base),
    'entregados', (select count(*) from base where estado = 'entregado'),
    'vendido', coalesce((select sum(subtotal) from base where estado = 'entregado'), 0),
    'por_sector', coalesce((select jsonb_agg(to_jsonb(s)) from sectores s), '[]'::jsonb))
  into r;
  return r;
end $$;
