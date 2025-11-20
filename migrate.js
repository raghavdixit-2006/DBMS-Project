// migrate.js
// A script to migrate data from db.json to the MySQL database.
// Run with: node migrate.js

const fs = require('fs/promises');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function migrate() {
  let connection;
  try {
    console.log('Reading data from db.json...');
    const data = await fs.readFile('db.json', 'utf8');
    const db = JSON.parse(data);

    connection = await dbPool.getConnection();
    console.log('Successfully connected to the MySQL database.');

    // Using DELETE FROM per Unit 4 DML statements
    console.log('Executing Unit 4 DML: Clearing existing data (using DELETE)...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('DELETE FROM newsletter_subscribers');
    await connection.query('DELETE FROM exchanges');
    await connection.query('DELETE FROM order_items');
    await connection.query('DELETE FROM orders');
    await connection.query('DELETE FROM product_sizes');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Tables cleared.');

    // 1. Migrate Users
    console.log('\nExecuting Unit 4 DML: INSERT into Users table...');
    for (const user of db.users) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      await connection.query('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)', [user.id, user.name, user.email, hashedPassword]);
    }
    console.log(`Successfully migrated ${db.users.length} users.`);

    // 2. Migrate Products and Product Sizes
    console.log('\nExecuting Unit 4 DML: INSERT into Products and Product_Sizes tables...');
    for (const product of db.products) {
      await connection.query('INSERT INTO products (id, name, price, gender, occasion, img_url) VALUES (?, ?, ?, ?, ?, ?)', [product.id, product.name, product.price, product.gender, product.occasion, product.img]);
      if (product.sizes && product.sizes.length > 0) {
        for (const size of product.sizes) {
          await connection.query('INSERT INTO product_sizes (product_id, size) VALUES (?, ?)', [product.id, size]);
        }
      }
    }
    console.log(`Successfully migrated ${db.products.length} products.`);

    // 3. Migrate Orders and Order Items
    console.log('\nExecuting Unit 4 DML: INSERT into Orders and Order_Items tables...');
    for (const order of db.orders) {
      const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      // Convert ISO date to MySQL TIMESTAMP format
      const formattedDate = new Date(order.date).toISOString().slice(0, 19).replace('T', ' ');
      
      // Use the existing string ID from db.json
      await connection.query('INSERT INTO orders (id, user_id, total_amount, order_date) VALUES (?, ?, ?, ?)', [order.id, order.userId, totalAmount, formattedDate]);

      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          // Use the original order.id for the foreign key
          await connection.query('INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)', [order.id, item.id, item.size, item.quantity, item.price]);
        }
      }
    }
    console.log(`Successfully migrated ${db.orders.length} orders.`);

    // 4. Migrate Exchanges
    console.log('\nExecuting Unit 4 DML: INSERT into Exchanges table...');
    for (const exchange of db.exchanges) {
        const formattedDate = new Date(exchange.createdAt).toISOString().slice(0, 19).replace('T', ' ');
        await connection.query('INSERT INTO exchanges (id, order_id, reason, status, requested_at) VALUES (?, ?, ?, ?, ?)', [exchange.id, exchange.orderId, exchange.reason, exchange.status, formattedDate]);
    }
    console.log(`Successfully migrated ${db.exchanges.length} exchanges.`);


    // 5. Migrate Newsletter Subscribers
    console.log('\nExecuting Unit 4 DML: INSERT into Newsletter_Subscribers table...');
    for (const subscriber of db.newsletter) {
      await connection.query('INSERT INTO newsletter_subscribers (email) VALUES (?)', [subscriber.email]);
    }
    console.log(`Successfully migrated ${db.newsletter.length} newsletter subscribers.`);


    console.log('\n\nData migration completed successfully!');

  } catch (error) {
    console.error('\n\n---!!!---');
    console.error('Data migration failed:', error);
    console.error('---!!!---');
  } finally {
    if (connection) {
      connection.release();
      console.log('\nDatabase connection released.');
    }
    await dbPool.end();
  }
}

migrate();