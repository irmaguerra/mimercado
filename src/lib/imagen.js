// Comprime una foto EN EL TELÉFONO antes de subirla y genera dos versiones:
//   grande:    1200 px, para la ficha   (~120 KB)
//   miniatura:  400 px, para las listas (~25 KB)
// Usa WebP cuando el navegador lo sabe codificar; Safari (iPhone) no, y ahí cae a JPEG.

const GRANDE = { lado: 1200, calidad: 0.8 };
const MINI = { lado: 400, calidad: 0.72 };

function cargarConImg(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

function cargar(file) {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => cargarConImg(file));
  }
  return cargarConImg(file);
}

function aBlob(canvas, tipo, calidad) {
  return new Promise((resolve) => canvas.toBlob(resolve, tipo, calidad));
}

async function redimensionar(fuente, { lado, calidad }) {
  const r = Math.min(1, lado / Math.max(fuente.width, fuente.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(fuente.width * r);
  canvas.height = Math.round(fuente.height * r);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(fuente, 0, 0, canvas.width, canvas.height);

  let blob = await aBlob(canvas, "image/webp", calidad);
  if (!blob || blob.type !== "image/webp") blob = await aBlob(canvas, "image/jpeg", calidad);
  return blob;
}

/**
 * @param {File} file
 * @returns {Promise<{grande: Blob, miniatura: Blob, extension: string}>}
 *   Si algo falla devuelve el archivo original en ambas: nunca bloquea la publicación.
 */
export async function comprimirImagen(file) {
  try {
    const fuente = await cargar(file);
    const grande = await redimensionar(fuente, GRANDE);
    const miniatura = await redimensionar(fuente, MINI);
    fuente.close?.();
    if (!grande || !miniatura) throw new Error("sin imagen");
    return { grande, miniatura, extension: grande.type === "image/webp" ? "webp" : "jpg" };
  } catch {
    const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
    return { grande: file, miniatura: file, extension: ext };
  }
}
