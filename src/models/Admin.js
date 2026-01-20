const db = require('../database/connection');

exports.findByEmail = async (email) => {
  try {
    if (!email || email.trim().length === 0) {
      throw new Error('Email inválido');
    }

    const sql = 'SELECT * FROM admins WHERE email = ? LIMIT 1';
    const [rows] = await db.execute(sql, [email.toLowerCase().trim()]);
    return rows.length ? rows[0] : null;
  } catch (err) {
    console.error('❌ Erro ao buscar admin por email:', err);
    throw err;
  }
};

exports.create = async (email, passwordHash) => {
  try {
    if (!email || !passwordHash) {
      throw new Error('Email e senha são obrigatórios');
    }

    const sql = 'INSERT INTO admins (email, password, created_at) VALUES (?, ?, NOW())';
    await db.execute(sql, [email.toLowerCase().trim(), passwordHash]);
  } catch (err) {
    console.error('❌ Erro ao criar admin:', err);
    throw err;
  }
};

exports.findById = async (id) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }

    const sql = 'SELECT id, email, nome FROM admins WHERE id = ? LIMIT 1';
    const [rows] = await db.execute(sql, [id]);
    return rows.length ? rows[0] : null;
  } catch (err) {
    console.error('❌ Erro ao buscar admin por ID:', err);
    throw err;
  }
};
