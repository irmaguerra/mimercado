# Módulo 9 — Al mayor y precios de origen

**Estado:** ✅ aprobado por Irma el 15 de noviembre de 2026. Probado en el teléfono: publicar al mayor, "Mi precio sigue igual", envían a todo el país (/precios y /zulia), detal y mayor en un mismo producto, Belleza y cosméticos. **Queda pendiente probar "publicar sin señal"** (Irma lo hará después).

La "puerta al mundo": que el queso de La Macanilla o el pescado de Cunaviche muestren su precio real de origen a gente de fuera de su comunidad.

## Decisiones de Irma (14/11/2026)

| # | Decisión |
|---|---|
| 33 | Venden al mayor los **productores** (siempre) y las **tiendas** que marquen "Esto lo vendo al mayor" en un producto |
| 34 | Unidades: kilo · litro · unidad · docena · cesta · saco o bulto · caja · cabeza (ganado) · tonelada |
| 35 | Cada producto al mayor elige **qué es** (Queso y lácteos, Ganado…) para la tabla de precios |
| 36 | `/precios` muestra solo lo actualizado en los **últimos 30 días**. El botón **"Mi precio sigue igual"** renueva la fecha con un toque |
| 37 | **"Envían a todo el país"**: filtro en `/precios` y sección en la página de los estados donde Lokl todavía no llega |
| 38 | **Publicar sin señal** para todos, no solo al mayor |
| 39 | **Una sola lista de tipos al mayor**: los 7 del campo + los de Tiendas, con 3 nuevos: **Productos de limpieza, Artesanía y Alimentos procesados**. Las "cirugías" (tratamientos para alisar el cabello) entran en **Belleza y cosméticos** (el buscador entiende "cirugía", "alisado" y "keratina"). En `/precios` los botones de tipo se arman con los que tienen precios |
| 40 | **Dos precios en una sola publicación**: precio al detal y precio al mayor (con su unidad y pedido mínimo). En listas y tiendas se ve el de detal; si solo vende al mayor, el de mayor ("$4 el kilo"). `/precios` usa siempre el de mayor |

## Pantallas

| Dirección | Qué hace | JavaScript |
|---|---|---|
| `/panel/publicar` | Productores: sección **Venta al mayor** (el precio es por…, pedido mínimo, cuándo hay, qué es). Tiendas: lo mismo dentro de **"¿Lo vendes al mayor?"** | ~13 KB (fotos y "sin señal") |
| `/panel/publicaciones` | "Precio de hace X días" y el botón **Mi precio sigue igual** | 0 KB |
| `/p/<número>` | "**$4 el kilo**", y debajo: Venta al mayor · Mínimo 20 kilos · Hay: lunes y jueves · Precio actualizado hace 3 días | 0 KB |
| `/precios` | Tabla por tipo de producto: **producto · dónde · precio · hace cuánto**. Botones por tipo, "Envían a todo el país" y "Dónde" (todo el país o un estado) | 0 KB |
| `/apure/san-fernando` | Tarjeta **Precios de origen** | 0 KB |
| `/zulia` (estados sin Lokl) | Sección **Envían a todo el país** con los productores que mandan por encomienda | 0 KB |
| `/panel` | Aviso si hay publicaciones esperando señal, o si una no se pudo publicar | ~0,6 KB en línea |

## Dos precios (decisión 40)

| Quién | Qué llena en Publicar |
|---|---|
| Solo detal (lo normal) | Solo "Precio al detal". Nada cambia |
| Detal **y** mayor | Los dos precios en la misma publicación: "$2" y debajo "Al mayor: $1,50 c/u · Mínimo 50 unidades" |
| Solo mayor (ej. ganado) | Deja vacío el detal y llena solo el precio al mayor |

Lo que ya estaba publicado al mayor se acomodó solo (`sql/12`): su precio pasó a ser el precio al mayor, sin cambiar la fecha.

## Publicar sin señal (decisión 38)

1. Si se toca **Publicar** sin conexión, el formulario se guarda en el teléfono con las fotos ya comprimidas, y aparece el aviso *"Lo guardamos en tu teléfono…"*.
2. Si vuelve la señal con esa pantalla abierta, se publica en ese momento.
3. Si no, se publica la **próxima vez que la persona abra cualquier página de Lokl con señal**, porque lo envía el service worker.
4. En **Mi tienda** se ve cuántas publicaciones esperan señal. Si una falló por un error (por ejemplo, el límite diario), se avisa una vez para que la publique de nuevo.

**Límite:** el envío automático necesita que la persona vuelva a abrir Lokl, porque los navegadores no dejan que una página cerrada envíe datos. Si la señal se corta justo cuando el servidor ya recibió la publicación, podría quedar repetida; en ese caso se borra la copia en "Mis publicaciones".

## Pendiente

1. ✅ `sql/11` corrido el 14/11/2026.
1. ✅ `sql/12` corrido el 15/11/2026.
2. Subir el código y **probar en el teléfono**:
   - Con un **productor**: publicar con precio, unidad, mínimo, "cuándo hay" y tipo. Revisar la ficha y `/precios`.
   - Tocar **Mi precio sigue igual** en Mis publicaciones.
   - Con una **tienda**: publicar un producto marcando "Esto lo vendo al mayor".
   - Marcar "A todo el país" en Editar mi tienda del productor y verlo en `/precios` → "Envían a todo el país" y en `/zulia`.
   - Publicar un producto con **precio al detal y al mayor** a la vez, y uno de **Belleza y cosméticos** al mayor.
   - **Sin señal:** con la pantalla de Publicar abierta, poner el teléfono en **modo avión**, publicar, ver el aviso, quitar el modo avión y comprobar que se publica.
