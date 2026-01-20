require('dotenv').config();

(async () => {
  try {
    const db = require('../src/database/connection');
    
    console.log('\n=== VERIFICANDO TABELA ADMINS ===\n');
    const [admins] = await db.execute('SELECT id, email, LENGTH(password) as senha_tamanho, password FROM admins');
    
    admins.forEach(admin => {
      console.log(`ID: ${admin.id}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Tamanho da senha: ${admin.senha_tamanho} caracteres`);
      console.log(`Primeira parte do hash: ${admin.password.toString().slice(0, 40)}`);
      console.log('---');
    });

    console.log('\n=== VERIFICANDO ESTRUTURA DA TABELA ===\n');
    const [schema] = await db.execute("DESCRIBE admins");
    schema.forEach(col => {
      console.log(`Campo: ${col.Field} | Tipo: ${col.Type} | Null: ${col.Null} | Key: ${col.Key}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('ERRO:', err.message);
    process.exit(1);
  }
})();
