const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database CONTROLEGERAL
const dbPath = path.join(__dirname, '../CONTROLEGERAL/backend/construtora.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco CONTROLEGERAL:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Conectado ao banco CONTROLEGERAL');
  }
});

// Adicionar coluna obra_id à tabela funcionarios
db.run(`ALTER TABLE funcionarios ADD COLUMN obra_id INTEGER`, (err) => {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('✅ Coluna obra_id já existe na tabela funcionarios');
    } else {
      console.error('Erro ao adicionar coluna obra_id:', err.message);
      process.exit(1);
    }
  } else {
    console.log('✅ Coluna obra_id adicionada com sucesso à tabela funcionarios');
  }

  // Fechar conexão
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar conexão:', err.message);
    } else {
      console.log('✅ Conexão fechada');
    }
  });
});