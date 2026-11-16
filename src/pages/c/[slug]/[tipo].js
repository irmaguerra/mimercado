// /c/<tienda>/whatsapp  y  /c/<tienda>/llamada
// Cuenta el contacto (para el contador del vendedor) y lleva a WhatsApp o a la llamada.
// Es un enlace normal: funciona en iPhone sin window.open y sin JavaScript.
import { supabasePublico } from "@/lib/supabase/servidor.js";
import { enlaceWhatsApp, enlaceLlamada } from "@/lib/whatsapp.js";
import { clienteDeCookie } from "@/lib/cliente-cookie.js";
import { esIdPresupuesto, mensajeRespuesta } from "@/lib/presupuesto.js";

export async function GET({ params, url, redirect, cookies }) {
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

  // Registrar sin hacer esperar a la persona más de lo necesario.
  // El id del teléfono permite que después pueda opinar sobre esta tienda (decisión 28).
  const cliente_id = clienteDeCookie(cookies);
  await sb.from("contactos").insert({ vendedor_id: t.id, tipo, publicacion_id: pub?.id ?? null, cliente_id });

  // Si viene de un presupuesto (?pr=<id>), el mensaje dice su precio y lo que pidió (decisión 70)
  const prId = url.searchParams.get("pr");
  let presupuesto = null;
  if (esIdPresupuesto(prId)) {
    const { data } = await sb.rpc("presupuesto_ver", { p_cliente: cliente_id, p_id: prId });
    const r = data?.respuestas?.find((x) => x.vendedor_id === t.id);
    if (r) presupuesto = mensajeRespuesta(data, r);
  }

  const host = url.host;
  const mensaje = presupuesto ?? (pub
    ? `Hola, me interesa "${pub.titulo}" que vi en Lokl (${host}/p/${pub.id})`
    : `Hola, te escribo desde Lokl (${host}/${slug})`);
  const destino = tipo === "llamada" && t.telefono ? enlaceLlamada(t.telefono) : enlaceWhatsApp(t.whatsapp, mensaje);
  return new Response(null, { status: 302, headers: { Location: destino, "Cache-Control": "no-store" } });
}
