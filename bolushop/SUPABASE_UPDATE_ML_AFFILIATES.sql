-- Script para añadir soporte al Programa de Referidos de Mercado Libre
-- Corre esto en el editor SQL de Supabase

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS ml_affiliate_url text,
ADD COLUMN IF NOT EXISTS ml_item_id text,
ADD COLUMN IF NOT EXISTS is_ml_referral boolean default false;
