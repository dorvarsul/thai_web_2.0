-- 1. ROLES & PROFILES (Requirement #4: Admin Dashboard Security)
CREATE TYPE user_role AS ENUM ('admin', 'customer');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'customer' NOT NULL,
  full_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCT CATALOG (Requirements #1 & #5)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- For SEO-friendly URLs (e.g., /category/electronics)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE SECURITY (CRITICAL)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 4. ACCESS POLICIES
-- Public can READ products and categories (Requirement #1 & #5)
CREATE POLICY "Public can view active products" ON products 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view categories" ON categories 
  FOR SELECT USING (true);

-- Users can READ/UPDATE their own profile
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);

-- ADMINS can do EVERYTHING (Requirement #4)
-- This checks the 'role' column in the profiles table
CREATE POLICY "Admins have full access to products" ON products 
  FOR ALL TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins have full access to categories" ON categories 
  FOR ALL TO authenticated USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

  -- Trigger to create a profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();