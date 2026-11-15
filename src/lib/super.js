// Lokl Súper (Módulo 10): precios en dólares y bolívares, tasa del día y reglas de envío.
// Costos, aliados y márgenes son INTERNOS: nada de esto se calcula en el teléfono del cliente;
// el precio en dólares ya viene calculado de la base (costo × margen).
import { mostrarPrecio } from "./precio.js";

/** Por ahora el Súper atiende solo San Fernando (decisión 51). */
export const MUNICIPIO_SUPER = "san-fernando";

/** Créditos de las fotos tomadas de Open Food Facts (licencia CC BY-SA). */
export const CREDITO_FOTOS = "Fotos de productos: Open Food Facts (CC BY-SA)";

/** Precio en bolívares con la tasa del día; null si no hay tasa. */
export function precioBs(usd, tasa) {
  const t = Number(tasa?.bs ?? tasa);
  const n = Number(usd);
  if (usd === null || usd === undefined || !Number.isFinite(n) || !(t > 0)) return null;
  return Math.round(n * t * 100) / 100;
}

/** "$1,20 · Bs 288,60" (o solo dólares si aún no hay tasa). */
export function precioDoble(usd, tasa) {
  const d = mostrarPrecio(usd);
  if (!d) return null;
  const bs = precioBs(usd, tasa);
  return bs === null ? d : `${d} · ${mostrarPrecio(bs, "VES")}`;
}

/** "Tasa del 15/11: Bs 240,50 por $1" o null. */
export function textoTasa(tasa) {
  if (!(Number(tasa?.bs) > 0)) return null;
  const [a, m, d] = String(tasa.fecha || "").split("-");
  const fecha = d ? ` del ${d}/${m}` : "";
  return `Tasa${fecha}: ${mostrarPrecio(tasa.bs, "VES")} por $1`;
}

/** ¿La tasa es de hoy (hora de Venezuela)? */
export function tasaDeHoy(tasa, ahora = new Date()) {
  if (!tasa?.fecha) return false;
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Caracas" }).format(ahora);
  return tasa.fecha === hoy;
}

/**
 * Envío según decisiones 51 y 52.
 * enCasco: true = casco central; false = otra zona (precio por confirmar).
 * Devuelve { costo: número | null, gratis, porConfirmar, falta (para envío gratis), minimoOk }.
 */
export function calcularEnvio(subtotal, enCasco, reglas) {
  const r = { gratis_desde: 20, tarifa: 1, minimo: 5, ...(reglas || {}) };
  const s = Number(subtotal) || 0;
  const minimoOk = s >= r.minimo;
  if (!enCasco) return { costo: null, gratis: false, porConfirmar: true, falta: null, minimoOk };
  const gratis = s >= r.gratis_desde;
  return {
    costo: gratis ? 0 : r.tarifa,
    gratis,
    porConfirmar: false,
    falta: gratis ? 0 : Math.round((r.gratis_desde - s) * 100) / 100,
    minimoOk,
  };
}

/** id del municipio donde opera el Súper. */
export async function municipioSuper(sb) {
  const { data } = await sb.from("municipios").select("id").eq("slug", MUNICIPIO_SUPER).maybeSingle();
  return data?.id ?? null;
}

/** Tasa, envío y (solo para el admin) margen general. */
export async function configSuper(sb) {
  const { data } = await sb.from("configuracion").select("clave, valor").in("clave", ["super_tasa", "super_envio", "super_margen"]);
  const c = Object.fromEntries((data || []).map((r) => [r.clave, r.valor]));
  return { tasa: c.super_tasa ?? null, envio: c.super_envio ?? null, margen: c.super_margen != null ? Number(c.super_margen) : null };
}

/** Pasillos en orden (columnas públicas). */
export async function pasillosSuper(sb) {
  const { data } = await sb.from("super_pasillos").select("id, nombre, slug, orden").order("orden");
  return data || [];
}
