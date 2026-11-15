# Configurar el correo de Lokl con Brevo

**Para qué:** que los correos de "Activa tu cuenta" y "Olvidé mi contraseña" les lleguen a todos, no solo al equipo de Supabase (decisión 4). Brevo es gratis hasta 300 correos por día.

**Reglas:**
- En Namecheap **solo se agregan registros nuevos**. No se borra ni se cambia nada de lo que ya existe (el reenvío de correo de usalokl.com sigue igual).
- Las claves (la de Brevo y las de Supabase) **no se le pasan a nadie**: se copian directo de una página a la otra.

## Parte 1 · Cuenta de Brevo (necesita el teléfono)

1. Entrar a **brevo.com** → **Sign up free** y registrarse con **usalokl.app@gmail.com**.
2. Confirmar el correo y el número de teléfono (llega un código por SMS).
3. Si pregunta por la empresa: nombre **Lokl**, país **Venezuela**. Si pregunta el uso: correos de la aplicación (transaccionales).

## Parte 2 · Autorizar el dominio usalokl.com

1. En Brevo, arriba a la derecha: el nombre de la cuenta → **Senders, Domains & Dedicated IPs** → pestaña **Domains** → **Add a domain**.
2. Escribir **usalokl.com** y elegir **"Authenticate the domain yourself"** (hacerlo uno mismo).
3. Brevo muestra 3 o 4 registros, cada uno con **Type**, **Host/Name** y **Value**. Dejar esa pestaña abierta.
4. En otra pestaña: **Namecheap** → **Domain List** → **Manage** al lado de usalokl.com → pestaña **Advanced DNS**.
5. Por cada registro de Brevo: **Add New Record** → elegir el mismo **Type** (TXT o CNAME) → en **Host** pegar solo la primera parte, **sin** ".usalokl.com" (ej. `brevo1._domainkey`, `_dmarc`, o `@` si Brevo dice usalokl.com) → en **Value** pegar el valor completo → ✓ para guardar.
6. **Cuidado con SPF:** si Brevo pide un registro TXT que empieza con `v=spf1` y en Namecheap **ya hay otro** `v=spf1…`, **no se agrega uno segundo**: se avisa y se combinan los dos en uno solo.
7. Volver a Brevo y tocar **Authenticate this email domain**. Puede tardar de minutos a unas horas; si dice que falta, esperar y tocar de nuevo.

## Parte 3 · Remitente y clave SMTP

1. Brevo → **Senders, Domains & Dedicated IPs** → **Senders** → **Add sender**: nombre **Lokl**, correo **no-responder@usalokl.com**.
2. Brevo → nombre de la cuenta → **SMTP & API** → pestaña **SMTP** → **Generate a new SMTP key** → nombre "Supabase Lokl" → **copiar la clave** (solo se muestra una vez). En esa misma página está el **Login** (algo como `xxxx@smtp-brevo.com`).

## Parte 4 · Conectar Supabase

1. Supabase → proyecto de Lokl → **Authentication** → **Emails** → pestaña **SMTP Settings** → activar **Enable Custom SMTP**:
   - Sender email: `no-responder@usalokl.com`
   - Sender name: `Lokl`
   - Host: `smtp-relay.brevo.com`
   - Port: `587`
   - Username: el **Login** de Brevo
   - Password: la **clave SMTP** que copiaste
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

Cuando funcione, cambiar en la tabla "Configuración pendiente" de `docs/modulo-3-cuenta-tienda.md` el punto 2 a ✅.
