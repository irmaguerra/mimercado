# Módulo 1 — Cimientos

**Estado:** ✅ terminado, pendiente de tu visto bueno · publicado en https://lokl.usalokl-app.workers.dev · 8 de noviembre de 2026

## Decisión: Astro en vez de Next.js

Next.js mandaba **~133 KB de JavaScript** comprimido a cada teléfono aunque la página estuviera vacía (React + su enrutador), y la meta era menos de 70 KB. Se cambió a **Astro con islas de Preact**, en toda la app:

- Las páginas públicas salen como **HTML puro: 0 KB de JavaScript**.
- Las partes interactivas (panel, carrito, publicar, botón abrir/cerrar) llevan una "isla" de Preact, de **~10 KB**, solo en esa pantalla.
- Sigue siendo una sola tecnología, con Supabase y la misma vista previa de WhatsApp. Se aloja en **Cloudflare Workers** (ver decisión #9).

## Qué se hizo

| Pieza | Dónde | Nota |
|---|---|---|
| App vieja apartada | `legado/` | Solo como referencia. No se compila. `main` y usalokl.com siguen intactos |
| Astro 7 + Preact + Cloudflare | `astro.config.mjs`, `wrangler.jsonc` | Páginas públicas guardadas 60 s en la red de Cloudflare (`src/lib/cache.js`); panel y admin nunca se cachean |
| Variables de entorno | `.env.example` | Se acabaron las claves escritas en el código |
| Paleta e íconos Lokl | `src/styles/globals.css`, `src/components/` | Íconos en línea, generados con `npm run iconos`. Se agregaron 4: inicio, buscar, publicar, cuenta |
| Plantilla base | `src/layouts/Base.astro` | `<head>`, vista previa de WhatsApp (cada página puede pasar su imagen), barra inferior |
| Barra inferior | `src/components/BarraInferior.astro` | Inicio · **Súper** · Buscar · Publicar · Mi cuenta |
| Portada provisional | `src/pages/index.astro` | Buscador, franja del Súper, secciones y estado de la conexión con la base |
| `src/lib/horario.js` | | Abierto/cerrado y ciclo del botón, igual que `esta_abierto()` en la base. Suspendido = siempre cerrado |
| `src/lib/whatsapp.js` | | Normaliza a 58XXXXXXXXXX, enlaces wa.me y tel:, regla de iPhone |
| `src/lib/imagen.js` | | Dos versiones por foto (1200 y 400 px), WebP y JPEG en iPhone |
| `src/lib/cliente.js` | | `lokl_cliente_id` anónimo |
| `src/lib/supabase/` | | Clientes para islas, servidor con sesión y páginas públicas cacheadas |
| Service worker | `public/sw.js` | Guarda la app y las fotos vistas; sin señal muestra lo último visto o `/sin-conexion`. Panel y admin nunca se guardan |
| Pruebas | `npm test` | 11 pruebas de horario y WhatsApp, todas pasan |
| Supabase CLI | `supabase/config.toml` | Más la migración nueva de `pg_cron` (caducidad nocturna) |

## Peso medido

| | Medido | Meta |
|---|---|---|
| JavaScript de una página pública | **0 KB** (más ~200 bytes en línea para el service worker) | < 70 KB ✅ |
| Página "sin conexión" completa | 2,2 KB comprimida | — ✅ |
| Portada (HTML + CSS dentro) | ~4,5 KB comprimida | — ✅ |
| Isla de Preact, cuando una pantalla la use | ~10 KB | < 50 KB ✅ |
| Fuentes | 0 KB | 0 KB ✅ |

## Lo que te toca a ti: Supabase

1. **Buscar la cuenta vieja** en [supabase.com/dashboard](https://supabase.com/dashboard). La app vieja usa el proyecto `cdiuboyklymirssxperd`, así que esa cuenta existe. Prueba, en este orden:
   - "Continue with GitHub" con la cuenta de GitHub de Lokl (`mimercadosanfdo`).
   - "Continue with Google" o "olvidé mi contraseña" con los correos que hayas usado para Lokl.
2. **Si no aparece, crea una cuenta nueva: sirve igual.** La base nueva empieza vacía, y la app vieja sigue funcionando en su cuenta hasta el día del cambio. Recomendaciones:
   - Créala con un correo **de Lokl o de la organización**, no personal, para que no dependa de una sola persona.
   - Activa la verificación en dos pasos.
3. Crea el proyecto: nombre `lokl`, región **East US (North Virginia)**. Guarda la contraseña de la base en un lugar seguro.
4. En el proyecto: *Project Settings → API*. Copia la **Project URL** y la **publishable key**.
5. En la carpeta del proyecto, copia `.env.example` como `.env` y pega esos dos valores.
6. Las variables para Cloudflare se cargan al conectar el repositorio (ver "Cloudflare" abajo).
7. En la terminal de la carpeta `lokl`:
   ```
   npx supabase login
   npx supabase link --project-ref EL_ID_DEL_PROYECTO
   npx supabase db push
   ```
   El ID del proyecto es la parte de la URL antes de `.supabase.co`.

**Ojo con el plan gratis:** permite 2 proyectos activos por cuenta y **pausa un proyecto tras 7 días sin uso**. Se reactiva con un clic desde el panel. Cuando Lokl esté en uso diario no pasa.

Cuando la portada diga "Base de datos conectada", el Módulo 1 está terminado y se pasa al Módulo 2 (zonas y categorías de Apure).

## Avance (8/11/2026)

- ✅ Cuenta Supabase nueva (`usalokl.app@gmail.com`) y proyecto `qzhfvsornkoakdeubstv` (región us-east-2).
- ✅ `.env` configurado (no se sube a GitHub).
- ✅ Esquema aplicado **desde el SQL Editor**, porque `supabase db push` no logró conectarse a la base desde esta red ("Connection timed out" / "terminated unexpectedly"). Verificado: tablas creadas, buscador y tarea nocturna funcionando.
- ⏳ El historial de migraciones de la CLI no sabe que ya se aplicaron. Cuando la conexión funcione (otra red o sin Cloudflare WARP), correr una vez:
  `npx.cmd supabase migration repair --status applied 20261108000000 20261108000100 --linked`
- ✅ Cloudflare (`usalokl.app@gmail.com`): proyecto `lokl` conectado a `irmaguerra/mimercado`, rama de producción `rediseno-modular`. Publicado en https://lokl.usalokl-app.workers.dev (portada 3,2 KB comprimida, 0 JS, base conectada).
- Nota: en Windows PowerShell usar `npx.cmd` en vez de `npx`.

## Cloudflare (decisión #9)

El plan gratis de Vercel no permite uso comercial (Lokl Súper vende). Cloudflare sí lo permite en su plan gratis, sin cobro por tráfico de archivos estáticos.

- La app vieja **sigue en Vercel** con usalokl.com hasta el Módulo 12.
- La versión nueva se publica en Cloudflare Workers con una dirección de prueba (`lokl.<tu-subdominio>.workers.dev`), y cada rama tiene su vista previa.
- Probado en local con el motor de Cloudflare (`npx astro preview`): portada conectada a la base, caché de 60 s, página sin conexión y encabezados correctos.
- Nota: la caché de páginas de Cloudflare solo actúa con el dominio propio; en la dirección de prueba `workers.dev` cada visita consulta la base (no importa mientras se prueba).
- Variables de compilación en Cloudflare: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `PUBLIC_APP_URL`.
