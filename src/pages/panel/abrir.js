// POST /panel/abrir — El botón "Abrir / Cerrar" del vendedor (mismo ciclo que la app vieja).
import { miTienda } from "@/lib/sesion.js";
import { siguienteForzado } from "@/lib/horario.js";

export async function POST({ locals, redirect }) {
  const t = await miTienda(locals.sb, locals.usuario.id);
  if (t) await locals.sb.from("vendedores").update({ forzar_abierto: siguienteForzado(t) }).eq("id", t.id);
  return redirect("/panel", 303);
}
