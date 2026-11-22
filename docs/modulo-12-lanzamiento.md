# Módulo 12 · Lanzamiento

**Estado:** 🛠️ en curso. Lanzamiento público: **20 de diciembre de 2026** (decisión 78).

## Plan (aprobado 21/11/2026)

| Semana | App | Redes (primero vendedores) |
|---|---|---|
| 1 · 24–30 nov | `/vende` (enlace del perfil) | Cuentas @usalokl, perfil y 6 publicaciones base |
| 2 · 1–7 dic | `/conoce` y `/verificado` completa | Videos "cómo crear tu tienda" |
| 3 · 8–14 dic | PWA completa y medición | Primeras tiendas reales (con permiso) |
| 4 · 15–19 dic | Revisión final | Cuenta regresiva |
| 20 dic | Abre al público | Mensaje para clientes |

## Páginas

| Página | Estado | Peso (gzip) |
|---|---|---|
| `/privacidad` | ✅ publicada 21/11 (la exige Google) | ~8,1 KB, sin JS propio |
| `/vende` | ✅ aprobada por Irma 22/11 | ~8,8 KB, sin JS propio |
| `/conoce` | ✅ aprobada por Irma 22/11 (quién está detrás: "un equipo de apureños", sin nombre) | ~9,0 KB, sin JS propio |
| `/verificado` completa | ✅ aprobada 22/11 (sello gratis, pedirlo por WhatsApp; botón también en Mi tienda) | |

Textos de redes: `docs/redes-lanzamiento.md`.

## PWA (app instalable)

Ya existía: manifest, ícono con zona segura (maskable), aviso "Instala Lokl", atajos, service worker que guarda páginas, fotos y archivos, publicar sin señal y avisos.

Agregado el 22/11/2026:
- **Franja "Sin señal"** arriba de toda página que se abre desde lo guardado, con la fecha de la copia ("Precios y horarios pueden haber cambiado").
- Sin señal en **usalokl.com** (la app instalada abre "/"): muestra la **última portada de ciudad** vista en vez de la pantalla "No hay señal".
- **"No hay señal"** ahora lista hasta 20 páginas guardadas para abrirlas sin conexión.
- **"‹ Volver"** en todas las páginas (la app instalada no tiene flecha de atrás).

Prueba (teléfono): visitar la portada, una tienda y el Súper → modo avión → abrir Lokl instalado: debe verse la portada con la franja amarilla; abrir una página no visitada: "No hay señal" con la lista.

## Medición final (22/11/2026, usalokl.com en producción)

Peso que baja el teléfono por página (HTML comprimido; el CSS va dentro del HTML y no hay JavaScript externo en las páginas públicas):

| Página | Peso | Respuesta | Caché |
|---|---|---|---|
| Portada San Fernando | 9,6 KB | 0,35 s | sí |
| Sección (Comida) | 9,2 KB | 0,57 s | sí |
| Categoría (Pizza) | 9,2 KB | 0,41 s | sí |
| Tienda | 9,2 KB | 0,38 s | sí |
| Producto | 9,0 KB | 0,46 s | sí |
| Súper | 10,2 KB | 0,39 s | sí |
| Buscar | 8,7 KB | 0,88 s | no (cada búsqueda es distinta) |
| Pedir presupuesto | 10,9 KB | 0,63 s | no |
| Favoritos | 8,3 KB | 0,38 s | no |
| Entrar | 7,8 KB | 0,75 s | no (privada) |
| /vende · /conoce · /verificado · /privacidad | 9,2–10,7 KB | 0,34–0,49 s | sí |
| Sin conexión | 7,2 KB | — | guardada en el teléfono |

- De cada página, ~4,7 KB son el CSS (dentro del HTML), ~1,1 KB los íconos SVG y ~0,9 KB el poco JavaScript en línea (registrar la app, "Instala Lokl", "‹ Volver").
- Fotos: miniatura de producto ~6 KB (WebP); Súper ~5,3 KB por foto; todas con carga diferida (`loading="lazy"`).
- Islas (panel, carrito, publicar): base Preact ~10 KB comprimido, se guarda para siempre; la más grande (fotos de publicación) 2,2 KB.
- Service worker 1,4 KB.
- Tiempos medidos desde fuera de Venezuela; en Apure dependen de la señal, pero el peso es lo que más cuenta con datos móviles.

Referencia: abrir 10 páginas de Lokl ≈ 100 KB + fotos; una sola foto reenviada en un grupo de WhatsApp suele pesar 100–200 KB.

### Mejora aplicada (22/11/2026): CSS en archivo aparte
`inlineStylesheets: "never"`: un solo CSS (~4,7 KB comprimido, caché inmutable) que el teléfono baja una vez; el service worker lo guarda al instalarse para que las páginas guardadas se vean bien sin señal. Desde la segunda página: portada ~4,0 KB, Súper ~4,6 KB, /vende ~4,8 KB, /conoce ~5,3 KB, Entrar ~2,4 KB (antes 8–11 KB).
