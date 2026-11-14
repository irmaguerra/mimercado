# Módulo 5 — Buscador y listados

**Estado:** ✅ aprobado por Irma el 14 de noviembre de 2026. Probado en el teléfono: categorías, listados, "Ver primero", clasificados por categoría, buscador y "Lo nuevo".

## Decisiones de Irma (14/11/2026)

- **Listados (12):** Tiendas, Comida, Al mayor y Servicios muestran **las tiendas** (logo, abierto/cerrado, zona). Primero las abiertas, después las del sector elegido. Clasificados muestra **la cuadrícula de productos**, lo más nuevo primero.
- **Sector (13):** "Ver primero: [sector]" **ordena, no esconde**.
- **Para después (14):** el bloque de Lokl Súper en los resultados (Módulo 10) y el autocompletado.
- **Categorías (15):** cada tienda marca **hasta 10 categorías** de su sección. Los productos no piden categoría: salen por la tienda. En **clasificados**, cada anuncio elige **una categoría** al publicarlo.

## Pantallas

| Dirección | Qué hace | JavaScript | Peso (comprimido) |
|---|---|---|---|
| `/apure/san-fernando` | Lo de antes + **"Lo nuevo"**: las 12 últimas publicaciones con foto | 0 KB | ~5 KB + miniaturas |
| `/apure/san-fernando/comida` | Botones de categorías (Pizza, Arepas…), "Ver primero: [sector]" y la lista de puestos | 0 KB | ~5 KB + logos |
| `/apure/san-fernando/comida/pizza` | Solo los que marcaron Pizza | 0 KB | ~5 KB |
| `/apure/san-fernando/servicios/transporte/moto-taxi` | Servicios tiene dos niveles: Transporte → Moto taxi | 0 KB | ~5 KB |
| `/apure/san-fernando/clasificados/vehiculos` | Cuadrícula de anuncios de esa categoría | 0 KB | ~5 KB + miniaturas |
| `/buscar?q=queso` | Resultados agrupados por sección, con los filtros "Abierto ahora" y por sección. Sin resultados: consejos y "Publícalo gratis" | 0 KB | ~5 KB |
| `/panel/tienda` y `/panel/crear` | Casillas "¿Qué vendes?" (hasta 10) | — | — |
| `/panel/publicar` (clasificados) | "¿De qué es tu anuncio?": una categoría, obligatoria | — | — |
| `/panel` | Aviso "Elegir mis categorías" si todavía no marcó ninguna | — | — |

Todas las listas muestran 30 y tienen el botón "Ver más". La pestaña **Buscar** de abajo usa la ciudad que la persona eligió.

## El buscador (`sql/07`)

- Ignora acentos y mayúsculas, entiende singular y plural y usa tus **sinónimos**.
- **Perdona errores al escribir**, comparando cómo suenan las palabras: "kezo" encuentra queso, "piza" encuentra pizza y "moto vera" encuentra la Bera.
- Encuentra las tiendas por su nombre, su descripción y **sus categorías**: "arepas" encuentra la arepera aunque no haya publicado nada.
- **Ordena, no esconde:** primero lo de tu sector, después lo de tu ciudad y luego el resto del país. Los verificados suben un poco y lo agotado va al final.
- Quien solo vende algo de vez en cuando (clasificados) aparece por sus anuncios, no como tienda.
- Cada búsqueda queda anotada con su número de resultados, para ver en el admin lo que la gente busca y no encuentra. Por eso los resultados no se guardan en caché. Las listas sí se guardan 60 segundos.

## Pendiente

1. ✅ `sql/07` corrido el 14/11/2026.
2. ✅ Publicado y probado en el teléfono (14/11/2026):
   - En "Editar mi tienda", marcar categorías. Si se marcan 11, debe salir un aviso.
   - Ver tu tienda en la sección y en su categoría, y probar "Ver primero".
   - Publicar un clasificado eligiendo su categoría y verlo en esa lista.
   - Buscar algo bien escrito, algo mal escrito ("kezo") y algo que no exista.
3. Que los vendedores de prueba marquen sus categorías, porque sin eso no salen en las listas por categoría.
