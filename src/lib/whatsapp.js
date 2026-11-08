// Todo en Lokl termina en WhatsApp. Números de Venezuela en formato 58XXXXXXXXXX.

/** "0414-123.45.67" → "584141234567". Devuelve "" si no hay dígitos. */
export function normalizarNumero(tel) {
  const n = String(tel ?? "").replace(/\D/g, "");
  if (!n) return "";
  if (n.startsWith("58")) return n;
  if (n.startsWith("0")) return "58" + n.slice(1);
  return "58" + n;
}

/** ¿Parece un celular venezolano? (58 + 412/414/416/422/424/426 + 7 dígitos) */
export function esCelularValido(tel) {
  return /^584(12|14|16|22|24|26)\d{7}$/.test(normalizarNumero(tel));
}

/** Enlace wa.me listo para un <a href>. */
export function enlaceWhatsApp(numero, mensaje = "") {
  const base = "https://wa.me/" + normalizarNumero(numero);
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** Compartir un texto sin destinatario (la persona elige el chat o el grupo). */
export function enlaceCompartir(texto) {
  return "https://wa.me/?text=" + encodeURIComponent(texto);
}

/** Enlace tel: para llamar. */
export function enlaceLlamada(numero) {
  return "tel:+" + normalizarNumero(numero);
}

/**
 * Abre WhatsApp desde código. En iPhone SIEMPRE con location.href:
 * Safari bloquea window.open cuando hubo un await antes.
 */
export function abrirWhatsApp(numero, mensaje = "") {
  window.location.href = enlaceWhatsApp(numero, mensaje);
}
