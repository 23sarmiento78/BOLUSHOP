-- Productos optimizados con IA (Product Scout)
CREATE TABLE IF NOT EXISTS optimized_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ml_item_id TEXT NOT NULL UNIQUE,
  original_title TEXT NOT NULL,
  original_price NUMERIC,
  thumbnail TEXT,
  permalink TEXT,
  sold_quantity INTEGER,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  adsense_keywords TEXT,
  status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('draft', 'saved', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_optimized_products_ml_item_id ON optimized_products(ml_item_id);
CREATE INDEX IF NOT EXISTS idx_optimized_products_status ON optimized_products(status);

ALTER TABLE optimized_products ENABLE ROW LEVEL SECURITY;

ALTER TABLE optimized_products ADD COLUMN IF NOT EXISTS published_meli_item_id TEXT;
ALTER TABLE optimized_products ADD COLUMN IF NOT EXISTS published_permalink TEXT;

NOTIFY pgrst, 'reload schema';
