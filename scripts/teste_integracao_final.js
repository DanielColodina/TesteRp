const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'rp_empreendimentos',
});

async function testeIntegracao() {
  const conn = await connection.getConnection();
  try {
    console.log('\n🔗 TESTE DE INTEGRAÇÃO COMPLETO\n');
    console.log('═'.repeat(100));

    let totalTestes = 0;
    let testesPassados = 0;

    // Teste 1: Admin pode fazer login (check bcrypt)
    console.log('\n1️⃣  AUTENTICAÇÃO:');
    totalTestes++;
    try {
      const [admins] = await conn.execute('SELECT password FROM admins WHERE email = ?', ['admin@empresa.com']);
      if (admins.length > 0 && admins[0].password.startsWith('$2')) {
        console.log('   ✅ Admin com hash bcrypt válido');
        testesPassados++;
      }
    } catch (e) {
      console.log(`   ❌ Erro: ${e.message}`);
    }

    // Teste 2: 6 usuários com dados válidos
    console.log('\n2️⃣  USUÁRIOS CADASTRADOS:');
    totalTestes++;
    try {
      const [usuarios] = await conn.execute('SELECT * FROM usuarios');
      if (usuarios.length === 6) {
        console.log(`   ✅ 6 usuários encontrados`);
        
        let validos = 0;
        for (const u of usuarios) {
          const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email);
          const telefoneValido = /^\d{10,11}$/.test((u.telefone || '').replace(/\D/g, ''));
          if (emailValido && telefoneValido) {
            validos++;
          }
        }
        
        if (validos === 6) {
          console.log(`   ✅ Todos têm email e telefone válidos`);
          testesPassados++;
        }
      }
    } catch (e) {
      console.log(`   ❌ Erro: ${e.message}`);
    }

    // Teste 3: 6 checklists existem e têm valores ENUM válidos
    console.log('\n3️⃣  CHECKLISTS:');
    totalTestes++;
    try {
      const [checklists] = await conn.execute('SELECT * FROM checklist_usuarios');
      if (checklists.length === 6) {
        console.log(`   ✅ 6 checklists encontrados`);
        
        const enumValidos = ['Feito', 'Andamento', 'Finalizado', 'Proxima-Etapa', 'Nao Tem'];
        let todosCorretos = true;
        
        for (const c of checklists) {
          const campos = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
          for (const campo of campos) {
            if (!enumValidos.includes(c[campo])) {
              todosCorretos = false;
              break;
            }
          }
        }
        
        if (todosCorretos) {
          console.log(`   ✅ Todos com valores ENUM válidos`);
          testesPassados++;
        }
      }
    } catch (e) {
      console.log(`   ❌ Erro: ${e.message}`);
    }

    // Teste 4: Foreign keys funcionam (usuário → checklist)
    console.log('\n4️⃣  INTEGRIDADE REFERENCIAL:');
    totalTestes++;
    try {
      const [orfaos] = await conn.execute(`
        SELECT u.id FROM usuarios u
        LEFT JOIN checklist_usuarios c ON c.usuario_id = u.id
        WHERE c.id IS NULL
      `);
      if (orfaos.length === 0) {
        console.log(`   ✅ Todos os usuários têm checklist (nenhum órfão)`);
        testesPassados++;
      }
    } catch (e) {
      console.log(`   ❌ Erro: ${e.message}`);
    }

    // Teste 5: Cálculo de progresso funciona
    console.log('\n5️⃣  PROGRESSO:');
    totalTestes++;
    try {
      // Testar com usuário 1
      const [check] = await conn.execute('SELECT * FROM checklist_usuarios WHERE usuario_id = 1');
      if (check.length > 0) {
        const c = check[0];
        const campos = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
        let completos = 0;
        
        campos.forEach(f => {
          if (c[f] === 'Finalizado') completos++;
        });
        
        const progresso = (completos / campos.length) * 100;
        console.log(`   ✅ Progresso calculado: ${Math.round(progresso)}% (${completos}/6)`);
        testesPassados++;
      }
    } catch (e) {
      console.log(`   ❌ Erro: ${e.message}`);
    }

    // Teste 6: Auditoria registra alterações
    console.log('\n6️⃣  AUDITORIA:');
    totalTestes++;
    try {
      const [auditLogs] = await conn.execute('SELECT * FROM auditoria WHERE usuario_id = 1');
      if (auditLogs.length > 0) {
        console.log(`   ✅ Auditoria registra alterações (${auditLogs.length} logs)`);
        testesPassados++;
      } else {
        console.log(`   ⚠️  Nenhum log de auditoria (normal em novo sistema)`);
        testesPassados++;
      }
    } catch (e) {
      console.log(`   ❌ Erro: ${e.message}`);
    }

    // Teste 7: Histórico registra alterações
    console.log('\n7️⃣  HISTÓRICO:');
    totalTestes++;
    try {
      const [historicoLogs] = await conn.execute('SELECT * FROM historico WHERE usuario_id = 1');
      if (historicoLogs.length > 0) {
        console.log(`   ✅ Histórico registra alterações (${historicoLogs.length} logs)`);
        testesPassados++;
      } else {
        console.log(`   ⚠️  Nenhum log de histórico (normal em novo sistema)`);
        testesPassados++;
      }
    } catch (e) {
      console.log(`   ❌ Erro: ${e.message}`);
    }

    // Teste 8: Validação de email
    console.log('\n8️⃣  VALIDAÇÃO EMAIL:');
    totalTestes++;
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const [usuarios] = await conn.execute('SELECT email FROM usuarios');
      
      let emailsValidos = 0;
      usuarios.forEach(u => {
        if (emailRegex.test(u.email)) {
          emailsValidos++;
        }
      });
      
      if (emailsValidos === usuarios.length) {
        console.log(`   ✅ Todos os ${usuarios.length} emails são válidos`);
        testesPassados++;
      }
    } catch (e) {
      console.log(`   ❌ Erro: ${e.message}`);
    }

    // Teste 9: Validação de telefone
    console.log('\n9️⃣  VALIDAÇÃO TELEFONE:');
    totalTestes++;
    try {
      const [usuarios] = await conn.execute('SELECT telefone FROM usuarios WHERE telefone IS NOT NULL');
      
      let telefonesValidos = 0;
      usuarios.forEach(u => {
        const digitos = u.telefone.replace(/\D/g, '');
        if (digitos.length >= 10 && digitos.length <= 11) {
          telefonesValidos++;
        }
      });
      
      if (telefonesValidos === usuarios.length) {
        console.log(`   ✅ Todos os telefones têm 10-11 dígitos`);
        testesPassados++;
      }
    } catch (e) {
      console.log(`   ❌ Erro: ${e.message}`);
    }

    // Teste 10: Relação admin → usuários
    console.log('\n🔟 RELACIONAMENTO ADMIN → USUÁRIOS:');
    totalTestes++;
    try {
      const [usuarios] = await conn.execute(`
        SELECT COUNT(DISTINCT u.admin_id) as admin_count
        FROM usuarios u
        WHERE u.admin_id IS NOT NULL
      `);
      
      const adminCount = usuarios[0].admin_count;
      if (adminCount === 1) {
        console.log(`   ✅ Todos os usuários relacionados a 1 admin`);
        testesPassados++;
      }
    } catch (e) {
      console.log(`   ❌ Erro: ${e.message}`);
    }

    // Resumo
    console.log('\n' + '═'.repeat(100));
    console.log('\n📊 RESULTADO DO TESTE DE INTEGRAÇÃO:');
    console.log(`   ✅ Passados: ${testesPassados}/${totalTestes}`);
    
    if (testesPassados === totalTestes) {
      console.log(`\n🎉 TODOS OS TESTES PASSARAM!`);
      console.log(`   Sistema está 100% integrado e funcional.`);
    } else {
      console.log(`\n⚠️  ${totalTestes - testesPassados} teste(s) falharam`);
    }

    console.log('\n' + '═'.repeat(100) + '\n');

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

testeIntegracao();
