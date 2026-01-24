const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 9, // 🔥 REDUZIDO PARA 3 (LIMITE CLEVER CLOUD)
    queueLimit: 0,
    enableKeepAlive: true,

    ssl: {
        rejectUnauthorized: false
    }
});

// LOGS PARA DEBUG DE CONEXÕES
connection.on('connection', (conn) => {
  console.log(`[POOL] Nova conexão criada. Total ativo: ${connection.pool._allConnections.length}, Disponível: ${connection.pool._freeConnections.length}`);
});

connection.on('enqueue', () => {
  console.log(`[POOL] Query enfileirada. Total ativo: ${connection.pool._allConnections.length}, Disponível: ${connection.pool._freeConnections.length}`);
});

connection.on('release', (conn) => {
  console.log(`[POOL] Conexão liberada. Total ativo: ${connection.pool._allConnections.length}, Disponível: ${connection.pool._freeConnections.length}`);
});


module.exports = connection;
