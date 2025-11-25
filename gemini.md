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
