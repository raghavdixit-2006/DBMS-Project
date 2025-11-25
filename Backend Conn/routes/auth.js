const express = require('express');
const router = express.Router();
const db = require('../db'); // Using the pooled connection
const bcrypt = require('bcrypt');


// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const id = 'user-' + Date.now().toString(); // Generate unique ID as in original project

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const connection = await db.getConnection();
    
    // Call the stored procedure sp_create_user
    await connection.query(
      'CALL sp_create_user(?, ?, ?, ?)',
      [id, name, email, hashedPassword]
    );
    
    connection.release();

    // Respond with created user data without password hash
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


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Safe response: exclude password hash
    const { password: userPassword, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful', user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;