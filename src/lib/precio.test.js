import { test } from "node:test";
import assert from "node:assert/strict";
import { leerPrecio, mostrarPrecio, precioParaCampo } from "./precio.js";

test("leerPrecio entiende como escriben los vendedores", () => {
  assert.equal(leerPrecio(""), null);
  assert.equal(leerPrecio("5"), 5);
  assert.equal(leerPrecio("5,50"), 5.5);
  assert.equal(leerPrecio("5.50"), 5.5);
  assert.equal(leerPrecio("$ 12"), 12);
  assert.equal(leerPrecio("1.200"), 1200);
  assert.equal(leerPrecio("1,200"), 1200);
  assert.equal(leerPrecio("1.200,50"), 1200.5);
  assert.equal(leerPrecio("1,200.50"), 1200.5);
  assert.equal(leerPrecio("0,5"), 0.5);
  assert.ok(Number.isNaN(leerPrecio("..")));
});

test("mostrarPrecio es exacto y en su moneda", () => {
  assert.equal(mostrarPrecio(null), null);
  assert.equal(mostrarPrecio(5, "USD"), "$5");
  assert.equal(mostrarPrecio(5.5, "USD"), "$5,50");
  assert.equal(mostrarPrecio("1200", "VES"), "Bs 1.200");
  assert.equal(mostrarPrecio(1200.25, "VES"), "Bs 1.200,25");
});

test("precioParaCampo", () => {
  assert.equal(precioParaCampo(null), "");
  assert.equal(precioParaCampo(5), "5");
  assert.equal(precioParaCampo("5.5"), "5,50");
});
