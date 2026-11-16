// Pedir presupuesto a varios (Módulo 11, decisiones 64 a 73).
import { mostrarPrecio } from "./precio.js";
import { SECCIONES, arbolCategorias } from "./listados.js";

/** Hasta cuántos negocios recibe cada pedido (igual que en la base). */
export const MAX_DESTINATARIOS = 8;
/** Pedidos por día por teléfono (igual que en la base). */
export const MAX_POR_DIA = 3;
/** Secciones que reciben pedidos: Clasificados no (decisión 66). */
export const SECCIONES_PRESUPUESTO = ["tiendas", "comida", "al_mayor", "servicios"];
/** Peso máximo de la foto que llega al servidor (el teléfono la achica antes). */
export const MAX_FOTO = 2 * 1024 * 1024;
export const TIPOS_FOTO = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const esIdPresupuesto = (v) => UUID.test(String(v || ""));

/** Mensajes de la base que se le pueden mostrar tal cual a la persona. */
export const MENSAJE_PARA_MOSTRAR = /^(Escribe|Elige|Hiciste|Tu pedido|Tu mensaje|Ese pedido|El mensaje)/;

/**
 * Categorías para el selector, agrupadas por sección y en árbol:
 * [{ nombre: "Servicios", opciones: [{ id, nombre, sub: false }, { id, nombre: "Moto taxi", sub: true }] }]
 */
export function gruposCategorias(filas = []) {
  return SECCIONES.filter((s) => SECCIONES_PRESUPUESTO.includes(s.clave))
    .map((s) => ({
      nombre: s.nombre,
      opciones: arbolCategorias(filas.filter((c) => c.seccion === s.clave)).flatMap((c) => [
        { id: c.id, nombre: c.nombre, sub: false },
        ...c.hijos.map((h) => ({ id: h.id, nombre: h.nombre, sub: true })),
      ]),
    }))
    .filter((g) => g.opciones.length);
}

/** "$25" o "Desde $25". */
export function textoPrecio(r) {
  if (r?.precio == null) return "";
  const p = mostrarPrecio(r.precio);
  return r.desde ? `Desde ${p}` : p;
}

const recortar = (t, n) => {
  const s = String(t || "").replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
};

/** Mensaje de WhatsApp del cliente al vendedor que eligió (decisión 70). */
export function mensajeRespuesta(pedido, respuesta) {
  return `Hola, vi tu presupuesto de ${textoPrecio(respuesta)} en Lokl para: ${recortar(pedido.descripcion, 120)}`;
}

/** "Vence en 2 días", "Vence hoy", "Venció". */
export function textoVence(venceEn, ahora = Date.now()) {
  const ms = new Date(venceEn).getTime() - ahora;
  if (!(ms > 0)) return "Venció";
  const horas = Math.floor(ms / 3600000);
  if (horas < 24) return horas < 1 ? "Vence en menos de una hora" : `Vence en ${horas} ${horas === 1 ? "hora" : "horas"}`;
  const dias = Math.round(horas / 24);
  return `Vence en ${dias} ${dias === 1 ? "día" : "días"}`;
}

/** "hace 5 min", "hace 3 h", "hace 2 días". */
export function hace(fecha, ahora = Date.now()) {
  const min = Math.max(0, Math.floor((ahora - new Date(fecha).getTime()) / 60000));
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} ${d === 1 ? "día" : "días"}`;
}

/** Cómo se dice el estado del pedido. */
export function textoEstado(p, ahora = Date.now()) {
  if (p.oculto && p.revisar) return "En revisión";
  if (p.oculto) return "Oculto";
  if (p.estado === "cerrado") return "Cerrado";
  if (p.estado === "vencido") return "Venció";
  return textoVence(p.vence_en, ahora);
}

/** Aviso al vendedor cuando le llega un pedido. */
export function avisoVendedor({ id, categoria, descripcion }) {
  return {
    titulo: "Te piden presupuesto",
    cuerpo: `${categoria ? categoria + ": " : ""}${recortar(descripcion, 120)}`,
    url: "/panel/presupuestos",
    tag: `presupuesto-${id}`,
  };
}

/** Aviso al cliente cuando le responden por primera vez. */
export function avisoCliente({ id, tienda, precio, desde }) {
  return {
    titulo: "Te respondieron tu presupuesto",
    cuerpo: `${tienda}: ${textoPrecio({ precio, desde })}. Toca para ver todas las respuestas.`,
    url: `/presupuesto/${id}`,
    tag: `respuestas-${id}`,
  };
}

/** Revisa la foto subida. @returns {{ ext?: string, error?: string }} sin foto: {} */
export function revisarFoto(archivo) {
  if (!archivo || typeof archivo === "string" || !archivo.size) return {};
  const ext = TIPOS_FOTO[archivo.type];
  if (!ext) return { error: "La foto debe ser JPG, PNG o WebP." };
  if (archivo.size > MAX_FOTO) return { error: "La foto pesa mucho. Prueba con otra o envía el pedido sin foto." };
  return { ext };
}
