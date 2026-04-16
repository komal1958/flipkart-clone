const mysql = require('mysql2/promise');
require('dotenv').config();
(async () => {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'flipkart_clone',
    port: process.env.DB_PORT || 3306,
  });
  const [rows] = await pool.execute('SELECT id, name, images FROM products WHERE name LIKE ?', ['%Rich Dad Poor Dad%']);
  console.log(JSON.stringify(rows, null, 2));
  await pool.end();
})();
