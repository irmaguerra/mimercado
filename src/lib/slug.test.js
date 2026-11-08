import { test } from "node:test";
import assert from "node:assert/strict";
import { crearSlug, esSlugValido, slugDisponible } from "./slug.js";

test("crea enlaces limpios", () => {
  assert.equal(crearSlug("Quesera La Macanilla"), "quesera-la-macanilla");
  assert.equal(crearSlug("  Panadería El Ñapo #1 "), "panaderia-el-napo-1");
  assert.equal(crearSlug("¡¡Pizzas!!"), "pizzas");
});

test("valida y reserva", () => {
  assert.equal(esSlugValido("quesera-la-macanilla"), true);
  assert.equal(esSlugValido("super"), false);
  assert.equal(esSlugValido("ab"), false);
  assert.equal(esSlugValido("con--doble"), false);
});

test("busca uno libre", async () => {
  const tomados = new Set(["arepera-dona-ana", "arepera-dona-ana-2"]);
  assert.equal(await slugDisponible("Arepera Doña Ana", async (s) => tomados.has(s)), "arepera-dona-ana-3");
  assert.equal(await slugDisponible("Súper", async () => false), "super-tienda");
  assert.equal(await slugDisponible("Yo", async () => false), "tienda-yo");
});
