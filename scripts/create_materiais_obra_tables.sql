-- Tabelas para controle de materiais por obra
-- Extensão do módulo de estoque para controle específico de obras

-- Tabela de materiais por obra
CREATE TABLE IF NOT EXISTS materiais_obra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    obra_id INT NOT NULL,
    material_id INT NOT NULL,
    quantidade_estimada DECIMAL(10,3) NOT NULL DEFAULT 0,
    quantidade_inicial DECIMAL(10,3) NOT NULL DEFAULT 0,
    saldo_atual DECIMAL(10,3) NOT NULL DEFAULT 0,
    fase_obra VARCHAR(100) NOT NULL,
    categoria VARCHAR(100),
    subcategoria VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE,
    UNIQUE KEY unique_obra_material (obra_id, material_id),
    INDEX idx_obra_fase (obra_id, fase_obra),
    INDEX idx_categoria (categoria),
    INDEX idx_ativo (ativo)
);

-- Tabela de movimentações de materiais na obra
CREATE TABLE IF NOT EXISTS movimentacoes_obra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    obra_id INT NOT NULL,
    material_obra_id INT NOT NULL,
    tipo ENUM('entrada', 'saida', 'perda', 'sobra') NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL,
    etapa_obra VARCHAR(100),
    motivo VARCHAR(255),
    documento VARCHAR(100),
    responsavel_id INT NOT NULL,
    data_movimentacao DATE NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE,
    FOREIGN KEY (material_obra_id) REFERENCES materiais_obra(id) ON DELETE CASCADE,
    FOREIGN KEY (responsavel_id) REFERENCES admins(id) ON DELETE CASCADE,
    INDEX idx_obra_data (obra_id, data_movimentacao),
    INDEX idx_etapa (etapa_obra),
    INDEX idx_tipo (tipo),
    INDEX idx_responsavel (responsavel_id)
);

-- Tabela de controle de etapas da obra
CREATE TABLE IF NOT EXISTS controle_etapas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    obra_id INT NOT NULL,
    etapa_nome VARCHAR(100) NOT NULL,
    status ENUM('pendente', 'em_andamento', 'concluida', 'atrasada') DEFAULT 'pendente',
    data_inicio DATE,
    data_termino DATE,
    data_prevista_inicio DATE,
    data_prevista_termino DATE,
    percentual_concluido DECIMAL(5,2) DEFAULT 0,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE,
    UNIQUE KEY unique_obra_etapa (obra_id, etapa_nome),
    INDEX idx_status (status),
    INDEX idx_datas (data_inicio, data_termino)
);

-- Trigger para atualizar saldo atual dos materiais da obra
DELIMITER //

CREATE TRIGGER IF NOT EXISTS atualizar_saldo_obra AFTER INSERT ON movimentacoes_obra
FOR EACH ROW
BEGIN
    IF NEW.tipo = 'entrada' THEN
        UPDATE materiais_obra SET saldo_atual = saldo_atual + NEW.quantidade WHERE id = NEW.material_obra_id;
    ELSEIF NEW.tipo = 'saida' THEN
        UPDATE materiais_obra SET saldo_atual = saldo_atual - NEW.quantidade WHERE id = NEW.material_obra_id;
    ELSEIF NEW.tipo = 'perda' THEN
        UPDATE materiais_obra SET saldo_atual = saldo_atual - NEW.quantidade WHERE id = NEW.material_obra_id;
    END IF;
END //

DELIMITER ;

-- Dados de exemplo - Etapas padrão para obras residenciais
INSERT IGNORE INTO controle_etapas (obra_id, etapa_nome, data_prevista_inicio, data_prevista_termino) VALUES
(1, 'Terraplenagem e Fundações', '2024-01-01', '2024-01-15'),
(1, 'Alvenaria Estrutural', '2024-01-16', '2024-02-15'),
(1, 'Estrutura', '2024-02-16', '2024-03-15'),
(1, 'Alvenaria de Vedação', '2024-03-16', '2024-03-30'),
(1, 'Cobertura', '2024-03-31', '2024-04-10'),
(1, 'Instalações Elétricas', '2024-04-11', '2024-04-25'),
(1, 'Instalações Hidráulicas', '2024-04-11', '2024-04-25'),
(1, 'Revestimentos e Acabamentos', '2024-04-26', '2024-05-20'),
(1, 'Esquadrias e Serralheria', '2024-05-21', '2024-05-30');

-- Verificar criação das tabelas
SELECT '✅ Tabelas de materiais por obra criadas com sucesso!' as Status;
DESCRIBE materiais_obra;
DESCRIBE movimentacoes_obra;
DESCRIBE controle_etapas;