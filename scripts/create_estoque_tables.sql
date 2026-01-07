-- Tabelas para módulo de Estoque/Almoxarifado

-- Tabela de materiais
CREATE TABLE IF NOT EXISTS materiais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    unidade VARCHAR(50) NOT NULL DEFAULT 'un', -- un, kg, m, m2, m3, etc.
    categoria VARCHAR(100),
    preco_unitario DECIMAL(10,2) DEFAULT 0,
    estoque_minimo INT DEFAULT 0,
    estoque_atual INT DEFAULT 0,
    fornecedor_padrao VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de movimentações de estoque
CREATE TABLE IF NOT EXISTS estoque_movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL,
    quantidade INT NOT NULL,
    obra_id INT, -- NULL para entradas gerais
    motivo VARCHAR(255),
    documento VARCHAR(100), -- NF, pedido, etc.
    valor_unitario DECIMAL(10,2),
    valor_total DECIMAL(10,2),
    admin_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE,
    FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20),
    contato VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    endereco TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_materiais_categoria ON materiais(categoria);
CREATE INDEX idx_materiais_ativo ON materiais(ativo);
CREATE INDEX idx_movimentacoes_material ON estoque_movimentacoes(material_id);
CREATE INDEX idx_movimentacoes_obra ON estoque_movimentacoes(obra_id);
CREATE INDEX idx_movimentacoes_tipo ON estoque_movimentacoes(tipo);
CREATE INDEX idx_movimentacoes_data ON estoque_movimentacoes(created_at);

-- Trigger para atualizar estoque atual
DELIMITER //

CREATE TRIGGER IF NOT EXISTS atualizar_estoque AFTER INSERT ON estoque_movimentacoes
FOR EACH ROW
BEGIN
    IF NEW.tipo = 'entrada' THEN
        UPDATE materiais SET estoque_atual = estoque_atual + NEW.quantidade WHERE id = NEW.material_id;
    ELSE
        UPDATE materiais SET estoque_atual = estoque_atual - NEW.quantidade WHERE id = NEW.material_id;
    END IF;
END //

DELIMITER ;

-- Dados de exemplo
INSERT INTO materiais (nome, descricao, unidade, categoria, preco_unitario, estoque_minimo, estoque_atual) VALUES
('Cimento CP II', 'Cimento Portland tipo II', 'kg', 'Materiais Básicos', 25.00, 1000, 500),
('Areia Média', 'Areia para construção', 'm3', 'Materiais Básicos', 80.00, 50, 30),
('Pedra Britada', 'Pedra britada 0-19mm', 'm3', 'Materiais Básicos', 120.00, 30, 20),
('Bloco Cerâmico 9x19x39', 'Bloco cerâmico 9cm', 'un', 'Blocos e Tijolos', 1.50, 2000, 1500),
('Verde Madeira', 'Tinta látex PVA', 'L', 'Tintas', 45.00, 20, 15),
('Ferro CA-50', 'Barra de ferro 10mm', 'kg', 'Aço', 8.50, 500, 300),
('Tubo PVC 100mm', 'Tubo PVC para esgoto', 'm', 'Tubos', 12.00, 100, 80),
('Fio Elétrico 2.5mm', 'Fio elétrico 750V', 'm', 'Elétrica', 3.50, 200, 150);

INSERT INTO fornecedores (nome, contato, telefone, email) VALUES
('Construmax Materiais', 'João Silva', '(11) 99999-0001', 'joao@construmax.com'),
('Mega Construções', 'Maria Santos', '(11) 99999-0002', 'maria@megaconstrucoes.com'),
('Materiais do Brasil', 'Pedro Oliveira', '(11) 99999-0003', 'pedro@materiaisbr.com');