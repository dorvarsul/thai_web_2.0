-- First, fill the Hebrew column from the existing 'name' column
UPDATE categories 
SET name_he = name;

-- Second, fill the Thai column based on the slugs from your screenshot
UPDATE categories SET name_th = 'ซอส' WHERE slug = 'sauces';
UPDATE categories SET name_th = 'เครื่องดื่ม' WHERE slug = 'drinks';
UPDATE categories SET name_th = 'ขนม' WHERE slug = 'snacks';
UPDATE categories SET name_th = 'บะหมี่' WHERE slug = 'noodles';
UPDATE categories SET name_th = 'เครื่องเทศ' WHERE slug = 'spices';

-- Third, check the results immediately
SELECT slug, name_he, name_th FROM categories;