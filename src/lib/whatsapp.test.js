import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizarNumero, esCelularValido, enlaceWhatsApp, enlaceLlamada } from "./whatsapp.js";

test("normaliza números venezolanos", () => {
  assert.equal(normalizarNumero("0414-123.45.67"), "584141234567");
  assert.equal(normalizarNumero("+58 414 1234567"), "584141234567");
  assert.equal(normalizarNumero("4141234567"), "584141234567");
  assert.equal(normalizarNumero(""), "");
  assert.equal(normalizarNumero(null), "");
});

test("valida celulares", () => {
  assert.equal(esCelularValido("0424 555 1234"), true);
  assert.equal(esCelularValido("0247 341 1234"), false); // fijo de Apure
  assert.equal(esCelularValido("0414123"), false);
});

test("enlaces", () => {
  assert.equal(enlaceWhatsApp("04141234567", "Hola, ¿tienes queso?"),
    "https://wa.me/584141234567?text=Hola%2C%20%C2%BFtienes%20queso%3F");
  assert.equal(enlaceWhatsApp("04141234567"), "https://wa.me/584141234567");
  assert.equal(enlaceLlamada("04141234567"), "tel:+584141234567");
});
