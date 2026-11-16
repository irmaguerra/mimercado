import { test } from "node:test";
import assert from "node:assert/strict";
import {
  gruposCategorias, textoPrecio, mensajeRespuesta, textoVence, hace, textoEstado,
  avisoVendedor, avisoCliente, revisarFoto, esIdPresupuesto, MENSAJE_PARA_MOSTRAR,
} from "./presupuesto.js";

test("categorías por sección, sin Clasificados, con subcategorías debajo", () => {
  const filas = [
    { id: 1, seccion: "servicios", nombre: "Transporte", padre_id: null, orden: 1 },
    { id: 2, seccion: "servicios", nombre: "Moto taxi", padre_id: 1, orden: 1 },
    { id: 3, seccion: "clasificados", nombre: "Ropa", padre_id: null, orden: 1 },
    { id: 4, seccion: "comida", nombre: "Pizza", padre_id: null, orden: 1 },
  ];
  const g = gruposCategorias(filas);
  assert.deepEqual(g.map((x) => x.nombre), ["Comida", "Servicios"]);
  assert.deepEqual(g[1].opciones, [{ id: 1, nombre: "Transporte", sub: false }, { id: 2, nombre: "Moto taxi", sub: true }]);
});

test("precio y mensaje de WhatsApp", () => {
  assert.equal(textoPrecio({ precio: 25, desde: false }), "$25");
  assert.equal(textoPrecio({ precio: 12.5, desde: true }), "Desde $12,50");
  assert.equal(textoPrecio({ precio: null }), "");
  assert.equal(
    mensajeRespuesta({ descripcion: "Repuesto de bomba de agua 1 HP" }, { precio: 25 }),
    "Hola, vi tu presupuesto de $25 en Lokl para: Repuesto de bomba de agua 1 HP",
  );
  const largo = mensajeRespuesta({ descripcion: "x".repeat(300) }, { precio: 1 });
  assert.ok(largo.endsWith("…") && largo.length < 200);
});

test("cuánto falta para que venza", () => {
  const ahora = Date.parse("2026-11-16T12:00:00Z");
  assert.equal(textoVence("2026-11-19T12:00:00Z", ahora), "Vence en 3 días");
  assert.equal(textoVence("2026-11-17T11:00:00Z", ahora), "Vence en 23 horas");
  assert.equal(textoVence("2026-11-16T13:00:00Z", ahora), "Vence en 1 hora");
  assert.equal(textoVence("2026-11-16T12:30:00Z", ahora), "Vence en menos de una hora");
  assert.equal(textoVence("2026-11-16T11:00:00Z", ahora), "Venció");
  assert.equal(hace("2026-11-16T11:55:00Z", ahora), "hace 5 min");
  assert.equal(hace("2026-11-16T09:00:00Z", ahora), "hace 3 h");
  assert.equal(hace("2026-11-14T12:00:00Z", ahora), "hace 2 días");
});

test("estado del pedido", () => {
  const ahora = Date.parse("2026-11-16T12:00:00Z");
  assert.equal(textoEstado({ oculto: true, revisar: true, estado: "abierto" }, ahora), "En revisión");
  assert.equal(textoEstado({ oculto: false, estado: "cerrado" }, ahora), "Cerrado");
  assert.equal(textoEstado({ oculto: false, estado: "vencido" }, ahora), "Venció");
  assert.equal(textoEstado({ oculto: false, estado: "abierto", vence_en: "2026-11-18T12:00:00Z" }, ahora), "Vence en 2 días");
});

test("textos de los avisos", () => {
  assert.deepEqual(avisoVendedor({ id: "a", categoria: "Pizza", descripcion: "Familiar  de jamón" }), {
    titulo: "Te piden presupuesto", cuerpo: "Pizza: Familiar de jamón", url: "/panel/presupuestos", tag: "presupuesto-a",
  });
  assert.equal(avisoCliente({ id: "b", tienda: "Pizzería Sol", precio: 11, desde: true }).cuerpo,
    "Pizzería Sol: Desde $11. Toca para ver todas las respuestas.");
  assert.equal(avisoCliente({ id: "b", tienda: "x", precio: 1 }).url, "/presupuesto/b");
});

test("foto del pedido", () => {
  assert.deepEqual(revisarFoto(null), {});
  assert.deepEqual(revisarFoto({ size: 0, type: "" }), {});
  assert.deepEqual(revisarFoto({ size: 1000, type: "image/webp" }), { ext: "webp" });
  assert.match(revisarFoto({ size: 1000, type: "image/gif" }).error, /JPG/);
  assert.match(revisarFoto({ size: 3e6, type: "image/jpeg" }).error, /pesa/);
});

test("ids y mensajes de la base", () => {
  assert.ok(esIdPresupuesto("2d8c1ed9-e2f6-479a-b3df-90604a355b5d"));
  assert.ok(!esIdPresupuesto("../admin"));
  assert.ok(MENSAJE_PARA_MOSTRAR.test("Hiciste 3 pedidos de presupuesto hoy."));
  assert.ok(!MENSAJE_PARA_MOSTRAR.test("duplicate key value"));
});
