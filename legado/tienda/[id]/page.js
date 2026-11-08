// BUILD:1783845000
// Ruta dinámica /tienda/[id] — Server Component (App Router, Next 14.2.3)
// Objetivo: preview de WhatsApp con el logo/nombre de cada tienda.
// Versión simplificada y robusta: sin <script>, redirect por meta-refresh (HTML puro).
// NO toca page.js.

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://cdiuboyklymirssxperd.supabase.co";
const SUPABASE_KEY = "sb_publishable_WkUnC5ElLD9xRbhzG_OKFw_13gOTwGk";
const SITE_URL = "https://usalokl.com";
const LOGO_FALLBACK = SITE_URL + "/icon-512.png";

async function getProveedor(id) {
  try {
    const url =
      SUPABASE_URL +
      "/rest/v1/proveedores" +
      "?select=id,negocio,logo_url,tipo_negocio,descripcion_negocio" +
      "&aprobado=eq.true&suscripcion_activa=eq.true" +
      "&id=eq." + encodeURIComponent(id) +
      "&limit=1";
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data[0];
  } catch (e) {
    return null;
  }
}

function logoAbsoluto(logoUrl) {
  if (!logoUrl || typeof logoUrl !== "string") return LOGO_FALLBACK;
  const u = logoUrl.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return SITE_URL + u;
  return LOGO_FALLBACK;
}

function tabParaProveedor(tipoNegocio) {
  if (tipoNegocio === "Tienda / Negocio local") return "Negocios locales";
  return "Feria de comida";
}

function deepLink(prov) {
  const tab = tabParaProveedor(prov.tipo_negocio);
  return SITE_URL + "/?tab=" + encodeURIComponent(tab) + "&id=" + encodeURIComponent(prov.id);
}

export async function generateMetadata({ params }) {
  const prov = await getProveedor(params.id);
  if (!prov) {
    return {
      metadataBase: new URL(SITE_URL),
      title: "Lokl — San Fernando de Apure",
      description: "Compra desde tu teléfono: supermercado, comida, tiendas y servicios con delivery.",
      openGraph: {
        title: "Lokl — San Fernando de Apure",
        description: "Compra desde tu teléfono: supermercado, comida, tiendas y servicios con delivery.",
        url: SITE_URL,
        type: "website",
        images: [{ url: LOGO_FALLBACK, width: 512, height: 512 }],
      },
    };
  }
  const nombre = (prov.negocio || "Tienda en Lokl").trim();
  const desc =
    (prov.descripcion_negocio && prov.descripcion_negocio.trim()) ||
    ("Pide de " + nombre + " por Lokl. Delivery en San Fernando de Apure.");
  const img = logoAbsoluto(prov.logo_url);
  const canonical = SITE_URL + "/tienda/" + encodeURIComponent(prov.id);
  return {
    metadataBase: new URL(SITE_URL),
    title: nombre + " — Lokl",
    description: desc,
    openGraph: {
      title: nombre + " — Lokl",
      description: desc,
      url: canonical,
      type: "website",
      siteName: "Lokl",
      images: [{ url: img, width: 512, height: 512, alt: nombre }],
    },
    twitter: {
      card: "summary_large_image",
      title: nombre + " — Lokl",
      description: desc,
      images: [img],
    },
  };
}

export default async function TiendaPage({ params }) {
  const prov = await getProveedor(params.id);
  const destino = prov ? deepLink(prov) : SITE_URL + "/";
  const nombre = prov ? (prov.negocio || "la tienda").trim() : "Lokl";
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24, textAlign: "center", color: "#334155" }}>
      <meta httpEquiv="refresh" content={"0; url=" + destino} />
      <p style={{ fontSize: 16 }}>
        Abriendo {nombre}…{" "}
        <a href={destino} style={{ color: "#16a34a" }}>Toca aquí si no abre</a>
      </p>
    </div>
  );
}
