// /auth/google — Lleva a la pantalla de Google y vuelve a /auth/callback.
import { destinoSeguro, mensajeError } from "@/lib/sesion.js";

export async function GET({ locals, url, redirect }) {
  const siguiente = destinoSeguro(url.searchParams.get("siguiente"));
  const { data, error } = await locals.sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${url.origin}/auth/callback?siguiente=${encodeURIComponent(siguiente)}` },
  });
  if (error || !data?.url) {
    return redirect(`/entrar?aviso=${encodeURIComponent(mensajeError(error))}`, 302);
  }
  return redirect(data.url, 302);
}
