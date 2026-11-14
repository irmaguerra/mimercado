# Módulo 7 — Servicios (páginas amarillas)

**Estado:** 🛠️ publicado · `sql/09` corrido · falta probar en el teléfono · 14 de noviembre de 2026

## Decisiones de Irma (14/11/2026)

| # | Decisión |
|---|---|
| 22 | La **galería (hasta 6 fotos)** y las **formas de pago** son para todas las tiendas, no solo servicios |
| 23 | Los servicios usan el mismo botón de Abrir/Cerrar, que para ellos dice **"Estoy disponible / No estoy disponible"**. En su página y en las listas aparece **"Disponible ahora"** |
| 24 | Formas de pago: Pago móvil · Efectivo en dólares · Efectivo en bolívares · Transferencia · Punto de venta · Zelle · Binance |
| 25 | Los servicios marcan **a qué sectores van**, con el atajo "Todo San Fernando". Quien va a tu sector sale primero (**ordena, no esconde**) |
| 26 | Filtros **"A domicilio"** y **"24 horas"** en la lista de Servicios |

## Pantallas

| Dirección | Qué hace | JavaScript |
|---|---|---|
| `/panel/mas` ("Más sobre mi tienda") | Galería de hasta 6 fotos (comprimidas en el teléfono) y formas de pago. Los servicios además marcan sus sectores, "Atiendo las 24 horas" y sus precios de referencia | ~12 KB, solo para las fotos |
| `/panel` | Enlace a "Más sobre mi tienda". En los servicios, el botón dice "Estoy disponible / No estoy disponible" | ~0,3 KB |
| `/panel/tienda` | Si atiende 24 horas, el horario dice "las 24 horas" | — |
| `/<enlace>` (la tienda) | Galería en miniaturas (cada foto se abre en grande al tocarla), "Pagos: …", "Va a: …", "Las 24 horas", recuadro de **Precios de referencia** y "Disponible ahora" en los servicios | 0 KB |
| `/apure/san-fernando/servicios` | Botones **A domicilio** y **24 horas**, y en cada tarjeta las etiquetas "24 horas" y "A domicilio" | 0 KB |

**Para gastar pocos datos**, la galería muestra miniaturas de ~25 KB y la foto grande (~120 KB) solo se descarga si la tocas.

## Detalles

- **24 horas = sin horario:** al marcarlo se borra el horario y la tienda sale siempre disponible, salvo que el vendedor toque "No estoy disponible".
- Los **precios de referencia** entran en el buscador: "carrera centro" encuentra al moto taxi que los escribió.
- "Todo San Fernando" marca los sectores que existen hoy. Si después se aprueba un sector nuevo, el vendedor debe volver a marcar "Todo San Fernando" para incluirlo.

## Pendiente

1. ✅ `sql/09` corrido el 14/11/2026.
2. Subir el código y **probar en el teléfono** con una cuenta de **servicio** y otra de **tienda**:
   - Subir 2 o 3 fotos a la galería, quitar una y verlas en la página pública.
   - Marcar formas de pago y verlas en la página.
   - Con el servicio: marcar sectores (y "Todo San Fernando"), "24 horas" y precios de referencia.
   - Revisar que el botón diga "Estoy disponible" y que la página diga "Disponible ahora".
   - En Servicios, probar los botones "A domicilio" y "24 horas".
   - Buscar algo que esté escrito en los precios de referencia.
