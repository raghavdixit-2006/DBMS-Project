const express = require('express');
const router = express.Router();
const db = require('../db'); // Using the pooled connection

// GET all products from the new view
router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    
    // Using the new view to get available products
    const [products] = await connection.query('SELECT * FROM view_available_products');
    
    // The view_available_products concatenates sizes into a string.
    // We need to split it back into an array for the frontend.
    for (const product of products) {
      product.sizes = product.sizes ? product.sizes.split(',') : [];
    }
    
    connection.release();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products from view:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;