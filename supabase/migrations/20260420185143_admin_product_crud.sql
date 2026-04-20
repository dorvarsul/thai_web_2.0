CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Enable RLS (just in case it isn't)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Allow everyone to view (Read-only for public)
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT USING (true);

-- 3. Admin-only Mutations
CREATE POLICY "Admins can insert products" 
ON products FOR INSERT TO authenticated 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update products" 
ON products FOR UPDATE TO authenticated 
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete products" 
ON products FOR DELETE TO authenticated 
USING (is_admin());