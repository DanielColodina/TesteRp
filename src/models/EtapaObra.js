const db = require('../database/connection');

exports.createDefaultEtapas = async (obraId) => {
  const etapas = [
    'uso_do_solo',
    'licenca',
    'condominio',
    'habite_se',
    'averbacao',
    'vistoria'
  ];

  const sql = `
    INSERT INTO etapas_obra (obra_id, etapa_nome)
    VALUES (?, ?)
  `;

  for (const etapa of etapas) {
    await db.execute(sql, [obraId, etapa]);
  }
};

exports.findByObra = async (obraId) => {
  const sql = `
    SELECT * FROM etapas_obra
    WHERE obra_id = ?
  `;
  const [rows] = await db.execute(sql, [obraId]);
  return rows;
};

exports.updateStatus = async (id, status) => {
  const sql = `
    UPDATE etapas_obra
    SET status = ?
    WHERE id = ?
  `;
  await db.execute(sql, [status, id]);
};
