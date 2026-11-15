// Isla de Preact para /panel/publicar y la galería de /panel/mas: comprime las fotos EN EL TELÉFONO (de ~3 MB a ~120 KB)
// y envía el formulario. Sin JavaScript, el formulario igual funciona con las fotos originales.
import { useEffect, useRef, useState } from "preact/hooks";
import { comprimirImagen } from "@/lib/imagen.js";
import { guardarEnCola, enviarPendientes } from "@/lib/cola-envios.js";

export default function FotosPublicacion({ maximo = 3, ocupadas = 0, enviando: textoEnviando = "Publicando…", nota = "La primera es la principal." }) {
  const raiz = useRef(null);
  const [fotos, setFotos] = useState([]); // { grande, miniatura, extension, vista }
  const [estado, setEstado] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [guardadoSinSenal, setGuardadoSinSenal] = useState(false);

  // Si se guardó sin señal y vuelve la conexión con esta pantalla abierta, se envía ya
  useEffect(() => {
    if (!guardadoSinSenal) return;
    const alVolver = async () => {
      setEstado("Volvió la señal: publicando…");
      const n = await enviarPendientes().catch(() => 0);
      if (n > 0) location.href = "/panel/publicaciones?ok=publicada";
      else setEstado("Sigue guardado en tu teléfono. Se publicará cuando haya buena señal.");
    };
    addEventListener("online", alVolver);
    return () => removeEventListener("online", alVolver);
  }, [guardadoSinSenal]);
  const fotosRef = useRef(fotos);
  fotosRef.current = fotos;

  // Cuántas fotos ya tiene (al editar) y cuántas marcó para quitar
  const [libres, setLibres] = useState(maximo - ocupadas);
  useEffect(() => {
    const form = raiz.current.closest("form");
    const contar = () => {
      const quitadas = form.querySelectorAll('input[name="quitar_foto"]:checked').length;
      setLibres(maximo - ocupadas + quitadas);
    };
    form.addEventListener("change", contar);

    async function enviar(e) {
      e.preventDefault();
      const datos = new FormData(form);
      datos.delete("foto");
      for (const f of fotosRef.current) {
        datos.append("foto", new File([f.grande], `foto.${f.extension}`, { type: f.grande.type }));
        datos.append("mini", new File([f.miniatura], `mini.${f.extension}`, { type: f.miniatura.type }));
      }
      setEnviando(true);
      setEstado(textoEnviando);
      const destino = form.action || location.href;
      // Sin señal: se guarda en el teléfono y se envía solo cuando vuelva (decisión 38)
      const guardarSinSenal = async () => {
        try {
          await guardarEnCola(destino, datos, String(datos.get("titulo") || ""));
          setGuardadoSinSenal(true);
          setEstado("No hay señal. Lo guardamos en tu teléfono: se publicará solo cuando vuelva la conexión (o la próxima vez que abras Lokl con señal).");
        } catch {
          setEstado("No hay conexión y no se pudo guardar en el teléfono. Intenta de nuevo cuando tengas señal.");
          setEnviando(false);
        }
      };
      if (navigator.onLine === false) { await guardarSinSenal(); return; }
      try {
        const r = await fetch(destino, { method: "POST", body: datos, headers: { accept: "application/json" } });
        const j = await r.json();
        if (j.ok) { location.href = j.ir; return; }
        // Se guardó pero algo falló (ej. una foto): seguir editando esa misma publicación
        if (j.ir) { location.href = `${j.ir}&error=${encodeURIComponent(j.mensaje)}`; return; }
        setEstado(j.mensaje || "No se pudo publicar. Intenta de nuevo.");
      } catch {
        await guardarSinSenal();
        return;
      }
      setEnviando(false);
    }
    form.addEventListener("submit", enviar);
    return () => { form.removeEventListener("submit", enviar); form.removeEventListener("change", contar); };
  }, []);

  // El botón de enviar muestra que está trabajando
  useEffect(() => {
    const boton = raiz.current.closest("form").querySelector('button[type="submit"]');
    if (!boton) return;
    if (enviando) { boton.dataset.antes = boton.textContent; boton.disabled = true; boton.textContent = textoEnviando; }
    else if (boton.dataset.antes) { boton.disabled = false; boton.textContent = boton.dataset.antes; }
  }, [enviando]);

  async function alElegir(e) {
    const archivos = [...(e.currentTarget.files ?? [])];
    e.currentTarget.value = "";
    const espacio = libres - fotosRef.current.length;
    if (archivos.length > espacio) setEstado(`Puedes poner hasta ${maximo} fotos.`);
    const elegidos = archivos.slice(0, Math.max(0, espacio));
    if (!elegidos.length) return;
    setEstado("Preparando tus fotos…");
    const nuevas = [];
    for (const a of elegidos) {
      const c = await comprimirImagen(a);
      nuevas.push({ ...c, vista: URL.createObjectURL(c.miniatura) });
    }
    setFotos((antes) => [...antes, ...nuevas]);
    setEstado("");
  }

  function quitar(i) {
    setFotos((antes) => antes.filter((_, j) => j !== i));
  }

  const puedeAgregar = fotos.length < libres;
  return (
    <div ref={raiz} class="fotos-publicar">
      {fotos.length > 0 && (
        <ul class="fotos-nuevas">
          {fotos.map((f, i) => (
            <li key={f.vista}>
              <img src={f.vista} alt="" width="96" height="96" />
              <button type="button" class="boton-texto" onClick={() => quitar(i)}>Quitar</button>
            </li>
          ))}
        </ul>
      )}
      {puedeAgregar && (
        <label class="boton boton-claro ancho">
          {fotos.length || ocupadas ? "Agregar otra foto" : "Agregar fotos"}
          <input type="file" name="foto" accept="image/*" multiple onChange={alElegir} class="oculto-visual" />
        </label>
      )}
      <small class="texto-2">Hasta {maximo} fotos. {nota}</small>
      {estado && <p class="texto-2" style="font-size:14px;margin:4px 0 0" role="status">{estado}</p>}
    </div>
  );
}
