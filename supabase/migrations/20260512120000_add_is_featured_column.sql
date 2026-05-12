-- Add is_featured column to products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Ensure default is false for existing rows
UPDATE products SET is_featured = false WHERE is_featured IS NULL;

-- Optional index for quick lookup
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products (is_featured);
