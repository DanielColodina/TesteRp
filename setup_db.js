// Carregar variáveis de ambiente PRIMEIRO
require('dotenv').config();

const db = require('./src/database/connection');
const bcrypt = require('bcrypt');

const setupDatabase = async () => {
  try {
    console.log('🔧 Criando tabelas do banco de dados...');

    // Mostrar configuração
    console.log('📊 Conectando em:');
    console.log(`   HOST: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   PORT: ${process.env.DB_PORT || 3306}`);
    console.log(`   USER: ${process.env.DB_USER || 'root'}`);
    console.log(`   DB: ${process.env.DB_NAME || 'rp_empreendimentos'}`);

    // Tabela de admins
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nome VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela admins criada/verificada');

    // Tabela de usuários
    await db.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        cargo VARCHAR(255),
        admin_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Tabela usuarios criada/verificada');

    // Tabela de obras
    await db.execute(`
      CREATE TABLE IF NOT EXISTS obras (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        endereco TEXT,
        cliente VARCHAR(255),
        orcamento DECIMAL(15,2),
        data_inicio DATE,
        data_fim DATE,
        status VARCHAR(50),
        admin_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Tabela obras criada/verificada');

    // Tabela de checklists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS checklists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        obra_id INT NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        progresso INT DEFAULT 0,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabela checklists criada/verificada');

    console.log('✅ Banco de dados configurado com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao configurar banco:', err.message);
    process.exit(1);
  }
};

setupDatabase();
