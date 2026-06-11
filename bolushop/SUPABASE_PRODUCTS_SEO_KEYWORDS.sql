-- Agrega columna para keywords AdSense/SEO generadas por Gemini
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS seo_keywords text;
