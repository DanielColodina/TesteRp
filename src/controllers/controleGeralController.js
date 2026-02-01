// const Database = require('better-sqlite3');
const path = require('path');
const mysql = require('mysql2/promise');

// Database CONTROLEGERAL - Desabilitado para Render
// const dbPath = path.join(__dirname, '../../CONTROLEGERAL/backend/construtora.db');
// let db;
// try {
//  db = new Database(dbPath);
//  console.log('✅ Conectado ao banco CONTROLEGERAL');
// } catch (err) {
//  console.error('Erro ao conectar ao banco CONTROLEGERAL:', err.message);
// }
// Main database for obras
const mainDb = require('../database/connection');

const db = mainDb;

// controle Geral
exports.controleGeral = async (req, res) => {
  try {
    res.render('controlegeral');
  } catch (err) {
    console.error('Erro ao carregar controle Geral:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// OBRAS
exports.obras = async (req, res) => {
  try {
    const [obras] = await db.execute('SELECT * FROM obras ORDER BY id DESC');
    res.render('obrasControle', { obras: obras || [] });
  } catch (err) {
    console.error('Erro ao carregar obras:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.criarObra = async (req, res) => {
  try {
    const { nome, endereco, cliente, orcamento, data_inicio, data_fim, status } = req.body;
    await db.execute(`INSERT INTO obras (nome, endereco, cliente, orcamento, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?, ?, ?)`, [nome, endereco, cliente, orcamento, data_inicio, data_fim, status]);
    res.redirect('/dashboard/controle Geral/obras');
  } catch (err) {
    console.error('Erro ao criar obra:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.editarObraPage = async (req, res) => {
  try {
    const { id } = req.params;
    const [obra] = await db.execute('SELECT * FROM obras WHERE id = ?', [id]);
    if (!obra[0]) {
      return res.status(404).render('error', { message: 'Obra não encontrada' });
    }
    res.render('editObra', { obra: obra[0] });
  } catch (err) {
    console.error('Erro ao carregar página de edição:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.editarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, endereco, cliente, orcamento, data_inicio, data_fim, status } = req.body;
    await db.execute(`UPDATE obras SET nome = ?, endereco = ?, cliente = ?, orcamento = ?, data_inicio = ?, data_fim = ?, status = ? WHERE id = ?`, [nome, endereco, cliente, orcamento, data_inicio, data_fim, status, id]);
    res.redirect('/dashboard/controle Geral/obras');
  } catch (err) {
    console.error('Erro ao editar obra:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.excluirObra = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM obras WHERE id = ?', [id]);
    res.redirect('/dashboard/controle Geral/obras');
  } catch (err) {
    console.error('Erro ao excluir obra:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// ESTOQUE
exports.estoque = async (req, res) => {
  try {
    const [materiais] = await db.execute(`
      SELECT m.*, o.nome_obra as obra_nome
      FROM materiais_construtora m
      LEFT JOIN obras o ON o.id = m.obra_id
      ORDER BY m.id DESC
    `);
    // Buscar obras para o dropdown
    const [obras] = await db.execute('SELECT id, nome_obra as nome FROM obras ORDER BY nome_obra');
    res.render('estoque', { materiais: materiais || [], obras: obras || [] });
  } catch (err) {
    console.error('Erro ao carregar estoque:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.criarMaterial = async (req, res) => {
  try {
    const { codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo, obra_id } = req.body;
    
    // Gera código automático se não fornecido
    const codigoFinal = codigo || 'MAT-' + Date.now();
    
    const params = [
      codigoFinal,
      descricao === undefined || descricao === '' ? null : descricao,
      unidade === undefined || unidade === '' ? null : unidade,
      quantidade === undefined || quantidade === '' ? null : parseFloat(quantidade),
      preco_medio === undefined || preco_medio === '' ? null : parseFloat(preco_medio),
      estoque_minimo === undefined || estoque_minimo === '' ? null : parseFloat(estoque_minimo),
      obra_id === undefined || obra_id === '' ? null : parseInt(obra_id)
    ];
    
    // Usa a tabela materiais_construtora que tem as colunas: codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo, obra_id
    await db.execute(`INSERT INTO materiais_construtora (codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo, obra_id) VALUES (?, ?, ?, ?, ?, ?, ?)`, params);
    res.redirect('/dashboard/controle-geral/estoque');
  } catch (err) {
    console.error('Erro ao criar material:', err);
    res.status(500).json({ error: 'Erro ao criar material: ' + err.message });
  }
};

exports.editarMaterialPage = async (req, res) => {
  try {
    const { id } = req.params;
    const [material] = await db.execute('SELECT * FROM materiais_construtora WHERE id = ?', [id]);
    if (!material[0]) {
      return res.status(404).render('error', { message: 'Material não encontrado' });
    }
    // Buscar obras para o dropdown
    const [obras] = await db.execute('SELECT id, nome_obra as nome FROM obras ORDER BY nome_obra');
    res.render('editMaterial', { material: material[0], obras: obras || [] });
  } catch (err) {
    console.error('Erro ao carregar página de edição:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.editarMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, descricao, unidade, preco_medio, estoque_minimo, obra_id } = req.body;
    const params = [
      codigo || null,
      descricao || null,
      unidade || null,
      preco_medio ? parseFloat(preco_medio) : null,
      estoque_minimo ? parseFloat(estoque_minimo) : null,
      obra_id ? parseInt(obra_id) : null,
      id
    ];
    await db.execute(`UPDATE materiais_construtora SET codigo = ?, descricao = ?, unidade = ?, preco_medio = ?, estoque_minimo = ?, obra_id = ? WHERE id = ?`, params);
    res.redirect('/dashboard/controle-geral/estoque');
  } catch (err) {
    console.error('Erro ao editar material:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.excluirMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM materiais_construtora WHERE id = ?', [id]);
    res.redirect('/dashboard/controle-geral/estoque');
  } catch (err) {
    console.error('Erro ao excluir material:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// Materiais por obra
exports.materiaisObra = async (req, res) => {
  try {
    const { obra_id } = req.params;
    // A tabela materiais não tem obra_id, lista todos
    const [materiais] = await db.execute('SELECT * FROM materiais ORDER BY descricao');
    res.render('materiaisObra', { materiais: materiais || [], obra_id });
  } catch (err) {
    console.error('Erro ao carregar materiais da obra:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.adicionarMaterialObra = async (req, res) => {
  try {
    const { obra_id } = req.params;
    const { material_id, quantidade_estimada, quantidade_inicial, fase_obra, categoria } = req.body;
    
    // Inserir na tabela materiais_obra com todos os campos necessários
    await db.execute(
      `INSERT INTO materiais_obra (obra_id, material_id, quantidade_estimada, quantidade_inicial, saldo_atual, fase_obra, categoria, ativo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [obra_id, material_id, quantidade_estimada || 0, quantidade_inicial || 0, quantidade_inicial || 0, fase_obra || null, categoria || null]
    );
    res.redirect('/rotascompletas');
  } catch (err) {
    console.error('Erro ao adicionar material à obra:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.editarMaterialObra = async (req, res) => {
  try {
    const { obra_id, material_obra_id } = req.params;
    const { quantidade_estimada, quantidade_inicial, saldo_atual, fase_obra, categoria } = req.body;
    
    await db.execute(
      `UPDATE materiais_obra 
       SET quantidade_estimada = ?, quantidade_inicial = ?, saldo_atual = ?, fase_obra = ?, categoria = ?, updated_at = NOW() 
       WHERE id = ? AND obra_id = ?`,
      [quantidade_estimada || 0, quantidade_inicial || 0, saldo_atual || 0, fase_obra || null, categoria || null, material_obra_id, obra_id]
    );
    res.redirect('/rotascompletas');
  } catch (err) {
    console.error('Erro ao editar material da obra:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.removerMaterialObra = async (req, res) => {
  try {
    const { obra_id, material_obra_id } = req.params;
    // Usar UPDATE com ativo = FALSE em vez de DELETE
    await db.execute('UPDATE materiais_obra SET ativo = FALSE WHERE id = ? AND obra_id = ?', [material_obra_id, obra_id]);
    res.redirect('/rotascompletas');
  } catch (err) {
    console.error('Erro ao remover material da obra:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// Movimentações de materiais na obra
exports.movimentacoesObra = async (req, res) => {
  try {
    const { obra_id } = req.params;
    const [movimentacoes] = await db.execute('SELECT * FROM estoque_movimentacoes WHERE obra_id = ? ORDER BY data DESC', [obra_id]);
    res.render('movimentacoesObra', { movimentacoes: movimentacoes || [], obra_id });
  } catch (err) {
    console.error('Erro ao carregar movimentações:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.registrarEntradaObra = async (req, res) => {
  try {
    const { obra_id } = req.params;
    const { material_obra_id, quantidade, observacao } = req.body;
    
    // Registrar movimentação
    await db.execute('INSERT INTO estoque_movimentacoes (obra_id, material_obra_id, tipo, quantidade, observacao) VALUES (?, ?, ?, ?, ?)', 
      [obra_id, material_obra_id, 'entrada', quantidade, observacao]);
    
    // Atualizar saldo do material na obra
    await db.execute('UPDATE materiais_obra SET saldo_atual = saldo_atual + ?, updated_at = NOW() WHERE id = ? AND obra_id = ?', 
      [quantidade, material_obra_id, obra_id]);
    
    res.redirect('/rotascompletas');
  } catch (err) {
    console.error('Erro ao registrar entrada:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

exports.registrarSaidaObra = async (req, res) => {
  try {
    const { obra_id } = req.params;
    const { material_obra_id, quantidade, observacao } = req.body;
    
    // Verificar saldo suficiente
    const [material] = await db.execute('SELECT saldo_atual FROM materiais_obra WHERE id = ? AND obra_id = ?', [material_obra_id, obra_id]);
    if (material[0] && material[0].saldo_atual < quantidade) {
      return res.status(400).send('Saldo insuficiente para esta saída');
    }
    
    // Registrar movimentação
    await db.execute('INSERT INTO estoque_movimentacoes (obra_id, material_obra_id, tipo, quantidade, observacao) VALUES (?, ?, ?, ?, ?)', 
      [obra_id, material_obra_id, 'saida', quantidade, observacao]);
    
    // Atualizar saldo do material na obra
    await db.execute('UPDATE materiais_obra SET saldo_atual = saldo_atual - ?, updated_at = NOW() WHERE id = ? AND obra_id = ?', 
      [quantidade, material_obra_id, obra_id]);
    
    res.redirect('/rotascompletas');
  } catch (err) {
    console.error('Erro ao registrar saída:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// EQUIPES
exports.equipes = async (req, res) => {
  try {
    const [funcionarios] = await db.execute('SELECT f.*, o.nome_obra as obra_nome FROM funcionarios f LEFT JOIN obras o ON o.id = f.obra_id ORDER BY f.id DESC');
    const [obras] = await db.execute('SELECT id, nome_obra as nome FROM obras ORDER BY nome_obra');
    res.render('equipes', { funcionarios: funcionarios || [], obras: obras || [] });
  } catch (err) {
    console.error('Erro ao carregar equipes:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// Criar funcionário
exports.criarFuncionario = async (req, res) => {
  try {
    const { nome, funcao, salario, obra_id } = req.body;
    await db.execute(`INSERT INTO funcionarios (nome, funcao, salario, obra_id) VALUES (?, ?, ?, ?)`, 
      [nome, funcao, salario, obra_id || null]);
    res.redirect('/rotascompletas');
  } catch (err) {
    console.error('Erro ao criar funcionário:', err);
    res.status(500).json({ error: 'Erro ao criar funcionário: ' + err.message });
  }
};

// Atualizar funcionário
exports.editarFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, funcao, salario, obra_id } = req.body;
    await db.execute(`UPDATE funcionarios SET nome = ?, funcao = ?, salario = ?, obra_id = ? WHERE id = ?`, 
      [nome, funcao, salario, obra_id || null, id]);
    res.redirect('/rotascompletas');
  } catch (err) {
    console.error('Erro ao editar funcionário:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// Excluir funcionário
exports.excluirFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM funcionarios WHERE id = ?', [id]);
    res.redirect('/rotascompletas');
  } catch (err) {
    console.error('Erro ao excluir funcionário:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// FINANCEIRO
exports.financeiro = async (req, res) => {
  try {
    // Buscar obras para o dropdown
    const [obras] = await db.execute('SELECT id, nome_obra as nome FROM obras ORDER BY nome_obra');
    const obra_id = req.query.obra_id || null;
    res.render('financeiro', { obras: obras || [], obra_id });
  } catch (err) {
    console.error('Erro ao carregar financeiro:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// Criar transação financeira
exports.criarFinanceiro = async (req, res) => {
  try {
    const { tipo, descricao, valor, data, obra_id } = req.body;
    
    await db.execute(
      `INSERT INTO financeiro (tipo, descricao, valor, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
      [tipo, descricao, valor, data, obra_id || null]
    );
    
    res.redirect('/rotascompletas');
  } catch (err) {
    console.error('Erro ao criar transação financeira:', err);
    res.status(500).json({ error: 'Erro ao criar transação: ' + err.message });
  }
};

// COMUNICAÇÃO
exports.comunicacao = async (req, res) => {
  try {
    res.render('comunicacao');
  } catch (err) {
    console.error('Erro ao carregar comunicação:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};

// RELATÓRIOS
exports.relatorios = async (req, res) => {
  try {
    res.render('relatorios');
  } catch (err) {
    console.error('Erro ao carregar relatórios:', err);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
};
