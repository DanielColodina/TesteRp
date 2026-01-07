-- Script para criar as tabelas ausentes no banco de dados
-- Execute este script no seu MySQL se as tabelas não existirem

-- Tabela de checklist de usuários (3 etapas da obra conforme documentação)
CREATE TABLE IF NOT EXISTS checklist_usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  uso_solo ENUM('pendente','em andamento','completo') DEFAULT 'pendente',
  licenca ENUM('pendente','em andamento','completo') DEFAULT 'pendente',
  vistoria ENUM('pendente','em andamento','completo') DEFAULT 'pendente',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Não criar FK para evitar erros se tabela `usuarios` estiver em outro schema
  INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de histórico de atividades dos usuários
CREATE TABLE IF NOT EXISTS historico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  descricao TEXT,
  admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  INDEX idx_created (created_at),
  -- FKs comentadas para compatibilidade; crie manualmente se necessário
  -- FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  -- FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de auditoria (log de todas as ações dos administradores)
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
  INDEX idx_created (created_at),
  -- FKs comentadas para compatibilidade; crie manualmente se necessário
  -- FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  -- FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adicionar colunas faltantes na tabela usuarios (se não existirem)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Adicionar colunas faltantes na tabela admins (se não existirem)
ALTER TABLE admins ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
