//Aqui no Controllers criando e solicitando o banco de dados 
const mysql = require('mysql2/promise');

// Criando Conexão com o banco de dados com pool para melhor performance
const connection = mysql.createPool ({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'rp_empreendimentos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    // ⭐ SSL OBRIGATÓRIO PARA AIVEN (certificado auto-assinado)
    ssl: {
        rejectUnauthorized: false
    }
});

// Testar conexão na inicialização e mostrar configuração
console.log('[LOG] Tentando conectar ao banco de dados...');
connection.getConnection()
  .then(conn => {
    console.log('[LOG] ✅ Conectado ao banco de dados');
    console.log('[LOG] 📊 Configuração:');
    console.log(`[LOG]    HOST: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`[LOG]    PORT: ${process.env.DB_PORT || 3306}`);
    console.log(`[LOG]    USER: ${process.env.DB_USER || 'root'}`);
    console.log(`[LOG]    DB: ${process.env.DB_NAME || 'rp_empreendimentos'}`);
    conn.release();
  })
  .catch(err => {
    console.error('[LOG] ❌ Erro ao conectar ao banco:', err.message);
  });

module.exports = connection;