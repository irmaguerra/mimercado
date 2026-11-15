// Service worker de Lokl (hecho a mano, sin librerías). Objetivo: gastar menos datos.
//  - Archivos de la app (/_astro, íconos): se guardan para siempre (cambian de nombre en cada versión).
//  - Fotos de Supabase Storage: se guardan al verlas (máximo 300).
//  - Páginas públicas: red primero con límite de 4 s; si no hay señal, la última copia guardada.
//  - Panel, admin y entrar: nunca se guardan (datos privados).
//  - Publicar sin señal: lo que quedó guardado en el teléfono (src/lib/cola-envios.js) se envía
//    la próxima vez que la persona abre cualquier página de Lokl con señal.
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

// ---- Cola de "publicar sin señal" (mismo formato que src/lib/cola-envios.js) ----
const COLA_BD = "lokl-cola";
const COLA = "envios";
let ultimoIntento = 0;

function abrirCola() {
  return new Promise((ok, mal) => {
    const r = indexedDB.open(COLA_BD, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(COLA, { keyPath: "id", autoIncrement: true });
    r.onsuccess = () => ok(r.result);
    r.onerror = () => mal(r.error);
  });
}
function operarCola(db, modo, fn) {
  return new Promise((ok, mal) => {
    const t = db.transaction(COLA, modo);
    const r = fn(t.objectStore(COLA));
    t.oncomplete = () => ok(r && r.result);
    t.onerror = () => mal(t.error);
  });
}

async function enviarCola() {
  const ahora = Date.now();
  if (ahora - ultimoIntento < 30000) return; // como mucho cada 30 s
  ultimoIntento = ahora;
  const db = await abrirCola();
  const items = await operarCola(db, "readonly", (s) => s.getAll());
  for (const item of items || []) {
    if (item.final) continue; // tuvo un error que la persona debe ver y corregir
    const datos = new FormData();
    for (const [k, v] of item.campos) datos.append(k, typeof v === "string" ? v : new File([v.blob], v.nombre, { type: v.tipo }));
    let resp;
    try {
      resp = await fetch(item.url, { method: "POST", body: datos, headers: { accept: "application/json" }, credentials: "same-origin" });
    } catch {
      return; // sigue sin señal: se intenta en la próxima visita
    }
    const esJson = (resp.headers.get("content-type") || "").includes("application/json");
    if (!esJson) { await operarCola(db, "readwrite", (s) => s.put({ ...item, error: "Entra a tu cuenta para que se publique." })); continue; }
    const j = await resp.json().catch(() => ({}));
    if (j.ok || j.ir) await operarCola(db, "readwrite", (s) => s.delete(item.id));
    else await operarCola(db, "readwrite", (s) => s.put({ ...item, error: j.mensaje || "No se pudo publicar.", final: true }));
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (req.mode === "navigate" && url.origin === self.location.origin) e.waitUntil(enviarCola().catch(() => {}));

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
