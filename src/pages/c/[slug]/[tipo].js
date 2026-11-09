// /c/<tienda>/whatsapp  y  /c/<tienda>/llamada
// Cuenta el contacto (para el contador del vendedor) y lleva a WhatsApp o a la llamada.
// Es un enlace normal: funciona en iPhone sin window.open y sin JavaScript.
import { supabasePublico } from "@/lib/supabase/servidor.js";
import { enlaceWhatsApp, enlaceLlamada } from "@/lib/whatsapp.js";

export async function GET({ params, url, redirect, site }) {
  const { slug, tipo } = params;
  if (tipo !== "whatsapp" && tipo !== "llamada") return redirect(`/${slug}`, 302);

  const sb = supabasePublico();
  const { data: t } = await sb
    .from("vendedores")
    .select("id, whatsapp, telefono")
    .eq("slug", slug)
    .eq("estado", "activo")
    .maybeSingle();
  if (!t) return redirect("/", 302);

  // Si viene de la ficha de un producto (?p=<id>), el mensaje ya dice cuál es
  const pubId = Number(url.searchParams.get("p")) || null;
  let pub = null;
  if (pubId) {
    const { data } = await sb.from("publicaciones").select("id, titulo")
      .eq("id", pubId).eq("vendedor_id", t.id).eq("estado", "publicada").maybeSingle();
    pub = data;
  }

  // Registrar sin hacer esperar a la persona más de lo necesario
  await sb.from("contactos").insert({ vendedor_id: t.id, tipo, publicacion_id: pub?.id ?? null });

  const host = new URL("/", site).host;
  const mensaje = pub
    ? `Hola, me interesa "${pub.titulo}" que vi en Lokl (${host}/p/${pub.id})`
    : `Hola, te escribo desde Lokl (${host}/${slug})`;
  const destino = tipo === "llamada" && t.telefono ? enlaceLlamada(t.telefono) : enlaceWhatsApp(t.whatsapp, mensaje);
  return new Response(null, { status: 302, headers: { Location: destino, "Cache-Control": "no-store" } });
}
