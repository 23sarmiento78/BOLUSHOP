-- Execute these commands in your Supabase SQL Editor to update your existing tables

-- 1. Updates for PRODUCTS table: Add images array support
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images jsonb;
