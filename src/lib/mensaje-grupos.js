// "Mensaje para mis grupos" (decisión 88): el texto del día que el vendedor pega en sus grupos de WhatsApp.
// Un solo mensaje ordenado, con precios y su enlace, en vez de 10 fotos sueltas que se entierran.
import { precioVisible } from "./al-mayor.js";
import { hora12 } from "./super.js";

/** Cuántos productos caben sin que el mensaje se haga largo. */
export const MAX_EN_MENSAJE = 8;

/**
 * @param {object} t  tienda: { nombre, tipo, seccion_principal, a_domicilio, atiende_24h, hora_desde, hora_hasta, descripcion }
 * @param {object[]} productos  publicaciones: { titulo, precio, moneda, precio_mayor, unidad }
 * @param {string} url  enlace de la tienda (https://usalokl.com/slug)
 * @param {string} [zona]  sector de la tienda
 */
export function mensajeParaGrupos(t, productos = [], url, zona = "") {
  const servicio = t.seccion_principal === "servicios";
  const persona = t.tipo === "persona";
  const lineas = [];

  const lista = productos.slice(0, MAX_EN_MENSAJE);
  if (lista.length) {
    lineas.push(persona ? `🛍️ *Vendo*` : `🛍️ *${t.nombre}* — ${servicio ? "te ofrecemos" : "hoy tenemos"}:`);
    for (const p of lista) {
      const precio = precioVisible(p);
      lineas.push(`• ${p.titulo.trim()}${precio ? `: ${precio}` : ""}`);
    }
  } else {
    lineas.push(`🛍️ *${t.nombre}*`);
    if (t.descripcion) lineas.push(t.descripcion.trim().slice(0, 200));
  }

  const datos = [];
  if (zona) datos.push(`📍 ${zona}`);
  if (t.a_domicilio) datos.push(servicio ? "🏠 A domicilio" : "🛵 Delivery");
  if (t.atiende_24h) datos.push("🕗 24 horas");
  else if (t.hora_desde && t.hora_hasta) datos.push(`🕗 ${hora12(String(t.hora_desde).slice(0, 5))} a ${hora12(String(t.hora_hasta).slice(0, 5))}`);
  if (datos.length) lineas.push("", datos.join(" · "));

  lineas.push("", `👉 Mira fotos y precios, y escríbeme: ${url}`, "", "🤝 Uno nos lleva a todos · #Lokéalo");
  return lineas.join("\n");
}
