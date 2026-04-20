INSERT INTO categories (name, slug) VALUES 
('רטבים', 'sauces'),
('משקאות', 'drinks'),
('חטיפים', 'snacks'),
('אטריות', 'noodles'),
('תבלינים', 'spices');

INSERT INTO products (name, description, price, stock_quantity, is_active, category_id)
VALUES 
('רוטב דגים פרמיום', 'רוטב דגים תאילנדי אותנטי לבישול', 24.90, 100, true, (SELECT id FROM categories WHERE slug='sauces')),
('קוקוס קולדה 330 מ"ל', 'מיץ קוקוס טבעי ומרענן', 12.00, 50, true, (SELECT id FROM categories WHERE slug='drinks')),
('אטריות אורז 5 מ"מ', 'מתאים להכנת פאד תאי', 18.00, 200, true, (SELECT id FROM categories WHERE slug='noodles')),
('חטיף אצות פריכות', 'טעם ווסאבי חריף', 8.50, 75, true, (SELECT id FROM categories WHERE slug='snacks'));
-- 3. Add Thai and Hebrew translations to categories
UPDATE categories SET name_th = 'ซอส' WHERE slug = 'sauces';
UPDATE categories SET name_he = 'רטבים' WHERE slug = 'sauces';

UPDATE categories SET name_th = 'เครื่องดื่ม' WHERE slug = 'drinks';
UPDATE categories SET name_he = 'משקאות' WHERE slug = 'drinks';

UPDATE categories SET name_th = 'ขนม' WHERE slug = 'snacks';
UPDATE categories SET name_he = 'חטיפים' WHERE slug = 'snacks';

UPDATE categories SET name_th = 'บะหมี่' WHERE slug = 'noodles';
UPDATE categories SET name_he = 'אטריות' WHERE slug = 'noodles';

UPDATE categories SET name_th = 'เครื่องเทศ' WHERE slug = 'spices';
UPDATE categories SET name_he = 'תבלינים' WHERE slug = 'spices';

-- 4. Add Thai translations to products
UPDATE products SET name_th = 'น้ำปลากุ้งเสวย' WHERE name = 'רוטב דגים פרמיום';
UPDATE products SET description_th = 'น้ำปลากุ้งแท้จากประเทศไทยที่ใช้ในการปรุงอาหาร' WHERE name = 'רוטב דגים פרמיום';
UPDATE products SET name_he = 'רוטב דגים פרמיום' WHERE name = 'רוטב דגים פרמיום';
UPDATE products SET description_he = 'רוטב דגים תאילנדי אותנטי לבישול' WHERE name = 'רוטב דגים פרמיום';

UPDATE products SET name_th = 'น้ำมะพร้าวสด 330 มล' WHERE name = 'קוקוס קולדה 330 מ"ל';
UPDATE products SET description_th = 'น้ำมะพร้าวธรรมชาติสดใจและเย็นชื่น' WHERE name = 'קוקוס קולדה 330 מ"ל';
UPDATE products SET name_he = 'קוקוס קולדה 330 מ"ל' WHERE name = 'קוקוס קולדה 330 מ"ל';
UPDATE products SET description_he = 'מיץ קוקוס טבעי ומרענן' WHERE name = 'קוקוס קולדה 330 מ"ל';

UPDATE products SET name_th = 'บะหมี่ข้าว 5 มม' WHERE name = 'אטריות אורז 5 מ"מ';
UPDATE products SET description_th = 'เหมาะสำหรับการทำผัดไทยอร่อย' WHERE name = 'אטריות אורז 5 מ"מ';
UPDATE products SET name_he = 'אטריות אורז 5 מ"מ' WHERE name = 'אטריות אורז 5 מ"מ';
UPDATE products SET description_he = 'מתאים להכנת פאד תאי' WHERE name = 'אטריות אורז 5 מ"מ';

UPDATE products SET name_th = 'สาหร่ายกรอบรสวาซาบิ' WHERE name = 'חטיף אצות פריכות';
UPDATE products SET description_th = 'รสวาซาบิจัดแจงและเผ็ดจากสาหร่าย' WHERE name = 'חטיף אצות פריכות';
UPDATE products SET name_he = 'חטיף אצות פריכות' WHERE name = 'חטיף אצות פריכות';
UPDATE products SET description_he = 'טעם ווסאבי חריף' WHERE name = 'חטיף אצות פריכות';