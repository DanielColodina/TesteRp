const db = require('../../../database/connection');

class EstoqueMovimentacao {
    // Registrar entrada de material
    static async registrarEntrada(dados) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Inserir movimentação
            const sqlMov = `
                INSERT INTO estoque_movimentacoes
                (material_id, tipo, quantidade, obra_id, motivo, documento, valor_unitario, valor_total, admin_id)
                VALUES (?, 'entrada', ?, ?, ?, ?, ?, ?, ?)
            `;

            const valorTotal = (dados.valor_unitario || 0) * dados.quantidade;

            const [result] = await connection.execute(sqlMov, [
                dados.material_id,
                dados.quantidade,
                dados.obra_id || null,
                dados.motivo || 'Entrada de material',
                dados.documento || null,
                dados.valor_unitario || null,
                valorTotal,
                dados.admin_id
            ]);

            // Atualizar estoque do material
            const sqlUpdate = 'UPDATE materiais SET estoque_atual = estoque_atual + ? WHERE id = ?';
            await connection.execute(sqlUpdate, [dados.quantidade, dados.material_id]);

            await connection.commit();
            return result.insertId;

        } catch (err) {
            await connection.rollback();
            console.error('❌ Erro ao registrar entrada:', err);
            throw err;
        } finally {
            connection.release();
        }
    }

    // Registrar saída de material
    static async registrarSaida(dados) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Verificar se há estoque suficiente
            const [material] = await connection.execute('SELECT estoque_atual FROM materiais WHERE id = ?', [dados.material_id]);
            if (!material[0] || material[0].estoque_atual < dados.quantidade) {
                throw new Error('Estoque insuficiente para esta saída');
            }

            // Inserir movimentação
            const sqlMov = `
                INSERT INTO estoque_movimentacoes
                (material_id, tipo, quantidade, obra_id, motivo, documento, valor_unitario, valor_total, admin_id)
                VALUES (?, 'saida', ?, ?, ?, ?, ?, ?, ?)
            `;

            const valorTotal = (dados.valor_unitario || 0) * dados.quantidade;

            const [result] = await connection.execute(sqlMov, [
                dados.material_id,
                dados.quantidade,
                dados.obra_id || null,
                dados.motivo || 'Saída de material',
                dados.documento || null,
                dados.valor_unitario || null,
                valorTotal,
                dados.admin_id
            ]);

            // Atualizar estoque do material
            const sqlUpdate = 'UPDATE materiais SET estoque_atual = estoque_atual - ? WHERE id = ?';
            await connection.execute(sqlUpdate, [dados.quantidade, dados.material_id]);

            await connection.commit();
            return result.insertId;

        } catch (err) {
            await connection.rollback();
            console.error('❌ Erro ao registrar saída:', err);
            throw err;
        } finally {
            connection.release();
        }
    }

    // Buscar movimentações por material
    static async findByMaterial(materialId, limit = 50) {
        try {
            const sql = `
                SELECT
                    em.*,
                    m.nome as material_nome,
                    m.unidade,
                    o.nome_obra,
                    a.nome as admin_nome
                FROM estoque_movimentacoes em
                JOIN materiais m ON em.material_id = m.id
                LEFT JOIN obras o ON em.obra_id = o.id
                JOIN admins a ON em.admin_id = a.id
                WHERE em.material_id = ?
                ORDER BY em.created_at DESC
                LIMIT ?
            `;
            const [rows] = await db.execute(sql, [materialId, limit]);
            return rows;
        } catch (err) {
            console.error('❌ Erro ao buscar movimentações:', err);
            throw err;
        }
    }

    // Buscar movimentações por obra
    static async findByObra(obraId, limit = 100) {
        try {
            const sql = `
                SELECT
                    em.*,
                    m.nome as material_nome,
                    m.unidade,
                    a.nome as admin_nome
                FROM estoque_movimentacoes em
                JOIN materiais m ON em.material_id = m.id
                JOIN admins a ON em.admin_id = a.id
                WHERE em.obra_id = ?
                ORDER BY em.created_at DESC
                LIMIT ?
            `;
            const [rows] = await db.execute(sql, [obraId, limit]);
            return rows;
        } catch (err) {
            console.error('❌ Erro ao buscar movimentações por obra:', err);
            throw err;
        }
    }

    // Buscar todas as movimentações com filtros
    static async findAll(filtros = {}) {
        try {
            let sql = `
                SELECT
                    em.*,
                    m.nome as material_nome,
                    m.unidade,
                    m.categoria,
                    o.nome_obra,
                    a.nome as admin_nome
                FROM estoque_movimentacoes em
                JOIN materiais m ON em.material_id = m.id
                LEFT JOIN obras o ON em.obra_id = o.id
                JOIN admins a ON em.admin_id = a.id
                WHERE 1=1
            `;
            const params = [];

            if (filtros.tipo) {
                sql += ' AND em.tipo = ?';
                params.push(filtros.tipo);
            }

            if (filtros.material_id) {
                sql += ' AND em.material_id = ?';
                params.push(filtros.material_id);
            }

            if (filtros.obra_id) {
                sql += ' AND em.obra_id = ?';
                params.push(filtros.obra_id);
            }

            if (filtros.data_inicio) {
                sql += ' AND DATE(em.created_at) >= ?';
                params.push(filtros.data_inicio);
            }

            if (filtros.data_fim) {
                sql += ' AND DATE(em.created_at) <= ?';
                params.push(filtros.data_fim);
            }

            sql += ' ORDER BY em.created_at DESC';

            if (filtros.limit) {
                sql += ' LIMIT ?';
                params.push(filtros.limit);
            }

            const [rows] = await db.execute(sql, params);
            return rows;
        } catch (err) {
            console.error('❌ Erro ao buscar movimentações:', err);
            throw err;
        }
    }

    // Relatório de consumo por obra
    static async relatorioConsumoPorObra(obraId) {
        try {
            const sql = `
                SELECT
                    m.nome,
                    m.unidade,
                    SUM(CASE WHEN em.tipo = 'saida' THEN em.quantidade ELSE 0 END) as quantidade_saida,
                    AVG(em.valor_unitario) as valor_medio,
                    SUM(CASE WHEN em.tipo = 'saida' THEN em.valor_total ELSE 0 END) as valor_total
                FROM estoque_movimentacoes em
                JOIN materiais m ON em.material_id = m.id
                WHERE em.obra_id = ? AND em.tipo = 'saida'
                GROUP BY m.id, m.nome, m.unidade
                ORDER BY quantidade_saida DESC
            `;
            const [rows] = await db.execute(sql, [obraId]);
            return rows;
        } catch (err) {
            console.error('❌ Erro ao gerar relatório de consumo:', err);
            throw err;
        }
    }

    // Buscar movimentação por ID
    static async findById(id) {
        try {
            const sql = `
                SELECT
                    em.*,
                    m.nome as material_nome,
                    m.unidade,
                    o.nome_obra,
                    a.nome as admin_nome
                FROM estoque_movimentacoes em
                JOIN materiais m ON em.material_id = m.id
                LEFT JOIN obras o ON em.obra_id = o.id
                JOIN admins a ON em.admin_id = a.id
                WHERE em.id = ?
            `;
            const [rows] = await db.execute(sql, [id]);
            return rows[0] || null;
        } catch (err) {
            console.error('❌ Erro ao buscar movimentação:', err);
            throw err;
        }
    }
}

module.exports = EstoqueMovimentacao;