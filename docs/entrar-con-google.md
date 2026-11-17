# Entrar con Google

**Estado:** 🛠️ código listo (botón, aviso en Instagram/Facebook/TikTok). Falta que Irma cree las credenciales en Google Cloud y las pegue en Supabase. Después se publica y se prueba.

Decisiones 74 a 76 (16/11/2026):
- Botón **"Continuar con Google"** arriba en Entrar y en "Crea tu tienda gratis"; correo y contraseña siguen debajo. Mismo correo = misma cuenta.
- En el navegador de Instagram, Facebook o TikTok Google no deja entrar ("disallowed_useragent"): Lokl lo detecta (`navegadorDeApp` en `src/lib/sesion.js`) y explica cómo abrir Chrome o Safari.
- La pantalla de Google dice "Continuar a qzhfvsornkoakdeubstv.supabase.co" con el nombre Lokl. Cambiarlo a usalokl.com requiere el dominio propio de Supabase (pago).

## Datos que se usan

| Dónde | Valor |
|---|---|
| Cuenta de Google | usalokl.app@gmail.com |
| Orígenes de JavaScript autorizados | `https://usalokl.com` |
| URI de redireccionamiento autorizado | `https://qzhfvsornkoakdeubstv.supabase.co/auth/v1/callback` |
| Dominio autorizado (pantalla de consentimiento) | `usalokl.com` |

El **ID de cliente** y el **secreto de cliente** se pegan directo en Supabase; nunca en el chat ni en el código.

## Paso 1 · Google Cloud

1. Abrir **console.cloud.google.com** con la cuenta usalokl.app@gmail.com. Si pide aceptar condiciones, aceptar.
2. Arriba a la izquierda, junto al logo, tocar el selector de proyecto → **Proyecto nuevo** → nombre **Lokl** → **Crear**. Esperar y elegir el proyecto Lokl en el selector.
3. En el buscador de arriba escribir **Google Auth Platform** y abrirlo → **Comenzar** (Get started):
   1. Nombre de la app: **Lokl**. Correo de asistencia: usalokl.app@gmail.com → **Siguiente**.
   2. Público: **Externo** → **Siguiente**.
   3. Información de contacto: usalokl.app@gmail.com → **Siguiente**.
   4. Marcar que acepta la política → **Continuar** → **Crear**.
4. Menú de la izquierda → **Público** (Audience) → **Publicar app** → **Confirmar**. *(Si no se publica, solo las cuentas de prueba pueden entrar.)*
5. Menú de la izquierda → **Desarrollo de la marca** (Branding):
   - Página principal: `https://usalokl.com`
   - Dominios autorizados → **Agregar dominio** → `usalokl.com`
   - **Guardar**. *(No subir logo: eso pide una revisión de Google de varios días.)*
6. Menú de la izquierda → **Clientes** → **Crear cliente**:
   - Tipo: **Aplicación web**. Nombre: **Lokl web**.
   - Orígenes de JavaScript autorizados → **Agregar URI** → `https://usalokl.com`
   - URI de redireccionamiento autorizados → **Agregar URI** → `https://qzhfvsornkoakdeubstv.supabase.co/auth/v1/callback`
   - **Crear**. Sale una ventana con el **ID de cliente** y el **Secreto del cliente**. Dejarla abierta.

## Paso 2 · Supabase

1. supabase.com → proyecto Lokl → **Authentication** → **Sign In / Providers** → **Google**.
2. Encender **Enable Sign in with Google**.
3. **Client IDs**: pegar el ID de cliente (termina en `.apps.googleusercontent.com`).
4. **Client Secret (for OAuth)**: pegar el secreto.
5. **Save**.

## Pruebas

- [ ] En la computadora (Chrome), usalokl.com → **Entrar** → **Continuar con Google** → elegir la cuenta → llega a "Mi tienda".
- [ ] Con un correo de Gmail que ya tenía cuenta en Lokl: entra a la misma tienda.
- [ ] En el teléfono, abrir un enlace de Lokl desde Instagram: sale el aviso de abrir en el navegador.
