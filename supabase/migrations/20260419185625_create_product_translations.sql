ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_th TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_he TEXT;

-- Add your translations
UPDATE categories SET name_th = 'ซอส' WHERE slug = 'sauces';

UPDATE categories SET name_he = name;

UPDATE categories 
SET name_th = CASE 
    WHEN slug = 'sauces' THEN 'ซอส'
    WHEN slug = 'drinks' THEN 'เครื่องดื่ม'
    WHEN slug = 'snacks' THEN 'ขนม'
    WHEN slug = 'noodles' THEN 'บะหมี่'
    WHEN slug = 'spices' THEN 'เครื่องเทศ'
END;

ALTER TABLE products
ADD COLUMN name_th TEXT,
ADD COLUMN description_th TEXT,
ADD COLUMN name_he TEXT,
ADD COLUMN description_he TEXT;