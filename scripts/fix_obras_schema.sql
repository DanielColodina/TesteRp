-- Script para corrigir schema da tabela obras
-- Permitir usuario_id NULL para desvincular obras

USE rp_empreendimentos;

ALTER TABLE obras MODIFY COLUMN usuario_id INT NULL;

SELECT '✅ Schema da tabela obras corrigido - usuario_id agora permite NULL' as Status;