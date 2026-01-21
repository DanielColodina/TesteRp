const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,

    ssl: {
        rejectUnauthorized: false
    }
});

console.log('[LOG] Tentando conectar ao banco...');
connection.getConnection()
  .then(conn => {
    console.log('[LOG] ✅ Conectado com sucesso');
    conn.release();
  })
  .catch(err => {
    console.error('[LOG] ❌ Erro ao conectar:', err.message);
  });

module.exports = connection;
