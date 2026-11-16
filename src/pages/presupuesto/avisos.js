// POST /presupuesto/avisos — guarda el teléfono del cliente para avisarle cuando le respondan.
// Sin cuenta: se usa el código anónimo del teléfono (cookie lokl_cliente).
import { supabasePublico } from "@/lib/supabase/servidor.js";
import { clienteDeCookie } from "@/lib/cliente-cookie.js";
import { leerSuscripcion, respuesta } from "@/lib/suscripcion.js";

export async function POST({ request, url, cookies }) {
  const s = await leerSuscripcion(request, url);
  if (!s) return respuesta(400);
  const { error } = await supabasePublico().rpc("guardar_push_cliente", {
    p_cliente: clienteDeCookie(cookies), p_endpoint: s.endpoint, p_claves: s.claves,
  });
  if (error) { console.error("guardar_push_cliente", error); return respuesta(500); }
  return respuesta(204);
}
