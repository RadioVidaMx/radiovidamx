-- 1. LIMPIEZA TOTAL DE POLÍTICAS (Para evitar duplicados o recursiones viejas)
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

-- 2. FUNCIÓN DE SEGURIDAD (ANTI-RECURSIÓN)
-- Esta función es vital: lee el rol ignorando el RLS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 3. POLÍTICAS PARA LA TABLA PROFILES
-- Permitir que cada uno vea e inserte su propio perfil
CREATE POLICY "Profiles_Own_Select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles_Admin_Select" ON public.profiles FOR SELECT TO authenticated USING (public.get_my_role() = 'admin');
CREATE POLICY "Profiles_Own_Insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles_Own_Update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 4. POLÍTICAS DE CONTENIDO (Usando la función segura)

-- Artículos
CREATE POLICY "Art_Public_Select" ON public.articles FOR SELECT TO public USING (true);
CREATE POLICY "Art_Admin_All" ON public.articles FOR ALL TO authenticated USING (public.get_my_role() = 'admin');
CREATE POLICY "Art_Writer_Own" ON public.articles FOR ALL TO authenticated 
  USING (author_id = auth.uid() AND public.get_my_role() = 'writer')
  WITH CHECK (author_id = auth.uid() AND public.get_my_role() = 'writer');

-- Eventos y Programas
CREATE POLICY "Ev_Public_Select" ON public.events FOR SELECT TO public USING (true);
CREATE POLICY "Ev_Manage" ON public.events FOR ALL TO authenticated USING (public.get_my_role() IN ('admin', 'asist'));
CREATE POLICY "Prog_Public_Select" ON public.programs FOR SELECT TO public USING (true);
CREATE POLICY "Prog_Manage" ON public.programs FOR ALL TO authenticated USING (public.get_my_role() IN ('admin', 'asist'));

-- Videos y Galería
CREATE POLICY "Vid_Public_Select" ON public.videos FOR SELECT TO public USING (true);
CREATE POLICY "Vid_Manage" ON public.videos FOR ALL TO authenticated USING (public.get_my_role() IN ('admin', 'galery'));
CREATE POLICY "Gal_Public_Select" ON public.gallery FOR SELECT TO public USING (true);
CREATE POLICY "Gal_Manage" ON public.gallery FOR ALL TO authenticated USING (public.get_my_role() IN ('admin', 'galery'));

-- Likes y Comentarios
CREATE POLICY "Comm_Public_Select" ON public.comments FOR SELECT TO public USING (true);
CREATE POLICY "Comm_Insert" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Like_Public_Select" ON public.article_likes FOR SELECT TO public USING (true);
CREATE POLICY "Like_Insert" ON public.article_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
