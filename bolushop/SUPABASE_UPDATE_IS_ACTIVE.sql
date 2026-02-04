-- Execute these commands in your Supabase SQL Editor to update your existing tables

-- 1. Updates for PRODUCTS table. 
-- Adding is_active column if it does not exist, and other missing columns.
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
