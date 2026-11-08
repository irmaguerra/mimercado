// Ubicación elegida por la persona. Regla: la ubicación ORDENA, no esconde.
// Se guarda en la cookie `lokl_ubic` como "estado/municipio" (ej. "apure/san-fernando")
// o solo "estado" cuando Lokl todavía no llega a su ciudad (ej. "distrito-capital").
// Sin GPS ni permisos: se elige con un toque en /ubicacion.
import { supabasePublico } from "./supabase/servidor.js";

export const COOKIE_UBICACION = "lokl_ubic";
const UN_ANO = 60 * 60 * 24 * 365;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Lee la cookie y devuelve { estado, municipio? } o null si no hay o no es válida. */
export function leerUbicacion(cookies) {
  const valor = cookies.get(COOKIE_UBICACION)?.value;
  if (!valor) return null;
  const [estado, municipio, ...resto] = valor.split("/");
  if (resto.length || !SLUG.test(estado || "") || (municipio && !SLUG.test(municipio))) return null;
  return municipio ? { estado, municipio } : { estado };
}

export function guardarUbicacion(cookies, { estado, municipio }) {
  cookies.set(COOKIE_UBICACION, municipio ? `${estado}/${municipio}` : estado, {
    path: "/",
    maxAge: UN_ANO,
    sameSite: "lax",
    secure: true,
  });
}

/** Dirección de la portada para una ubicación. */
export function rutaUbicacion({ estado, municipio }) {
  return municipio ? `/${estado}/${municipio}` : `/${estado}`;
}

/** Municipios donde Lokl ya funciona, con su estado. */
export async function municipiosActivos() {
  const { data, error } = await supabasePublico()
    .from("municipios")
    .select("nombre, slug, estados!inner(nombre, slug)")
    .eq("activo", true)
    .order("nombre");
  if (error) throw error;
  return data.map((m) => ({ nombre: m.nombre, slug: m.slug, estado: m.estados }));
}

export async function todosLosEstados() {
  const { data, error } = await supabasePublico().from("estados").select("nombre, slug").order("nombre");
  if (error) throw error;
  return data;
}

export async function buscarEstado(slug) {
  const { data } = await supabasePublico().from("estados").select("id, nombre, slug").eq("slug", slug).maybeSingle();
  return data;
}

export async function buscarMunicipio(estadoSlug, municipioSlug) {
  const { data } = await supabasePublico()
    .from("municipios")
    .select("id, nombre, slug, activo, estados!inner(nombre, slug)")
    .eq("slug", municipioSlug)
    .eq("estados.slug", estadoSlug)
    .maybeSingle();
  return data ? { ...data, estado: data.estados } : null;
}
