-- This ensures all 8 categories exist with correct localized names
INSERT INTO categories (slug, name, name_he, name_th)
VALUES 
  ('sauces', 'רטבים וממרחים', 'רטבים וממרחים', 'ซอสและน้ำพริก'),
  ('drinks', 'משקאות ואלכוהול', 'משקאות ואלכוהול', 'เครื่องดื่มและแอลกอฮอล์'),
  ('cleaning', 'חומרי ניקוי וכביסה', 'חומרי ניקוי וכביסה', 'ผลิตภัณฑ์ทำความสะอาด'),
  ('noodles', 'אטריות אורז וקטניות', 'אטריות אורז וקטניות', 'เส้นหมี่ ข้าว และธัญพืช'),
  ('spices', 'מוצרי יסוד ותבלינים', 'מוצרי יסוד ותבלינים', 'เครื่องปรุงรสและวัตถุดิบหลัก'),
  ('canned', 'שימורים וכבושים', 'שימורים וכבושים', 'อาหารกระפ๋องและของดอง'),
  ('snacks', 'חטיפים ומתוקים', 'חטיפים ומתוקים', 'ขนมและของหวาน'),
  ('appliances', 'כלים ומוצרי חשמל', 'כלים ומוצרי חשמל', 'เครื่องใช้ไฟฟ้าและอุปกรณ์ครัว')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  name_he = EXCLUDED.name_he,
  name_th = EXCLUDED.name_th;