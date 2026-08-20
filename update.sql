DROP TABLE IF EXISTS Inventory;

CREATE TABLE Inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    label TEXT NOT NULL,
    quantity TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Inventory for Product 1 (Hollywood)
INSERT INTO Inventory (product_id, category, label, quantity) VALUES
(1, 'base', '9x7', '100-120'), (1, 'base', '6x8', '100-120'), (1, 'base', '6x9', '200-230'), (1, 'base', '8x10', '200-230'),
(1, 'color', '#1', '100-120'), (1, 'color', '#2', '100-120'), (1, 'color', '#1B', '200-230'),
(1, 'density', '60-90', '100-120'), (1, 'density', '95-110', '100-120'), (1, 'density', '115-130', '200-230');

-- Seed Inventory for Product 2 (BMW)
INSERT INTO Inventory (product_id, category, label, quantity) VALUES
(2, 'base', '9x7', '100-120'), (2, 'base', '6x8', '100-120'), (2, 'base', '6x9', '200-230'), (2, 'base', '8x10', '200-230'),
(2, 'color', '#1', '100-120'), (2, 'color', '#2', '100-120'), (2, 'color', '#1B', '200-230'),
(2, 'density', '60-90', '100-120'), (2, 'density', '95-110', '100-120'), (2, 'density', '115-130', '200-230');

-- Seed Inventory for Product 3 (Mono)
INSERT INTO Inventory (product_id, category, label, quantity) VALUES
(3, 'base', '9x7', '100-120'), (3, 'base', '6x8', '100-120'), (3, 'base', '6x9', '200-230'), (3, 'base', '8x10', '200-230'),
(3, 'color', '#1', '100-120'), (3, 'color', '#2', '100-120'), (3, 'color', '#1B', '200-230'),
(3, 'density', '60-90', '100-120'), (3, 'density', '95-110', '100-120'), (3, 'density', '115-130', '200-230');

-- Seed Inventory for Product 4 (Mono Front Lace)
INSERT INTO Inventory (product_id, category, label, quantity) VALUES
(4, 'base', '9x7', '100-120'), (4, 'base', '6x8', '100-120'), (4, 'base', '6x9', '200-230'), (4, 'base', '8x10', '200-230'),
(4, 'color', '#1', '100-120'), (4, 'color', '#2', '100-120'), (4, 'color', '#1B', '200-230'),
(4, 'density', '60-90', '100-120'), (4, 'density', '95-110', '100-120'), (4, 'density', '115-130', '200-230');

-- Seed Inventory for Product 5 (Australia)
INSERT INTO Inventory (product_id, category, label, quantity) VALUES
(5, 'base', '9x7', '100-120'), (5, 'base', '6x8', '100-120'), (5, 'base', '6x9', '200-230'), (5, 'base', '8x10', '200-230'),
(5, 'color', '#1', '100-120'), (5, 'color', '#2', '100-120'), (5, 'color', '#1B', '200-230'),
(5, 'density', '60-90', '100-120'), (5, 'density', '95-110', '100-120'), (5, 'density', '115-130', '200-230');

-- Seed Inventory for Product 6 (Full Lace)
INSERT INTO Inventory (product_id, category, label, quantity) VALUES
(6, 'base', '9x7', '100-120'), (6, 'base', '6x8', '100-120'), (6, 'base', '6x9', '200-230'), (6, 'base', '8x10', '200-230'),
(6, 'color', '#1', '100-120'), (6, 'color', '#2', '100-120'), (6, 'color', '#1B', '200-230'),
(6, 'density', '60-90', '100-120'), (6, 'density', '95-110', '100-120'), (6, 'density', '115-130', '200-230');

ALTER TABLE Inquiries ADD COLUMN shipping_address TEXT;
