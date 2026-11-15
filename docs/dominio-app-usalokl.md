# Dominio: app.usalokl.com (decisión 42, 15/11/2026)

**Qué se decidió:** la app nueva se publica en **app.usalokl.com** desde ya. **usalokl.com** y **www.usalokl.com** siguen con la app vieja (Vercel) hasta el Módulo 12, cuando se mueven a la nueva. Nadie usa hoy la app vieja.

**Por qué hay que mudar los DNS:** Cloudflare solo publica un Worker en un dominio propio si los DNS de ese dominio se administran en Cloudflare. El dominio **sigue registrado y se paga en Namecheap**; solo cambia quién responde los DNS. Es gratis.

## Parte A · Agregar usalokl.com a Cloudflare

1. Entrar a **dash.cloudflare.com** con la cuenta de Lokl (**usalokl.app@gmail.com**, la misma del Worker).
2. Botón **+ Add** (o **Add a domain**) → escribir **usalokl.com** → elegir **Quick scan for DNS records** → **Continue**.
3. Elegir el plan **Free** (abajo de todo, $0) → **Continue**.
4. Cloudflare muestra los registros que encontró. Revisar que estén estos 6 y que **todos** tengan la **nube gris (DNS only)**, no naranja:

| Type | Name | Contenido | Nube |
|---|---|---|---|
| A | `usalokl.com` (o `@`) | `216.198.79.1` (Vercel, app vieja) | **gris** |
| CNAME | `www` | `c9a1e8f0dec54208.vercel-dns-017.com` | **gris** |
| TXT | `resend._domainkey` | `p=MIGfMA0…IDAQAB` | — |
| CNAME | `rsend` | `rsend.forge.rmta.net` | **gris** |
| CNAME | `send` | `send.forge.rmta.net` | **gris** |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | — |

   - Si alguna tiene la nube **naranja**, tocarla para que quede **gris**. Con la nube naranja, Vercel y Resend pueden dejar de funcionar.
   - Si falta alguno, **Add record** y copiarlo de la tabla.
   - Si aparecen otros registros que no están en la tabla, no borrarlos: avisar.
5. **Continue to activation**. Cloudflare muestra **2 nameservers** (algo como `xxx.ns.cloudflare.com` y `yyy.ns.cloudflare.com`). Dejar esa pestaña abierta.

## Parte B · Cambiar los nameservers en Namecheap

1. **Namecheap** → **Domain List** → **Manage** en usalokl.com → pestaña **Domain**.
2. En **NAMESERVERS**, cambiar **Namecheap BasicDNS** por **Custom DNS**.
3. Pegar los 2 nameservers de Cloudflare, uno en cada línea → ✓ verde para guardar.
4. Volver a Cloudflare → **Check nameservers now**.
5. Esperar: puede tardar de minutos a 24 horas. Cloudflare manda un correo cuando el dominio queda **Active**.

**Después de este cambio**, los registros de usalokl.com se editan en **Cloudflare → usalokl.com → DNS**, ya no en Namecheap (Advanced DNS deja de usarse).

## Parte C · Publicar en app.usalokl.com (lo hace quien programa)

Cuando el dominio esté **Active** en Cloudflare:

1. En `wrangler.jsonc` se agrega `"routes": [{ "pattern": "app.usalokl.com", "custom_domain": true }]` (sin quitar `workers.dev`, que sigue funcionando). El siguiente push crea el registro y el certificado.
2. Supabase → **Authentication** → **URL Configuration**:
   - **Site URL:** `https://app.usalokl.com`
   - **Redirect URLs:** agregar `https://app.usalokl.com/**` (las demás se quedan).
3. Probar `https://app.usalokl.com`, crear cuenta y recibir el correo.

## Módulo 12

Para pasar usalokl.com a la app nueva, en Cloudflare se cambian los registros `@` y `www` (que hoy apuntan a Vercel) por el Worker. Al estar los DNS en Cloudflare, es un cambio de minutos.
