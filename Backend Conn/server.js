require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import route files
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const exchangesRoutes = require('./routes/exchanges');
const newsletterRoutes = require('./routes/newsletter');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/exchanges', exchangesRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Start server
const PORT = process.env.PORT || 3001; // Use env PORT or default to 3001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// Project Summary 

// | File/Folder         | Purpose                         |
// | ------------------- | ------------------------------- |
// | `package.json`      | Project setup & dependencies    |
// | `server.js`         | Starts backend server           |
// | `db.js`             | Database connection             |
// | `routes/auth.js`    | Register/Login backend logic    |
// | `data/users.json`   | Stores registered users locally |
// | `public/index.html` | Frontend UI                     |
// | `public/styles.css` | Page design                     |
// | `public/script.js`  | Frontend logic & API calls      |
// | `sql/init.sql`      | Database setup commands         |


// DBMS Concepts Used in Your Project:

// You implemented these:
// Tables
// Foreign Keys
// Normalization
// Views
// Triggers
// Stored Procedures
// Cursor
// Joins (as Views)
// Auto Default Category (Trigger)