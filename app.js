// Carrega variáveis de ambiente
require('dotenv').config();

// Core
const express = require('express');
const app = express();
const path = require('path');

// Logger
const logger = require('./src/utils/logger');

// View engine
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');

// Middlewares
const bodyParser = require('body-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');

// Database connection
const db = require('./src/database/connection');

// Middlewares
const isAuth = require('./src/middlewares/isAuth');

// Rotas
const authRoutes = require('./src/routes/authRoutes');
const { obrasRouter, materiaisRouter, funcionariosRouter, financeiroRouter, mensagensRouter, relatoriosRouter } = require('./src/routes/controleGeralRoutes');
const estoqueRoutes = require('./src/modules/estoque/routes/estoqueRoutes');

// Controladores
const controleGeralController = require('./src/controllers/controleGeralController');

// Configuração de segurança
const helmet = require('helmet');
const cors = require('cors');

// Registrar helpers globalmente
handlebars.registerHelper('eq', (a, b) => a === b);
handlebars.registerHelper('gt', (a, b) => a > b);
handlebars.registerHelper('lt', (a, b) => a < b);
handlebars.registerHelper('ne', (a, b) => a !== b);
handlebars.registerHelper('and', (a, b) => a && b);
handlebars.registerHelper('or', (a, b) => a || b);

// ---------------- VIEW ENGINE ----------------
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'src', 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'src', 'views', 'partials'),
  helpers: {
    eq: (a, b) => a === b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    ne: (a, b) => a !== b,
    and: (a, b) => a && b,
    or: (a, b) => a || b
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// ---------------- MIDDLEWARES DE SEGURANÇA ----------------
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/controle-geral', express.static(path.join(__dirname, 'CONTROLEGERAL', 'frontend')));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-secreta-muito-forte-para-sessao-2024-rp-empreendimentos',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}));

// -------- RATE LIMIT --------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== 'production'
});

app.use('/login', loginLimiter);

// -------- ROTAS --------
app.use('/', authRoutes);
app.use('/estoque', estoqueRoutes);

// -------- ROTAS CONTROLEGERAL INDIVIDUAIS --------
app.use('/api/obras', obrasRouter);
app.use('/api/materiais', materiaisRouter);
app.use('/api/funcionarios', funcionariosRouter);
app.use('/api/financeiro', financeiroRouter);
app.use('/api/mensagens', mensagensRouter);
app.use('/api/relatorios', relatoriosRouter);

// -------- ROTAS DE VISUALIZAÇÃO CONTROLEGERAL --------
app.get('/controle-geral', isAuth, controleGeralController.controleGeral);
app.get('/dashboard/controle-geral', isAuth, controleGeralController.controleGeral);
app.get('/controle-geral/obras', isAuth, controleGeralController.obras);
app.post('/controle-geral/obras', isAuth, controleGeralController.criarObra);
app.get('/dashboard/controle-geral/obras', isAuth, controleGeralController.obras);
app.post('/dashboard/controle-geral/obras', isAuth, controleGeralController.criarObra);
app.get('/dashboard/controle-geral/obras/edit/:id', isAuth, controleGeralController.editarObraPage);
app.post('/dashboard/controle-geral/obras/edit/:id', isAuth, controleGeralController.editarObra);
app.post('/dashboard/controle-geral/obras/delete/:id', isAuth, controleGeralController.excluirObra);
app.get('/controle-geral/estoque', isAuth, controleGeralController.estoque);
app.post('/controle-geral/estoque', isAuth, controleGeralController.criarMaterial);
app.get('/dashboard/controle-geral/estoque', isAuth, controleGeralController.estoque);
app.post('/dashboard/controle-geral/estoque', isAuth, controleGeralController.criarMaterial);
app.get('/dashboard/controle-geral/estoque/edit/:id', isAuth, controleGeralController.editarMaterialPage);
app.post('/dashboard/controle-geral/estoque/edit/:id', isAuth, controleGeralController.editarMaterial);
app.post('/dashboard/controle-geral/estoque/delete/:id', isAuth, controleGeralController.excluirMaterial);

// MATERIAIS POR OBRA
app.get('/dashboard/controle-geral/estoque/obra/:obra_id', isAuth, controleGeralController.materiaisObra);
app.post('/dashboard/controle-geral/estoque/obra/:obra_id/adicionar', isAuth, controleGeralController.adicionarMaterialObra);
app.post('/dashboard/controle-geral/estoque/obra/:obra_id/editar/:material_obra_id', isAuth, controleGeralController.editarMaterialObra);
app.post('/dashboard/controle-geral/estoque/obra/:obra_id/remover/:material_obra_id', isAuth, controleGeralController.removerMaterialObra);

// MOVIMENTAÇÕES DE MATERIAIS NA OBRA
app.get('/dashboard/controle-geral/estoque/obra/:obra_id/movimentacoes', isAuth, controleGeralController.movimentacoesObra);
app.post('/dashboard/controle-geral/estoque/obra/:obra_id/entrada', isAuth, controleGeralController.registrarEntradaObra);
app.post('/dashboard/controle-geral/estoque/obra/:obra_id/saida', isAuth, controleGeralController.registrarSaidaObra);
app.get('/controle-geral/equipes', isAuth, controleGeralController.equipes);
app.post('/controle-geral/equipes', isAuth, controleGeralController.criarFuncionario);
app.get('/dashboard/controle-geral/equipes', isAuth, controleGeralController.equipes);
app.post('/dashboard/controle-geral/equipes', isAuth, controleGeralController.criarFuncionario);
app.post('/dashboard/controle-geral/equipes/edit', isAuth, controleGeralController.editarFuncionario);
app.get('/controle-geral/financeiro', isAuth, controleGeralController.financeiro);
app.post('/controle-geral/financeiro', isAuth, controleGeralController.criarFinanceiro);
app.get('/dashboard/controle-geral/financeiro', isAuth, controleGeralController.financeiro);
app.post('/dashboard/controle-geral/financeiro', isAuth, controleGeralController.criarFinanceiro);
app.get('/controle-geral/comunicacao', isAuth, controleGeralController.comunicacao);
app.post('/controle-geral/comunicacao', isAuth, controleGeralController.criarMensagem);
app.get('/dashboard/controle-geral/comunicacao', isAuth, controleGeralController.comunicacao);
app.post('/dashboard/controle-geral/comunicacao', isAuth, controleGeralController.criarMensagem);
app.get('/controle-geral/relatorios', isAuth, controleGeralController.relatorios);
app.post('/controle-geral/relatorios', isAuth, controleGeralController.criarRelatorio);
app.get('/dashboard/controle-geral/relatorios', isAuth, controleGeralController.relatorios);
app.post('/dashboard/controle-geral/relatorios', isAuth, controleGeralController.criarRelatorio);

// -------- TRATAMENTO DE ERROS 404 --------
app.use((req, res) => {
  res.status(404).render('error', {
    status: 404,
    message: 'Página não encontrada',
    error: 'A página que você está procurando não existe.'
  });
});

// -------- TRATAMENTO DE ERROS GLOBAL --------
app.use((err, req, res, next) => {
   logger.error('Erro interno do servidor', err.message);
   res.status(500).json({
     error: 'Erro interno do servidor',
     status: 500,
     message: process.env.NODE_ENV === 'development' ? err.message : null
   });
});



// -------- SERVER --------
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  logger.info(`Servidor rodando na porta ${PORT} (host: ${HOST})`);
  logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
