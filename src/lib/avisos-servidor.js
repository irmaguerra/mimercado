// Envía avisos desde el servidor con la llave secreta de Cloudflare (VAPID_PRIVADA).
// En la computadora se lee de .dev.vars (no se sube). Sin la llave, no se envía nada y todo lo demás sigue igual.
import { env } from "cloudflare:workers";
import { enviarAvisos } from "./push.js";

/** @param sb cliente de Supabase (para olvidar los teléfonos que ya no existen) */
export async function avisar(sb, suscripciones, aviso) {
  if (!suscripciones?.length) return;
  const privada = env?.VAPID_PRIVADA;
  if (!privada) { console.error("avisos: falta la llave VAPID_PRIVADA en Cloudflare"); return; }
  const { vencidos } = await enviarAvisos(suscripciones, aviso, privada);
  await Promise.all(vencidos.map((e) => sb.rpc("borrar_push", { p_endpoint: e })));
}
