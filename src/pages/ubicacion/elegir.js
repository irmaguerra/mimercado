// /ubicacion/elegir?estado=apure&municipio=san-fernando
// Guarda la ubicación en la cookie y lleva a su portada. Sin JavaScript en el teléfono.
// Solo acepta lugares que existen en la base (no se puede usar para redirigir a cualquier sitio).
import { buscarEstado, buscarMunicipio, guardarUbicacion, rutaUbicacion } from "@/lib/ubicacion.js";

export async function GET({ url, cookies, redirect }) {
  const estado = url.searchParams.get("estado") || "";
  const municipio = url.searchParams.get("municipio") || "";

  if (municipio) {
    const m = await buscarMunicipio(estado, municipio);
    if (!m) return redirect("/ubicacion", 302);
    guardarUbicacion(cookies, { estado, municipio });
    return redirect(rutaUbicacion({ estado, municipio }), 302);
  }

  const e = await buscarEstado(estado);
  if (!e) return redirect("/ubicacion", 302);
  guardarUbicacion(cookies, { estado });
  return redirect(rutaUbicacion({ estado }), 302);
}
