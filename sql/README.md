# Archivos SQL de Lokl

Aquí se guarda **todo lo que se ejecuta en el SQL Editor de Supabase**, en orden.
Cada archivo se corre **una sola vez** y nunca se modifica después de correrlo: si hay que cambiar algo, se crea el siguiente número.

## Cómo correr uno

1. Abrir el archivo (doble clic o con el Bloc de notas).
2. **Ctrl + A** y **Ctrl + C**.
3. Supabase → **SQL Editor** → **New query** → **Ctrl + V** → **Run**.
4. Anotar la fecha en la tabla de abajo.

## Registro

| # | Archivo | Qué hace | Ejecutado en Supabase |
|---|---|---|---|
| 01 | `01-esquema-inicial.sql` | Crea todas las tablas, reglas, seguridad (RLS), el buscador y la tarea nocturna de caducidad | ✅ 8/11/2026 |
| 02 | `02-modulo-2-zonas-categorias.sql` | Campo "Hasta dónde envías", ajuste de categorías, y datos iniciales: 24 estados, 7 municipios de Apure, 28 zonas, 91 categorías, 20 sinónimos | ✅ 8/11/2026 |
| 03 | `03-modulo-3-cuentas-vendedor.sql` | Corrige el hueco del sello de verificado, enlaces reservados, zonas propuestas por vendedores, permisos de lo que es de cada vendedor y la carpeta de fotos | ✅ 8/11/2026 |
| 04 | `04-admin-usalokl.sql` | La cuenta usalokl.app@gmail.com pasa a ser administradora de Lokl | ✅ 8/11/2026 |
| 05 | `05-borrar-tienda-prueba-dorcas.sql` | Borra la tienda de prueba DORCAS de la cuenta administradora | ✅ 8/11/2026 |
| 06 | `06-modulo-4-publicar.sql` | Publicar: "agotado", solo los clasificados vencen, el vendedor no puede sacar de revisión lo moderado, permisos de las fotos de productos | ✅ 9/11/2026 |
| 07 | `07-modulo-5-buscador-listados.sql` | Buscador y listados: hasta 10 categorías por tienda, listas de tiendas y anuncios por sección, buscador que perdona errores ("kezo" = queso) y ordena por cercanía | ✅ 14/11/2026 |
| 08 | `08-modulo-6-moderacion.sql` | Moderación: palabras que bloquean o mandan a revisión, reportes de la gente (3 ocultan una publicación), acciones del admin con bitácora, verificaciones y lo que buscan sin encontrar. Corrige que lo enviado a revisión no se podía guardar | ✅ 14/11/2026 |
| 09 | `09-modulo-7-servicios.sql` | Servicios: formas de pago permitidas, precios de referencia y filtros "A domicilio" y "24 horas" en las listas | ✅ 14/11/2026 |
| 10 | `10-modulo-8-cliente.sql` | Cliente: favoritos, reseñas (solo quien escribió o llamó desde Lokl), respuesta del vendedor, reportar reseñas y contador semanal. Oculta a los vendedores el código del teléfono de sus clientes | ✅ 14/11/2026 |
| 11 | `11-modulo-9-al-mayor.sql` | Al mayor: unidades, pedido mínimo, cuándo hay, fecha del precio y "Mi precio sigue igual", tabla de precios de origen y quienes envían a todo el país | ✅ 14/11/2026 |
| 12 | `12-modulo-9-dos-precios.sql` | Al mayor (ajuste): tipos de Tiendas también al mayor, 3 tipos nuevos (Productos de limpieza, Artesanía, Alimentos procesados), "cirugía" y "alisado" en Belleza, y dos precios por publicación (detal y mayor) | ✅ 15/11/2026 |
| 13 | `13-modulo-10a-super-catalogo.sql` | Súper: pasillos con su margen, precio = costo + margen (producto → pasillo → general 7%), tasa del día, reglas de envío y buscador del Súper | ✅ 15/11/2026 |
| 14 | `14-modulo-10a-super-sugerencias.sql` | Súper: 213 productos sugeridos (154 con foto de Open Food Facts), sin precio y sin marcar. Correr después del 13 | ✅ 15/11/2026 |
| 15 | `15-modulo-10b-super-pedidos.sql` | Súper: pedidos (precios y envío los calcula la base), WhatsApp 0424-3232671, horario 7:30 am a 8:00 pm todos los días, pagos digitales, "Mis pedidos" y tablero del admin | ✅ 15/11/2026 |
| 16 | `16-modulo-11-presupuestos.sql` | Pedir presupuesto a varios: reparto a hasta 8 negocios (su sector y verificados primero), respuestas con precio, avisos en el teléfono, máximo 3 por día, reportes y "lo que piden y nadie atiende" | ⏳ |

## Para quien programa

- Estos archivos son el **mismo contenido** de `supabase/migrations/` (el esquema por partes) y `supabase/seed.sql` (los datos iniciales), juntados para pegar de una vez.
- Las migraciones de `supabase/migrations/` siguen siendo la fuente para la CLI de Supabase. Al agregar una nueva, crear también aquí el siguiente archivo numerado.
- Los datos (`seed.sql`) se pueden correr varias veces sin duplicar.

## Si sale "already exists" (ya existe)

Significa que ese archivo ya se había corrido (por ejemplo, al tocar **Run** dos veces). No se rompe nada: avisa y se verifica que todo haya quedado aplicado.
