import { test } from "node:test";
import assert from "node:assert/strict";
import { mensajeParaGrupos, MAX_EN_MENSAJE } from "./mensaje-grupos.js";

const tienda = { nombre: "DORCAS", tipo: "negocio", seccion_principal: "tiendas", a_domicilio: true, hora_desde: "08:00:00", hora_hasta: "20:00:00" };
const url = "https://usalokl.com/dorcas";

test("arma el mensaje con productos, precios, datos y enlace", () => {
  const m = mensajeParaGrupos(tienda, [
    { titulo: "Crema de peinar", precio: 5, moneda: "USD" },
    { titulo: "Aceite perfumado ", precio: 3.5, moneda: "USD" },
    { titulo: "Consulta", precio: null },
  ], url, "Centro");
  assert.match(m, /^🛍️ \*DORCAS\* — hoy tenemos:/);
  assert.match(m, /• Crema de peinar: \$5\n/);
  assert.match(m, /• Aceite perfumado: \$3,50\n/);
  assert.match(m, /• Consulta\n/); // sin precio, sin dos puntos
  assert.match(m, /📍 Centro · 🛵 Delivery · 🕗 8:00 am a 8:00 pm/);
  assert.match(m, /👉 Mira fotos y precios, y escríbeme: https:\/\/usalokl\.com\/dorcas/);
  assert.match(m, /Uno nos lleva a todos/);
});

test("servicios y personas cambian el saludo", () => {
  assert.match(mensajeParaGrupos({ ...tienda, seccion_principal: "servicios", a_domicilio: true }, [{ titulo: "Alisado", precio: 20 }], url), /te ofrecemos:[\s\S]*🏠 A domicilio/);
  assert.match(mensajeParaGrupos({ ...tienda, tipo: "persona" }, [{ titulo: "Nevera", precio: 150 }], url), /^🛍️ \*Vendo\*/);
});

test("sin productos usa la descripción; 24 horas reemplaza el horario", () => {
  const m = mensajeParaGrupos({ ...tienda, atiende_24h: true, descripcion: "Cosmética orgánica" }, [], url);
  assert.match(m, /^🛍️ \*DORCAS\*\nCosmética orgánica/);
  assert.match(m, /🕗 24 horas/);
  assert.doesNotMatch(m, /8:00 am/);
});

test("no pasa del máximo de productos", () => {
  const muchos = Array.from({ length: 20 }, (_, i) => ({ titulo: `Producto ${i}`, precio: i }));
  const m = mensajeParaGrupos(tienda, muchos, url);
  assert.equal((m.match(/^• /gm) || []).length, MAX_EN_MENSAJE);
});
