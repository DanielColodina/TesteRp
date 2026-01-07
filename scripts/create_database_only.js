const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({ 
    host: 'localhost', 
    user: 'root', 
    password: 'admin' 
  });
  
  const conn = await pool.getConnection();
  try {
    console.log('📡 Testando conexão...');
    await conn.execute('SELECT 1');
    console.log('✅ Conectado ao MySQL\n');
    
    console.log('🔄 Criando banco de dados...');
    await conn.execute('CREATE DATABASE IF NOT EXISTS rp_empreendimentos');
    console.log('✅ Banco criado\n');
    
    console.log('✅ Agora execute: node scripts/full_setup.js');
    
  } catch(e) { 
    console.error('❌ ERRO:', e.message); 
  } finally {
    conn.release();
    await pool.end();
  }
})();
