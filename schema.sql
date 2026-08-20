-- Run this file in your Cloudflare dashboard to set up the D1 Database
-- Go to Workers & Pages > D1 > Create Database
-- Then go to the Database > Console and paste this SQL

DROP TABLE IF EXISTS Products;

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

-- Insert the initial 6 products so your store is populated immediately
INSERT INTO Products (name, slug, sku, price, image, moq, isGuaranteed, description) VALUES 
('Hollywood', 'hollywood', 'FIO-HL-001', 150.00, '/Products/Hollywood.png', '1 piece', 1, 'Premium Hollywood style system with flawless undetectable lace.'),
('BMW', 'bmw', 'FIO-BM-002', 180.00, '/Products/BMW.png', '1 piece', 1, 'The BMW line offers superior durability and a completely natural scalp appearance.'),
('Mono', 'mono', 'FIO-MN-003', 130.00, '/Products/Mono.png', '1 piece', 1, 'Classic Monofilament top providing incredible breathability and multi-directional styling versatility.'),
('Mono Front Lace', 'mono-front-lace', 'FIO-MFL-004', 160.00, '/Products/Mono Front Lace.png', '1 piece', 1, 'The perfect hybrid: a breathable Mono top combined with an undetectable Front Lace hairline.'),
('Australia', 'australia', 'FIO-AU-005', 145.00, '/Products/Australia.png', '1 piece', 1, 'The Australia base offers a unique blend of comfort, durability, and natural hair movement.'),
('Full Lace', 'full-lace', 'FIO-FL-006', 220.00, '/Products/Full Lace.png', '1 piece', 1, '100% Full Lace construction for maximum breathability and the ultimate freedom to part your hair anywhere.');
