// Service worker de Lokl (hecho a mano, sin librerías). Objetivo: gastar menos datos.
//  - Archivos de la app (/_astro, íconos): se guardan para siempre (cambian de nombre en cada versión).
//  - Fotos de Supabase Storage: se guardan al verlas (máximo 300).
//  - Páginas públicas: red primero con límite de 4 s; si no hay señal, la última copia guardada.
//  - Panel, admin y entrar: nunca se guardan (datos privados).
const VERSION = "lokl-v1";
const ESTATICO = `${VERSION}-estatico`;
const FOTOS = `${VERSION}-fotos`;
const PAGINAS = `${VERSION}-paginas`;
const MAX_FOTOS = 300;
const MAX_PAGINAS = 60;
const PRIVADAS = ["/panel", "/admin", "/entrar", "/auth", "/api"];
const PRECARGA = ["/sin-conexion", "/favicon.svg", "/icon-192.png", "/manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(ESTATICO).then((c) => c.addAll(PRECARGA)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function recortar(nombre, max) {
  const cache = await caches.open(nombre);
  const claves = await cache.keys();
  for (let i = 0; i < claves.length - max; i++) await cache.delete(claves[i]);
}

async function primeroGuardado(req, nombre, max) {
  const cache = await caches.open(nombre);
  const guardado = await cache.match(req);
  if (guardado) return guardado;
  const resp = await fetch(req);
  if (resp.ok || resp.type === "opaque") {
    cache.put(req, resp.clone());
    if (max) recortar(nombre, max);
  }
  return resp;
}

async function primeroRed(req) {
  const cache = await caches.open(PAGINAS);
  try {
    const resp = await Promise.race([
      fetch(req),
      new Promise((_, rechazar) => setTimeout(() => rechazar(new Error("lento")), 4000)),
    ]);
    if (resp.ok) {
      cache.put(req, resp.clone());
      recortar(PAGINAS, MAX_PAGINAS);
    }
    return resp;
  } catch {
    return (await cache.match(req)) || (await caches.match("/sin-conexion")) || Response.error();
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Fotos públicas de Supabase Storage
  if (url.pathname.includes("/storage/v1/object/public/")) {
    e.respondWith(primeroGuardado(req, FOTOS, MAX_FOTOS));
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_astro/") || url.pathname.startsWith("/iconos/")) {
    e.respondWith(primeroGuardado(req, ESTATICO));
    return;
  }

  if (req.mode === "navigate" && !PRIVADAS.some((p) => url.pathname.startsWith(p))) {
    e.respondWith(primeroRed(req));
  }
});
