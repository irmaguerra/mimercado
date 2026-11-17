// /auth/google — Lleva a la pantalla de Google y vuelve a /auth/callback.
import { destinoSeguro, mensajeError, navegadorDeApp } from "@/lib/sesion.js";

export async function GET({ locals, url, request, redirect }) {
  const siguiente = destinoSeguro(url.searchParams.get("siguiente"));
  // Google rechaza el navegador de Instagram, Facebook o TikTok (decisión 75)
  if (navegadorDeApp(request.headers.get("user-agent"))) {
    const aviso = "Para entrar con Google abre usalokl.com en Chrome o Safari (menú ⋮ → Abrir en el navegador), o entra aquí con tu correo.";
    return redirect(`/entrar?aviso=${encodeURIComponent(aviso)}&siguiente=${encodeURIComponent(siguiente)}`, 302);
  }
  const { data, error } = await locals.sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${url.origin}/auth/callback?siguiente=${encodeURIComponent(siguiente)}` },
  });
  if (error || !data?.url) {
    return redirect(`/entrar?aviso=${encodeURIComponent(mensajeError(error))}`, 302);
  }
  return redirect(data.url, 302);
}
