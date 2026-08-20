DROP TABLE IF EXISTS Inventory;

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

ALTER TABLE Inquiries ADD COLUMN length TEXT;
