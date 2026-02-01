const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 9,
    queueLimit: 0,
    enableKeepAlive: true,

    ssl: {
        rejectUnauthorized: false
    }
});

// Logs de conexão apenas em desenvolvimento
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  connection.on('connection', (conn) => {
    console.log(`[POOL] Nova conexão. Total: ${connection.pool._allConnections.length}`);
  });
}

module.exports = connection;
