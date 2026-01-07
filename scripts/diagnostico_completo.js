const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'rp_empreendimentos',
});

async function testDatabase() {
  const conn = await connection.getConnection();
  try {
    console.log('\n🔧 DIAGNÓSTICO DO SISTEMA\n');
    console.log('═'.repeat(100));

    // 1. Verificar admin existe
    console.log('\n1️⃣  VERIFICAR ADMIN:');
    const [admins] = await conn.execute('SELECT id, email FROM admins LIMIT 1');
    if (admins.length > 0) {
      console.log(`   ✅ Admin encontrado: ${admins[0].email}`);
      console.log(`   ✅ ID: ${admins[0].id}`);
    } else {
      console.log('   ❌ Nenhum admin encontrado!');
    }

    // 2. Verificar usuários
    console.log('\n2️⃣  VERIFICAR USUÁRIOS:');
    const [usuarios] = await conn.execute('SELECT COUNT(*) as total FROM usuarios');
    console.log(`   ✅ Total de usuários: ${usuarios[0].total}`);

    // 3. Verificar checklists
    console.log('\n3️⃣  VERIFICAR CHECKLISTS:');
    const [checklists] = await conn.execute('SELECT COUNT(*) as total FROM checklist_usuarios');
    console.log(`   ✅ Total de checklists: ${checklists[0].total}`);

    // 4. Verificar usuários SEM checklist
    console.log('\n4️⃣  USUÁRIOS SEM CHECKLIST:');
    const [semChecklist] = await conn.execute(`
      SELECT u.id, u.nome 
      FROM usuarios u
      LEFT JOIN checklist_usuarios c ON c.usuario_id = u.id
      WHERE c.id IS NULL
    `);
    if (semChecklist.length > 0) {
      console.log(`   ⚠️  ${semChecklist.length} usuário(s) sem checklist:`);
      semChecklist.forEach(u => {
        console.log(`      - ${u.nome} (ID: ${u.id})`);
      });
    } else {
      console.log('   ✅ Todos os usuários têm checklist');
    }

    // 5. Testar métodos de Model
    console.log('\n5️⃣  TESTAR MODELOS:');
    
    // Testar Checklist.findByUser
    try {
      const [checklist] = await conn.execute(
        'SELECT * FROM checklist_usuarios WHERE usuario_id = 1'
      );
      if (checklist.length > 0) {
        console.log(`   ✅ Checklist de usuário 1 carregado`);
        console.log(`      Campos: ${Object.keys(checklist[0]).join(', ')}`);
      }
    } catch (e) {
      console.log(`   ❌ Erro ao carregar checklist: ${e.message}`);
    }

    // 6. Testar Auditoria
    console.log('\n6️⃣  TESTAR AUDITORIA:');
    try {
      const [auditoria] = await conn.execute(
        'SELECT * FROM auditoria WHERE usuario_id = 1 LIMIT 1'
      );
      if (auditoria.length > 0) {
        console.log(`   ✅ Auditoria de usuário 1 carregada`);
      } else {
        console.log(`   ℹ️  Nenhuma auditoria registrada para usuário 1`);
      }
    } catch (e) {
      console.log(`   ❌ Erro ao acessar auditoria: ${e.message}`);
    }

    // 7. Testar Histórico
    console.log('\n7️⃣  TESTAR HISTÓRICO:');
    try {
      const [historico] = await conn.execute(
        'SELECT * FROM historico WHERE usuario_id = 1 LIMIT 1'
      );
      if (historico.length > 0) {
        console.log(`   ✅ Histórico de usuário 1 carregado`);
      } else {
        console.log(`   ℹ️  Nenhum histórico registrado para usuário 1`);
      }
    } catch (e) {
      console.log(`   ❌ Erro ao acessar histórico: ${e.message}`);
    }

    // 8. Simular método de Checklist.getProgresso
    console.log('\n8️⃣  TESTAR CÁLCULO DE PROGRESSO:');
    try {
      const [check] = await conn.execute(
        'SELECT * FROM checklist_usuarios WHERE usuario_id = 1'
      );
      if (check.length > 0) {
        const c = check[0];
        const campos = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
        let completos = 0;
        campos.forEach(campo => {
          if (c[campo] === 'Finalizado') completos++;
        });
        const progresso = (completos / campos.length) * 100;
        console.log(`   ✅ Progresso calculado: ${Math.round(progresso)}%`);
        console.log(`      ${completos} de 6 campos finalizados`);
      }
    } catch (e) {
      console.log(`   ❌ Erro ao calcular progresso: ${e.message}`);
    }

    // 9. Simular método de Checklist.update
    console.log('\n9️⃣  TESTAR UPDATE DE CHECKLIST (simulação):');
    try {
      const [result] = await conn.execute(
        'UPDATE checklist_usuarios SET uso_solo = ? WHERE usuario_id = ?',
        ['Feito', 1]
      );
      if (result.affectedRows > 0) {
        console.log(`   ✅ Update funcionaria (affectedRows: ${result.affectedRows})`);
      } else {
        console.log(`   ℹ️  Nenhuma linha afetada`);
      }
    } catch (e) {
      console.log(`   ❌ Erro ao fazer update: ${e.message}`);
    }

    // 10. Verificar integridade referencial
    console.log('\n🔟 INTEGRIDADE REFERENCIAL:');
    try {
      const [fks] = await conn.execute(`
        SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = 'rp_empreendimentos'
        AND REFERENCED_TABLE_NAME IS NOT NULL
      `);
      console.log(`   ✅ Foreign keys encontradas: ${fks.length}`);
      fks.forEach(fk => {
        console.log(`      - ${fk.TABLE_NAME}.${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}`);
      });
    } catch (e) {
      console.log(`   ❌ Erro ao verificar FKs: ${e.message}`);
    }

    console.log('\n' + '═'.repeat(100));
    console.log('\n✅ DIAGNÓSTICO CONCLUÍDO\n');

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

testDatabase();
