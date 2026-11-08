// Isla de Preact: comprime el logo EN EL TELÉFONO antes de subirlo (de ~3 MB a ~100 KB).
// Sin JavaScript, el formulario igual funciona y sube la foto original.
import { useState } from "preact/hooks";
import { comprimirImagen } from "@/lib/imagen.js";

export default function SubirLogo({ logoActual, nombre }) {
  const [vista, setVista] = useState(logoActual);
  const [estado, setEstado] = useState("");

  async function alElegir(e) {
    const archivo = e.currentTarget.files?.[0];
    if (!archivo) return;
    setEstado("Preparando tu foto…");
    const { grande, extension } = await comprimirImagen(archivo);
    setVista(URL.createObjectURL(grande));
    setEstado("Subiendo…");
    const datos = new FormData();
    datos.append("foto", new File([grande], `logo.${extension}`, { type: grande.type }));
    try {
      const r = await fetch("/panel/logo", { method: "POST", body: datos, headers: { accept: "application/json" } });
      const j = await r.json();
      setEstado(j.ok ? "¡Listo! Tu logo se actualizó." : j.mensaje);
    } catch {
      setEstado("No hay conexión. Intenta de nuevo.");
    }
  }

  return (
    <form method="post" action="/panel/logo" encType="multipart/form-data" class="subir-logo">
      {vista ? <img src={vista} alt="" width="72" height="72" class="logo-tienda" />
        : <span class="logo-tienda logo-vacio" style="width:72px;height:72px">{nombre?.slice(0, 1)}</span>}
      <div>
        <label class="boton boton-claro">
          {vista ? "Cambiar logo" : "Subir logo"}
          <input type="file" name="foto" accept="image/*" onChange={alElegir} class="oculto-visual" />
        </label>
        <noscript><button type="submit" class="boton-texto">Guardar logo</button></noscript>
        {estado && <p class="texto-2" style="font-size:14px;margin:6px 0 0" role="status">{estado}</p>}
      </div>
    </form>
  );
}
