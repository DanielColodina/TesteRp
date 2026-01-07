/**
 * Teste de login - verificar credenciais
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rp_empreendimentos',
});

async function testLogin() {
  const conn = await connection.getConnection();
  try {
    console.log('🔍 Verificando admin...\n');

    // Listar todos os admins
    const [admins] = await conn.execute('SELECT id, nome, email FROM admins');
    
    console.log('📋 Admins na base:');
    admins.forEach(admin => {
      console.log(`  • ID: ${admin.id}, Nome: ${admin.nome}, Email: ${admin.email}`);
    });

    if (admins.length === 0) {
      console.log('\n⚠️ AVISO: Nenhum admin encontrado!');
      console.log('Criando admin padrão...\n');

      const bcrypt = require('bcrypt');
      const senhaHash = await bcrypt.hash('123456', 10);

      await conn.execute(
        'INSERT INTO admins (nome, email, password) VALUES (?, ?, ?)',
        ['Admin Padrão', 'admin@empresa.com', senhaHash]
      );

      console.log('✅ Admin criado com sucesso!');
      console.log('   Email: admin@empresa.com');
      console.log('   Senha: 123456');
    } else {
      console.log('\n✅ Admins existem na base!');
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

testLogin();
