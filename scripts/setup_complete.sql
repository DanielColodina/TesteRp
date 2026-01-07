-- Script SQL para criar todas as tabelas e dados necessários
-- Execute isto no MySQL Workbench ou via: mysql -u root -h localhost < setup_complete.sql

USE rp_empreendimentos;

-- 1. Criar tabela usuarios se não existir
CREATE TABLE IF NOT EXISTS usuarios (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Criar tabela admins se não existir
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Criar tabela checklist_usuarios
CREATE TABLE IF NOT EXISTS checklist_usuarios (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Criar tabela historico
CREATE TABLE IF NOT EXISTS historico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  descricao TEXT,
  admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Criar tabela auditoria
CREATE TABLE IF NOT EXISTS auditoria (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Criar tabela obras se não existir
CREATE TABLE IF NOT EXISTS obras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nome_obra VARCHAR(150),
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Criar tabela etapas_obra se não existir
CREATE TABLE IF NOT EXISTS etapas_obra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  obra_id INT NOT NULL,
  etapa_nome VARCHAR(100),
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'Pendente',
  data_inicio DATE,
  data_termino DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_obra (obra_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Criar tabela materiais para módulo de estoque
CREATE TABLE IF NOT EXISTS materiais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  unidade VARCHAR(20) DEFAULT 'un',
  categoria VARCHAR(50),
  preco_unitario DECIMAL(10,2) DEFAULT 0,
  estoque_atual DECIMAL(10,2) DEFAULT 0,
  estoque_minimo DECIMAL(10,2) DEFAULT 0,
  fornecedor_padrao VARCHAR(150),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nome (nome),
  INDEX idx_categoria (categoria),
  INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Criar tabela estoque_movimentacoes para controlar entradas e saídas
CREATE TABLE IF NOT EXISTS estoque_movimentacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material_id INT NOT NULL,
  tipo ENUM('entrada', 'saida') NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL,
  obra_id INT,
  motivo TEXT,
  documento VARCHAR(100),
  valor_unitario DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  admin_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_material (material_id),
  INDEX idx_tipo (tipo),
  INDEX idx_obra (obra_id),
  INDEX idx_admin (admin_id),
  INDEX idx_created (created_at),
  FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE,
  FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Adicionar coluna observacoes na tabela checklist_usuarios se não existir
ALTER TABLE checklist_usuarios ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- 11. Inserir admin padrão se não existir
INSERT IGNORE INTO admins (nome, email, password) VALUES
('Admin Padrão', 'admin@empresa.com', '$2a$10$aP4ruFadminsHIzLCaPI4SLYQhbegiPDsXrxOvVc3YSq3czaL1KwK');

-- Mensagem de sucesso
SELECT 'Database setup completed successfully!' AS status;
