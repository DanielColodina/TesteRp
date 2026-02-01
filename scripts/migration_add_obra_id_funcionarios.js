// Script de migração para adicionar coluna obra_id na tabela funcionarios
const path = require('path');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente da pasta raiz
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const db = require('../src/database/connection');

async function migrate() {
  console.log('🚀 Executando migração: adicionar coluna obra_id em funcionarios...');
  
  try {
    // Verificar se a coluna já existe
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'rp_empreendimentos' 
      AND TABLE_NAME = 'funcionarios' 
      AND COLUMN_NAME = 'obra_id'
    `);
    
    if (columns.length > 0) {
      console.log('✅ Coluna obra_id já existe na tabela funcionarios');
      return;
    }
    
    // Adicionar a coluna
    await db.execute(`
      ALTER TABLE funcionarios 
      ADD COLUMN obra_id INT NULL AFTER salario
    `);
    
    console.log('✅ Coluna obra_id adicionada com sucesso na tabela funcionarios!');
    
  } catch (err) {
    console.error('❌ Erro na migração:', err.message);
    throw err;
  } finally {
    await db.end();
  }
}

// Executar migração
migrate().then(() => {
  console.log('🏁 Migração concluída');
  process.exit(0);
}).catch(err => {
  console.error('💥 Falha na migração:', err);
  process.exit(1);
});
