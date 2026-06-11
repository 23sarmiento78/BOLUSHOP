-- SQL para crear todas las tablas necesarias en Supabase
-- Copia y pega esto en el SQL Editor de Supabase

-- TABLA DE ÓRDENES
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  external_id text unique,
  status text check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total numeric,
  payer_name text,
  payer_email text,
  payer_dni text,
  payer_address text,
  payer_phone text,
  items jsonb,
  payment_id text,
  tracking_number text,
  tracking_url text,
  cj_order_id text -- ID de CJ Dropshipping para seguimiento
);

-- TABLA DE PRODUCTOS
create table if not exists public.products (
  id text primary key, -- Usamos el ID de la tienda (UUID o SKU)
  created_at timestamptz default now(),
  name text not null,
  slug text unique not null,
  price numeric not null,
  cost numeric, -- Costo del producto para cálculo de márgenes
  image text,
  images jsonb, -- Array de URLs de imagenes
  category text,
  category_id text,
  description text,
  features jsonb, -- Array de strings
  stock integer default 0,
  collections jsonb, -- Array de IDs de colecciones
  is_active boolean default true,
  seo_keywords text, -- Keywords AdSense/SEO generadas por Gemini
  cj_sku text, -- Columna para sincronización con CJ Dropshipping
  cj_product_id text -- ID de CJ Dropshipping para un link directo
);

-- TABLA DE CATEGORÍAS
create table if not exists public.categories (
  id text primary key,
  created_at timestamptz default now(),
  name text not null,
  slug text unique not null,
  description text
);

-- TABLA DE CONFIGURACIONES (Single row)
create table if not exists public.settings (
  id integer primary key default 1,
  updated_at timestamptz default now(),
  profit_margin numeric,
  shipping_cost numeric, -- Base/Fallbcak
  average_shipping_cost numeric, -- Costo promedio de envío
  is_free_shipping_enabled boolean default true, -- Switch para envío gratis
  shipping_json jsonb, -- { "caba": 3000, "gba1": 5000, "gba2": 5500, "gba3": 8500, "rest": 9000 }
  site_name text,
  site_description text,
  whatsapp_number text,
  constraint single_row check (id = 1)
);

-- TABLA DE COLECCIONES
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
  product_ids jsonb default '[]'
);

-- Habilitar RLS en todas las tablas
alter table public.orders enable row level security;
alter table public.products enable row level security;
alter table public.settings enable row level security;
alter table public.collections enable row level security;
alter table public.categories enable row level security;

-- Políticas de acceso (Lectura y Escritura pública para simplificar el MVP)
-- En producción, deberías usar autenticación de Supabase.

drop policy if exists "Acceso total órdenes" on public.orders;
create policy "Acceso total órdenes" on public.orders for all using (true) with check (true);

drop policy if exists "Acceso total productos" on public.products;
create policy "Acceso total productos" on public.products for all using (true) with check (true);

drop policy if exists "Acceso total settings" on public.settings;
create policy "Acceso total settings" on public.settings for all using (true) with check (true);

drop policy if exists "Acceso total colecciones" on public.collections;
create policy "Acceso total colecciones" on public.collections for all using (true) with check (true);

drop policy if exists "Acceso total categorías" on public.categories;
create policy "Acceso total categorías" on public.categories for all using (true) with check (true);

-- TABLA DE RESEÑAS (Para el segundo proyecto de Supabase)
create table if not exists public.reviews (
  id text primary key,
  product_id text not null,
  user_name text not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  date timestamptz default now()
);

drop policy if exists "Acceso total reseñas" on public.reviews;
create policy "Acceso total reseñas" on public.reviews for all using (true) with check (true);
alter table public.reviews enable row level security;
-- TABLA DE BLOG POSTS
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  image text,
  category text,
  author text default 'BoluShop Team',
  meta_title text,
  meta_description text,
  product_ids text[] default '{}',
  is_published boolean default true
);

drop policy if exists "Acceso total posts" on public.posts;
create policy "Acceso total posts" on public.posts for all using (true) with check (true);
alter table public.posts enable row level security;

-- TABLA DE NEWSLETTER
create table if not exists public.newsletter (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamptz default now()
);

drop policy if exists "Acceso total newsletter" on public.newsletter;
create policy "Acceso total newsletter" on public.newsletter for all using (true) with check (true);
alter table public.newsletter enable row level security;
