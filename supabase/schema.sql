-- ═══════════════════════════════════════════════════════════
-- RADHA RANI BANGLES — Complete Database Schema & Seed
-- Run this in your Supabase SQL Editor (1-Click Setup)
-- ═══════════════════════════════════════════════════════════

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  images TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  craftsmanship_details TEXT,
  material TEXT NOT NULL DEFAULT '',
  weight TEXT,
  size TEXT,
  hallmark TEXT,
  box_contents TEXT,
  care_instructions TEXT[],
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC NOT NULL DEFAULT 5.0,
  reviews INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  address TEXT NOT NULL,
  tracking_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CUSTOMER MESSAGES / INBOX TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount NUMERIC NOT NULL,
  type TEXT NOT NULL DEFAULT 'percentage',
  min_order NUMERIC NOT NULL DEFAULT 0,
  max_uses INTEGER NOT NULL DEFAULT 100,
  used_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read, authenticated or anon with key can manage
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow all on products" ON public.products FOR ALL USING (true);

-- Orders: Allow read & insert
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true);

-- Messages: Allow insert from contact form and read for admin
CREATE POLICY "Allow all on messages" ON public.messages FOR ALL USING (true);

-- Coupons: Allow public read and all for admin
CREATE POLICY "Allow all on coupons" ON public.coupons FOR ALL USING (true);

-- 6. CLOUD STORAGE BUCKET FOR BANGLE PHOTOS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage public read policy
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- Storage insert policy
CREATE POLICY "Allow Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

-- 7. INITIAL SEED DATA
INSERT INTO public.products (
  id, slug, name, price, original_price, images, category, category_slug, 
  description, craftsmanship_details, material, weight, size, hallmark, 
  box_contents, care_instructions, is_new, is_bestseller, rating, reviews
) VALUES
(
  'prod-1', 'ananya-gold-kada', 'Ananya Gold Kada', 45999, 52999, 
  ARRAY['/images/products/product-1.jpg', '/images/products/product-2.jpg', '/images/products/product-3.jpg'],
  'Gold Bangles', 'gold-bangles',
  'A magnificent 22K gold kada featuring intricate filigree work inspired by Rajasthani heritage. Each piece is hand-finished by master artisans with delicate floral carvings and polished edges.',
  'Handcrafted in Jaipur with generational filigree casting and hand-polished bevels.',
  '22K Gold', '18.5g', '2.6 inches', 'BIS 916 Hallmarked Gold',
  '1 Pair of Kada, Luxury Velvet Keepsake Box, BIS Certificate',
  ARRAY['Store in a cool dry place', 'Avoid perfume and chemicals', 'Wipe with soft cloth'],
  false, true, 4.8, 124
),
(
  'prod-2', 'meera-diamond-bangle', 'Meera Diamond Bangle', 89999, NULL,
  ARRAY['/images/products/product-2.jpg', '/images/products/product-3.jpg', '/images/products/product-1.jpg'],
  'Diamond Bangles', 'diamond-bangles',
  'Exquisite bangle set with brilliant-cut diamonds in an 18K white gold setting. A statement of timeless elegance with micro-pavé diamonds that catch light from every angle.',
  'Micro-pavé prong setting crafted by Mumbai master diamond setters.',
  '18K White Gold, Diamonds', '22g', '2.4 inches', 'IGI Certified VVS Diamonds, 750 Gold Hallmark',
  'Diamond Bangle, Leatherette Case, IGI Diamond Card',
  ARRAY['Clean with gentle jewelry solution', 'Store separately to prevent scratching'],
  true, false, 4.9, 87
),
(
  'prod-3', 'radha-kundan-set', 'Radha Kundan Set', 34999, 39999,
  ARRAY['/images/products/product-3.jpg', '/images/products/product-1.jpg', '/images/products/product-2.jpg'],
  'Kundan Bangles', 'kundan-bangles',
  'Traditional Kundan bangles adorned with uncut gemstones and meenakari enameling on the reverse side. Complete royal set for grand festive and bridal occasions.',
  'Authentic Bikaner Jadau technique with hand-enameled red and green peacock motifs on reverse.',
  '22K Gold-plated, Kundan, Pearls', '35g (set of 4)', '2.6 inches', 'Artisanal Craftsmanship Seal',
  'Set of 4 Bangles, Royal Red Brocade Box',
  ARRAY['Keep away from water', 'Wrap in cotton or velvet'],
  false, true, 4.7, 96
),
(
  'prod-4', 'diya-sleek-gold-bangle', 'Diya Sleek Gold Bangle', 28999, NULL,
  ARRAY['/images/products/product-4.jpg', '/images/products/product-5.jpg'],
  'Daily Wear', 'daily-wear',
  'Minimalist 22K gold bangle with subtle geometric facets. Designed for the contemporary woman who appreciates understated luxury for daily styling.',
  'Precision diamond-cut geometric faceting for subtle light catch.',
  '22K Gold', '12g', '2.4 inches', 'BIS 916 Hallmarked',
  'Single Bangle, Minimal Velvet Pouch, BIS Certificate',
  ARRAY['Daily wear safe', 'Wipe with microfiber cloth'],
  true, false, 4.6, 53
)
ON CONFLICT (id) DO NOTHING;

-- Initial Coupons Seed
INSERT INTO public.coupons (id, code, discount, type, min_order, max_uses, used_count, is_active) VALUES
('coup-1', 'RADHA10', 10, 'percentage', 2999, 500, 142, true),
('coup-2', 'FESTIVE15', 15, 'percentage', 4999, 200, 89, true),
('coup-3', 'BRIDAL20', 20, 'percentage', 25000, 50, 18, true),
('coup-4', 'FLAT500', 500, 'fixed', 3000, 1000, 412, true)
ON CONFLICT (id) DO NOTHING;
