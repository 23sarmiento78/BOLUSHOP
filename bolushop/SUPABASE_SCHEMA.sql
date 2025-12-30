-- SQL para crear la tabla de órdenes en Supabase
-- Copia y pega esto en el SQL Editor de Supabase

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  external_id text unique, -- ID interno de la tienda (UUID v4)
  status text check (status in ('pending', 'paid', 'shipped', 'cancelled')),
  total numeric,
  payer_name text,
  payer_email text,
  payer_address text,
  payer_phone text,
  items jsonb,
  payment_id text
);

-- Habilitar acceso público para inserción (Si no usas Auth de Supabase)
-- Nota: En producción deberías configurar RLS adecuadamente.
alter table public.orders enable row level security;

create policy "Permitir inserción pública" 
on public.orders for insert 
with check (true);

create policy "Permitir lectura pública" 
on public.orders for select 
using (true);
