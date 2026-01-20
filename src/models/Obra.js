const db = require('../database/connection');

exports.create = async (usuarioId, nome, descricao = null) => {
  const sql = `
    INSERT INTO obras (usuario_id, nome_obra, descricao)
    VALUES (?, ?, ?)
  `;
  const [result] = await db.execute(sql, [
    usuarioId,
    nome,
    descricao
  ]);

  return result.insertId;
};

exports.findByUsuario = async (usuarioId) => {
  const sql = `
    SELECT * FROM obras
    WHERE usuario_id = ?
    ORDER BY created_at DESC
  `;
  const [rows] = await db.execute(sql, [usuarioId]);
  return rows;
};

exports.findById = async (id) => {
  const sql = `SELECT * FROM obras WHERE id = ? LIMIT 1`;
  const [rows] = await db.execute(sql, [id]);
  return rows[0];
};

exports.update = async (id, nome) => {
  const sql = `
    UPDATE obras
    SET nome_obra = ?, updated_at = NOW()
    WHERE id = ?
  `;
  await db.execute(sql, [nome, id]);
};

exports.delete = async (id) => {
  const sql = `DELETE FROM obras WHERE id = ?`;
  await db.execute(sql, [id]);
};

exports.findAllRecent = async (limit = 10) => {
   try {
     const sql = `
       SELECT o.id, o.nome_obra as nome, o.created_at, u.nome as usuario_nome
       FROM obras o
       LEFT JOIN usuarios u ON o.usuario_id = u.id
       ORDER BY o.created_at DESC
       LIMIT ?
     `;
     const [rows] = await db.execute(sql, [limit]);
     return rows;
   } catch (err) {
     console.error('❌ Erro ao buscar obras recentes:', err);
     // Fallback: buscar apenas da tabela obras
     try {
       const sqlFallback = `
         SELECT id, nome_obra as nome, created_at, 'Usuário não encontrado' as usuario_nome
         FROM obras
         ORDER BY created_at DESC
         LIMIT ?
       `;
       const [rows] = await db.execute(sqlFallback, [limit]);
       return rows;
     } catch (fallbackErr) {
       console.error('❌ Erro no fallback de obras:', fallbackErr);
       return [];
     }
   }
 };
