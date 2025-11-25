# THE MAIN PROJECT IS IN  `Backend Conn/`

---
# Usage

---
### **New "Backend Conn" Application (Professor's Template)**

The primary application has been migrated to the `Backend Conn/` directory, adopting a modular structure as per the professor's template. Please use the following instructions to run the application.

#### 1. Set Up Your MySQL Database
First, ensure you have a MySQL server installed and running.

*   **Create a new database**: 
    ```sql
    CREATE DATABASE IF NOT EXISTS stellar_soles_db;
    ```
*   **Execute the Initialization Script**: Navigate to the project root directory in your terminal and execute the `init.sql` script located inside `Backend Conn/sql/`. This script is idempotent, meaning it can be run multiple times without causing errors. It will create all tables, views, stored procedures, and triggers.
    ```bash
    mysql -u your_mysql_user -p stellar_soles_db < "Backend Conn/sql/init.sql"
    ```
    (Replace `your_mysql_user` with your MySQL username and you will be prompted for your password.)

#### 2. Configure Database Credentials
The application uses a `.env` file to securely store database credentials.

*   **Open `.env`**: In the `Backend Conn/` directory, open the `.env` file.
*   **Fill in your details**: Update the placeholder values with your actual MySQL database connection details.

#### 3. Install Dependencies
Make sure you have Node.js and npm installed.

*   **Install npm packages**: In your terminal, navigate into the `Backend Conn` directory and run:
    ```bash
    cd "Backend Conn"
    npm install
    ```

#### 4. Migrate Your Data (Optional)
To populate your database with the initial product and user data, you can run the migration script from the **project root directory**.

*   **Run the migration script**: 
    ```bash
    npm run migrate
    ```

#### 5. Start the Backend Server
Launch the new modular Node.js Express backend.

*   **Start the server (from the project root)**: 
    ```bash
    npm start --prefix "Backend Conn"
    ```
    The backend server will start on `http://localhost:3001`.

#### 6. Open the Frontend
Access the web application in your browser.

*   **Open `index.html`**: Open the `index.html` file located in the `Backend Conn/public/` directory in your web browser.

---
### **Old Monolithic Application (Historical)**

*The following instructions apply to the original, monolithic `server.js` which is now deprecated but kept for historical reference.*

To get the Stellar Soles application up and running on your local machine, follow these steps:

#### 1. Set Up Your MySQL Database
First, ensure you have a MySQL server installed and running.

*   **Create a new database**: Open your MySQL client (e.g., MySQL Workbench, command line) and create a new database for this project. For example:
    ```sql
    CREATE DATABASE stellar_soles_db;
    ```
*   **Execute the Schema**: Navigate to the project root directory in your terminal and execute the `schema.sql` script against your newly created database. This will set up all the necessary tables.
    ```bash
    mysql -u your_mysql_user -p stellar_soles_db < schema.sql
    ```
    (Replace `your_mysql_user` with your MySQL username and `stellar_soles_db` with your database name. You will be prompted for your MySQL password.)

#### 2. Configure Database Credentials
The application uses a `.env` file to securely store database credentials.

*   **Open `.env`**: In the project root, open the `.env` file.
*   **Fill in your details**: Update the placeholder values with your actual MySQL database connection details:
    ```
    DB_HOST=localhost
    DB_USER=your_mysql_user_name
    DB_PASSWORD=your_mysql_password
    DB_NAME=stellar_soles_db
    PORT=3001
    ```
    (Ensure `DB_NAME` matches the database you created in step 1.)

#### 3. Install Dependencies
Make sure you have Node.js and npm installed.

*   **Install npm packages**: In the project root directory, open your terminal and run:
    ```bash
    npm install
    ```

#### 4. Migrate Your Data
Transfer the initial product and user data from the `db.json` file into your new MySQL database.

*   **Run the migration script**: In your terminal, execute:
    ```bash
    npm run migrate
    ```
    This script will securely hash user passwords and populate your MySQL tables.

#### 5. Start the Backend Server
Launch the Node.js Express backend.

*   **Start the server**: In your terminal, run:
    ```bash
    npm start
    ```
    The backend server will start on `http://localhost:3001`.

#### 6. Open the Frontend
Access the web application in your browser.

*   **Open `index.html`**: Simply open the `index.html` file located in the project root directory in your web browser.

You should now have the Stellar Soles application fully functional, connected to your MySQL backend!

# Stellar Soles: Backend Migration Project

This document provides a comprehensive overview of the Stellar Soles web application, detailing the migration from a `json-server` mock backend to a full-fledged Node.js, Express, and MySQL stack.

## SECTION 1: EXECUTION LOG (The "What")

This section chronicles the specific actions taken, files impacted, and architectural decisions made during the migration process.

### Actions & File Modifications

*   **Initial Analysis**: A gap analysis was performed on the original frontend-only project to identify missing backend components.
*   **Dependencies Installed**: The following `npm` packages were added to support the new backend:
    *   `express`: For the server framework.
    *   `mysql2`: For connecting to the MySQL database.
    *   `cors`: To enable cross-origin requests from the frontend.
    *   `dotenv`: To manage environment variables securely.
    *   `bcrypt`: For hashing user passwords.
*   **Files Created**:
    *   `.gitignore`: To prevent `node_modules` and `.env` from being committed.
    *   `server.js`: The main entry point for the Express backend application.
    *   `.env`: To store confidential database credentials.
    *   `schema.sql`: Contains the DDL scripts for creating the MySQL database schema.
    *   `migrate.js`: A Node.js script to migrate data from `db.json` to the MySQL database.
    *   `gemini.md`: A living document used to track the migration progress.
*   **Files Modified**:
    *   `package.json`: Updated the `start` script to `node server.js` and added a `migrate` script.
    *   `migrate.js`: Updated to handle data type mismatches for both string IDs (e.g. '53b8') and ISO date formats (e.g. '2025-11-17T05:26:30.980Z').
    *   `store.js`: Updated to fetch products from the new `/api/products` endpoint and to use the correct `img_url` property to fix broken images.
    *   `signup.js`: Reworked to use the new `/api/users/register` endpoint, which includes server-side validation for duplicate emails.
    *   `login.js`: Replaced an insecure `GET` request with a secure `POST` request to `/api/users/login`.
    *   `profile.js`: Updated to fetch user-specific order and exchange history from the new API.
    *   `payment.js`: Updated to send new order data to the `/api/orders` endpoint.
    *   `index.html`: The newsletter form was updated to post to `/api/newsletter`.

### Flagged "Missing Items" from Gap Analysis

*   **`server.js`**: A backend entry point was missing. (Resolved)
*   **`.gitignore`**: Not present in the original project. (Resolved)
*   **`.env`**: No mechanism for secret management existed. (Resolved)
*   **Backend Dependencies**: Core Node.js packages were not installed. (Resolved)
*   **Password Security**: Passwords were in plaintext in `db.json`. (Resolved by implementing `bcrypt` hashing).
*   **Backend Structure**: The project lacked `routes/` or `controllers/` directories. (Not implemented to maintain simplicity, but noted for future scaling).

### Final MySQL Schema

The following SQL schema was designed and implemented in `schema.sql` to normalize the data from `db.json`.

```sql
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL COMMENT 'This will be a hashed password',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_unique` (`email`)
);

CREATE TABLE `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `gender` VARCHAR(50),
  `occasion` VARCHAR(100),
  `img_url` VARCHAR(1024),
  PRIMARY KEY (`id`)
);

CREATE TABLE `product_sizes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `size` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);

CREATE TABLE `orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `order_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `order_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `size` VARCHAR(50) NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL COMMENT 'Price of the product at the time of order',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);
```

### Syllabus Compliance
- **Used `DELETE FROM` instead of `TRUNCATE` to align with Unit 4 DML.**
- **Removed Storage Engine definitions to align with Unit 1 Standard SQL.**

---

## SECTION 2: ARCHITECTURAL DEEP DIVE (The "How" and "Why")

### The Database Strategy: From JSON to Relational

The original `db.json` file was a simple but inefficient way to store data. It suffered from data duplication and a lack of integrity. For example, a product's sizes were stored in an array within the product object itself.

**Our Relational Approach:**
We adopted a normalized database schema to solve these issues.

*   **Why separate tables?** We created tables like `users`, `products`, `orders`, and `product_sizes`. This process, called **normalization**, reduces redundancy and improves data integrity. For example, instead of storing a list of sizes inside each product, we created `product_sizes`. This makes it easier to manage sizes independently of products.
*   **How they relate (Foreign Keys):** The tables are linked using **Foreign Keys**.
    *   `product_sizes.product_id` links a size to a specific product in the `products` table.
    *   `orders.user_id` links an order to the user who placed it.
    *   `order_items.order_id` links multiple items to a single order, creating a one-to-many relationship. This is far more scalable than the old nested `items` array.

### The Connection Logic: Pooling for Performance

In `server.js`, we initialize the database connection using `mysql.createPool`.

```javascript
// server.js
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  // ... other options
});
```

*   **Why `createPool`?** A `createConnection` call establishes a single, stateful connection. If two users tried to access the database simultaneously, one would have to wait for the other to finish, creating a bottleneck.
*   **The Power of Pooling:** `createPool` creates a "pool" of connections that can be reused. When a request comes in, it borrows a connection from the pool. When it's done, it releases the connection back to the pool for the next request to use. This is crucial for an e-commerce site, as it allows many users to query the database concurrently without exhausting server resources, ensuring the application remains fast and responsive during high traffic.

### Security Best Practices

*   **The `.env` File:** The `.env` file is used to store environment-specific variables, most importantly, database credentials. This file is listed in `.gitignore`, meaning it is **never committed to version control**.
*   **Why is hardcoding dangerous?** If we wrote our database password directly in `server.js`, anyone with access to the source code (e.g., on GitHub) would have our production database credentials. This is a catastrophic security risk. By using `.env`, we keep secrets safe on the server and out of the codebase.
*   **Password Hashing**: We use `bcrypt` to hash user passwords before saving them. If our database is ever compromised, attackers will only see scrambled hashes (e.g., `$2b$10...`), not the actual plaintext passwords, rendering the stolen data useless.

### The API Data Flow: Lifecycle of a Request

Here is the journey of a typical API request, from the user's browser to the database and back:

1.  **Frontend (Client)**: A user action in the browser (e.g., loading the store page) triggers a JavaScript function. This function uses the `fetch` API to make an HTTP request to a specific URL.
    ```javascript
    // store.js
    const res = await fetch("http://localhost:3001/api/products");
    ```

2.  **Backend (Node.js/Express)**: The Express server running in `server.js` is listening for requests. It matches the incoming request's URL and HTTP method (`GET /api/products`) to a defined route handler.

    ```javascript
    // server.js
    app.get('/api/products', async (req, res) => {
      // ...
    });
    ```

3.  **Database Query (MySQL)**: The route handler's code executes its logic. It gets a connection from the `dbPool` and sends a SQL query to the database.

    ```javascript
    // server.js
    const [products] = await connection.query('SELECT * FROM products');
    ```

4.  **Response (Backend -> Frontend)**: The database returns the requested data (a list of products) to the Node.js application. Express then packages this data as a JSON payload and sends it back to the client as the HTTP response.

    ```javascript
    // server.js
    res.json(products);
    ```

5.  **UI Update (Frontend)**: The client's `fetch` call receives the response. The JavaScript code then uses this JSON data to dynamically update the page, for instance, by rendering the product cards on the screen.

---

# DBMS Syllabus Implementation

This section details how advanced database features were implemented to align with the DBMS syllabus, moving business logic from the application layer into the database itself.

### Academic Justification

Moving business logic into the database layer (using Views, Stored Procedures, and Triggers) is a core tenet of robust database design for two primary reasons:

1.  **Data Independence**: The application (the Node.js `server.js` file) becomes a "thin client." It no longer needs to know the underlying table structures or complex business rules. It simply calls a procedure (e.g., `sp_place_order`) and trusts the database to handle the logic. If we later decide to refactor the tables, we only need to update the database objects (the procedure, view, etc.), and the application code requires no changes. This decoupling is a fundamental goal of the relational model.

2.  **Security & Centralization**: By defining rules within the database, we ensure they are always enforced, regardless of which application or user connects. A trigger to reduce stock, for example, will fire whether an order is placed via the web app, a mobile app, or a direct database connection by an administrator. This centralizes control and prevents the application from accidentally or maliciously bypassing critical business rules like stock management.

### Syllabus Mapping

| Syllabus Lecture        | Feature Implemented                                                                       | File / Location                            |
| ----------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------ |
| **Lecture 21: Views**   | A view `view_available_products` was created to abstract the query for in-stock products. | `advanced_db_logic.sql` (Definition)       |
|                         | The application now queries this view instead of the base `products` table.                 | `server.js` (Usage in `/api/products`)     |
| **Lecture 22-23: Stored Procedures** | A procedure `sp_create_user` encapsulates the logic for user registration.                  | `advanced_db_logic.sql` (Definition)       |
|                         | A procedure `sp_place_order` centralizes the entire multi-step order placement logic. | `advanced_db_logic.sql` (Definition)       |
|                         | The Node.js application calls these procedures instead of running raw SQL.                | `server.js` (Usage in `/api/*` routes)     |
| **Lecture 24: Triggers**| A trigger `trg_reduce_stock` automatically updates the `products.stock_quantity` column.  | `advanced_db_logic.sql` (Definition)       |
|                         | This trigger fires `AFTER INSERT` on the `order_items` table.                             | `order_items` table (Implicitly attached)  |
| **Lecture 25-27: Transactions** | The `sp_place_order` procedure wraps the entire order process in a transaction.       | `advanced_db_logic.sql` (Inside procedure) |
|                         | It uses `START TRANSACTION`, `COMMIT`, and `ROLLBACK` (via an error handler) to ensure atomicity. | `sp_place_order` procedure               |

*Additionally, a new `stock_quantity` column was added to the `products` table via an `ALTER TABLE` command to facilitate this new logic.*
