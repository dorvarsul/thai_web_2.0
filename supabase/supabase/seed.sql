-- Insert Categories
INSERT INTO categories (name, slug) VALUES 
('Electronics', 'electronics'),
('Clothing', 'clothing');

-- Insert a Sample Product
INSERT INTO products (name, description, price, stock_quantity, category_id)
VALUES ('Security Camera', 'Keep your home safe.', 199.99, 50, (SELECT id FROM categories WHERE slug='electronics'));