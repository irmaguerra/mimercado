// Moderación (Módulo 6): reportes de la gente, acciones del admin y verificaciones.
// En Lokl todo se publica al instante; esto es el control posterior.

/** Motivos para reportar (decisión 16). La clave es la que guarda la base. */
export const MOTIVOS_REPORTE = {
  estafa: "Es una estafa o engaño",
  prohibido: "Vende algo prohibido",
  ofensivo: "Es ofensivo",
  no_existe: "Ya no existe o el número no contesta",
  otro: "Otro",
};

/** Cómo se verificó una tienda ("Verificado por Lokl"). */
export const METODOS_VERIFICACION = {
  visita: "Visita en persona",
  documentos: "Documentos",
  videollamada: "Videollamada",
  referencia: "Referencia de alguien de confianza",
};

/** WhatsApp de Lokl para pedir el sello y borrar datos (decisión 80; hoy es el mismo del Súper). */
export const WHATSAPP_LOKL = "584243232671";

/** Mensaje para pedir el sello Verificado (gratis, decisión 80). Sin slug, la persona completa su enlace. */
export function mensajePedirSello(slug) {
  return `Hola Lokl, quiero el sello Verificado para mi tienda: usalokl.com/${slug || ""}`;
}

/** Acciones de la bitácora, en palabras ("Aprobó la opinión…"). */
export const ACCIONES = {
  aprobar: "Aprobó",
  ocultar: "Ocultó",
  descartar: "Descartó los reportes de",
  suspender: "Suspendió",
  reactivar: "Reactivó",
  verificar: "Verificó",
  quitar_verificacion: "Quitó el sello de",
};

/** Palabras prohibidas: "bloquear" no deja publicar; "revisar" espera al admin (decisión 19). */
export const ACCION_PALABRA = {
  bloquear: "Bloquear: no deja publicar",
  revisar: "Revisar: espera a que la apruebes",
};

/** Una palabra válida para el filtro: letras, números y espacios (2 a 40). Devuelve null si no sirve. */
export function limpiarPalabra(texto) {
  const p = String(texto ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  return /^[\p{L}\p{N} ]{2,40}$/u.test(p) ? p : null;
}

/** Cuenta los motivos: ["estafa","estafa","otro"] → "Es una estafa o engaño (2) · Otro". */
export function resumirMotivos(motivos = []) {
  const cuenta = new Map();
  for (const m of motivos) cuenta.set(m, (cuenta.get(m) ?? 0) + 1);
  return [...cuenta.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([m, n]) => `${MOTIVOS_REPORTE[m] ?? m}${n > 1 ? ` (${n})` : ""}`)
    .join(" · ");
}

/** ¿El error de la base es por una palabra bloqueada? */
export const esPalabraBloqueada = (e) => /no permitida/i.test(e?.message || "");
export const MENSAJE_PALABRA = "Tu texto tiene una palabra que no está permitida en Lokl. Cámbiala para poder guardar.";

// El id del cliente anónimo vive en cliente-cookie.js (también lo usan favoritos y reseñas).
export { COOKIE_CLIENTE, clienteDeCookie } from "./cliente-cookie.js";
