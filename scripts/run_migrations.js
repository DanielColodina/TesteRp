/**
 * Script para executar migrações SQL no banco de dados
 * Cria as tabelas checklist_usuarios, historico e auditoria se não existirem
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

const migrations = [
  // Tabela de checklist_usuarios
  `CREATE TABLE IF NOT EXISTS checklist_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    uso_solo ENUM('pendente','em andamento','completo') DEFAULT 'pendente',
    licenca ENUM('pendente','em andamento','completo') DEFAULT 'pendente',
    vistoria ENUM('pendente','em andamento','completo') DEFAULT 'pendente',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Alterar ENUM das colunas existentes se necessário
  `ALTER TABLE checklist_usuarios MODIFY COLUMN uso_solo ENUM('pendente','em andamento','completo') DEFAULT 'pendente'`,
  `ALTER TABLE checklist_usuarios MODIFY COLUMN licenca ENUM('pendente','em andamento','completo') DEFAULT 'pendente'`,
  `ALTER TABLE checklist_usuarios MODIFY COLUMN vistoria ENUM('pendente','em andamento','completo') DEFAULT 'pendente'`,

  // Tabela de histórico
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

  // Tabela de auditoria
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

  // Adicionar colunas faltantes em usuarios
  `ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,

  // Adicionar colunas faltantes em admins
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
];

async function runMigrations() {
  const conn = await connection.getConnection();
  try {
    console.log('🔄 Iniciando migrações do banco de dados...\n');

    for (const migration of migrations) {
      try {
        const result = await conn.execute(migration);
        console.log(`✅ Executada: ${migration.substring(0, 50)}...`);
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

    console.log('\n✅ Migrações concluídas!');

    // Verificar tabelas criadas
    console.log('\n📋 Tabelas na base de dados:');
    const tables = await conn.execute(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
      ORDER BY TABLE_NAME
    `);
    tables[0].forEach(row => {
      console.log(`  • ${row.TABLE_NAME}`);
    });

  } catch (err) {
    console.error('❌ Erro durante migrações:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

runMigrations();
