-- Adicionar campo observacoes_tecnicas à tabela materiais_obra
ALTER TABLE materiais_obra ADD COLUMN observacoes_tecnicas TEXT AFTER subcategoria;

-- Verificar alteração
DESCRIBE materiais_obra;