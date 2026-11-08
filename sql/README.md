# Archivos SQL de Lokl

Aquí se guarda **todo lo que se ejecuta en el SQL Editor de Supabase**, en orden.
Cada archivo se corre **una sola vez** y nunca se modifica después de correrlo: si hay que cambiar algo, se crea el siguiente número.

## Cómo correr uno

1. Abrir el archivo (doble clic o con el Bloc de notas).
2. **Ctrl + A** y **Ctrl + C**.
3. Supabase → **SQL Editor** → **New query** → **Ctrl + V** → **Run**.
4. Anotar la fecha en la tabla de abajo.

## Registro

| # | Archivo | Qué hace | Ejecutado en Supabase |
|---|---|---|---|
| 01 | `01-esquema-inicial.sql` | Crea todas las tablas, reglas, seguridad (RLS), el buscador y la tarea nocturna de caducidad | ✅ 8/11/2026 |
| 02 | `02-modulo-2-zonas-categorias.sql` | Campo "Hasta dónde envías", ajuste de categorías, y datos iniciales: 24 estados, 7 municipios de Apure, 28 zonas, 91 categorías, 20 sinónimos | ✅ 8/11/2026 |
| 03 | `03-modulo-3-cuentas-vendedor.sql` | Corrige el hueco del sello de verificado, enlaces reservados, zonas propuestas por vendedores, permisos de lo que es de cada vendedor y la carpeta de fotos | ✅ 8/11/2026 |

## Para quien programa

- Estos archivos son el **mismo contenido** de `supabase/migrations/` (el esquema por partes) y `supabase/seed.sql` (los datos iniciales), juntados para pegar de una vez.
- Las migraciones de `supabase/migrations/` siguen siendo la fuente para la CLI de Supabase. Al agregar una nueva, crear también aquí el siguiente archivo numerado.
- Los datos (`seed.sql`) se pueden correr varias veces sin duplicar.

## Si sale "already exists" (ya existe)

Significa que ese archivo ya se había corrido (por ejemplo, al tocar **Run** dos veces). No se rompe nada: avisa y se verifica que todo haya quedado aplicado.
