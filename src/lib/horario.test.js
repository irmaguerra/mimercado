import { test } from "node:test";
import assert from "node:assert/strict";
import { estaAbiertoAhora, siguienteForzado, minutosEnVenezuela } from "./horario.js";

// Venezuela es UTC-4 todo el año: 14:00 UTC = 10:00 en San Fernando.
const a = (horaVE) => new Date(`2026-11-08T${String(horaVE + 4).padStart(2, "0")}:00:00Z`);
const base = { estado: "activo", en_pausa: false, forzar_abierto: null, hora_desde: "08:00", hora_hasta: "18:00" };

test("hora de Venezuela", () => {
  assert.equal(minutosEnVenezuela(a(10)), 600);
});

test("horario normal", () => {
  assert.equal(estaAbiertoAhora(base, a(10)), true);
  assert.equal(estaAbiertoAhora(base, a(19)), false);
  assert.equal(estaAbiertoAhora({ ...base, hora_desde: "08:00:00", hora_hasta: "18:00:00" }, a(10)), true);
});

test("horario que cruza la medianoche (18:00 a 02:00)", () => {
  const noche = { ...base, hora_desde: "18:00", hora_hasta: "02:00" };
  assert.equal(estaAbiertoAhora(noche, a(19)), true);
  assert.equal(estaAbiertoAhora(noche, new Date("2026-11-09T05:00:00Z")), true); // 01:00 VE
  assert.equal(estaAbiertoAhora(noche, a(10)), false);
});

test("sin horario = abierto", () => {
  assert.equal(estaAbiertoAhora({ ...base, hora_desde: null, hora_hasta: null }, a(3)), true);
});

test("forzado gana al horario y a la pausa", () => {
  assert.equal(estaAbiertoAhora({ ...base, forzar_abierto: true, en_pausa: true }, a(23)), true);
  assert.equal(estaAbiertoAhora({ ...base, forzar_abierto: false }, a(10)), false);
});

test("en pausa = cerrado", () => {
  assert.equal(estaAbiertoAhora({ ...base, en_pausa: true }, a(10)), false);
});

test("suspendido nunca abre, ni forzado", () => {
  assert.equal(estaAbiertoAhora({ ...base, estado: "suspendido", forzar_abierto: true }, a(10)), false);
});

test("ciclo del botón", () => {
  assert.equal(siguienteForzado({ ...base, forzar_abierto: true }, a(10)), null);
  assert.equal(siguienteForzado({ ...base, forzar_abierto: false }, a(10)), true);
  assert.equal(siguienteForzado(base, a(10)), false); // en horario → cerrar
  assert.equal(siguienteForzado(base, a(20)), true);  // fuera de horario → abrir
});
