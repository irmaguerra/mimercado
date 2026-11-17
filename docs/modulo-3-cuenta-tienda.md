# Módulo 3 — Cuenta del vendedor y su tienda

**Estado:** ✅ aprobado por Irma el 8 de noviembre de 2026. Probado con DORCAS: crear tienda, logo (18 KB), vista previa con logo en WhatsApp y botón de WhatsApp. El correo (Resend) quedó funcionando el 15/11/2026. Queda pendiente entrar con Google.

## Pantallas

| Dirección | Qué hace | JavaScript |
|---|---|---|
| `/entrar` | Entrar, crear cuenta ("Crea tu tienda gratis") y "Olvidé mi contraseña". Google o correo + contraseña | 0 KB |
| `/panel/crear` | Paso 1 "¿Qué haces?" (5 opciones) y paso 2 "Tu tienda": nombre, WhatsApp, zona (o "No está mi zona"); en comida, cómo vende | 0 KB |
| `/panel/lista` | "¡Lista!": su enlace, compartir en WhatsApp, probar su WhatsApp | 0 KB |
| `/panel` | Mi tienda: Abrir/Cerrar (mismo ciclo que la app vieja), "N personas te contactaron esta semana", compartir y copiar enlace | ~0,3 KB en línea |
| `/panel/tienda` | Editar: logo (comprimido en el teléfono), nombre, enlace, descripción, WhatsApp, teléfono, zona, dirección y Maps (nunca para "desde casa"), horario, hasta dónde envía | ~12 KB (solo el logo) |
| `/<enlace>` | Página pública de la tienda con su logo en la vista previa de WhatsApp | 0 KB |
| `/c/<enlace>/whatsapp` | Cuenta el contacto y abre WhatsApp (funciona en iPhone) | — |

## Seguridad

- Las páginas con sesión nunca se guardan en caché (`private, no-store`).
- Formularios enviados desde otro sitio se rechazan.
- Después de entrar solo se vuelve a direcciones internas de Lokl.
- La base impide que un vendedor se ponga el sello de verificado, se quite una suspensión o use un enlace reservado (`sql/03`). Probado.

## Configuración pendiente en Supabase

1. **Authentication → URL Configuration**
   - Site URL: `https://lokl.usalokl-app.workers.dev`
   - Redirect URLs: `https://lokl.usalokl-app.workers.dev/**`, `https://*-lokl.usalokl-app.workers.dev/**`, `http://localhost:4321/**`
2. ✅ **Correo propio (SMTP)** — funcionando desde el 15/11/2026 (crear cuenta y recuperar contraseña probados en el teléfono): el correo de Supabase solo envía a los miembros del equipo del proyecto y unos pocos por hora. Para vendedores reales hace falta un servicio de correo. Elegido: **Resend** (gratis, 3.000 correos/mes; solo agrega registros en Namecheap, en el subdominio send.usalokl.com, sin tocar el reenvío de correo). Brevo se descartó el 15/11/2026 porque no acepta cuentas de Venezuela. Pasos en `docs/configurar-correo.md`. Mientras tanto, las cuentas de prueba se crean en Supabase → Authentication → Users → Add user → Create new user, con "Auto Confirm User" marcado.
3. **Entrar con Google** (decisiones 74-76): pasos en `docs/entrar-con-google.md`.
4. Hacer admin a la cuenta de Irma (`sql/04`, después de que se registre).
