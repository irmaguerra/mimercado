// Control de acceso. Solo las rutas privadas consultan la sesión:
// las páginas públicas no tocan cookies de Supabase y siguen siendo cacheables.
import { defineMiddleware } from "astro:middleware";
import { supabaseServidor } from "@/lib/supabase/servidor.js";

const CON_SESION = ["/panel", "/admin", "/entrar", "/auth", "/salir"];
const REQUIERE_SESION = ["/panel", "/admin"];

const empieza = (ruta, lista) => lista.some((p) => ruta === p || ruta.startsWith(p + "/"));

export const onRequest = defineMiddleware(async (ctx, next) => {
  const ruta = ctx.url.pathname;
  if (!empieza(ruta, CON_SESION)) return next();

  const sb = supabaseServidor(ctx);
  const { data } = await sb.auth.getUser(); // valida el token con Supabase (no confía solo en la cookie)
  ctx.locals.sb = sb;
  ctx.locals.usuario = data?.user ?? null;

  if (empieza(ruta, REQUIERE_SESION) && !ctx.locals.usuario) {
    return ctx.redirect(`/entrar?siguiente=${encodeURIComponent(ruta)}`, 302);
  }

  if (empieza(ruta, ["/admin"])) {
    const { data: esAdmin } = await sb.rpc("es_admin");
    if (!esAdmin) return ctx.redirect("/panel", 302);
  }

  const respuesta = await next();
  respuesta.headers.set("Cache-Control", "private, no-store"); // nunca guardar páginas con sesión
  return respuesta;
});
