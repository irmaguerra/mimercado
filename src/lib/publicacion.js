// Publicaciones (productos, platos, servicios, clasificados): datos compartidos.

export const MAX_FOTOS = 3;
export const TIPOS_FOTO = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
export const MAX_PESO_FOTO = 2 * 1024 * 1024; // igual que el límite de la carpeta en Supabase
export const DIAS_CLASIFICADO = 30;

/** Cómo se llama lo que publica cada sección. */
export const NOMBRE_COSA = {
  tiendas: "producto",
  comida: "plato",
  al_mayor: "producto",
  servicios: "servicio",
  clasificados: "anuncio",
};

/** Sección de lo que publica una tienda (la que eligió en "¿Qué haces?"). */
export function seccionDe(t) {
  if (t.seccion_principal) return t.seccion_principal;
  return { servicio: "servicios", productor: "al_mayor", persona: "clasificados" }[t.tipo] ?? "tiendas";
}

/** Primera foto en miniatura (para listas). */
export function miniatura(p) {
  const f = [...(p.publicacion_fotos ?? [])].sort((a, b) => a.orden - b.orden)[0];
  return f?.url_mini ?? null;
}

/** Fotos ordenadas. */
export function fotosOrdenadas(p) {
  return [...(p.publicacion_fotos ?? [])].sort((a, b) => a.orden - b.orden);
}

/** ¿Ya se venció? (solo los clasificados tienen fecha; el resto es 'infinity'). */
export function vencida(p, ahora = new Date()) {
  if (p.estado === "vencida") return true;
  const v = p.vence_en;
  if (!v || v === "infinity") return false;
  return new Date(v) <= ahora;
}

/** Días que le quedan a un clasificado, o null si no vence. */
export function diasRestantes(p, ahora = new Date()) {
  const v = p.vence_en;
  if (!v || v === "infinity") return null;
  return Math.max(0, Math.ceil((new Date(v) - ahora) / 864e5));
}

/** Ruta dentro de la carpeta "vendedores" a partir de la dirección pública de la foto. */
export function rutaEnAlmacen(url) {
  return url?.split("/object/public/vendedores/")[1]?.split("?")[0] ?? null;
}

/** Productos visibles de una tienda: disponibles primero, luego agotados. */
export async function productosDeTienda(sb, vendedorId, limite = 60) {
  const { data, error } = await sb
    .from("publicaciones")
    .select("id, titulo, precio, moneda, agotado, vence_en, estado, publicacion_fotos(url_mini, orden)")
    .eq("vendedor_id", vendedorId)
    .eq("estado", "publicada")
    .gt("vence_en", new Date().toISOString())
    .order("agotado")
    .order("creado_en", { ascending: false })
    .limit(limite);
  if (error) console.error("productosDeTienda", error);
  return data ?? [];
}
