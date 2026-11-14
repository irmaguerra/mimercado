-- sql/09 · Módulo 7: servicios (páginas amarillas). Pegar completo en Supabase → SQL Editor → Run.
-- Mismo contenido que supabase/migrations/20261108000700_servicios.sql

-- =====================================================================
-- Módulo 7 — Servicios / páginas amarillas (aprobado 14/11/2026, decisiones 22 a 26)
--   1. Formas de pago: solo las de la lista aprobada.
--   2. Precios de referencia: texto libre de hasta 1000 letras (el buscador ya los lee).
--   3. listar_vendedores(): filtros "A domicilio" y "24 horas"; devuelve esos datos
--      y si la tienda es un servicio (para decir "Disponible" en vez de "Abierto").
--   La galería (vendedor_fotos, hasta 6) y los sectores que cubre (vendedor_zonas)
--   ya existían con sus permisos desde el Módulo 3.
-- =====================================================================

alter table vendedores drop constraint if exists formas_pago_validas;
alter table vendedores add constraint formas_pago_validas check (
  formas_pago <@ array['pago_movil', 'efectivo_usd', 'efectivo_bs', 'transferencia',
                       'punto_venta', 'zelle', 'binance']::text[]);

alter table vendedores drop constraint if exists precios_referencia_largo;
alter table vendedores add constraint precios_referencia_largo
  check (char_length(precios_referencia) <= 1000);

drop function if exists listar_vendedores(integer, seccion, integer[], integer, integer, integer);

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
     and v.seccion_principal = p_seccion
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
            (v.verificado_en is not null) desc,
            v.creado_en desc
   limit least(greatest(p_limite, 1), 601) offset greatest(p_desde, 0)
$$;
