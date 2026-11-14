// Secciones, categorías, listados y buscador (Módulo 5).
// Regla: la ubicación ORDENA, no esconde.

/** Máximo de categorías que puede marcar una tienda (decisión 15, 14/11/2026). Igual que en la base. */
export const MAX_CATEGORIAS = 10;

/**
 * Las 5 secciones públicas. `slug` va en la dirección (/apure/san-fernando/al-mayor),
 * `clave` es el valor en la base. `lista` dice qué se muestra: tiendas o productos (decisión 12).
 */
export const SECCIONES = [
  { slug: "tiendas", clave: "tiendas", icono: "tiendas", nombre: "Tiendas", detalle: "Negocios de la zona", lista: "tiendas" },
  { slug: "comida", clave: "comida", icono: "comida", nombre: "Comida", detalle: "La feria de comida", lista: "tiendas" },
  { slug: "al-mayor", clave: "al_mayor", icono: "al-mayor", nombre: "Al mayor", detalle: "Precios de origen", lista: "tiendas" },
  { slug: "servicios", clave: "servicios", icono: "servicios", nombre: "Servicios", detalle: "Oficios, salud, transporte…", lista: "tiendas" },
  { slug: "clasificados", clave: "clasificados", icono: "clasificados", nombre: "Clasificados", detalle: "Ventas de una vez", lista: "productos" },
];

export const seccionPorSlug = (slug) => SECCIONES.find((s) => s.slug === slug) ?? null;
export const seccionPorClave = (clave) => SECCIONES.find((s) => s.clave === clave) ?? null;

/** Cómo se llaman las tiendas en cada sección ("3 puestos", "5 negocios"). */
export const NOMBRE_TIENDAS = {
  tiendas: ["negocio", "negocios"],
  comida: ["puesto", "puestos"],
  al_mayor: ["productor", "productores"],
  servicios: ["servicio", "servicios"],
  clasificados: ["anuncio", "anuncios"],
};

export function contar(n, clave) {
  const [uno, varios] = NOMBRE_TIENDAS[clave] ?? ["resultado", "resultados"];
  return `${n} ${n === 1 ? uno : varios}`;
}

/**
 * Convierte la lista plana de categorías de una sección en árbol:
 * [{ id, nombre, slug, hijos: [...] }]. Las de primer nivel van en su orden.
 */
export function arbolCategorias(filas = []) {
  const orden = (a, b) => (a.orden ?? 0) - (b.orden ?? 0) || a.nombre.localeCompare(b.nombre, "es");
  const raices = filas.filter((c) => !c.padre_id).sort(orden).map((c) => ({ ...c, hijos: [] }));
  const porId = new Map(raices.map((c) => [c.id, c]));
  for (const c of [...filas].sort(orden)) if (c.padre_id && porId.has(c.padre_id)) porId.get(c.padre_id).hijos.push(c);
  return raices;
}

/** Categorías que se pueden marcar: las hojas (subcategorías, o la categoría si no tiene). */
export function categoriasMarcables(arbol) {
  return arbol.flatMap((c) => (c.hijos.length ? c.hijos : [c]));
}

/** Ids a buscar para una categoría: ella misma y sus subcategorías. */
export function idsDeCategoria(cat) {
  return cat ? [cat.id, ...(cat.hijos ?? []).map((h) => h.id)] : null;
}

/**
 * Lee las categorías marcadas en un formulario, solo las permitidas.
 * @returns {{ ids: number[], error?: string }}
 */
export function leerCategorias(formData, permitidas) {
  const validas = new Set(permitidas.map((c) => c.id));
  const ids = [...new Set(formData.getAll("categoria").map(Number))].filter((id) => validas.has(id));
  if (ids.length > MAX_CATEGORIAS) return { ids, error: `Puedes marcar hasta ${MAX_CATEGORIAS} categorías. Marcaste ${ids.length}.` };
  return { ids };
}

/**
 * Agrupa los resultados del buscador por sección, en el orden en que aparece
 * el mejor resultado de cada una. Dentro de cada grupo separa tiendas y productos.
 */
export function agruparResultados(filas = []) {
  const grupos = new Map();
  for (const r of filas) {
    const clave = r.seccion ?? "otros";
    if (!grupos.has(clave)) grupos.set(clave, { clave, seccion: seccionPorClave(clave), tiendas: [], productos: [] });
    grupos.get(clave)[r.tipo === "vendedor" ? "tiendas" : "productos"].push(r);
  }
  return [...grupos.values()];
}

/** De a 30, igual que los productos de la tienda; ?ver= dice cuántos (30, 60, 90…). */
import { cuantosVer, PRODUCTOS_POR_PAGINA as POR_PAGINA } from "./publicacion.js";
export { cuantosVer, POR_PAGINA };

/** Lee el lugar de ?lugar=estado/municipio (o solo estado). */
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export function leerLugar(valor) {
  const [estado, municipio, ...resto] = String(valor || "").split("/");
  if (resto.length || !SLUG.test(estado || "") || (municipio && !SLUG.test(municipio))) return null;
  return municipio ? { estado, municipio } : { estado };
}

// ---------------------------------------------------------------------
// Consultas a la base
// ---------------------------------------------------------------------

/** Categorías activas de una sección, ya en árbol. */
export async function categoriasDeSeccion(sb, clave) {
  const { data, error } = await sb
    .from("categorias")
    .select("id, nombre, slug, padre_id, orden")
    .eq("seccion", clave)
    .eq("activa", true);
  if (error) console.error("categoriasDeSeccion", error);
  return arbolCategorias(data ?? []);
}

/** Sectores activos de un municipio, por nombre. */
export async function zonasDeMunicipio(sb, municipioId) {
  const { data } = await sb.from("zonas").select("id, nombre, slug").eq("municipio_id", municipioId).eq("activa", true).order("nombre");
  return data ?? [];
}

/** Pide uno de más para saber si hay que mostrar "Ver más". */
export async function listarVendedores(sb, { municipioId, seccion, categorias = null, zonaId = null, limite = POR_PAGINA, aDomicilio = false, h24 = false }) {
  const { data, error } = await sb.rpc("listar_vendedores", {
    p_municipio_id: municipioId, p_seccion: seccion, p_categorias: categorias, p_zona_id: zonaId, p_limite: limite + 1,
    p_a_domicilio: aDomicilio, p_24h: h24,
  });
  if (error) console.error("listar_vendedores", error);
  const lista = data ?? [];
  return { filas: lista.slice(0, limite), hayMas: lista.length > limite };
}

export async function listarPublicaciones(sb, { municipioId, seccion = null, categorias = null, zonaId = null, limite = POR_PAGINA, soloConFoto = false }) {
  const { data, error } = await sb.rpc("listar_publicaciones", {
    p_municipio_id: municipioId, p_seccion: seccion, p_categorias: categorias, p_zona_id: zonaId,
    p_limite: limite + 1, p_solo_con_foto: soloConFoto,
  });
  if (error) console.error("listar_publicaciones", error);
  const lista = data ?? [];
  return { filas: lista.slice(0, limite), hayMas: lista.length > limite };
}
