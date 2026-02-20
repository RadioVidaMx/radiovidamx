-- FUNCIÓN PARA ELIMINAR USUARIO DESDE EL DASHBOARD (Borrando de Auth y Profiles)
-- Ejecuta este script en el SQL Editor de tu Dashboard de Supabase.

CREATE OR REPLACE FUNCTION public.delete_user_by_admin(target_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Verificar si el usuario que llama es administrador
  IF (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' THEN
    -- Borramos el perfil primero (opcional si hay cascade, pero seguro)
    DELETE FROM public.profiles WHERE id = target_user_id;
    -- Borramos la cuenta de autenticación
    DELETE FROM auth.users WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Solo los administradores pueden eliminar usuarios.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
