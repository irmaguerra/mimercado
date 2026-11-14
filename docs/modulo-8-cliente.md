# Módulo 8 — Cliente: favoritos, reseñas y contador

**Estado:** 🛠️ publicado · `sql/10` corrido · falta probar en el teléfono · 14 de noviembre de 2026

Todo funciona **sin cuenta**. El teléfono se reconoce por un dato guardado en el navegador (la cookie `lokl_cliente`), que es privado: ni los vendedores pueden verlo.

## Decisiones de Irma (14/11/2026)

| # | Decisión |
|---|---|
| 27 | Se entra a los favoritos con un **♡ arriba**, al lado de la ubicación. La barra de abajo no cambia |
| 28 | Solo puede opinar **quien le escribió por WhatsApp o lo llamó desde Lokl**, desde ese mismo teléfono. Una reseña por teléfono y tienda, que se puede cambiar |
| 29 | El **promedio de estrellas** se muestra desde **3 reseñas** |
| 30 | El vendedor puede **responder una vez** cada reseña (y corregir su respuesta) |
| 31 | Las reseñas **se pueden reportar**: con 3 reportes se ocultan y van a "Por revisar". El vendedor no puede borrar una reseña |
| 32 | Favoritos y reseñas solo para tiendas, puestos, productores y servicios; no para personas de Clasificados |

## Pantallas

| Dirección | Quién | Qué hace | JavaScript |
|---|---|---|---|
| `/<tienda>` | Cliente | **♡ Guardar en mis favoritos**, estrellas junto al nombre (desde 3 reseñas), las 5 últimas opiniones con la respuesta del vendedor, **Dejar mi opinión** y **Reportar** en cada opinión | 0 KB |
| `/favoritos` | Cliente | **Lo nuevo de tus favoritos** (lo publicado en la última semana) y sus tiendas, con abierto/disponible y "Quitar" | 0 KB |
| `/opinar?t=…` | Cliente | Estrellas, comentario y nombre opcional. Si no le escribió desde ese teléfono, explica cómo hacerlo | 0 KB |
| `/opiniones?t=…` | Cliente | Todas las opiniones, de 30 en 30 | 0 KB |
| `/panel` | Vendedor | **Esta semana:** personas que lo contactaron, mensajes por WhatsApp, llamadas, guardados en favoritos y reseñas nuevas | ~0,3 KB |
| `/panel/resenas` | Vendedor | Sus opiniones (también las ocultas, para que sepa qué pasó) y el espacio para responder | 0 KB |
| `/admin/revisar` | Tú | Nueva sección **Opiniones**: las reportadas o frenadas por el filtro, con "Está bien" y "Ocultar" | — |

## Seguridad (`sql/10`)

- **Arreglo importante:** hasta ahora un vendedor podía ver el código del teléfono de quienes le escribían, y con él podría haberse dejado reseñas haciéndose pasar por esos clientes. Ahora nadie puede leer ese código.
- Favoritos y reseñas solo se crean con funciones de la base, que revisan las reglas.
- Las reseñas pasan por el **filtro de palabras**: "Bloquear" no deja publicar y "Revisar" la manda a "Por revisar".
- **Freno anti-abuso:** desde un teléfono se pueden dejar hasta 5 reseñas nuevas por día, y una tienda recibe hasta 20 por día.
- **Límite conocido** (el mismo de los reportes): una persona con conocimientos técnicos podría fabricar reseñas. El freno diario, los reportes y tu "Por revisar" reducen el daño.

## Pendiente

1. ✅ `sql/10` corrido el 14/11/2026.
2. Subir el código y **probar en el teléfono**:
   - En una tienda, tocar **♡ Guardar** y luego el **♡ de arriba**: debe aparecer en Mis favoritos. Después quitarla.
   - Tocar **Dejar mi opinión** sin haberle escrito antes: debe pedir que primero le escribas.
   - Tocar **Escribir por WhatsApp** (no hace falta enviar el mensaje), volver y opinar. La reseña debe verse en la tienda.
   - Con la cuenta del vendedor: ver "Esta semana" en Mi tienda y responder la reseña en **Opiniones de mis clientes**.
   - Reportar la reseña desde otra ventana de incógnito y verla en "Por revisar".
