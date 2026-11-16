import { test } from "node:test";
import assert from "node:assert/strict";
import { precioBs, precioDoble, textoTasa, tasaDeHoy, calcularEnvio } from "./super.js";

test("precio en bolívares con la tasa del día", () => {
  assert.equal(precioBs(1.2, { bs: 240.5 }), 288.6);
  assert.equal(precioBs(1.2, { bs: null }), null);
  assert.equal(precioBs(null, { bs: 240 }), null);
  assert.equal(precioDoble(1.2, { bs: 240.5 }), "$1,20 · Bs 288,60");
  assert.equal(precioDoble(1.2, null), "$1,20");
});

test("texto de la tasa", () => {
  assert.equal(textoTasa({ bs: 240.5, fecha: "2026-11-15" }), "Tasa del 15/11: Bs 240,50 por $1");
  assert.equal(textoTasa({ bs: null }), null);
  assert.equal(tasaDeHoy({ fecha: "2026-11-15" }, new Date("2026-11-15T15:00:00Z")), true);
  assert.equal(tasaDeHoy({ fecha: "2026-11-14" }, new Date("2026-11-15T15:00:00Z")), false);
});

test("envío: casco central gratis desde $20, si no $1; fuera, por confirmar", () => {
  const r = { gratis_desde: 20, tarifa: 1, minimo: 5 };
  assert.deepEqual(calcularEnvio(12, true, r), { costo: 1, gratis: false, porConfirmar: false, falta: 8, minimoOk: true });
  assert.equal(calcularEnvio(20, true, r).gratis, true);
  assert.equal(calcularEnvio(20, true, r).costo, 0);
  assert.equal(calcularEnvio(4, true, r).minimoOk, false);
  assert.equal(calcularEnvio(30, false, r).porConfirmar, true);
  assert.equal(calcularEnvio(30, false, r).costo, null);
});

import { hora12, horarioSuper, leerCarrito, carritoATexto, mensajePedido } from "./super.js";

test("horario del Súper: 7:30 am a 8:00 pm, hora de Venezuela (igual que super_atendiendo)", () => {
  assert.equal(hora12("07:30"), "7:30 am");
  assert.equal(hora12("20:00"), "8:00 pm");
  assert.equal(hora12("12:00"), "12:00 pm");
  const h = { abre: "07:30", cierra: "20:00" };
  assert.equal(horarioSuper(h, new Date("2026-11-15T16:00:00Z")).abierto, true);   // 12:00 Caracas
  assert.equal(horarioSuper(h, new Date("2026-11-16T00:00:00Z")).abierto, false);  // 20:00 Caracas
  assert.equal(horarioSuper(h, new Date("2026-11-15T11:29:00Z")).abierto, false);  // 7:29
  assert.equal(horarioSuper(h, new Date("2026-11-15T11:30:00Z")).abierto, true);   // 7:30
  assert.match(horarioSuper(h, new Date("2026-11-16T01:00:00Z")).texto, /Abrimos a las 7:30 am/);
});

test("carrito en la dirección", () => {
  assert.deepEqual(leerCarrito("12x2.15x1.12x1.x.0x3.9x0"), [{ id: 12, cantidad: 3 }, { id: 15, cantidad: 1 }]);
  assert.deepEqual(leerCarrito("5x99"), [{ id: 5, cantidad: 50 }]);
  assert.equal(carritoATexto([{ id: 12, cantidad: 2 }, { id: 3, cantidad: 0 }]), "12x2");
});

test("mensaje del pedido para WhatsApp", () => {
  const m = mensajePedido({
    id: 27, items: [{ nombre: "Harina de maíz", marca: "P.A.N.", presentacion: "1 kg", cantidad: 2, total: 2.4 }],
    subtotal: 2.4, envio: 1, total: 3.4, tasa_bs: 240, en_casco: true, sector: "Centro", direccion: "Frente a la plaza",
    forma_pago: "pago_movil", si_falta: "escribeme", nombre: "Ana",
  });
  assert.match(m, /Pedido Lokl Súper #27/);
  assert.match(m, /2 × Harina de maíz P\.A\.N\. 1 kg — \$2,40/);
  assert.match(m, /Envío: \$1 · Total: \$3,40 \(Bs 816\)/);
  assert.match(m, /Pago móvil · Si falta algo: escríbeme y decidimos/);
  assert.match(mensajePedido({ id: 1, items: [], subtotal: 30, envio: null, total: null, en_casco: false, sector: "El Recreo", direccion: "x", forma_pago: "zelle" }), /Envío: por confirmar/);
});
