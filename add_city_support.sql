-- SQL Migración: Soporte Multi-Ciudad (Hermosillo y Obregón)

-- 1. Agregar columna 'city' a la tabla 'programs'
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Hermosillo';

-- 2. Agregar columna 'city' a la tabla 'events'
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Hermosillo';

-- 3. (Opcional) Asegurar que los datos existentes tengan 'Hermosillo'
UPDATE public.programs SET city = 'Hermosillo' WHERE city IS NULL;
UPDATE public.events SET city = 'Hermosillo' WHERE city IS NULL;

-- 4. Agregar check constraint para consistencia (opcional pero recomendado)
-- ALTER TABLE public.programs ADD CONSTRAINT check_city CHECK (city IN ('Hermosillo', 'Obregón'));
-- ALTER TABLE public.events ADD CONSTRAINT check_city CHECK (city IN ('Hermosillo', 'Obregón'));
