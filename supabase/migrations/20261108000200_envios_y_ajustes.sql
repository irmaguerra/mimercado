-- Módulo 2: "Hasta dónde envías" y un ajuste a las categorías.

-- ---------------------------------------------------------------------
-- 1. Hasta dónde envía cada vendedor.
--    Sirve para que alguien de otro estado (por ejemplo Caracas) vea
--    primero a los productores de Apure que le pueden mandar.
-- ---------------------------------------------------------------------
create type alcance_envio as enum (
  'zona',       -- solo su zona / sector
  'municipio',  -- todo su municipio (lo normal para delivery)
  'estado',     -- todo su estado
  'nacional'    -- todo el país, por encomienda (MRW, Zoom, Tealca…)
);

alter table vendedores
  add column alcance_envio alcance_envio not null default 'municipio',
  add column envio_detalle text;   -- ej. "Envío por MRW o Zoom, cobro a destino"

comment on column vendedores.alcance_envio is 'Hasta dónde envía el vendedor. Ordena resultados para quien está lejos.';
comment on column vendedores.envio_detalle is 'Texto libre: empresas de encomienda, quién paga el envío, días de despacho.';

-- Índice pequeño para "productores que envían a todo el país"
create index vendedores_envio_nacional on vendedores (zona_id)
  where alcance_envio = 'nacional' and estado = 'activo';

-- ---------------------------------------------------------------------
-- 2. Categorías: la regla "no repetir el mismo nombre" no aplicaba a
--    las categorías principales (padre_id vacío). Con NULLS NOT DISTINCT
--    el vacío cuenta como igual y ya no se pueden duplicar.
-- ---------------------------------------------------------------------
alter table categorias drop constraint categorias_seccion_padre_id_slug_key;
alter table categorias add constraint categorias_seccion_padre_id_slug_key
  unique nulls not distinct (seccion, padre_id, slug);
