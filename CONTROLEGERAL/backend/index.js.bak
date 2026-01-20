const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend'));

//  CONFIGURAÇÃO DO BANCO - AIVEN MYSQL
const dbConfig = {
  host: process.env.DB_HOST || 'mysql-d6dcdc4-rpempreendimentos.j.aivencloud.com',
  port: process.env.DB_PORT || 17567,
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'defaultdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  ssl: {
    rejectUnauthorized: true  // SSL OBRIGATÓRIO para Aiven
  }
};

// Criar pool de conexões
const db = mysql.createPool(dbConfig);

// Testar conexão ao iniciar
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Conectado ao MySQL (Aiven) com sucesso!');
    console.log(`📊 Banco: ${dbConfig.database}`);
    console.log(`🌐 Host: ${dbConfig.host}`);
    connection.release();
  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err.message);
    console.error('Verifique as credenciais do Aiven!');
  }
})();

// ==================== ROTAS ====================

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ API RP Empreendimentos funcionando!',
    database: 'Aiven MySQL',
    status: 'online'
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// ==================== OBRAS ====================

app.get('/api/obras', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM obras_construtora');
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /api/obras:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/obras', async (req, res) => {
  const { nome, endereco, cliente, orcamento, data_inicio, data_fim, status } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO obras_construtora (nome, endereco, cliente, orcamento, data_inicio, data_fim, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, endereco, cliente, orcamento, data_inicio, data_fim, status]
    );
    res.json({ id: result.insertId, message: 'Obra cadastrada com sucesso!' });
  } catch (err) {
    console.error('Erro em POST /api/obras:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==================== MATERIAIS ====================

app.get('/api/materiais', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM materiais_construtora');
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /api/materiais:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/materiais', async (req, res) => {
  const { codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO materiais_construtora (codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [codigo, descricao, unidade, quantidade, preco_medio, estoque_minimo]
    );
    res.json({ id: result.insertId, message: 'Material cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro em POST /api/materiais:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==================== FUNCIONÁRIOS ====================

app.get('/api/funcionarios', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM funcionarios');
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /api/funcionarios:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/funcionarios', async (req, res) => {
  const { nome, funcao, salario } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO funcionarios (nome, funcao, salario) VALUES (?, ?, ?)`,
      [nome, funcao, salario]
    );
    res.json({ id: result.insertId, message: 'Funcionário cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro em POST /api/funcionarios:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==================== FINANCEIRO ====================

app.get('/api/financeiro', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM financeiro');
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /api/financeiro:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/financeiro', async (req, res) => {
  const { tipo, descricao, valor, data, obra_id } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO financeiro (tipo, descricao, valor, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
      [tipo, descricao, valor, data, obra_id]
    );
    res.json({ id: result.insertId, message: 'Registro financeiro cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro em POST /api/financeiro:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==================== MENSAGENS ====================

app.get('/api/mensagens', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM mensagens ORDER BY data DESC');
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /api/mensagens:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mensagens', async (req, res) => {
  const { de, para, mensagem, data, obra_id } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO mensagens (de, para, mensagem, data, obra_id) VALUES (?, ?, ?, ?, ?)`,
      [de, para, mensagem, data, obra_id]
    );
    res.json({ id: result.insertId, message: 'Mensagem enviada com sucesso!' });
  } catch (err) {
    console.error('Erro em POST /api/mensagens:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});