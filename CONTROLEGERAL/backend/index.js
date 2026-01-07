const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend'));

// Database
const db = new sqlite3.Database('./construtora.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create tables
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
});

// Routes
app.get('/api/obras', (req, res) => {
  db.all('SELECT * FROM obras', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/obras', (req, res) => {
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

// Estoque routes
app.get('/api/materiais', (req, res) => {
  db.all('SELECT * FROM materiais', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/materiais', (req, res) => {
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

// Equipes routes
app.get('/api/funcionarios', (req, res) => {
  db.all('SELECT * FROM funcionarios', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/funcionarios', (req, res) => {
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

// Financeiro routes
app.get('/api/financeiro', (req, res) => {
  db.all('SELECT * FROM financeiro', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/financeiro', (req, res) => {
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

// Comunicação routes
app.get('/api/mensagens', (req, res) => {
  db.all('SELECT * FROM mensagens', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/mensagens', (req, res) => {
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

// Similar routes for other modules...

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});