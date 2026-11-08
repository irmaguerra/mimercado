# Lokl

Lo que se vende y se ofrece en cada zona, ordenado y fácil de encontrar. Todo termina en WhatsApp.

- **Herramientas:** Astro 7 + islas de Preact · Supabase · Cloudflare Workers
- **Propuesta y decisiones:** `docs/propuesta-arquitectura.md`
- **Avance por módulo:** `docs/modulo-*.md`
- **Identidad visual:** `identidad/`

## Trabajar en el proyecto

En Windows PowerShell usa `npm.cmd` / `npx.cmd` en vez de `npm` / `npx`.

| Comando | Qué hace |
|---|---|
| `npm install` | Instala lo necesario (una vez) |
| `npm run dev` | Abre la app en http://localhost:4321 |
| `npm test` | Corre las pruebas |
| `npm run build` | Compila para Cloudflare |
| `npx astro preview` | Prueba lo compilado con el motor de Cloudflare |
| `npm run iconos` | Regenera los íconos después de agregar uno en `identidad/iconos/` |

Antes de empezar, copia `.env.example` como `.env` y llena los valores del proyecto Supabase.

## Publicación

Cada cambio que se sube a la rama `rediseno-modular` se publica solo en Cloudflare.
La app anterior (rama `main`) sigue en usalokl.com hasta el lanzamiento.
