// Carregar variáveis de ambiente PRIMEIRO
require('dotenv').config();

const db = require('./src/database/connection');
const bcrypt = require('bcrypt');

(async () => {
  try {
    // Verificar se existe admin com esse email
    const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', ['test@example.com']);
    
    if (rows.length > 0) {
      console.log('✅ Admin encontrado:', rows[0]);
    } else {
      console.log('❌ Admin NÃO encontrado. Criando novo...');
      
      // Criar novo admin
      const senha = 'teste123';
      const hash = await bcrypt.hash(senha, 10);
      
      await db.execute(
        'INSERT INTO admins (email, password, nome, created_at) VALUES (?, ?, ?, NOW())',
        ['test@example.com', hash, 'Admin Teste']
      );
      
      console.log('✅ Admin criado com sucesso!');
      console.log('Email: test@example.com');
      console.log('Senha: teste123');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
})();
