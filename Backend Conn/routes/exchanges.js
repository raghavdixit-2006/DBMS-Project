const express = require('express');
const router = express.Router();
const db = require('../db'); // Using the pooled connection

// POST a new exchange request
router.post('/', async (req, res) => {
  const { orderId, reason } = req.body;
  const exchangeId = 'ex-' + Date.now().toString(); // Generate unique ID

  if (!orderId || !reason) {
    return res.status(400).json({ error: 'Order ID and reason are required.' });
  }

  try {
    const connection = await db.getConnection();
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
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const connection = await db.getConnection();
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

module.exports = router;