// Publicar sin señal (decisión 38): si no hay conexión al tocar "Publicar", el formulario
// (con las fotos ya comprimidas) se guarda en el teléfono y se envía solo cuando vuelve la señal:
//  - en esta misma pantalla, apenas vuelve la conexión;
//  - o la próxima vez que la persona abra Lokl con señal (lo hace el service worker, public/sw.js).
// Mismo formato que lee public/sw.js: { id, url, titulo, campos: [[clave, valor]], creado, error? }
// donde valor es texto o { blob, nombre, tipo } para las fotos.

const BD = "lokl-cola";
const ALMACEN = "envios";

function abrir() {
  return new Promise((ok, mal) => {
    const r = indexedDB.open(BD, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(ALMACEN, { keyPath: "id", autoIncrement: true });
    r.onsuccess = () => ok(r.result);
    r.onerror = () => mal(r.error);
  });
}

async function operar(modo, fn) {
  const db = await abrir();
  return new Promise((ok, mal) => {
    const t = db.transaction(ALMACEN, modo);
    const resultado = fn(t.objectStore(ALMACEN));
    t.oncomplete = () => ok(resultado?.result ?? resultado);
    t.onerror = () => mal(t.error);
  });
}

/** Guarda un formulario para enviarlo cuando haya señal. */
export async function guardarEnCola(url, datos, titulo = "") {
  const campos = [];
  for (const [k, v] of datos.entries()) {
    campos.push([k, typeof v === "string" ? v : { blob: v, nombre: v.name || "foto", tipo: v.type }]);
  }
  await operar("readwrite", (s) => s.add({ url, titulo, campos, creado: Date.now() }));
}

export async function pendientes() {
  return operar("readonly", (s) => s.getAll());
}

export async function descartar(id) {
  await operar("readwrite", (s) => s.delete(id));
}

/** Intenta enviar todo lo guardado. Devuelve cuántos se enviaron. */
export async function enviarPendientes() {
  let enviados = 0;
  for (const item of await pendientes()) {
    const r = await enviarUno(item);
    if (r === "enviado") enviados++;
  }
  return enviados;
}

async function enviarUno(item) {
  const datos = new FormData();
  for (const [k, v] of item.campos) {
    datos.append(k, typeof v === "string" ? v : new File([v.blob], v.nombre, { type: v.tipo }));
  }
  let resp;
  try {
    resp = await fetch(item.url, { method: "POST", body: datos, headers: { accept: "application/json" }, credentials: "same-origin" });
  } catch {
    return "sin_senal"; // sigue en la cola
  }
  const esJson = (resp.headers.get("content-type") || "").includes("application/json");
  if (!esJson) {
    // Probablemente se cerró la sesión: se guarda el aviso y se reintenta después
    await operar("readwrite", (s) => s.put({ ...item, error: "Entra a tu cuenta para que se publique." }));
    return "sesion";
  }
  const j = await resp.json().catch(() => ({}));
  if (j.ok || j.ir) { await descartar(item.id); return "enviado"; } // j.ir: se creó aunque falló una foto
  await operar("readwrite", (s) => s.put({ ...item, error: j.mensaje || "No se pudo publicar.", final: true }));
  return "error";
}
