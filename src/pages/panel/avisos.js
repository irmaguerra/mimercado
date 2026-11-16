// POST /panel/avisos — guarda el teléfono del vendedor para avisarle cuando le pidan presupuesto.
// La sesión la revisa el middleware (/panel exige cuenta).
import { leerSuscripcion, respuesta } from "@/lib/suscripcion.js";

export async function POST({ request, url, locals }) {
  const s = await leerSuscripcion(request, url);
  if (!s) return respuesta(400);
  const { error } = await locals.sb.rpc("guardar_push_vendedor", { p_endpoint: s.endpoint, p_claves: s.claves });
  if (error) { console.error("guardar_push_vendedor", error); return respuesta(500); }
  return respuesta(204);
}
