-- ========================================
-- SCRIPT COMPLETO DE SETUP - RP EMPREENDIMENTOS
-- Execute no MySQL Workbench
-- ========================================

-- 1. Criar banco de dados
CREATE DATABASE IF NOT EXISTS rp_empreendimentos;
USE rp_empreendimentos;

-- 2. Tabela ADMINS
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

-- 3. Tabela USUARIOS
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

-- 4. Tabela CHECKLIST_USUARIOS (6 campos de checklist)
CREATE TABLE checklist_usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  uso_solo ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  licenca ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  condominio ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  habite_se ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  averbacao ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  vistoria ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabela HISTORICO
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

-- 6. Tabela AUDITORIA
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

-- 7. Tabela OBRAS
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

-- 8. Tabela ETAPAS_OBRA
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

-- 9. Inserir ADMIN padrão (senha hash para "123456")
INSERT INTO admins (nome, email, password) VALUES 
('Admin Padrão', 'admin@empresa.com', '$2a$10$aP4ruFadminsHIzLCaPI4SLYQhbegiPDsXrxOvVc3YSq3czaL1KwK');

-- 10. Inserir USUARIOS de teste
INSERT INTO usuarios (nome, email, telefone, endereco, obra, admin_id) VALUES 
('Daniel', 'admin@empresa.com', '11999999999', 'Rua A, 100', 'Obra A', 1),
('Daniel', 'teste@teste.com', '11888888888', 'Rua B, 200', 'Obra B', 1),
('Arroz', 'silvasktnj@gmail.com', '11777777777', 'Rua C, 300', 'Obra C', 1),
('Daniel', 'danielassuncao1129@gmail.com', '11666666666', 'Rua D, 400', 'Obra D', 1),
('MARIA ANTONIA SANTOS OLIVEIRA', 'teste2@teste.com', '11555555555', 'Rua E, 500', 'Obra E', 1);

-- 11. Inserir CHECKLIST para os usuários (valores padrão)
INSERT INTO checklist_usuarios (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria) VALUES
(1, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem'),
(2, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem'),
(3, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem'),
(4, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem'),
(5, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem');

-- 12. Verificar resultado
SELECT '✅ BANCO CRIADO COM SUCESSO!' as Status;
SELECT COUNT(*) as total_admins FROM admins;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_checklist FROM checklist_usuarios;
