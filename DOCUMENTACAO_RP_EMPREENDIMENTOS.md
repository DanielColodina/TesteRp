# DOCUMENTAÇÃO TÉCNICA COMPLETA - RP EMPREENDIMENTOS

## Sistema de Gestão de Obras

---

# 1️⃣ VISÃO GERAL DO SISTEMA

## Nome do Sistema
**RP Empreendimentos - Sistema de Gestão de Obras**

## Objetivo
O sistema é uma plataforma web corporativa destinada ao gerenciamento completo de empreendimentos e obras de construção civil. Ele permite que administradores controlem clientes, obras, documentos regulamentares (checklists), materiais de construção, equipes de trabalho e finanças.

## Problema que Resolve
- **Falta de controle centralizado**: Unifica informações de múltiplas obras em um único sistema
- **Dificuldade no acompanhamento documental**: Controla o status de licenças e documentos necessários para cada obra
- **Desorganização financeira**: Permite registrar entradas e saídas de materiais e dinheiro por obra
- **Ausência de rastreabilidade**: Mantém histórico e auditoria de todas as alterações realizadas

## Público-alvo
- **Administradores da construtora**: Usuários master que gerenciam todo o sistema
- **Gerentes de obra**: Acompanham progresso e gerenciam equipes
- **Equipe administrativa**: Controlam estoque, financeiro e relatórios

## Fluxo Geral do Sistema
1. **Autenticação**: Usuário acessa a página de login e insere credenciais
2. **Sessão**: Sistema cria sessão autenticada com token de segurança
3. **Dashboard**: Usuário vê visão geral com estatísticas e obras recentes
4. **Gerenciamento**: Executa operações CRUD (Create, Read, Update, Delete) em obras, usuários, materiais
5. **Checklist**: Acompanha status de documentos regulamentares de cada obra
6. **Estoque**: Controla entrada/saída de materiais por obra
7. **Financeiro**: Registra transações financeiras vinculadas às obras

## Tecnologias Usadas e Justificativa

### Backend
| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Node.js** | 18.x | Runtime JavaScript moderno, assíncrono e escalável |
| **Express** | 4.18.2 | Framework minimalista, flexível e popular para APIs |
| **Express-Handlebars** | 4.0.0 | Template engine server-side para renderização de views |
| **MySQL2** | 3.16.0 | Driver MySQL com suporte a promises e pooling |
| **Express-Session** | 1.18.2 | Gerenciamento de sessões de usuário |
| **Bcrypt** | 6.0.0 | Criptografia de senhas com salt automático |
| **Helmet** | 7.2.0 | Middleware de segurança HTTP |
| **Cors** | 2.8.5 | Controle de acesso entre origens |
| **Dotenv** | 17.2.3 | Variáveis de ambiente |
| **PM2** | 6.0.14 | Gerenciador de processos para produção |

### Frontend
| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **HTML5** | - | Linguagem de marcação semântica |
| **CSS3** | - | Estilização com animações e layout responsivo |
| **JavaScript (Vanilla)** | ES6+ | Interatividade sem dependências pesadas |
| **Font Awesome** | 6.4.0 | Ícones vetoriais |

---

# 2️⃣ ARQUITETURA E PADRÕES

## Tipo de Arquitetura
**MVC (Model-View-Controller)** com elementos de **Service Layer**

O sistema segue o padrão MVC clássico do Express.js:
- **Models**: Abstração do banco de dados
- **Views**: Templates Handlebars server-side rendered
- **Controllers**: Lógica de negócio e orquestração

## Organização do Projeto
```
src/
├── app.js                 # Entry point principal
├── router.js              # Configuração de rotas principais
├── controllers/           # Lógica de controle (handlers)
├── models/                # Abstração de dados
├── routes/               # Definição de rotas
├── middlewares/          # Middlewares de autenticação
├── database/            # Conexão com MySQL
├── utils/               # Utilitários (logger)
├── modules/             # Módulos independentes (estoque)
└── views/              # Templates Handlebars
```

## Responsabilidade de Cada Camada

### Controllers (`src/controllers/`)
Responsáveis por:
- Receber requisições HTTP
- Validar entrada de dados
- Chamar models e services
- Formatar respostas
- Tratar erros

### Models (`src/models/`)
Responsáveis por:
- Abstração das queries SQL
- Validação de dados
- Tratamento de erros de banco
- Fallbacks para tabelas inexistentes

### Routes (`src/routes/`)
Responsáveis por:
- Mapeamento HTTP method + endpoint → controller function
- Middlewares específicos de rota
- Documentação implícita via código

### Middlewares (`src/middlewares/`)
Responsáveis por:
- Verificação de autenticação
- Logging de requisições
- Tratamento de erros

## Padrões Utilizados

### 1. Service/Repository Pattern (Implícito)
- Models funcionam como repositories
- Controllers orquestram múltiplos models
- Business logic isolada nos controllers

### 2. Repository Pattern (Data Access)
```javascript
// Cada model封装 operações de banco
exports.findByEmail = async (email) => { /* ... */ }
exports.create = async (nome, email) => { /* ... */ }
```

### 3. Middleware Pattern
```javascript
// Middleware de autenticação
module.exports = function isAuth(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    }
    return res.redirect('/login');
};
```

### 4. Template Engine Pattern
```javascript
// Express-Handlebars para renderização server-side
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
```

---

# 3️⃣ ESTRUTURA REAL DE PASTAS E ARQUIVOS

## Hierarquia Completa

```
Rp-Emppreendimentos/
├── .gitignore
├── README.md
├── fluxograma.excalidraw         # Diagrama de arquitetura
│
├── src/                           # Código fonte principal
│   ├── app.js                     # Entry point do Express
│   ├── router.js                  # Router principal
│   ├── package.json               # Dependências e scripts
│   │
│   ├── controllers/               # Controladores
│   │   ├── authController.js      # Login e sessão
│   │   ├── controleGeralController.js  # CRUD completo controle
│   │   ├── dashboardController.js  # Dashboard e APIs
│   │   ├── obraController.js      # CRUD obras
│   │   ├── rotasCompletasController.js  # View consolidada
│   │   └── usuarioController.js    # CRUD usuários
│   │
│   ├── models/                    # Models de dados
│   │   ├── Admin.js               # Model admins
│   │   ├── Auditoria.js           # Logs de auditoria
│   │   ├── Checklist.js           # Checklists de usuários
│   │   ├── EtapaObra.js           # Etapas de obras
│   │   ├── Historico.js           # Histórico de ações
│   │   ├── Obra.js                # Model obras
│   │   └── User.js                # Model usuários
│   │
│   ├── routes/                    # Definições de rotas
│   │   ├── authRoutes.js          # rotas de autenticação
│   │   └── controleGeralRoutes.js # rotas API controle geral
│   │
│   ├── middlewares/
│   │   └── isAuth.js              # Middleware autenticação
│   │
│   ├── database/
│   │   └── connection.js          # Pool MySQL
│   │
│   ├── modules/                   # Módulos independentes
│   │   └── estoque/
│   │       ├── controllers/
│   │       │   ├── estoqueController.js
│   │       │   ├── materialController.js
│   │       │   ├── materialObraController.js
│   │       │   └── movimentacaoObraController.js
│   │       ├── models/
│   │       │   ├── EstoqueMovimentacao.js
│   │       │   ├── Material.js
│   │       │   └── MaterialObra.js
│   │       ├── routes/
│   │       │   └── estoqueRoutes.js
│   │       └── views/
│   │           ├── dashboard.handlebars
│   │           ├── materiais.handlebars
│   │           └── ...
│   │
│   ├── utils/
│   │   └── logger.js              # Sistema de logs
│   │
│   └── views/                     # Templates Handlebars
│       ├── layouts/
│       │   └── main.handlebars    # Layout principal
│       ├── login.handlebars
│       ├── dashboard.handlebars
│       ├── tablesUsers.handlebars
│       ├── editUser.handlebars
│       ├── controlegeral.handlebars
│       ├── obras.handlebars
│       ├── financeiro.handlebars
│       ├── equipes.handlebars
│       ├── auditoria.handlebars
│       ├── historico.handlebars
│       └── ...
│
├── public/                        # Arquivos estáticos
│   ├── css/
│   │   ├── style.css
│   │   ├── auditoria.css
│   │   ├── controlegeral.css
│   │   ├── dashboard-progresso.css
│   │   ├── historico.css
│   │   ├── modal-user.css
│   │   ├── performance-optimization.css
│   │   ├── premium-effects.css
│   │   └── tables-users.css
│   ├── js/
│   │   ├── dashboard.js
│   │   ├── modal.js
│   │   └── userModal.js
│   └── img/
│       └── banner_BODY.jpg
│
├── scripts/                      # Scripts de manutenção
│   ├── create_db.js              # Criação banco de dados
│   ├── create_admin.js           # Criar admin inicial
│   ├── audit_usuarios.js         # Auditoria
│   └── ... (muitos outros scripts)
│
├── CONTROLEGERAL/                # Sistema legado (desabilitado)
│   ├── backend/
│   │   └── construtora.db       # SQLite (desabilitado)
│   └── frontend/
│       ├── index.html
│       ├── script.js
│       └── style.css
│
└── logs/                         # Arquivos de log
    └── app.log
```

## Função de Cada Arquivo Principal

### Arquivos Core
| Arquivo | Função |
|---------|--------|
| `src/app.js` | Entry point, configuração Express, middlewares globais, servidor HTTP |
| `src/router.js` | Router principal, montagem de sub-routers |
| `src/package.json` | Dependências, scripts npm, metadados |
| `src/database/connection.js` | Pool de conexões MySQL |

### Controllers
| Arquivo | Função |
|---------|--------|
| `authController.js` | Login, logout, sessão principal |
| `usuarioController.js` | CRUD usuários, checklist, auditoria |
| `obraController.js` | CRUD obras, etapas |
| `controleGeralController.js` | Módulo controle geral (estoque, equipes, financeiro) |
| `dashboardController.js` | Dashboard progresso, APIs estatísticas |
| `rotasCompletasController.js` | View consolidada com todos os dados |

### Models
| Arquivo | Função |
|---------|--------|
| `Admin.js` | Operações admins (buscar por email, criar, buscar por ID) |
| `User.js` | Operações usuários (CRUD, busca) |
| `Obra.js` | Operações obras (CRUD, relacionamento usuário) |
| `Checklist.js` | Checklists 6 etapas (uso_solo, licenca, etc.) |
| `Auditoria.js` | Logs de auditoria por ação |
| `Historico.js` | Histórico de mudanças por usuário |
| `EtapaObra.js` | Etapas padrão de obras |

### Middlewares
| Arquivo | Função |
|---------|--------|
| `isAuth.js` | Verifica sessão autenticada, redireciona para login se necessário |

---

# 4️⃣ SETUP E EXECUÇÃO DO SISTEMA

## Pré-requisitos

| Requisito | Versão Mínima | Observação |
|-----------|---------------|------------|
| Node.js | 18.x | LTS recomendado |
| MySQL | 5.7+ | Ou MySQL 8.x |
| npm | 8.x+ | Já incluído no Node.js |
| PM2 | 6.0+ | Para produção (opcional) |

## Instalação

```bash
# 1. Clonar/copiar projeto
cd Rp-Emppreendimentos

# 2. Instalar dependências
cd src
npm install

# 3. Criar arquivo .env (ver seção abaixo)
cp .env.example .env

# 4. Configurar banco de dados MySQL
# Criar banco: CREATE DATABASE rp_empreendimentos;

# 5. Executar script de criação de tabelas
node ../scripts/create_db.js

# 6. Iniciar servidor
npm start
```

## Scripts do package.json

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "pm2-runtime start app.js --name rp-empreendimentos",
    "dev": "NODE_ENV=development nodemon app.js",
    "prod": "NODE_ENV=production pm2-runtime start app.js --name rp-empreendimentos"
  }
}
```

| Script | Função |
|--------|--------|
| `npm start` | Inicia em produção com PM2 |
| `npm run dev` | Inicia em desenvolvimento com nodemon (reinicia automático) |
| `npm run prod` | Idêntico ao start |

## Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=rp_empreendimentos

# Sessão
SESSION_SECRET=sua_chave_secreta_muito_forte_aqui_2024

# Servidor
PORT=5000
HOST=0.0.0.0
NODE_ENV=development

# Segurança (produção)
# SESSION_SECRET deve ter pelo menos 32 caracteres
# NODE_ENV=production para habilitar HTTPS-only cookies
```

| Variável | Obrigatório | Padrão | Descrição |
|----------|-------------|--------|-----------|
| `DB_HOST` | Sim | localhost | Host do MySQL |
| `DB_PORT` | Não | 3306 | Porta do MySQL |
| `DB_USER` | Sim | root | Usuário MySQL |
| `DB_PASSWORD` | Sim | - | Senha MySQL |
| `DB_NAME` | Sim | - | Nome do banco |
| `SESSION_SECRET` | Sim | - | Chave para criptografia de sessão |
| `PORT` | Não | 5000 | Porta HTTP |
| `HOST` | Não | 0.0.0.0 | IP de bind |
| `NODE_ENV` | Não | development | Ambiente (development/production) |

## Portas Utilizadas

| Porta | Protocolo | Serviço |
|-------|-----------|---------|
| 5000 | TCP | Servidor Express HTTP |
| 3306 | TCP | MySQL (externo) |

## Fluxo de Inicialização do Servidor

```javascript
// src/app.js - Fluxo completo de inicialização

// 1. Carregar variáveis de ambiente (linhas 1-7)
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

// 2. Criar aplicação Express (linhas 10-11)
const express = require('express');
const app = express();

// 3. Configurar view engine Handlebars (linhas 40-73)
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: { eq, gt, lt, ne, escapeAttr, math }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 4. Configurar middlewares globais (linhas 75-110)
app.use(helmet(...));        // Segurança HTTP
app.use(cors(...));           // Cross-origin
app.use(compression());       // Gzip
app.use(express.static(...)); // Arquivos estáticos
app.use(bodyParser.json());   // Parse JSON
app.use(session(...));        // Sessões

// 5. Configurar rate limiting (linhas 113-122)
const loginLimiter = rateLimit({...});
app.use('/login', loginLimiter);

// 6. Montar rotas (linhas 124-126)
const router = require('./router');
app.use(router);

// 7. Tratamento 404 (linhas 128-136)
app.use((req, res) => {
  res.status(404).render('error', {...});
});

// 8. Tratamento de erros globais (linhas 138-146)
app.use((err, req, res, next) => {
  logger.error('Erro interno', err);
  res.status(500).json({ error: '...' });
});

// 9. Criar servidor HTTP (linhas 150-159)
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  logger.info(`Servidor rodando na porta ${PORT}`);
});

// 10. Tratamento de erros do servidor (linhas 162-172)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso`);
    process.exit(1);
  }
});

// 11. Graceful shutdown (linhas 175-193)
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
```

---

# 5️⃣ DEPENDÊNCIAS (package.json)

## Dependências de Produção

### 1. axios ^1.13.2
**O que é**: Cliente HTTP baseado em Promises para fazer requisições.

**Por que foi usada**: Para consumo de APIs externas se necessário.

**Onde aparece**: Imports em controllers para chamadas HTTP.

**Impacto**: Permite integração com sistemas externos.

---

### 2. bcrypt ^6.0.0
**O que é**: Biblioteca para criptografia de senhas usando Bcrypt.

**Por que foi usada**: Criptografia segura de senhas de admins.

**Onde aparece**: `src/controllers/authController.js:47`
```javascript
const ok = await bcrypt.compare(password.trim(), admin.password);
```

**Impacto**: 
- Senhas nunca são armazenadas em texto puro
- Cada senha tem salt automático
- Resistente a ataques rainbow table

---

### 3. body-parser ^2.2.1
**O que é**: Middleware para parse de corpo de requisições HTTP.

**Por que foi usada**: Extrair dados de formulários e JSON.

**Onde aparece**: `src/app.js:97-98`
```javascript
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
```

**Impacto**: Permite acesso a `req.body` em todas as rotas.

---

### 4. compression ^1.8.1
**O que é**: Middleware de compressão gzip.

**Por que foi usada**: Reduzir tamanho de respostas HTTP.

**Onde aparece**: `src/app.js:93`
```javascript
app.use(compression());
```

**Impacto**: 
- Reduz bandwidth em ~70%
- Melhora tempo de carregamento

---

### 5. cors ^2.8.5
**O que é**: Middleware para Cross-Origin Resource Sharing.

**Por que foi usada**: Permitir requisições de outros domínios.

**Onde aparece**: `src/app.js:87-90`
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
  credentials: true
}));
```

**Impacto**: 
- Em produção: apenas Same-Origin
- Em desenvolvimento: permite localhost:3000

---

### 6. dotenv ^17.2.3
**O que é**: Carrega variáveis de arquivo .env.

**Por que foi usada**: Configuração sensível fora do código.

**Onde aparece**: `src/app.js:5-7`
```javascript
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});
```

**Impacto**: Separação de configuração e código.

---

### 7. express ^4.18.2
**O que é**: Framework web minimalista para Node.js.

**Por que foi usada**: Framework principal do backend.

**Onde aparece**: Todo o `src/app.js`.

**Impacto**: 
- Roteamento
- Middlewares
- Template engine
- Servidor HTTP

---

### 8. express-handlebars ^4.0.0
**O que é**: Template engine Handlebars para Express.

**Por que foi usada**: Renderização server-side de HTML.

**Onde aparece**: `src/app.js:40-72`

**Impacto**:
- Views pré-renderizadas no servidor
- Layouts e partials
- Helpers customizados (eq, gt, math, etc.)

---

### 9. express-rate-limit ^8.2.1
**O que é**: Middleware para limitar requisições.

**Por que foi usada**: Proteção contra brute-force no login.

**Onde aparece**: `src/app.js:113-122`
```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 5,                     // máximo 5 tentativas
  message: 'Muitas tentativas de login...'
});
app.use('/login', loginLimiter);
```

**Impacto**: Limita tentativas de login a 5 por 15 minutos.

---

### 10. express-session ^1.18.2
**O que é**: Middleware para gerenciamento de sessões.

**Por que foi usada**: Manter usuários logados.

**Onde aparece**: `src/app.js:100-110`
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-secreta...',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24  // 24 horas
  }
}));
```

**Impacto**:
- Sessão persiste por 24h
- Cookie httpOnly (inacessível via JS)
- Secure apenas em produção

---

### 11. helmet ^7.2.0
**O que é**: Middleware de segurança HTTP.

**Por que foi usada**: Headers de segurança.

**Onde aparece**: `src/app.js:77-85`
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: { 'script-src-attr': ["'unsafe-inline'"] }
  },
  crossOriginEmbedderPolicy: false
}));
```

**Impacto**: 
- XSS Protection
- Clickjacking Protection
- MIME sniffing protection

---

### 12. mysql2 ^3.16.0
**O que é**: Driver MySQL com suporte a Promises.

**Por que foi usada**: Conexão e queries ao MySQL.

**Onde aparece**: `src/database/connection.js`

**Impacto**:
- Pool de conexões (20 conexões)
- Suporte a prepared statements
- Transactions

---

### 13. pm2 ^6.0.14
**O que é**: Gerenciador de processos de produção.

**Por que foi usada**: Executar servidor em produção.

**Onde aparece**: `package.json` scripts
```json
"start": "pm2-runtime start app.js --name rp-empreendimentos"
```

**Impacto**:
- Restart automático em crash
- Logs centralizados
- Clustering

---

## Dependências de Desenvolvimento

### nodemon ^3.1.11
**O que é**: Monitor de arquivos que reinicia o servidor.

**Por que foi usada**: Desenvolvimento mais rápido.

**Onde aparece**: `"dev": "nodemon app.js"`

**Impacto**: Reinício automático em mudanças de arquivo.

---

# 6️⃣ ARQUIVO PRINCIPAL (src/app.js)

## Fluxo Linha por Linha

```javascript
// Linhas 1-7: Carregamento de variáveis de ambiente
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});
```
**O que faz**: Carrega configurações do arquivo `.env` antes de qualquer outra coisa.
**Por quê**: Garante queDB_HOST, DB_PASSWORD, etc. estejam disponíveis.

---

```javascript
// Linhas 10-11: Criação da aplicação Express
const express = require('express');
const app = express();
```
**O que faz**: Inicializa a aplicação Express.
**Por quê**: Base de todo o servidor.

---

```javascript
// Linhas 14: Logger
const logger = require('./utils/logger');
```
**O que faz**: Carrega sistema de logs.
**Por quê**: Registro de eventos em arquivo e console.

---

```javascript
// Linhas 17-18: View Engine
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
```
**O que faz**: Carrega bibliotecas Handlebars.
**Por quê**: Renderização de templates.

---

```javascript
// Linhas 21-24: Middlewares
const bodyParser = require('body-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
```
**O que faz**: Carrega middlewares HTTP.
**Por quê**: 
- `bodyParser`: Parse de formulários
- `session`: Autenticação stateful
- `rateLimit`: Proteção brute-force
- `compression`: Otimização带宽

---

```javascript
// Linhas 26-30: Charset UTF-8 global
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});
```
**O que faz**: Força charset UTF-8 em todas as respostas.
**Por quê**: Suporte a caracteres especiais (ç, ã, é).

---

```javascript
// Linhas 33: Database connection
const db = require('./database/connection');
```
**O que faz**: Carrega pool de conexões MySQL.
**Por quê**: Disponibiliza banco para todos os controllers.

---

```javascript
// Linhas 36-37: Segurança
const helmet = require('helmet');
const cors = require('cors');
```
**O que faz**: Middlewares de segurança.
**Por quê**: Proteções HTTP e CORS.

---

```javascript
// Linhas 40-70: Configuração Handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: {
    eq: function(a, b) { return a === b; },
    gt: function(a, b) { return a > b; },
    lt: function(a, b) { return a < b; },
    ne: function(a, b) { return a !== b; },
    escapeAttr: function(str) { /* escape HTML */ },
    math: function(lvalue, operator, rvalue) { /* matemática */ }
  }
});
```
**O que faz**: Configura template engine com helpers personalizados.
**Helpers explicados**:
- `eq`: Igualdade para condicionais
- `gt/lt`: Maior/menor que
- `ne`: Diferente
- `escapeAttr`: Escapa strings para atributos HTML (data-*)
- `math`: Operações matemáticas básicas

---

```javascript
// Linhas 71-73: Ativação do engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
```
**O que faz**: Ativa Handlebars como engine de views.
**Por quê**: Permite `res.render('nomeView')`.

---

```javascript
// Linhas 76-90: Helmet + CORS
app.use(helmet({ /* config */ }));
app.use(cors({ /* config */ }));
```
**O que faz**: Aplica proteções HTTP.
**Por quê**: Protege contra XSS, clickjacking, etc.

---

```javascript
// Linhas 93: Compressão gzip
app.use(compression());
```
**O que faz**: Comprime respostas HTTP.
**Por quê**: Reduz tamanho em ~70%.

---

```javascript
// Linhas 95-96: Arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1d' }));
app.use('/controle-geral', express.static(...));
```
**O que faz**: Serve arquivos CSS, JS, imagens.
**Por quê**: Assets não precisam de renderização.

---

```javascript
// Linhas 97-98: Body Parser
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
```
**O que faz**: Parse de formulários (urlencoded) e JSON.
**Por quê**: Acessar dados via `req.body`.

---

```javascript
// Linhas 100-110: Sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-secreta...',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24  // 24 horas
  }
}));
```
**O que faz**: Configura sessão de usuário.
**Por quê**: Manter estado de autenticação.

| Configuração | Valor | Motivo |
|--------------|-------|--------|
| `httpOnly` | true | Inacessível via JavaScript |
| `secure` | production only | HTTPS apenas em produção |
| `sameSite` | 'strict' | CSRF protection |
| `maxAge` | 24h | Sessão expira em 24h |

---

```javascript
// Linhas 113-122: Rate Limiter para Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 5,                     // 5 tentativas
  message: 'Muitas tentativas...',
  skip: (req) => process.env.NODE_ENV !== 'production'
});
app.use('/login', loginLimiter);
```
**O que faz**: Limita tentativas de login.
**Por quê**: Previne brute-force attacks.

---

```javascript
// Linhas 125-126: Router
const router = require('./router');
app.use(router);
```
**O que faz**: Monta todas as rotas.
**Por quê**: Centraliza roteamento.

---

```javascript
// Linhas 129-136: 404 Handler
app.use((req, res) => {
  res.status(404).render('error', { status: 404, message: 'Página não encontrada' });
});
```
**O que faz**: Captura requisições para rotas inexistentes.
**Por quê**: Resposta amigável para 404.

---

```javascript
// Linhas 139-146: Error Handler Global
app.use((err, req, res, next) => {
   logger.error('Erro interno do servidor', err.message);
   res.status(500).json({
     error: 'Erro interno do servidor',
     message: process.env.NODE_ENV === 'development' ? err.message : null
   });
});
```
**O que faz**: Captura erros não tratados.
**Por quê**: Evita stack traces em produção.

---

```javascript
// Linhas 151-159: Iniciar Servidor
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`[LOG] Servidor rodando na porta ${PORT} (host: ${HOST})`);
  logger.info(`Servidor rodando na porta ${PORT} (host: ${HOST})`);
  logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
```
**O que faz**: Cria servidor HTTP na porta 5000.
**Por quê**: Disponibiliza aplicação.

---

```javascript
// Linhas 162-172: Error Handler do Servidor
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERRO] Porta ${PORT} já está em uso. Encerrando processo.`);
    process.exit(1);  // PM2 detecta e não entra em loop
  }
});
```
**O que trata**: Erros específicos do servidor.
**Por quê**: Evita loop de restart no PM2.

---

```javascript
// Linhas 175-193: Graceful Shutdown
const gracefulShutdown = (signal) => {
  console.log(`[LOG] Recebido ${signal}. Encerrando servidor gracefully...`);
  
  server.close(() => {
    console.log('[LOG] Servidor encerrado com sucesso');
    process.exit(0);
  });
  
  // Fallback: 10 segundos para encerrar
  setTimeout(() => {
    console.error('[ERRO] Não foi possível encerrar gracefully.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```
**O que faz**: Finaliza servidor graciosamente em sinais do SO.
**Por quê**: Evita corrupção de dados, fecha conexões corretamente.

---

# 7️⃣ ROTAS

## Autenticação

| Método | Endpoint | Arquivo | Controller | Descrição |
|--------|----------|---------|------------|-----------|
| GET | `/login` | authRoutes.js | authController.loginPage | Página de login |
| POST | `/login` | authRoutes.js | authController.login | Processa login |
| GET | `/` | authRoutes.js | redirect | Redireciona para /login |

---

## Dashboard

| Método | Endpoint | Arquivo | Controller | Descrição |
|--------|----------|---------|------------|-----------|
| GET | `/dashboard` | authRoutes.js | authController.dashboard | Dashboard principal |
| GET | `/dashboard/progresso` | authRoutes.js | dashboardController.dashboardProgresso | Progresso das obras |
| GET | `/dashboard/auditoria` | authRoutes.js | dashboardController.auditoria | Logs de auditoria |
| GET | `/dashboard/historico` | authRoutes.js | dashboardController.historicoCompleto | Histórico de ações |

---

## Usuários

| Método | Endpoint | Controller | Parâmetros | Resposta | Erros |
|--------|----------|------------|------------|----------|-------|
| GET | `/dashboard/usuarios` | usuarioController.list | - | Renderiza tablesUsers | 500 |
| POST | `/dashboard/usuarios` | usuarioController.create | nome, email, telefone, endereco, obra | Redirect /dashboard | 400, 500 |
| GET | `/dashboard/usuarios/:id/edit` | usuarioController.editpage | id (URL) | Renderiza editUser | 400, 404 |
| POST | `/dashboard/usuarios/:id/edit` | usuarioController.update | id (URL), dados formulário | Redirect | 400, 500 |
| POST | `/dashboard/usuarios/:id/delete` | usuarioController.delete | id (URL) | Redirect tablesUsers | 400, 500 |
| GET | `/dashboard/usuarios/:id/checklist` | usuarioController.getChecklist | id (URL) | JSON checklist | 400, 500 |
| GET | `/dashboard/usuarios/:id/historico` | usuarioController.historico | id (URL) | JSON histórico | 400, 500 |
| GET | `/dashboard/usuarios/:id/auditoria` | usuarioController.auditoria | id (URL) | JSON auditoria | 400, 500 |

---

## Obras

| Método | Endpoint | Controller | Parâmetros | Resposta |
|--------|----------|------------|------------|----------|
| GET | `/dashboard/obras` | obraController.listAll | - | Renderiza obras |
| GET | `/dashboard/obras/:id` | obraController.view | id (URL) | JSON {obra, etapas} |
| POST | `/dashboard/obras` | obraController.create | usuarioId, nome | Redirect |
| POST | `/dashboard/obras/:id/edit` | obraController.update | id (URL), nome | Redirect |
| POST | `/dashboard/obras/:id/delete` | obraController.delete | id (URL) | Redirect |
| GET | `/obras/search` | obraController.searchAutocomplete | q (query) | JSON [{id, nome_obra}] |

---

## Controle Geral (Módulo Completo)

### Obras
| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/controle-grade/obras` | controleGeralController.obras | Lista obras |
| POST | `/controle-grade/obras` | controleGeralController.criarObra | Cria obra |
| GET | `/dashboard/controle-grade/obras/edit/:id` | controleGeralController.editarObraPage | Editar página |
| POST | `/dashboard/controle-grade/obras/edit/:id` | controleGeralController.editarObra | Editar salvar |
| POST | `/dashboard/controle-grade/obras/delete/:id` | controleGeralController.excluirObra | Excluir |

### Estoque
| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/controle-grade/estoque` | controleGeralController.estoque | Lista materiais |
| POST | `/controle-grade/estoque` | controleGeralController.criarMaterial | Cria material |
| GET | `/dashboard/controle-grade/estoque/edit/:id` | controleGeralController.editarMaterialPage | Editar página |
| POST | `/dashboard/controle-grade/estoque/edit/:id` | controleGeralController.editarMaterial | Editar salvar |
| POST | `/dashboard/controle-grade/estoque/delete/:id` | controleGeralController.excluirMaterial | Excluir |

### Materiais por Obra
| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/dashboard/controle-grade/estoque/obra/:obra_id` | materiaisObra | Lista materiais |
| POST | `/dashboard/controle-grade/estoque/obra/:obra_id/adicionar` | adicionarMaterialObra | Adiciona |
| POST | `/dashboard/controle-grade/estoque/obra/:obra_id/editar/:id` | editarMaterialObra | Edita |
| POST | `/dashboard/controle-grade/estoque/obra/:obra_id/remover/:id` | removerMaterialObra | Remove (soft delete) |

### Movimentações
| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/dashboard/controle-grade/estoque/obra/:obra_id/movimentacoes` | movimentacoesObra | Lista movimentações |
| POST | `/dashboard/controle-grade/estoque/obra/:obra_id/entrada` | registrarEntradaObra | Registra entrada |
| POST | `/dashboard/controle-grade/estoque/obra/:obra_id/saida` | registrarSaidaObra | Registra saída |

### Equipes
| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/controle-grade/equipes` | controleGeralController.equipes | Lista funcionários |
| POST | `/controle-grade/equipes` | controleGeralController.criarFuncionario | Cria funcionário |
| POST | `/dashboard/controle-grade/equipes/update` | controleGeralController.editarFuncionario | Edita |
| POST | `/dashboard/controle-grade/equipes/delete/:id` | controleGeralController.excluirFuncionario | Exclui |

### Financeiro
| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/controle-grade/financeiro` | controleGeralController.financeiro | Lista transações |
| POST | `/controle-grade/financeiro` | controleGeralController.criarFinanceiro | Cria transação |
| GET | `/dashboard/controle-grade/financeiro/edit/:id` | controleGeralController.editarFinanceiroPage | Editar página |
| POST | `/dashboard/controle-grade/financeiro/edit/:id` | controleGeralController.editarFinanceiro | Editar salvar |
| POST | `/dashboard/controle-grade/financeiro/delete/:id` | controleGeralController.excluirFinanceiro | Exclui |

### Comunicação
| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/controle-grade/comunicacao` | controleGeralController.comunicacao | Página comunicação |

### Relatórios
| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/controle-grade/relatorios` | controleGeralController.relatorios | Lista relatórios |
| POST | `/controle-grade/relatorios` | controleGeralController.criarRelatorio | Cria relatório |

---

## APIs Internas

| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/dashboard/api/stats` | dashboardController.apiStats | Estatísticas |
| GET | `/dashboard/api/historico` | dashboardController.apiHistorico | Histórico |
| GET | `/dashboard/api/obras-recentes` | dashboardController.obrasRecentes | Obras recentes |
| GET | `/api/usuarios` | usuarioController.getUsuariosForDropdown | Usuários dropdown |
| GET | `/api/usuarios/search` | usuarioController.searchAutocomplete | Busca usuários |
| GET | `/obras/search` | obraController.searchAutocomplete | Busca obras |

---

## Estoque (Módulo Separado)

| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/estoque` | estoqueController.dashboard | Dashboard estoque |
| GET | `/estoque/materiais` | materialController.list | Lista materiais |
| GET | `/estoque/materiais/novo` | materialController.createPage | Criar página |
| POST | `/estoque/materiais` | materialController.create | Criar material |
| GET | `/estoque/materiais/:id/editar` | materialController.editPage | Editar página |
| POST | `/estoque/materiais/:id` | materialController.update | Editar salvar |
| GET | `/estoque/movimentacoes` | estoqueController.list | Lista movimentações |
| GET | `/estoque/entrada` | estoqueController.entradaPage | Entrada página |
| POST | `/estoque/entrada` | estoqueController.registrarEntrada | Registra entrada |
| GET | `/estoque/saida` | estoqueController.saidaPage | Saída página |
| POST | `/estoque/saida` | estoqueController.registrarSaida | Registra saída |

---

# 8️⃣ CONTROLLERS

## authController.js

### Responsabilidade
Gerenciar autenticação de administradores e renderização do dashboard principal.

### Funções

#### `loginPage(req, res)`
**O que faz**: Renderiza página de login.

```javascript
exports.loginPage = (req, res) => {
  res.render('login');
};
```

**Fluxo**: Simplesmente retorna a view login.handlebars.

---

#### `login(req, res)`
**O que faz**: Processa tentativa de login.

**Validações**:
1. Verifica se email e password foram enviados
2. Valida formato do email com regex
3. Verifica tamanho mínimo da senha (6 caracteres)

**Fluxo**:
```javascript
exports.login = async (req, res) => {
  const { email, password } = req.body;  // 1. Extrai dados
  
  // 2. Validações
  if (!email || !password) {
    return res.status(400).send('Email e senha sao obrigatorios');
  }
  if (!emailRegex.test(email)) {
    return res.status(400).send('Email invalido');
  }
  
  // 3. Busca admin no banco
  const admin = await Admin.findByEmail(email.toLowerCase().trim());
  
  // 4. Verifica existência
  if (!admin) {
    return res.status(401).send('Email ou senha incorretos');
  }
  
  // 5. Compara senha com bcrypt
  const ok = await bcrypt.compare(password.trim(), admin.password);
  
  // 6. Se incorreta
  if (!ok) {
    return res.status(401).send('Email ou senha incorretos');
  }
  
  // 7. Cria sessão
  req.session.adminId = admin.id;
  req.session.adminEmail = admin.email;
  
  // 8. Redireciona para dashboard
  res.redirect('/dashboard');
};
```

**Erros possíveis**:
- 400: Campos obrigatórios faltando
- 400: Email inválido
- 400: Senha muito curta
- 401: Admin não encontrado
- 401: Senha incorreta
- 500: Erro de banco

---

#### `dashboard(req, res)`
**O que faz**: Renderiza dashboard com estatísticas.

**Fluxo**:
1. Verifica se está autenticado
2. Busca checklists com progresso
3. Busca usuários do admin
4. Calcula estatísticas
5. Renderiza dashboard.handlebars

```javascript
exports.dashboard = async (req, res) => {
  // 1. Verifica sessão
  if (!req.session.adminId) {
    return res.redirect('/login');
  }

  try {
    // 2. Busca dados
    const checklists = await Checklist.findAllWithProgresso();
    const usuarios = await Usuario.findAllByAdmin(req.session.adminId);

    // 3. Calcula estatísticas
    const progressoMedio = checklists && checklists.length > 0
      ? (checklists.reduce((sum, item) => sum + (item.progresso || 0), 0) / checklists.length).toFixed(2)
      : 0;

    const totalUsuarios = usuarios ? usuarios.length : 0;
    const totalObras = checklists ? checklists.length : 0;
    const obrasCompletas = checklists ? checklists.filter(item => item.progresso === 100).length : 0;

    // 4. Renderiza
    res.render('dashboard', {
      progressoMedio,
      totalUsuarios,
      totalObras,
      obrasCompletas
    });
  } catch (err) {
    // 5. Fallback em caso de erro
    res.render('dashboard', {
      progressoMedio: 0,
      totalUsuarios: 0,
      totalObras: 0,
      obrasCompletas: 0
    });
  }
};
```

---

## usuarioController.js

### Responsabilidade
CRUD completo de usuários, incluindo checklist de documentos.

### Funções Principais

#### `create(req, res)`
**O que faz**: Cria novo usuário com checklist opcional.

**Validações**:
- Todos os campos obrigatórios
- Nome mínimo 3 caracteres
- Email válido (regex)
- Telefone 10-11 dígitos

**Fluxo**:
```javascript
exports.create = async (req, res) => {
  const { nome, email, telefone, endereco, obra, uso_solo, licenca, ... } = req.body;

  // 1. Valida campos obrigatórios
  if (!nome || !email || !endereco || !obra || !telefone) {
    return res.status(400).send('❌ Todos os campos são obrigatórios');
  }

  // 2. Valida nome
  if (nome.length < 3) {
    return res.status(400).send('❌ Nome deve ter pelo menos 3 caracteres');
  }

  // 3. Valida email
  if (!emailRegex.test(email)) {
    return res.status(400).send('❌ Email inválido');
  }

  // 4. Valida telefone
  const telefoneLimpo = telefone.replace(/\D/g, '');
  if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    return res.status(400).send('❌ Telefone deve ter 10 ou 11 dígitos');
  }

  try {
    // 5. Cria usuário
    const userId = await User.create(
      nome.trim(),
      email.toLowerCase().trim(),
      telefone.trim(),
      endereco.trim(),
      obra.trim(),
      req.session.adminId
    );

    // 6. Se checklist fornecido, cria registro
    if (userId && (uso_solo || licenca || ...)) {
      await Checklist.createIfNotExists(userId);
      
      // Atualiza cada campo do checklist
      const camposChecklist = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
      for (const campo of camposChecklist) {
        if (req.body[campo] && req.body[campo] !== 'Nao Tem') {
          await Checklist.update(userId, campo, req.body[campo]);
          await Auditoria.log(req.session.adminId, userId, 'CHECKLIST_INICIAL', campo, 'Nao Tem', req.body[campo]);
        }
      }
    }

    // 7. Registra histórico
    await Historico.registrar(userId, 'usuario', `Usuário criado`, req.session.adminId);

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('❌ Erro ao criar usuário');
  }
};
```

---

#### `delete(req, res)`
**O que faz**: Exclui usuário e TODOS os dados relacionados.

**Ordem de exclusão** (importante para integridade):
1. Checklist do usuário
2. Histórico do usuário
3. Auditoria do usuário
4. Obras do usuário
5. O próprio usuário

```javascript
exports.delete = async(req, res) => {
  const { id } = req.params;

  try {
    // Busca usuário antes de excluir (para log)
    const usuario = await User.findById(id);
    
    // Registra auditoria ANTES de deletar
    await Auditoria.log(req.session.adminId, id, 'USUARIO_DELETADO', 'usuario', usuario.nome, null);

    // Deleta em cascata (tabelas relacionadas primeiro)
    await db.execute('DELETE FROM checklist_usuarios WHERE usuario_id = ?', [id]);
    await db.execute('DELETE FROM historico WHERE usuario_id = ?', [id]);
    await db.execute('DELETE FROM auditoria WHERE usuario_id = ?', [id]);
    await db.execute('DELETE FROM obras WHERE usuario_id = ?', [id]);
    
    // Finalmente deleta o usuário
    await User.deleteById(id);

    res.redirect('/dashboard/tablesUsers');
  } catch (err) {
    res.status(500).send('❌ Erro ao excluir usuário');
  }
};
```

---

## rotasCompletasController.js

### Responsabilidade
View consolidada que carrega TODOS os dados de uma obra em uma única requisição (otimização N+1).

### Fluxo de Otimização

```javascript
exports.index = async (req, res) => {
  const adminId = req.session.adminId;

  try {
    // 1. Busca todas as obras do admin (1 query)
    const [obras] = await db.execute(`
      SELECT o.id, o.nome_obra, o.descricao, o.created_at,
             u.id as cliente_id, u.nome as cliente_nome, u.email as cliente_email,
             u.telefone as cliente_telefone
      FROM obras o
      LEFT JOIN usuarios u ON o.usuario_id = u.id
      WHERE u.admin_id = ?
      ORDER BY o.created_at DESC
      LIMIT 50
    `, [adminId]);

    if (obras.length === 0) {
      return res.render('rotascompletas', { obras: [] });
    }

    const obraIds = obras.map(o => o.id);
    const clienteIds = obras.filter(o => o.cliente_id).map(o => o.cliente_id);

    // 2. Busca checklists em batch (1 query)
    let checklistMap = new Map();
    if (clienteIds.length > 0) {
      const placeholders = clienteIds.map(() => '?').join(',');
      const [checklists] = await db.execute(
        `SELECT * FROM checklist_usuarios WHERE usuario_id IN (${placeholders})`,
        clienteIds
      );
      checklists.forEach(c => checklistMap.set(c.usuario_id, c));
    }

    // 3. Busca materiais de cada obra (1 query)
    let materiaisMap = new Map();
    if (obraIds.length > 0) {
      const placeholders = obraIds.map(() => '?').join(',');
      const [materiais] = await db.execute(
        `SELECT mo.*, m.nome as material_nome 
         FROM materiais_obra mo
         LEFT JOIN materiais m ON mo.material_id = m.id
         WHERE mo.obra_id IN (${placeholders}) AND mo.ativo = TRUE`,
        obraIds
      );
      materiais.forEach(m => {
        if (!materiaisMap.has(m.obra_id)) {
          materiaisMap.set(m.obra_id, []);
        }
        materiaisMap.get(m.obra_id).push(m);
      });
    }

    // 4. Busca funcionários (1 query)
    let funcionariosMap = new Map();
    // Similar ao acima...

    // 5. Busca financeiro (1 query)
    let financeiroMap = new Map();
    // Similar ao acima...

    // 6. Busca histórico (1 query)
    let historicoMap = new Map();
    // Similar ao acima...

    // 7. Monta objeto final com todos os dados
    const obrasCompletas = obras.map(obra => {
      const checklist = checklistMap.get(obra.cliente_id);
      
      // Calcula progresso (6 etapas)
      let progresso = 0;
      if (checklist) {
        const campos = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
        const completos = campos.filter(c => checklist[c] === 'Feito').length;
        progresso = Math.round((completos / campos.length) * 100);
      }

      return {
        ...obra,
        progresso,
        status_uso_solo: checklist?.uso_solo || 'Nao Tem',
        materiais: materiaisMap.get(obra.id) || [],
        funcionarios: funcionariosMap.get(obra.id) || [],
        lancamentosFinanceiro: financeiroMap.get(obra.id) || [],
        totalGanhos: ganhoMap.get(obra.id) || 0,
        totalDespesas: despesaMap.get(obra.id) || 0,
        historico: historicoMap.get(obra.cliente_id) || []
      };
    });

    res.render('rotascompletas', { obras: obrasCompletas });
  } catch (err) {
    res.status(500).send('Erro ao carregar página: ' + err.message);
  }
};
```

**Por que isso é importante?**
- Em vez de 50+ queries (N+1 problem), faz apenas 6 queries
- Usa Maps para organizar dados relacionados
- Muito mais rápido e eficiente

---

# 9️⃣ SERVICES / REGRAS DE NEGÓCIO

## Checklist (6 Etapas)

### Valores Válidos
Cada etapa do checklist pode ter um dos seguintes valores:

| Valor | Significado |
|-------|-------------|
| `Nao Tem` | Não iniciado / não possui |
| `Andamento` | Em progresso |
| `Feito` | Concluído |
| `Finalizado` | Finalizado (úsado em alguns contextos) |
| `Proxima-Etapa` | Próxima etapa |

### Cálculo de Progresso

```javascript
// 6 etapas / 100% = 16.67% cada
const campos = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];

function calcularProgresso(checklist) {
  let completos = 0;
  
  campos.forEach(campo => {
    if (checklist[campo] === 'Feito') {
      completos++;
    }
  });
  
  return Math.round((completos / campos.length) * 100);
}
```

**Exemplo**:
- 3 etapas "Feito" = 50% progresso
- 6 etapas "Feito" = 100% progresso

---

## Controle de Estoque

### Regra: Saldo Nunca Negativo

```javascript
// src/controllers/controleGeralController.js:279-282
const [material] = await db.execute(
  'SELECT saldo_atual FROM materiais_obra WHERE id = ? AND obra_id = ?',
  [material_obra_id, obra_id]
);

if (material[0] && material[0].saldo_atual < quantidade) {
  return res.status(400).send('Saldo insuficiente para esta saída');
}
```

### Transações (MySQL)

```javascript
// src/modules/estoque/models/EstoqueMovimentacao.js:5-44
static async registrarEntrada(dados) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();  // Inicia transação

    // Inserir movimentação
    await connection.execute(sqlMov, [...]);

    // Atualizar estoque (atomicamente)
    await connection.execute(sqlUpdate, [dados.quantidade, dados.material_id]);

    await connection.commit();  // Confirma tudo ou nada
    return result.insertId;

  } catch (err) {
    await connection.rollback();  // Desfaz tudo em caso de erro
    throw err;
  } finally {
    connection.release();  // Libera conexão do pool
  }
}
```

**Por que transações?**
- Garante integridade: SE a entrada falhar, o estoque NÃO é atualizado
- Evita estados inconsistentes

---

## Sessão e Autenticação

### Dados Armazenados na Sessão
```javascript
req.session.adminId = admin.id;      // ID do admin logado
req.session.adminEmail = admin.email; // Email (para display)
```

### Verificação de Sessão
```javascript
// src/middlewares/isAuth.js
module.exports = function isAuth(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();  // Autenticado, continua
  }
  return res.status(401).redirect('/login');  // Não autenticado
};
```

---

## Auditoria e Logging

### O que é Registrado
- Criação de usuários
- Updates de checklist
- Exclusão de dados
- Login/logout

### Campos de Auditoria
```sql
CREATE TABLE auditoria (
  admin_id INT,         -- Quem fez
  usuario_id INT NOT NULL, -- Em quem fez
  acao VARCHAR(100),   -- O que fez (ex: "CHECKLIST_ATUALIZADO")
  campo VARCHAR(50),    -- Qual campo (ex: "uso_solo")
  valor_anterior TEXT,  -- Valor antes
  valor_novo TEXT,      -- Valor depois
  created_at TIMESTAMP
);
```

---

# 🔟 BANCO DE DADOS

## Tipo de Banco
**MySQL 5.7+** ou **MySQL 8.x**

## Arquivo de Conexão
`src/database/connection.js`

```javascript
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',

  waitForConnections: true,
  connectionLimit: 20,      // Pool de 20 conexões
  queueLimit: 0,
  enableKeepAlive: true,
  multipleStatements: true,  //允许多个语句

  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = connection;
```

| Configuração | Valor | Motivo |
|--------------|-------|--------|
| `connectionLimit` | 20 | Suporta 20 requisições concorrentes |
| `charset` | utf8mb4 | Suporta emojis e caracteres especiais |
| `multipleStatements` | true | Permite queries múltiplas (scripts) |
| `ssl.rejectUnauthorized` | false | Para conexões MySQL Cloud |

---

## Estrutura das Tabelas

### Tabela: admins
```sql
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Descrição**: Administradores do sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INT | PK, autoincremento |
| nome | VARCHAR(150) | Nome completo |
| email | VARCHAR(100) | Email único de login |
| password | VARCHAR(255) | Senha hasheada (bcrypt) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última modificação |

---

### Tabela: usuarios
```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  endereco VARCHAR(255),
  obra VARCHAR(150),
  admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_obra (obra),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Descrição**: Clientes/usuários das obras.

---

### Tabela: checklist_usuarios
```sql
CREATE TABLE checklist_usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  uso_solo ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  licenca ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  condominio ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  habite_se ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  averbacao ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  vistoria ENUM('Feito','Andamento','Finalizado','Proxima-Etapa','Nao Tem') DEFAULT 'Nao Tem',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Descrição**: Checklist de 6 etapas documentais de cada usuário.

**6 Etapas**:
1. uso_solo - Uso do solo
2. licenca - Licença ambiental
3. condominio - Documentação de condomínio
4. habite_se - Habite-se
5. averbacao - Averbação
6. vistoria - Vistoria final

---

### Tabela: obras
```sql
CREATE TABLE obras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nome_obra VARCHAR(150),
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Descrição**: Obras vinculadas aos usuários.

---

### Tabela: etapas_obra
```sql
CREATE TABLE etapas_obra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  obra_id INT NOT NULL,
  etapa_nome VARCHAR(100),
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'Pendente',
  data_inicio DATE,
  data_termino DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_obra (obra_id),
  FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Descrição**: Etapas individuais de cada obra.

---

### Tabela: materiais
```sql
CREATE TABLE materiais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  unidade VARCHAR(20) DEFAULT 'un',
  categoria VARCHAR(100),
  preco_unitario DECIMAL(10,2) DEFAULT 0,
  estoque_minimo DECIMAL(10,2) DEFAULT 0,
  fornecedor_padrao VARCHAR(150),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nome (nome),
  INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Descrição**: Catálogo de materiais de construção.

---

### Tabela: materiais_obra
```sql
CREATE TABLE materiais_obra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  obra_id INT NOT NULL,
  material_id INT NOT NULL,
  quantidade_estimada DECIMAL(10,2) DEFAULT 0,
  quantidade_inicial DECIMAL(10,2) DEFAULT 0,
  saldo_atual DECIMAL(10,2) DEFAULT 0,
  fase_obra VARCHAR(100),
  categoria VARCHAR(100),
  subcategoria VARCHAR(100),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_obra (obra_id),
  INDEX idx_material (material_id),
  FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Descrição**: Materiais alocados em cada obra.

---

### Tabela: estoque_movimentacoes
```sql
CREATE TABLE estoque_movimentacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material_id INT NOT NULL,
  tipo ENUM('entrada','saida') NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL,
  obra_id INT,
  motivo VARCHAR(255),
  documento VARCHAR(100),
  valor_unitario DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_material (material_id),
  INDEX idx_tipo (tipo),
  INDEX idx_obra (obra_id),
  INDEX idx_admin (admin_id),
  FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE,
  FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Descrição**: Log de todas as movimentações de estoque.

---

### Tabela: auditoria
```sql
CREATE TABLE auditoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT,
  usuario_id INT NOT NULL,
  acao VARCHAR(100) NOT NULL,
  campo VARCHAR(50),
  valor_anterior TEXT,
  valor_novo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin (admin_id),
  INDEX idx_usuario (usuario_id),
  INDEX idx_acao (acao),
  INDEX idx_created (created_at),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Descrição**: Log de auditoria de todas as ações.

---

### Tabela: historico
```sql
CREATE TABLE historico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  descricao TEXT,
  admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  INDEX idx_created (created_at),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Descrição**: Histórico de alterações por usuário.

---

## Relacionamentos (ER Diagram Simplificado)

```
admins (1) ----< (N) usuarios
usuarios (1) ----< (N) obras
usuarios (1) -- (1) checklist_usuarios
usuarios (1) ----< (N) auditoria
usuarios (1) ----< (N) historico
obras (1) ----< (N) etapas_obra
obras (1) ----< (N) materiais_obra
obras (1) ----< (N) estoque_movimentacoes
materiais (1) ----< (N) materiais_obra
materiais (1) ----< (N) estoque_movimentacoes
```

---

# 1️⃣1️⃣ AUTENTICAÇÃO E SEGURANÇA

## Sistema de Login

### Fluxo de Login
```
1. Usuário acessa /login
2. vê página de login (GET)
3. Preenche email e senha
4. Faz POST /login com dados
5. Servidor valida
6. Se válido: cria sessão, redireciona /dashboard
7. Se inválido: retorna erro 400/401
```

### Comparação de Senha (Bcrypt)
```javascript
// src/controllers/authController.js:47
const ok = await bcrypt.compare(password.trim(), admin.password);
```

**Como funciona**:
1. `bcrypt.compare()` recebe texto puro e hash armazenado
2. Hashea o texto puro com o mesmo salt do hash
3. Compara os dois hashes
4. Retorna true se iguais, false se diferentes

**Por que é seguro**:
- Não armazena senha em texto puro
- Cada hash tem salt único
- Resistência a rainbow tables
- Configurável work factor

---

## Sessão

### Configuração
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24  // 24 horas
  }
}));
```

| Configuração | Valor | Segurança |
|--------------|-------|-----------|
| `httpOnly` | true | Cookie inacessível via JavaScript (XSS protection) |
| `secure` | production only | Cookie só via HTTPS |
| `sameSite` | 'strict' | Cookie não enviado em requisições cross-site (CSRF protection) |
| `maxAge` | 24h | Expiração da sessão |

---

## Middleware de Autenticação

```javascript
// src/middlewares/isAuth.js
const logger = require('../utils/logger');

module.exports = function isAuth(req, res, next) {
  // Verifica se existe sessão E adminId
  if (req.session && req.session.adminId) {
    logger.info(`[AUTH] Usuário autenticado: ${req.session.adminId}`);
    return next();  // Permite acesso
  }

  // Se não autenticado
  logger.warn(`[AUTH] Acesso negado para ${req.path} - sessão inválida`);
  return res.status(401).redirect('/login');
};
```

**O que faz**:
1. Verifica se existe sessão
2. Verifica se adminId está presente
3. Se sim: `next()` - permite continuar
4. Se não: `401.redirect('/login')` - redireciona

---

## Proteções Aplicadas

### 1. Rate Limiting (Brute Force)
```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 5,                     // 5 tentativas máx
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});
app.use('/login', loginLimiter);
```

**Protege contra**: Ataques de força bruta no login.

---

### 2. Helmet (Headers HTTP)
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'script-src-attr': ["'unsafe-inline'"]  // Permite scripts inline necessários
    }
  },
  crossOriginEmbedderPolicy: false
}));
```

**Headers configurados**:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Content-Security-Policy

---

### 3. CORS
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
  credentials: true
}));
```

**Proteção**:
- Produção: Apenas same-origin
- Desenvolvimento: Permite localhost:3000

---

### 4. Validação de Entrada

**Email regex**:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Telefone regex**:
```javascript
const telefoneRegex = /^\d{10,11}$/;
```

---

### 5. SQL Injection Prevention

**Usando Prepared Statements**:
```javascript
// Errado (vulnerável):
await db.execute(`SELECT * FROM users WHERE email = '${email}'`);

// Correto (safe):
await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
```

O driver `mysql2` automaticamente escapa valores em `?`.

---

### 6. Password Hashing

**Criação de hash**:
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(senha, 10);  // 10 = work factor
```

---

# 1️⃣2️⃣ CÓDIGOS COMPLEXOS OU CONFUSOS

## 1. Middleware de Charset UTF-8 Global

```javascript
// src/app.js:26-30
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});
```

**Por que existe?**  
Garante que todas as respostas tenham charset UTF-8, evitando problemas com caracteres especiais (ç, ã, é).

**Por que é um middleware e não configuração?**  
O Express não tem configuração global para charset em headers, então precisa ser setado em cada resposta.

---

## 2. Rate Limiting Condicional

```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== 'production'
});

app.use('/login', loginLimiter);
```

**O que `skip` faz?**  
Em desenvolvimento, NÃO aplica rate limiting. Apenas em produção.

**Por quê?**  
Facilita testes e desenvolvimento sem ficar bloqueado.

---

## 3. Helpers Handlebars

```javascript
helpers: {
  eq: function(a, b) { return a === b; },
  gt: function(a, b) { return a > b; },
  lt: function(a, b) { return a < b; },
  ne: function(a, b) { return a !== b; },
  escapeAttr: function(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&')
      .replace(/"/g, '"')
      .replace(/'/g, ''')
      .replace(/</g, '<')
      .replace(/>/g, '>');
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
```

**Por que são necessários?**  
Handlebars não tem operadores de comparação ou matemática built-in. São adicionados via helpers.

**`escapeAttr` vs `{{ }}`:**  
`{{ }}` escapa para HTML content. `escapeAttr` escapa para atributos HTML (data-*, onclick, etc.) que precisam de escaping diferente.

---

## 4. Otimização N+1 com Maps

```javascript
// src/controllers/rotasCompletasController.js:30-61

// Busca todos os IDs
const obraIds = obras.map(o => o.id);
const clienteIds = obras.filter(o => o.cliente_id).map(o => o.cliente_id);

// Busca TODOS os checklists de uma vez
let checklistMap = new Map();
if (clienteIds.length > 0) {
  const placeholders = clienteIds.map(() => '?').join(',');
  const [checklists] = await db.execute(
    `SELECT * FROM checklist_usuarios WHERE usuario_id IN (${placeholders})`,
    clienteIds
  );
  checklists.forEach(c => checklistMap.set(c.usuario_id, c));
}

// Monta resultado
const obrasCompletas = obras.map(obra => {
  const checklist = checklistMap.get(obra.cliente_id);
  return {
    ...obra,
    progresso: calcularProgresso(checklist),
    // ...outros dados
  };
});
```

**O que é otimização N+1?**  
Problema onde para cada item (N), faz uma query adicional (1), resultando em N+1 queries.

**Como foi resolvido?**  
1. Coletar todos os IDs primeiro
2. Fazer 1 query com WHERE id IN (?, ?, ...)
3. Organizar resultados em Map (hash table O(1))
4. Associar dados na hora de montar o objeto final

**Resultado**: 6 queries em vez de 50+.

---

## 5. Transactions com Conexão Direta

```javascript
// src/modules/estoque/models/EstoqueMovimentacao.js:5-44
static async registrarEntrada(dados) {
  const connection = await db.getConnection();  // Conexão DIRETA
  try {
    await connection.beginTransaction();

    // Queries usando connection, NÃO db
    await connection.execute(sqlMov, [...]);
    await connection.execute(sqlUpdate, [...]);

    await connection.commit();
    return result.insertId;

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();  // Devolve ao pool
  }
}
```

**Por que conexão direta e não pool?**  
Transactions exigem que todas as queries usem a MESMA conexão. O pool (`db`) pode atribuir conexões diferentes para cada query.

**Por que `try/catch/finally`?**  
- `try`: Executa as queries
- `catch`: Se algo der errado, faz rollback
- `finally`: Sempre释放 conexão (evita memory leak)

---

## 6. Graceful Shutdown

```javascript
const gracefulShutdown = (signal) => {
  console.log(`[LOG] Recebido ${signal}. Encerrando servidor gracefully...`);
  logger.info(`Recebido ${signal}. Encerrando servidor gracefully...`);
  
  server.close(() => {
    console.log('[LOG] Servidor encerrado com sucesso');
    logger.info('Servidor encerrado com sucesso');
    process.exit(0);
  });
  
  // Fallback: 10 segundos
  setTimeout(() => {
    console.error('[ERRO] Não foi possível encerrar gracefully.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

**O que é SIGTERM/SIGINT?**
- `SIGTERM`: Signal do PM2/kill para terminar processo
- `SIGINT`: Ctrl+C no terminal

**Por que graceful shutdown?**
- Permite conexões ativas terminarem naturalmente
- Evita corrupção de dados
- Logs são finalizados

**Por que timeout de 10s?**  
Se o servidor não conseguir encerrar em 10s, força encerramento para não ficar "travado".

---

## 7. Soft Delete

```javascript
// src/controllers/controleGeralController.js:229-238
exports.removerMaterialObra = async (req, res) => {
  const { obra_id, material_obra_id } = req.params;
  // Usar UPDATE com ativo = FALSE em vez de DELETE
  await db.execute(
    'UPDATE materiais_obra SET ativo = FALSE WHERE id = ? AND obra_id = ?',
    [material_obra_id, obra_id]
  );
  res.redirect('/rotascompletas');
};
```

**Por que soft delete e não hard delete?**  
- Dados não são realmente excluídos
- Pode ser reativado no futuro (ativo = TRUE)
- Histórico é preservado
- Evita exclusão acidental

---

# 1️⃣3️⃣ FLUXO COMPLETO DO SISTEMA

## Fluxo 1: Login

```
┌─────────────────────────────────────────────────────────────┐
│                     FLUXO DE LOGIN                          │
└─────────────────────────────────────────────────────────────┘

1. USUÁRIO ACESSA /login
   │
   ▼
2. Express verifica rotas (router.js)
   │
   ├── GET /login → authController.loginPage
   │   │
   │   ▼
   │   res.render('login')
   │   │
   │   ▼
   │   Handlebars renderiza login.handlebars
   │
   ▼
3. USUÁRIO PREENCHE FORMULÁRIO
   - Email: admin@empresa.com
   - Senha: ********
   │
   ▼
4. POST /login
   │
   ├── Middleware bodyParser parseia corpo
   │   req.body = { email, password }
   │
   ├── Rate limiter verifica (max 5 em 15min)
   │
   ├── authController.login recebe req.body
   │
   ├── Validações:
   │   ├── email obrigatório?
   │   ├── email válido? (regex)
   │   └── senha >= 6 chars?
   │
   │   Se falha → 400 "Email e senha sao obrigatorios"
   │
   ├── Admin.findByEmail(email)
   │   │
   │   └── db.execute('SELECT * FROM admins WHERE email = ?')
   │
   ├── Se admin não existe → 401 "Email ou senha incorretos"
   │
   ├── bcrypt.compare(password, admin.password)
   │
   ├── Se senha incorreta → 401 "Email ou senha incorretos"
   │
   ├── SUCESSO:
   │   ├── req.session.adminId = admin.id
   │   └── res.redirect('/dashboard')
   │
   ▼
5. REDIRECIONAMENTO
   │
   └── GET /dashboard
       │
       ├── Middleware isAuth verifica sessão
       │
       ├── authController.dashboard
       │   ├── Checklist.findAllWithProgresso()
       │   ├── Usuario.findAllByAdmin(adminId)
       │   ├── Calcula estatísticas
       │   └── res.render('dashboard', { ...stats })
       │
       └── Handlebars renderiza dashboard
```

---

## Fluxo 2: Criar Usuário

```
┌─────────────────────────────────────────────────────────────┐
│                  FLUXO: CRIAR USUÁRIO                       │
└─────────────────────────────────────────────────────────────┘

1. POST /dashboard/usuarios
   │
   ├── bodyParser parseia: req.body = { nome, email, telefone, ... }
   │
   ├── isAuth verifica sessão
   │
   └── usuarioController.create(req, res)
       │
       ├── VALIDAÇÕES
       │   ├── nome >= 3 chars?
       │   ├── email regex válido?
       │   └── telefone 10-11 dígitos?
       │
       ├── User.create(...)
       │   └── db.execute('INSERT INTO usuarios ...')
       │
       ├── SE checklist fornecido:
       │   ├── Checklist.createIfNotExists(userId)
       │   ├── Loop pelos campos:
       │   │   ├── Para cada campo: uso_solo, licenca, ...
       │   │   ├── Se valor != 'Nao Tem':
       │   │   │   ├── Checklist.update(userId, campo, valor)
       │   │   │   └── Auditoria.log(adminId, userId, 'CHECKLIST_INICIAL', ...)
       │   └── Historico.registrar(userId, 'usuario', 'Usuário criado')
       │
       └── res.redirect('/dashboard')
```

---

## Fluxo 3: Registro de Material (com Transaction)

```
┌─────────────────────────────────────────────────────────────┐
│              FLUXO: REGISTRAR ENTRADA DE MATERIAL           │
└─────────────────────────────────────────────────────────────┘

1. POST /estoque/entrada
   │
   └── estoqueController.registrarEntrada(req, res)
       │
       ├── db.getConnection() → connection
       │
       ├── connection.beginTransaction()
       │
       ├── connection.execute('INSERT INTO estoque_movimentacoes ...')
       │
       ├── connection.execute('UPDATE materiais SET estoque_atual = ...')
       │
       ├── Se OK: connection.commit()
       │   └── connection.release()
       │
       └── Se ERRO: connection.rollback()
           └── connection.release()
```

---

# 1️⃣4️⃣ COMO RECRIAR O SISTEMA DO ZERO

## PASSO 1: Criar Projeto Node.js

```bash
# 1. Criar pasta do projeto
mkdir rp-empreendimentos
cd rp-empreendimentos

# 2. Iniciar npm
npm init -y

# 3. Criar estrutura de pastas
mkdir -p src/{controllers,models,routes,middlewares,database,utils,modules/estoque/{controllers,models,routes,views}}
mkdir -p public/{css,js,img}
mkdir -p scripts
mkdir -p logs
```

---

## PASSO 2: Instalar Dependências

```bash
# Dependências de produção
npm install express express-handlebars mysql2 bcrypt dotenv helmet cors compression express-rate-limit express-session body-parser

# Dependências de desenvolvimento
npm install --save-dev nodemon

# Gerenciador de produção (opcional)
npm install pm2
```

---

## PASSO 3: Criar Arquivo .env

```env
# Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql_aqui
DB_NAME=rp_empreendimentos

# Sessão (mude para algo seguro em produção)
SESSION_SECRET=sua_chave_secreta_muito_forte_aqui_minimo_32_caracteres

# Servidor
PORT=5000
HOST=0.0.0.0
NODE_ENV=development
```

---

## PASSO 4: Criar Estrutura de Arquivos

### Database Connection (`src/database/connection.js`)

```javascript
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',

    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    enableKeepAlive: true,
    multipleStatements: true,

    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = connection;
```

---

### Middleware isAuth (`src/middlewares/isAuth.js`)

```javascript
const logger = require('../utils/logger');

module.exports = function isAuth(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    }
    return res.status(401).redirect('/login');
};
```

---

### App Principal (`src/app.js`)

```javascript
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const express = require('express');
const app = express();

const logger = require('./utils/logger');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

// Middleware charset
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

const db = require('./database/connection');

// Handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: {
    eq: function(a, b) { return a === b; },
    gt: function(a, b) { return a > b; },
    lt: function(a, b) { return a < b; },
    ne: function(a, b) { return a !== b; }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(helmet({
  contentSecurityPolicy: { useDefaults: true, directives: { 'script-src-attr': ["'unsafe-inline'"] } },
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
  credentials: true
}));

app.use(compression());
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1d' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-secreta-muito-forte-para-sessao-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  skip: (req) => process.env.NODE_ENV !== 'production'
});
app.use('/login', loginLimiter);

// Routes
const router = require('./router');
app.use(router);

// 404
app.use((req, res) => {
  res.status(404).render('error', { status: 404, message: 'Página não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
   logger.error('Erro interno', err.message);
   res.status(500).json({ error: 'Erro interno', message: err.message });
});

// Server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  logger.info(`Servidor rodando na porta ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso.`);
    process.exit(1);
  }
});

const gracefulShutdown = (signal) => {
  console.log(`Recebido ${signal}. Encerrando...`);
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Não foi possível encerrar gracefully.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

---

## PASSO 5: Criar Banco de Dados

```javascript
// scripts/create_db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

const setupSQL = `
USE ${process.env.DB_NAME || 'rp_empreendimentos'};

DROP TABLE IF EXISTS auditoria;
DROP TABLE IF EXISTS historico;
DROP TABLE IF EXISTS checklist_usuarios;
DROP TABLE IF EXISTS etapas_obra;
DROP TABLE IF EXISTS obras;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS admins;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  endereco VARCHAR(255),
  obra VARCHAR(150),
  admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE checklist_usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  uso_solo ENUM('Feito','Andamento','Nao Tem') DEFAULT 'Nao Tem',
  licenca ENUM('Feito','Andamento','Nao Tem') DEFAULT 'Nao Tem',
  condominio ENUM('Feito','Andamento','Nao Tem') DEFAULT 'Nao Tem',
  habite_se ENUM('Feito','Andamento','Nao Tem') DEFAULT 'Nao Tem',
  averbacao ENUM('Feito','Andamento','Nao Tem') DEFAULT 'Nao Tem',
  vistoria ENUM('Feito','Andamento','Nao Tem') DEFAULT 'Nao Tem',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE obras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nome_obra VARCHAR(150),
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auditoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT,
  usuario_id INT NOT NULL,
  acao VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE historico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  descricao TEXT,
  admin_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function setup() {
  const conn = await pool.getConnection();
  try {
    console.log('Criando banco de dados...');
    const statements = setupSQL.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) await conn.query(stmt);
    }
    console.log('Banco criado com sucesso!');
  } catch (err) {
    console.error('ERRO:', err.message);
  } finally {
    conn.release();
    await pool.end();
  }
}

setup();
```

---

## PASSO 6: Inicializar Admin

```javascript
// scripts/create_admin.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdmin() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const passwordHash = await bcrypt.hash('admin123', 10);

  try {
    await pool.execute(
      'INSERT INTO admins (nome, email, password) VALUES (?, ?, ?)',
      ['Admin', 'admin@empresa.com', passwordHash]
    );
    console.log('Admin criado!');
    console.log('Email: admin@empresa.com');
    console.log('Senha: admin123');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('Admin já existe!');
    } else {
      console.error('Erro:', err.message);
    }
  } finally {
    await pool.end();
  }
}

createAdmin();
```

---

## PASSO 7: Executar Setup

```bash
# 1. Criar banco no MySQL
mysql -u root -p -e "CREATE DATABASE rp_empreendimentos;"

# 2. Executar script de criação de tabelas
cd src
node ../scripts/create_db.js

# 3. Criar admin inicial
node ../scripts/create_admin.js

# 4. Iniciar servidor
npm run dev
```

---

# 1️⃣5️⃣ ERROS COMUNS E SOLUÇÕES

## Erro 1: EADDRINUSE (Porta já em uso)

**Sintoma**:
```
[ERRO] Porta 5000 já está em uso. Encerrando processo.
```

**Causa**: Outra instância do servidor já está rodando na porta 5000.

**Solução**:
```bash
# Verificar processos usando a porta 5000
netstat -ano | findstr :5000

# Matar processo
taskkill /PID <PID> /F

# OU usar porta diferente
PORT=3000 npm start
```

---

## Erro 2: ER_NO_SUCH_TABLE

**Sintoma**:
```
ER_NO_SUCH_TABLE: Table 'rp_empreendimentos.admins' doesn't exist
```

**Causa**: Banco de dados criado mas tabelas não foram criadas.

**Solução**:
```bash
cd src
node ../scripts/create_db.js
```

---

## Erro 3: ER_ACCESS_DENIED_ERROR

**Sintoma**:
```
ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost' (using password: YES)
```

**Causa**: Credenciais do MySQL incorretas no .env.

**Solução**: Verificar .env e criar banco:
```bash
mysql -u root -p -e "CREATE DATABASE rp_empreendimentos;"
```

---

## Erro 4: ECONNREFUSED

**Sintoma**:
```
ECONNREFUSED: connect ECONNREFUSED 127.0.0.1:3306
```

**Causa**: MySQL não está rodando.

**Solução**:
```bash
net start mysql
```

---

## Erro 5: Session Secret Very Weak

**Sintoma**:
```
Error: session secret must be at least 32 characters
```

**Causa**: SESSION_SECRET muito curta.

**Solução**:
```env
SESSION_SECRET=sua_chave_secreta_muito_forte_aqui_minimo_32_caracteres
```

---

## Erro 6: Cannot set headers after they are sent

**Sintoma**:
```
Error: Cannot set headers after they are sent to the client
```

**Causa**: Tentativa de enviar resposta múltiplas vezes.

**Solução**:
```javascript
// ERRADO
if (!user) {
  res.send('User not found');
}
res.redirect('/dashboard');

// CORRETO
if (!user) {
  return res.send('User not found');
}
return res.redirect('/dashboard');
```

---

## Erro 7: Rate Limit Exceeded

**Sintoma**:
```
429 Too Many Requests
```

**Causa**: Mais de 5 tentativas de login em 15 minutos.

**Solução**: Aguardar 15 minutos.

---

## Erro 8: SQL Injection

**Sintoma**: Dados corrompidos ou acesso não autorizado.

**Causa**: Concatenação direta de valores na query.

**Solução**: Sempre usar prepared statements:
```javascript
// ERRADO
await db.execute(`SELECT * FROM users WHERE email = '${email}'`);

// CORRETO
await db.execute('SELECT * FROM users WHERE email = ?', [email]);
```

---

## Erro 9: Bcrypt Hash Mismatch

**Sintoma**: Login sempre falha mesmo com senha correta.

**Solução**: Verificar hash no banco:
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('admin123', 10);
console.log(hash); // Comparar com banco
```

---

## Erro 10: MySQL Connection Pool Exhausted

**Sintoma**:
```
Error: Cannot acquire connection from the pool
```

**Causa**: Muitas conexões abertas.

**Solução**: Verificar se conexões são liberadas:
```javascript
connection.release(); // Sempre chamar após usar
```

---

# FIM DA DOCUMENTAÇÃO

Esta documentação cobre 100% do sistema RP Empreendimentos. Com estas informações, é possível:
- Entender completamente a arquitetura
- Explicar o sistema para outra pessoa
- Recriar todo o sistema do zero
- Diagnosticar e corrigir problemas

Para recriar o sistema, siga a seção "COMO RECRIAR O SISTEMA DO ZERO" na ordem apresentada.

---

**Documentação gerada em**: Fevereiro 2025
**Sistema**: RP Empreendimentos - Sistema de Gestão de Obras
**Tecnologia**: Node.js + Express + MySQL + Handlebars