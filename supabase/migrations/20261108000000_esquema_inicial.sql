-- =====================================================================
-- LOKL — Esquema inicial (BORRADOR para revisión, NO aplicado todavía)
-- Rama: rediseno-modular · Ver docs/propuesta-arquitectura.md
-- Motor: Supabase (PostgreSQL 15+)
-- Convenciones: snake_case, singular en columnas, plural en tablas,
--   PK "id", FKs "<tabla_singular>_id", fechas "*_en" (timestamptz).
-- =====================================================================

create extension if not exists unaccent;
create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------
-- 0. Utilidades
-- ---------------------------------------------------------------------

-- unaccent no es IMMUTABLE; este envoltorio permite usarlo en índices y columnas generadas.
create or replace function f_unaccent(t text) returns text
language sql immutable parallel safe strict
as $$ select public.unaccent('public.unaccent'::regdictionary, t) $$;

-- Configuración de búsqueda en español que ignora acentos
create text search configuration es_lokl (copy = spanish);
alter text search configuration es_lokl
  alter mapping for hword, hword_part, word with unaccent, spanish_stem;

create or replace function set_actualizado_en() returns trigger
language plpgsql as $$ begin new.actualizado_en := now(); return new; end $$;

-- ---------------------------------------------------------------------
-- 1. Ubicación: estado → municipio → zona
-- ---------------------------------------------------------------------

create table estados (
  id          smallint generated always as identity primary key,
  nombre      text not null unique,
  slug        text not null unique
);

create table municipios (
  id          integer generated always as identity primary key,
  estado_id   smallint not null references estados(id),
  nombre      text not null,
  slug        text not null,
  activo      boolean not null default false,   -- Lokl "abierto" en este municipio
  unique (estado_id, slug)
);

create type tipo_zona as enum ('sector', 'urbanizacion', 'barrio', 'pueblo', 'caserio', 'otro');

create table zonas (
  id            integer generated always as identity primary key,
  municipio_id  integer not null references municipios(id),
  nombre        text not null,
  slug          text not null,
  tipo          tipo_zona not null default 'sector',
  activa        boolean not null default true,    -- false = propuesta pendiente de revisión
  propuesta_por uuid,                             -- vendedor que la sugirió (null = creada por admin)
  creado_en     timestamptz not null default now(),
  unique (municipio_id, slug)
);
create index zonas_municipio_idx on zonas (municipio_id) where activa;

-- ---------------------------------------------------------------------
-- 2. Categorías (sección fija → categoría → subcategoría)
-- ---------------------------------------------------------------------

create type seccion as enum ('tiendas', 'comida', 'al_mayor', 'servicios', 'clasificados', 'super');

create table categorias (
  id              integer generated always as identity primary key,
  seccion         seccion not null,
  padre_id        integer references categorias(id),   -- null = categoría; con valor = subcategoría
  nombre          text not null,
  slug            text not null,
  icono           text,                                -- nombre del SVG en /iconos (identidad Lokl)
  palabras_clave  text[] not null default '{}',        -- alimentan el buscador ("moto", "mototaxi")
  orden           smallint not null default 0,
  activa          boolean not null default true,
  unique (seccion, padre_id, slug)
);
create index categorias_padre_idx on categorias (padre_id);

-- Sinónimos editables por el admin: "queso duro" = "queso llanero"
create table sinonimos (
  id          integer generated always as identity primary key,
  termino     text not null,
  equivalente text not null,
  unique (termino, equivalente)
);

-- ---------------------------------------------------------------------
-- 3. Vendedores (tienda virtual / ficha de servicio / productor)
-- ---------------------------------------------------------------------

create type tipo_vendedor as enum ('negocio', 'servicio', 'productor', 'persona');
-- Feria de comida: cómo cocina el vendedor. 'desde_casa' y 'cocina_oculta' nunca muestran dirección.
create type modalidad_cocina as enum ('restaurante', 'puesto', 'desde_casa', 'cocina_oculta');
create type estado_vendedor as enum ('activo', 'suspendido');

create table vendedores (
  id               uuid primary key default gen_random_uuid(),
  usuario_id       uuid not null unique references auth.users(id) on delete cascade,
  slug             text not null unique,              -- usalokl.com/<slug>
  nombre           text not null,
  tipo             tipo_vendedor not null default 'negocio',
  descripcion      text,
  logo_url         text,
  portada_url      text,
  whatsapp         text not null,                     -- formato internacional 58XXXXXXXXXX
  telefono         text,
  zona_id          integer not null references zonas(id),
  direccion        text,
  maps_url         text,
  -- Horario y lógica abierto/cerrado (se conserva la lógica actual)
  hora_desde       time,
  hora_hasta       time,
  forzar_abierto   boolean,                           -- true / false / null = seguir horario
  en_pausa         boolean not null default false,
  estado           estado_vendedor not null default 'activo',   -- suspensión por admin
  motivo_suspension text,
  -- Servicios / páginas amarillas
  a_domicilio      boolean not null default false,
  atiende_24h      boolean not null default false,
  disponible_ahora boolean,                           -- botón rápido del servicio
  formas_pago      text[] not null default '{}',      -- pago_movil, efectivo_usd, efectivo_bs, zelle, binance
  precios_referencia text,
  -- Feria de comida
  modalidad_cocina modalidad_cocina,
  pedido_anticipado_horas smallint,                  -- postres/tortas por encargo: "pide con 24 h"
  -- Verificación (ver tabla verificaciones)
  verificado_en    timestamptz,
  -- Búsqueda
  busqueda         tsvector,
  creado_en        timestamptz not null default now(),
  actualizado_en   timestamptz not null default now(),
  constraint slug_formato check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
create index vendedores_zona_idx on vendedores (zona_id) where estado = 'activo';
create index vendedores_busqueda_idx on vendedores using gin (busqueda);
create index vendedores_nombre_trgm_idx on vendedores using gin (f_unaccent(lower(nombre)) gin_trgm_ops);
create trigger vendedores_actualizado before update on vendedores
  for each row execute function set_actualizado_en();

-- Zonas adicionales que cubre (moto taxi, médico a domicilio, etc.)
create table vendedor_zonas (
  vendedor_id uuid not null references vendedores(id) on delete cascade,
  zona_id     integer not null references zonas(id),
  primary key (vendedor_id, zona_id)
);

-- Hasta 3 subcategorías por vendedor (se valida con trigger)
create table vendedor_categorias (
  vendedor_id  uuid not null references vendedores(id) on delete cascade,
  categoria_id integer not null references categorias(id),
  primary key (vendedor_id, categoria_id)
);

-- Galería del vendedor (hasta 6 fotos)
create table vendedor_fotos (
  id          bigint generated always as identity primary key,
  vendedor_id uuid not null references vendedores(id) on delete cascade,
  url         text not null,
  url_mini    text not null,          -- miniatura ~400px para listas (ahorra datos)
  orden       smallint not null check (orden between 1 and 6),
  unique (vendedor_id, orden)
);

-- Zonas de delivery con precio (opcional, "Más opciones")
create table vendedor_delivery (
  vendedor_id uuid not null references vendedores(id) on delete cascade,
  zona_id     integer not null references zonas(id),
  precio      numeric(10,2) not null check (precio >= 0),
  primary key (vendedor_id, zona_id)
);

-- Sugerencia de categoría nueva hecha por un vendedor
create table categorias_sugeridas (
  id          bigint generated always as identity primary key,
  vendedor_id uuid not null references vendedores(id) on delete cascade,
  seccion     seccion not null,
  texto       text not null,
  creado_en   timestamptz not null default now(),
  resuelta_en timestamptz
);

-- Historial de verificaciones ("Verificado por Lokl" = Lokl certifica que existe)
create type metodo_verificacion as enum ('visita', 'documentos', 'videollamada', 'referencia');
create table verificaciones (
  id             bigint generated always as identity primary key,
  vendedor_id    uuid not null references vendedores(id) on delete cascade,
  metodo         metodo_verificacion not null,
  nota           text,
  verificado_por uuid not null references auth.users(id),
  creado_en      timestamptz not null default now(),
  revocado_en    timestamptz
);

-- ---------------------------------------------------------------------
-- 4. Publicaciones (productos, comida, al mayor, clasificados)
-- ---------------------------------------------------------------------

create type estado_publicacion as enum
  ('publicada', 'en_revision', 'oculta_reportes', 'oculta_admin', 'vendida', 'vencida', 'borrada');
create type moneda as enum ('USD', 'VES');

create table publicaciones (
  id               bigint generated always as identity primary key,
  vendedor_id      uuid not null references vendedores(id) on delete cascade,
  seccion          seccion not null check (seccion <> 'super'),
  categoria_id     integer references categorias(id),
  zona_id          integer not null references zonas(id),   -- copiada del vendedor (búsqueda rápida)
  titulo           text not null check (char_length(titulo) between 3 and 120),
  descripcion      text check (char_length(descripcion) <= 2000),
  precio           numeric(12,2) check (precio >= 0),
  precio_anterior  numeric(12,2),                            -- oferta: muestra precio tachado
  moneda           moneda not null default 'USD',
  unidad           text,                                     -- kg, unidad, docena, bulto...
  -- Al mayor / precios de origen
  es_al_mayor      boolean not null default false,
  cantidad_minima  numeric(10,2),
  disponibilidad   text,                                     -- "diaria", "lunes y jueves"...
  codigo_ref       text,
  variantes        jsonb,                                    -- [{"nombre":"Talla","opciones":["S","M"]}]
  estado           estado_publicacion not null default 'publicada',
  motivo_estado    text,
  vence_en         timestamptz not null default now() + interval '30 days',
  renovada_en      timestamptz,
  busqueda         tsvector,
  creado_en        timestamptz not null default now(),
  actualizado_en   timestamptz not null default now()
);
-- Índice parcial: solo lo visible. Es lo que consultan el buscador y las listas.
create index publicaciones_visibles_idx on publicaciones (zona_id, seccion, creado_en desc)
  where estado = 'publicada';
create index publicaciones_vendedor_idx on publicaciones (vendedor_id, creado_en desc);
create index publicaciones_busqueda_idx on publicaciones using gin (busqueda);
create index publicaciones_titulo_trgm_idx on publicaciones using gin (f_unaccent(lower(titulo)) gin_trgm_ops);
create index publicaciones_al_mayor_idx on publicaciones (categoria_id, zona_id)
  where es_al_mayor and estado = 'publicada';
create trigger publicaciones_actualizado before update on publicaciones
  for each row execute function set_actualizado_en();

create table publicacion_fotos (
  id             bigint generated always as identity primary key,
  publicacion_id bigint not null references publicaciones(id) on delete cascade,
  url            text not null,
  url_mini       text not null,
  orden          smallint not null check (orden between 1 and 6),
  unique (publicacion_id, orden)
);

-- ---------------------------------------------------------------------
-- 5. Cliente anónimo (lokl_cliente_id en localStorage, sin Supabase Auth)
-- ---------------------------------------------------------------------

create table favoritos (
  cliente_id  uuid not null,
  vendedor_id uuid not null references vendedores(id) on delete cascade,
  creado_en   timestamptz not null default now(),
  primary key (cliente_id, vendedor_id)
);

create type estado_resena as enum ('publicada', 'oculta');
create table resenas (
  id          bigint generated always as identity primary key,
  vendedor_id uuid not null references vendedores(id) on delete cascade,
  cliente_id  uuid not null,
  nombre      text,
  estrellas   smallint not null check (estrellas between 1 and 5),
  texto       text check (char_length(texto) <= 600),
  estado      estado_resena not null default 'publicada',
  creado_en   timestamptz not null default now(),
  unique (vendedor_id, cliente_id)
);

-- ---------------------------------------------------------------------
-- 6. Moderación sin aprobación previa
-- ---------------------------------------------------------------------

create type accion_palabra as enum ('bloquear', 'revisar');
create table palabras_prohibidas (
  id      integer generated always as identity primary key,
  palabra text not null unique,       -- se compara sin acentos y en minúsculas
  accion  accion_palabra not null default 'revisar'
);

create type objetivo_reporte as enum ('publicacion', 'vendedor', 'resena');
create table reportes (
  id           bigint generated always as identity primary key,
  objetivo     objetivo_reporte not null,
  objetivo_id  text not null,
  cliente_id   uuid not null,
  motivo       text not null,          -- estafa, prohibido, ofensivo, no_existe, otro
  detalle      text,
  creado_en    timestamptz not null default now(),
  resuelto_en  timestamptz,
  unique (objetivo, objetivo_id, cliente_id)   -- un cliente reporta una sola vez
);
create index reportes_pendientes_idx on reportes (objetivo, objetivo_id) where resuelto_en is null;

-- Bitácora de acciones del admin (quién ocultó / suspendió qué y por qué)
create table moderacion_log (
  id         bigint generated always as identity primary key,
  admin_id   uuid not null references auth.users(id),
  accion     text not null,
  objetivo   objetivo_reporte not null,
  objetivo_id text not null,
  nota       text,
  creado_en  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 7. Métricas: contador de contactos y búsquedas
-- ---------------------------------------------------------------------

create type tipo_contacto as enum ('whatsapp', 'llamada', 'visita_ficha', 'compartir');
create table contactos (
  id             bigint generated always as identity primary key,
  vendedor_id    uuid not null references vendedores(id) on delete cascade,
  publicacion_id bigint references publicaciones(id) on delete set null,
  tipo           tipo_contacto not null,
  cliente_id     uuid,
  creado_en      timestamptz not null default now()
);
create index contactos_vendedor_fecha_idx on contactos (vendedor_id, creado_en desc);

create table busquedas (
  id          bigint generated always as identity primary key,
  texto       text not null,          -- normalizado (sin acentos, minúsculas)
  zona_id     integer references zonas(id),
  municipio_id integer references municipios(id),
  resultados  integer not null,
  creado_en   timestamptz not null default now()
);
create index busquedas_sin_resultado_idx on busquedas (municipio_id, creado_en desc) where resultados = 0;

-- ---------------------------------------------------------------------
-- 8. Pedir presupuesto a varios
-- ---------------------------------------------------------------------

create type estado_presupuesto as enum ('abierto', 'cerrado', 'vencido');
create table presupuestos (
  id               uuid primary key default gen_random_uuid(),
  cliente_id       uuid not null,
  cliente_nombre   text not null,
  cliente_whatsapp text not null,
  categoria_id     integer not null references categorias(id),
  zona_id          integer not null references zonas(id),
  descripcion      text not null check (char_length(descripcion) between 5 and 1000),
  foto_url         text,
  estado           estado_presupuesto not null default 'abierto',
  vence_en         timestamptz not null default now() + interval '3 days',
  creado_en        timestamptz not null default now()
);

create type estado_destinatario as enum ('enviado', 'visto', 'respondido', 'descartado');
create table presupuesto_respuestas (
  presupuesto_id uuid not null references presupuestos(id) on delete cascade,
  vendedor_id    uuid not null references vendedores(id) on delete cascade,
  estado         estado_destinatario not null default 'enviado',
  precio         numeric(12,2),
  moneda         moneda default 'USD',
  mensaje        text,
  respondido_en  timestamptz,
  primary key (presupuesto_id, vendedor_id)
);
create index presupuesto_resp_vendedor_idx on presupuesto_respuestas (vendedor_id, estado);

-- Suscripciones a notificaciones push (PWA) del vendedor
create table push_suscripciones (
  id          bigint generated always as identity primary key,
  vendedor_id uuid not null references vendedores(id) on delete cascade,
  endpoint    text not null unique,
  claves      jsonb not null,
  creado_en   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 9. Lokl Súper (operado por Lokl; aliados y costos son INTERNOS)
-- ---------------------------------------------------------------------

-- Zonas donde Lokl puede cumplir la promesa de 30 minutos
create table super_zonas (
  zona_id        integer primary key references zonas(id),
  activa         boolean not null default true,
  costo_envio    numeric(10,2) not null default 0,
  minutos_promesa smallint not null default 30
);

-- "Avísame cuando llegue a mi zona": demanda por zona sin cobertura (te dice dónde expandirte)
create table super_lista_espera (
  cliente_id uuid not null,
  zona_id    integer not null references zonas(id),
  whatsapp   text,
  creado_en  timestamptz not null default now(),
  primary key (cliente_id, zona_id)
);

-- Catálogo público (lo que ve el cliente)
create table super_productos (
  id            bigint generated always as identity primary key,
  municipio_id  integer not null references municipios(id),
  categoria_id  integer references categorias(id),
  nombre        text not null,
  marca         text,
  presentacion  text,
  unidad        text,
  descripcion   text,
  foto_url      text,
  foto_mini_url text,
  precio        numeric(12,2) not null check (precio >= 0),  -- precio final con margen
  es_oferta     boolean not null default false,
  disponible    boolean not null default true,
  busqueda      tsvector,
  creado_en     timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);
create index super_productos_muni_idx on super_productos (municipio_id, categoria_id) where disponible;
create index super_productos_busqueda_idx on super_productos using gin (busqueda);

-- INTERNO (solo admin): aliados y costos. El cliente nunca ve estas tablas.
create table super_aliados (
  id        integer generated always as identity primary key,
  nombre    text not null,
  zona_id   integer not null references zonas(id),
  telefono  text,
  notas     text,
  activo    boolean not null default true
);

create table super_costos (
  producto_id   bigint primary key references super_productos(id) on delete cascade,
  aliado_id     integer references super_aliados(id),
  costo         numeric(12,2) not null check (costo >= 0),
  margen_pct    numeric(5,2) not null default 15,
  actualizado_en timestamptz not null default now()
);

-- Al cambiar costo o margen, el precio público se recalcula solo
create or replace function super_recalcular_precio() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update super_productos
     set precio = round(new.costo * (1 + new.margen_pct / 100), 2), actualizado_en = now()
   where id = new.producto_id;
  return new;
end $$;
create trigger super_costos_precio after insert or update of costo, margen_pct on super_costos
  for each row execute function super_recalcular_precio();

create type estado_pedido as enum ('nuevo', 'confirmado', 'comprando', 'en_camino', 'entregado', 'cancelado');
create table super_pedidos (
  id           bigint generated always as identity primary key,
  cliente_id   uuid not null,
  nombre       text not null,
  whatsapp     text not null,
  zona_id      integer not null references zonas(id),
  direccion    text not null,
  items        jsonb not null,          -- copia de nombre/precio/cantidad al momento del pedido
  subtotal     numeric(12,2) not null,
  envio        numeric(10,2) not null,
  total        numeric(12,2) not null,
  estado       estado_pedido not null default 'nuevo',
  creado_en    timestamptz not null default now()
);
create index super_pedidos_cliente_idx on super_pedidos (cliente_id, creado_en desc);
create index super_pedidos_estado_idx on super_pedidos (estado, creado_en desc);

-- Futuro: un operador (franquiciado) exclusivo por municipio
create table super_operadores (
  municipio_id integer primary key references municipios(id),
  usuario_id   uuid not null references auth.users(id),
  desde        date not null default current_date
);

-- ---------------------------------------------------------------------
-- 10. Configuración y roles
-- ---------------------------------------------------------------------

create table configuracion (
  clave  text primary key,
  valor  jsonb not null
);
insert into configuracion (clave, valor) values
  ('super_abierto', 'true'),
  ('reportes_para_ocultar', '3'),
  ('max_publicaciones_dia', '30'),
  ('dias_caducidad', '30');

create table admins (
  usuario_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where usuario_id = auth.uid())
$$;

create or replace function mi_vendedor_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from vendedores where usuario_id = auth.uid()
$$;

-- ---------------------------------------------------------------------
-- 11. Reglas de negocio en la base de datos
-- ---------------------------------------------------------------------

-- 11.1 Abierto/cerrado (misma lógica que estaAbiertoAhora() en el front, zona America/Caracas)
create or replace function esta_abierto(
  desde time, hasta time, estado estado_vendedor, en_pausa boolean, forzar boolean
) returns boolean language plpgsql stable as $$
declare ahora time := (now() at time zone 'America/Caracas')::time;
begin
  if estado <> 'activo' then return false; end if;      -- suspendido: nunca abierto
  if forzar is true then return true; end if;           -- forzado abierto: máxima prioridad
  if forzar is false then return false; end if;         -- forzado cerrado
  if en_pausa then return false; end if;
  if desde is null or hasta is null then return true; end if;
  if hasta > desde then return ahora between desde and hasta; end if;
  return ahora >= desde or ahora <= hasta;              -- cruza medianoche
end $$;

-- 11.2 Filtro de palabras prohibidas: frena antes de que salga
create or replace function moderar_texto(texto text) returns accion_palabra
language sql stable as $$
  select accion from palabras_prohibidas
   where f_unaccent(lower(coalesce(texto, ''))) ~ ('\m' || f_unaccent(lower(palabra)) || '\M')
   order by accion = 'bloquear' desc
   limit 1
$$;

create or replace function publicaciones_antes_guardar() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v vendedores;
  accion accion_palabra;
  hoy integer;
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

  accion := moderar_texto(new.titulo || ' ' || coalesce(new.descripcion, ''));
  -- Solo se modera texto nuevo o editado (si el admin la re-publica tras revisar, no se vuelve a frenar)
  if accion is not null and new.estado = 'publicada'
     and (tg_op = 'INSERT' or new.titulo is distinct from old.titulo
          or new.descripcion is distinct from old.descripcion) then
    new.estado := 'en_revision';
    new.motivo_estado := 'Filtro de palabras: ' || accion::text;
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
create trigger publicaciones_guardar before insert or update of titulo, descripcion, categoria_id, estado
  on publicaciones for each row execute function publicaciones_antes_guardar();

-- 11.3 Con N reportes distintos, se oculta sola hasta que el admin revise
create or replace function reportes_auto_ocultar() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int; limite int := (select (valor)::int from configuracion where clave = 'reportes_para_ocultar');
begin
  select count(*) into n from reportes
   where objetivo = new.objetivo and objetivo_id = new.objetivo_id and resuelto_en is null;
  if n >= limite then
    if new.objetivo = 'publicacion' then
      update publicaciones set estado = 'oculta_reportes'
       where id = new.objetivo_id::bigint and estado = 'publicada';
    elsif new.objetivo = 'resena' then
      update resenas set estado = 'oculta' where id = new.objetivo_id::bigint;
    end if;
    -- Vendedores reportados NO se suspenden solos: decide el admin.
  end if;
  return new;
end $$;
create trigger reportes_insertado after insert on reportes
  for each row execute function reportes_auto_ocultar();

-- 11.4 Máximo 3 subcategorías por vendedor
create or replace function max_tres_categorias() returns trigger language plpgsql as $$
begin
  if (select count(*) from vendedor_categorias where vendedor_id = new.vendedor_id) >= 3 then
    raise exception 'Máximo 3 categorías por vendedor';
  end if;
  return new;
end $$;
create trigger vendedor_categorias_max before insert on vendedor_categorias
  for each row execute function max_tres_categorias();

-- 11.5 Caducidad: se ejecuta cada noche con pg_cron (Supabase lo trae)
-- El vendedor puede "Renovar" una vencida con un toque (vuelve a 'publicada' +30 días).
-- select cron.schedule('caducar-publicaciones', '0 4 * * *',
--   $$ update publicaciones set estado = 'vencida'
--      where estado = 'publicada' and vence_en < now() $$);

-- ---------------------------------------------------------------------
-- 12. Buscador (una sola función para todo Lokl)
-- ---------------------------------------------------------------------

create or replace function buscar(
  q text,
  p_zona_id integer default null,
  p_municipio_id integer default null,
  p_seccion seccion default null,
  p_solo_abiertos boolean default false,
  p_limite integer default 30
) returns table (
  tipo text, id text, titulo text, subtitulo text, precio numeric, moneda moneda,
  foto_mini text, vendedor_slug text, verificado boolean, zona text, seccion seccion, puntaje real
) language plpgsql volatile security definer set search_path = public as $$
#variable_conflict use_column
declare
  qn text := f_unaccent(lower(trim(q)));
  qx text;
  tsq tsquery;
  total int;
  -- La zona del cliente solo ORDENA (lo cercano primero); nunca esconde lo de otros municipios.
  -- p_municipio_id sí filtra, cuando el cliente lo elige explícitamente.
  muni int := coalesce(p_municipio_id, (select municipio_id from zonas where id = p_zona_id));
begin
  -- Expandir sinónimos: "queso duro" → "queso duro OR queso llanero"
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
           ( coalesce(ts_rank(p.busqueda, tsq), 0) + word_similarity(qn, f_unaccent(lower(p.titulo)))
             + case when p.zona_id = p_zona_id then 0.6 when z.municipio_id = muni then 0.3 else 0 end
             + case when v.verificado_en is not null then 0.15 else 0 end )::real
      from publicaciones p
      join vendedores v on v.id = p.vendedor_id and v.estado = 'activo'
      join zonas z on z.id = p.zona_id
     where p.estado = 'publicada' and p.vence_en > now()
       and (p_seccion is null or p.seccion = p_seccion)
       and (p_municipio_id is null or z.municipio_id = p_municipio_id)
       and (p.busqueda @@ tsq or qn <% f_unaccent(lower(p.titulo)))
       and (not p_solo_abiertos or esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto))
  ), vends as (
    select 'vendedor'::text, v.id::text, v.nombre, v.descripcion, null::numeric, null::moneda,
           v.logo_url, v.slug, v.verificado_en is not null, z.nombre, null::seccion,
           ( coalesce(ts_rank(v.busqueda, tsq), 0) + word_similarity(qn, f_unaccent(lower(v.nombre)))
             + case when v.zona_id = p_zona_id
                      or exists (select 1 from vendedor_zonas vz where vz.vendedor_id = v.id and vz.zona_id = p_zona_id)
                    then 0.6 when z.municipio_id = muni then 0.3 else 0 end
             + case when v.verificado_en is not null then 0.15 else 0 end )::real
      from vendedores v join zonas z on z.id = v.zona_id
     where v.estado = 'activo'
       and (p_municipio_id is null or z.municipio_id = p_municipio_id)
       and (v.busqueda @@ tsq or qn <% f_unaccent(lower(v.nombre)))
       and (not p_solo_abiertos or esta_abierto(v.hora_desde, v.hora_hasta, v.estado, v.en_pausa, v.forzar_abierto))
  )
  select * from (select * from pubs union all select * from vends) r
  order by 12 desc
  limit p_limite;

  get diagnostics total = row_count;
  insert into busquedas (texto, zona_id, municipio_id, resultados) values (qn, p_zona_id, muni, total);
end $$;

-- Texto de búsqueda del vendedor: nombre (A), categorías y palabras clave (B), descripción (C)
create or replace function vendedores_busqueda(v_id uuid) returns void
language sql security definer set search_path = public as $$
  update vendedores v set busqueda =
      setweight(to_tsvector('es_lokl', coalesce(v.nombre, '')), 'A')
   || setweight(to_tsvector('es_lokl', coalesce((
        select string_agg(c.nombre || ' ' || array_to_string(c.palabras_clave, ' '), ' ')
          from vendedor_categorias vc join categorias c on c.id = vc.categoria_id
         where vc.vendedor_id = v.id), '')), 'B')
   || setweight(to_tsvector('es_lokl', coalesce(v.descripcion, '') || ' ' || coalesce(v.precios_referencia, '')), 'C')
  where v.id = v_id
$$;

create or replace function vendedores_busqueda_trg() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform vendedores_busqueda(coalesce(new.vendedor_id, old.vendedor_id));
  return null;
end $$;

create or replace function vendedores_busqueda_self() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.nombre is distinct from old.nombre
     or new.descripcion is distinct from old.descripcion
     or new.precios_referencia is distinct from old.precios_referencia then
    perform vendedores_busqueda(new.id);
  end if;
  return null;
end $$;

create trigger vendedores_busqueda_upd after insert or update on vendedores
  for each row execute function vendedores_busqueda_self();
create trigger vendedor_categorias_busqueda after insert or delete on vendedor_categorias
  for each row execute function vendedores_busqueda_trg();

-- ---------------------------------------------------------------------
-- 13. Seguridad: RLS (resumen; detalle en docs/base-de-datos.md)
-- ---------------------------------------------------------------------

alter table estados              enable row level security;
alter table municipios           enable row level security;
alter table zonas                enable row level security;
alter table categorias           enable row level security;
alter table sinonimos            enable row level security;
alter table vendedores           enable row level security;
alter table vendedor_zonas       enable row level security;
alter table vendedor_categorias  enable row level security;
alter table vendedor_fotos       enable row level security;
alter table vendedor_delivery    enable row level security;
alter table categorias_sugeridas enable row level security;
alter table verificaciones       enable row level security;
alter table publicaciones        enable row level security;
alter table publicacion_fotos    enable row level security;
alter table favoritos            enable row level security;
alter table resenas              enable row level security;
alter table palabras_prohibidas  enable row level security;
alter table reportes             enable row level security;
alter table moderacion_log       enable row level security;
alter table contactos            enable row level security;
alter table busquedas            enable row level security;
alter table presupuestos         enable row level security;
alter table presupuesto_respuestas enable row level security;
alter table push_suscripciones   enable row level security;
alter table super_zonas          enable row level security;
alter table super_productos      enable row level security;
alter table super_aliados        enable row level security;
alter table super_costos         enable row level security;
alter table super_pedidos        enable row level security;
alter table super_lista_espera   enable row level security;
alter table super_operadores     enable row level security;
alter table configuracion        enable row level security;
alter table admins               enable row level security;

-- Lectura pública del catálogo
create policy lectura_publica on estados    for select using (true);
create policy lectura_publica on municipios for select using (true);
create policy lectura_publica on zonas      for select using (activa or es_admin());
create policy lectura_publica on categorias for select using (activa or es_admin());
create policy lectura_publica on super_zonas for select using (true);
create policy lectura_publica on super_productos for select using (disponible or es_admin());
create policy lectura_publica on configuracion for select using (clave in ('super_abierto') or es_admin());

create policy ver_vendedores on vendedores for select
  using (estado = 'activo' or usuario_id = auth.uid() or es_admin());
create policy crear_mi_tienda on vendedores for insert
  with check (usuario_id = auth.uid() and estado = 'activo' and verificado_en is null);
create policy editar_mi_tienda on vendedores for update
  using (usuario_id = auth.uid() or es_admin());
-- (Un trigger impide que el vendedor cambie estado/verificado_en por su cuenta.)

create policy ver_publicaciones on publicaciones for select
  using (estado = 'publicada' or vendedor_id = mi_vendedor_id() or es_admin());
create policy crear_publicacion on publicaciones for insert
  with check (vendedor_id = mi_vendedor_id());
create policy editar_publicacion on publicaciones for update
  using (vendedor_id = mi_vendedor_id() or es_admin());

-- Cliente anónimo: puede crear favoritos, reseñas, reportes, contactos y presupuestos.
-- Las lecturas de "lo mío" (favoritos, pedidos, presupuestos) pasan por funciones RPC que
-- reciben el cliente_id, para no exponer los datos de todos los clientes.
create policy anon_crear on favoritos  for insert with check (true);
create policy anon_crear on resenas    for insert with check (estado = 'publicada');
create policy anon_crear on reportes   for insert with check (resuelto_en is null);
create policy anon_crear on contactos  for insert with check (true);
create policy anon_crear on presupuestos for insert with check (estado = 'abierto');
create policy anon_crear on super_lista_espera for insert with check (true);
create policy solo_admin on super_lista_espera for select using (es_admin());
create policy ver_resenas on resenas   for select using (estado = 'publicada' or es_admin());

-- Internas del Súper y moderación: SOLO admin
create policy solo_admin on super_aliados  for all using (es_admin()) with check (es_admin());
create policy solo_admin on super_costos   for all using (es_admin()) with check (es_admin());
create policy solo_admin on palabras_prohibidas for all using (es_admin()) with check (es_admin());
create policy solo_admin on moderacion_log for all using (es_admin()) with check (es_admin());
create policy solo_admin on busquedas      for select using (es_admin());
create policy solo_admin on admins         for select using (es_admin());

-- Políticas restantes (fotos, zonas de cobertura, delivery, presupuesto_respuestas,
-- push, súper pedidos) siguen el mismo patrón: dueño o admin. Se completan en la Fase 2.
