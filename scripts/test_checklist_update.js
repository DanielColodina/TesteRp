/**
 * Script de teste: atualizar checklist de um usuário existente
 * Verifica:
 * 1. Se existe usuário na base
 * 2. Cria/atualiza checklist
 * 3. Registra histórico
 * 4. Registra auditoria
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rp_empreendimentos',
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

async function testChecklistUpdate() {
  const conn = await connection.getConnection();
  try {
    console.log('🧪 Iniciando testes de atualização de checklist...\n');

    // 1. Listar usuários existentes
    console.log('📋 Usuários na base de dados:');
    const [usuarios] = await conn.execute(
      'SELECT id, nome, email FROM usuarios LIMIT 5'
    );

    if (usuarios.length === 0) {
      console.log('❌ Nenhum usuário encontrado na base!');
      console.log('\n💡 Sugestão: crie um usuário antes de testar.');
      return;
    }

    usuarios.forEach(u => {
      console.log(`  • ID: ${u.id}, Nome: ${u.nome}, Email: ${u.email}`);
    });

    // Pegar o primeiro usuário para teste
    const usuarioTeste = usuarios[0];
    const usuarioId = usuarioTeste.id;

    console.log(`\n✨ Testando com usuário ID: ${usuarioId} (${usuarioTeste.nome})\n`);

    // 2. Verificar/criar checklist
    console.log('🔄 1. Criando/atualizando checklist...');
    const checklistData = {
      usuario_id: usuarioId,
      uso_solo: 'Feito',
      licenca: 'Andamento',
      condominio: 'Finalizado',
      habite_se: 'Feito',
      averbacao: 'Proxima-Etapa',
      vistoria: 'Finalizado',
    };

    // INSERT ... ON DUPLICATE KEY UPDATE
    const sqlChecklist = `
      INSERT INTO checklist_usuarios 
      (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      uso_solo = VALUES(uso_solo),
      licenca = VALUES(licenca),
      condominio = VALUES(condominio),
      habite_se = VALUES(habite_se),
      averbacao = VALUES(averbacao),
      vistoria = VALUES(vistoria),
      updated_at = CURRENT_TIMESTAMP
    `;

    const checklistParams = [
      checklistData.usuario_id,
      checklistData.uso_solo,
      checklistData.licenca,
      checklistData.condominio,
      checklistData.habite_se,
      checklistData.averbacao,
      checklistData.vistoria,
    ];

    console.log(`   Debug - Params: ${JSON.stringify(checklistParams)}`);

    const [resultChecklist] = await conn.execute(sqlChecklist, checklistParams);

    console.log(`   ✅ Checklist atualizado (affectedRows: ${resultChecklist.affectedRows})`);

    // 3. Calcular progresso
    console.log('\n🔄 2. Calculando progresso...');
    const [checklistResult] = await conn.execute(
      'SELECT * FROM checklist_usuarios WHERE usuario_id = ?',
      [usuarioId]
    );

    if (checklistResult.length > 0) {
      const checklist = checklistResult[0];
      const campos = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
      const progresso = campos.filter(campo => checklist[campo] === 'Finalizado').length;

      console.log(`   Status dos campos:`);
      campos.forEach(campo => {
        console.log(`     • ${campo}: ${checklist[campo]}`);
      });
      console.log(`   📊 Progresso: ${progresso}/6 etapas finalizadas (${Math.round((progresso/6)*100)}%)`);
    }

    // 4. Registrar histórico
    console.log('\n🔄 3. Registrando histórico...');
    const [resultHistorico] = await conn.execute(
      'INSERT INTO historico (usuario_id, tipo, descricao, admin_id) VALUES (?, ?, ?, ?)',
      [usuarioId, 'CHECKLIST_UPDATE', 'Checklist atualizado via teste', null]
    );
    console.log(`   ✅ Histórico registrado (ID: ${resultHistorico.insertId})`);

    // 5. Registrar auditoria
    console.log('\n🔄 4. Registrando auditoria...');
    const [resultAuditoria] = await conn.execute(
      'INSERT INTO auditoria (usuario_id, acao, campo, valor_novo, admin_id) VALUES (?, ?, ?, ?, ?)',
      [usuarioId, 'CHECKLIST_UPDATE', 'checklist_campos', JSON.stringify(checklistData), null]
    );
    console.log(`   ✅ Auditoria registrada (ID: ${resultAuditoria.insertId})`);

    // 6. Listar histórico
    console.log('\n🔄 5. Último histórico do usuário:');
    const [historico] = await conn.execute(
      'SELECT id, tipo, descricao, created_at FROM historico WHERE usuario_id = ? ORDER BY created_at DESC LIMIT 3',
      [usuarioId]
    );
    historico.forEach(h => {
      console.log(`   • ${h.tipo} - ${h.descricao} (${h.created_at})`);
    });

    // 7. Listar auditoria
    console.log('\n🔄 6. Última auditoria do usuário:');
    const [auditoria] = await conn.execute(
      'SELECT id, acao, campo, created_at FROM auditoria WHERE usuario_id = ? ORDER BY created_at DESC LIMIT 3',
      [usuarioId]
    );
    auditoria.forEach(a => {
      console.log(`   • ${a.acao} (${a.campo}) - ${a.created_at}`);
    });

    console.log('\n✅ TESTES CONCLUÍDOS COM SUCESSO!');

  } catch (err) {
    console.error('❌ Erro durante teste:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

testChecklistUpdate();
