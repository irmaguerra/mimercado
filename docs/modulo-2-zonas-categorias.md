# Módulo 2 — Zonas, categorías y ubicación

**Estado:** publicado en https://lokl.usalokl-app.workers.dev · pendiente de tu visto bueno · 8 de noviembre de 2026

## Datos cargados en Supabase (`sql/02-modulo-2-zonas-categorias.sql`)

| Dato | Cantidad |
|---|---|
| Estados de Venezuela | 24 (sus nombres quedan reservados para enlaces) |
| Municipios de Apure | 7 · San Fernando activo |
| Zonas | 28: Centro, El Recreo, Parque de Ferias, los pueblos de cada parroquia y La Macanilla (Pedro Camejo) |
| Categorías | 54 principales + 37 subcategorías en Comida, Tiendas, Al mayor, Servicios y Clasificados |
| Sinónimos | 20 (cambur = banano, queso duro = queso llanero…) |
| Campo nuevo | "Hasta dónde envías": zona · municipio · estado · todo el país |

Los sectores que faltan los proponen los vendedores con **"No está mi zona"** y se aprueban en el admin.

## Ubicación (aprobada 8/11/2026)

La ubicación **ordena, no esconde**.

| Dirección | Qué muestra |
|---|---|
| `/` | Primera vez: **"¿Dónde estás?"** (un toque, sin GPS). Después: lleva directo a la ciudad elegida |
| `/ubicacion` | Cambiar de ubicación (el "📍 San Fernando ▾" de arriba) |
| `/apure/san-fernando` | Portada de la ciudad: buscador, Súper, secciones |
| `/apure/pedro-camejo` | Municipio todavía no activo: "Lokl está empezando aquí" |
| `/apure` | Página del estado con sus municipios |
| `/distrito-capital` | Estado sin Lokl: "todavía no llega, mira lo que se vende en San Fernando" |

- La elección se guarda un año en el teléfono (cookie `lokl_ubic`). Sin JavaScript.
- Para abrir una ciudad nueva: marcar el municipio como `activo` en Supabase y aparece en "¿Dónde estás?".
- Quien llega por un enlace de WhatsApp no ve la pregunta: el enlace ya trae el lugar.
- Peso: portada de San Fernando 3,4 KB comprimida, 0 KB de JavaScript.

## Mientras no hay admin

El admin necesita inicio de sesión, que llega en el Módulo 3. Hasta entonces, zonas y categorías se editan en Supabase → **Table Editor** (tablas `zonas`, `categorias`, `sinonimos`, `municipios`).

## Pendiente para módulos siguientes

- Elegir también el sector dentro de la ciudad (ordena resultados; Módulo 5).
- "Productores que envían a todo el país" para quien está en otro estado (Módulo 5/9).
- Las secciones (`/apure/san-fernando/comida`…) todavía dan "Esta página no existe": se construyen en el Módulo 5.
