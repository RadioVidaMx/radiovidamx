-- FUNCIÓN Y TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE
-- Ejecuta este script en el SQL Editor de tu Dashboard de Supabase.

-- 1. Crear la función que maneja la inserción del perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Nuevo Usuario'),
    new.email,
    'reader' -- Rol por defecto
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Crear el trigger que se dispara al insertar en auth.users
-- Primero eliminamos si ya existe para evitar errores
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
