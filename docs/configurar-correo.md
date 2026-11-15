# Configurar el correo de Lokl con Resend

**Para qué:** que los correos de "Activa tu cuenta" y "Olvidé mi contraseña" les lleguen a todos, no solo al equipo de Supabase (decisión 4).

**Servicio:** **Resend**, gratis hasta 3.000 correos al mes (100 por día). Primero se eligió Brevo, pero Brevo no acepta cuentas de Venezuela (15/11/2026).

**Reglas:**
- En Namecheap **solo se agregan registros nuevos**. No se borra ni se cambia nada de lo que ya existe (el reenvío de correo de usalokl.com sigue igual).
- Las claves (la de Resend y las de Supabase) **no se le pasan a nadie**: se copian directo de una página a la otra.

## Parte 1 · Cuenta de Resend

1. Entrar a **resend.com** → **Get started** (o Sign up).
2. Registrarse con **usalokl.app@gmail.com**. Lo más fácil es **Continue with Google**.
3. Si pregunta el nombre del equipo: **Lokl**.

## Parte 2 · Autorizar el dominio usalokl.com

1. En Resend, menú de la izquierda → **Domains** → **Add Domain**.
2. Escribir **usalokl.com**. Si pregunta la región, elegir **North Virginia (us-east-1)**, la más cerca de la base de datos. Tocar **Add**.
3. Resend muestra 3 o 4 registros (**MX**, **TXT** y, a veces, uno de DMARC), cada uno con **Type**, **Name** y **Value** (y **Priority** en el MX). Dejar esa pestaña abierta.
4. En otra pestaña: **Namecheap** → **Domain List** → **Manage** al lado de usalokl.com → pestaña **Advanced DNS**.
5. Por cada registro de Resend: **Add New Record** → el mismo **Type** → en **Host** pegar lo que dice **Name** (ej. `send`, `resend._domainkey`, `_dmarc`) **sin** ".usalokl.com" → en **Value** el valor completo → en el MX, la **Priority** (normalmente 10) → ✓ para guardar.
6. Los registros de Resend van en `send.usalokl.com` (un "subdominio"), así que **no chocan** con el reenvío de correo ni con el SPF que ya tiene usalokl.com.
7. **Si en Namecheap no aparece el tipo "MX Record"** en la lista (pasa cuando el dominio usa el reenvío de correo de Namecheap): **no cambiar "Mail Settings"**, porque eso puede apagar el reenvío. Avisar y lo resolvemos juntos.
8. Volver a Resend y tocar **Verify DNS Records**. Puede tardar de minutos a unas horas; cuando esté listo, el dominio dice **Verified**.

## Parte 3 · Clave para Supabase

1. Resend → **API Keys** → **Create API Key** → nombre `Supabase Lokl`, permiso **Sending access**, dominio **usalokl.com** → **Add**.
2. **Copiar la clave** (empieza con `re_` y solo se muestra una vez). No la guardes en ningún archivo ni se la pases a nadie: va directo a Supabase en la Parte 4.

## Parte 4 · Conectar Supabase

1. Supabase → proyecto de Lokl → **Authentication** → **Emails** → pestaña **SMTP Settings** → activar **Enable Custom SMTP**:
   - Sender email: `no-responder@usalokl.com`
   - Sender name: `Lokl`
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: la clave de Resend (la que empieza con `re_`)
   - **Save changes**.
2. Misma página → pestaña **Templates**:
   - **Confirm signup**: asunto `Activa tu cuenta de Lokl`; en el cuerpo, borrar todo y pegar `docs/correos/confirmar-cuenta.html`.
   - **Reset Password**: asunto `Crea tu contraseña nueva de Lokl`; pegar `docs/correos/recuperar-clave.html`.
3. **Authentication** → **URL Configuration** (revisar que esté así):
   - Site URL: `https://lokl.usalokl-app.workers.dev`
   - Redirect URLs: `https://lokl.usalokl-app.workers.dev/**`, `https://*-lokl.usalokl-app.workers.dev/**`, `http://localhost:4321/**`
4. **Authentication** → **Sign In / Providers** → **Email**: **Confirm email** encendido.

## Parte 5 · Probar

1. En el teléfono, en una ventana de incógnito: Lokl → **Mi cuenta** → **Crear mi cuenta gratis**, con un correo que no sea del equipo (por ejemplo, uno personal).
2. Debe llegar **"Activa tu cuenta de Lokl"** (revisar spam). Al tocar el botón, entra a Lokl y pide crear la tienda.
3. Probar **Olvidé mi contraseña** con ese correo.

Cuando funcione, marcar como ✅ el punto 2 de "Configuración pendiente" en `docs/modulo-3-cuenta-tienda.md`.
