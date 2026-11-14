import { test } from "node:test";
import assert from "node:assert/strict";
import { limpiarPalabra, resumirMotivos, esPalabraBloqueada, clienteDeCookie } from "./moderacion.js";

test("palabras prohibidas: solo letras, números y espacios", () => {
  assert.equal(limpiarPalabra("  Arma   Blanca "), "arma blanca");
  assert.equal(limpiarPalabra("Señal"), "señal");
  assert.equal(limpiarPalabra("c++"), null);
  assert.equal(limpiarPalabra("a"), null);
  assert.equal(limpiarPalabra("(x)"), null);
});

test("resumen de motivos de reporte", () => {
  assert.equal(resumirMotivos(["otro", "estafa", "estafa"]), "Es una estafa o engaño (2) · Otro");
  assert.equal(resumirMotivos([]), "");
});

test("reconoce el error de palabra bloqueada", () => {
  assert.equal(esPalabraBloqueada({ message: "Palabra no permitida en Lokl" }), true);
  assert.equal(esPalabraBloqueada({ message: "otra cosa" }), false);
  assert.equal(esPalabraBloqueada(null), false);
});

test("el cliente anónimo se crea una vez y se reutiliza", () => {
  const guardadas = new Map();
  const cookies = { get: (k) => (guardadas.has(k) ? { value: guardadas.get(k) } : undefined), set: (k, v) => guardadas.set(k, v) };
  const a = clienteDeCookie(cookies);
  assert.match(a, /^[0-9a-f-]{36}$/);
  assert.equal(clienteDeCookie(cookies), a);
  guardadas.set("lokl_cliente", "no-es-un-id");
  assert.notEqual(clienteDeCookie(cookies), "no-es-un-id");
});
