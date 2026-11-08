// Cliente de Supabase para las islas de Preact (código que corre en el teléfono).
import { createBrowserClient } from "@supabase/ssr";

let cliente;

export function supabaseNavegador() {
  cliente ??= createBrowserClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );
  return cliente;
}
