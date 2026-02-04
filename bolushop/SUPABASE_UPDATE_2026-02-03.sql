-- Execute these commands in your Supabase SQL Editor to update your existing tables
-- to match the current code integration.

-- 1. Updates for ORDERS table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payer_dni text;

-- 2. Updates for PRODUCTS table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS cost numeric;

-- 3. Updates for SETTINGS table
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS average_shipping_cost numeric,
ADD COLUMN IF NOT EXISTS is_free_shipping_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS min_purchase_amount numeric;
