// Lokl con Astro en Cloudflare Workers.
// Las páginas públicas salen como HTML puro (0 KB de JavaScript).
// Solo las partes interactivas (panel, carrito, formularios) llevan una "isla" de Preact.
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import preact from "@astrojs/preact";

export default defineConfig({
  site: process.env.PUBLIC_APP_URL || "https://usalokl.com",
  output: "server",
  adapter: cloudflare({ imageService: "passthrough" }), // las fotos ya llegan comprimidas desde el teléfono
  // Caché en la red de Cloudflare: cada página pública decide su tiempo con Astro.cache.set()
  // (ver src/lib/cache.js). Panel, admin y entrar nunca se cachean.
  cache: { provider: cacheCloudflare() },
  integrations: [preact()],
  trailingSlash: "never",
  build: { inlineStylesheets: "always", format: "file" }, // CSS dentro del HTML; /pagina sin barra final
  prefetch: false, // no gastar datos adivinando a dónde va la persona
});
