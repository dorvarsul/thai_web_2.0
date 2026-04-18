-- 1. Insert Categories (Slugs must match our iconMap in React)
INSERT INTO categories (name, slug) VALUES 
('רטבים', 'sauces'),
('משקאות', 'drinks'),
('חטיפים', 'snacks'),
('אטריות', 'noodles'),
('תבלינים', 'spices');

-- 2. Insert Products
INSERT INTO products (name, description, price, stock_quantity, is_active, category_id)
VALUES 
('רוטב דגים פרמיום', 'רוטב דגים תאילנדי אותנטי לבישול', 24.90, 100, true, (SELECT id FROM categories WHERE slug='sauces')),
('קוקוס קולדה 330 מ"ל', 'מיץ קוקוס טבעי ומרענן', 12.00, 50, true, (SELECT id FROM categories WHERE slug='drinks')),
('אטריות אורז 5 מ"מ', 'מתאים להכנת פאד תאי', 18.00, 200, true, (SELECT id FROM categories WHERE slug='noodles')),
('חטיף אצות פריכות', 'טעם ווסאבי חריף', 8.50, 75, true, (SELECT id FROM categories WHERE slug='snacks'));