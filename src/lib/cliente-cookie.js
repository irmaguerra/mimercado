// Cliente anónimo en las páginas sin JavaScript: un id al azar en una cookie que solo lee el servidor.
// Sirve para reportar una vez, guardar favoritos y opinar sin crear cuenta.
// Es privado: con él se podría opinar o ver favoritos en nombre de esa persona (la base no lo muestra a nadie).
export const COOKIE_CLIENTE = "lokl_cliente";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DOS_ANOS = 60 * 60 * 24 * 365 * 2;

/** El id de este teléfono, o null si todavía no tiene. */
export function leerCliente(cookies) {
  const actual = cookies.get(COOKIE_CLIENTE)?.value;
  return actual && UUID.test(actual) ? actual : null;
}

/** El id de este teléfono; si no tiene, lo crea. */
export function clienteDeCookie(cookies) {
  const actual = leerCliente(cookies);
  if (actual) return actual;
  const nuevo = crypto.randomUUID();
  cookies.set(COOKIE_CLIENTE, nuevo, { path: "/", maxAge: DOS_ANOS, sameSite: "lax", secure: true, httpOnly: true });
  return nuevo;
}

/** Solo direcciones internas de Lokl para volver después de un formulario. */
export function volverSeguro(valor, porDefecto = "/") {
  const v = String(valor || "");
  return /^\/(?!\/)[\w\-/?=&.%#]*$/.test(v) ? v : porDefecto;
}
