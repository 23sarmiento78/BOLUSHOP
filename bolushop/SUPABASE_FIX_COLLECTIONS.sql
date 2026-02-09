-- FIX 1: Ensure 'collections' table exists and has correct columns
-- Try to rename 'coleccions' (typo) to 'collections' if it exists and 'collections' does not
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'coleccions') 
     AND NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'collections') THEN
    ALTER TABLE public.coleccions RENAME TO collections;
  END IF;
END $$;

-- Create 'collections' if it doesn't exist at all
create table if not exists public.collections (
  id text primary key,
  created_at timestamptz default now(),
  name text not null,
  slug text unique not null,
  description text,
  image text,
  discount_type text default 'none',
  discount_value numeric default 0,
  is_featured boolean default false,
  product_ids jsonb default '[]',
  holiday text -- New column
);

-- FIX 2: Add missing columns if table already existed but was incomplete

-- Add 'product_ids' if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='collections' AND column_name='product_ids') THEN
    ALTER TABLE public.collections ADD COLUMN product_ids jsonb default '[]';
  END IF;
END $$;

-- Add 'holiday' if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='collections' AND column_name='holiday') THEN
    ALTER TABLE public.collections ADD COLUMN holiday text;
  END IF;
END $$;

-- FIX 3: Refresh Schema Cache
-- (This happens automatically on DDL, but good to know)
NOTIFY pgrst, 'reload config';
