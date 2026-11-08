-- ===== Lokl: la cuenta usalokl.app@gmail.com es la administradora de Lokl =====
-- Ser admin es un permiso de la cuenta. Desde /admin se aprueban zonas, se modera,
-- se verifican vendedores y (Módulo 10) se maneja Lokl Súper.

insert into admins (usuario_id)
select id from auth.users where lower(email) = 'usalokl.app@gmail.com'
on conflict (usuario_id) do nothing;

select u.email, 'es admin' as resultado
from admins a join auth.users u on u.id = a.usuario_id;
