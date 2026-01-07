const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database CONTROLEGERAL
const dbPath = path.join(__dirname, '../../CONTROLEGERAL/backend/construtora.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco CONTROLEGERAL:', err.message);
  } else {
    console.log('✅ Conectado ao banco CONTROLEGERAL');
  }
});

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

// ESTOQUE
exports.estoque = async (req, res) => {
  try {
    db.all('SELECT * FROM materiais ORDER BY id DESC', [], (err, materiais) => {
      if (err) {
        console.error('Erro ao buscar materiais:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar materiais' });
      }
      res.render('estoque', { materiais: materiais || [] });
    });
  } catch (err) {
    console.error('Erro ao carregar estoque:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.criarMaterial = async (req, res) => {
   try {
     const { codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo } = req.body;
     db.run(`INSERT INTO materiais (codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo) VALUES (?, ?, ?, ?, ?, ?)`,
       [codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo], function(err) {
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

// EQUIPES
exports.equipes = async (req, res) => {
  try {
    db.all('SELECT * FROM funcionarios ORDER BY id DESC', [], (err, funcionarios) => {
      if (err) {
        console.error('Erro ao buscar funcionários:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar funcionários' });
      }
      res.render('equipes', { funcionarios: funcionarios || [] });
    });
  } catch (err) {
    console.error('Erro ao carregar equipes:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.criarFuncionario = async (req, res) => {
   try {
     const { nome, funcao, salario } = req.body;
     db.run(`INSERT INTO funcionarios (nome, funcao, salario) VALUES (?, ?, ?)`,
       [nome, funcao, salario], function(err) {
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

// FINANCEIRO
exports.financeiro = async (req, res) => {
  try {
    db.all('SELECT * FROM financeiro ORDER BY id DESC', [], (err, financeiro) => {
      if (err) {
        console.error('Erro ao buscar financeiro:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar financeiro' });
      }
      res.render('financeiro', { financeiro: financeiro || [] });
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
    db.all('SELECT * FROM mensagens ORDER BY id DESC', [], (err, mensagens) => {
      if (err) {
        console.error('Erro ao buscar mensagens:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar mensagens' });
      }
      res.render('comunicacao', { mensagens: mensagens || [] });
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

// RELATÓRIOS
exports.relatorios = async (req, res) => {
  try {
    db.all('SELECT * FROM relatorios ORDER BY id DESC', [], (err, relatorios) => {
      if (err) {
        console.error('Erro ao buscar relatórios:', err);
        return res.status(500).render('error', { message: 'Erro ao carregar relatórios' });
      }
      res.render('relatorios', { relatorios: relatorios || [] });
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