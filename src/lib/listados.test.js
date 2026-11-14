import { test } from "node:test";
import assert from "node:assert/strict";
import {
  seccionPorSlug, arbolCategorias, categoriasMarcables, idsDeCategoria,
  leerCategorias, agruparResultados, leerLugar, contar, MAX_CATEGORIAS,
} from "./listados.js";

const FILAS = [
  { id: 1, nombre: "Transporte", slug: "transporte", padre_id: null, orden: 1 },
  { id: 2, nombre: "Taxi", slug: "taxi", padre_id: 1, orden: 2 },
  { id: 3, nombre: "Moto taxi", slug: "moto-taxi", padre_id: 1, orden: 1 },
  { id: 4, nombre: "Hospedaje", slug: "hospedaje", padre_id: null, orden: 6 },
];

test("al-mayor en la dirección es al_mayor en la base", () => {
  assert.equal(seccionPorSlug("al-mayor").clave, "al_mayor");
  assert.equal(seccionPorSlug("super"), null);
  assert.equal(seccionPorSlug("clasificados").lista, "productos");
  assert.equal(seccionPorSlug("comida").lista, "tiendas");
});

test("árbol de categorías con subcategorías en orden", () => {
  const arbol = arbolCategorias(FILAS);
  assert.deepEqual(arbol.map((c) => c.slug), ["transporte", "hospedaje"]);
  assert.deepEqual(arbol[0].hijos.map((c) => c.slug), ["moto-taxi", "taxi"]);
  // Se marcan las subcategorías, o la categoría si no tiene
  assert.deepEqual(categoriasMarcables(arbol).map((c) => c.id), [3, 2, 4]);
  // Listar "Transporte" incluye a sus subcategorías
  assert.deepEqual(idsDeCategoria(arbol[0]), [1, 3, 2]);
  assert.equal(idsDeCategoria(null), null);
});

test("hasta 10 categorías y solo las permitidas", () => {
  const permitidas = Array.from({ length: 12 }, (_, i) => ({ id: i + 1 }));
  const form = (ids) => { const f = new FormData(); ids.forEach((i) => f.append("categoria", String(i))); return f; };
  assert.deepEqual(leerCategorias(form([1, 2, 2, 99]), permitidas), { ids: [1, 2] });
  const once = leerCategorias(form([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]), permitidas);
  assert.equal(MAX_CATEGORIAS, 10);
  assert.match(once.error, /hasta 10/);
  assert.equal(leerCategorias(form(Array.from({ length: 10 }, (_, i) => i + 1)), permitidas).error, undefined);
});

test("resultados agrupados por sección, en el orden del mejor", () => {
  const g = agruparResultados([
    { tipo: "publicacion", seccion: "comida", titulo: "Pizza" },
    { tipo: "vendedor", seccion: "tiendas", titulo: "Bodega" },
    { tipo: "vendedor", seccion: "comida", titulo: "Pizzería" },
  ]);
  assert.deepEqual(g.map((x) => x.clave), ["comida", "tiendas"]);
  assert.equal(g[0].tiendas.length, 1);
  assert.equal(g[0].productos.length, 1);
  assert.equal(g[0].seccion.nombre, "Comida");
});

test("lugar de la dirección", () => {
  assert.deepEqual(leerLugar("apure/san-fernando"), { estado: "apure", municipio: "san-fernando" });
  assert.deepEqual(leerLugar("zulia"), { estado: "zulia" });
  assert.equal(leerLugar("../x"), null);
  assert.equal(leerLugar(""), null);
  assert.equal(leerLugar("a/b/c"), null);
});

test("contar en palabras", () => {
  assert.equal(contar(1, "comida"), "1 puesto");
  assert.equal(contar(3, "comida"), "3 puestos");
  assert.equal(contar(2, "otro"), "2 resultados");
});
