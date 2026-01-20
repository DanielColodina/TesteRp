const db = require('../database/connection');

// Campos válidos do checklist - 6 etapas da obra
const CAMPOS_VALIDOS = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
const VALORES_VALIDOS = ['Nao Tem', 'Andamento', 'Feito'];

exports.findByUser = async (userId) => {
  try {
    if (!userId || isNaN(userId)) {
      throw new Error('ID de usuário inválido');
    }

    try {
      const [rows] = await db.execute(
        'SELECT * FROM checklist_usuarios WHERE usuario_id = ?',
        [userId]
      );
      return rows[0] || { usuario_id: userId, observacoes: '' };
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela checklist_usuarios não existe');
        return null; // Retorna null gracefully
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao buscar checklist:', err);
    return null; // Fallback final
  }
};

exports.updateObservacoes = async (userId, observacoes) => {
  try {
    if (!userId || isNaN(userId)) {
      throw new Error('ID de usuário inválido');
    }

    try {
      const sql = 'UPDATE checklist_usuarios SET observacoes = ? WHERE usuario_id = ?';
      const [result] = await db.execute(sql, [observacoes || '', userId]);
      return (result && result.affectedRows && result.affectedRows > 0);
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela checklist_usuarios não existe');
        return false;
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao atualizar observações:', err);
    throw err;
  }
};

exports.createIfNotExists = async (userId) => {
  try {
    if (!userId || isNaN(userId)) {
      throw new Error('ID de usuário inválido');
    }

    try {
      // Inserir linha se não existir (usuario_id é UNIQUE)
      // Usar INSERT IGNORE para evitar erro se a linha já existir
      const sql = 'INSERT IGNORE INTO checklist_usuarios (usuario_id) VALUES (?)';
      await db.execute(sql, [userId]);
      return true;
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela checklist_usuarios não existe');
        return false; // Indica que não foi possível criar
      }
      // Ignorar erros de duplicate key e tratar como sucesso
      if (dbErr.code === 'ER_DUP_ENTRY') {
        return true;
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao criar checklist:', err);
    // Não lança erro para não quebrar fluxo
    return false;
  }
};

exports.update = async (userId, field, value) => {
  try {
    if (!userId || isNaN(userId)) {
      throw new Error('ID de usuário inválido');
    }

    if (!CAMPOS_VALIDOS.includes(field)) {
      throw new Error(`Campo inválido: ${field}`);
    }

    if (!VALORES_VALIDOS.includes(value)) {
      throw new Error(`Valor inválido: ${value}`);
    }

    try {
      const sql = `UPDATE checklist_usuarios SET ${field} = ? WHERE usuario_id = ?`;
      const [result] = await db.execute(sql, [value, userId]);
      // result.affectedRows pode ser 0 se não existir linha; retornar boolean
      return (result && result.affectedRows && result.affectedRows > 0);
    } catch (dbErr) {
      if (dbErr.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Tabela checklist_usuarios não existe');
        return false; // Indica falha
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('❌ Erro ao atualizar checklist:', err);
    throw err;
  }
};

// Calcular progresso (0-100%) baseado em 3 itens: uso_solo, licenca, vistoria
exports.getProgresso = async (userId) => {
  try {
    if (!userId || isNaN(userId)) {
      throw new Error('ID de usuário inválido');
    }

    const checklist = await exports.findByUser(userId);

    if (!checklist) {
      return { progresso: 0 };
    }

    let completos = 0;

    CAMPOS_VALIDOS.forEach(item => {
      if (checklist[item] === 'Feito') {
        completos++;
      }
    });

    const progresso = (completos / CAMPOS_VALIDOS.length) * 100;
    return { progresso: Math.round(progresso) };
  } catch (err) {
    console.error('❌ Erro ao calcular progresso:', err);
    return { progresso: 0 };
  }
};

// Buscar todos os checklists com progresso calculado
exports.findAllWithProgresso = async () => {
  try {
    const sql = `
      SELECT
        cu.usuario_id,
        cu.uso_solo,
        cu.licenca,
        cu.condominio,
        cu.habite_se,
        cu.averbacao,
        cu.vistoria,
        cu.updated_at,
        u.nome,
        u.obra
      FROM checklist_usuarios cu
      JOIN usuarios u ON u.id = cu.usuario_id
      ORDER BY u.nome ASC
    `;

    const [rows] = await db.execute(sql);

    // Adicionar progresso calculado em cada linha
    return (rows || []).map(row => {
      let completos = 0;

      CAMPOS_VALIDOS.forEach(item => {
        if (row[item] === 'Feito') {
          completos++;
        }
      });

      const progresso = (completos / CAMPOS_VALIDOS.length) * 100;
      return { ...row, progresso: Math.round(progresso) };
    });
  } catch (err) {
    console.error('❌ Erro ao buscar todos os checklists com progresso:', err);
    return [];
  }
};
