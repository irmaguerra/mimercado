-- Tareas programadas con pg_cron (incluido en Supabase).
-- Las horas de cron van en UTC: 04:00 UTC = 12:00 a. m. en Venezuela.

create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;

-- Caducidad a 30 días: las publicaciones vencidas dejan de salir.
-- El vendedor las renueva con un toque desde /panel/publicaciones.
select cron.schedule(
  'caducar-publicaciones',
  '0 4 * * *',
  $$ update public.publicaciones set estado = 'vencida'
      where estado = 'publicada' and vence_en < now() $$
);
