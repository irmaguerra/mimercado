# Módulo 6 — Moderación

**Estado:** 🛠️ publicado · `sql/08` corrido · falta probar en el teléfono · 14 de noviembre de 2026

En Lokl todo se publica al instante. Este módulo es el control posterior.

## Decisiones de Irma (14/11/2026)

| # | Decisión |
|---|---|
| 16 | Motivos para reportar: estafa o engaño · algo prohibido · ofensivo · ya no existe o no contesta · otro (con explicación) |
| 17 | Con **3 reportes** de personas distintas, una publicación se oculta sola hasta que la revises (ajustable en `configuracion`, clave `reportes_para_ocultar`) |
| 18 | Las tiendas reportadas **nunca se suspenden solas**: decides tú |
| 19 | Palabras prohibidas de dos tipos: **Bloquear** no deja publicar; **Revisar** guarda la publicación pero no sale hasta que la apruebes |
| 20 | La lista de palabras **empieza vacía**: se agregan desde el admin a medida que aparecen casos |
| 21 | La página `/verificado` se hace ahora en versión corta; la completa llega en el Módulo 12 |

## Pantallas

| Dirección | Quién | Qué hace |
|---|---|---|
| `/reportar?p=…` y `/reportar?t=…` | Cualquiera | Se llega por el enlace "Reportar" al final de cada producto y cada tienda. Es anónimo y no pide cuenta, y cada teléfono reporta una sola vez cada cosa. 0 KB de JavaScript |
| `/verificado` | Cualquiera | Qué significa el sello verde. ~5 KB |
| `/admin` | Tú | Número de cosas "por revisar" y el menú de moderación |
| `/admin/revisar` | Tú | Publicaciones frenadas por el filtro, ocultas por reportes o con reportes, y tiendas reportadas. Botones: **Está bien**, **Ocultar…** y **Suspender…** (estos dos piden motivo) |
| `/admin/tiendas` | Tú | Buscar una tienda para **dar o quitar el sello verde** (indicando cómo la verificaste), **suspender** o **reactivar** |
| `/admin/palabras` | Tú | Agregar, quitar y cambiar entre Bloquear y Revisar |
| `/admin/busquedas` | Tú | Lo que buscan y no encuentran (7 o 30 días) |
| `/admin/bitacora` | Tú | Quién hizo qué, cuándo y por qué |

El vendedor ve en "Mis publicaciones" **"Oculto por Lokl"** con el motivo. Si su tienda está suspendida, también ve el motivo en "Mi tienda". Si escribe una palabra bloqueada, el aviso le dice que la cambie.

## Seguridad (`sql/08`)

- Las acciones del admin pasan por funciones de la base que **exigen ser admin** y dejan nota en la bitácora en el mismo paso.
- Nadie puede leer los reportes ni las verificaciones, salvo el admin.
- Los reportes solo entran por `reportar()`, que revisa el motivo y que lo reportado exista.
- **Límite conocido:** como el reporte es anónimo, alguien con conocimientos técnicos podría juntar 3 reportes falsos y ocultar una publicación. El daño es pequeño: queda oculta hasta que la revisas y la apruebas con "Está bien". Si llega a pasar, se puede exigir más reportes o dejar que los verificados no se oculten solos.
- **Arreglo de paso:** desde el Módulo 4, una publicación con una palabra de tipo "Revisar" no se podía guardar, porque la base solo aceptaba crear publicaciones en estado "publicada". Corregido.

## Pendiente

1. ✅ `sql/08` corrido el 14/11/2026.
2. Subir el código y **probar en el teléfono**:
   - Agregar una palabra de prueba en Bloquear y otra en Revisar, y publicar con cada una.
   - Reportar un producto desde otro teléfono o en una ventana de incógnito, y verlo en "Por revisar".
   - Tocar "Está bien" en uno y "Ocultar…" en otro, y ver el motivo en "Mis publicaciones" del vendedor.
   - Verificar una tienda y ver el sello verde. Después quitárselo.
   - Suspender una tienda de prueba y reactivarla.
   - Revisar la bitácora y "Lo que buscan y no encuentran".
   - Al final, borrar las palabras de prueba.
