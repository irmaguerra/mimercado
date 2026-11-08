// Ayudas para las páginas con sesión (panel, entrar).

/** Solo permite volver a rutas internas (evita que un enlace lleve a otro sitio después de entrar). */
export function destinoSeguro(valor, porDefecto = "/panel") {
  return typeof valor === "string" && /^\/(?!\/)[\w\-/?=&%.]*$/.test(valor) ? valor : porDefecto;
}

/** URL base de esta instalación (localhost, vista previa o usalokl.com). */
export function origen(url) {
  return url.origin;
}

/** Traduce los errores de Supabase Auth a mensajes claros. */
export function mensajeError(error) {
  const m = (error?.message || "").toLowerCase();
  if (m.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (m.includes("email not confirmed")) return "Todavía no confirmaste tu correo. Revisa tu bandeja de entrada (y la carpeta de spam).";
  if (m.includes("user already registered")) return "Ya existe una cuenta con ese correo. Toca \"Entrar\".";
  if (m.includes("password should be at least") || m.includes("weak")) return "La contraseña debe tener al menos 8 caracteres.";
  if (m.includes("rate limit") || m.includes("too many")) return "Demasiados intentos. Espera unos minutos y vuelve a probar.";
  if (m.includes("not authorized") || m.includes("email address")) return "No pudimos enviar el correo a esa dirección. Escríbenos si el problema sigue.";
  if (m.includes("provider is not enabled")) return "La entrada con Google todavía no está activada. Usa tu correo por ahora.";
  return "Algo salió mal. Intenta de nuevo.";
}

/** Tienda del usuario con sesión, o null si todavía no la creó. */
export async function miTienda(sb, usuarioId) {
  const { data } = await sb
    .from("vendedores")
    .select("*, zonas(nombre, slug, activa, municipios(nombre, slug, estados(nombre, slug)))")
    .eq("usuario_id", usuarioId)
    .maybeSingle();
  return data;
}
