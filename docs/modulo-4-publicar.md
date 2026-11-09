# Módulo 4 — Publicar

**Estado:** 🛠️ código listo, `sql/06` corrido el 9/11/2026; falta probar en el teléfono.

## Decisiones de Irma (8/11/2026)

- Solo los **clasificados** vencen (30 días) y se renuevan con un toque. Tiendas, comida, al mayor y servicios no vencen: se marcan **"agotado"** y siguen en la tienda, al final.
- Hasta **3 fotos** por publicación.
- Precio **opcional**, en dólares o bolívares, **exacto** como lo escribe el vendedor. Sin precio se muestra "Pregunta el precio".

## Pantallas

| Dirección | Qué hace | JavaScript |
|---|---|---|
| `/panel/publicar` | Fotos (comprimidas en el teléfono: ~120 KB la grande, ~25 KB la miniatura), nombre, precio y moneda, descripción. Una sola pantalla. Con `?id=N` edita y permite quitar fotos | ~12 KB (solo las fotos) |
| `/panel/publicaciones` | Mis publicaciones: estado en palabras simples (Publicado, Agotado, Vencido, Vendido, En revisión), Ver, Editar, Marcar agotado / Hay de nuevo, Ya lo vendí, Renovar, Borrar (pide confirmar). Después de publicar: "Compartirlo en WhatsApp" | 0 KB |
| `/p/<número>` | Ficha pública: fotos (se deslizan), nombre, precio, descripción, "Lo quiero: escribir por WhatsApp" y la tienda | 0 KB |
| `/<enlace>` | La tienda ahora muestra sus productos en cuadrícula (miniaturas, disponibles primero) | 0 KB |
| `/c/<enlace>/whatsapp?p=<número>` | El mensaje de WhatsApp ya dice qué producto le interesa, y el contacto queda contado para ese producto | — |

## Reglas que pone la base (`sql/06`)

- El vendedor no puede sacar de revisión lo que Lokl ocultó o frenó, ni cambiarse de sección, ni alargar un clasificado más de 30 días.
- Toda publicación nace "publicada"; el filtro de palabras puede mandarla a revisión.
- Las fotos solo las maneja el dueño de la publicación (o la administración).

## Pendiente

- ✅ `sql/06` corrido el 9/11/2026.
- Probar en el teléfono: publicar con 3 fotos, editar, quitar una foto, agotado, borrar, ficha y WhatsApp desde la ficha.
- Medir el peso real de la ficha y de la tienda con productos.
- La categoría de cada publicación queda vacía por ahora (se usará con el buscador).
