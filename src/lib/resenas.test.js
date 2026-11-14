import { test } from "node:test";
import assert from "node:assert/strict";
import { estrellas, promedioTexto, cuantasResenas, MIN_PARA_PROMEDIO } from "./resenas.js";
import { volverSeguro } from "./cliente-cookie.js";

test("estrellas y promedio", () => {
  assert.equal(estrellas(4), "★★★★☆");
  assert.equal(estrellas(4.6), "★★★★★");
  assert.equal(estrellas(0), "☆☆☆☆☆");
  assert.equal(estrellas(9), "★★★★★");
  assert.equal(promedioTexto(4.6), "4,6");
  assert.equal(promedioTexto(4), "4,0");
  assert.equal(cuantasResenas(1), "1 reseña");
  assert.equal(cuantasResenas(12), "12 reseñas");
  assert.equal(MIN_PARA_PROMEDIO, 3);
});

test("solo se vuelve a direcciones internas", () => {
  assert.equal(volverSeguro("/dorcas"), "/dorcas");
  assert.equal(volverSeguro("/p/12?x=1"), "/p/12?x=1");
  assert.equal(volverSeguro("//malo.com"), "/");
  assert.equal(volverSeguro("https://malo.com"), "/");
  assert.equal(volverSeguro("", "/favoritos"), "/favoritos");
});
