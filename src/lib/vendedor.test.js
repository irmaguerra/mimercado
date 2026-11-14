import { test } from "node:test";
import assert from "node:assert/strict";
import { textoAbierto, esServicio, FORMAS_PAGO } from "./vendedor.js";

test("los servicios dicen Disponible; el resto, Abierto", () => {
  assert.equal(textoAbierto(true, true), "Disponible ahora");
  assert.equal(textoAbierto(false, true), "No disponible ahora");
  assert.equal(textoAbierto(true, false), "Abierto ahora");
  assert.equal(textoAbierto(false, false), "Cerrado ahora");
  assert.equal(esServicio({ seccion_principal: "servicios" }), true);
  assert.equal(esServicio({ seccion_principal: "comida" }), false);
});

test("las 7 formas de pago aprobadas, con las mismas claves que la base", () => {
  assert.deepEqual(Object.keys(FORMAS_PAGO),
    ["pago_movil", "efectivo_usd", "efectivo_bs", "transferencia", "punto_venta", "zelle", "binance"]);
});
