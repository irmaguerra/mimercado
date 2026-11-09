// Precios de los vendedores: se muestran EXACTOS, en la moneda que eligió (sin conversiones).

/**
 * Lee lo que escribe el vendedor: "5", "5,50", "5.50", "1.200", "1.200,50", "$ 12".
 * Devuelve un número con 2 decimales, null si lo dejó vacío, o NaN si no se entiende.
 */
export function leerPrecio(texto) {
  let t = String(texto ?? "").replace(/[^\d.,]/g, "");
  if (!t) return null;
  const ultimaComa = t.lastIndexOf(","), ultimoPunto = t.lastIndexOf(".");
  const sep = Math.max(ultimaComa, ultimoPunto);
  if (sep >= 0) {
    const decimales = t.slice(sep + 1);
    const entero = t.slice(0, sep).replace(/[.,]/g, "");
    // "1.200" o "1,200" (3 cifras después de un solo separador) es miles, no decimales
    const unSoloSeparador = (t.match(/[.,]/g) || []).length === 1;
    t = unSoloSeparador && decimales.length === 3 ? entero + decimales : `${entero}.${decimales}`;
  }
  const n = Math.round(Number(t) * 100) / 100;
  return Number.isFinite(n) && n >= 0 && n < 1e10 ? n : NaN;
}

const FORMATO = new Intl.NumberFormat("es-VE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** "$5", "$5,50", "Bs 1.200" — o null si no tiene precio. */
export function mostrarPrecio(precio, moneda = "USD") {
  if (precio === null || precio === undefined || precio === "") return null;
  const n = Number(precio);
  if (!Number.isFinite(n)) return null;
  let txt = FORMATO.format(n);
  if (/,\d$/.test(txt)) txt += "0"; // 5,5 → 5,50
  return moneda === "VES" ? `Bs ${txt}` : `$${txt}`;
}

/** Para volver a llenar el campo al editar: 5.5 → "5,50". */
export function precioParaCampo(precio) {
  if (precio === null || precio === undefined) return "";
  const n = Number(precio);
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
}
