# Gemini Project Migration Plan: stellar-sole

This document tracks the migration from `json-server` to a Node.js, Express, and MySQL backend.

## Project Status

- [x] **Phase 1: Reconnaissance & Gap Analysis**
- [x] **Phase 2: Database Design (JSON to SQL)**
- [x] **Phase 3: Backend Construction**
  - [x] Install required npm packages
  - [x] Create `server.js`
  - [x] Create `.gitignore` and `.env` files
  - [x] Implement database connection
  - [x] Update `package.json` start script
  - [x] Secure passwords (hashing)
  - [x] Replicate API endpoints *(Complete)*
  - [x] Refactor for Syllabus Compliance
- [x] **Phase 4: Advanced Database Logic**
  - [x] Moved business logic into the database using Stored Procedures, Triggers, and Views.
  - [x] Created `advanced_db_logic.sql` to house new database objects.
  - [x] Refactored `server.js` to act as a thin client.

## Migration Complete!

The migration from `json-server` to a full Node.js/Express/MySQL backend is complete.

Here is how to run your new application:

1.  **Set Up Your Database**:
    *   Make sure your MySQL server is running.
    *   Create a new database.
    *   Execute the `schema.sql` script I created to set up all the necessary tables.
    *   **Execute the `advanced_db_logic.sql` script to add the stored procedures, views, and triggers.**

2.  **Configure Credentials**:
    *   Open the `.env` file.
    *   Fill in your `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` with your actual database credentials.

3.  **Migrate Your Data**:
    *   Run the command `npm run migrate`. This will safely transfer your data from `db.json` into your new MySQL database, hashing user passwords along the way.

4.  **Start the Backend Server**:
    *   Run the command `npm start`. Your new backend will be running on `http://localhost:3001`.

5.  **Open the Frontend**:
    *   Open the `index.html` file in your browser. The application should now be fully functional, using the new backend.

All frontend files have been updated to point to the new API endpoints, and all backend logic has been implemented. Congratulations!

---
## Recent Changes
- **Implemented Advanced DB Logic:** Moved business logic (ordering, stock, user creation) into the database using Stored Procedures (`sp_place_order`, `sp_create_user`), a View (`view_available_products`), and a Trigger (`trg_reduce_stock`) as defined in `advanced_db_logic.sql`.
- **Refactored `server.js`:** The Node.js backend now acts as a "thin client," calling stored procedures instead of containing business logic.
- Refactored SQL and Migration script to strictly adhere to DBMS Syllabus Units 1 & 4.
- Fixed `migrate.js` to handle ISO date format conversion, resolving `Incorrect datetime value` error.
- Fixed broken images on the store page by updating `store.js` to use the correct `img_url` property.
---

## Migration Log to Backend Conn/ (2025-11-25)

The Stellar Soles backend and frontend have been successfully migrated into the `Backend Conn/` template structure.

### Key Migration Steps:

*   **`Backend Conn/.env`**: The project's `.env` file was copied to `Backend Conn/.env`.
*   **`Backend Conn/server.js`**:
    *   Updated to load environment variables via `dotenv`.
    *   Removed the inline `mysql.createConnection` and `init.sql` execution, deferring database connection to `db.js`.
    *   Removed `todoRoutes` import and usage.
    *   Integrated new routes for products, orders, exchanges, and newsletter.
    *   Updated `PORT` to use `process.env.PORT` (defaulting to `3001`).
*   **`Backend Conn/db.js`**:
    *   Updated to load environment variables via `dotenv`.
    *   Configured to use `process.env.DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` (set to `stellar_soles_db`).
*   **`Backend Conn/sql/init.sql`**:
    *   Completely replaced with the combined content of the original `schema.sql` and `advanced_db_logic.sql`. This includes all Stellar Soles tables, views (`view_available_products`), stored procedures (`sp_create_user`, `sp_place_order`), and triggers (`trg_reduce_stock`).
*   **`Backend Conn/routes/`**:
    *   `auth.js` was modified to use the `sp_create_user` stored procedure for registration, aligning with Stellar Soles' authentication logic, and all dependencies on `data/users.json` were removed.
    *   `todos.js` was deleted as it was not relevant to the project.
    *   New route files were created: `products.js`, `orders.js`, `exchanges.js`, `newsletter.js`.
    *   The API endpoint logic for these functionalities was extracted from the original `server.js` and placed into their respective new route files.
*   **`Backend Conn/data/users.json`**: Deleted as it's no longer used.
*   **`Backend Conn/public/`**: All static frontend files (HTML, JS, CSS, images) from the root directory were moved into this folder. This includes `index.html`, `store.html`, `checkout.html`, `payment.html`, `profile.html`, `login.html`, `signup.html`, `about.html`, `contact.html`, `exchange.html`, `navbar.js`, `checkout.js`, `exchange.js`, `login.js`, `payment.js`, `profile.js`, `signup.js`, `store.js`, and `stellarsole.png`.
*   **`Backend Conn/package.json`**: Updated to include `dotenv` as a dependency.
*   **Dependencies**: `npm install` was run within `Backend Conn/` to ensure all new/updated dependencies are installed.

### Syllabus Compliance Confirmation:

All original syllabus-compliant logic (Stored Procedures, Views, Triggers, Transactions) has been successfully preserved and integrated into the new template structure. The Node.js application (`server.js`) now acts as a thin client, relying on the MySQL database to enforce business rules and manage data integrity.

### Next Steps:

To run the new migrated server and application, please follow the instructions below.