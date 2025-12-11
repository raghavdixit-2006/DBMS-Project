# 🎓 The "Stellar Soles" DBMS Masterclass: How Your Project Crushes the Syllabus

This guide translates your code into "Exam Answers" for the external examiner. It maps every line of code to a concept in your syllabus.

---

# 1. The Basics (Syllabus Unit 1)

## **The Data Model (Entity)**
**Concept:** An Entity is a "thing" in the real world that we want to store data about. It becomes a **Table** in our database.
**Your Code:** The `products` table perfectly represents an Entity.
```sql
CREATE TABLE products (
  id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  gender VARCHAR(50),
  occasion VARCHAR(100),
  img_url VARCHAR(1024),
  PRIMARY KEY (id)
);
```
**Teacher's Note:** Notice how `name`, `price`, `gender` are *attributes* that describe the entity "Product".

## **Integrity Constraints (PK & FK)**
**Concept:**
*   **Primary Key (PK):** A unique ID badge. No two rows can have the same ID.
*   **Foreign Key (FK):** A "link" or "luggage tag" that connects one table to another.

**Your Code:** Look at your `orders` table.
```sql
CREATE TABLE orders (
  id VARCHAR(50) NOT NULL,          -- The Primary Key (Unique Order ID)
  user_id VARCHAR(50) NOT NULL,     -- The Foreign Key (Links to Users table)
  ...
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
**Analogy:** The `user_id` in the `orders` table acts like a luggage tag. It doesn't contain the user's name or email; it just points (references) to the `users` table where that info lives. `ON DELETE CASCADE` means if you delete the User, their Orders (luggage) get deleted too!

---

# 2. Organizing the Mess (Syllabus Unit 3 - Normalization)

## **Normalization (The 'Why' and 'How')**
**Concept:** Normalization is the art of organizing tables to reduce redundancy. We don't want to repeat data.

### **1NF (First Normal Form)**
**Rule:** Each cell should have a single (atomic) value. No lists!
**Your Code:** You have a `product_sizes` table.
*   **Bad Way (Not 1NF):** Storing sizes as "7, 8, 9, 10" inside the `products` table.
*   **Your Good Way (1NF):** You created a separate table where each size gets its own row.
```sql
CREATE TABLE product_sizes (
  id INT NOT NULL AUTO_INCREMENT,
  product_id VARCHAR(50) NOT NULL,
  size VARCHAR(50) NOT NULL,       -- Holds ONE size per row (e.g., 'UK 7')
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(id) ...
);
```
**Analogy:** Instead of stuffing all your toys (sizes) into one big heavy box (the products table), you gave each toy its own small shelf (product_sizes table). This makes it easy to find and count them!

---

# 3. Talking to the Database (Syllabus Unit 4 & 5)

## **DDL vs DML**
*   **DDL (Data Definition Language):** Defines structure. *Ex: Building the house.*
    *   **Your Code:** `CREATE TABLE products (...)` (in `init.sql`) is DDL.
*   **DML (Data Manipulation Language):** Manipulates data. *Ex: Moving furniture in.*
    *   **Your Code:** `INSERT INTO orders ...` (in `sp_place_order`) is DML.

## **JOINS (Inner Join)**
**Concept:** Combining rows from two or more tables based on a related column.
**Your Code:** In your view `view_available_products`, you create a "Virtual Window" by Velcro-ing tables together.
```sql
SELECT ...
FROM 
    products p
JOIN 
    product_sizes ps ON p.id = ps.product_id -- The Velcro!
```
**Explanation:** This joins the `products` details (Name, Price) with their specific `sizes`. An **Inner Join** (default here) only matches shoes that actually *have* sizes listed.

## **SQL Injection Prevention (Security)**
**Concept:** Hackers might try to type `admin" --` into a login box to trick the database.
**Your Code:** You use `?` placeholders in your Node.js code (`routes/auth.js`).
```javascript
// routes/auth.js
const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
```
**Analogy:** The `?` acts like a "quarantine zone". Whatever the user types is treated strictly as text, not as executable code. It stops the hacker from breaking in!

---

# 4. The Magic Automation (Syllabus Unit 6)

## **Views (Virtual Windows)**
**Concept:** A saved query that looks like a table.
**Your Code:** `view_available_products`
```sql
CREATE OR REPLACE VIEW view_available_products AS
SELECT p.id, p.name, p.stock_quantity ...
FROM products p ...
WHERE p.stock_quantity > 0;
```
**Why:** It's a "Virtual Window" that only shows shoes *with stock*. You don't have to type `WHERE stock_quantity > 0` every time you query; you just look through this window!

## **Stored Procedures**
**Concept:** A saved collection of SQL statements (a recipe).
**Your Code:** `sp_place_order` (in `init.sql`)
```sql
CREATE PROCEDURE sp_place_order(...)
BEGIN
   -- 1. Check stock
   -- 2. Insert into Orders
   -- 3. Insert into Order Items
   -- 4. Commit Transaction
END
```
**Analogy:** It's a "Saved Recipe". Instead of the Node.js backend sending 50 separate instructions ("Check egg", "Crack egg", "Fry egg"), it sends ONE command: `CALL sp_place_order(...)` ("Make Breakfast"). It's faster and safer.

## **Triggers (The Domino Effect)**
**Concept:** Code that automatically runs ("fires") in response to an event.
**Your Code:** `trg_reduce_stock`
```sql
CREATE TRIGGER trg_reduce_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity 
    WHERE id = NEW.product_id;
END
```
**Explanation:** This is pure magic.
1.  **Event:** A new row is added to `order_items` (User buys a shoe).
2.  **Action:** The database *automatically* runs to the `products` table and subtracts the quantity.
**Analogy:** A Domino effect—One tile falls (Order Placed), and the next tile falls automatically (Stock Reduced). You don't have to write extra code to decrease stock!

---

# 5. Safety & Transactions (Syllabus Unit 7)

## **ACID Properties**
**Concept:** Ensures database reliability.
*   **Atomicity:** All or nothing.
*   **Consistency:** Data must be valid.
*   **Isolation:** Transactions don't interfere.
*   **Durability:** Saved forever.

**Your Code:** Inside `sp_place_order`:
```sql
START TRANSACTION;   -- Begin the "All or Nothing" block

-- If putting an item fails (e.g., out of stock), we jump here:
DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK; 

-- Code to Insert Order...
-- Code to Insert Items...

COMMIT; -- Save everything ONLY if all steps succeeded.
```
**Explanation:** If the user tries to buy 3 items, and the 3rd one fails, `ROLLBACK` undoes the *entire* order. It prevents "Half-Orders" (Atomicity).

## **Concurrency Control**
**Concept:** What if two people grab the last pair of Nikes at the *exact same millisecond*?
**Your Code:**
```sql
SELECT stock_quantity INTO current_stock FROM products WHERE id = item_product_id;
        
IF current_stock < item_qty THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock for product.';
END IF;
```
**Explanation:** By checking `current_stock` *inside* the Transaction (and Procedure), combined with MySQL's default locking mechanisms, the database forces these requests to "wait in line". The second person will check the stock *after* the first person's transaction has reduced it, causing the `IF` check to fail.
