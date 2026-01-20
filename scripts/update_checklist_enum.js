/**
 * Script para atualizar a estrutura da tabela checklist_usuarios
 * Converte os valores ENUM antigos para os novos
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

async function updateChecklistEnum() {
  const conn = await connection.getConnection();
  try {
    console.log('🔄 Atualizando estrutura da tabela checklist_usuarios...\n');

    // Primeiro, ver quais valores existem
    console.log('📊 Verificando valores existentes...');
    const [existingValues] = await conn.execute(`
      SELECT DISTINCT uso_solo, licenca, vistoria FROM checklist_usuarios
    `);
    console.log('Valores encontrados:', existingValues);

    // Limpar valores inválidos primeiro
    console.log('🧹 Limpando valores inválidos...');
    await conn.execute(`UPDATE checklist_usuarios SET uso_solo = 'pendente' WHERE uso_solo NOT IN ('pendente','em andamento','completo') OR uso_solo IS NULL`);
    await conn.execute(`UPDATE checklist_usuarios SET licenca = 'pendente' WHERE licenca NOT IN ('pendente','em andamento','completo') OR licenca IS NULL`);
    await conn.execute(`UPDATE checklist_usuarios SET vistoria = 'pendente' WHERE vistoria NOT IN ('pendente','em andamento','completo') OR vistoria IS NULL`);

    // Mapear valores antigos para novos
    const conversions = [
      { old: 'Nao Tem', new: 'pendente' },
      { old: 'Feito', new: 'completo' },
      { old: 'Andamento', new: 'em andamento' },
      { old: 'Finalizado', new: 'completo' },
      { old: 'Proxima-Etapa', new: 'em andamento' }
    ];

    console.log('📝 Convertendo valores existentes...');
    for (const conversion of conversions) {
      try {
        const [result1] = await conn.execute(
          'UPDATE checklist_usuarios SET uso_solo = ? WHERE uso_solo = ?',
          [conversion.new, conversion.old]
        );
        const [result2] = await conn.execute(
          'UPDATE checklist_usuarios SET licenca = ? WHERE licenca = ?',
          [conversion.new, conversion.old]
        );
        const [result3] = await conn.execute(
          'UPDATE checklist_usuarios SET vistoria = ? WHERE vistoria = ?',
          [conversion.new, conversion.old]
        );
        const total = result1.affectedRows + result2.affectedRows + result3.affectedRows;
        if (total > 0) {
          console.log(`✅ Convertido ${conversion.old} → ${conversion.new} (${total} registros)`);
        }
      } catch (err) {
        console.log(`⚠️  Erro ao converter ${conversion.old}:`, err.message);
      }
    }

    // Agora alterar a estrutura das colunas
    console.log('\n🔧 Alterando estrutura das colunas...');

    await conn.execute(`ALTER TABLE checklist_usuarios MODIFY COLUMN uso_solo ENUM('pendente','em andamento','completo') DEFAULT 'pendente'`);
    await conn.execute(`ALTER TABLE checklist_usuarios MODIFY COLUMN licenca ENUM('pendente','em andamento','completo') DEFAULT 'pendente'`);
    await conn.execute(`ALTER TABLE checklist_usuarios MODIFY COLUMN vistoria ENUM('pendente','em andamento','completo') DEFAULT 'pendente'`);

    console.log('✅ Estrutura atualizada com sucesso!');

    // Verificar se há dados na tabela
    const [rows] = await conn.execute('SELECT COUNT(*) as total FROM checklist_usuarios');
    console.log(`📊 Total de registros na tabela: ${rows[0].total}`);

  } catch (err) {
    console.error('❌ Erro durante atualização:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

updateChecklistEnum();