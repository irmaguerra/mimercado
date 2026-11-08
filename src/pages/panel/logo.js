// POST /panel/logo — Sube el logo a Supabase Storage (carpeta del vendedor) y lo guarda en la tienda.
// La isla SubirLogo lo manda ya comprimido desde el teléfono; sin JavaScript llega el archivo original.
import { miTienda } from "@/lib/sesion.js";

const TIPOS = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
const MAX = 2 * 1024 * 1024;

export async function POST({ locals, request, redirect }) {
  const quiereJson = (request.headers.get("accept") || "").includes("application/json");
  const responder = (ok, mensaje) =>
    quiereJson
      ? new Response(JSON.stringify({ ok, mensaje }), { status: ok ? 200 : 400, headers: { "content-type": "application/json" } })
      : redirect(`/panel/tienda?${ok ? "ok=logo" : "error=" + encodeURIComponent(mensaje)}`, 303);

  const t = await miTienda(locals.sb, locals.usuario.id);
  if (!t) return responder(false, "Primero crea tu tienda.");

  const foto = (await request.formData()).get("foto");
  if (!(foto instanceof File) || foto.size === 0) return responder(false, "Elige una foto.");
  const ext = TIPOS[foto.type];
  if (!ext) return responder(false, "La foto debe ser JPG, PNG o WebP.");
  if (foto.size > MAX) return responder(false, "La foto pesa más de 2 MB. Prueba con otra.");

  const ruta = `${t.id}/logo-${Date.now().toString(36)}.${ext}`;
  const almacen = locals.sb.storage.from("vendedores");
  const { error } = await almacen.upload(ruta, foto, { contentType: foto.type, cacheControl: "31536000", upsert: false });
  if (error) return responder(false, "No pudimos subir la foto. Intenta de nuevo.");

  const { data } = almacen.getPublicUrl(ruta);
  await locals.sb.from("vendedores").update({ logo_url: data.publicUrl }).eq("id", t.id);

  // Borra el logo anterior para no ocupar espacio
  const anterior = t.logo_url?.split("/vendedores/")[1];
  if (anterior && anterior.startsWith(`${t.id}/`)) await almacen.remove([anterior]);

  return responder(true, "Logo actualizado");
}
