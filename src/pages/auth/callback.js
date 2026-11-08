// /auth/callback — Punto de regreso de Google, del correo de confirmación y del de "olvidé mi contraseña".
//  ?code=…              → Google o enlace de correo (flujo PKCE): se cambia por una sesión.
//  ?token_hash=…&type=… → enlace de correo con plantilla propia.
// Si el enlace se abre en otro teléfono o navegador, la cuenta igual queda confirmada:
// se le pide entrar con su correo y contraseña.
import { destinoSeguro } from "@/lib/sesion.js";

export async function GET({ locals, url, redirect }) {
  const siguiente = destinoSeguro(url.searchParams.get("siguiente"));
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const tipo = url.searchParams.get("type");

  let error = url.searchParams.get("error_description") ? true : null;
  if (!error && code) ({ error } = await locals.sb.auth.exchangeCodeForSession(code));
  else if (!error && tokenHash && tipo) ({ error } = await locals.sb.auth.verifyOtp({ token_hash: tokenHash, type: tipo }));
  else if (!error) error = true;

  if (error) {
    const aviso = "Tu correo quedó confirmado o el enlace ya se usó. Entra con tu correo y contraseña.";
    return redirect(`/entrar?aviso=${encodeURIComponent(aviso)}&siguiente=${encodeURIComponent(siguiente)}`, 302);
  }
  return redirect(siguiente, 302);
}
