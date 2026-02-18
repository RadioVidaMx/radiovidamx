-- 1. ACTUALIZAR RLS DE PROFILES PARA ADMINISTRADORES
-- Actualmente un admin solo puede VER perfiles, pero no CREARLOS ni EDITARLOS.

-- Eliminar políticas restrictivas de perfiles si existen
DROP POLICY IF EXISTS "Profiles_Admin_Insert" ON public.profiles;
DROP POLICY IF EXISTS "Profiles_Admin_Update" ON public.profiles;
DROP POLICY IF EXISTS "Profiles_Admin_Delete" ON public.profiles;

-- Permitir que el admin inserte nuevos perfiles (necesario al crear usuarios)
CREATE POLICY "Profiles_Admin_Insert" ON public.profiles 
FOR INSERT TO authenticated 
WITH CHECK (public.get_my_role() = 'admin');

-- Permitir que el admin actualice cualquier perfil
CREATE POLICY "Profiles_Admin_Update" ON public.profiles 
FOR UPDATE TO authenticated 
USING (public.get_my_role() = 'admin');

-- Permitir que el admin elimine perfiles
CREATE POLICY "Profiles_Admin_Delete" ON public.profiles 
FOR DELETE TO authenticated 
USING (public.get_my_role() = 'admin');

-- Nota: Verificamos que Profiles_Admin_Select ya exista o la recreamos para seguridad
DROP POLICY IF EXISTS "Profiles_Admin_Select" ON public.profiles;
CREATE POLICY "Profiles_Admin_Select" ON public.profiles 
FOR SELECT TO authenticated 
USING (public.get_my_role() = 'admin');
