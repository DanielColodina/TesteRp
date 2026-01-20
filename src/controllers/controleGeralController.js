const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const mysql = require('mysql2/promise');

// Database CONTROLEGERAL
const dbPath = path.join(__dirname, '../../CONTROLEGERAL/backend/construtora.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco CONTROLEGERAL:', err.message);
  } else {
    console.log('✅ Conectado ao banco CONTROLEGERAL');
  }
});

// Main database for obras
const mainDb = require('../database/connection');

// CONTROLE GERAL
exports.controleGeral = async (req, res) => {
  try {
    res.render('controlegeral');
  } catch (err) {
    console.error('Erro ao carregar controle geral:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// OBRAS
exports.obras = async (req, res) => {
  try {
    db.all('SELECT * FROM obras ORDER BY id DESC', [], (err, obras) => {
      if (err) {
        console.error('Erro ao buscar obras:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar obras' });
      }
      res.render('obrasControle', { obras: obras || [] });
    });
  } catch (err) {
    console.error('Erro ao carregar obras:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.criarObra = async (req, res) => {
   try {
     const { nome, endereco, cliente, orcamento, data_inicio, data_fim, status } = req.body;
     db.run(`INSERT INTO obras (nome, endereco, cliente, orcamento, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
       [nome, endereco, cliente, orcamento, data_inicio, data_fim, status], function(err) {
       if (err) {
         console.error('Erro ao criar obra:', err);
         return res.status(500).json({ error: err.message });
       }
       res.redirect('/dashboard/controle-geral/obras');
     });
   } catch (err) {
     console.error('Erro ao criar obra:', err);
     res.status(500).json({ error: 'Erro interno do servidor' });
   }
 };

exports.editarObraPage = async (req, res) => {
  try {
    const { id } = req.params;
    db.get('SELECT * FROM obras WHERE id = ?', [id], (err, obra) => {
      if (err) {
        console.error('Erro ao buscar obra:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar obra' });
      }
      if (!obra) {
        return res.status(404).render('error', { message: 'Obra não encontrada' });
      }
      res.render('editObra', { obra });
    });
  } catch (err) {
    console.error('Erro ao carregar página de edição:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.editarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, endereco, cliente, orcamento, data_inicio, data_fim, status } = req.body;
    db.run(`UPDATE obras SET nome = ?, endereco = ?, cliente = ?, orcamento = ?, data_inicio = ?, data_fim = ?, status = ? WHERE id = ?`,
      [nome, endereco, cliente, orcamento, data_inicio, data_fim, status, id], function(err) {
      if (err) {
        console.error('Erro ao editar obra:', err);
        return res.status(500).render('error', { message: 'Erro ao editar obra' });
      }
      res.redirect('/dashboard/controle-geral/obras');
    });
  } catch (err) {
    console.error('Erro ao editar obra:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.excluirObra = async (req, res) => {
  try {
    const { id } = req.params;
    db.run('DELETE FROM obras WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Erro ao excluir obra:', err);
        return res.status(500).render('error', { message: 'Erro ao excluir obra' });
      }
      res.redirect('/dashboard/controle-geral/obras');
    });
  } catch (err) {
    console.error('Erro ao excluir obra:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// ESTOQUE
exports.estoque = async (req, res) => {
  try {
    db.all(`
      SELECT m.*, o.nome as obra_nome
      FROM materiais m
      LEFT JOIN obras o ON m.obra_id = o.id
      ORDER BY m.id DESC
    `, [], (err, materiais) => {
      if (err) {
        console.error('Erro ao buscar materiais:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar materiais' });
      }
      // Buscar obras para o dropdown
      db.all('SELECT id, nome FROM obras ORDER BY nome', [], (err2, obras) => {
        if (err2) {
          console.error('Erro ao buscar obras:', err2);
        }
        res.render('estoque', { materiais: materiais || [], obras: obras || [] });
      });
    });
  } catch (err) {
    console.error('Erro ao carregar estoque:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.criarMaterial = async (req, res) => {
    try {
      const { codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo, obra_id } = req.body;
      db.run(`INSERT INTO materiais (codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo, obra_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo, obra_id], function(err) {
        if (err) {
          console.error('Erro ao criar material:', err);
          return res.status(500).json({ error: err.message });
        }
        res.redirect('/dashboard/controle-geral/estoque');
      });
    } catch (err) {
      console.error('Erro ao criar material:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

exports.editarMaterialPage = async (req, res) => {
  try {
    const { id } = req.params;
    db.get('SELECT * FROM materiais WHERE id = ?', [id], (err, material) => {
      if (err) {
        console.error('Erro ao buscar material:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar material' });
      }
      if (!material) {
        return res.status(404).render('error', { message: 'Material não encontrado' });
      }
      // Buscar obras para o dropdown
      db.all('SELECT id, nome FROM obras ORDER BY nome', [], (err2, obras) => {
        if (err2) {
          console.error('Erro ao buscar obras:', err2);
        }
        res.render('editMaterial', { material, obras: obras || [] });
      });
    });
  } catch (err) {
    console.error('Erro ao carregar página de edição:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.editarMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo, obra_id } = req.body;
    db.run(`UPDATE materiais SET codigo = ?, descricao = ?, unidade = ?, quantidade = ?, preco_medio = ?, estoque_minimo = ?, obra_id = ? WHERE id = ?`,
      [codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo, obra_id, id], function(err) {
      if (err) {
        console.error('Erro ao editar material:', err);
        return res.status(500).render('error', { message: 'Erro ao editar material' });
      }
      res.redirect('/dashboard/controle-geral/estoque');
    });
  } catch (err) {
    console.error('Erro ao editar material:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.excluirMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    db.run('DELETE FROM materiais WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Erro ao excluir material:', err);
        return res.status(500).render('error', { message: 'Erro ao excluir material' });
      }
      res.redirect('/dashboard/controle-geral/estoque');
    });
  } catch (err) {
    console.error('Erro ao excluir material:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// EQUIPES
exports.equipes = async (req, res) => {
  try {
    // Buscar funcionários com informações da obra
    db.all(`
      SELECT f.*, o.nome as obra_nome
      FROM funcionarios f
      LEFT JOIN obras o ON f.obra_id = o.id
      ORDER BY f.id DESC
    `, [], (err, funcionarios) => {
      if (err) {
        console.error('Erro ao buscar funcionários:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar funcionários' });
      }

      // Buscar obras para o dropdown
      db.all('SELECT id, nome FROM obras ORDER BY nome', [], (err2, obras) => {
        if (err2) {
          console.error('Erro ao buscar obras:', err2);
        }
        res.render('equipes', { funcionarios: funcionarios || [], obras: obras || [] });
      });
    });
  } catch (err) {
    console.error('Erro ao carregar equipes:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.criarFuncionario = async (req, res) => {
    try {
      const { nome, funcao, salario, obra_id } = req.body;
      db.run(`INSERT INTO funcionarios (nome, funcao, salario, obra_id) VALUES (?, ?, ?, ?)`,
        [nome, funcao, salario, obra_id || null], function(err) {
        if (err) {
          console.error('Erro ao criar funcionário:', err);
          return res.status(500).json({ error: err.message });
        }
        res.redirect('/dashboard/controle-geral/equipes');
      });
    } catch (err) {
      console.error('Erro ao criar funcionário:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

exports.editarFuncionario = async (req, res) => {
    try {
      const { id, nome, funcao, salario, obra_id } = req.body;
      db.run(`UPDATE funcionarios SET nome = ?, funcao = ?, salario = ?, obra_id = ? WHERE id = ?`,
        [nome, funcao, salario, obra_id || null, id], function(err) {
        if (err) {
          console.error('Erro ao editar funcionário:', err);
          return res.status(500).json({ error: err.message });
        }
        res.redirect('/dashboard/controle-geral/equipes');
      });
    } catch (err) {
      console.error('Erro ao editar funcionário:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

// FINANCEIRO
exports.financeiro = async (req, res) => {
  try {
    db.all(`
      SELECT f.*, o.nome as obra_nome
      FROM financeiro f
      LEFT JOIN obras o ON f.obra_id = o.id
      ORDER BY f.id DESC
    `, [], (err, financeiro) => {
      if (err) {
        console.error('Erro ao buscar financeiro:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar financeiro' });
      }
      // Buscar obras para o dropdown
      db.all('SELECT id, nome FROM obras ORDER BY nome', [], (err2, obras) => {
        if (err2) {
          console.error('Erro ao buscar obras:', err2);
        }
        res.render('financeiro', { financeiro: financeiro || [], obras: obras || [] });
      });
    });
  } catch (err) {
    console.error('Erro ao carregar financeiro:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.criarFinanceiro = async (req, res) => {
   try {
     const { tipo, descricao, valor, data, obra_id } = req.body;
     db.run(`INSERT INTO financeiro (tipo, descricao, valor, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
       [tipo, descricao, valor, data, obra_id], function(err) {
       if (err) {
         console.error('Erro ao criar transação financeira:', err);
         return res.status(500).json({ error: err.message });
       }
       res.redirect('/dashboard/controle-geral/financeiro');
     });
   } catch (err) {
     console.error('Erro ao criar transação financeira:', err);
     res.status(500).json({ error: 'Erro interno do servidor' });
   }
 };

// COMUNICAÇÃO
exports.comunicacao = async (req, res) => {
  try {
    db.all(`
      SELECT m.*, o.nome as obra_nome
      FROM mensagens m
      LEFT JOIN obras o ON m.obra_id = o.id
      ORDER BY m.id DESC
    `, [], (err, mensagens) => {
      if (err) {
        console.error('Erro ao buscar mensagens:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar mensagens' });
      }
      // Buscar obras para o dropdown
      db.all('SELECT id, nome FROM obras ORDER BY nome', [], (err2, obras) => {
        if (err2) {
          console.error('Erro ao buscar obras:', err2);
        }
        res.render('comunicacao', { mensagens: mensagens || [], obras: obras || [] });
      });
    });
  } catch (err) {
    console.error('Erro ao carregar comunicação:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.criarMensagem = async (req, res) => {
   try {
     const { de, para, mensagem, data, obra_id } = req.body;
     db.run(`INSERT INTO mensagens (de, para, mensagem, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
       [de, para, mensagem, data, obra_id], function(err) {
       if (err) {
         console.error('Erro ao criar mensagem:', err);
         return res.status(500).json({ error: err.message });
       }
       res.redirect('/dashboard/controle-geral/comunicacao');
     });
   } catch (err) {
     console.error('Erro ao criar mensagem:', err);
     res.status(500).json({ error: 'Erro interno do servidor' });
   }
 };

// MATERIAIS POR OBRA (MySQL)
exports.materiaisObra = async (req, res) => {
  try {
    const obraId = req.params.obra_id;

    // Verificar se obra existe
    const [obra] = await mainDb.execute('SELECT * FROM obras WHERE id = ?', [obraId]);
    if (!obra[0]) {
      return res.status(404).render('error', { message: 'Obra não encontrada' });
    }

    // Buscar materiais da obra
    const [materiais] = await mainDb.execute(`
      SELECT
        mo.*,
        m.nome as material_nome,
        m.descricao,
        m.unidade,
        m.preco_unitario
      FROM materiais_obra mo
      JOIN materiais m ON mo.material_id = m.id
      WHERE mo.obra_id = ? AND mo.ativo = TRUE
      ORDER BY mo.fase_obra ASC, m.nome ASC
    `, [obraId]);

    // Buscar fases/etapas da obra
    const [etapas] = await mainDb.execute(`
      SELECT DISTINCT fase_obra
      FROM materiais_obra
      WHERE obra_id = ? AND ativo = TRUE AND fase_obra IS NOT NULL
      ORDER BY fase_obra
    `, [obraId]);

    // Buscar materiais disponíveis para adicionar
    const [materiaisDisponiveis] = await mainDb.execute(`
      SELECT id, nome, unidade, categoria
      FROM materiais
      ORDER BY nome ASC
    `);

    res.render('materiaisObra', {
      obra: obra[0],
      materiais: materiais || [],
      etapas: etapas.map(e => e.fase_obra) || [],
      materiaisDisponiveis: materiaisDisponiveis || []
    });
  } catch (err) {
    console.error('Erro ao carregar materiais da obra:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.adicionarMaterialObra = async (req, res) => {
  try {
    const obraId = req.params.obra_id;
    const { material_id, quantidade_estimada, quantidade_inicial, fase_obra, categoria, subcategoria } = req.body;

    // Verificar se já existe
    const [existe] = await mainDb.execute(
      'SELECT id FROM materiais_obra WHERE obra_id = ? AND material_id = ? AND ativo = TRUE',
      [obraId, material_id]
    );

    if (existe[0]) {
      return res.status(400).send('Material já adicionado à obra');
    }

    await mainDb.execute(`
      INSERT INTO materiais_obra
      (obra_id, material_id, quantidade_estimada, quantidade_inicial, saldo_atual, fase_obra, categoria, subcategoria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      obraId,
      material_id,
      quantidade_estimada || 0,
      quantidade_inicial || 0,
      quantidade_inicial || 0,
      fase_obra,
      categoria || null,
      subcategoria || null
    ]);

    res.redirect(`/dashboard/controle-geral/estoque/obra/${obraId}`);
  } catch (err) {
    console.error('Erro ao adicionar material à obra:', err);
    res.status(500).send('Erro interno do servidor');
  }
};

exports.editarMaterialObra = async (req, res) => {
  try {
    const { obra_id, material_obra_id } = req.params;
    const { quantidade_estimada, quantidade_inicial, fase_obra, categoria, subcategoria } = req.body;

    await mainDb.execute(`
      UPDATE materiais_obra
      SET quantidade_estimada = ?, quantidade_inicial = ?, fase_obra = ?, categoria = ?, subcategoria = ?, updated_at = NOW()
      WHERE id = ? AND obra_id = ?
    `, [
      quantidade_estimada,
      fase_obra,
      categoria || null,
      subcategoria || null,
      material_obra_id,
      obra_id
    ]);

    res.redirect(`/dashboard/controle-geral/estoque/obra/${obra_id}`);
  } catch (err) {
    console.error('Erro ao editar material da obra:', err);
    res.status(500).send('Erro interno do servidor');
  }
};

exports.removerMaterialObra = async (req, res) => {
  try {
    const { obra_id, material_obra_id } = req.params;

    await mainDb.execute(
      'UPDATE materiais_obra SET ativo = FALSE WHERE id = ? AND obra_id = ?',
      [material_obra_id, obra_id]
    );

    res.redirect(`/dashboard/controle-geral/estoque/obra/${obra_id}`);
  } catch (err) {
    console.error('Erro ao remover material da obra:', err);
    res.status(500).send('Erro interno do servidor');
  }
};

// MOVIMENTAÇÕES DE MATERIAIS NA OBRA
exports.movimentacoesObra = async (req, res) => {
  try {
    const obraId = req.params.obra_id;

    // Verificar obra
    const [obra] = await mainDb.execute('SELECT * FROM obras WHERE id = ?', [obraId]);
    if (!obra[0]) {
      return res.status(404).render('error', { message: 'Obra não encontrada' });
    }

    // Buscar movimentações
    const [movimentacoes] = await mainDb.execute(`
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
      ORDER BY mo.data_movimentacao DESC, mo.created_at DESC
    `, [obraId]);

    // Buscar materiais da obra para o dropdown
    const [materiaisObra] = await mainDb.execute(`
      SELECT
        mo.id,
        m.nome as material_nome,
        mo.fase_obra
      FROM materiais_obra mo
      JOIN materiais m ON mo.material_id = m.id
      WHERE mo.obra_id = ? AND mo.ativo = TRUE
      ORDER BY m.nome ASC
    `, [obraId]);

    res.render('movimentacoesObra', {
      obra: obra[0],
      movimentacoes: movimentacoes || [],
      materiaisObra: materiaisObra || []
    });
  } catch (err) {
    console.error('Erro ao carregar movimentações da obra:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.registrarEntradaObra = async (req, res) => {
  try {
    const obraId = req.params.obra_id;
    const { material_obra_id, quantidade, etapa_obra, motivo, documento, data_movimentacao, observacoes } = req.body;

    await mainDb.execute(`
      INSERT INTO movimentacoes_obra
      (obra_id, material_obra_id, tipo, quantidade, etapa_obra, motivo, documento, responsavel_id, data_movimentacao, observacoes)
      VALUES (?, ?, 'entrada', ?, ?, ?, ?, ?, ?, ?)
    `, [
      obraId,
      material_obra_id,
      quantidade,
      etapa_obra || null,
      motivo || 'Entrada de material na obra',
      documento || null,
      req.session.adminId,
      data_movimentacao || new Date().toISOString().split('T')[0],
      observacoes || null
    ]);

    res.redirect(`/dashboard/controle-geral/estoque/obra/${obraId}/movimentacoes`);
  } catch (err) {
    console.error('Erro ao registrar entrada na obra:', err);
    res.status(500).send('Erro interno do servidor');
  }
};

exports.registrarSaidaObra = async (req, res) => {
  try {
    const obraId = req.params.obra_id;
    const { material_obra_id, quantidade, etapa_obra, motivo, documento, data_movimentacao, observacoes } = req.body;

    await mainDb.execute(`
      INSERT INTO movimentacoes_obra
      (obra_id, material_obra_id, tipo, quantidade, etapa_obra, motivo, documento, responsavel_id, data_movimentacao, observacoes)
      VALUES (?, ?, 'saida', ?, ?, ?, ?, ?, ?, ?)
    `, [
      obraId,
      material_obra_id,
      quantidade,
      etapa_obra,
      motivo || 'Consumo na obra',
      documento || null,
      req.session.adminId,
      data_movimentacao || new Date().toISOString().split('T')[0],
      observacoes || null
    ]);

    res.redirect(`/dashboard/controle-geral/estoque/obra/${obraId}/movimentacoes`);
  } catch (err) {
    console.error('Erro ao registrar saída da obra:', err);
    res.status(500).send('Erro interno do servidor');
  }
};

// RELATÓRIOS
exports.relatorios = async (req, res) => {
  try {
    db.all(`
      SELECT r.*, o.nome as obra_nome
      FROM relatorios r
      LEFT JOIN obras o ON r.obra_id = o.id
      ORDER BY r.id DESC
    `, [], (err, relatorios) => {
      if (err) {
        console.error('Erro ao buscar relatórios:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar relatórios' });
      }
      // Buscar obras para o dropdown
      db.all('SELECT id, nome FROM obras ORDER BY nome', [], (err2, obras) => {
        if (err2) {
          console.error('Erro ao buscar obras:', err2);
        }
        res.render('relatorios', { relatorios: relatorios || [], obras: obras || [] });
      });
    });
  } catch (err) {
    console.error('Erro ao carregar relatórios:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.criarRelatorio = async (req, res) => {
   try {
     const { titulo, descricao, tipo, data, obra_id } = req.body;
     db.run(`INSERT INTO relatorios (titulo, descricao, tipo, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
       [titulo, descricao, tipo, data, obra_id], function(err) {
       if (err) {
         console.error('Erro ao criar relatório:', err);
         return res.status(500).json({ error: err.message });
       }
       res.redirect('/dashboard/controle-geral/relatorios');
     });
   } catch (err) {
     console.error('Erro ao criar relatório:', err);
     res.status(500).json({ error: 'Erro interno do servidor' });
   }
 };