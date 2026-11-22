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
