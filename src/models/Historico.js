const db = require('../database/connection');

// Registrar histórico de mudança
exports.registrar = async (usuarioId, tipo, descricao, adminId) => {
  try {
    if (!usuarioId || isNaN(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    if (!tipo || tipo.trim().length === 0) {
      throw new Error('Tipo de histórico inválido');
    }

    if (!descricao || descricao.trim().length === 0) {
      throw new Error('Descrição inválida');
    }

    try {
      const sql = `
        INSERT INTO historico (usuario_id, tipo, descricao, admin_id, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      await db.execute(sql, [usuarioId, tipo, descricao, adminId || null]);
    } catch (dbErr) {
      // Se tabela não existe, apenas log (não é erro crítico)
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela historico não existe - histórico não será registrado');
        return; // Não lança erro para não quebrar fluxo
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao registrar histórico:', err);
    throw err;
  }
};

// Buscar histórico de um usuário
exports.findByUsuario = async (usuarioId) => {
  try {
    if (!usuarioId || isNaN(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    try {
      const sql = `
        SELECT 
          h.*,
          u.nome AS usuario_nome,
          a.nome AS admin_nome,
          u.obra
        FROM historico h
        JOIN usuarios u ON u.id = h.usuario_id
        LEFT JOIN admins a ON a.id = h.admin_id
        WHERE h.usuario_id = ?
        ORDER BY h.created_at DESC
      `;
      const [rows] = await db.execute(sql, [usuarioId]);
      return rows || [];
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela historico não existe');
        return [];
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao buscar histórico por usuário:', err);
    return [];
  }
};

// Buscar histórico recente (últimas 50 mudanças)
exports.findRecente = async () => {
  try {
    try {
      const sql = `
        SELECT 
          h.*,
          u.nome AS usuario_nome,
          a.nome AS admin_nome,
          u.obra
        FROM historico h
        JOIN usuarios u ON u.id = h.usuario_id
        LEFT JOIN admins a ON a.id = h.admin_id
        ORDER BY h.created_at DESC
        LIMIT 50
      `;
      const [rows] = await db.execute(sql);
      return rows || [];
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela historico não existe');
        return [];
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao buscar histórico recente:', err);
    return [];
  }
};

// Contar mudanças por tipo (últimos 7 dias)
exports.contarPorTipo = async () => {
  try {
    try {
      const sql = `
        SELECT 
          tipo,
          COUNT(*) as total
        FROM historico
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY tipo
        ORDER BY total DESC
      `;
      const [rows] = await db.execute(sql);
      return rows || [];
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela historico não existe');
        return [];
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao contar mudanças por tipo:', err);
    return [];
  }
};
