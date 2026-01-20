/**
 * Query SQL direta para testar ENUM values
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rp_empreendimentos',
});

async function testEnum() {
  const conn = await connection.getConnection();
  try {
    console.log('🧪 Testando ENUM values...\n');

    // Limpar registro anterior de usuário 1
    console.log('🔄 Limpando registro anterior...');
    await conn.execute('DELETE FROM checklist_usuarios WHERE usuario_id = 1');

    // Inserir com valores válidos
    console.log('🔄 Inserindo novo registro...');
    const sql = `
      INSERT INTO checklist_usuarios 
      (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria)
      VALUES (1, 'Feito', 'Andamento', 'Finalizado', 'Feito', 'Proxima-Etapa', 'Finalizado')
    `;

    const [result] = await conn.execute(sql);
    console.log(`✅ Inserido (affectedRows: ${result.affectedRows})\n`);

    // Ler com SELECT direto
    console.log('📋 Lendo registro:');
    const [rows] = await conn.execute(
      'SELECT id, usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria FROM checklist_usuarios WHERE usuario_id = 1'
    );

    if (rows.length > 0) {
      console.log(JSON.stringify(rows[0], null, 2));
    }

    // Calcular progresso
    console.log('\n📊 Progresso:');
    const [progressRows] = await conn.execute(`
      SELECT 
        (CASE WHEN uso_solo = 'Finalizado' THEN 1 ELSE 0 END) +
        (CASE WHEN licenca = 'Finalizado' THEN 1 ELSE 0 END) +
        (CASE WHEN condominio = 'Finalizado' THEN 1 ELSE 0 END) +
        (CASE WHEN habite_se = 'Finalizado' THEN 1 ELSE 0 END) +
        (CASE WHEN averbacao = 'Finalizado' THEN 1 ELSE 0 END) +
        (CASE WHEN vistoria = 'Finalizado' THEN 1 ELSE 0 END) as progresso
      FROM checklist_usuarios 
      WHERE usuario_id = 1
    `);

    if (progressRows.length > 0) {
      console.log(`Etapas finalizadas: ${progressRows[0].progresso}/6`);
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

testEnum();
