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
