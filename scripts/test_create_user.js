const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'rp_empreendimentos',
});

async function test() {
  const conn = await connection.getConnection();
  try {
    console.log('🧪 Testando criação de usuário...\n');

    // Verificar admin existe
    const [admins] = await conn.execute('SELECT * FROM admins WHERE id = 1');
    console.log(`✅ Admin encontrado: ${admins[0].nome}\n`);

    // Inserir novo usuário
    const novoUsuario = {
      nome: 'Teste Novo',
      email: 'novo@teste.com',
      telefone: '11999999999',
      endereco: 'Rua Teste, 100',
      obra: 'Obra Teste',
      admin_id: 1
    };

    const sql = `
      INSERT INTO usuarios (nome, email, telefone, endereco, obra, admin_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    await conn.execute(sql, [
      novoUsuario.nome,
      novoUsuario.email,
      novoUsuario.telefone,
      novoUsuario.endereco,
      novoUsuario.obra,
      novoUsuario.admin_id
    ]);

    console.log('✅ Usuário inserido com sucesso!\n');

    // Verificar dados inseridos
    const [usuarios] = await conn.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [novoUsuario.email]
    );

    if (usuarios.length > 0) {
      const user = usuarios[0];
      console.log('📋 Usuário inserido:');
      console.log(`  - ID: ${user.id}`);
      console.log(`  - Nome: ${user.nome}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Admin ID: ${user.admin_id}`);
      console.log(`  - Data: ${user.created_at}`);
    }

    console.log('\n✅ TESTE PASSOU!');

  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

test();
