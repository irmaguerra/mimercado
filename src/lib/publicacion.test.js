import { test } from "node:test";
import assert from "node:assert/strict";
import { seccionDe, vencida, diasRestantes, rutaEnAlmacen, miniatura, cuantosVer } from "./publicacion.js";

test("seccionDe usa lo que eligió el vendedor", () => {
  assert.equal(seccionDe({ seccion_principal: "comida", tipo: "negocio" }), "comida");
  assert.equal(seccionDe({ tipo: "persona" }), "clasificados");
  assert.equal(seccionDe({ tipo: "negocio" }), "tiendas");
});

test("solo los clasificados vencen", () => {
  const ahora = new Date("2026-11-08T12:00:00Z");
  assert.equal(vencida({ vence_en: "infinity", estado: "publicada" }, ahora), false);
  assert.equal(diasRestantes({ vence_en: "infinity" }, ahora), null);
  assert.equal(vencida({ vence_en: "2026-11-01T00:00:00Z", estado: "publicada" }, ahora), true);
  assert.equal(diasRestantes({ vence_en: "2026-11-18T12:00:00Z" }, ahora), 10);
  assert.equal(vencida({ vence_en: "infinity", estado: "vencida" }, ahora), true);
});

test("ruta de la foto en el almacén", () => {
  assert.equal(
    rutaEnAlmacen("https://x.supabase.co/storage/v1/object/public/vendedores/abc/p/7/1-k.webp"),
    "abc/p/7/1-k.webp",
  );
  assert.equal(rutaEnAlmacen(null), null);
});

test("miniatura toma la primera foto", () => {
  assert.equal(miniatura({ publicacion_fotos: [{ url_mini: "b", orden: 2 }, { url_mini: "a", orden: 1 }] }), "a");
  assert.equal(miniatura({}), null);
});

test("ver más productos va de 30 en 30, hasta 600", () => {
  assert.equal(cuantosVer(null), 30);
  assert.equal(cuantosVer("60"), 60);
  assert.equal(cuantosVer("45"), 60);
  assert.equal(cuantosVer("-5"), 30);
  assert.equal(cuantosVer("abc"), 30);
  assert.equal(cuantosVer("99999"), 600);
});
