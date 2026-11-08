# Identidad visual de Lokl — propuesta v1

Abre `index.html` en el navegador (doble clic) para ver la guía completa.

## Contenido

| Carpeta / archivo | Qué es |
|---|---|
| `index.html` | Guía visual: logo, paleta, íconos, ejemplos y reglas |
| `paleta.css` | Los colores como variables CSS (modo claro y oscuro), listos para la app |
| `logo/lokl-logo.svg` | Logo principal (fondos claros) |
| `logo/lokl-logo-oscuro.svg` | Logo para fondos oscuros |
| `logo/lokl-logo-blanco.svg` | Logo todo blanco (sobre Atardecer o fotos) |
| `logo/lokl-logo-una-tinta.svg` | Logo a un color (sellos, impresión) |
| `logo/lokl-simbolo.svg` | El pin solo |
| `app/icono-app.svg`, `icon-192.png`, `icon-512.png` | Ícono de la app instalada (los que pide `manifest.json`) |
| `app/favicon.svg` | Ícono de la pestaña del navegador |
| `redes/perfil-pin-1080.png` | Foto de perfil Instagram / Facebook (pin, se ve bien en círculo) |
| `redes/perfil-pin-640.png` | Foto de perfil WhatsApp |
| `redes/perfil-palabra-1080.png` | Perfil con la palabra lokl (blanco sobre Atardecer) |
| `redes/perfil-palabra-arena-1080.png` | Perfil con la palabra lokl (sobre Arena) |
| `redes/historia-1080x1920.png` | Historia de Instagram / estado de WhatsApp |
| `redes/portada-1640x624.png` | Portada de Facebook / WhatsApp Business |
| `redes/logo-*-transparente.png` | Logo en alta resolución con fondo transparente (para flyers, videos, Canva) |
| `redes/simbolo-transparente.png` | Pin solo, transparente |
| `iconos/*.svg` | Íconos propios de Lokl para secciones y categorías (reemplazan los emojis) |

## Paleta

| Nombre | Hex | Uso |
|---|---|---|
| Atardecer | `#E8590C` | Marca: logo, íconos, detalles grandes |
| Atardecer oscuro | `#B5450B` | Botones principales con texto blanco |
| Sabana | `#14614A` | Confianza: enlaces, "Abierto", Verificado |
| Araguaney | `#FFC233` | Precios y ofertas (siempre con texto Tinta) |
| Tinta | `#1C1A17` | Texto principal |
| Piedra | `#6B655C` | Texto secundario |
| Arena | `#FAF6EF` | Fondo de la app |
| Línea | `#E8E1D5` | Bordes |

## Cómo dibujar un ícono nuevo
Cuadrícula de 24×24, `stroke-width="1.8"`, puntas y uniones redondeadas, `stroke="currentColor"` (toma el color del texto donde se use). Copia cualquier archivo de `iconos/` como base.

## Pendiente
Esta carpeta es una propuesta. Cuando la apruebes, los colores y los íconos se conectan a la app durante el rediseño modular. Para pulir el logo con otra herramienta (por ejemplo Claude Design), usa estos SVG como punto de partida.
