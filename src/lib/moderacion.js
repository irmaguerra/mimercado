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

/** Acciones de la bitácora, en palabras. */
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

// ---------------------------------------------------------------------
// Cliente anónimo en las páginas sin JavaScript: el mismo id en una cookie
// (solo la lee el servidor). Sirve para que cada teléfono reporte una vez.
// ---------------------------------------------------------------------
export const COOKIE_CLIENTE = "lokl_cliente";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function clienteDeCookie(cookies) {
  const actual = cookies.get(COOKIE_CLIENTE)?.value;
  if (actual && UUID.test(actual)) return actual;
  const nuevo = crypto.randomUUID();
  cookies.set(COOKIE_CLIENTE, nuevo, { path: "/", maxAge: 60 * 60 * 24 * 365 * 2, sameSite: "lax", secure: true, httpOnly: true });
  return nuevo;
}
