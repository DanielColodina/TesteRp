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

-- 1. Tabela ADMINS - Drop em ordem reversa das dependências
DROP TABLE IF EXISTS auditoria;
DROP TABLE IF EXISTS historico;
DROP TABLE IF EXISTS checklist_usuarios;
DROP TABLE IF EXISTS estoque_movimentacoes;
DROP TABLE IF EXISTS materiais_obra;
DROP TABLE IF EXISTS materiais;
DROP TABLE IF EXISTS etapas_obra;
DROP TABLE IF EXISTS obras;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS admins;

-- Tabelas do controle financeiro
DROP TABLE IF EXISTS pagamento;
DROP TABLE IF EXISTS lancamento_custo;
DROP TABLE IF EXISTS centro_custo;
DROP TABLE IF EXISTS obra_financeiro;
DROP TABLE IF EXISTS usuario_financeiro;

-- Tabelas do CONTROLEGERAL
DROP TABLE IF EXISTS mensagens;
DROP TABLE IF EXISTS financeiro;
DROP TABLE IF EXISTS funcionarios;
DROP TABLE IF EXISTS materiais_construtora;
DROP TABLE IF EXISTS obras_construtora;

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

-- 8. Tabela MATERIAIS (Estoque)
CREATE TABLE materiais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  unidade VARCHAR(20) DEFAULT 'un',
  categoria VARCHAR(100),
  preco_unitario DECIMAL(10,2) DEFAULT 0,
  estoque_minimo DECIMAL(10,2) DEFAULT 0,
  fornecedor_padrao VARCHAR(150),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nome (nome),
  INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabela MATERIAIS_OBRA
CREATE TABLE materiais_obra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  obra_id INT NOT NULL,
  material_id INT NOT NULL,
  quantidade_estimada DECIMAL(10,2) DEFAULT 0,
  quantidade_inicial DECIMAL(10,2) DEFAULT 0,
  saldo_atual DECIMAL(10,2) DEFAULT 0,
  fase_obra VARCHAR(100),
  categoria VARCHAR(100),
  subcategoria VARCHAR(100),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_obra (obra_id),
  INDEX idx_material (material_id),
  FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tabela ESTOQUE_MOVIMENTACOES
CREATE TABLE estoque_movimentacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material_id INT NOT NULL,
  tipo ENUM('entrada','saida') NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL,
  obra_id INT,
  motivo VARCHAR(255),
  documento VARCHAR(100),
  valor_unitario DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_material (material_id),
  INDEX idx_tipo (tipo),
  INDEX idx_obra (obra_id),
  INDEX idx_admin (admin_id),
  FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE,
  FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Tabela USUARIO_FINANCEIRO (Controle Financeiro)
CREATE TABLE usuario_financeiro (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Tabela OBRA_FINANCEIRO (Controle Financeiro)
CREATE TABLE obra_financeiro (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome_cliente VARCHAR(150),
  endereco VARCHAR(255),
  nome_obra VARCHAR(150),
  valor_total DECIMAL(15,2),
  data_inicio DATE,
  data_finalizacao DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Tabela CENTRO_CUSTO (Controle Financeiro)
CREATE TABLE centro_custo (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  obra_id BIGINT,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_obra (obra_id),
  FOREIGN KEY (obra_id) REFERENCES obra_financeiro(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Tabela LANCAMENTO_CUSTO (Controle Financeiro)
CREATE TABLE lancamento_custo (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  centro_custo_id BIGINT NOT NULL,
  descricao TEXT,
  valor DECIMAL(15,2) NOT NULL,
  data DATE NOT NULL,
  tipo VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_centro_custo (centro_custo_id),
  FOREIGN KEY (centro_custo_id) REFERENCES centro_custo(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Tabela PAGAMENTO (Controle Financeiro)
CREATE TABLE pagamento (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  lancamento_custo_id BIGINT NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  data_pagamento DATE NOT NULL,
  metodo_pagamento VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lancamento (lancamento_custo_id),
  FOREIGN KEY (lancamento_custo_id) REFERENCES lancamento_custo(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Tabela OBRAS_CONSTRUTORA (CONTROLEGERAL)
CREATE TABLE obras_construtora (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nome TEXT,
  endereco TEXT,
  cliente TEXT,
  orcamento REAL,
  data_inicio TEXT,
  data_fim TEXT,
  status TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Tabela MATERIAIS_CONSTRUTORA (CONTROLEGERAL)
CREATE TABLE materiais_construtora (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  codigo TEXT,
  descricao TEXT,
  unidade TEXT,
  quantidade REAL,
  preco_medio REAL,
  estoque_minimo REAL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Tabela FUNCIONARIOS (CONTROLEGERAL)
CREATE TABLE funcionarios (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nome TEXT,
  funcao TEXT,
  salario REAL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Tabela FINANCEIRO (CONTROLEGERAL)
CREATE TABLE financeiro (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  tipo TEXT,
  descricao TEXT,
  valor REAL,
  data TEXT,
  obra_id INTEGER
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Tabela MENSAGENS (CONTROLEGERAL)
CREATE TABLE mensagens (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  de TEXT,
  para TEXT,
  mensagem TEXT,
  data TEXT,
  obra_id INTEGER
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Tabela RELATORIOS (CONTROLEGERAL)
CREATE TABLE relatorios (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  titulo TEXT,
  descricao TEXT,
  tipo TEXT,
  data TEXT,
  obra_id INTEGER
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
        await conn.query(stmt);
      }
    }

    // Executar inserts
    const insertStatements = insertSQL.split(';').filter(s => s.trim());
    for (const stmt of insertStatements) {
      if (stmt.trim()) {
        await conn.query(stmt);
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
