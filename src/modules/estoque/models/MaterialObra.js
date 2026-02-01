const db = require('../../../database/connection');

class MaterialObra {
    // Criar material para obra específica
    static async create(dados) {
        try {
            const sql = `
                INSERT INTO materiais_obra
                (obra_id, material_id, quantidade_estimada, quantidade_inicial, saldo_atual, fase_obra, categoria, subcategoria, ativo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.execute(sql, [
                dados.obra_id,
                dados.material_id,
                dados.quantidade_estimada || 0,
                dados.quantidade_inicial || 0,
                dados.saldo_atual || dados.quantidade_inicial || 0,
                dados.fase_obra,
                dados.categoria || null,
                dados.subcategoria || null,
                dados.ativo !== undefined ? dados.ativo : true
            ]);

            return result.insertId;
        } catch (err) {
            console.error('❌ Erro ao criar material da obra:', err);
            throw err;
        }
    }

    // Buscar materiais por obra
    static async findByObra(obraId, filtros = {}) {
        try {
            // Primeiro busca da tabela materiais_obra
            let sqlMateriaisObra = `
                SELECT
                    mo.*,
                    m.nome as material_nome,
                    m.descricao,
                    m.unidade,
                    m.preco_unitario,
                    o.nome_obra
                FROM materiais_obra mo
                JOIN materiais m ON mo.material_id = m.id
                JOIN obras o ON mo.obra_id = o.id
                WHERE mo.obra_id = ? AND mo.ativo = TRUE
            `;
            const paramsMateriaisObra = [obraId];

            if (filtros.fase_obra) {
                sqlMateriaisObra += ' AND mo.fase_obra = ?';
                paramsMateriaisObra.push(filtros.fase_obra);
            }

            if (filtros.categoria) {
                sqlMateriaisObra += ' AND mo.categoria = ?';
                paramsMateriaisObra.push(filtros.categoria);
            }

            if (filtros.busca) {
                sqlMateriaisObra += ' AND (m.nome LIKE ? OR m.descricao LIKE ?)';
                paramsMateriaisObra.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
            }

            // Também busca da tabela materiais_construtora para obras vinculadas
            let sqlMateriaisConstrutora = `
                SELECT
                    mc.id,
                    mc.obra_id,
                    mc.codigo as material_codigo,
                    mc.descricao,
                    mc.unidade,
                    mc.quantidade as saldo_atual,
                    mc.preco_medio as preco_unitario,
                    mc.descricao as material_nome,
                    mc.obra_id,
                    'materiais_construtora' as origem
                FROM materiais_construtora mc
                WHERE mc.obra_id = ?
            `;
            const paramsMateriaisConstrutora = [obraId];

            if (filtros.busca) {
                sqlMateriaisConstrutora += ' AND (mc.descricao LIKE ? OR mc.codigo LIKE ?)';
                paramsMateriaisConstrutora.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
            }

            // Executa ambas as queries
            const [materiaisObra] = await db.execute(sqlMateriaisObra, paramsMateriaisObra);
            const [materiaisConstrutora] = await db.execute(sqlMateriaisConstrutora, paramsMateriaisConstrutora);

            // Combina os resultados
            let materiais = [...materiaisObra, ...materiaisConstrutora];

            // Ordena por fase_obra (se existir) e nome
            materiais.sort((a, b) => {
                const faseA = a.fase_obra || '';
                const faseB = b.fase_obra || '';
                if (faseA !== faseB) return faseA.localeCompare(faseB);
                return (a.material_nome || '').localeCompare(b.material_nome || '');
            });

            // Aplica limite se especificado
            if (filtros.limit) {
                materiais = materiais.slice(0, filtros.limit);
            }

            console.log(`✅ Materiais encontrados para obra ${obraId}: ${materiais.length} (${materiaisObra.length} da obra + ${materiaisConstrutora.length} do construtora)`);
            return materiais;
        } catch (err) {
            console.error('❌ Erro ao buscar materiais da obra:', err);
            throw err;
        }
    }

    // Buscar material específico da obra
    static async findById(id) {
        try {
            const sql = `
                SELECT
                    mo.*,
                    m.nome as material_nome,
                    m.descricao,
                    m.unidade,
                    m.preco_unitario,
                    o.nome_obra
                FROM materiais_obra mo
                JOIN materiais m ON mo.material_id = m.id
                JOIN obras o ON mo.obra_id = o.id
                WHERE mo.id = ? AND mo.ativo = TRUE
            `;
            const [rows] = await db.execute(sql, [id]);
            return rows[0] || null;
        } catch (err) {
            console.error('❌ Erro ao buscar material da obra:', err);
            throw err;
        }
    }

    // Atualizar material da obra
    static async update(id, dados) {
        try {
            const sql = `
                UPDATE materiais_obra
                SET quantidade_estimada = ?, quantidade_inicial = ?, saldo_atual = ?,
                    fase_obra = ?, categoria = ?, subcategoria = ?, updated_at = NOW()
                WHERE id = ?
            `;
            const [result] = await db.execute(sql, [
                dados.quantidade_estimada,
                dados.quantidade_inicial,
                dados.saldo_atual,
                dados.fase_obra,
                dados.categoria || null,
                dados.subcategoria || null,
                id
            ]);

            return result.affectedRows > 0;
        } catch (err) {
            console.error('❌ Erro ao atualizar material da obra:', err);
            throw err;
        }
    }

    // Registrar entrada de material na obra
    static async registrarEntrada(dados) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Verificar se material existe na obra
            const [materialObra] = await connection.execute(
                'SELECT id, saldo_atual FROM materiais_obra WHERE id = ? AND ativo = TRUE',
                [dados.material_obra_id]
            );

            if (!materialObra[0]) {
                throw new Error('Material não encontrado na obra');
            }

            // Registrar movimentação
            const sqlMov = `
                INSERT INTO movimentacoes_obra
                (obra_id, material_obra_id, tipo, quantidade, etapa_obra, motivo, documento, responsavel_id, data_movimentacao, observacoes)
                VALUES (?, ?, 'entrada', ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await connection.execute(sqlMov, [
                dados.obra_id,
                dados.material_obra_id,
                dados.quantidade,
                dados.etapa_obra || null,
                dados.motivo || 'Entrada de material na obra',
                dados.documento || null,
                dados.responsavel_id,
                dados.data_movimentacao || new Date().toISOString().split('T')[0],
                dados.observacoes || null
            ]);

            // Atualizar saldo da obra
            const sqlUpdate = 'UPDATE materiais_obra SET saldo_atual = saldo_atual + ?, updated_at = NOW() WHERE id = ?';
            await connection.execute(sqlUpdate, [dados.quantidade, dados.material_obra_id]);

            // Abater do estoque geral (se aplicável)
            if (dados.abater_estoque_geral) {
                const sqlEstoqueGeral = 'UPDATE materiais SET estoque_atual = estoque_atual - ? WHERE id = (SELECT material_id FROM materiais_obra WHERE id = ?)';
                await connection.execute(sqlEstoqueGeral, [dados.quantidade, dados.material_obra_id]);
            }

            await connection.commit();
            return result.insertId;

        } catch (err) {
            await connection.rollback();
            console.error('❌ Erro ao registrar entrada na obra:', err);
            throw err;
        } finally {
            connection.release();
        }
    }

    // Registrar saída/consumo de material da obra
    static async registrarSaida(dados) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Verificar saldo suficiente
            const [materialObra] = await connection.execute(
                'SELECT id, saldo_atual FROM materiais_obra WHERE id = ? AND ativo = TRUE',
                [dados.material_obra_id]
            );

            if (!materialObra[0]) {
                throw new Error('Material não encontrado na obra');
            }

            if (materialObra[0].saldo_atual < dados.quantidade) {
                throw new Error('Saldo insuficiente na obra para esta saída');
            }

            // Registrar movimentação
            const sqlMov = `
                INSERT INTO movimentacoes_obra
                (obra_id, material_obra_id, tipo, quantidade, etapa_obra, motivo, documento, responsavel_id, data_movimentacao, observacoes)
                VALUES (?, ?, 'saida', ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await connection.execute(sqlMov, [
                dados.obra_id,
                dados.material_obra_id,
                dados.quantidade,
                dados.etapa_obra,
                dados.motivo || 'Consumo na obra',
                dados.documento || null,
                dados.responsavel_id,
                dados.data_movimentacao || new Date().toISOString().split('T')[0],
                dados.observacoes || null
            ]);

            // Atualizar saldo da obra
            const sqlUpdate = 'UPDATE materiais_obra SET saldo_atual = saldo_atual - ?, updated_at = NOW() WHERE id = ?';
            await connection.execute(sqlUpdate, [dados.quantidade, dados.material_obra_id]);

            await connection.commit();
            return result.insertId;

        } catch (err) {
            await connection.rollback();
            console.error('❌ Erro ao registrar saída da obra:', err);
            throw err;
        } finally {
            connection.release();
        }
    }

    // Buscar movimentações por obra
    static async getMovimentacoes(obraId, filtros = {}) {
        try {
            let sql = `
                SELECT
                    mo.*,
                    mob.fase_obra,
                    m.nome as material_nome,
                    m.unidade,
                    a.nome as responsavel_nome
                FROM movimentacoes_obra mo
                JOIN materiais_obra mob ON mo.material_obra_id = mob.id
                JOIN materiais m ON mob.material_id = m.id
                JOIN admins a ON mo.responsavel_id = a.id
                WHERE mo.obra_id = ?
            `;
            const params = [obraId];

            if (filtros.tipo) {
                sql += ' AND mo.tipo = ?';
                params.push(filtros.tipo);
            }

            if (filtros.etapa_obra) {
                sql += ' AND mo.etapa_obra = ?';
                params.push(filtros.etapa_obra);
            }

            if (filtros.data_inicio) {
                sql += ' AND mo.data_movimentacao >= ?';
                params.push(filtros.data_inicio);
            }

            if (filtros.data_fim) {
                sql += ' AND mo.data_movimentacao <= ?';
                params.push(filtros.data_fim);
            }

            sql += ' ORDER BY mo.data_movimentacao DESC, mo.created_at DESC';

            if (filtros.limit) {
                sql += ' LIMIT ?';
                params.push(filtros.limit);
            }

            const [rows] = await db.execute(sql, params);
            return rows;
        } catch (err) {
            console.error('❌ Erro ao buscar movimentações da obra:', err);
            throw err;
        }
    }

    // Relatório de consumo por etapa
    static async relatorioConsumoPorEtapa(obraId) {
        try {
            const sql = `
                SELECT
                    mo.etapa_obra,
                    m.nome as material_nome,
                    m.unidade,
                    SUM(CASE WHEN mov.tipo = 'entrada' THEN mov.quantidade ELSE 0 END) as total_entradas,
                    SUM(CASE WHEN mov.tipo = 'saida' THEN mov.quantidade ELSE 0 END) as total_saidas,
                    SUM(CASE WHEN mov.tipo = 'perda' THEN mov.quantidade ELSE 0 END) as total_perdas,
                    (SUM(CASE WHEN mov.tipo = 'entrada' THEN mov.quantidade ELSE 0 END) -
                     SUM(CASE WHEN mov.tipo = 'saida' THEN mov.quantidade ELSE 0 END) -
                     SUM(CASE WHEN mov.tipo = 'perda' THEN mov.quantidade ELSE 0 END)) as saldo_atual
                FROM materiais_obra mo
                JOIN materiais m ON mo.material_id = m.id
                LEFT JOIN movimentacoes_obra mov ON mo.id = mov.material_obra_id
                WHERE mo.obra_id = ? AND mo.ativo = TRUE
                GROUP BY mo.etapa_obra, m.id, m.nome, m.unidade
                ORDER BY mo.etapa_obra ASC, m.nome ASC
            `;
            const [rows] = await db.execute(sql, [obraId]);
            return rows;
        } catch (err) {
            console.error('❌ Erro ao gerar relatório de consumo:', err);
            throw err;
        }
    }

    // Buscar materiais com saldo baixo na obra
    static async findSaldoBaixo(obraId) {
        try {
            const sql = `
                SELECT
                    mo.*,
                    m.nome as material_nome,
                    m.unidade,
                    (mo.quantidade_estimada * 0.2) as limite_alerta
                FROM materiais_obra mo
                JOIN materiais m ON mo.material_id = m.id
                WHERE mo.obra_id = ? AND mo.ativo = TRUE
                AND mo.saldo_atual <= (mo.quantidade_estimada * 0.2)
                ORDER BY (mo.quantidade_estimada - mo.saldo_atual) DESC
            `;
            const [rows] = await db.execute(sql, [obraId]);
            return rows;
        } catch (err) {
            console.error('❌ Erro ao buscar materiais com saldo baixo:', err);
            throw err;
        }
    }

    // Desativar material da obra
    static async delete(id) {
        try {
            const sql = 'UPDATE materiais_obra SET ativo = FALSE WHERE id = ?';
            const [result] = await db.execute(sql, [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error('❌ Erro ao desativar material da obra:', err);
            throw err;
        }
    }

    // Buscar fases/etapas disponíveis
    static async findFases() {
        try {
            const sql = 'SELECT DISTINCT fase_obra FROM materiais_obra WHERE ativo = TRUE AND fase_obra IS NOT NULL ORDER BY fase_obra';
            const [rows] = await db.execute(sql);
            return rows.map(row => row.fase_obra);
        } catch (err) {
            console.error('❌ Erro ao buscar fases:', err);
            throw err;
        }
    }
}

module.exports = MaterialObra;