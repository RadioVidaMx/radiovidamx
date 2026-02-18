-- 1. AGREGAR COLUMNA DE CONTEO DE COMENTARIOS
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- 2. FUNCIÓN Y TRIGGER PARA ACTUALIZAR EL CONTEO DE LIKES AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION public.update_article_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.articles SET likes_count = likes_count + 1 WHERE id = NEW.article_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.articles SET likes_count = likes_count - 1 WHERE id = OLD.article_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_update_likes_count ON public.article_likes;
CREATE TRIGGER tr_update_likes_count
AFTER INSERT OR DELETE ON public.article_likes
FOR EACH ROW EXECUTE FUNCTION public.update_article_likes_count();

-- 3. FUNCIÓN Y TRIGGER PARA ACTUALIZAR EL CONTEO DE COMENTARIOS AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION public.update_article_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.articles SET comments_count = comments_count + 1 WHERE id = NEW.article_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.articles SET comments_count = comments_count - 1 WHERE id = OLD.article_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_update_comments_count ON public.comments;
CREATE TRIGGER tr_update_comments_count
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.update_article_comments_count();

-- 4. SINCRONIZAR CONTEOS ACTUALES (Para corregir los ceros existentes)
UPDATE public.articles a SET 
    likes_count = (SELECT count(*) FROM public.article_likes WHERE article_id = a.id),
    comments_count = (SELECT count(*) FROM public.comments WHERE article_id = a.id);

-- 5. ACTUALIZAR RLS DE PERFILES PARA QUE EL NOMBRE SEA VISIBLE PÚBLICAMENTE
-- Borramos cualquier política anterior de visualización de perfiles
DROP POLICY IF EXISTS "Public can view basic profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles_Public_Select" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles_Own_Select" ON public.profiles;

-- Creamos una política que permite a TODOS ver los perfiles (necesario para ver nombres en comentarios)
CREATE POLICY "Profiles_Public_Select" 
ON public.profiles FOR SELECT TO public 
USING (true);

-- Nota: Solo el Admin y el Dueño pueden ver el Teléfono/Email si se filtran en la aplicación,
-- pero por ahora permitimos el SELECT general para facilitar la visualización de nombres.
