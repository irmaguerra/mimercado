// Al mayor y precios de origen (Módulo 9).
import { mostrarPrecio } from "./precio.js";

/** Unidades (decisión 34, 14/11/2026). Las mismas claves acepta la base. */
export const UNIDADES = {
  kilo:     { uno: "kilo", varios: "kilos", precio: "el kilo" },
  litro:    { uno: "litro", varios: "litros", precio: "el litro" },
  unidad:   { uno: "unidad", varios: "unidades", precio: "c/u" },
  docena:   { uno: "docena", varios: "docenas", precio: "la docena" },
  cesta:    { uno: "cesta", varios: "cestas", precio: "la cesta" },
  saco:     { uno: "saco o bulto", varios: "sacos o bultos", precio: "el saco" },
  caja:     { uno: "caja", varios: "cajas", precio: "la caja" },
  cabeza:   { uno: "cabeza", varios: "cabezas", precio: "por cabeza" },
  tonelada: { uno: "tonelada", varios: "toneladas", precio: "la tonelada" },
};

/** Días que un precio sale en /precios sin que el productor lo renueve (decisión 36). */
export const DIAS_PRECIO = 30;

/** "$4 el kilo", "Bs 120 c/u"; sin unidad, el precio solo; sin precio, null. */
export function precioPorUnidad(precio, moneda, unidad) {
  const p = mostrarPrecio(precio, moneda);
  if (!p) return null;
  return UNIDADES[unidad] ? `${p} ${UNIDADES[unidad].precio}` : p;
}

const NUM = new Intl.NumberFormat("es-VE", { maximumFractionDigits: 2 });

/** "Mínimo 20 kilos", "Mínimo 1 caja"; null si no hay mínimo. */
export function minimoTexto(cantidad, unidad) {
  const n = Number(cantidad);
  if (!cantidad || !Number.isFinite(n) || n <= 0) return null;
  const u = UNIDADES[unidad];
  return `Mínimo ${NUM.format(n)}${u ? ` ${n === 1 ? u.uno : u.varios}` : ""}`;
}

/** "hoy", "ayer", "hace 3 días", "hace 2 semanas". */
export function haceCuanto(fecha, ahora = new Date()) {
  const dias = Math.floor((ahora - new Date(fecha)) / 864e5);
  if (dias <= 0) return "hoy";
  if (dias === 1) return "ayer";
  if (dias < 14) return `hace ${dias} días`;
  if (dias < 60) return `hace ${Math.floor(dias / 7)} semanas`;
  return `hace ${Math.floor(dias / 30)} meses`;
}

/** ¿Ya no sale en /precios porque pasó el plazo? */
export const precioVencido = (fecha, ahora = new Date()) => ahora - new Date(fecha) > DIAS_PRECIO * 864e5;

/** Lee los campos al mayor de un formulario. Devuelve { datos, error }. */
export function leerAlMayor(f, { categoriasPermitidas = [] } = {}) {
  const unidad = UNIDADES[f.get("unidad")] ? String(f.get("unidad")) : null;
  const minTexto = String(f.get("cantidad_minima") || "").replace(",", ".").trim();
  const cantidad_minima = minTexto ? Number(minTexto) : null;
  const disponibilidad = String(f.get("disponibilidad") || "").trim().slice(0, 100) || null;
  const categoria_id = Number(f.get("categoria_mayor")) || null;
  if (minTexto && !(cantidad_minima > 0 && cantidad_minima < 1e7)) return { error: "Revisa el pedido mínimo: escribe solo el número, por ejemplo 20." };
  if (!categoriasPermitidas.some((c) => c.id === categoria_id)) return { error: "Elige qué tipo de producto es (por ejemplo, Queso y lácteos)." };
  return { datos: { es_al_mayor: true, unidad, cantidad_minima, disponibilidad, categoria_id } };
}
