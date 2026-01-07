// Rotas para o sistema CONTROLEGERAL
const express = require('express');
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

// Middleware de autenticação
const isAuth = require('../middlewares/isAuth');

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS obras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    endereco TEXT,
    cliente TEXT,
    orcamento REAL,
    data_inicio TEXT,
    data_fim TEXT,
    status TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS materiais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT,
    descricao TEXT,
    unidade TEXT,
    quantidade REAL,
    preco_medio REAL,
    estoque_minimo REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    funcao TEXT,
    salario REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS financeiro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT,
    descricao TEXT,
    valor REAL,
    data TEXT,
    obra_id INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS mensagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    de TEXT,
    para TEXT,
    mensagem TEXT,
    data TEXT,
    obra_id INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS relatorios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    descricao TEXT,
    tipo TEXT,
    data TEXT,
    obra_id INTEGER
  )`);
});

// Routes individuais para cada módulo

// OBRAS
const obrasRouter = express.Router();
obrasRouter.get('/', isAuth, (req, res) => {
  db.all('SELECT * FROM obras', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

obrasRouter.post('/', isAuth, (req, res) => {
  const { nome, endereco, cliente, orcamento, data_inicio, data_fim, status } = req.body;
  db.run(`INSERT INTO obras (nome, endereco, cliente, orcamento, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nome, endereco, cliente, orcamento, data_inicio, data_fim, status], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// MATERIAIS
const materiaisRouter = express.Router();
materiaisRouter.get('/', isAuth, (req, res) => {
  db.all('SELECT * FROM materiais', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

materiaisRouter.post('/', isAuth, (req, res) => {
  const { codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo } = req.body;
  db.run(`INSERT INTO materiais (codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo) VALUES (?, ?, ?, ?, ?, ?)`,
    [codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// FUNCIONARIOS
const funcionariosRouter = express.Router();
funcionariosRouter.get('/', isAuth, (req, res) => {
  db.all('SELECT * FROM funcionarios', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

funcionariosRouter.post('/', isAuth, (req, res) => {
  const { nome, funcao, salario } = req.body;
  db.run(`INSERT INTO funcionarios (nome, funcao, salario) VALUES (?, ?, ?)`,
    [nome, funcao, salario], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// FINANCEIRO
const financeiroRouter = express.Router();
financeiroRouter.get('/', isAuth, (req, res) => {
  db.all('SELECT * FROM financeiro', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

financeiroRouter.post('/', isAuth, (req, res) => {
  const { tipo, descricao, valor, data, obra_id } = req.body;
  db.run(`INSERT INTO financeiro (tipo, descricao, valor, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
    [tipo, descricao, valor, data, obra_id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// MENSAGENS
const mensagensRouter = express.Router();
mensagensRouter.get('/', isAuth, (req, res) => {
  db.all('SELECT * FROM mensagens', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

mensagensRouter.post('/', isAuth, (req, res) => {
  const { de, para, mensagem, data, obra_id } = req.body;
  db.run(`INSERT INTO mensagens (de, para, mensagem, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
    [de, para, mensagem, data, obra_id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// RELATORIOS
const relatoriosRouter = express.Router();
relatoriosRouter.get('/', isAuth, (req, res) => {
  db.all('SELECT * FROM relatorios', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

relatoriosRouter.post('/', isAuth, (req, res) => {
  const { titulo, descricao, tipo, data, obra_id } = req.body;
  db.run(`INSERT INTO relatorios (titulo, descricao, tipo, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
    [titulo, descricao, tipo, data, obra_id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
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