/**
 * Script para criar o banco de dados automaticamente
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Conectar SEM especificar banco
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

const setupSQL = `
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS rp_empreendimentos;
USE rp_empreendimentos;

-- 1. Tabela ADMINS
DROP TABLE IF EXISTS auditoria;
DROP TABLE IF EXISTS historico;
DROP TABLE IF EXISTS checklist_usuarios;
DROP TABLE IF EXISTS etapas_obra;
DROP TABLE IF EXISTS obras;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS admins;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela USUARIOS
CREATE TABLE usuarios (
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
  INDEX idx_obra (obra),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela CHECKLIST_USUARIOS
CREATE TABLE checklist_usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  uso_solo ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  licenca ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  condominio ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  habite_se ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  averbacao ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  vistoria ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabela HISTORICO
CREATE TABLE historico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  descricao TEXT,
  admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  INDEX idx_created (created_at),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabela AUDITORIA
CREATE TABLE auditoria (
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
  INDEX idx_created (created_at),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabela OBRAS
CREATE TABLE obras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nome_obra VARCHAR(150),
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabela ETAPAS_OBRA
CREATE TABLE etapas_obra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  obra_id INT NOT NULL,
  etapa_nome VARCHAR(100),
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'Pendente',
  data_inicio DATE,
  data_termino DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_obra (obra_id),
  FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const insertSQL = `
USE rp_empreendimentos;

-- Inserir admin
INSERT INTO admins (nome, email, password) VALUES 
('Admin Padrão', 'admin@empresa.com', '$2a$10$aP4ruFadminsHIzLCaPI4SLYQhbegiPDsXrxOvVc3YSq3czaL1KwK');

-- Inserir usuarios
INSERT INTO usuarios (nome, email, telefone, endereco, obra, admin_id) VALUES 
('Daniel', 'admin@empresa.com', '11999999999', 'Rua A, 100', 'Obra A', 1),
('Daniel', 'teste@teste.com', '11888888888', 'Rua B, 200', 'Obra B', 1),
('Arroz', 'silvasktnj@gmail.com', '11777777777', 'Rua C, 300', 'Obra C', 1),
('Daniel', 'danielassuncao1129@gmail.com', '11666666666', 'Rua D, 400', 'Obra D', 1),
('MARIA ANTONIA SANTOS OLIVEIRA', 'teste2@teste.com', '11555555555', 'Rua E, 500', 'Obra E', 1);

-- Inserir checklist
INSERT INTO checklist_usuarios (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria) VALUES
(1, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem'),
(2, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem'),
(3, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem'),
(4, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem'),
(5, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem');
`;

async function setup() {
  const conn = await pool.getConnection();
  try {
    console.log('🔄 Criando banco de dados e tabelas...\n');

    // Executar setup
    const statements = setupSQL.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        await conn.execute(stmt);
      }
    }

    // Executar inserts
    const insertStatements = insertSQL.split(';').filter(s => s.trim());
    for (const stmt of insertStatements) {
      if (stmt.trim()) {
        await conn.execute(stmt);
      }
    }

    console.log('✅ Banco de dados criado e populado com sucesso!\n');

    // Verificar
    const [admins] = await conn.execute('SELECT COUNT(*) as count FROM admins');
    const [usuarios] = await conn.execute('SELECT COUNT(*) as count FROM usuarios');
    const [checklist] = await conn.execute('SELECT COUNT(*) as count FROM checklist_usuarios');

    console.log('📊 Dados criados:');
    console.log(`  ✅ Admins: ${admins[0].count}`);
    console.log(`  ✅ Usuários: ${usuarios[0].count}`);
    console.log(`  ✅ Checklists: ${checklist[0].count}`);

    console.log('\n🚀 Próximo: npm start');

  } catch (err) {
    console.error('❌ ERRO:', err.message);
  } finally {
    conn.release();
    await pool.end();
  }
}

setup();
