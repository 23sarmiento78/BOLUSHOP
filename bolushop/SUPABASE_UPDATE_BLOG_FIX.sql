-- Migration: Actualizar tabla de blog posts y configuraciones
-- Fecha: 2026-03-05
-- Descripción: Agrega columnas para SEO y vinculación de productos en blog, y monto mínimo de compra en configuraciones.

-- 1. Actualizar tabla de POSTS (Blog)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS product_ids text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;

-- 2. Actualizar tabla de SETTINGS
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS min_purchase_amount numeric DEFAULT 0;

-- 3. Asegurar que las políticas de RLS existan (por si acaso)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Acceso total posts') THEN
        CREATE POLICY "Acceso total posts" ON public.posts FOR ALL USING (true) WITH CHECK (true);
    END IF;
END
$$;

-- Notificar a Supabase que el esquema ha cambiado (Schema Cache Refresh)
-- NOTA: Esto se hace automáticamente al alterar tablas, pero si el cache persiste, 
-- se puede forzar reiniciando el proyecto o esperando unos minutos.
