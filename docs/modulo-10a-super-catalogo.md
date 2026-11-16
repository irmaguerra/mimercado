# Módulo 10A — Lokl Súper: catálogo y administración

**Estado:** ✅ aprobado por Irma el 15/11/2026 (sql/13 y sql/14 corridos; probados precios, agotado, margen por pasillo y el buscador). La vista previa del admin se reemplazó por `/super` abierto al público en el Módulo 10B.

## Decisiones de Irma (15/11/2026)

| # | Decisión |
|---|---|
| 45 | Súper en dos partes: **10A** catálogo y administración, **10B** carrito y pedidos |
| 46 | Precios en **dólares y bolívares**, con la **tasa del día** que pone el admin |
| 47 | Margen **7% general**, cambiable **por pasillo** y **por producto** |
| 49 | El catálogo lo carga **solo el admin** |
| 51 y 52 | Envío: **casco central de San Fernando gratis desde $20**, si no **$1**; otras zonas, **por confirmar** por WhatsApp; pedido mínimo **$5**; el cliente escribe su sector |
| 53 | Carga con **lista de sugerencias** (fotos de Open Food Facts), **sin precios inventados**. Pegar listas de proveedores: cuando existan |

## Cómo funciona el precio

**Precio de venta = lo que te cuesta × (1 + margen)**. El margen es el del producto; si no tiene, el del pasillo; si tampoco, el general (7%). Ejemplo: te cuesta $1,00 con 7% → se vende a **$1,07**. Con la tasa de Bs 240,50 → **Bs 257,34**.

Lo que te cuesta y los márgenes **solo los ve el admin**: la base de datos no se los entrega al público.

## Pantallas (solo admin)

| Dirección | Qué hace |
|---|---|
| `/admin/super` | Tasa del día, margen general, envío (gratis desde, tarifa, mínimo) y contadores: a la venta y elegidos sin precio |
| `/admin/super/productos` | **Elegir qué vender**: las 213 sugerencias por pasillo, con casillas y "Marcar todos" |
| `/admin/super/precios` | **Lo que me cuesta**: costo, margen propio (opcional) y "Agotado" de cada producto elegido. Filtros "Sin precio" y por pasillo. Muestra el precio de venta en $ y Bs |
| `/admin/super/margenes` | Margen por pasillo |
| `/admin/super/nuevo` | Agregar un producto que no está en las sugerencias |
| `/super` | (desde el 10B) El Súper como lo ve el cliente |

## Sugerencias (sql/14)

- **154 productos con foto** (código de barras venezolano 759…) tomados de **Open Food Facts**, revisados uno por uno: se quitaron duplicados y fotos que no correspondían, y se corrigieron los nombres. Las fotos están en `public/super/fotos/` (240×240, WebP, ~7 KB cada una, 1,2 MB en total).
- **59 genéricos sin foto**: huevos, quesos, carnes, pollo, frutas y verduras, limpieza, cuidado personal, bebé.
- **Ninguno trae precio** y ninguno está marcado: el cliente no ve nada hasta que el admin marca y pone el costo.
- Licencia de las fotos: CC BY-SA. El catálogo muestra "Fotos de productos: Open Food Facts (CC BY-SA)".
- Open Food Facts tiene unos 1.800 productos de Venezuela; el servidor limitó la descarga a los ~1.000 más escaneados. Se pueden sumar más después.

## Pasos para Irma

1. Supabase → **SQL Editor** → **New query** → pegar **todo** `sql/13-modulo-10a-super-catalogo.sql` → **Run**. Debe decir "Success".
2. Otra **New query** → pegar **todo** `sql/14-modulo-10a-super-sugerencias.sql` → **Run**.
3. En usalokl.com, entrar con la cuenta de admin → **Mi cuenta** → **Administración** → **Lokl Súper**.

## Pruebas

- [ ] Poner la tasa del día.
- [ ] Elegir qué vender: marcar varios productos y "Marcar todos" en un pasillo → Guardar.
- [ ] Precios: poner lo que cuestan 3 o 4 productos → ver el precio de venta en $ y Bs.
- [ ] Márgenes: poner 5% a "Harinas, arroz y granos" → los precios de ese pasillo cambian.
- [ ] Marcar uno como Agotado → desaparece de la vista previa.
- [ ] Agregar un producto nuevo.
- [ ] Vista previa: buscar "arina pan" o "kezo" y recorrer los pasillos.

## Queda para después

- **Pegar la lista de un proveedor** y **actualizar precios pegando la lista nueva** (decisión 53), cuando haya proveedores.
- Foto propia de un producto desde el teléfono.
- **10B**: carrito, pedido por WhatsApp al número del Súper, tablero de pedidos, "Repetir pedido", lista de espera, Súper primero en el buscador.
