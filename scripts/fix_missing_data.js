const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'rp_empreendimentos',
});

async function fixMissingChecklist() {
  const conn = await connection.getConnection();
  try {
    console.log('\n🔧 CORRIGINDO DADOS INCOMPLETOS\n');
    console.log('═'.repeat(80));

    // 1. Inserir checklist para usuário 6
    console.log('\n1️⃣  Inserindo checklist para usuário 6...');
    const [result] = await conn.execute(
      `INSERT IGNORE INTO checklist_usuarios (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria)
       VALUES (?, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem')`,
      [6]
    );
    
    if (result.affectedRows > 0) {
      console.log('   ✅ Checklist criado para usuário 6');
    } else {
      console.log('   ℹ️  Checklist já existia para usuário 6');
    }

    // 2. Verificar se todos têm checklist agora
    console.log('\n2️⃣  Verificando checklists...');
    const [usuarios] = await conn.execute(`
      SELECT u.id, u.nome, 
             CASE WHEN c.id IS NOT NULL THEN 'Sim' ELSE 'Não' END as tem_checklist
      FROM usuarios u
      LEFT JOIN checklist_usuarios c ON c.usuario_id = u.id
      ORDER BY u.id
    `);

    usuarios.forEach(u => {
      console.log(`   ${u.tem_checklist === 'Sim' ? '✅' : '❌'} ${u.nome} (ID ${u.id})`);
    });

    // 3. Registrar testes de auditoria
    console.log('\n3️⃣  Testando auditoria...');
    await conn.execute(
      `INSERT INTO auditoria (admin_id, usuario_id, acao, campo, valor_anterior, valor_novo, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [1, 1, 'TESTE_AUDITORIA', 'teste_campo', 'valor_antigo', 'valor_novo']
    );
    console.log('   ✅ Registro de auditoria criado');

    // 4. Registrar testes de histórico
    console.log('\n4️⃣  Testando histórico...');
    await conn.execute(
      `INSERT INTO historico (usuario_id, tipo, descricao, admin_id, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [1, 'teste', 'Teste de histórico do sistema', 1]
    );
    console.log('   ✅ Registro de histórico criado');

    // 5. Verificar dados
    console.log('\n5️⃣  Verificando dados após correções...');
    const [auditLogsCount] = await conn.execute('SELECT COUNT(*) as total FROM auditoria');
    const [historicoCount] = await conn.execute('SELECT COUNT(*) as total FROM historico');
    const [checklistCount] = await conn.execute('SELECT COUNT(*) as total FROM checklist_usuarios');

    console.log(`   ✅ Auditoria: ${auditLogsCount[0].total} registros`);
    console.log(`   ✅ Histórico: ${historicoCount[0].total} registros`);
    console.log(`   ✅ Checklists: ${checklistCount[0].total} registros`);

    console.log('\n' + '═'.repeat(80));
    console.log('\n✅ CORREÇÕES CONCLUÍDAS\n');

  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

fixMissingChecklist();
