// Carrega variáveis de ambiente
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

// Core
const express = require('express');
const app = express();

// Logger
const logger = require('./utils/logger');

// View engine
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');

// Middlewares
const bodyParser = require('body-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Middleware para forçar charset UTF-8 em todas as respostas
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

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
    eq: function(a, b) { return a === b; },
    gt: function(a, b) { return a > b; },
    lt: function(a, b) { return a < b; },
    ne: function(a, b) { return a !== b; },
    // Helper para escapar strings para atributos HTML (data-*)
    escapeAttr: function(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    math: function(lvalue, operator, rvalue) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
      switch(operator) {
        case '+': return lvalue + rvalue;
        case '-': return lvalue - rvalue;
        case '*': return lvalue * rvalue;
        case '/': return lvalue / rvalue;
        default: return 0;
      }
    }
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// ---------------- MIDDLEWARES DE SEGURANÇA ----------------
// Helmet com CSP configurado para permitir CDNs e scripts inline necessários
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'script-src-attr': ["'unsafe-inline'"],
      'script-src': ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Necessário para carregar recursos de CDNs
}));
app.set('trust proxy', 1); // Fix for rate limit behind proxy
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
  credentials: true
}));

// Compressão gzip
app.use(compression());

app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0 }));
app.use('/controle-geral', express.static(path.join(__dirname, '..', 'CONTROLEGERAL', 'frontend'), { maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0 }));
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
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== 'production'
});

app.use('/login', loginLimiter);

// -------- ROTAS --------
const router = require('./router');
app.use(router);

// -------- TRATAMENTO DE ERROS 404 --------
app.use((req, res) => {
  res.status(404).render('error', {
    status: 404,
    message: 'Página não encontrada',
    error: 'A página que você está procurando não existe.',
    layout: false
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

// Criar servidor apenas uma vez
const server = app.listen(PORT, HOST, () => {
  console.log(`[LOG] Servidor rodando na porta ${PORT} (host: ${HOST})`);
  logger.info(`Servidor rodando na porta ${PORT} (host: ${HOST})`);
  logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Tratamento de erro do servidor - CRÍTICO para PM2
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERRO] Porta ${PORT} já está em uso. Encerrando processo.`);
    logger.error(`Porta ${PORT} já está em uso. Encerrando processo.`);
    process.exit(1); // PM2 detecta e não entra em loop
  } else {
    console.error(`[ERRO] Erro no servidor: ${err.message}`);
    logger.error(`Erro no servidor: ${err.message}`);
    process.exit(1);
  }
});

// Graceful shutdown para PM2
const gracefulShutdown = (signal) => {
  console.log(`[LOG] Recebido ${signal}. Encerrando servidor gracefully...`);
  logger.info(`Recebido ${signal}. Encerrando servidor gracefully...`);
  
  server.close(() => {
    console.log('[LOG] Servidor encerrado com sucesso');
    logger.info('Servidor encerrado com sucesso');
    process.exit(0);
  });
  
  // Fallback: encerrar após 10 segundos se graceful shutdown falhar
  setTimeout(() => {
    console.error('[ERRO] Não foi possível encerrar gracefully. Forçando encerramento.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));