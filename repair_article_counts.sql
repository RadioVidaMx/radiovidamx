-- SCRIPT DE MANTENIMIENTO: REPARACIÓN DE CONTADORES DE ARTÍCULOS

-- 1. Asegurar que las columnas tengan valores por defecto y no sean nulas
ALTER TABLE public.articles ALTER COLUMN likes_count SET DEFAULT 0;
ALTER TABLE public.articles ALTER COLUMN likes_count SET NOT NULL;

-- Para comments_count por si acaso
ALTER TABLE public.articles ALTER COLUMN comments_count SET DEFAULT 0;
ALTER TABLE public.articles ALTER COLUMN comments_count SET NOT NULL;

-- 2. Limpiar valores NULL existentes
UPDATE public.articles SET likes_count = 0 WHERE likes_count IS NULL;
UPDATE public.articles SET comments_count = 0 WHERE comments_count IS NULL;

-- 3. Recalcular y Sincronizar todos los conteos desde las tablas de origen
UPDATE public.articles a SET 
    likes_count = (SELECT count(*) FROM public.article_likes WHERE article_id = a.id),
    comments_count = (SELECT count(*) FROM public.comments WHERE article_id = a.id);

-- 4. Verificar que los Triggers estén activos y sean correctos (ya deberían estar, pero esto los refuerza)
CREATE OR REPLACE FUNCTION public.update_article_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.articles SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = NEW.article_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.articles SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE id = OLD.article_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_article_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.articles SET comments_count = COALESCE(comments_count, 0) + 1 WHERE id = NEW.article_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.articles SET comments_count = GREATEST(0, COALESCE(comments_count, 0) - 1) WHERE id = OLD.article_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Nota: Esto dejará todos los contadores actuales perfectamente sincronizados.
