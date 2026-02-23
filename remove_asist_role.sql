-- LIMPIEZA DEL ROL 'asist' Y REFUERZO DEL ROL 'operator'
-- Este script elimina las referencias al antiguo rol 'asistente'

-- 1. EVENTOS (events)
-- Eliminamos la política anterior que incluía a 'asist'
DROP POLICY IF EXISTS "Admins/Asists manage events" ON public.events;
DROP POLICY IF EXISTS "Admins/Asists/Operators manage events" ON public.events;

-- Creamos la política final solo para 'admin' y 'operator'
CREATE POLICY "Admins/Operators manage events" ON public.events 
FOR ALL TO authenticated 
USING (get_my_role() IN ('admin', 'operator'));

-- 2. PROGRAMACIÓN (programs)
-- Eliminamos la política anterior que incluía a 'asist'
DROP POLICY IF EXISTS "Admins/Asists manage programs" ON public.programs;
DROP POLICY IF EXISTS "Admins/Asists/Operators manage programs" ON public.programs;

-- Creamos la política final solo para 'admin' y 'operator'
CREATE POLICY "Admins/Operators manage programs" ON public.programs 
FOR ALL TO authenticated 
USING (get_my_role() IN ('admin', 'operator'));

-- 3. NOTA SOBRE OTROS PERMISOS:
-- Las tablas 'videos' y 'gallery' siguen usando 'galery' y 'admin'.
-- La tabla 'articles' sigue usando 'writer' y 'admin'.
-- El rol 'asist' ya no tendrá acceso via RLS si existiera algún usuario con ese rol.
