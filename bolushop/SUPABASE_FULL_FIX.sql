-- SCRIPT DE REPARACIÓN Y VERIFICACIÓN INTEGRAL DE BASE DE DATOS
-- Ejecuta este script en el Editor SQL de Supabase para asegurar que tienes TODAS las columnas necesarias.

-- 1. CORRECCIÓN DE TABLA COLECCIONES (Nombre y Columnas)
-- Si existe la tabla con el nombre incorrecto 'coleccions', la renombramos
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'coleccions') 
       AND NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'collections') THEN
        ALTER TABLE public.coleccions RENAME TO collections;
    END IF;
END $$;

-- Aseguramos que la tabla 'collections' exista
CREATE TABLE IF NOT EXISTS public.collections (id text primary key);

-- Agregamos columnas faltantes en 'collections'
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS discount_type text default 'none';
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS discount_value numeric default 0;
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS is_featured boolean default false;
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS created_at timestamptz default now();

-- ¡LAS IMPORTANTES QUE FALTABAN!
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS product_ids jsonb default '[]';
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS holiday text default 'none';


-- 2. VERIFICACIÓN DE PRODUCTOS (Costo y Stock)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost numeric DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock integer DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS collections jsonb;


-- 3. VERIFICACIÓN DE ÓRDENES (DNI y Status)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payer_dni text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS external_id text;
-- Asegurar constraint de status si no existe (opcional, PostgreSQL maneja esto diferente, pero el check ayuda)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check') THEN
        ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled'));
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
END $$;


-- 4. VERIFICACIÓN DE SETTINGS (Whatsapp y Envíos)
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS whatsapp_number text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS average_shipping_cost numeric;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS site_description text;


-- 5. REFRESCAR CACHÉ DE API
-- Esto es crucial cuando se agregan columnas para que la API las detecte inmediatamente
NOTIFY pgrst, 'reload config';
