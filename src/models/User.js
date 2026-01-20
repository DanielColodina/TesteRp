const db = require('../database/connection');

// CRIAR USUÁRIO
exports.create = async (nome, email, telefone, endereco, obra, adminId) => {
  try {
    if (!nome || !email || !endereco || !obra || !adminId) {
      throw new Error('Campos obrigatórios faltando');
    }

    // Verificar se email já existe
    const [existing] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      throw new Error('Email já cadastrado');
    }

    const sql = `
      INSERT INTO usuarios (nome, email, telefone, endereco, obra, admin_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.execute(sql, [nome, email, telefone, endereco, obra, adminId]);
    return result.insertId;
  } catch (err) {
    console.error('❌ Erro ao criar usuário:', err);
    throw err;
  }
};

// LISTAR USUÁRIOS DO ADMIN
exports.findAllByAdmin = async (adminId) => {
  try {
    if (!adminId || isNaN(adminId)) {
      throw new Error('ID de admin inválido');
    }

    const sql = 'SELECT * FROM usuarios WHERE admin_id = ? ORDER BY id DESC';
    const [rows] = await db.execute(sql, [adminId]);
    return rows || [];
  } catch (err) {
    console.error('❌ Erro ao listar usuários por admin:', err);
    throw err;
  }
};

// LISTAGEM DE TODOS OS USUARIOS COM ADMIN
exports.findAllWithAdmin = async () => {
  try {
    const sql = `
      SELECT
        u.id,
        u.nome,
        u.email,
        u.telefone,
        u.endereco,
        u.obra,
        a.nome AS admin_nome,
        u.created_at
      FROM usuarios u
      JOIN admins a ON a.id = u.admin_id
      ORDER BY u.id DESC
    `;
    const [rows] = await db.execute(sql);
    return rows || [];
  } catch (err) {
    console.error('❌ Erro ao listar usuários com admin:', err);
    throw err;
  }
};

// DELETA USUÁRIO
exports.deleteById = async(id) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }

    await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
  } catch (err) {
    console.error('❌ Erro ao deletar usuário:', err);
    throw err;
  }
};

// BUSCAR USUÁRIO POR ID
exports.findById = async(id) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }

    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  } catch (err) {
    console.error('❌ Erro ao buscar usuário por ID:', err);
    throw err;
  }
};

// ATUALIZAR USUÁRIO
exports.update = async (id, nome, email, telefone, endereco, obra) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }

    if (!nome || !email || !telefone || !endereco || !obra) {
      throw new Error('Campos obrigatórios faltando');
    }

    await db.execute(`
      UPDATE usuarios
      SET nome=?, email=?, telefone=?, endereco=?, obra=?
      WHERE id=?
    `, [nome, email, telefone, endereco, obra, id]);
  } catch (err) {
    console.error('❌ Erro ao atualizar usuário:', err);
    throw err;
  }
};

// BUSCAR HISTÓRICO DE USUÁRIO
exports.getHistoricoByUsuario = async(id) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }

    try {
      const sql = `
        SELECT 
          h.id,
          h.usuario_id,
          h.tipo,
          h.descricao,
          h.admin_id,
          h.created_at,
          u.nome AS usuario_nome,
          a.nome AS admin_nome,
          u.obra
        FROM historico h
        JOIN usuarios u ON u.id = h.usuario_id
        LEFT JOIN admins a ON a.id = h.admin_id
        WHERE h.usuario_id = ?
        ORDER BY h.created_at DESC
      `;
      
      const [rows] = await db.execute(sql, [id]);
      return rows || [];
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela historico não existe');
        return []; // Retorna vazio ao invés de lançar erro
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao buscar histórico de usuário:', err);
    return []; // Fallback final
  }
};