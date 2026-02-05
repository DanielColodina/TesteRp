const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  ssl: { rejectUnauthorized: false }
});

async function removeOtherAdmins() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✓ Conectado ao banco de dados');

    // Remove todos os admins, exceto test@example.com
    const [result] = await connection.query(
      `DELETE FROM admins WHERE email != 'test@example.com'`
    );
    
    console.log(`✓ Removidos ${result.affectedRows} administradores (exceto test@example.com)`);

    // Verifica quantos admins sobraram
    const [admins] = await connection.query(`SELECT COUNT(*) as count FROM admins`);
    console.log(`Total de administradores restantes: ${admins[0].count}`);

  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    if (connection) connection.release();
    await pool.end();
    console.log('Conexão fechada.');
  }
}

removeOtherAdmins();
