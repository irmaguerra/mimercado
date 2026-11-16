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

// ───────── Pedidos (Módulo 10B) ─────────

/** Formas de pago del Súper: solo digitales (decisión 56). */
export const PAGOS_SUPER = { pago_movil: "Pago móvil", transferencia: "Transferencia", zelle: "Zelle", binance: "Binance" };

/** Si falta un producto (decisión 56). */
export const SI_FALTA = { escribeme: "Escríbeme y decidimos", parecido: "Cámbialo por uno parecido", quitar: "Quítalo del pedido" };

/** Estados del pedido, en orden, con el siguiente paso para el tablero. */
export const ESTADOS_PEDIDO = {
  nuevo: { texto: "Nuevo", siguiente: "confirmado", boton: "Confirmar" },
  confirmado: { texto: "Confirmado", siguiente: "comprando", boton: "Comprando" },
  comprando: { texto: "Comprando", siguiente: "en_camino", boton: "Salió en camino" },
  en_camino: { texto: "En camino", siguiente: "entregado", boton: "Entregado" },
  entregado: { texto: "Entregado", siguiente: null },
  cancelado: { texto: "Cancelado", siguiente: null },
};

/** "07:30" → "7:30 am"; "20:00" → "8:00 pm". */
export function hora12(hhmm) {
  const [h, m] = String(hhmm || "0:00").split(":").map(Number);
  const sufijo = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m || 0).padStart(2, "0")} ${sufijo}`;
}

/**
 * ¿Atiende ahora? Misma regla que super_atendiendo() en la base: abre <= hora < cierra (hora de Venezuela).
 * Devuelve { abierto, texto }.
 */
export function horarioSuper(horario, ahora = new Date()) {
  const h = { abre: "07:30", cierra: "20:00", ...(horario || {}) };
  const partes = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Caracas", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(ahora);
  const abierto = h.abre <= partes && partes < h.cierra;
  return {
    abierto,
    texto: abierto ? `Abierto · Recibimos pedidos hasta las ${hora12(h.cierra)}` : `Cerrado ahora · Abrimos a las ${hora12(h.abre)}`,
  };
}

/** Carrito en la dirección: "12x2.15x1" ⇄ [{ id: 12, cantidad: 2 }, { id: 15, cantidad: 1 }]. */
export function leerCarrito(texto) {
  const items = new Map();
  for (const parte of String(texto || "").split(".").slice(0, 100)) {
    const m = /^(\d{1,9})x(\d{1,2})$/.exec(parte);
    if (!m) continue;
    const id = Number(m[1]), cantidad = Math.min(Number(m[2]), 50);
    if (id > 0 && cantidad > 0) items.set(id, Math.min((items.get(id) || 0) + cantidad, 50));
  }
  return [...items].map(([id, cantidad]) => ({ id, cantidad }));
}
export function carritoATexto(items) {
  return items.filter((i) => i.cantidad > 0).map((i) => `${i.id}x${Math.min(i.cantidad, 50)}`).join(".");
}

/** Mensaje de WhatsApp del pedido (decisión 57). */
export function mensajePedido(p) {
  const l = [`🛒 Pedido Lokl Súper #${p.id}`];
  for (const it of p.items || []) {
    l.push(`${it.cantidad} × ${[it.nombre, it.marca, it.presentacion].filter(Boolean).join(" ")} — ${mostrarPrecio(it.total)}`);
  }
  const envio = p.envio === null || p.envio === undefined ? "por confirmar" : Number(p.envio) === 0 ? "gratis" : mostrarPrecio(p.envio);
  let totales = `Subtotal: ${mostrarPrecio(p.subtotal)} · Envío: ${envio}`;
  if (p.total !== null && p.total !== undefined) {
    const bs = precioBs(p.total, p.tasa_bs);
    totales += ` · Total: ${mostrarPrecio(p.total)}${bs !== null ? ` (${mostrarPrecio(bs, "VES")})` : ""}`;
  }
  l.push(totales);
  l.push(`📍 ${p.en_casco ? "Casco central" : "Otra zona"} · ${p.sector} · ${p.direccion}`);
  l.push(`💳 ${PAGOS_SUPER[p.forma_pago] ?? p.forma_pago} · Si falta algo: ${(SI_FALTA[p.si_falta] ?? SI_FALTA.escribeme).toLowerCase()}`);
  if (p.nota) l.push(`📝 ${p.nota}`);
  l.push(`👤 ${p.nombre}`);
  return l.join("\n");
}
