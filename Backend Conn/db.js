require('dotenv').config(); // Load environment variables
const mysql = require('mysql2');


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, // <- change if needed
  password: process.env.DB_PASSWORD, // <- change to your mysql password
  database: process.env.DB_NAME, // Use the database name from .env
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


module.exports = pool.promise();