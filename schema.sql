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
    product_id INTEGER NOT NULL,
    base_size TEXT NOT NULL,
    length TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Inventory for Product 1 (Hollywood)
INSERT INTO Inventory (product_id, base_size, length, color, quantity) VALUES
(1, '9x7', '10-12 inches', '#1', '100-120'), (1, '9x7', '10-12 inches', '#2', '80-100'), (1, '9x7', '10-12 inches', '#1B', '150-180'),
(1, '6x8', '10-12 inches', '#1', '100-120'), (1, '6x8', '10-12 inches', '#2', '80-100'), (1, '6x8', '10-12 inches', '#1B', '150-180'),
(1, '6x9', '10-12 inches', '#1', '200-230'), (1, '6x9', '10-12 inches', '#2', '80-100'), (1, '6x9', '10-12 inches', '#1B', '200-230'),
(1, '8x10', '10-12 inches', '#1', '200-230'), (1, '8x10', '10-12 inches', '#2', '80-100'), (1, '8x10', '10-12 inches', '#1B', '200-230');

-- Seed Inventory for Product 2 (BMW)
INSERT INTO Inventory (product_id, base_size, length, color, quantity) VALUES
(2, '9x7', '10-12 inches', '#1', '100-120'), (2, '9x7', '10-12 inches', '#2', '80-100'), (2, '9x7', '10-12 inches', '#1B', '150-180'),
(2, '6x8', '10-12 inches', '#1', '100-120'), (2, '6x8', '10-12 inches', '#2', '80-100'), (2, '6x8', '10-12 inches', '#1B', '150-180'),
(2, '6x9', '10-12 inches', '#1', '200-230'), (2, '6x9', '10-12 inches', '#2', '80-100'), (2, '6x9', '10-12 inches', '#1B', '200-230'),
(2, '8x10', '10-12 inches', '#1', '200-230'), (2, '8x10', '10-12 inches', '#2', '80-100'), (2, '8x10', '10-12 inches', '#1B', '200-230');

-- Seed Inventory for Product 3 (Mono)
INSERT INTO Inventory (product_id, base_size, length, color, quantity) VALUES
(3, '9x7', '10-12 inches', '#1', '100-120'), (3, '9x7', '10-12 inches', '#2', '80-100'), (3, '9x7', '10-12 inches', '#1B', '150-180'),
(3, '6x8', '10-12 inches', '#1', '100-120'), (3, '6x8', '10-12 inches', '#2', '80-100'), (3, '6x8', '10-12 inches', '#1B', '150-180'),
(3, '6x9', '10-12 inches', '#1', '200-230'), (3, '6x9', '10-12 inches', '#2', '80-100'), (3, '6x9', '10-12 inches', '#1B', '200-230'),
(3, '8x10', '10-12 inches', '#1', '200-230'), (3, '8x10', '10-12 inches', '#2', '80-100'), (3, '8x10', '10-12 inches', '#1B', '200-230');

-- Seed Inventory for Product 4 (Mono Front Lace)
INSERT INTO Inventory (product_id, base_size, length, color, quantity) VALUES
(4, '9x7', '10-12 inches', '#1', '100-120'), (4, '9x7', '10-12 inches', '#2', '80-100'), (4, '9x7', '10-12 inches', '#1B', '150-180'),
(4, '6x8', '10-12 inches', '#1', '100-120'), (4, '6x8', '10-12 inches', '#2', '80-100'), (4, '6x8', '10-12 inches', '#1B', '150-180'),
(4, '6x9', '10-12 inches', '#1', '200-230'), (4, '6x9', '10-12 inches', '#2', '80-100'), (4, '6x9', '10-12 inches', '#1B', '200-230'),
(4, '8x10', '10-12 inches', '#1', '200-230'), (4, '8x10', '10-12 inches', '#2', '80-100'), (4, '8x10', '10-12 inches', '#1B', '200-230');

-- Seed Inventory for Product 5 (Australia)
INSERT INTO Inventory (product_id, base_size, length, color, quantity) VALUES
(5, '9x7', '10-12 inches', '#1', '100-120'), (5, '9x7', '10-12 inches', '#2', '80-100'), (5, '9x7', '10-12 inches', '#1B', '150-180'),
(5, '6x8', '10-12 inches', '#1', '100-120'), (5, '6x8', '10-12 inches', '#2', '80-100'), (5, '6x8', '10-12 inches', '#1B', '150-180'),
(5, '6x9', '10-12 inches', '#1', '200-230'), (5, '6x9', '10-12 inches', '#2', '80-100'), (5, '6x9', '10-12 inches', '#1B', '200-230'),
(5, '8x10', '10-12 inches', '#1', '200-230'), (5, '8x10', '10-12 inches', '#2', '80-100'), (5, '8x10', '10-12 inches', '#1B', '200-230');

-- Seed Inventory for Product 6 (Full Lace)
INSERT INTO Inventory (product_id, base_size, length, color, quantity) VALUES
(6, '9x7', '10-12 inches', '#1', '100-120'), (6, '9x7', '10-12 inches', '#2', '80-100'), (6, '9x7', '10-12 inches', '#1B', '150-180'),
(6, '6x8', '10-12 inches', '#1', '100-120'), (6, '6x8', '10-12 inches', '#2', '80-100'), (6, '6x8', '10-12 inches', '#1B', '150-180'),
(6, '6x9', '10-12 inches', '#1', '200-230'), (6, '6x9', '10-12 inches', '#2', '80-100'), (6, '6x9', '10-12 inches', '#1B', '200-230'),
(6, '8x10', '10-12 inches', '#1', '200-230'), (6, '8x10', '10-12 inches', '#2', '80-100'), (6, '8x10', '10-12 inches', '#1B', '200-230');

DROP TABLE IF EXISTS Inquiries;
DROP TABLE IF EXISTS Messages;

CREATE TABLE Inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_email TEXT NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    base TEXT,
    color TEXT,
    density TEXT,
    quantity INTEGER,
    offered_price REAL,
    final_price REAL,
    status TEXT DEFAULT 'Negotiating',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inquiry_id INTEGER NOT NULL,
    sender_role TEXT NOT NULL,
    sender_name TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS Tracking;

CREATE TABLE Tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no TEXT UNIQUE NOT NULL,
    quantity INTEGER,
    value REAL,
    delivery_country TEXT,
    current_status TEXT,
    tracking_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
