const db = require('../../../database/connection');

class Material {
    // Criar novo material
    static async create(dados) {
        try {
            const sql = `
                INSERT INTO materiais
                (nome, descricao, unidade, categoria, preco_unitario, estoque_minimo, fornecedor_padrao, ativo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.execute(sql, [
                dados.nome,
                dados.descricao || null,
                dados.unidade || 'un',
                dados.categoria || null,
                dados.preco_unitario || 0,
                dados.estoque_minimo || 0,
                dados.fornecedor_padrao || null,
                dados.ativo !== undefined ? dados.ativo : true
            ]);

            return result.insertId;
        } catch (err) {
            console.error('❌ Erro ao criar material:', err);
            throw err;
        }
    }

    // Buscar material por ID
    static async findById(id) {
        try {
            const sql = 'SELECT * FROM materiais WHERE id = ? AND ativo = TRUE';
            const [rows] = await db.execute(sql, [id]);
            return rows[0] || null;
        } catch (err) {
            console.error('❌ Erro ao buscar material:', err);
            throw err;
        }
    }

    // Buscar material por nome
    static async findByName(nome) {
        try {
            const sql = 'SELECT * FROM materiais WHERE nome = ? AND ativo = TRUE';
            const [rows] = await db.execute(sql, [nome]);
            return rows[0] || null;
        } catch (err) {
            console.error('❌ Erro ao buscar material por nome:', err);
            throw err;
        }
    }

    // Listar todos os materiais
    static async findAll(filtros = {}) {
        try {
            let sql = 'SELECT * FROM materiais WHERE ativo = TRUE';
            const params = [];

            if (filtros.categoria) {
                sql += ' AND categoria = ?';
                params.push(filtros.categoria);
            }

            if (filtros.busca) {
                sql += ' AND (nome LIKE ? OR descricao LIKE ?)';
                params.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
            }

            sql += ' ORDER BY nome ASC';

            if (filtros.limit) {
                sql += ' LIMIT ?';
                params.push(filtros.limit);
            }

            const [rows] = await db.execute(sql, params);
            return rows;
        } catch (err) {
            console.error('❌ Erro ao listar materiais:', err);
            throw err;
        }
    }

    // Atualizar material
    static async update(id, dados) {
        try {
            const sql = `
                UPDATE materiais
                SET nome = ?, descricao = ?, unidade = ?, categoria = ?,
                    preco_unitario = ?, estoque_minimo = ?, fornecedor_padrao = ?,
                    updated_at = NOW()
                WHERE id = ?
            `;
            const [result] = await db.execute(sql, [
                dados.nome,
                dados.descricao || null,
                dados.unidade || 'un',
                dados.categoria || null,
                dados.preco_unitario || 0,
                dados.estoque_minimo || 0,
                dados.fornecedor_padrao || null,
                id
            ]);

            return result.affectedRows > 0;
        } catch (err) {
            console.error('❌ Erro ao atualizar material:', err);
            throw err;
        }
    }

    // Desativar material (soft delete)
    static async delete(id) {
        try {
            const sql = 'UPDATE materiais SET ativo = FALSE WHERE id = ?';
            const [result] = await db.execute(sql, [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error('❌ Erro ao desativar material:', err);
            throw err;
        }
    }

    // Buscar materiais com estoque baixo
    static async findEstoqueBaixo() {
        try {
            const sql = `
                SELECT * FROM materiais
                WHERE ativo = TRUE AND estoque_atual <= estoque_minimo
                ORDER BY (estoque_minimo - estoque_atual) DESC
            `;
            const [rows] = await db.execute(sql);
            return rows;
        } catch (err) {
            console.error('❌ Erro ao buscar materiais com estoque baixo:', err);
            throw err;
        }
    }

    // Buscar categorias disponíveis
    static async findCategorias() {
        try {
            const sql = 'SELECT DISTINCT categoria FROM materiais WHERE ativo = TRUE AND categoria IS NOT NULL ORDER BY categoria';
            const [rows] = await db.execute(sql);
            return rows.map(row => row.categoria);
        } catch (err) {
            console.error('❌ Erro ao buscar categorias:', err);
            throw err;
        }
    }

    // Atualizar estoque manualmente (usar com cuidado, normalmente via movimentações)
    static async updateEstoque(id, quantidade) {
        try {
            const sql = 'UPDATE materiais SET estoque_atual = ? WHERE id = ?';
            const [result] = await db.execute(sql, [quantidade, id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error('❌ Erro ao atualizar estoque:', err);
            throw err;
        }
    }
}

module.exports = Material;