const db = require('../database/connection');

// Registrar auditoria
exports.log = async (adminId, usuarioId, acao, campo, valorAnterior, valorNovo) => {
  try {
    // adminId é opcional (ações automáticas podem não ter admin)
    if (adminId !== undefined && adminId !== null && isNaN(adminId)) {
      throw new Error('ID de admin inválido');
    }

    if (!usuarioId || isNaN(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    try {
      const sql = `
        INSERT INTO auditoria (admin_id, usuario_id, acao, campo, valor_anterior, valor_novo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;
      await db.execute(sql, [adminId, usuarioId, acao, campo, valorAnterior, valorNovo]);
    } catch (dbErr) {
      // Se tabela não existe, apenas log (não é erro crítico)
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela auditoria não existe - auditoria não será registrada');
        return; // Não lança erro para não quebrar fluxo
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao registrar auditoria:', err);
    throw err;
  }
};

// Buscar logs de auditoria por usuário
exports.findByUsuario = async (usuarioId) => {
  try {
    if (!usuarioId || isNaN(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    try {
      const sql = `
        SELECT 
          a.*,
          adm.nome AS admin_nome,
          u.nome AS usuario_nome
        FROM auditoria a
        LEFT JOIN admins adm ON adm.id = a.admin_id
        JOIN usuarios u ON u.id = a.usuario_id
        WHERE a.usuario_id = ?
        ORDER BY a.created_at DESC
      `;
      const [rows] = await db.execute(sql, [usuarioId]);
      return rows || [];
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela auditoria não existe');
        return []; // Retorna vazio ao invés de lançar erro
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao buscar auditoria por usuário:', err);
    return []; // Fallback final
  }
};

// Buscar todos os logs de auditoria
exports.findAll = async () => {
  try {
    try {
      const sql = `
        SELECT 
          a.*,
          adm.nome AS admin_nome,
          u.nome AS usuario_nome
        FROM auditoria a
        LEFT JOIN admins adm ON adm.id = a.admin_id
        JOIN usuarios u ON u.id = a.usuario_id
        ORDER BY a.created_at DESC
        LIMIT 100
      `;
      const [rows] = await db.execute(sql);
      return rows || [];
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela auditoria não existe');
        return []; // Retorna vazio ao invés de lançar erro
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao buscar todos os logs de auditoria:', err);
    return []; // Fallback final
  }
};

// Contar logs por tipo de ação (últimos 30 dias)
exports.contarPorAcao = async () => {
  try {
    try {
      const sql = `
        SELECT 
          acao,
          COUNT(*) as total
        FROM auditoria
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY acao
        ORDER BY total DESC
      `;
      const [rows] = await db.execute(sql);
      return rows || [];
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela auditoria não existe');
        return []; // Retorna vazio ao invés de lançar erro
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao contar ações de auditoria:', err);
    return []; // Fallback final
  }
};
