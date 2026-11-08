# Lokl — instrucciones para Claude

Lokl ordena lo que se vende y se ofrece en cada zona (hoy San Fernando de Apure, Venezuela), en vez de perderse en los grupos de WhatsApp. Todo contacto termina en WhatsApp. Gratis para vendedores y clientes; el único negocio propio es **Lokl Súper**.

Visión, decisiones aprobadas y plan por módulos: `docs/propuesta-arquitectura.md`. Avance de cada módulo: `docs/modulo-*.md`.

## Cómo trabajar con Irma (dueña del proyecto)

- Responder **en español**, claro y sin jerga; explicar los pasos de pantalla clic por clic.
- **Un módulo a la vez**: cada módulo termina publicado, medido y con su visto bueno antes de seguir.
- Las decisiones de producto son de ella: proponer con una recomendación y esperar aprobación. Anotar lo aprobado en la tabla "Decisiones" de la propuesta.
- No inventar datos locales (sectores, nombres, precios): pedirlos o dejarlos para que los propongan los vendedores.

## Reglas del proyecto

- Rama de trabajo: `rediseno-modular`. **No tocar `main`** ni usalokl.com (app vieja en Vercel) hasta el Módulo 12.
- Cada push a `rediseno-modular` se publica solo en https://lokl.usalokl-app.workers.dev (Cloudflare Workers).
- **SQL para Supabase**: todo script que Irma pega en el SQL Editor se guarda numerado en `sql/` (`03-...sql`, `04-...sql`) y se registra en `sql/README.md`. Un archivo ya ejecutado no se modifica: se crea el siguiente. La fuente para la CLI sigue en `supabase/migrations/` y `supabase/seed.sql`.
- `npx supabase db push` no conecta desde su red: los cambios de base se aplican pegando el archivo de `sql/` en el SQL Editor.
- En Windows PowerShell usar `npx.cmd` / `npm.cmd` (la política de scripts bloquea `npx`).
- Nunca subir `.env` ni pedir la contraseña de la base o la `service_role` key.

## Prioridad técnica: gastar pocos datos móviles

- **Astro 7 + islas de Preact.** Páginas públicas = HTML sin JavaScript. Solo lo interactivo (panel, carrito, publicar) lleva una isla Preact en `src/components/islas/`.
- Sin librerías nuevas sin una buena razón (nada de gráficos, mapas ni fuentes externas). Íconos SVG propios en línea (`npm run iconos`).
- Páginas públicas cacheadas con `Astro.cache.set(PUBLICA)` (`src/lib/cache.js`); panel/admin/entrar nunca.
- Medir el peso de cada página nueva y reportarlo.

## Lógica que no se rompe

- Abierto/cerrado: `src/lib/horario.js` y la función SQL `esta_abierto()` deben dar siempre lo mismo (tienen pruebas). Suspendido = siempre cerrado.
- WhatsApp: números `58XXXXXXXXXX`; en iPhone abrir con `window.location.href`, nunca `window.open`.
- Cliente anónimo con `lokl_cliente_id` en el teléfono, sin cuenta.
- Markup solo en el Súper; los precios de vendedores se muestran exactos. Costos y aliados del Súper nunca llegan al cliente.
- La ubicación **ordena, no esconde**: alguien de otro estado también ve lo de Apure.

## Comandos

| | |
|---|---|
| `npm run dev` | App en http://localhost:4321 |
| `npm test` | Pruebas (`src/lib/**/*.test.js`) |
| `npm run build` y `npx astro preview` | Compilar y probar con el motor de Cloudflare |
