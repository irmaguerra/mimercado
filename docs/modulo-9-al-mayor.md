# Módulo 9 — Al mayor y precios de origen

**Estado:** 🛠️ publicado · `sql/11` corrido · falta probar en el teléfono · 14 de noviembre de 2026

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

## Publicar sin señal (decisión 38)

1. Si se toca **Publicar** sin conexión, el formulario se guarda en el teléfono con las fotos ya comprimidas, y aparece el aviso *"Lo guardamos en tu teléfono…"*.
2. Si vuelve la señal con esa pantalla abierta, se publica en ese momento.
3. Si no, se publica la **próxima vez que la persona abra cualquier página de Lokl con señal**, porque lo envía el service worker.
4. En **Mi tienda** se ve cuántas publicaciones esperan señal. Si una falló por un error (por ejemplo, el límite diario), se avisa una vez para que la publique de nuevo.

**Límite:** el envío automático necesita que la persona vuelva a abrir Lokl, porque los navegadores no dejan que una página cerrada envíe datos. Si la señal se corta justo cuando el servidor ya recibió la publicación, podría quedar repetida; en ese caso se borra la copia en "Mis publicaciones".

## Pendiente

1. ✅ `sql/11` corrido el 14/11/2026.
2. Subir el código y **probar en el teléfono**:
   - Con un **productor**: publicar con precio, unidad, mínimo, "cuándo hay" y tipo. Revisar la ficha y `/precios`.
   - Tocar **Mi precio sigue igual** en Mis publicaciones.
   - Con una **tienda**: publicar un producto marcando "Esto lo vendo al mayor".
   - Marcar "A todo el país" en Editar mi tienda del productor y verlo en `/precios` → "Envían a todo el país" y en `/zulia`.
   - **Sin señal:** con la pantalla de Publicar abierta, poner el teléfono en **modo avión**, publicar, ver el aviso, quitar el modo avión y comprobar que se publica.
