// Rotas para o sistema CONTROLEGERAL
const express = require('express');

// Database MySQL consolidado
const db = require('../database/connection');

// Middleware de autenticação
const isAuth = require('../middlewares/isAuth');

// Routes individuais para cada módulo

// OBRAS
const obrasRouter = express.Router();
obrasRouter.get('/', isAuth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM obras_construtora');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

obrasRouter.post('/', isAuth, async (req, res) => {
  const { nome, endereco, cliente, orcamento, data_inicio, data_fim, status } = req.body;
  try {
    const [result] = await db.execute(`INSERT INTO obras_construtora (nome, endereco, cliente, orcamento, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, endereco, cliente, orcamento, data_inicio, data_fim, status]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MATERIAIS
const materiaisRouter = express.Router();
materiaisRouter.get('/', isAuth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM materiais_construtora');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

materiaisRouter.post('/', isAuth, async (req, res) => {
  const { codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo, obra_id } = req.body;
  try {
    const [result] = await db.execute(`INSERT INTO materiais_construtora (codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo) VALUES (?, ?, ?, ?, ?, ?)`,
      [codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FUNCIONARIOS
const funcionariosRouter = express.Router();
funcionariosRouter.get('/', isAuth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM funcionarios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

funcionariosRouter.post('/', isAuth, async (req, res) => {
  const { nome, funcao, salario } = req.body;
  try {
    const [result] = await db.execute(`INSERT INTO funcionarios (nome, funcao, salario) VALUES (?, ?, ?)`,
      [nome, funcao, salario]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FINANCEIRO
const financeiroRouter = express.Router();
financeiroRouter.get('/', isAuth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM financeiro');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

financeiroRouter.post('/', isAuth, async (req, res) => {
  const { tipo, descricao, valor, data, obra_id } = req.body;
  try {
    const [result] = await db.execute(`INSERT INTO financeiro (tipo, descricao, valor, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
      [tipo, descricao, valor, data, obra_id]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MENSAGENS
const mensagensRouter = express.Router();
mensagensRouter.get('/', isAuth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM mensagens');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mensagensRouter.post('/', isAuth, async (req, res) => {
  const { de, para, mensagem, data, obra_id } = req.body;
  try {
    const [result] = await db.execute(`INSERT INTO mensagens (de, para, mensagem, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
      [de, para, mensagem, data, obra_id]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RELATORIOS
const relatoriosRouter = express.Router();
relatoriosRouter.get('/', isAuth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM relatorios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

relatoriosRouter.post('/', isAuth, async (req, res) => {
  const { titulo, descricao, tipo, data, obra_id } = req.body;
  try {
    const [result] = await db.execute(`INSERT INTO relatorios (titulo, descricao, tipo, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
      [titulo, descricao, tipo, data, obra_id]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exportar routers individuais
module.exports = {
  obrasRouter,
  materiaisRouter,
  funcionariosRouter,
  financeiroRouter,
  mensagensRouter,
  relatoriosRouter
};