// /c/<tienda>/whatsapp  y  /c/<tienda>/llamada
// Cuenta el contacto (para el contador del vendedor) y lleva a WhatsApp o a la llamada.
// Es un enlace normal: funciona en iPhone sin window.open y sin JavaScript.
import { supabasePublico } from "@/lib/supabase/servidor.js";
import { enlaceWhatsApp, enlaceLlamada } from "@/lib/whatsapp.js";

export async function GET({ params, redirect, site }) {
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

  // Registrar sin hacer esperar a la persona más de lo necesario
  await sb.from("contactos").insert({ vendedor_id: t.id, tipo });

  const destino =
    tipo === "llamada" && t.telefono
      ? enlaceLlamada(t.telefono)
      : enlaceWhatsApp(t.whatsapp, `Hola, te escribo desde Lokl (${new URL(`/${slug}`, site).host}/${slug})`);
  return new Response(null, { status: 302, headers: { Location: destino, "Cache-Control": "no-store" } });
}
