# Módulo 10B — Lokl Súper: carrito y pedidos

**Estado:** ✅ probado por Irma el 15/11/2026 (sql/15 corrido, pedido de prueba hecho). Módulo 10 completo.

## Decisiones de Irma (15/11/2026): 54 a 63

- WhatsApp de pedidos **0424-3232671** · **todos los días 7:30 am a 8:00 pm** · pagos **solo digitales** (pago móvil, transferencia, Zelle, Binance).
- Fuera de horario: "Cerrado ahora · Abrimos a las 7:30 am"; el pedido se recibe y se atiende al día siguiente.
- Carrito en el teléfono, sin cuenta. Pago **después de confirmar** (el Súper manda los datos de pago por WhatsApp).
- Envío: casco central gratis desde $20, si no $1; otras zonas "por confirmar"; mínimo $5 (decisiones 51 y 52).
- Tablero de pedidos, "Repetir pedido", `/super` abierto al público y Súper primero en el buscador.

## Pantallas

| Dirección | Qué hace | JavaScript |
|---|---|---|
| `/super` | Catálogo por pasillos y buscador, "Abierto/Cerrado", botón **Agregar** y **− 2 +**, barra **Ver pedido** con cantidad y total. Cacheada 60 s | ~1,3 KB en línea |
| `/super/pedido?c=…` | Revisar el carrito con los precios de hoy (− y + funcionan sin JavaScript), total en $ y Bs, lo que falta para el envío gratis, mínimo $5, y el formulario | ~0,6 KB en línea (recuerda los datos) |
| `/super/pedido/listo?id=` | "Pedido #27 listo" + botón **Enviar pedido por WhatsApp** con el mensaje armado | casi 0 (vacía el carrito) |
| `/super/mis-pedidos` | Últimos 10 pedidos del teléfono con su estado y **Repetir pedido** | 0 KB |
| `/buscar?q=harina` | Arriba: **En Lokl Súper** (hasta 4 productos) en San Fernando o sin lugar | 0 KB |
| `/admin/super/pedidos` | Tablero: por atender / entregados / cancelados / todos; botón de WhatsApp al cliente; botón para pasar al siguiente estado; cancelar; vendido en 7 días y **de dónde piden** | 0 KB |

## Seguridad

- El teléfono solo manda **qué productos y cuántos**; precios, envío y total salen de la base (`super_crear_pedido`).
- Nadie más que el admin ve los pedidos. Cada teléfono ve solo los suyos (código anónimo en una cookie privada).
- Límites: 5 pedidos por hora por teléfono y 10 por día por número de WhatsApp.
- Límite conocido: alguien con conocimientos técnicos podría crear pedidos falsos con números inventados; se ven en el tablero y se cancelan.

## Pasos para Irma

1. Supabase → **SQL Editor** → **New query** → pegar **todo** `sql/15-modulo-10b-super-pedidos.sql` → **Run**.

## Pruebas

- [x] `usalokl.com/super`: Agregar productos, usar − y +, ver la barra "Ver pedido".
- [x] Ver pedido: cambiar cantidades, ver el total y "Te faltan $X para el envío gratis".
- [x] Hacer el pedido → "Pedido listo" → **Enviar por WhatsApp** → llega al 0424-3232671.
- [x] Admin → Lokl Súper → **Pedidos**: verlo, pasarlo por los estados, escribirle al cliente.
- [x] **Mis pedidos** → **Repetir pedido**.
- [x] Buscar "harina" en el buscador general: sale primero "En Lokl Súper".
- [x] Un pedido de "Otra zona": el mensaje dice "Envío: por confirmar".
