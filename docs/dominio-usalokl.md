# Dominio: usalokl.com (decisión 43, 15/11/2026)

**Qué se decidió:** la app nueva va **directo en usalokl.com** desde el 15/11/2026, porque nadie usa la app vieja. **www.usalokl.com** lleva a usalokl.com. La pestaña Súper muestra "Muy pronto" hasta el Módulo 10. La app vieja de Vercel queda apagada (no se borra; su código sigue en la rama `main`).

(La decisión 42, "app.usalokl.com", quedó reemplazada.)

## Ya hecho

- ✅ **DNS de usalokl.com en Cloudflare** (activo el 15/11/2026). El dominio **sigue registrado y se paga en Namecheap**; los nameservers son `nataly.ns.cloudflare.com` y `neil.ns.cloudflare.com`. Desde ahora los registros se editan en **Cloudflare → usalokl.com → DNS**, no en Namecheap.
- ✅ Registros de correo (Resend): `resend._domainkey`, `rsend`, `send`, `_dmarc`, todos con nube gris (DNS only).

## Pasos para mover usalokl.com a la app nueva

1. **Quitar los registros de la app vieja.** Cloudflare → **usalokl.com** → **DNS** → **Records**, borrar **solo** estos dos (⋯ o **Edit** → **Delete**):
   - **A** · `usalokl.com` · `216.198.79.1`
   - **CNAME** · `www` · `c9a1e8f0dec54208.vercel-dns-017.com`

   Los de correo (rsend, send, TXT, MX) **no se tocan**.
2. **Conectar los dominios a la app.** Cloudflare → **Workers & Pages** → **lokl** → pestaña **Domains** → **+ Add** → **Custom domain**:
   - `usalokl.com` → **Add domain**
   - otra vez **+ Add** → `www.usalokl.com` → **Add domain**

   Cloudflare crea los registros y el certificado 🔒. Esperar a que digan **Active**.
3. **Quien programa** sube la configuración (`wrangler.jsonc` ya trae los dos dominios) para que no se pierdan en las próximas publicaciones.
4. **Supabase** → **Authentication** → **URL Configuration**:
   - **Site URL:** `https://usalokl.com`
   - **Redirect URLs:** agregar `https://usalokl.com/**` (las demás se quedan).
5. **Probar:** abrir `https://usalokl.com` y `https://www.usalokl.com` (debe pasar a usalokl.com). Crear una cuenta y revisar que el correo lleve a usalokl.com.

## Opcional (después)

- **Vercel:** en el proyecto viejo, **Settings → Domains**, quitar usalokl.com y www para que Vercel no avise errores. No borrar el proyecto.
