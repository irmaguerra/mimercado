import { test } from "node:test";
import assert from "node:assert/strict";
import { precioPorUnidad, minimoTexto, haceCuanto, precioVencido, leerAlMayor, UNIDADES, precioVisible, precioMayorTexto } from "./al-mayor.js";

test("las 9 unidades aprobadas, con las mismas claves que la base", () => {
  assert.deepEqual(Object.keys(UNIDADES), ["kilo", "litro", "unidad", "docena", "cesta", "saco", "caja", "cabeza", "tonelada"]);
});

test("precio por unidad", () => {
  assert.equal(precioPorUnidad(4, "USD", "kilo"), "$4 el kilo");
  assert.equal(precioPorUnidad(400, "USD", "cabeza"), "$400 por cabeza");
  assert.equal(precioPorUnidad(4, "USD", null), "$4");
  assert.equal(precioPorUnidad(null, "USD", "kilo"), null);
});

test("pedido mínimo en palabras", () => {
  assert.equal(minimoTexto(20, "kilo"), "Mínimo 20 kilos");
  assert.equal(minimoTexto(1, "caja"), "Mínimo 1 caja");
  assert.equal(minimoTexto(2.5, "tonelada"), "Mínimo 2,5 toneladas");
  assert.equal(minimoTexto(null, "kilo"), null);
});

test("hace cuánto y plazo de 30 días", () => {
  const ahora = new Date("2026-11-14T12:00:00Z");
  assert.equal(haceCuanto("2026-11-14T08:00:00Z", ahora), "hoy");
  assert.equal(haceCuanto("2026-11-13T08:00:00Z", ahora), "ayer");
  assert.equal(haceCuanto("2026-11-09T08:00:00Z", ahora), "hace 5 días");
  assert.equal(haceCuanto("2026-10-20T08:00:00Z", ahora), "hace 3 semanas");
  assert.equal(precioVencido("2026-10-01T00:00:00Z", ahora), true);
  assert.equal(precioVencido("2026-11-01T00:00:00Z", ahora), false);
});

test("leer los campos al mayor de un formulario", () => {
  const f = (o) => { const x = new FormData(); for (const [k, v] of Object.entries(o)) x.append(k, v); return x; };
  const cats = [{ id: 7 }];
  assert.deepEqual(leerAlMayor(f({ unidad: "kilo", cantidad_minima: "20", disponibilidad: " lunes ", categoria_mayor: "7" }), { categoriasPermitidas: cats }).datos,
    { es_al_mayor: true, precio_mayor: null, unidad: "kilo", cantidad_minima: 20, disponibilidad: "lunes", categoria_id: 7 });
  assert.equal(leerAlMayor(f({ precio_mayor: "4,50", unidad: "kilo", categoria_mayor: "7" }), { categoriasPermitidas: cats }).datos.precio_mayor, 4.5);
  assert.match(leerAlMayor(f({ precio_mayor: "4", categoria_mayor: "7" }), { categoriasPermitidas: cats }).error, /unidad/);
  assert.match(leerAlMayor(f({ categoria_mayor: "99" }), { categoriasPermitidas: cats }).error, /tipo de producto/);
  assert.match(leerAlMayor(f({ cantidad_minima: "veinte", categoria_mayor: "7" }), { categoriasPermitidas: cats }).error, /mínimo/);
  assert.equal(leerAlMayor(f({ unidad: "gramo", categoria_mayor: "7" }), { categoriasPermitidas: cats }).datos.unidad, null);
});

test("dos precios: se ve el de detal; si no hay, el de mayor con su unidad", () => {
  assert.equal(precioVisible({ precio: 2, precio_mayor: 1.5, moneda: "USD", unidad: "unidad" }), "$2");
  assert.equal(precioVisible({ precio: null, precio_mayor: 4, moneda: "USD", unidad: "kilo" }), "$4 el kilo");
  assert.equal(precioVisible({ precio: null, precio_mayor: null, moneda: "USD" }), null);
  assert.equal(precioMayorTexto({ precio_mayor: 1.5, moneda: "USD", unidad: "unidad" }), "$1,50 c/u");
});
