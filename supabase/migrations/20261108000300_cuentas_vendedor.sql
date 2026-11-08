-- Módulo 3: cuenta del vendedor y su tienda.

-- ---------------------------------------------------------------------
-- 1. Seguridad: el vendedor NO puede cambiarse a sí mismo el estado
--    (suspendido), el sello de verificado ni el dueño de la tienda.
--    (El esquema inicial lo mencionaba pero el trigger faltaba.)
-- ---------------------------------------------------------------------
create or replace function vendedores_proteger_campos() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not es_admin() then
    new.estado            := old.estado;
    new.motivo_suspension := old.motivo_suspension;
    new.verificado_en     := old.verificado_en;
    new.usuario_id        := old.usuario_id;
  end if;
  return new;
end $$;

create trigger vendedores_proteger before update on vendedores
  for each row execute function vendedores_proteger_campos();

-- ---------------------------------------------------------------------
-- 2. Sección principal: lo que el vendedor eligió en "¿Qué haces?"
--    (tiendas, comida, al_mayor, servicios, clasificados).
-- ---------------------------------------------------------------------
alter table vendedores add column seccion_principal seccion;

-- ---------------------------------------------------------------------
-- 3. Enlaces reservados: ninguna tienda puede llamarse como una página
--    de Lokl ni como un estado (usalokl.com/apure es la página de Apure).
-- ---------------------------------------------------------------------
create or replace function slug_reservado(s text) returns boolean
language sql stable as $$
  select s = any (array[
      'super','panel','admin','buscar','entrar','salir','auth','ubicacion','precios',
      'presupuesto','presupuestos','favoritos','mis-pedidos','conoce','vende','verificado',
      'p','c','api','contacto','sin-conexion','iconos','lokl','usalokl','ayuda','soporte',
      'terminos','privacidad','404','favicon','robots','sitemap','manifest','sw','www'])
      or exists (select 1 from estados where slug = s)
$$;

create or replace function vendedores_slug_libre() returns trigger
language plpgsql as $$
begin
  if slug_reservado(new.slug) then
    raise exception 'El enlace "%" está reservado. Elige otro.', new.slug;
  end if;
  return new;
end $$;

create trigger vendedores_slug before insert or update of slug on vendedores
  for each row execute function vendedores_slug_libre();

-- ¿Está libre este enlace? (para sugerir uno al registrarse, sin exponer datos)
create or replace function slug_disponible(s text) returns boolean
language sql stable security definer set search_path = public as $$
  select not slug_reservado(s) and not exists (select 1 from vendedores where slug = s)
$$;

-- ---------------------------------------------------------------------
-- 4. Zonas propuestas por vendedores ("No está mi zona").
--    Quedan inactivas hasta que el admin las apruebe; quien la propuso sí la ve.
-- ---------------------------------------------------------------------
drop policy lectura_publica on zonas;
create policy lectura_publica on zonas for select
  using (activa or es_admin() or propuesta_por = auth.uid());
create policy proponer_zona on zonas for insert to authenticated
  with check (activa = false and propuesta_por = auth.uid());
create policy admin_zonas on zonas for update using (es_admin()) with check (es_admin());

-- ---------------------------------------------------------------------
-- 5. Lo que es del vendedor: dueño o admin editan; todos pueden ver.
-- ---------------------------------------------------------------------
create policy ver on vendedor_zonas      for select using (true);
create policy duenio on vendedor_zonas   for all using (vendedor_id = mi_vendedor_id() or es_admin())
  with check (vendedor_id = mi_vendedor_id() or es_admin());

create policy ver on vendedor_categorias    for select using (true);
create policy duenio on vendedor_categorias for all using (vendedor_id = mi_vendedor_id() or es_admin())
  with check (vendedor_id = mi_vendedor_id() or es_admin());

create policy ver on vendedor_fotos      for select using (true);
create policy duenio on vendedor_fotos   for all using (vendedor_id = mi_vendedor_id() or es_admin())
  with check (vendedor_id = mi_vendedor_id() or es_admin());

create policy ver on vendedor_delivery    for select using (true);
create policy duenio on vendedor_delivery for all using (vendedor_id = mi_vendedor_id() or es_admin())
  with check (vendedor_id = mi_vendedor_id() or es_admin());

create policy sugerir on categorias_sugeridas for insert with check (vendedor_id = mi_vendedor_id());
create policy ver_mias on categorias_sugeridas for select using (vendedor_id = mi_vendedor_id() or es_admin());
create policy admin on categorias_sugeridas for update using (es_admin()) with check (es_admin());

-- El vendedor ve SUS contactos (para el contador "34 personas te contactaron esta semana")
create policy ver_mios on contactos for select using (vendedor_id = mi_vendedor_id() or es_admin());

-- ---------------------------------------------------------------------
-- 6. Fotos: carpeta pública "vendedores" en Supabase Storage.
--    Cada vendedor solo puede subir o borrar dentro de su carpeta (su id).
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vendedores', 'vendedores', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "vendedor sube a su carpeta" on storage.objects for insert to authenticated
  with check (bucket_id = 'vendedores' and (storage.foldername(name))[1] = mi_vendedor_id()::text);
create policy "vendedor cambia su carpeta" on storage.objects for update to authenticated
  using (bucket_id = 'vendedores' and (storage.foldername(name))[1] = mi_vendedor_id()::text);
create policy "vendedor borra de su carpeta" on storage.objects for delete to authenticated
  using (bucket_id = 'vendedores' and ((storage.foldername(name))[1] = mi_vendedor_id()::text or es_admin()));
