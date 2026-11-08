// /salir — Cierra la sesión (solo con POST, para que un enlace ajeno no pueda sacarte).
export async function POST({ locals, redirect }) {
  await locals.sb.auth.signOut();
  return redirect("/", 303);
}
