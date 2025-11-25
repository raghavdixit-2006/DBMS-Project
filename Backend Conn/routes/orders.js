const express = require('express');
const router = express.Router();
const db = require('../db'); // Using the pooled connection

// POST a new order using a stored procedure
router.post('/', async (req, res) => {
  const { userId, items, totalAmount } = req.body;
  const orderId = 'order-' + Date.now().toString(); // Generate unique ID

  if (!userId || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
    return res.status(400).json({ error: 'Invalid order data provided.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    
    // The entire transaction is now handled by the stored procedure.
    await connection.query(
      'CALL sp_place_order(?, ?, ?, ?)',
      [orderId, userId, totalAmount, JSON.stringify(items)]
    );
    
    res.status(201).json({ message: 'Order created successfully', orderId });

  } catch (error) {
    // Catch errors signaled from the stored procedure (e.g., insufficient stock)
    if (error.sqlState === '45000') {
      console.error('Order failed due to business logic:', error.message);
      return res.status(400).json({ error: 'Insufficient stock for a product in your order.' });
    }
    console.error('Error creating order with stored procedure:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  } finally {
    // Always release the connection
    if (connection) {
      connection.release();
    }
  }
});

// GET all orders for a specific user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const connection = await db.getConnection();

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

module.exports = router;