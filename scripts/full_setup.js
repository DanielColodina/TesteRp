/**
 * Script para setup completo do banco de dados
 * 1. Inicia MySQL 80 (requer privilégios admin)
 * 2. Cria todas as tabelas
 * 3. Insere dados iniciais
 * 4. Valida a conexão
 */

const { execSync } = require('child_process');
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

const migrations = [
  // Criar tabela usuarios
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    obra VARCHAR(150),
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_obra (obra)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Criar tabela admins
  `CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Criar tabela checklist_usuarios
  `CREATE TABLE IF NOT EXISTS checklist_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    uso_solo ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
    licenca ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
    condominio ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
    habite_se ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
    averbacao ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
    vistoria ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Criar tabela historico
  `CREATE TABLE IF NOT EXISTS historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT,
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario_id),
    INDEX idx_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Criar tabela auditoria
  `CREATE TABLE IF NOT EXISTS auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    usuario_id INT NOT NULL,
    acao VARCHAR(100) NOT NULL,
    campo VARCHAR(50),
    valor_anterior TEXT,
    valor_novo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin (admin_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_acao (acao),
    INDEX idx_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Criar tabela obras
  `CREATE TABLE IF NOT EXISTS obras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome_obra VARCHAR(150),
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Criar tabela etapas_obra
  `CREATE TABLE IF NOT EXISTS etapas_obra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    obra_id INT NOT NULL,
    etapa_nome VARCHAR(100),
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'Pendente',
    data_inicio DATE,
    data_termino DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_obra (obra_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Adicionar colunas faltantes
  `ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
];

async function setup() {
  console.log('🔄 Iniciando setup completo do banco de dados...\n');

  try {
    // Tentar conectar
    console.log('📡 Testando conexão com MySQL...');
    const conn = await connection.getConnection();
    console.log('✅ Conectado ao MySQL!\n');

    // Executar migrações
    console.log('📝 Executando migrações...');
    for (const migration of migrations) {
      try {
        await conn.execute(migration);
        console.log(`✅ ${migration.substring(0, 50)}...`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`⚠️  Campo já existe: ${migration.substring(0, 50)}...`);
        } else if (err.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`⚠️  Tabela já existe: ${migration.substring(0, 50)}...`);
        } else {
          console.error(`❌ Erro: ${err.message}`);
        }
      }
    }

    // Inserir admin padrão
    console.log('\n🔐 Criando admin padrão...');
    try {
      const bcrypt = require('bcrypt');
      const senhaHash = await bcrypt.hash('123456', 10);

      await conn.execute(
        'INSERT IGNORE INTO admins (nome, email, password) VALUES (?, ?, ?)',
        ['Admin Padrão', 'admin@empresa.com', senhaHash]
      );
      console.log('✅ Admin criado/validado');
      console.log('   Email: admin@empresa.com');
      console.log('   Senha: 123456\n');
    } catch (err) {
      console.log('⚠️  Admin já existe\n');
    }

    // Listar tabelas criadas
    console.log('📊 Tabelas criadas:');
    const [tables] = await conn.execute(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME
    `);
    tables.forEach(t => console.log(`  ✅ ${t.TABLE_NAME}`));

    console.log('\n✅ Setup concluído com sucesso!');
    console.log('\n🚀 Próximas etapas:');
    console.log('  1. npm start (iniciar o servidor)');
    console.log('  2. Acessar http://localhost:3000');
    console.log('  3. Fazer login com admin@empresa.com / 123456');

    conn.release();
    await connection.end();

  } catch (err) {
    console.error('\n❌ ERRO:', err.message);
    console.error('\n💡 SOLUÇÃO:');
    console.error('  1. Abra MySQL Workbench');
    console.error('  2. Crie um banco chamado "rp_empreendimentos"');
    console.error('  3. Execute o arquivo: scripts/setup_complete.sql');
    console.error('  4. Ou execute via terminal (com mysql instalado):');
    console.error('     mysql -u root -h localhost < scripts/setup_complete.sql');
    process.exit(1);
  }
}

setup();
