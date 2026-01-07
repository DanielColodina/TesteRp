const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'rp_empreendimentos',
});

async function auditarUsuarios() {
  const conn = await connection.getConnection();
  try {
    console.log('\n🧑‍💼 AUDITORIA DE USUÁRIOS\n');
    console.log('═'.repeat(100));

    // Listar todos os usuários com admin
    const [usuarios] = await conn.execute(`
      SELECT 
        u.id,
        u.nome,
        u.email,
        u.telefone,
        u.endereco,
        u.obra,
        a.nome AS admin_nome,
        u.created_at
      FROM usuarios u
      LEFT JOIN admins a ON a.id = u.admin_id
      ORDER BY u.id
    `);

    console.log(`\n📊 Total de usuários: ${usuarios.length}\n`);

    usuarios.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.nome}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Telefone: ${user.telefone || '❌ Não informado'}`);
      console.log(`   Endereço: ${user.endereco || '❌ Não informado'}`);
      console.log(`   Obra: ${user.obra || '❌ Não informado'}`);
      console.log(`   Admin: ${user.admin_nome}`);
      console.log(`   Data: ${user.created_at}`);
      console.log('   ─'.repeat(50));
    });

    // Verificar checklists associados
    console.log('\n✓ VALIDAÇÃO DE CHECKLISTS:\n');
    for (const user of usuarios) {
      const [checklist] = await conn.execute(
        'SELECT * FROM checklist_usuarios WHERE usuario_id = ?',
        [user.id]
      );
      if (checklist.length > 0) {
        const cl = checklist[0];
        console.log(`✅ ${user.nome} (ID: ${user.id})`);
        console.log(`   - Uso Solo: ${cl.uso_solo}`);
        console.log(`   - Licença: ${cl.licenca}`);
        console.log(`   - Condomínio: ${cl.condominio}`);
        console.log(`   - Habite-se: ${cl.habite_se}`);
        console.log(`   - Averbação: ${cl.averbacao}`);
        console.log(`   - Vistoria: ${cl.vistoria}`);
      } else {
        console.log(`⚠️  ${user.nome} (ID: ${user.id}) - SEM CHECKLIST`);
      }
    }

    // Validações de campos
    console.log('\n\n✓ VALIDAÇÕES DE CAMPOS:\n');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\d{10,11}$/;

    let emailInvalidos = 0;
    let telefoneInvalidos = 0;
    let camposVazios = 0;

    usuarios.forEach(user => {
      if (!emailRegex.test(user.email)) {
        console.log(`❌ Email inválido: ${user.nome} (${user.email})`);
        emailInvalidos++;
      }
      if (user.telefone && !telefoneRegex.test(user.telefone.replace(/\D/g, ''))) {
        console.log(`❌ Telefone inválido: ${user.nome} (${user.telefone})`);
        telefoneInvalidos++;
      }
      if (!user.nome || !user.email) {
        console.log(`❌ Campos vazios: ${user.nome || 'SEM NOME'}`);
        camposVazios++;
      }
    });

    if (emailInvalidos === 0 && telefoneInvalidos === 0 && camposVazios === 0) {
      console.log('✅ Todos os campos válidos!');
    }

    console.log('\n' + '═'.repeat(100));
    console.log('\n✅ RESUMO:');
    console.log(`   ✓ Total de usuários: ${usuarios.length}`);
    console.log(`   ✓ Emails inválidos: ${emailInvalidos}`);
    console.log(`   ✓ Telefones inválidos: ${telefoneInvalidos}`);
    console.log(`   ✓ Campos vazios: ${camposVazios}`);

  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

auditarUsuarios();
