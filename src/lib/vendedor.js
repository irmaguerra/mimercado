// Datos y textos compartidos de la tienda del vendedor.

/** Paso "¿Qué haces?": cada opción define la sección principal y el tipo de cuenta. */
export const QUE_HACES = {
  tiendas:      { texto: "Vendo productos",              detalle: "Ropa, víveres, repuestos…",       icono: "tiendas",      tipo: "negocio" },
  comida:       { texto: "Vendo comida",                 detalle: "Restaurante, puesto o desde casa", icono: "comida",       tipo: "negocio" },
  servicios:    { texto: "Ofrezco un servicio",          detalle: "Oficios, salud, transporte…",     icono: "servicios",    tipo: "servicio" },
  al_mayor:     { texto: "Produzco al mayor",            detalle: "Queso, ganado, pescado, cosecha", icono: "al-mayor",     tipo: "productor" },
  clasificados: { texto: "Solo quiero vender algo",      detalle: "Una venta de una vez",            icono: "clasificados", tipo: "persona" },
};

export const MODALIDAD_COCINA = {
  restaurante:   "Restaurante o local",
  puesto:        "Puesto o food truck",
  desde_casa:    "Cocino desde casa",
  cocina_oculta: "Solo delivery (cocina oculta)",
};

export const ALCANCE_ENVIO = {
  zona:      "Solo en mi zona",
  municipio: "En todo mi municipio",
  estado:    "En todo mi estado",
  nacional:  "A todo el país (por encomienda)",
};

/** Zonas activas agrupadas por "Municipio, Estado" para un <select> con <optgroup>. */
export async function zonasAgrupadas(sb) {
  const { data } = await sb
    .from("zonas")
    .select("id, nombre, activa, municipios!inner(id, nombre, estados!inner(nombre))")
    .order("nombre");
  const grupos = new Map();
  for (const z of data ?? []) {
    const clave = `${z.municipios.nombre}, ${z.municipios.estados.nombre}`;
    if (!grupos.has(clave)) grupos.set(clave, { municipioId: z.municipios.id, zonas: [] });
    grupos.get(clave).zonas.push(z);
  }
  return [...grupos.entries()].sort(([a], [b]) => a.localeCompare(b, "es"));
}

/** Municipios (para proponer una zona nueva). */
export async function municipiosParaProponer(sb) {
  const { data } = await sb.from("municipios").select("id, nombre, estados!inner(nombre)").order("nombre");
  return data ?? [];
}

/**
 * Resuelve la zona elegida en un formulario: una existente (zona_id) o una propuesta nueva
 * ("No está mi zona"), que queda pendiente de revisión. Devuelve { zonaId } o { error }.
 */
export async function resolverZona(sb, usuarioId, f) {
  const zonaId = Number(f.get("zona_id"));
  const nueva = String(f.get("zona_nueva") || "").trim();
  if (zonaId > 0 && !nueva) return { zonaId };
  if (!nueva) return { error: "Elige tu zona o escribe el nombre de tu sector." };
  const municipioId = Number(f.get("municipio_id"));
  if (!(municipioId > 0)) return { error: "Elige el municipio de tu sector." };
  const { crearSlug } = await import("./slug.js");
  const slug = crearSlug(nueva) || `zona-${Date.now().toString(36)}`;
  const { data, error } = await sb
    .from("zonas")
    .insert({ municipio_id: municipioId, nombre: nueva.slice(0, 60), slug, activa: false, propuesta_por: usuarioId })
    .select("id")
    .single();
  if (error) {
    // Si ya existía con ese nombre, usar esa
    const { data: existente } = await sb.from("zonas").select("id").eq("municipio_id", municipioId).eq("slug", slug).maybeSingle();
    if (existente) return { zonaId: existente.id };
    return { error: "No pudimos guardar tu zona. Intenta de nuevo." };
  }
  return { zonaId: data.id };
}
