-- ACTUALIZAR RESTRICCIÓN DE TIPOS DE PROGRAMA
-- Este script actualiza la tabla 'programs' para permitir los nuevos tipos: infantil, noticias y locución.

DO $$ 
BEGIN 
    -- 1. Eliminar la restricción antigua (si existe con este nombre)
    ALTER TABLE public.programs DROP CONSTRAINT IF EXISTS programs_type_check;

    -- 2. Agregar la nueva restricción con todos los tipos permitidos
    ALTER TABLE public.programs ADD CONSTRAINT programs_type_check 
    CHECK (type IN ('worship', 'teaching', 'talk', 'prayer', 'music', 'kids', 'news', 'voice'));
END $$;
