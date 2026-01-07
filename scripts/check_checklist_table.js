const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkChecklistTable() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('Verificando estrutura da tabela checklist_usuarios...\n');

    // Verificar se a tabela existe
    const [tables] = await conn.execute("SHOW TABLES LIKE 'checklist_usuarios'");
    if (tables.length === 0) {
      console.log('❌ Tabela checklist_usuarios não existe!');
      return;
    }

    // Descrever a estrutura da tabela
    const [rows] = await conn.execute('DESCRIBE checklist_usuarios');
    console.log('Estrutura da tabela checklist_usuarios:');
    rows.forEach(row => {
      console.log(`- ${row.Field}: ${row.Type} (Nullable: ${row.Null})`);
    });

    // Verificar dados existentes
    const [data] = await conn.execute('SELECT COUNT(*) as total FROM checklist_usuarios');
    console.log(`\nTotal de registros na tabela: ${data[0].total}`);

    if (data[0].total > 0) {
      const [sample] = await conn.execute('SELECT * FROM checklist_usuarios LIMIT 3');
      console.log('\nAmostra de dados:');
      sample.forEach((row, index) => {
        console.log(`Registro ${index + 1}:`, row);
      });
    }

    conn.end();
  } catch (error) {
    console.error('Erro ao verificar tabela:', error.message);
  }
}

checkChecklistTable();