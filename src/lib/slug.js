// El enlace de cada vendedor: usalokl.com/<slug>
// La base de datos también rechaza los reservados (función slug_reservado), así que no se puede saltar.

/** Palabras que ninguna tienda puede usar porque son páginas de Lokl. Los 24 estados se agregan en la base. */
export const RESERVADOS = new Set([
  "super", "panel", "admin", "buscar", "entrar", "salir", "auth", "ubicacion", "precios",
  "presupuesto", "presupuestos", "favoritos", "mis-pedidos", "conoce", "vende", "verificado",
  "p", "c", "api", "contacto", "sin-conexion", "iconos", "lokl", "usalokl", "ayuda", "soporte",
  "terminos", "privacidad", "404", "favicon", "robots", "sitemap", "manifest", "sw", "www",
]);

/** "Quesera La Macanilla #1" → "quesera-la-macanilla-1" */
export function crearSlug(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos (ñ → n)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
}

export function esSlugValido(slug) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 40 && !RESERVADOS.has(slug);
}

/**
 * Devuelve un slug libre a partir del nombre. `existe(slug)` responde si ya está tomado
 * (o reservado en la base). Prueba "nombre", "nombre-2", "nombre-3"…
 */
export async function slugDisponible(nombre, existe) {
  let base = crearSlug(nombre);
  if (base.length < 3) base = `tienda-${base || "lokl"}`.replace(/-$/, "");
  if (RESERVADOS.has(base)) base = `${base}-tienda`;
  for (let i = 1; i < 50; i++) {
    const candidato = i === 1 ? base : `${base.slice(0, 36)}-${i}`;
    if (!(await existe(candidato))) return candidato;
  }
  return `${base.slice(0, 30)}-${Date.now().toString(36)}`;
}
