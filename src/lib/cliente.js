// Cliente anónimo: un id guardado en el teléfono, sin cuenta ni Supabase Auth.
// Se usa para favoritos, reseñas, reportes, pedidos del Súper y presupuestos.
const CLAVE = "lokl_cliente_id";

export function obtenerClienteId() {
  try {
    let id = localStorage.getItem(CLAVE);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CLAVE, id);
    }
    return id;
  } catch {
    return null; // modo privado o almacenamiento bloqueado
  }
}
