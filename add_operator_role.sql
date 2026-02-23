-- ACTUALIZACIÓN DE POLÍTICAS PARA EL ROL 'operator'
-- Este rol solo tiene permiso para gestionar Eventos y Programación

-- 1. EVENTOS (events)
DROP POLICY IF EXISTS "Admins/Asists manage events" ON public.events;
DROP POLICY IF EXISTS "Admins/Asists/Operators manage events" ON public.events;

CREATE POLICY "Admins/Asists/Operators manage events" ON public.events 
FOR ALL TO authenticated 
USING (get_my_role() IN ('admin', 'asist', 'operator'));

-- 2. PROGRAMACIÓN (programs)
DROP POLICY IF EXISTS "Admins/Asists manage programs" ON public.programs;
DROP POLICY IF EXISTS "Admins/Asists/Operators manage programs" ON public.programs;

CREATE POLICY "Admins/Asists/Operators manage programs" ON public.programs 
FOR ALL TO authenticated 
USING (get_my_role() IN ('admin', 'asist', 'operator'));

-- Nota: Solo lectura para el público sigue funcionando con las políticas existentes
