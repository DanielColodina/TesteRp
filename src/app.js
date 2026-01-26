// Carrega variáveis de ambiente
require('dotenv').config();

// Core
const express = require('express');
const app = express();
const path = require('path');

// Logger
const logger = require('./utils/logger');

// View engine
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');

// Middlewares
const bodyParser = require('body-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');

// Database connection
const db = require('./database/connection');

// Configuração de segurança
const helmet = require('helmet');
const cors = require('cors');

// ---------------- VIEW ENGINE ----------------
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
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
app.set('views', path.join(__dirname, 'views'));

// ---------------- MIDDLEWARES DE SEGURANÇA ----------------
app.use(helmet());
app.set('trust proxy', 1); // Fix for rate limit behind proxy
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
  credentials: true
}));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/controle-geral', express.static(path.join(__dirname, '..', 'CONTROLEGERAL', 'frontend')));
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
  max: 17, // Máximo 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== 'production'
});

app.use('/login', loginLimiter);

// -------- ROTAS --------
app.use(require('./router'));

// -------- TRATAMENTO DE ERROS 404 --------
app.use((req, res) => {
  res.status(404).render('error', {
    status: 404,
    message: 'Página não encontrada',
    error: 'A página que você está procurando não existe.'
  }, { layout: false });
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
console.log(`[LOG] Tentando iniciar servidor na porta ${PORT}, host ${HOST}`);
app.listen(PORT, HOST, () => {
  console.log(`[LOG] Servidor rodando na porta ${PORT} (host: ${HOST})`);
  logger.info(`Servidor rodando na porta ${PORT} (host: ${HOST})`);
  logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err) => {
  console.error(`[LOG] Erro ao iniciar servidor: ${err.message}`);
});