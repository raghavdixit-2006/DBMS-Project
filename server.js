// Import required modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using the promise-based version of mysql2
const bcrypt = require('bcrypt');
require('dotenv').config(); // To use variables from .env file

// Create an Express application
const app = express();


// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON body data

// --- Database Connection ---
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB connection
dbPool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the MySQL database.');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.stack);
  });


// --- API Routes ---
app.get('/', (req, res) => {
  res.send('StellarSole Backend Server is running!');
});

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    
    // NOTE: This is a simple implementation that can lead to the N+1 query problem.
    // For a larger scale application, a JOIN would be more performant.
    const [products] = await connection.query('SELECT * FROM products');
    
    for (const product of products) {
      const [sizes] = await connection.query('SELECT size FROM product_sizes WHERE product_id = ?', [product.id]);
      product.sizes = sizes.map(s => s.size);
    }
    
    connection.release();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new user (signup/register)
app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  const id = 'user-' + Date.now().toString(); // Generate unique ID

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    console.log('[Register] Request received for email:', email);
    console.log('[Register] Body:', req.body);
    console.log('[Register] Generated ID:', id);

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('[Register] Password hashed.');

    const connection = await dbPool.getConnection();
    console.log('[Register] Database connection obtained.');
    
    // Insert the new user into the database
    console.log('[Register] Executing INSERT query...');
    await connection.query(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [id, name, email, hashedPassword]
    );
    console.log('[Register] INSERT query successful.');
    
    connection.release();

    res.status(201).json({ id, name, email });

  } catch (error) {
    // Check for duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }
    console.error('!!! [Register] An unexpected error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a user login
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const connection = await dbPool.getConnection();

    // Find the user by email
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];

    // Compare the provided password with the stored hash
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Passwords match. Send back user data, excluding the password hash.
      const { password, ...userWithoutPassword } = user;
      res.json({ message: 'Login successful', user: userWithoutPassword });
    } else {
      // Passwords do not match.
      res.status(401).json({ error: 'Invalid credentials.' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new order
app.post('/api/orders', async (req, res) => {
  const { userId, items, totalAmount } = req.body;
  const orderId = 'order-' + Date.now().toString(); // Generate unique ID

  if (!userId || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
    return res.status(400).json({ error: 'Invalid order data provided.' });
  }

  let connection;
  try {
    connection = await dbPool.getConnection();
    await connection.beginTransaction();

    // 1. Create the order
    await connection.query(
      'INSERT INTO orders (id, user_id, total_amount) VALUES (?, ?, ?)',
      [orderId, userId, totalAmount]
    );

    // 2. Insert each order item
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.size, item.qty, item.price]
      );
    }

    // If all went well, commit the transaction
    await connection.commit();
    
    res.status(201).json({ message: 'Order created successfully', orderId });

  } catch (error) {
    // If anything fails, roll back the transaction
    if (connection) {
      await connection.rollback();
    }
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  } finally {
    // Always release the connection
    if (connection) {
      connection.release();
    }
  }
});

// GET all orders for a specific user
app.get('/api/orders/user/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const connection = await dbPool.getConnection();

    // NOTE: This implementation can also lead to the N+1 query problem.
    // A more performant approach would use a JOIN to fetch orders and items in a single query.
    const [orders] = await connection.query('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [userId]);

    for (const order of orders) {
      const [items] = await connection.query(`
        SELECT oi.*, p.name 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    connection.release();
    res.json(orders);

  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// POST a new exchange request
app.post('/api/exchanges', async (req, res) => {
  const { orderId, reason } = req.body;
  const exchangeId = 'ex-' + Date.now().toString(); // Generate unique ID

  if (!orderId || !reason) {
    return res.status(400).json({ error: 'Order ID and reason are required.' });
  }

  try {
    const connection = await dbPool.getConnection();
    await connection.query(
      'INSERT INTO exchanges (id, order_id, reason) VALUES (?, ?, ?)',
      [exchangeId, orderId, reason]
    );
    connection.release();
    res.status(201).json({ message: 'Exchange request submitted successfully', exchangeId });
  } catch (error) {
    console.error('Error submitting exchange request:', error);
    res.status(500).json({ error: 'Failed to submit exchange request.' });
  }
});

// GET all exchanges for a specific user
app.get('/api/exchanges/user/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const connection = await dbPool.getConnection();
    const [exchanges] = await connection.query(`
      SELECT e.* 
      FROM exchanges e
      JOIN orders o ON e.order_id = o.id
      WHERE o.user_id = ?
      ORDER BY e.requested_at DESC
    `, [userId]);
    connection.release();
    res.json(exchanges);
  } catch (error) {
    console.error(`Error fetching exchanges for user ${userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch exchanges.' });
  }
});

// POST a new newsletter subscriber
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  try {
    const connection = await dbPool.getConnection();
    await connection.query(
      'INSERT INTO newsletter_subscribers (email) VALUES (?)',
      [email]
    );
    connection.release();
    res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // It's often better to return a success message even for duplicates 
      // to avoid letting people check if an email is in the database.
      return res.status(200).json({ message: 'You are already subscribed!' });
    }
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Failed to subscribe to the newsletter.' });
  }
});


// Define the port
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
