// Clientes de Supabase para el servidor (páginas .astro y endpoints).
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

const URL_SB = import.meta.env.PUBLIC_SUPABASE_URL;
const CLAVE_SB = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(URL_SB && CLAVE_SB);

/**
 * Con la sesión del vendedor (cookies de Supabase Auth). Para panel y admin.
 * Uso en una página: const sb = supabaseServidor(Astro);
 */
export function supabaseServidor({ request, cookies }) {
  return createServerClient(URL_SB, CLAVE_SB, {
    cookies: {
      getAll: () =>
        parseCookieHeader(request.headers.get("Cookie") ?? "").map(({ name, value }) => ({
          name,
          value: value ?? "",
        })),
      setAll(lista) {
        lista.forEach(({ name, value, options }) => cookies.set(name, value, options));
      },
    },
  });
}

/** Sin cookies, para páginas públicas cacheadas (ISR): no depende de quién mira. */
export function supabasePublico() {
  return createServerClient(URL_SB, CLAVE_SB, {
    cookies: { getAll: () => [], setAll() {} },
  });
}
