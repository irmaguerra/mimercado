// Reseñas (Módulo 8).

/** El promedio se muestra desde 3 reseñas (decisión 29): con menos, engaña. */
export const MIN_PARA_PROMEDIO = 3;

/** "★★★★☆" para 4 estrellas. */
export function estrellas(n) {
  const k = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return "★".repeat(k) + "☆".repeat(5 - k);
}

/** "4,6" (coma decimal, como se escribe en Venezuela). */
export function promedioTexto(p) {
  return Number(p).toLocaleString("es-VE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function cuantasResenas(n) {
  return `${n} ${n === 1 ? "reseña" : "reseñas"}`;
}

/** Mensaje para cada respuesta de opinar(). */
export const RESULTADO_OPINAR = {
  ok: "¡Gracias! Tu reseña ya se ve en la tienda.",
  revision: "Gracias. Tu reseña quedó en revisión antes de mostrarse.",
  limite: "Por hoy no se pueden dejar más reseñas desde este teléfono. Intenta mañana.",
  sin_contacto: "Para opinar, primero escríbele o llámalo desde Lokl, con el botón de WhatsApp de su tienda.",
  no_existe: "Esta tienda no recibe reseñas.",
};
