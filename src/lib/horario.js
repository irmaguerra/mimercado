// Abierto / cerrado de un vendedor. Debe dar SIEMPRE lo mismo que la función
// esta_abierto() de la base de datos (supabase/migrations/..._esquema_inicial.sql).
//
// Prioridad:
//   1. Suspendido por el admin  → cerrado, sin excepción (corrige el error de la app vieja).
//   2. forzar_abierto = true    → abierto (el vendedor tocó "Abrir").
//   3. forzar_abierto = false   → cerrado (el vendedor tocó "Cerrar").
//   4. En pausa                 → cerrado.
//   5. Sin horario              → abierto.
//   6. Horario en hora de Venezuela, incluido el que cruza la medianoche (ej. 18:00 a 02:00).

const ZONA = "America/Caracas";

/** Minutos desde la medianoche en Venezuela para una fecha dada. */
export function minutosEnVenezuela(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONA,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(fecha);
  const h = Number(partes.find((p) => p.type === "hour").value);
  const m = Number(partes.find((p) => p.type === "minute").value);
  return h * 60 + m;
}

function aMinutos(hora) {
  // Acepta "08:00" y "08:00:00" (formato time de Postgres)
  const [h, m] = String(hora).split(":").map(Number);
  return h * 60 + (m || 0);
}

/** ¿Está dentro del horario, sin mirar forzados ni pausas? */
export function dentroDeHorario(desde, hasta, ahora = new Date()) {
  if (!desde || !hasta) return true;
  const min = minutosEnVenezuela(ahora);
  const d = aMinutos(desde);
  const h = aMinutos(hasta);
  if (h > d) return min >= d && min <= h;
  return min >= d || min <= h; // cruza medianoche
}

/**
 * @param {{hora_desde?:string|null, hora_hasta?:string|null, estado?:string,
 *          en_pausa?:boolean, forzar_abierto?:boolean|null}} v  fila de `vendedores`
 */
export function estaAbiertoAhora(v, ahora = new Date()) {
  if (!v || (v.estado && v.estado !== "activo")) return false;
  if (v.forzar_abierto === true) return true;
  if (v.forzar_abierto === false) return false;
  if (v.en_pausa) return false;
  return dentroDeHorario(v.hora_desde, v.hora_hasta, ahora);
}

/**
 * Ciclo del botón "Abrir / Cerrar" del vendedor (igual que en la app vieja):
 *   forzado abierto   → vuelve a seguir el horario (null)
 *   forzado cerrado   → fuerza abierto (true)
 *   siguiendo horario → si está en horario fuerza cierre (false); si no, fuerza apertura (true)
 * @returns {true|false|null} nuevo valor de forzar_abierto
 */
export function siguienteForzado(v, ahora = new Date()) {
  if (v.forzar_abierto === true) return null;
  if (v.forzar_abierto === false) return true;
  return dentroDeHorario(v.hora_desde, v.hora_hasta, ahora) ? false : true;
}
