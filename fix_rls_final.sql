-- 1. ELIMINAR POLÍTICAS EXISTENTES PARA EVITAR CONFLICTOS
DO $$ 
DECLARE 
    tablas text[] := ARRAY['profiles', 'articles', 'events', 'programs', 'videos', 'gallery', 'comments', 'article_likes'];
    t text;
BEGIN
    FOREACH t IN ARRAY tablas LOOP
        EXECUTE (
            SELECT COALESCE(string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON public.' || quote_ident(tablename) || ';', ' '), '')
            FROM pg_policies 
            WHERE schemaname = 'public' AND tablename = t
        );
    END LOOP;
END $$;

-- 2. FUNCIÓN DE AYUDA PARA EVITAR RECURSIÓN
-- Esta función lee el rol sin disparar políticas de nuevo
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- 3. POLÍTICAS DE PERFILES (profiles)
-- No usamos get_my_role() aquí para evitar recursión circular extrema
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'); -- Forma directa
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. POLÍTICAS DE CONTENIDO (Usando la función get_my_role)

-- ARTÍCULOS
CREATE POLICY "Public view articles" ON public.articles FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage articles" ON public.articles FOR ALL TO authenticated USING (get_my_role() = 'admin');
CREATE POLICY "Writers manage own articles" ON public.articles FOR ALL TO authenticated 
  USING (author_id = auth.uid() AND get_my_role() = 'writer')
  WITH CHECK (author_id = auth.uid() AND get_my_role() = 'writer');

-- EVENTOS Y PROGRAMACIÓN
CREATE POLICY "Public view events" ON public.events FOR SELECT TO public USING (true);
CREATE POLICY "Admins/Asists manage events" ON public.events FOR ALL TO authenticated USING (get_my_role() IN ('admin', 'asist'));
CREATE POLICY "Public view programs" ON public.programs FOR SELECT TO public USING (true);
CREATE POLICY "Admins/Asists manage programs" ON public.programs FOR ALL TO authenticated USING (get_my_role() IN ('admin', 'asist'));

-- MULTIMEDIA (Videos y Galería)
CREATE POLICY "Public view videos" ON public.videos FOR SELECT TO public USING (true);
CREATE POLICY "Admins/Galery manage videos" ON public.videos FOR ALL TO authenticated USING (get_my_role() IN ('admin', 'galery'));
CREATE POLICY "Public view gallery" ON public.gallery FOR SELECT TO public USING (true);
CREATE POLICY "Admins/Galery manage gallery" ON public.gallery FOR ALL TO authenticated USING (get_my_role() IN ('admin', 'galery'));

-- INTERACCIONES (Likes y Comentarios)
CREATE POLICY "Public view comments" ON public.comments FOR SELECT TO public USING (true);
CREATE POLICY "Auth insert comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public view likes" ON public.article_likes FOR SELECT TO public USING (true);
CREATE POLICY "Auth insert likes" ON public.article_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
