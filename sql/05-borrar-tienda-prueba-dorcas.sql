-- ===== Lokl: borrar la tienda de prueba DORCAS de la cuenta administradora =====
-- La cuenta usalokl.app@gmail.com queda solo como administradora.
-- DORCAS se volverá a registrar con otro correo.
-- Solo borra la tienda con enlace "dorcas" que pertenece a usalokl.app@gmail.com.

delete from vendedores
where slug = 'dorcas'
  and usuario_id = (select id from auth.users where lower(email) = 'usalokl.app@gmail.com');

select count(*) as tiendas_de_la_cuenta_admin
from vendedores
where usuario_id = (select id from auth.users where lower(email) = 'usalokl.app@gmail.com');
