-- ----------------------------------------------------------------
-- ADVANCED DATABASE LOGIC - STELLAR SOLES
-- This script implements advanced DBMS features as per the syllabus.
-- ----------------------------------------------------------------

-- Implements Lecture 21: Views & Schema Modification
-- First, add the stock_quantity column to our products table to track inventory.
ALTER TABLE products ADD COLUMN stock_quantity INT NOT NULL DEFAULT 50;

-- Now, create a view that only shows products that are in stock.
-- This simplifies the query for the client application and hides the underlying table structure.
-- We use GROUP_CONCAT to aggregate the available sizes for each product into a single string.
CREATE OR REPLACE VIEW view_available_products AS
SELECT 
    p.id,
    p.name,
    p.price,
    p.gender,
    p.occasion,
    p.img_url,
    p.stock_quantity,
    GROUP_CONCAT(ps.size) AS sizes
FROM 
    products p
JOIN 
    product_sizes ps ON p.id = ps.product_id
WHERE 
    p.stock_quantity > 0
GROUP BY
    p.id, p.name, p.price, p.gender, p.occasion, p.img_url, p.stock_quantity;

-- ----------------------------------------------------------------

-- Implements Lecture 22-23: Stored Procedures
-- Procedure for creating a new user. This abstracts the INSERT logic.
DELIMITER $$
CREATE PROCEDURE sp_create_user(
    IN p_id VARCHAR(50),
    IN p_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    INSERT INTO users (id, name, email, password) 
    VALUES (p_id, p_name, p_email, p_password_hash);
END$$
DELIMITER ;

-- ----------------------------------------------------------------

-- Implements Lecture 25-27: Transactions/Concurrency & Lecture 22-23: Stored Procedures
-- Procedure for placing a complete order with multiple items.
-- This procedure uses a transaction to ensure all parts of the order succeed or fail together (ACID).
DELIMITER $$
CREATE PROCEDURE sp_place_order(
    IN p_order_id VARCHAR(50),
    IN p_user_id VARCHAR(50),
    IN p_total_amount DECIMAL(10, 2),
    IN p_items JSON
)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE item_product_id VARCHAR(50);
    DECLARE item_size VARCHAR(50);
    DECLARE item_qty INT;
    DECLARE item_price DECIMAL(10, 2);
    DECLARE current_stock INT;

    -- Error handler to rollback transaction on any failure
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL; -- Propagate the error
    END;

    -- Start the transaction
    START TRANSACTION;

    -- 1. Insert the main order record
    INSERT INTO orders (id, user_id, total_amount, order_date) 
    VALUES (p_order_id, p_user_id, p_total_amount, NOW());

    -- 2. Loop through the JSON array of items
    WHILE i < JSON_LENGTH(p_items) DO
        -- Extract item details from the JSON array
        SET item_product_id = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', i, '].id')));
        SET item_size = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', i, '].size')));
        SET item_qty = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', i, '].qty')));
        SET item_price = JSON_UNQUOTE(JSON_EXTRACT(p_items, CONCAT('$[', i, '].price')));

        -- Check for sufficient stock
        SELECT stock_quantity INTO current_stock FROM products WHERE id = item_product_id;
        
        IF current_stock < item_qty THEN
            -- If stock is insufficient, signal an error to trigger the handler
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock for product.';
        END IF;

        -- Insert the item into order_items. The trigger will handle the stock update.
        INSERT INTO order_items (order_id, product_id, size, quantity, price)
        VALUES (p_order_id, item_product_id, item_size, item_qty, item_price);
        
        SET i = i + 1;
    END WHILE;

    -- If all items were inserted successfully, commit the transaction
    COMMIT;
END$$
DELIMITER ;

-- ----------------------------------------------------------------

-- Implements Lecture 24: Triggers
-- This trigger automatically reduces the stock_quantity in the products table
-- AFTER a new record is inserted into the order_items table.
DELIMITER $$
CREATE TRIGGER trg_reduce_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity 
    WHERE id = NEW.product_id;
END$$
DELIMITER ;
