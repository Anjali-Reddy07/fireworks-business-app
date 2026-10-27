-- =========================================================================
-- SQL MIGRATION: Fireworks Business Management Database Schema
-- Applicable Law: Indian Explosives Act, PESO, and Supreme Court Guidelines
-- Persistent Supabase PostgreSQL Schema with Row Level Security (RLS)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT DEFAULT 'Sparkles',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    description TEXT NOT NULL,
    retail_price NUMERIC(10, 2) NOT NULL CHECK (retail_price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    sound_level TEXT NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    pieces_per_pack INTEGER NOT NULL DEFAULT 1 CHECK (pieces_per_pack > 0),
    is_green_cracker BOOLEAN DEFAULT true,
    green_cracker_code TEXT,
    safety_distance_meters INTEGER NOT NULL DEFAULT 5,
    image_url TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index for speedy catalogue querying
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_products_retail_price ON public.products(retail_price);

-- 3. INQUIRIES TABLE (Permitted store-visit / stock inquiry requests)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ref_id TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    visit_date DATE NOT NULL,
    requirement_type TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Store Visited', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- 4. STOCK MOVEMENTS AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('restock', 'sale_in_store', 'damaged', 'adjustment')),
    quantity_change INTEGER NOT NULL,
    new_stock_count INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements(product_id);

-- 5. ADMINISTRATIVE ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    admin_user TEXT NOT NULL DEFAULT 'Admin',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Categories & Active Products: Publicly readable for catalogue showcase
CREATE POLICY "Allow public read access to categories"
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Allow public read access to active products"
ON public.products FOR SELECT USING (active = true);

-- Inquiries: Public can insert their store visit request
CREATE POLICY "Allow public insert of inquiries"
ON public.inquiries FOR INSERT WITH CHECK (true);

-- Admins: Service role has full access to all tables
CREATE POLICY "Allow service role full access to categories"
ON public.categories FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to products"
ON public.products FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to inquiries"
ON public.inquiries FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to stock_movements"
ON public.stock_movements FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to activity_logs"
ON public.activity_logs FOR ALL USING (auth.role() = 'service_role');

-- =========================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION (Execute in Supabase Storage UI)
-- Bucket Name: 'fireworks-products' (Public bucket for images)
-- =========================================================================
