-- sql/08 · Módulo 6: moderación. Pegar completo en Supabase → SQL Editor → Run.
-- Mismo contenido que supabase/migrations/20261108000600_moderacion.sql

-- =====================================================================
-- Módulo 6 — Moderación (aprobado 14/11/2026, decisiones 16 a 21)
--   1. Palabras: "bloquear" no deja publicar; "revisar" guarda pero espera al admin.
--   2. Reportes: solo por reportar() (valida motivo y que exista lo reportado).
--      Con 3 reportes una publicación se oculta sola; una tienda nunca.
--   3. Acciones del admin con bitácora: aprobar, ocultar, suspender, reactivar,
--      verificar y quitar el sello. Todo pasa por funciones que exigen ser admin.
--   4. Colas para el admin: por revisar, tiendas reportadas, búsquedas sin resultado.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Enlace reservado para la página de reportes
-- ---------------------------------------------------------------------
create or replace function slug_reservado(s text) returns boolean
language sql stable as $$
  select s = any (array[
      'super','panel','admin','buscar','entrar','salir','auth','ubicacion','precios',
      'presupuesto','presupuestos','favoritos','mis-pedidos','conoce','vende','verificado',
      'p','c','api','contacto','sin-conexion','iconos','lokl','usalokl','ayuda','soporte',
      'terminos','privacidad','404','favicon','robots','sitemap','manifest','sw','www',
      'reportar'])
      or exists (select 1 from estados where slug = s)
$$;

-- ---------------------------------------------------------------------
-- 1. Filtro de palabras: bloquear o revisar
-- ---------------------------------------------------------------------
create or replace function publicaciones_antes_guardar() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v vendedores;
  accion accion_palabra;
  hoy integer;
  texto_nuevo boolean := tg_op = 'INSERT' or new.titulo is distinct from old.titulo
                         or new.descripcion is distinct from old.descripcion;
begin
  select * into v from vendedores where id = new.vendedor_id;
  if v.estado <> 'activo' then raise exception 'Cuenta suspendida'; end if;
  new.zona_id := v.zona_id;

  if tg_op = 'INSERT' then
    select count(*) into hoy from publicaciones
     where vendedor_id = new.vendedor_id and creado_en > now() - interval '1 day';
    if hoy >= (select (valor)::int from configuracion where clave = 'max_publicaciones_dia') then
      raise exception 'Llegaste al límite de publicaciones de hoy';
    end if;
  end if;

  -- Solo se modera texto nuevo o editado (si el admin la aprueba, no se vuelve a frenar)
  if texto_nuevo and not es_admin() then
    accion := moderar_texto(new.titulo || ' ' || coalesce(new.descripcion, ''));
    if accion = 'bloquear' then
      raise exception 'Palabra no permitida en Lokl';
    elsif accion = 'revisar' and new.estado = 'publicada' then
      new.estado := 'en_revision';
      new.motivo_estado := 'Filtro de palabras';
    end if;
  end if;

  new.busqueda :=
      setweight(to_tsvector('es_lokl', coalesce(new.titulo, '')), 'A')
   || setweight(to_tsvector('es_lokl', coalesce(v.nombre, '')), 'B')
   || setweight(to_tsvector('es_lokl', coalesce(
        (select c.nombre || ' ' || array_to_string(c.palabras_clave, ' ')
           from categorias c where c.id = new.categoria_id), '')), 'B')
   || setweight(to_tsvector('es_lokl', coalesce(new.descripcion, '')), 'C');
  return new;
end $$;

-- Al crear, nace "publicada"; el filtro puede pasarla a "en revisión" antes de guardar.
-- (Antes la regla solo aceptaba "publicada" y rechazaba lo que el filtro mandaba a revisión.)
alter policy crear_publicacion on publicaciones
  with check (vendedor_id = mi_vendedor_id() and estado in ('publicada', 'en_revision'));

-- Las palabras se usan dentro de una búsqueda por patrón: sin símbolos especiales.
alter table palabras_prohibidas drop constraint if exists palabra_simple;
alter table palabras_prohibidas add constraint palabra_simple
  check (char_length(trim(palabra)) between 2 and 40 and palabra !~ '[\^$.|?*+()\[\]{}]');

-- El nombre y la descripción de la tienda tampoco pueden llevar palabras bloqueadas
create or replace function vendedores_filtro_palabras() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not es_admin()
     and moderar_texto(new.nombre || ' ' || coalesce(new.descripcion, '')) = 'bloquear' then
    raise exception 'Palabra no permitida en Lokl';
  end if;
  return new;
end $$;
drop trigger if exists vendedores_palabras on vendedores;
create trigger vendedores_palabras before insert or update of nombre, descripcion on vendedores
  for each row execute function vendedores_filtro_palabras();

-- ---------------------------------------------------------------------
-- 2. Reportes de la gente (sin cuenta: un id guardado en su teléfono)
-- ---------------------------------------------------------------------
drop policy if exists anon_crear on reportes;
drop policy if exists solo_admin on reportes;
create policy solo_admin on reportes for select using (es_admin());

-- Devuelve 'ok', 'repetido' (ya lo había reportado) o 'no_existe'.
create or replace function reportar(
  p_objetivo objetivo_reporte, p_objetivo_id text, p_cliente_id uuid, p_motivo text, p_detalle text default null
) returns text language plpgsql volatile security definer set search_path = public as $$
begin
  if p_motivo not in ('estafa', 'prohibido', 'ofensivo', 'no_existe', 'otro') or p_cliente_id is null then
    raise exception 'Reporte no válido';
  end if;
  if p_objetivo = 'publicacion' then
    if not exists (select 1 from publicaciones where id::text = p_objetivo_id and estado = 'publicada') then
      return 'no_existe';
    end if;
  elsif p_objetivo = 'vendedor' then
    if not exists (select 1 from vendedores where id::text = p_objetivo_id and estado = 'activo') then
      return 'no_existe';
    end if;
  else
    raise exception 'Reporte no válido';
  end if;

  insert into reportes (objetivo, objetivo_id, cliente_id, motivo, detalle)
  values (p_objetivo, p_objetivo_id, p_cliente_id, p_motivo, left(nullif(trim(p_detalle), ''), 500))
  on conflict (objetivo, objetivo_id, cliente_id) do nothing;
  return case when found then 'ok' else 'repetido' end;
end $$;

-- Con N reportes distintos sin resolver, la publicación se oculta sola hasta que el admin revise.
-- Las tiendas reportadas NO se suspenden solas: decide el admin.
create or replace function reportes_auto_ocultar() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int; limite int := (select (valor)::int from configuracion where clave = 'reportes_para_ocultar');
begin
  if new.objetivo <> 'publicacion' then return new; end if;
  select count(*) into n from reportes
   where objetivo = new.objetivo and objetivo_id = new.objetivo_id and resuelto_en is null;
  if n >= limite then
    update publicaciones set estado = 'oculta_reportes',
           motivo_estado = 'Varias personas lo reportaron. Lo estamos revisando.'
     where id = new.objetivo_id::bigint and estado = 'publicada';
  end if;
  return new;
end $$;

-- ---------------------------------------------------------------------
-- 3. Acciones del admin (cada una queda en la bitácora)
-- ---------------------------------------------------------------------
create or replace function exigir_admin() returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if not es_admin() then raise exception 'Solo la administración de Lokl puede hacer esto'; end if;
end $$;

create or replace function anotar(p_accion text, p_objetivo objetivo_reporte, p_id text, p_nota text)
returns void language sql security definer set search_path = public as $$
  insert into moderacion_log (admin_id, accion, objetivo, objetivo_id, nota)
  values (auth.uid(), p_accion, p_objetivo, p_id, nullif(trim(p_nota), ''))
$$;
revoke execute on function anotar(text, objetivo_reporte, text, text) from public, anon, authenticated;

-- p_accion: 'aprobar' (vuelve a salir y se descartan sus reportes) u 'ocultar' (con motivo)
create or replace function moderar_publicacion(p_id bigint, p_accion text, p_nota text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform exigir_admin();
  if not exists (select 1 from publicaciones where id = p_id) then raise exception 'Esa publicación no existe'; end if;
  if p_accion = 'aprobar' then
    update publicaciones set estado = 'publicada', motivo_estado = null
     where id = p_id and estado in ('publicada', 'en_revision', 'oculta_reportes', 'oculta_admin');
  elsif p_accion = 'ocultar' then
    if coalesce(trim(p_nota), '') = '' then raise exception 'Escribe el motivo'; end if;
    update publicaciones set estado = 'oculta_admin', motivo_estado = trim(p_nota) where id = p_id;
  else
    raise exception 'Acción no válida';
  end if;
  update reportes set resuelto_en = now()
   where objetivo = 'publicacion' and objetivo_id = p_id::text and resuelto_en is null;
  perform anotar(p_accion, 'publicacion', p_id::text, p_nota);
end $$;

-- p_accion: 'descartar' (los reportes no proceden), 'suspender' (con motivo) o 'reactivar'
create or replace function moderar_vendedor(p_id uuid, p_accion text, p_nota text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform exigir_admin();
  if not exists (select 1 from vendedores where id = p_id) then raise exception 'Esa tienda no existe'; end if;
  if p_accion = 'suspender' then
    if coalesce(trim(p_nota), '') = '' then raise exception 'Escribe el motivo'; end if;
    update vendedores set estado = 'suspendido', motivo_suspension = trim(p_nota) where id = p_id;
  elsif p_accion = 'reactivar' then
    update vendedores set estado = 'activo', motivo_suspension = null where id = p_id;
  elsif p_accion <> 'descartar' then
    raise exception 'Acción no válida';
  end if;
  update reportes set resuelto_en = now()
   where objetivo = 'vendedor' and objetivo_id = p_id::text and resuelto_en is null;
  perform anotar(p_accion, 'vendedor', p_id::text, p_nota);
end $$;

drop policy if exists solo_admin on verificaciones;
create policy solo_admin on verificaciones for select using (es_admin());

create or replace function verificar_vendedor(p_id uuid, p_metodo metodo_verificacion, p_nota text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform exigir_admin();
  if not exists (select 1 from vendedores where id = p_id) then raise exception 'Esa tienda no existe'; end if;
  update verificaciones set revocado_en = now() where vendedor_id = p_id and revocado_en is null;
  insert into verificaciones (vendedor_id, metodo, nota, verificado_por)
  values (p_id, p_metodo, nullif(trim(p_nota), ''), auth.uid());
  update vendedores set verificado_en = now() where id = p_id;
  perform anotar('verificar', 'vendedor', p_id::text, p_metodo::text || coalesce(': ' || nullif(trim(p_nota), ''), ''));
end $$;

create or replace function quitar_verificacion(p_id uuid, p_nota text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform exigir_admin();
  update verificaciones set revocado_en = now() where vendedor_id = p_id and revocado_en is null;
  update vendedores set verificado_en = null where id = p_id;
  perform anotar('quitar_verificacion', 'vendedor', p_id::text, p_nota);
end $$;

-- ---------------------------------------------------------------------
-- 4. Lo que ve el admin
-- ---------------------------------------------------------------------

-- Publicaciones frenadas por el filtro, ocultas por reportes, o con reportes sin resolver
create or replace function cola_publicaciones()
returns table (
  id bigint, titulo text, descripcion text, estado estado_publicacion, motivo_estado text, foto_mini text,
  vendedor_nombre text, vendedor_slug text, reportes bigint, motivos text[], detalles text[], creado_en timestamptz
) language plpgsql stable security definer set search_path = public as $$
begin
  perform exigir_admin();
  return query
  select p.id, p.titulo, left(p.descripcion, 300), p.estado, p.motivo_estado,
         (select f.url_mini from publicacion_fotos f where f.publicacion_id = p.id order by f.orden limit 1),
         v.nombre, v.slug,
         count(r.id), coalesce(array_agg(r.motivo) filter (where r.id is not null), '{}'),
         coalesce(array_agg(r.detalle) filter (where r.detalle is not null), '{}'),
         p.creado_en
    from publicaciones p
    join vendedores v on v.id = p.vendedor_id
    left join reportes r on r.objetivo = 'publicacion' and r.objetivo_id = p.id::text and r.resuelto_en is null
   where p.estado in ('en_revision', 'oculta_reportes')
      or exists (select 1 from reportes x where x.objetivo = 'publicacion'
                  and x.objetivo_id = p.id::text and x.resuelto_en is null)
   group by p.id, v.id
   order by (p.estado = 'oculta_reportes') desc, count(r.id) desc, p.creado_en;
end $$;

-- Tiendas con reportes sin resolver
create or replace function cola_vendedores()
returns table (
  id uuid, nombre text, slug text, estado estado_vendedor, verificado boolean,
  reportes bigint, motivos text[], detalles text[]
) language plpgsql stable security definer set search_path = public as $$
begin
  perform exigir_admin();
  return query
  select v.id, v.nombre, v.slug, v.estado, v.verificado_en is not null,
         count(r.id), array_agg(r.motivo),
         coalesce(array_agg(r.detalle) filter (where r.detalle is not null), '{}')
    from vendedores v
    join reportes r on r.objetivo = 'vendedor' and r.objetivo_id = v.id::text and r.resuelto_en is null
   group by v.id
   order by count(r.id) desc;
end $$;

-- Lo que la gente busca y no encuentra (últimos N días)
create or replace function busquedas_sin_resultado(p_dias integer default 7)
returns table (texto text, veces bigint, municipio text, ultima timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  perform exigir_admin();
  return query
  select b.texto, count(*), m.nombre, max(b.creado_en)
    from busquedas b left join municipios m on m.id = b.municipio_id
   where b.resultados = 0 and b.creado_en > now() - make_interval(days => greatest(p_dias, 1))
   group by b.texto, m.nombre
   order by count(*) desc, max(b.creado_en) desc
   limit 100;
end $$;

-- Bitácora con el nombre de lo moderado y el correo de quien lo hizo
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
         end,
         l.nota, (select u.email::text from auth.users u where u.id = l.admin_id), l.creado_en
    from moderacion_log l
   order by l.creado_en desc
   limit least(greatest(p_limite, 1), 500);
end $$;
