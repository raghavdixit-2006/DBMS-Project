const express = require('express');
const router = express.Router();
const db = require('../db'); // Using the pooled connection

// POST a new newsletter subscriber
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  try {
    const connection = await db.getConnection();
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

module.exports = router;