# Migration Plan for Stellar Soles Backend

This plan outlines the migration of the existing Stellar Soles Node.js/Express/MySQL backend into the `Backend Conn/` template provided by the professor. The goal is to adapt my project's logic to the template's structure while preserving all syllabus-compliant DBMS features.

## 1. Core Component Mapping

| Original Project (Root)                               | New Template (`Backend Conn/`)                        | Notes                                                                                                                                                                                                                                                                                                                                           |
| :---------------------------------------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.env` (DB credentials)                               | Used by `Backend Conn/db.js` & `Backend Conn/server.js` | The root `.env` will be retained and `require('dotenv').config()` will be added to `server.js` and `db.js` in `Backend Conn/` to ensure credentials are loaded.                                                                                                                                                                                    |
| `server.js` (Main app, routes, DB pool setup)         | `Backend Conn/server.js` (App setup, middleware, route mounting), `Backend Conn/db.js` (DB Pool) | The main `server.js` logic will be split: app setup and route mounting in `Backend Conn/server.js`, and the dedicated DB connection pool in `Backend Conn/db.js`.                                                                                                                                                                              |
| `schema.sql`, `advanced_db_logic.sql`                 | `Backend Conn/sql/init.sql`                           | The combined content of my `schema.sql` and `advanced_db_logic.sql` (which includes all tables, views, stored procedures, and triggers) will **replace** the existing `Backend Conn/sql/init.sql` content. This centralizes all database DDL and advanced logic.                                                                             |
| `migrate.js`                                          | (Retained in root)                                    | The `migrate.js` script will remain in the root directory for initial data population after the database is set up with the new `init.sql`. It relies on the root `.env`.                                                                                                                                                               |
| Frontend HTML/JS/Image files (`index.html`, `store.js`, `stellarsole.png`, etc.) | `Backend Conn/public/`                                | ALL static frontend files currently in the root directory will be moved into `Backend Conn/public/`. This aligns with the template's `express.static` serving.                                                                                                                                                                           |

## 2. Route and API Endpoint Migration

The modular routing pattern of `Backend Conn/` will be adopted.

*   **`Backend Conn/routes/auth.js`**:
    *   The `POST /register` and `POST /login` logic from my original `server.js` will replace the existing logic in `Backend Conn/routes/auth.js`.
    *   The `sp_create_user` stored procedure will be called for registration.
    *   The `data/users.json` file and associated `saveUserToJson` logic will be **removed** as user data is now fully managed by MySQL.
*   **`Backend Conn/routes/products.js` (NEW FILE)**:
    *   Will be created in `Backend Conn/routes/`.
    *   Will handle the `GET /api/products` endpoint, using the `view_available_products`.
*   **`Backend Conn/routes/orders.js` (NEW FILE)**:
    *   Will be created in `Backend Conn/routes/`.
    *   Will handle the `POST /api/orders` endpoint, using the `sp_place_order` stored procedure.
    *   Will handle the `GET /api/orders/user/:userId` endpoint for fetching user-specific orders.
*   **`Backend Conn/routes/exchanges.js` (NEW FILE)**:
    *   Will be created in `Backend Conn/routes/`.
    *   Will handle the `POST /api/exchanges` endpoint for requesting exchanges.
    *   Will handle the `GET /api/exchanges/user/:userId` endpoint for fetching user-specific exchange requests.
*   **`Backend Conn/routes/newsletter.js` (NEW FILE)**:
    *   Will be created in `Backend Conn/routes/`.
    *   Will handle the `POST /api/newsletter` endpoint for subscriptions.
*   **`Backend Conn/routes/todos.js`**:
    *   This file, and its associated `/api/todos` routes, will be **removed** as it is not relevant to the Stellar Soles project.
*   **`Backend Conn/server.js` (Route Mounting)**:
    *   Will be updated to mount the new product, order, exchange, and newsletter routes, and remove the `todos` route.

## 3. `package.json` and Dependencies

*   The `package.json` in `Backend Conn/` will be updated to include `dotenv`.
*   An `npm install` command will be run inside `Backend Conn/` to ensure all dependencies are met.

## 4. Syllabus Compliance Check

The migration explicitly preserves and leverages all syllabus-compliant DBMS features:

*   `CALL sp_create_user` will be used for user registration.
*   `CALL sp_place_order` will be central to the order placement process, ensuring transactional integrity (Atomicity).
*   `view_available_products` will be used for fetching products, abstracting underlying data.
*   `trg_reduce_stock` (part of the new `init.sql`) will automatically manage product inventory.
*   All existing tables and their relationships (Foreign Keys, Normalization) will be maintained as defined in `schema.sql`.

This ensures that the "brain" of the project remains within the MySQL database, with Node.js acting as a thin client, fully compliant with the syllabus requirements.

## 5. Execution Steps

1.  Read root `.env` values.
2.  Add `require('dotenv').config()` to `Backend Conn/server.js` and `Backend Conn/db.js`.
3.  Update `Backend Conn/db.js` with root `.env` database credentials and database name `stellar_soles_db`.
4.  Remove `mysql.createConnection` and `init.sql` execution from `Backend Conn/server.js`.
5.  Create new route files: `Backend Conn/routes/products.js`, `orders.js`, `exchanges.js`, `newsletter.js`.
6.  Migrate API logic from root `server.js` into these new route files.
7.  Modify `Backend Conn/routes/auth.js` with Stellar Soles auth logic, removing `data/users.json` dependency.
8.  Remove `Backend Conn/routes/todos.js` and its mounting in `Backend Conn/server.js`.
9.  Update `Backend Conn/server.js` to mount the new routes.
10. Combine `schema.sql` and `advanced_db_logic.sql` content and replace `Backend Conn/sql/init.sql`.
11. Add `dotenv` to `Backend Conn/package.json` dependencies.
12. Move all root frontend files into `Backend Conn/public/`.
13. Run `npm install` in `Backend Conn/`.
14. Update `gemini.md` with migration log.
15. Provide command to start server.
