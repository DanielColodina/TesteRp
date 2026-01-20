/**
 * Diagnóstico: verificar estrutura da tabela checklist_usuarios
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rp_empreendimentos',
});

async function diagnose() {
  const conn = await connection.getConnection();
  try {
    console.log('🔍 Diagnóstico: Estrutura da tabela checklist_usuarios\n');

    // Ver colunas
    const [columns] = await conn.execute(
      'DESCRIBE checklist_usuarios'
    );

    console.log('📋 Colunas:');
    columns.forEach(col => {
      console.log(`  • ${col.Field}: ${col.Type} (Null: ${col.Null}, Default: ${col.Default})`);
    });

    // Ver um registro
    console.log('\n📊 Registro do usuário ID 1:');
    const [rows] = await conn.execute(
      'SELECT * FROM checklist_usuarios WHERE usuario_id = 1'
    );

    if (rows.length > 0) {
      const row = rows[0];
      console.log(JSON.stringify(row, null, 2));
    } else {
      console.log('  (Nenhum registro encontrado)');
    }

    // Tentar inserir com valores válidos
    console.log('\n🔄 Testando INSERT com valores válidos...');
    const resultado = await conn.execute(
      'INSERT INTO checklist_usuarios (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria) VALUES (999, "Feito", "Andamento", "Finalizado", "Nao Tem", "Proxima-Etapa", "Feito")'
    );
    console.log(`   ✅ Inserido (insertId: ${resultado[0].insertId})`);

    // Ver o registro inserido
    const [inserted] = await conn.execute(
      'SELECT * FROM checklist_usuarios WHERE usuario_id = 999'
    );
    if (inserted.length > 0) {
      console.log('\n📋 Registro inserido:');
      console.log(JSON.stringify(inserted[0], null, 2));
    }

    // Limpar o teste
    await conn.execute('DELETE FROM checklist_usuarios WHERE usuario_id = 999');
    console.log('\n✅ Registro de teste removido');

  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

diagnose();
