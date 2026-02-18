-- 1. AGREGAR COLUMNA DE EMAIL A PROFILES
-- Esto es necesario para mostrar el correo en la lista sin consultar auth.users (restringido)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. (OPCIONAL) SICRONIZAR EMAILS EXISTENTES
-- Si ya hay usuarios, este comando intenta copiar el email desde auth.users
-- Nota: Requiere permisos de superusuario, si falla no detiene el proceso.
DO $$
BEGIN
    UPDATE public.profiles p
    SET email = u.email
    FROM auth.users u
    WHERE p.id = u.id AND p.email IS NULL;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'No se pudo sincronizar emails automáticamente, se guardarán en los próximos registros.';
END $$;
