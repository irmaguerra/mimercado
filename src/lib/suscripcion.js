// Lee la suscripción que manda el navegador ("Activar avisos") y revisa que venga de Lokl.
export async function leerSuscripcion(request, url) {
  const origen = request.headers.get("origin");
  if (origen && origen !== url.origin) return null; // solo desde páginas de Lokl
  try {
    const s = await request.json();
    const endpoint = String(s?.endpoint || "");
    const claves = { p256dh: String(s?.keys?.p256dh || ""), auth: String(s?.keys?.auth || "") };
    if (!/^https:\/\/\S+$/.test(endpoint) || endpoint.length > 1000 || !claves.p256dh || !claves.auth) return null;
    return { endpoint, claves };
  } catch {
    return null;
  }
}

export const respuesta = (status) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });
