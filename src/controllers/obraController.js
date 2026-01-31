const Obra = require('../models/Obra');
const EtapaObra = require('../models/EtapaObra');
const db = require('../database/connection');
// SQLite desabilitado para Render
// const Database = require('better-sqlite3');
// const path = require('path');

// Database CONTROLEGERAL
// const dbPath = path.join(__dirname, '../../CONTROLEGERAL/backend/construtora.db');
// let sqliteDb;
// try {
//   sqliteDb = new Database(dbPath);
//   console.log('✅ Conectado ao banco CONTROLEGERAL para obras');
// } catch (err) {
//   console.error('Erro ao conectar ao banco CONTROLEGERAL:', err.message);
// }
const sqliteDb = null;

exports.create = async (req, res) => {
  const { usuarioId, nome } = req.body;

  if (!usuarioId || !nome) {
    return res.status(400).send('Dados obrigatórios não informados');
  }

  try {
    // cria a obra
    const obraId = await Obra.create(
      usuarioId,
      nome
    );

    // cria automaticamente as etapas (checklist)
    await EtapaObra.createDefaultEtapas(obraId);

    res.redirect('/dashboard/tablesUsers');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar obra');
  }
};

exports.view = async (req, res) => {
  try {
    const obra = await Obra.findById(req.params.id);
    const etapas = await EtapaObra.findByObra(req.params.id);

    res.json({ obra, etapas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).send('Nome da obra é obrigatório');
  }

  try {
    await Obra.update(id, nome);
    res.redirect('/dashboard/tablesUsers');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar obra');
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    await Obra.delete(id);
    res.redirect('/dashboard/tablesUsers');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao excluir obra');
  }
};

// =================== GERENCIAMENTO INDEPENDENTE DE OBRAS ===================

// Listar todas as obras do admin
exports.listAll = async (req, res) => {
  try {
    const adminId = req.session.adminId;

    const sql = `
      SELECT
        o.id,
        o.nome_obra,
        o.descricao,
        o.created_at,
        o.updated_at,
        u.nome as usuario_nome,
        u.id as usuario_id,
        u.obra as endereco_obra
      FROM obras o
      LEFT JOIN usuarios u ON o.usuario_id = u.id
      WHERE u.admin_id = ? OR o.usuario_id IS NULL
      ORDER BY o.created_at DESC
    `;

    const [obras] = await db.execute(sql, [adminId]);
    res.render('obras', { obras: obras || [] });
  } catch (err) {
    console.error('❌ Erro ao listar obras:', err);
    res.status(500).send('Erro ao carregar obras');
  }
};

// Página de criação de obra independente
exports.createPage = async (req, res) => {
  try {
    const adminId = req.session.adminId;

    // Buscar usuários do admin para o dropdown
    const [usuarios] = await db.execute(
      'SELECT id, nome, obra FROM usuarios WHERE admin_id = ? ORDER BY nome',
      [adminId]
    );

    res.render('obraForm', {
      obra: null,
      usuarios: usuarios || [],
      action: 'create'
    });
  } catch (err) {
    console.error('❌ Erro ao carregar página de criação:', err);
    res.status(500).send('Erro ao carregar página');
  }
};

// Criar obra independente
exports.createStandalone = async (req, res) => {
  const { usuario_id, nome_obra, descricao } = req.body;
  const adminId = req.session.adminId;

  if (!nome_obra) {
    return res.status(400).send('Nome da obra é obrigatório');
  }

  try {
    const obraId = await Obra.create(
      usuario_id || null,
      nome_obra,
      descricao
    );

    // Se foi associada a um usuário, criar etapas automaticamente
    if (usuario_id) {
      await require('../models/EtapaObra').createDefaultEtapas(obraId);
    }

    // Buscar dados do usuário para inserir no controle geral
    let cliente = 'Cliente não informado';
    let endereco = nome_obra;
    if (usuario_id) {
      const [usuarios] = await db.execute('SELECT nome, obra FROM usuarios WHERE id = ?', [usuario_id]);
      if (usuarios && usuarios.length > 0) {
        cliente = usuarios[0].nome;
        endereco = usuarios[0].obra || nome_obra;
      }
    }

    // Inserir no controle geral (SQLite)
    // Comentado para evitar problemas com SQLite no Render
    /*
    try {
      sqliteDb.prepare(`INSERT INTO obras (nome, endereco, cliente, orcamento, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(nome_obra, endereco, cliente, null, null, null, 'ativo');
      console.log(`✅ Obra inserida no controle geral: ${nome_obra}`);
    } catch (err) {
      console.error('Erro ao inserir obra no controle geral:', err);
    }
    */

    console.log(`✅ Obra criada: ${nome_obra} (ID: ${obraId})`);
    res.redirect('/obras');
  } catch (err) {
    console.error('❌ Erro ao criar obra independente:', err);
    res.status(500).send('Erro ao criar obra');
  }
};

// Página de edição de obra
exports.editPage = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.session.adminId;

        // Verificar se a obra pertence ao admin
        const obra = await Obra.findById(id);
        if (!obra) {
            return res.status(404).send('Obra não encontrada');
        }

        // Buscar usuários do admin
        const [usuarios] = await db.execute(
            'SELECT id, nome, obra FROM usuarios WHERE admin_id = ? ORDER BY nome',
            [adminId]
        );

        res.render('obraForm', {
            obra,
            usuarios: usuarios || [],
            action: 'edit'
        });
    } catch (err) {
        console.error('❌ Erro ao carregar página de edição:', err);
        res.status(500).send('Erro ao carregar página');
    }
};

// Desvincular obra do usuário
exports.desvincular = async (req, res) => {
    const { id } = req.params;
    const { usuario_id } = req.body;
    const adminId = req.session.adminId;

    try {
        // Verificar se a obra existe e pertence ao admin
        const [obras] = await db.execute(
            'SELECT o.* FROM obras o JOIN usuarios u ON o.usuario_id = u.id WHERE o.id = ? AND u.admin_id = ?',
            [id, adminId]
        );

        if (!obras || obras.length === 0) {
            return res.status(404).json({ error: 'Obra não encontrada ou não pertence ao admin' });
        }

        // Desvincular: excluir a obra desvinculada
        await db.execute('DELETE FROM obras WHERE id = ?', [id]);

        console.log(`✅ Obra ${id} excluída (desvinculada)`);
        res.json({ success: true, message: 'Obra excluída com sucesso' });

    } catch (err) {
        console.error('❌ Erro ao desvincular obra:', err);
        res.status(500).json({ error: 'Erro ao desvincular obra' });
    }
};
