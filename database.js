const mysql = require('mysql2/promise'); // Use the promise-based version

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',  // Fallback in case the env variables aren't loaded
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'V@38080135k',
  database: process.env.DB_NAME || 'telemed_Demo_1',
  waitForConnections: true,  // Ensures the pool waits for available connections
  connectionLimit: 10,  // Sets the max number of connections in the pool
  queueLimit: 0        // No limit for request queues
});

module.exports = pool;
