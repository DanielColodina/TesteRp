const sqlite3 = require('sqlite3');

const dbPath = './construtora.db';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
    process.exit(1);
  }
});

console.log('Conectado ao banco:', dbPath);

// Remove todos os admins, exceto test@example.com
db.run(`DELETE FROM admins WHERE email != 'test@example.com'`, function(err) {
  if (err) {
    console.error('Erro ao remover administradores:', err.message);
  } else {
    console.log(`✓ Removidos ${this.changes} administradores (exceto test@example.com)`);
  }
  
  // Verifica quantos admins sobraram
  db.get(`SELECT COUNT(*) as count FROM admins`, (err, row) => {
    if (err) {
      console.error('Erro ao contar admins:', err.message);
    } else {
      console.log(`Total de administradores restantes: ${row.count}`);
    }
    
    db.close((err) => {
      if (err) {
        console.error('Erro ao fechar banco:', err.message);
      } else {
        console.log('Banco fechado.');
      }
      process.exit(0);
    });
  });
});
