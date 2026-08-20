-- Run this file in your Cloudflare dashboard to set up the D1 Database
-- Go to Workers & Pages > D1 > Create Database
-- Then go to the Database > Console and paste this SQL

DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Inventory;

CREATE TABLE Products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT,
    sku TEXT,
    price REAL NOT NULL,
    image TEXT,
    moq TEXT,
    isGuaranteed BOOLEAN DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    label TEXT NOT NULL,
    quantity TEXT NOT NULL
);

-- Insert the initial 6 products so your store is populated immediately
INSERT INTO Products (name, slug, sku, price, image, moq, isGuaranteed, description) VALUES 
('Hollywood', 'hollywood', 'FIO-HL-001', 150.00, '/Products/Hollywood.jpg', '1 piece', 1, 'Premium Hollywood style system with flawless undetectable lace.'),
('BMW', 'bmw', 'FIO-BM-002', 180.00, '/Products/Bmw.jpg', '1 piece', 1, 'The BMW line offers superior durability and a completely natural scalp appearance.'),
('Mono', 'mono', 'FIO-MN-003', 130.00, '/Products/Mono.png', '1 piece', 1, 'Classic Monofilament top providing incredible breathability and multi-directional styling versatility.'),
('Mono Front Lace', 'mono-front-lace', 'FIO-MFL-004', 160.00, '/Products/Mono Front Lace.png', '1 piece', 1, 'The perfect hybrid: a breathable Mono top combined with an undetectable Front Lace hairline.'),
('Australia', 'australia', 'FIO-AU-005', 145.00, '/Products/Australia.png', '1 piece', 1, 'The Australia base offers a unique blend of comfort, durability, and natural hair movement.'),
('Full Lace', 'full-lace', 'FIO-FL-006', 220.00, '/Products/Full Lace.png', '1 piece', 1, '100% Full Lace construction for maximum breathability and the ultimate freedom to part your hair anywhere.');

-- Insert default global inventory data
INSERT INTO Inventory (category, label, quantity) VALUES
('base', '9x7', '100-120'),
('base', '6x8', '100-120'),
('base', '6x9', '200-230'),
('base', '8x10', '200-230'),
('color', '#1', '100-120'),
('color', '#2', '100-120'),
('color', '#1B', '200-230'),
('density', '60-90', '100-120'),
('density', '95-110', '100-120'),
('density', '115-130', '200-230');
