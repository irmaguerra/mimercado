# Módulo 11 — Pedir presupuesto a varios

**Estado:** ✅ aprobado por Irma el 21/11/2026 (prueba completa en la computadora: cliente en incógnito, vendedor y admin). Pendiente con teléfono: comprobar que llegan los avisos.

## Decisiones de Irma (16/11/2026): 64 a 73

- Cualquiera pide **sin cuenta**: qué necesita, una foto opcional, categoría, sector, nombre y WhatsApp.
- El WhatsApp del cliente **no les llega a los vendedores**: responden en Lokl y el cliente elige a quién escribir.
- Lo reciben **hasta 8 negocios** de esa categoría en el municipio: primero los de su sector y los verificados. Si hay más de 8, se reparte entre quienes recibieron menos esa semana. Tiendas, Comida, Al mayor y Servicios; **Clasificados no**.
- **Vence a los 3 días**; antes, el cliente puede tocar **"Ya lo conseguí"**.
- El vendedor responde con **precio o "desde $X"** y un mensaje corto. Puede corregir mientras siga abierto. **"No lo tengo"** lo quita de su lista. Puede pausar "Recibir pedidos".
- El cliente ve las respuestas **de menor a mayor precio**, con la tienda, verificado, estrellas y botón de WhatsApp con el mensaje ya escrito.
- **Avisos gratis en el teléfono**: al vendedor cuando le piden algo y al cliente con la primera respuesta de cada negocio. En Android funcionan desde el navegador; en iPhone, con Lokl instalada.
- Máximo **3 pedidos por día** por teléfono, **palabras prohibidas** (las de "revisar" frenan el pedido hasta que el admin lo apruebe) y **reportes**.
- Botón **"Pide presupuesto a varios"** en la portada, en cada listado y en el buscador sin resultados. Si no hay negocios se dice con honestidad, y el admin lo ve como **demanda sin atender**.

## Pantallas

| Dirección | Qué hace | Peso (comprimido) |
|---|---|---|
| `/presupuesto` | Formulario. Si viene de un listado ya trae la categoría y dice a cuántos negocios les llegará. Achica la foto en el teléfono antes de enviarla | 9,7 KB (~1,5 KB de JS en línea) |
| `/presupuesto/<id>` | El pedido, cuántos lo vieron, las respuestas de menor a mayor precio, **Escribirle** por WhatsApp, **Reportar**, **Avísame cuando me respondan**, **Ya lo conseguí** | ~7 KB |
| `/presupuesto/mios` | "Mis presupuestos": los últimos 20 del teléfono | 7,3 KB |
| `/panel/presupuestos` | Vendedor: recibir o pausar, activar avisos, pedidos abiertos con su formulario de precio, **No lo tengo**, **Reportar**, cerrados y vencidos | sin caché |
| `/panel` | Tarjeta "N clientes te piden presupuesto" y entrada en el menú | — |
| `/admin/presupuestos` | Lo que piden por categoría: sin negocios que lo reciban y sin respuesta (7, 30 o 90 días) y los últimos pedidos, sin datos de los clientes | — |
| `/admin/revisar` | Pedidos frenados por el filtro o reportados por negocios, y respuestas reportadas por clientes | — |

El botón de WhatsApp pasa por `/c/<tienda>/whatsapp?pr=<id>`: cuenta el contacto en el panel del vendedor y escribe *"Hola, vi tu presupuesto de $25 en Lokl para: …"*.

## Avisos en el teléfono (cómo funcionan)

- Hechos a mano con el estándar Web Push (sin librerías ni servicios pagos): `src/lib/push.js`, comprobado contra la implementación de referencia.
- El teléfono se suscribe con la **llave pública** (está en el código). Lokl firma cada aviso con la **llave privada**, que es un secreto de Cloudflare llamado `VAPID_PRIVADA`. Sin ese secreto todo funciona igual, pero sin avisos.
- Si un teléfono ya no existe (desinstaló, quitó el permiso), el servicio lo dice y Lokl lo olvida solo.

## Seguridad

- La tabla de pedidos no se puede leer ni escribir directo: todo pasa por funciones de la base con sus límites.
- Cada teléfono ve solo sus pedidos (código anónimo en una cookie privada). El vendedor ve solo los que le llegaron, con el **primer nombre** del cliente, sin su número.
- La foto solo se puede subir en los 15 minutos después de crear el pedido, a su propia carpeta (máximo 2 MB).
- Límite conocido: como en el Súper, alguien con conocimientos técnicos podría inventar pedidos con números falsos. El límite diario y los reportes de los negocios lo frenan.

## Pasos para Irma

1. Supabase → **SQL Editor** → **New query** → pegar **todo** `sql/16-modulo-11-presupuestos.sql` → **Run**.
2. Guardar la llave de los avisos en Cloudflare (una sola vez):
   1. En la terminal de Claude escribe `! notepad .dev.vars`. Se abre el Bloc de notas con una línea `VAPID_PRIVADA=...`. Copia **solo lo que va después del `=`**.
   2. dash.cloudflare.com → **Workers & Pages** → **lokl** → **Settings** → **Variables and Secrets** → **+ Add**.
   3. Type: **Secret** · Variable name: `VAPID_PRIVADA` · Value: pegar lo copiado → **Deploy**.

## Pruebas

- [x] En un listado (por ejemplo Comida → Pizza) tocar **Pide presupuesto a varios**, llenarlo y enviarlo.
- [ ] Ver el pedido en **Mis presupuestos**; tocar **Activar avisos**.
- [x] Con la cuenta de una tienda de esa categoría: **Mi tienda → Pedidos de presupuesto**, activar avisos y responder con un precio.
- [x] (Aviso pendiente de probar en teléfono) El cliente ve la respuesta y toca **Escribirle** (abre WhatsApp con el mensaje).
- [x] Admin → **Pedidos de presupuesto**: aparece el pedido.
