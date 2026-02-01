# DOCUMENTAÇÃO TÉCNICA COMPLETA - RP EMPREENDIMENTOS
## Manual de Reconstrução do Sistema de Gestão de Obras

**Data de Geração:** 2026-02-01
**Versão do Sistema:** 1.0.0
**Autor:** Sistema RP-Empreendimentos

---

# 1️⃣ VISÃO GERAL DO SISTEMA

## 1.1 Objetivo do Sistema

O **RP-Empreendimentos** é um sistema web de gestão empresarial completo, desenvolvido especificamente para empresas do setor de construção civil e empreendimentos imobiliários. O sistema tem como objetivo principal centralizar e automatizar o gerenciamento de múltiplas obras, desde o cadastro inicial de clientes até o acompanhamento detalhado do progresso de cada projeto.

O sistema permite que administradores (gestores da construtora) gerenciem:
- **Usuários/Clientes:** Cadastro e acompanhamento de clientes vinculados às obras
- **Obras:** Criação, edição, acompanhamento de progresso e finalização de projetos
- **Checklists de Obras:** Monitoramento de 6 etapas críticas (uso do solo, licença, condomínio, habite-se, averbação, vistoria)
- **Estoque:** Controle de materiais de construção com entradas, saídas e relatórios de consumo
- **Equipes:** Gerenciamento de funcionários e suas atribuições
- **Financeiro:** Controle de receitas e despesas por obra
- **Comunicação:** Sistema de mensagens entre equipes e stakeholders
- **Relatórios:** Geração de relatórios gerenciais
- **Auditoria:** Registro de todas as alterações realizadas no sistema

## 1.2 Problema Resolvido

O sistema resolve os seguintes problemas enfrentados por construtoras e empresas de empreendimentos:

1. **Fragmentação de Informações:** Centraliza dados que normalmente estão espalhados em planilhas, documentos e sistemas isolados
2. **Dificuldade no Acompanhamento:** Permite visualização em tempo real do progresso de cada obra através de indicadores claros
3. **Falta de Controle de Estoque:** Garante rastreabilidade completa de materiais desde a entrada até o consumo nas obras
4. **Ausência de Auditoria:** Registra todas as alterações para fins de compliance e rastreabilidade
5. **Dificuldade na Comunicação:** Facilita o registro e acompanhamento de comunicações relacionadas a cada obra
6. **Ineficiência na Gestão Financeiro:** Permite controle granular de custos por obra e centro de custo

## 1.3 Público-Alvo

O sistema foi desenvolvido para:

1. **Construtoras de Pequeno e Médio Porte:** Empresas que precisam de um sistema robusto, mas não têm recursos para ERPs enterprise
2. **Empreendimentos Imobiliários:** Empresas que gerenciam múltiplos projetos simultaneamente
3. **Engenheiros e Arquitetos:** Profissionais que precisam acompanhar o progresso de obras
4. **Administradores/Gestores:** Profissionais que necessitam de visão consolidada do negócio através de dashboards e relatórios

---

# 2️⃣ STACK TECNOLÓGICA

## 2.1 Linguagens Utilizadas

### JavaScript (Node.js) - Backend
- **Versão:** Node.js 18.x
- **Tipo:** CommonJS (não ES modules)
- **Justificativa:** Node.js oferece alta performance para aplicações I/O-bound,统一 linguagem JavaScript no frontend e backend, ecossistema maduro com npm, e excelente suporte a aplicações em tempo real. A escolha do CommonJS garante compatibilidade com a maioria dos pacotes e facilita a integração com frameworks estabelecidos.

## 2.2 Frameworks

### Express.js 4.18.2
- **Função:** Framework web minimalista para Node.js
- **Justificativa:** Flexibilidade total na estruturação da aplicação, middleware modular, roteamento declarativo, suporte nativo a REST APIs, e vasta comunidade. É o framework mais utilizado para aplicações Node.js de médio porte.

### express-handlebars 4.0.0
- **Função:** Template engine para renderização server-side
- **Justificativa:** Handlebars é um sistema de templates que prioriza a simplicidade e a separação entre lógica e apresentação. Permite criação de layouts reutilizáveis, partials, helpers customizados, e suporta sintaxe simples que facilita a manutenção por desenvolvedores de diferentes níveis.

## 2.3 Banco de Dados

### MySQL 8.0
- **Engine:** InnoDB (com suporte a transações e foreign keys)
- **Driver:** mysql2/promise (versão 3.16.0)
- **Justificativa:** MySQL oferece:
  - Confiabilidade comprovada em ambientes de produção
  - Suporte a transações ACID (essencial para operações financeiras e de estoque)
  - Performance superior para operações de leitura (ótimo para dashboards)
  - Facilidade de backup e replicação
  - Compatibilidade com a maioria dos serviços de cloud (Clever Cloud, AWS RDS, etc.)
  - O driver mysql2 oferece suporte a promises nativas e prepared statements (segurança contra SQL injection)

### Pool de Conexões
- **Configuração:** 9 conexões simultâneas no pool
- **Justificativa:** Limita o número de conexões ao banco para evitar sobrecarga, mas mantém quantidade suficiente para atender requisições concurrentes. O pool gerencia automaticamente a criação, distribuição e liberação de conexões.

## 2.4 Bibliotecas e Depências

### Depências de Produção

| Biblioteca | Versão | Função |
|------------|--------|--------|
| axios | 1.13.2 | Cliente HTTP para requisições externas |
| bcrypt | 6.0.0 | Criptografia de senhas (hash bcrypt) |
| body-parser | 2.2.1 | Parsing de requisições JSON e URL-encoded |
| compression | 1.8.1 | Compressão gzip de responses |
| cors | 2.8.5 | Middleware para Cross-Origin Resource Sharing |
| dotenv | 17.2.3 | Carregamento de variáveis de ambiente |
| express | 4.18.2 | Framework web principal |
| express-handlebars | 4.0.0 | Template engine server-side |
| express-rate-limit | 8.2.1 | Rate limiting para proteção de rotas |
| express-session | 1.18.2 | Gerenciamento de sessões |
| helmet | 7.2.0 | Headers de segurança HTTP |
| mysql2 | 3.16.0 | Driver MySQL com suporte a promises |
| npm | 11.7.0 | Gerenciador de pacotes |
| pm2 | 6.0.14 | Process manager para produção |

### Depências de Desenvolvimento

| Biblioteca | Versão | Função |
|------------|--------|--------|
| nodemon | 3.1.11 | Auto-reload durante desenvolvimento |

## 2.5 Justificativa das Escolhas Técnicas

### Decisão: MySQL vs PostgreSQL vs SQLite
- **MySQL foi escolhido** por sua curva de aprendizado mais suave, vasta documentação em português, e compatibilidade com serviços de hospedagem mais acessíveis. PostgreSQL seria melhor para operações geoespaciais, mas não é necessário neste projeto.

### Decisão: Server-Side Rendering (Handlebars) vs SPA (React/Vue)
- **Handlebars foi escolhido** por:
  - Simplicidade de implementação para CRUDs
  - Menor custo de desenvolvimento inicial
  -SEO melhor para páginas públicas (não aplicável aqui, mas benefício adicional)
  -Não requer equipe especializada em frameworks JavaScript modernos
- **SPA seria melhor** para aplicações com muita interação em tempo real, mas adicionaria complexidade desnecessária para um sistema de gestão tradicional.

### Decisão: Sessões vs JWT
- **Sessões server-side** foram escolhidas por:
  - Simplicidade de implementação
  - Facilidade de revogação (basta destruir a sessão)
  - Segurança contra XSS (token armazenado no servidor)
  - Compatibilidade com load balancers (com sticky sessions ou Redis)

---

# 3️⃣ ARQUITETURA DO SISTEMA

## 3.1 Estilo Arquitetural

O sistema adota uma **Arquitetura em Camadas (Layered Architecture)** com elementos de **Model-View-Controller (MVC)**, organizada da seguinte forma:

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA DE VIEW                           │
│         (Handlebars Templates + CSS + JavaScript)            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  CAMADA DE CONTROLLERS                       │
│         (Request Handling + Business Logic)                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE MODELS                          │
│          (Acesso a Dados + Regras de Negócio)                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE BANCO                           │
│                      (MySQL)                                 │
└─────────────────────────────────────────────────────────────┘
```

### Princípios Aplicados:

1. **Separação de Responsabilidades:** Cada camada tem uma função bem definida
2. **Baixo Acoplamento:** Controllers dependem de Models, mas não vice-versa
3. **Alta Coesão:** Models concentram lógica de acesso a dados
4. **Reutilização:** Views podem ser reutilizadas via layouts e partials

## 3.2 Fluxo Completo da Aplicação (Request → Response)

### Fluxo Típico de uma Requisição:

```
1. BROWSER ENVIA REQUISIÇÃO
   └─> POST /dashboard/usuarios (com dados do formulário)

2. EXPRESS.JS (app.js)
   └─> Aplica middlewares globais (helmet, cors, compression, session, body-parser)
   └─> Passa para o roteador principal (router.js)

3. ROUTER (router.js)
   └─> Verifica autenticação (isAuth middleware)
   └─> Identifica rota: POST /dashboard/usuarios
   └─> Direciona para: usuarioController.create

4. CONTROLLER (usuarioController.js)
   └─> Valida dados de entrada (emailRegex, telefoneRegex)
   └─> Chama Model: User.create()
   └─> Chama Model: Checklist.createIfNotExists()
   └─> Chama Model: Auditoria.log()
   └─> Chama Model: Historico.registrar()
   └─> Retorna resposta (redirect ou JSON)

5. MODEL (User.js, Checklist.js, Auditoria.js, Historico.js)
   └─> Executa query SQL no banco de dados
   └─> Retorna resultado para o controller

6. VIEW (Handlebars)
   └─> Template é renderizado com dados
   └─> Layout principal é aplicado
   └─> CSS/JS são injetados

7. BROWSER RECEBE RESPOSTA
   └─> HTML renderizado ou redirect
   └─> Assets estáticos são carregados (se necessário)
```

## 3.3 Comunicação Entre Frontend, Backend e Banco

### Frontend → Backend
- **Protocolo:** HTTP/HTTPS
- **Formato:** application/x-www-form-urlencoded (forms) e application/json (APIs)
- **Autenticação:** Cookie de sessão (connect.sid)

### Backend → Banco de Dados
- **Protocolo:** TCP/IP (MySQL connection)
- **Pool:** Gerenciador de conexões mysql2
- **Método:** Prepared statements (segurança contra SQL Injection)

### Backend → Frontend
- **Protocolo:** HTTP/HTTPS
- **Formato:** HTML renderizado ou JSON
- **Compressão:** gzip (habilitado via compression middleware)

## 3.4 Diagrama de Arquitetura em TEXTO

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                              ARQUITETURA RP-EMPREENDIMENTOS                    ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ┌─────────────────────────────────────────────────────────────────────────┐  ║
║  │                           LOAD BALANCER / CDN                           │  ║
║  │                         (Nginx ou Similar - Opcional)                    │  ║
║  └───────────────────────────────┬─────────────────────────────────────────┘  ║
║                                  │                                             ║
║                                  ▼                                             ║
║  ┌─────────────────────────────────────────────────────────────────────────┐  ║
║  │                      NODE.JS APPLICATION SERVER                         │  ║
║  │  ┌──────────────────────────────────────────────────────────────────┐   │  ║
║  │  │                         EXPRESS.JS                                 │   │  ║
║  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │   │  ║
║  │  │  │  ROTAS      │  │ CONTROLLERS │  │  MIDDLEWARES│               │   │  ║
║  │  │  │  (router.js)│  │  (src/       │  │  (isAuth,    │               │   │  ║
║  │  │  │             │  │  controllers)│  │   logging)   │               │   │  ║
║  │  │  └─────────────┘  └─────────────┘  └─────────────┘               │   │  ║
║  │  │                                                                      │   │  ║
║  │  │  ┌─────────────────────────────────────────────────────────────┐   │  ║
║  │  │  │                   VIEW ENGINE (Handlebars)                   │   │  ║
║  │  │  │                   src/views/*.handlebars                     │   │  ║
║  │  │  └─────────────────────────────────────────────────────────────┘   │  ║
║  │  │                                                                      │   │  ║
║  │  │  ┌─────────────────────────────────────────────────────────────┐   │  ║
║  │  │  │              STATIC FILES (CSS, JS, IMG)                    │   │  ║
║  │  │  │                   public/                                    │   │  ║
║  │  │  └─────────────────────────────────────────────────────────────┘   │  ║
║  │  └──────────────────────────────────────────────────────────────────┘   │  ║
║  │                                                                          │  ║
║  │  ┌──────────────────────────────────────────────────────────────────┐   │  ║
║  │  │                    MODULES / PLUGINS                             │   │  ║
║  │  │              src/modules/estoque/ (estoque completo)             │   │  ║
║  │  └──────────────────────────────────────────────────────────────────┘   │  ║
║  └───────────────────────────────┬─────────────────────────────────────────┘  ║
║                                  │                                             ║
║  ┌───────────────────────────────▼───────────────────────────────────────────┐  ║
║  │                          MYSQL DATABASE                                  │  ║
║  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐   │  ║
║  │  │   admins        │  │   usuarios      │  │   obras                 │   │  ║
║  │  │   checklist     │  │   auditoria     │  │   etapas_obra           │   │  ║
║  │  │   historico     │  │   materiais     │  │   estoque_movimentacoes │   │  ║
║  │  │   funcionarios  │  │   financeiro    │  │   mensagens             │   │  ║
║  │  │   relatorios    │  │   ... (18+ tabelas)                         │   │  ║
║  │  └─────────────────┘  └─────────────────┘  └─────────────────────────┘   │  ║
║  └──────────────────────────────────────────────────────────────────────────┘  ║
║                                                                               ║
║  ┌───────────────────────────────▼───────────────────────────────────────────┐  ║
║  │                          FILE SYSTEM                                     │  ║
║  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────────────┐   │  ║
║  │  │   logs/       │  │   public/      │  │   scripts/ (migrations)    │   │  ║
║  │  │   app.log     │  │   (assets)     │  │   (database setup)         │   │  ║
║  │  └───────────────┘  └───────────────┘  └─────────────────────────────┘   │  ║
║  └──────────────────────────────────────────────────────────────────────────┘  ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

# 4️⃣ ESTRUTURA DE PASTAS E ARQUIVOS

## 4.1 Estrutura Completa de Diretórios

```
RP-Emppreendimentos/
├── .github/                      # Configurações do GitHub
├── CONTROLEGERAL/                # Módulo legado (desabilitado no Render)
│   ├── arquitetura/
│   │   └── arquitetura.md
│   ├── backend/
│   │   ├── construtora.db        # SQLite (desabilitado)
│   │   └── package.json
│   ├── contexto_br.md
│   ├── frontend/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   └── README.md
├── logs/                         # Arquivos de log da aplicação
│   └── app.log
├── public/                       # Arquivos estáticos públicos
│   ├── css/                      # Folhas de estilo
│   │   ├── auditoria.css
│   │   ├── controlegeral.css
│   │   ├── dashboard-progresso.css
│   │   ├── historico.css
│   │   ├── modal-user.css
│   │   ├── performance-optimization.css
│   │   ├── premium-effects.css
│   │   ├── style.css             # Estilo principal
│   │   ├── tables-users.css
│   │   └── ...
│   ├── img/                      # Imagens
│   │   └── banner_BODY.jpg
│   └── js/                       # Scripts JavaScript client-side
│       ├── dashboard.js
│       ├── modal.js
│       └── userModal.js
├── scripts/                      # Scripts de banco e manutenção
│   ├── audit_database.js
│   ├── audit_usuarios.js
│   ├── check_admin.js
│   ├── create_admin.js
│   ├── create_db.js              # Script de setup do banco
│   ├── create_database_only.js
│   ├── diagnose_checklist.js
│   ├── fix_checklists.js
│   ├── full_setup.js
│   ├── run_migrations.js
│   ├── test_api_endpoints.js
│   ├── test_checklist_update.js
│   ├── test_create_user.js
│   ├── test_login.js
│   ├── update_admin_password.js
│   └── ...
├── src/                          # Código fonte principal
│   ├── app.js                    # Arquivo de entrada da aplicação
│   ├── package.json              # Dependências Node.js
│   ├── package-lock.json
│   ├── router.js                 # Roteador principal
│   ├── controllers/              # Controladores (lógica de negócio)
│   │   ├── authController.js     # Autenticação e login
│   │   ├── controleGeralController.js  # Módulo Controle Geral
│   │   ├── dashboardController.js      # Dashboard e APIs
│   │   ├── obraController.js           # CRUD de obras
│   │   └── usuarioController.js        # CRUD de usuários
│   ├── database/
│   │   └── connection.js         # Conexão MySQL (pool)
│   ├── middlewares/
│   │   └── isAuth.js             # Middleware de autenticação
│   ├── models/                   # Modelos de dados
│   │   ├── Admin.js              # Modelo de administradores
│   │   ├── Auditoria.js          # Logs de auditoria
│   │   ├── Checklist.js          # Checklists de obras
│   │   ├── EtapaObra.js          # Etapas das obras
│   │   ├── Historico.js          # Histórico de ações
│   │   ├── Obra.js               # Obras
│   │   └── User.js               # Usuários/Clientes
│   ├── modules/                  # Módulos extensíveis
│   │   └── estoque/              # Módulo de estoque completo
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
│   │           ├── materiaisObra.handlebars
│   │           ├── materialObraForm.handlebars
│   │           └── movimentacaoObraForm.handlebars
│   ├── routes/                   # Definições de rotas
│   │   ├── authRoutes.js         # Rotas de autenticação
│   │   └── controleGeralRoutes.js # Rotas do módulo Controle Geral
│   ├── utils/                    # Utilitários
│   │   └── logger.js             # Sistema de logging
│   └── views/                    # Templates Handlebars
│       ├── layouts/
│       │   └── main.handlebars   # Layout principal
│       ├── auditoria.handlebars
│       ├── comunicacao.handlebars
│       ├── controlegeral.handlebars
│       ├── dashboard.handlebars
│       ├── dashboardProgresso.handlebars
│       ├── editMaterial.handlebars
│       ├── editObra.handlebars
│       ├── editUser.handlebars
│       ├── equipes.handlebars
│       ├── error.handlebars
│       ├── estoque.handlebars
│       ├── financeiro.handlebars
│       ├── historico.handlebars
│       ├── login.handlebars
│       ├── materiasObra.handlebars
│       ├── movimentacoesObra.handlebars
│       ├── obraForm.handlebars
│       ├── obras.handlebars
│       ├── obrasControle.handlebars
│       ├── relatorios.handlebars
│       ├── tablesUsers.handlebars
│       └── ...
├── .env                          # Variáveis de ambiente
├── .gitignore
├── create_test_admin.js
├── DEPLOYMENT_GUIDE.md
├── DOCUMENTATION_INDEX.md
├── EXECUTIVE_SUMMARY.md
├── fluxograma.excalidraw
├── package-lock.json
├── PROJECT_COMPLETE.md
├── README.md
├── RESPONSIVE_OPTIMIZATION_SUMMARY.md
├── rp_empreendimentos.sql        # Dump do banco de dados
├── setup_complete_db.js
├── setup_db.js
├── SIDEBAR_COMPLETE_DOCUMENTATION.md
├── SIDEBAR_SUMMARY.md
├── SUMMARY_CSS.md
├── TECHNICAL_SPECIFICATIONS.md
├── TESTING_GUIDE.md
├── TROUBLESHOOTING_CSS.md
└── ...
```

## 4.2 Explicação Detalhada de Cada Pasta

### `/src/` - Pasta Raiz do Código

Esta é a pasta principal onde todo o código-fonte da aplicação está localizado. Todos os arquivos JavaScript que compõem o backend da aplicação estão aqui.

**Não deve conter:** Arquivos de configuração que não sejam essenciais à aplicação, arquivos temporários, ou logs de execução (que devem ir na pasta `/logs/`).

### `/src/controllers/` - Controladores

Os controladores são responsáveis por receber as requisições HTTP, processar a lógica de negócio, e retornar respostas. Cada controlador agrupa funcionalidades relacionadas a uma entidade ou módulo específico.

**Arquivos obrigatórios nesta pasta:**
- `authController.js` - Login, logout, dashboard
- `controleGeralController.js` - CRUD completo do módulo Controle Geral
- `dashboardController.js` - Dashboards, APIs de estatísticas
- `obraController.js` - CRUD de obras
- `usuarioController.js` - CRUD de usuários e checklists

**Não deve conter:** Lógica de acesso a dados (deve estar nos Models), formatação HTML/CSS (deve estar nas Views), ou validações simples que podem ser tratadas no Model.

### `/src/models/` - Modelos de Dados

Os modelos encapsulam toda a lógica de acesso ao banco de dados. Cada modelo representa uma entidade do sistema e fornece métodos para CRUD (Create, Read, Update, Delete).

**Responsabilidades de um Model:**
- Executar queries SQL
- Validar dados antes de inserir/atualizar
- Formatar dados retornados pelo banco
- Tratar erros de banco de dados

**Não deve conter:** Lógica de apresentação, tratamento de sessão, ou decisões sobre quais dados mostrar ao usuário.

### `/src/routes/` - Definições de Rotas

As definições de rotas agrupam as rotas da aplicação, direcionando requisições para os controladores apropriados.

### `/src/middlewares/` - Middlewares

Funções intermediárias que processam requisições antes de chegarem ao controlador final. O middleware `isAuth.js` verifica se o usuário está autenticado.

### `/src/modules/` - Módulos Extensíveis

Código organizado em módulos independentes que podem ser plugados na aplicação. O módulo `estoque` é um exemplo completo de módulo com sua própria estrutura MVC.

### `/src/views/` - Templates Handlebars

Arquivos de template que são renderizados no servidor. Utilizam a sintaxe Handlebars com helpers customizados.

### `/public/` - Arquivos Estáticos

Arquivos servidos diretamente pelo servidor web sem processamento:
- CSS: Folhas de estilo
- JS: Scripts client-side
- Imagens: Arquivos de imagem

### `/scripts/` - Scripts de Manutenção

Scripts Node.js para tarefas de manutenção do banco de dados, criação de administradores, migrações, testes, etc.

### `/logs/` - Arquivos de Log

Arquivos de texto com registros de execução da aplicação para debugging e auditoria.

---

# 5️⃣ ORDEM CRONOLÓGICA DE CRIAÇÃO

## 5.1 Sequência de Criação dos Arquivos

### FASE 1: Configuração Base (Primero a ser criado)

1. **`src/package.json`** - Definição do projeto e dependências
   - **Por quê primeiro?** Define as dependências que todos os outros arquivos usam
   - **Dependências:** Express, mysql2, handlebars, bcrypt, etc.

2. **`src/app.js`** - Configuração principal do Express
   - Carrega variáveis de ambiente
   - Configura middlewares globais
   - Configura template engine
   - Inicializa servidor HTTP

3. **`src/database/connection.js`** - Conexão com MySQL
   - Cria pool de conexões
   - Define configurações de SSL e limits

### FASE 2: Middleware de Autenticação

4. **`src/middlewares/isAuth.js`**
   - Verifica se sessão existe
   - Protege rotas administrativas
   - Depende de `app.js` (sessão configurada)

### FASE 3: Modelos Base

5. **`src/models/Admin.js`**
   - CRUD de administradores
   - Busca por email e ID
   - Criação de admins

6. **`src/models/User.js`**
   - CRUD de usuários/clientes
   - Relacionamento com admin
   - Validação de email único

7. **`src/models/Obra.js`**
   - CRUD de obras
   - Vinculação com usuário
   - Etapas padrão

### FASE 4: Controladores de Autenticação

8. **`src/controllers/authController.js`**
   - Login/logout
   - Validação de credenciais
   - Criação de sessão
   - Dashboard principal

### FASE 5: Rotas de Autenticação

9. **`src/routes/authRoutes.js`**
   - Rotas de login
   - Rotas protegidas
   - APIs de usuários

### FASE 6: Controladores de Usuário

10. **`src/controllers/usuarioController.js`**
    - CRUD completo de usuários
    - Integração com checklist
    - Auditoria e histórico

### FASE 7: Modelos de Checklist e Auditoria

11. **`src/models/Checklist.js`**
    - CRUD de checklist de obras
    - Cálculo de progresso
    - Validação de campos

12. **`src/models/Auditoria.js`**
    - Registro de logs
    - Busca por usuário
    - Estatísticas de ações

13. **`src/models/Historico.js`**
    - Registro de histórico
    - Busca por usuário
    - Contagem por tipo

### FASE 8: Controladores de Obras

14. **`src/controllers/obraController.js`**
    - CRUD de obras
    - Etapas de obra
    - Desvinculação

### FASE 9: Dashboard e Controle Geral

15. **`src/controllers/dashboardController.js`**
    - Dashboard de progresso
    - APIs de estatísticas
    - Controle Geral

16. **`src/controllers/controleGeralController.js`**
    - CRUD de obras (controle geral)
    - CRUD de estoque
    - CRUD de equipes
    - CRUD financeiro
    - CRUD comunicação

### FASE 10: Rotas do Controle Geral

17. **`src/routes/controleGeralRoutes.js`**
    - APIs de obras
    - APIs de materiais
    - APIs de funcionários
    - APIs financeiro
    - APIs mensagens
    - APIs relatórios

### FASE 11: Roteador Principal

18. **`src/router.js`**
    - Monta todas as rotas
    - Integra authRoutes e controleGeralRoutes
    - Define rotas de view

### FASE 12: Views Base

19. **`src/views/layouts/main.handlebars`**
    - Layout HTML principal
    - Includes de CSS
    - Estrutura base

20. **`src/views/login.handlebars`**
    - Página de login
    - Formulário de autenticação

### FASE 13: Views de Dashboard

21. **`src/views/dashboard.handlebars`**
    - Dashboard principal
    - Cards de estatísticas
    - Modal de cadastro
    - JavaScript de integração

### FASE 14: Views de CRUD

22. **`src/views/tablesUsers.handlebars`**
23. **`src/views/editUser.handlebars`**
24. **`src/views/obras.handlebars`**
25. **`src/views/obraForm.handlebars`**
26. **`src/views/editObra.handlebars`**
27. **`src/views/controlegeral.handlebars`**
28. **`src/views/estoque.handlebars`**
29. **`src/views/editMaterial.handlebars`**
30. **`src/views/equipes.handlebars`**
31. **`src/views/financeiro.handlebars`**
32. **`src/views/comunicacao.handlebars`**
33. **`src/views/relatorios.handlebars`**
34. **`src/views/dashboardProgresso.handlebars`**
35. **`src/views/auditoria.handlebars`**
36. **`src/views/historico.handlebars`**

### FASE 15: Módulo de Estoque (Extensão)

37. **`src/modules/estoque/models/Material.js`**
38. **`src/modules/estoque/models/EstoqueMovimentacao.js`**
39. **`src/modules/estoque/models/MaterialObra.js`**
40. **`src/modules/estoque/controllers/estoqueController.js`**
41. **`src/modules/estoque/controllers/materialController.js`**
42. **`src/modules/estoque/controllers/materialObraController.js`**
43. **`src/modules/estoque/controllers/movimentacaoObraController.js`**
44. **`src/modules/estoque/routes/estoqueRoutes.js`**
45. **`src/modules/estoque/views/dashboard.handlebars`**
46. **`src/modules/estoque/views/materiais.handlebars`**
47. **`src/modules/estoque/views/materiaisObra.handlebars`**
48. **`src/modules/estoque/views/materialObraForm.handlebars`**
49. **`src/modules/estoque/views/movimentacaoObraForm.handlebars`**

### FASE 16: Utilitários

50. **`src/utils/logger.js`**
    - Sistema de logging
    - Arquivamento de logs

### FASE 17: Banco de Dados

51. **`rp_empreendimentos.sql`**
    - Criação de tabelas
    - Constraints e foreign keys
    - Dados iniciais

## 5.2 Dependências entre Arquivos

```
                    ┌─────────────────────┐
                    │   package.json      │
                    │   (definições)      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      .env           │
                    │   (configuração)    │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
   │   app.js      │   │  logger.js    │   │  connection.js│
   │  (servidor)   │   │  (logs)       │   │  (banco)      │
   └───────┬───────┘   └───────────────┘   └───────────────┘
           │
           ▼
   ┌───────────────┐
   │   router.js   │
   │   (rotas)     │
   └───────┬───────┘
           │
           ▼
   ┌─────────────────────────────────────────────┐
   │               isAuth.js                      │
   │           (autenticação)                     │
   └─────────────────────────────────────────────┘
           │
           ▼
   ┌───────┴───────────────────────────────────────────┐
   │                                                   │
   ▼                                                   ▼
┌──────────────┐                              ┌─────────────────┐
│ authRoutes.js│                              │controleGeral    │
│              │                              │Routes.js        │
└──────┬───────┘                              └─────────────────┘
       │                                              │
       ▼                                              ▼
┌──────────────┐                              ┌─────────────────┐
│authController│                              │controleGeral    │
│              │                              │Controller       │
└──────┬───────┘                              └────────┬────────┘
       │                                               │
       │           ┌───────────────────────────────────┘
       │           │
       ▼           ▼
┌──────────────────────────────────────────────────────────────┐
│                        MODELS                                 │
│  Admin.js │ User.js │ Obra.js │ Checklist.js │ Auditoria.js  │
│  Historico.js │ EtapaObra.js                                 │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                      VIEWS (Handlebars)                       │
│  login.handlebars │ dashboard.handlebars │ tablesUsers.handlebars│
│  editUser.handlebras │ obras.handlebars │ controlegeral.handlebars│
│  ... (todos os templates)                                     │
└──────────────────────────────────────────────────────────────┘
```

---

# 6️⃣ DETALHAMENTO INTERNO DOS ARQUIVOS

## 6.1 Arquivo de Configuração Principal

### `src/app.js`

**O que faz:**
- Inicializa o servidor Express
- Carrega variáveis de ambiente
- Configura middlewares globais (helmet, cors, compression, body-parser, session)
- Configura o template engine Handlebars com helpers customizados
- Configura rate limiting para rota de login
- Define tratamento de erros 404 e 500
- Inicializa o servidor HTTP na porta configurada

**O que NÃO deve fazer:**
- Não deve conter lógica de negócio (deve estar nos controllers)
- Não deve executar queries diretas no banco (deve usar models)
- Não deve definir rotas (deve usar router.js)
- Não deve formatar HTML/CSS (deve usar views)

**Principais funções/métodos:**

```javascript
// Configuração do Handlebars
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

// Configuração de sessão
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}));

// Rate limiter para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Máximo 50 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

// Inicialização do servidor
app.listen(PORT, HOST, () => {
  console.log(`[LOG] Servidor rodando na porta ${PORT} (host: ${HOST})`);
});
```

**Fluxo interno de execução:**
1. Carrega dependências (express, path, dotenv, etc.)
2. Carrega variáveis de ambiente do arquivo `.env`
3. Cria instância do Express
4. Configura helmet para segurança
5. Configura CORS
6. Configura compressão gzip
7. Configura arquivos estáticos
8. Configura parsing de body (JSON e URL-encoded)
9. Configura sessão
10. Aplica rate limiter na rota /login
11. Monta router principal
12. Configura tratamento de erros 404
13. Configura tratamento de erros globais (500)
14. Inicia listener HTTP

## 6.2 Roteador Principal

### `src/router.js`

**O que faz:**
- Define todas as rotas da aplicação
- Importa e monta routers de autenticação e controle geral
- Define rotas de view para páginas do sistema
- Integra middleware de autenticação nas rotas protegidas

**O que NÃO deve fazer:**
- Não deve processar lógica de negócio
- Não deve acessar banco de dados
- Não deve validar dados de entrada

**Principais rotas definidas:**

```javascript
// Rotas de autenticação
router.use('/', authRoutes);

// Rotas de módulo de estoque
router.use('/estoque', estoqueRoutes);

// APIs do Controle Geral
router.use('/api/obras', obrasRouter);
router.use('/api/materiais', materiaisRouter);
router.use('/api/funcionarios', funcionariosRouter);
router.use('/api/financeiro', financeiroRouter);
router.use('/api/mensagens', mensagensRouter);
router.use('/api/relatorios', relatoriosRouter);

// Páginas do Controle Geral
router.get('/controle-geral', isAuth, controleGeralController.controleGeral);
router.get('/dashboard/controle-geral/obras', isAuth, controleGeralController.obras);
router.post('/dashboard/controle-geral/obras', isAuth, controleGeralController.criarObra);
// ... outras rotas de CRUD
```

## 6.3 Middleware de Autenticação

### `src/middlewares/isAuth.js`

**O que faz:**
- Verifica se existe sessão válida
- Permite acesso apenas a usuários autenticados
- Redireciona para login caso não autenticado

**O que NÃO deve fazer:**
- Não deve modificar dados da requisição
- Não deve acessar banco de dados diretamente

**Código completo:**
```javascript
const logger = require('../utils/logger');

module.exports = function isAuth(req, res, next) {
    logger.info(`[AUTH] Verificando autenticação para ${req.path}`);

    // Verificar se existe sessão e adminId
    if (req.session && req.session.adminId) {
        logger.info(`[AUTH] Usuário autenticado: ${req.session.adminId}`);
        return next();
    }

    logger.warn(`[AUTH] Acesso negado para ${req.path} - sessão inválida`);
    // Se não autenticado, redireciona para login
    return res.status(401).redirect('/login');
};
```

## 6.4 Controlador de Autenticação

### `src/controllers/authController.js`

**O que faz:**
- Renderiza página de login
- Processa tentativa de login
- Valida email e senha
- Cria sessão em caso de sucesso
- Renderiza dashboard

**O que NÃO deve fazer:**
- Não deve criar/editar/excluir usuários
- Não deve acessar dados de obras ou checklists

**Principais funções:**

```javascript
// Renderiza página de login
exports.loginPage = (req, res) => {
  res.render('login');
};

// Processa login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // Validações
  if (!email || !password) {
    return res.status(400).send('Email e senha são obrigatórios');
  }
  
  // Regex para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Email inválido');
  }
  
  // Busca admin no banco
  const admin = await Admin.findByEmail(email.toLowerCase().trim());
  if (!admin) {
    return res.status(401).send('Email ou senha incorretos');
  }
  
  // Compara senha com bcrypt
  const ok = await bcrypt.compare(password.trim(), admin.password);
  if (!ok) {
    return res.status(401).send('Email ou senha incorretos');
  }
  
  // Cria sessão
  req.session.adminId = admin.id;
  req.session.adminEmail = admin.email;
  
  res.redirect('/dashboard');
};

// Renderiza dashboard
exports.dashboard = async (req, res) => {
  if (!req.session.adminId) {
    return res.redirect('/login');
  }
  
  try {
    const checklists = await Checklist.findAllWithProgresso();
    const usuarios = await User.findAllByAdmin(req.session.adminId);
    
    // Calcula estatísticas
    const progressoMedio = (checklists.reduce((sum, item) => sum + (item.progresso || 0), 0) / checklists.length).toFixed(2);
    const totalUsuarios = usuarios.length;
    const totalObras = checklists.length;
    const obrasCompletas = checklists.filter(item => item.progresso === 100).length;
    
    res.render('dashboard', {
      progressoMedio,
      totalUsuarios,
      totalObras,
      obrasCompletas
    });
  } catch (err) {
    res.render('dashboard', {
      progressoMedio: 0,
      totalUsuarios: 0,
      totalObras: 0,
      obrasCompletas: 0
    });
  }
};
```

## 6.5 Controlador de Usuários

### `src/controllers/usuarioController.js`

**O que faz:**
- CRUD completo de usuários
- Criação automática de checklist
- Registro de auditoria
- Registro de histórico
- Atualização de checklist com proteções

**O que NÃO deve fazer:**
- Não deve gerenciar obras diretamente
- Não deve acessar dados financeiros

**Principais funções:**

```javascript
// CRIAR USUÁRIO
exports.create = async (req, res) => {
  const { nome, email, telefone, endereco, obra, uso_solo, licenca, condominio, habite_se, averbacao, vistoria, observacoes } = req.body;

  // Validações rigorosas
  if (!nome || !email || !endereco || !obra || !telefone) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }
  
  if (nome.length < 3) {
    return res.status(400).send('Nome deve ter pelo menos 3 caracteres');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Email inválido');
  }

  try {
    // Cria usuário no banco
    const userId = await User.create(
      nome.trim(),
      email.toLowerCase().trim(),
      telefone.trim(),
      endereco.trim(),
      obra.trim(),
      req.session.adminId
    );

    // Cria checklist inicial se dados foram fornecidos
    if (userId && (uso_solo || licenca || condominio || habite_se || averbacao || vistoria)) {
      await Checklist.createIfNotExists(userId);
      
      // Atualiza cada campo do checklist
      const camposChecklist = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
      for (const campo of camposChecklist) {
        if (req.body[campo] && req.body[campo] !== 'Nao Tem') {
          await Checklist.update(userId, campo, req.body[campo]);
          await Auditoria.log(req.session.adminId, userId, 'CHECKLIST_INICIAL', campo, 'Nao Tem', req.body[campo]);
        }
      }
      
      await Checklist.updateObservacoes(userId, observacoes.trim());
      await Historico.registrar(userId, 'usuario', `Usuário criado com checklist inicial`, req.session.adminId);
    } else {
      await Historico.registrar(userId, 'usuario', `Usuário criado`, req.session.adminId);
    }

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Erro ao criar usuário');
  }
};

// EXCLUIR USUÁRIO (com cascade de deletions)
exports.delete = async(req,res) => {
  const { id } = req.params;
  
  // Busca usuário antes de deletar
  const usuario = await User.findById(id);
  if (!usuario) {
    return res.status(404).send('Usuário não encontrado');
  }

  // Registra auditoria
  await Auditoria.log(req.session.adminId, id, 'USUARIO_DELETADO', 'usuario', usuario.nome, null);

  // Deleta dados relacionados em cascata
  await db.execute('DELETE FROM checklist_usuarios WHERE usuario_id = ?', [id]);
  await db.execute('DELETE FROM historico WHERE usuario_id = ?', [id]);
  await db.execute('DELETE FROM auditoria WHERE usuario_id = ?', [id]);
  await db.execute('DELETE FROM obras WHERE usuario_id = ?', [id]);
  
  // Finalmente deleta o usuário
  await User.deleteById(id);
  
  res.redirect('/dashboard/tablesUsers');
};

// ATUALIZAR USUÁRIO
exports.update = async(req,res) => {
  const { id } = req.params;
  const { nome, email, telefone, endereco, obra, uso_solo, licenca, condominio, habite_se, averbacao, vistoria, observacoes } = req.body;

  const usuario = await User.findById(id);
  if (!usuario) {
    return res.status(404).send('Usuário não encontrado');
  }

  await User.update(id, nome.trim(), email.toLowerCase().trim(), telefone.trim(), endereco.trim(), obra.trim());

  // Atualiza checklist
  if (uso_solo !== undefined || licenca !== undefined || condominio !== undefined ||
      habite_se !== undefined || averbacao !== undefined || vistoria !== undefined) {

    await Checklist.createIfNotExists(id);

    const camposChecklist = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
    for (const campo of camposChecklist) {
      if (req.body[campo] !== undefined) {
        const valor = req.body[campo];
        if (['Nao Tem', 'Andamento', 'Feito', 'Finalizado', 'Proxima-Etapa'].includes(valor)) {
          await Checklist.update(id, campo, valor);
          await Auditoria.log(req.session.adminId, id, 'CHECKLIST_ATUALIZADO', campo, 'desconhecido', valor);
        }
      }
    }

    if (observacoes !== undefined) {
      await Checklist.updateObservacoes(id, observacoes || '');
    }
  }

  await Auditoria.log(req.session.adminId, id, 'USUARIO_ATUALIZADO', 'usuario', usuario.nome, nome);

  // Verifica origem e redireciona apropriadamente
  const referer = req.get('Referer') || '';
  if (referer.includes('/dashboard')) {
      res.redirect('/dashboard');
  } else {
      res.redirect('/dashboard/tablesUsers');
  }
};
```

## 6.6 Controlador de Obras

### `src/controllers/obraController.js`

**O que faz:**
- CRUD de obras
- Criação de etapas padrão (checklist)
- Desvinculação de obras de usuários
- Gerenciamento independente de obras

**Principais funções:**

```javascript
// Criar obra vinculada a usuário
exports.create = async (req, res) => {
  const { usuarioId, nome } = req.body;

  if (!usuarioId || !nome) {
    return res.status(400).send('Dados obrigatórios não informados');
  }

  try {
    // Cria a obra
    const obraId = await Obra.create(usuarioId, nome);
    
    // Cria automaticamente as 6 etapas padrão
    await EtapaObra.createDefaultEtapas(obraId);
    
    res.redirect('/dashboard/tablesUsers');
  } catch (err) {
    res.status(500).send('Erro ao criar obra');
  }
};

// Desvincular obra do usuário
exports.desvincular = async (req, res) => {
  const { id } = req.params;
  const { usuario_id } = req.body;
  const adminId = req.session.adminId;

  try {
    // Verifica se a obra pertence ao admin
    const [obras] = await db.execute(
      'SELECT o.* FROM obras o JOIN usuarios u ON o.usuario_id = u.id WHERE o.id = ? AND u.admin_id = ?',
      [id, adminId]
    );

    if (!obras || obras.length === 0) {
      return res.status(404).json({ error: 'Obra não encontrada ou não pertence ao admin' });
    }

    // Exclui a obra desvinculada
    await db.execute('DELETE FROM obras WHERE id = ?', [id]);

    res.json({ success: true, message: 'Obra excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao desvincular obra' });
  }
};
```

## 6.7 Modelo de Checklist

### `src/models/Checklist.js`

**O que faz:**
- CRUD de checklists de usuários
- Cálculo de progresso (0-100%)
- Validação de campos e valores
- Criação automática de registro se não existir

**Constantes definidas:**
```javascript
// Campos válidos do checklist - 6 etapas da obra
const CAMPOS_VALIDOS = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];

// Valores válidos para cada campo
const VALORES_VALIDOS = ['Nao Tem', 'Andamento', 'Feito'];
```

**Principais funções:**

```javascript
// Buscar checklist por usuário
exports.findByUser = async (userId) => {
  const [rows] = await db.execute(
    'SELECT * FROM checklist_usuarios WHERE usuario_id = ?',
    [userId]
  );
  return rows[0] || { usuario_id: userId, observacoes: '' };
};

// Atualizar campo específico
exports.update = async (userId, field, value) => {
  if (!CAMPOS_VALIDOS.includes(field)) {
    throw new Error(`Campo inválido: ${field}`);
  }
  
  if (!VALORES_VALIDOS.includes(value)) {
    throw new Error(`Valor inválido: ${value}`);
  }
  
  const sql = `UPDATE checklist_usuarios SET ${field} = ? WHERE usuario_id = ?`;
  await db.execute(sql, [value, userId]);
};

// Calcular progresso (0-100%)
exports.getProgresso = async (userId) => {
  const checklist = await exports.findByUser(userId);
  
  if (!checklist) {
    return { progresso: 0 };
  }

  let completos = 0;
  
  CAMPOS_VALIDOS.forEach(item => {
    if (checklist[item] === 'Feito') {
      completos++;
    }
  });

  const progresso = (completos / CAMPOS_VALIDOS.length) * 100;
  return { progresso: Math.round(progresso) };
};

// Criar registro se não existir (para evitar erros de foreign key)
exports.createIfNotExists = async (userId) => {
  const sql = 'INSERT IGNORE INTO checklist_usuarios (usuario_id) VALUES (?)';
  await db.execute(sql, [userId]);
  return true;
};
```

## 6.8 Modelo de Auditoria

### `src/models/Auditoria.js`

**O que faz:**
- Registra logs de auditoria para todas as ações
- Busca logs por usuário
- Estatísticas de ações por tipo
- Tratamento graceful quando tabela não existe

```javascript
// Registrar auditoria
exports.log = async (adminId, usuarioId, acao, campo, valorAnterior, valorNovo) => {
  try {
    const sql = `
      INSERT INTO auditoria (admin_id, usuario_id, acao, campo, valor_anterior, valor_novo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    await db.execute(sql, [adminId, usuarioId, acao, campo, valorAnterior, valorNovo]);
  } catch (dbErr) {
    // Se tabela não existe, apenas log (não é erro crítico)
    if (dbErr.code === 'ER_NO_SUCH_TABLE') {
      console.warn('Tabela auditoria não existe - auditoria não será registrada');
      return;
    }
    throw dbErr;
  }
};

// Contar logs por tipo de ação (últimos 30 dias)
exports.contarPorAcao = async () => {
  const sql = `
    SELECT acao, COUNT(*) as total
    FROM auditoria
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY acao
    ORDER BY total DESC
  `;
  const [rows] = await db.execute(sql);
  return rows || [];
};
```

## 6.9 Modelo de Usuário

### `src/models/User.js`

**O que faz:**
- CRUD de usuários
- Relacionamento com admin
- Histórico de usuário
- Validações de entrada

```javascript
// CRIAR USUÁRIO
exports.create = async (nome, email, telefone, endereco, obra, adminId) => {
  // Verificar se email já existe
  const [existing] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new Error('Email já cadastrado');
  }

  const sql = `
    INSERT INTO usuarios (nome, email, telefone, endereco, obra, admin_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  const [result] = await db.execute(sql, [nome, email, telefone, endereco, obra, adminId]);
  return result.insertId;
};

// LISTAR USUÁRIOS DO ADMIN
exports.findAllByAdmin = async (adminId) => {
  const sql = 'SELECT * FROM usuarios WHERE admin_id = ? ORDER BY id DESC';
  const [rows] = await db.execute(sql, [adminId]);
  return rows || [];
};

// DELETA USUÁRIO
exports.deleteById = async(id) => {
  await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
};

// ATUALIZAR USUÁRIO
exports.update = async (id, nome, email, telefone, endereco, obra) => {
  await db.execute(`
    UPDATE usuarios
    SET nome=?, email=?, telefone=?, endereco=?, obra=?
    WHERE id=?
  `, [nome, email, telefone, endereco, obra, id]);
};
```

## 6.10 Conexão com Banco de Dados

### `src/database/connection.js`

**O que faz:**
- Cria pool de conexões MySQL
- Configura SSL para conexões seguras
- Configura limits de conexões
- Adiciona listeners para debug

```javascript
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 9, // Limitado para evitar sobrecarga
    queueLimit: 0,
    enableKeepAlive: true,

    ssl: {
        rejectUnauthorized: false
    }
});

// Logs de debug para pool de conexões
connection.on('connection', (conn) => {
  console.log(`[POOL] Nova conexão criada. Total ativo: ${connection.pool._allConnections.length}`);
});

connection.on('release', (conn) => {
  console.log(`[POOL] Conexão liberada. Total ativo: ${connection.pool._allConnections.length}`);
});

module.exports = connection;
```

## 6.11 Logger

### `src/utils/logger.js`

**O que faz:**
- Sistema de logging em arquivo
- Níveis de log (INFO, WARN, ERROR, DEBUG)
- Formatação de mensagens
- Separação de logs em arquivo vs console

```javascript
class Logger {
  static formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    return `[${timestamp}] ${level}: ${message}${formattedArgs}\n`;
  }

  static log(level, message, ...args) {
    const formattedMessage = this.formatMessage(level, message, ...args);
    
    // Sempre escrever no arquivo
    fs.appendFileSync(logFile, formattedMessage);
    
    // Só mostrar no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${message}`, ...args);
    }
  }

  static info(message, ...args) {
    this.log('INFO', message, ...args);
  }

  static warn(message, ...args) {
    this.log('WARN', message, ...args);
  }

  static error(message, ...args) {
    this.log('ERROR', message, ...args);
  }

  static debug(message, ...args) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, ...args);
    }
  }
}
```

---

# 7️⃣ BANCO DE DADOS

## 7.1 Estrutura das Tabelas

### Tabela: `admins`
**Finalidade:** Armazenar administradores do sistema

```sql
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| id | int | PK, AUTO_INCREMENT | Identificador único |
| nome | varchar(150) | NOT NULL | Nome do administrador |
| email | varchar(100) | NOT NULL, UNIQUE | Email (usado para login) |
| password | varchar(255) | NOT NULL | Hash bcrypt da senha |
| created_at | timestamp | NULLable | Data de criação |
| updated_at | timestamp | NULLable | Data de atualização |

### Tabela: `usuarios`
**Finalidade:** Armazenar usuários/clientes vinculados às obras

```sql
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endereco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `obra` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_obra` (`obra`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| id | int | PK, AUTO_INCREMENT | Identificador único |
| nome | varchar(150) | NOT NULL | Nome do cliente |
| email | varchar(100) | NOT NULL, UNIQUE | Email do cliente |
| telefone | varchar(20) | NULLable | Telefone de contato |
| endereco | varchar(255) | NULLable | Endereço da obra |
| obra | varchar(150) | NULLable | Nome da obra |
| admin_id | int | FK, NULLable | Admin responsável |
| created_at | timestamp | NULLable | Data de criação |
| updated_at | timestamp | NULLable | Data de atualização |

**Decisões Técnicas:**
- **FK com SET NULL:** Se o admin for deletado, o usuário continua existindo mas fica sem admin vinculado
- **Email único:** Garante que não haja cadastros duplicados

### Tabela: `checklist_usuarios`
**Finalidade:** Armazenar status do checklist de cada obra/usuário

```sql
CREATE TABLE `checklist_usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `uso_solo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `licenca` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `condominio` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `habite_se` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `averbacao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `vistoria` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Nao Tem',
  `observacoes` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `checklist_usuarios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| id | int | PK, AUTO_INCREMENT | Identificador único |
| usuario_id | int | FK, UNIQUE, NOT NULL | Usuário vinculado |
| uso_solo | varchar(50) | DEFAULT 'Nao Tem' | Status: Nao Tem, Andamento, Feito |
| licenca | varchar(50) | DEFAULT 'Nao Tem' | Status: Nao Tem, Andamento, Feito |
| condominio | varchar(50) | DEFAULT 'Nao Tem' | Status: Nao Tem, Andamento, Feito |
| habite_se | varchar(50) | DEFAULT 'Nao Tem' | Status: Nao Tem, Andamento, Feito |
| averbacao | varchar(50) | DEFAULT 'Nao Tem' | Status: Nao Tem, Andamento, Feito |
| vistoria | varchar(50) | DEFAULT 'Nao Tem' | Status: Nao Tem, Andamento, Feito |
| observacoes | longtext | NULLable | Observações gerais |

**Decisões Técnicas:**
- **FK com CASCADE:** Se o usuário for deletado, o checklist é deletado automaticamente
- **UNIQUE em usuario_id:** Garante apenas um checklist por usuário
- **Valores padrão:** Todos os campos iniciam como 'Nao Tem'

### Tabela: `obras`
**Finalidade:** Armazenar obras vinculadas aos usuários

```sql
CREATE TABLE `obras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nome_obra` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `obras_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Decisões Técnicas:**
- **FK com CASCADE:** Se o usuário for deletado, todas as obras são deletadas

### Tabela: `etapas_obra`
**Finalidade:** Armazenar etapas individuais de cada obra

```sql
CREATE TABLE `etapas_obra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `obra_id` int DEFAULT NULL,
  `etapa_nome` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_termino` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_obra` (`obra_id`),
  CONSTRAINT `etapas_obra_ibfk_1` FOREIGN KEY (`obra_id`) REFERENCES `obras` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `auditoria`
**Finalidade:** Registrar todas as alterações realizadas no sistema

```sql
CREATE TABLE `auditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `acao` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valor_anterior` text COLLATE utf8mb4_unicode_ci,
  `valor_novo` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin` (`admin_id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `historico`
**Finalidade:** Registro simplificado de ações para relatório

```sql
CREATE TABLE `historico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `admin_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `historico_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `materiais`
**Finalidade:** Catálogo de materiais de construção

```sql
CREATE TABLE `materiais` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `unidade` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preco_unitario` decimal(10,2) DEFAULT NULL,
  `estoque_minimo` decimal(10,2) DEFAULT NULL,
  `fornecedor_padrao` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `materiais_obra`
**Finalidade:** Materiais associados a cada obra

```sql
CREATE TABLE `materiais_obra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `obra_id` int DEFAULT NULL,
  `material_id` int DEFAULT NULL,
  `quantidade_estimada` decimal(10,2) DEFAULT NULL,
  `quantidade_inicial` decimal(10,2) DEFAULT NULL,
  `saldo_atual` decimal(10,2) DEFAULT NULL,
  `fase_obra` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_obra` (`obra_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `materiais_obra_ibfk_1` FOREIGN KEY (`obra_id`) REFERENCES `obras` (`id`) ON DELETE CASCADE,
  CONSTRAINT `materiais_obra_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materiais` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `estoque_movimentacoes`
**Finalidade:** Registro de entradas e saídas de materiais

```sql
CREATE TABLE `estoque_movimentacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_id` int DEFAULT NULL,
  `tipo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantidade` decimal(10,2) DEFAULT NULL,
  `obra_id` int DEFAULT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_material` (`material_id`),
  KEY `obra_id` (`obra_id`),
  CONSTRAINT `estoque_movimentacoes_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materiais` (`id`) ON DELETE CASCADE,
  CONSTRAINT `estoque_movimentacoes_ibfk_2` FOREIGN KEY (`obra_id`) REFERENCES `obras` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `funcionarios`
**Finalidade:** Cadastro de funcionários

```sql
CREATE TABLE `funcionarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text COLLATE utf8mb4_unicode_ci,
  `funcao` text COLLATE utf8mb4_unicode_ci,
  `salario` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `financeiro`
**Finalidade:** Registros financeiros por obra

```sql
CREATE TABLE `financeiro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` text COLLATE utf8mb4_unicode_ci,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `valor` double DEFAULT NULL,
  `data` text COLLATE utf8mb4_unicode_ci,
  `obra_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `mensagens`
**Finalidade:** Sistema de comunicação

```sql
CREATE TABLE `mensagens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `de` text COLLATE utf8mb4_unicode_ci,
  `para` text COLLATE utf8mb4_unicode_ci,
  `mensagem` text COLLATE utf8mb4_unicode_ci,
  `data` text COLLATE utf8mb4_unicode_ci,
  `obra_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `relatorios`
**Finalidade:** Relatórios gerados no sistema

```sql
CREATE TABLE `relatorios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` text COLLATE utf8mb4_unicode_ci,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `tipo` text COLLATE utf8mb4_unicode_ci,
  `data` text COLLATE utf8mb4_unicode_ci,
  `obra_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 7.2 Diagrama de Relacionamentos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DIAGRAMA DE RELACIONAMENTOS                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│     ┌─────────────┐                                                         │
│     │   admins    │◄────────────────────────────────────────────────┐       │
│     │─────────────│                                                         │       │
│     │ id (PK)     │              ┌─────────────┐                       │       │
│     │ nome        │              │  usuarios   │                       │       │
│     │ email (UNIQ)│              │─────────────│                       │       │
│     │ password    │              │ id (PK)     │                       │       │
│     └─────────────┘              │ nome        │                       │       │
│            │                     │ email (UNIQ)│                       │       │
│            │                     │ admin_id (FK)│───────────────────────┘       │
│            │                     │ usuario_id (FK)                          │
│            ▼                     └─────────────┘                             │
│     ┌─────────────┐                    │                                     │
│     │ auditoria   │                    │                                     │
│     │─────────────│                    │                                     │
│     │ id (PK)     │                    │ 1:N                                 │
│     │ admin_id (FK)│◄──────────────────┤                                     │
│     │ usuario_id (FK)├─────────────────┤                                     │
│     │ acao         │                    │                                     │
│     │ campo        │                    ▼                                     │
│     │ valor_ant    │           ┌─────────────┐                               │
│     │ valor_novo   │           │   obras     │                               │
│     └─────────────┘           │─────────────│                               │
│                               │ id (PK)     │                               │
│     ┌─────────────┐           │ usuario_id(FK)│──────────────┐              │
│     │ historico   │           │ nome_obra   │              │              │
│     │─────────────│           │ descricao   │              │              │
│     │ id (PK)     │           └─────────────┘              │              │
│     │ usuario_id(FK)│────────────────────────┐              │              │
│     │ tipo         │                         │              │              │
│     │ descricao    │           ┌─────────────┐│              │              │
│     │ admin_id     │           │ etapas_obra ││              │              │
│     └─────────────┘           │─────────────││              │              │
│                               │ id (PK)     ││              │              │
│                               │ obra_id (FK)││              │              │
│                               │ etapa_nome  ││              │              │
│                               │ status      ││              │              │
│                               └─────────────┘│              │              │
│                                              │              │              │
│     ┌─────────────┐                          │              │              │
│     │checklist    │                          │              │              │
│     │usuarios     │                          │              │              │
│     │─────────────│                          │              │              │
│     │ id (PK)     │                          │              │              │
│     │ usuario_id(FK)├────────────────────────┘              │              │
│     │ uso_solo    │                                         │              │
│     │ licenca     │                                         │              │
│     │ condominio  │                                         │              │
│     │ habite_se   │                                         │              │
│     │ averbacao   │                                         │              │
│     │ vistoria    │                                         │              │
│     │ observacoes │                                         │              │
│     └─────────────┘                                         │              │
│                                                            │              │
│     ┌─────────────┐                           ┌────────────┴───────────┐   │
│     │ materiais   │                           │  materiais_obra        │   │
│     │─────────────│                           │────────────────────────│   │
│     │ id (PK)     │                           │ id (PK)                │   │
│     │ nome        │                           │ obra_id (FK)           │   │
│     │ descricao   │                           │ material_id (FK)       │   │
│     │ unidade     │                           │ quantidade_estimada    │   │
│     │ preco_unit  │                           │ saldo_atual            │   │
│     └─────────────┘                           │ fase_obra              │   │
│            │                                  └────────────────────────┘   │
│            │ (1:N)                                                     │     │
│            ▼                                                          │     │
│     ┌──────────────────┐                                    ┌───────────┴───┐│
│     │estoque_moviment. │                                    │estoque_movim. ││
│     │──────────────────│                                    │obra_id (FK)   ││
│     │ id (PK)          │                                    │ motivo        ││
│     │ material_id (FK) │                                    │ quantidade    ││
│     │ tipo (ent/saida) │                                    │ admin_id      ││
│     │ quantidade       │                                    └───────────────┘│
│     │ admin_id         │                                                     │
│     └──────────────────┘                                                     │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

## 7.3 Regras e Constraints Importantes

### Foreign Keys com CASCADE DELETE
Todas as tabelas filhas têm `ON DELETE CASCADE` para garantir integridade referencial:
- `checklist_usuarios.usuario_id` → `usuarios.id`
- `obras.usuario_id` → `usuarios.id`
- `etapas_obra.obra_id` → `obras.id`
- `materiais_obra.obra_id` → `obras.id`
- `materiais_obra.material_id` → `materiais.id`
- `estoque_movimentacoes.material_id` → `materiais.id`

### Foreign Keys com SET NULL
- `usuarios.admin_id` → `admins.id` (SET NULL) - Usuário continua existindo se admin for removido
- `estoque_movimentacoes.obra_id` → `obras.id` (SET NULL) - Movimentação continua existindo se obra for removida

### Campos com Valores Padrão
- `checklist_usuarios.*_status` = 'Nao Tem'
- `materiais.ativo` = TRUE
- `materiais_obra.ativo` = TRUE

---

# 8️⃣ FLUXOS IMPORTANTES DO SISTEMA

## 8.1 Fluxo de Cadastro de Usuário

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE CADASTRO DE USUÁRIO                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. USUÁRIO PREENCHE FORMULÁRIO                                             │
│     ├─ Nome (mínimo 3 caracteres)                                           │
│     ├─ Email (formato válido, único)                                        │
│     ├─ Telefone (10-11 dígitos)                                             │
│     ├─ Endereço da Obra                                                     │
│     ├─ Nome da Obra                                                         │
│     └─ Checklist Inicial (opcional)                                         │
│                                                                             │
│  2. VALIDAÇÕES NO CONTROLLER                                                │
│     │                                                                        │
│     ├─ Verifica campos obrigatórios                                         │
│     ├─ Valida formato do email (regex)                                      │
│     ├─ Valida telefone (apenas dígitos)                                     │
│     └─ Valida tamanho do nome                                               │
│                                                                             │
│  3. CRIAÇÃO NO BANCO                                                        │
│     │                                                                        │
│     ├─ INSERT INTO usuarios                                                 │
│     │  └─ Retorna userId                                                    │
│     │                                                                        │
│     ├─ INSERT INTO checklist_usuarios (se checklist fornecido)              │
│     │  └─ INSERT IGNORE (cria se não existir)                               │
│     │                                                                        │
│     └─ UPDATE checklist_usuarios (para cada campo preenchido)               │
│                                                                             │
│  4. REGISTRO DE AUDITORIA                                                   │
│     │                                                                        │
│     ├─ INSERT INTO auditoria (CHECKLIST_INICIAL para cada campo)            │
│     └─ INSERT INTO auditoria (USUARIO_CRIADO)                               │
│                                                                             │
│  5. REGISTRO DE HISTÓRICO                                                   │
│     │                                                                        │
│     └─ INSERT INTO historico                                                │
│        └─ "Usuário criado com checklist inicial"                            │
│                                                                             │
│  6. REDIRECIONAMENTO                                                        │
│     │                                                                        │
│     └─ HTTP 302 Redirect → /dashboard                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.2 Fluxo de Edição de Usuário

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FLUXO DE EDIÇÃO DE USUÁRIO                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. ACESSO À PÁGINA DE EDIÇÃO                                               │
│     │                                                                        │
│     ├─ GET /dashboard/usuarios/:id/edit                                     │
│     │                                                                        │
│     └─ Controller busca:                                                    │
│        ├─ User.findById(id) → dados do usuário                             │
│        ├─ Checklist.findByUser(id) → status do checklist                   │
│        └─ Renderiza editUser.handlebars                                     │
│                                                                             │
│  2. ENVIO DO FORMULÁRIO                                                     │
│     │                                                                        │
│     └─ POST /dashboard/usuarios/:id/edit                                    │
│        com dados: nome, email, telefone, endereco, obra, e checklist        │
│                                                                             │
│  3. VALIDAÇÕES                                                              │
│     │                                                                        │
│     ├─ Verifica ID válido                                                   │
│     ├─ Verifica campos obrigatórios                                         │
│     └─ Valida formato do email                                              │
│                                                                             │
│  4. ATUALIZAÇÃO NO BANCO                                                    │
│     │                                                                        │
│     ├─ UPDATE usuarios (dados básicos)                                      │
│     │                                                                        │
│     ├─ Checklist.createIfNotExists(id) (garante que existe)                │
│     │                                                                        │
│     └─ Para cada campo do checklist alterado:                               │
│        ├─ UPDATE checklist_usuarios SET campo = valor                       │
│        └─ INSERT INTO auditoria (CHECKLIST_ATUALIZADO)                      │
│                                                                             │
│  5. REGISTRO DE AUDITORIA                                                   │
│     │                                                                        │
│     └─ INSERT INTO auditoria (USUARIO_ATUALIZADO)                           │
│                                                                             │
│  6. REDIRECIONAMENTO                                                        │
│     │                                                                        │
│     ├─ Se veio do dashboard → Redirect /dashboard                           │
│     └─ Caso contrário → Redirect /dashboard/tablesUsers                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.3 Fluxo de Exclusão de Usuário

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE EXCLUSÃO DE USUÁRIO                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. SOLICITAÇÃO DE EXCLUSÃO                                                 │
│     │                                                                        │
│     └─ POST /dashboard/usuarios/:id/delete                                  │
│                                                                             │
│  2. VALIDAÇÕES                                                              │
│     │                                                                        │
│     ├─ Verifica ID válido                                                   │
│     └─ Busca usuário existente                                              │
│                                                                             │
│  3. REGISTRO DE AUDITORIA (PRÉ-EXCLUSÃO)                                    │
│     │                                                                        │
│     └─ INSERT INTO auditoria                                                 │
│        └─ USUARIO_DELETADO, valor_anterior = nome do usuário                │
│                                                                             │
│  4. EXCLUSÃO EM CASCATA (ORDEM IMPORTANTE!)                                 │
│     │                                                                        │
│     ├─ DELETE FROM checklist_usuarios WHERE usuario_id = id                 │
│     ├─ DELETE FROM historico WHERE usuario_id = id                          │
│     ├─ DELETE FROM auditoria WHERE usuario_id = id                          │
│     │  OBS: Esta linha é executada manualmente para garantir                │
│     │       limpeza completa (a FK também cascateia)                        │
│     │                                                                        │
│     ├─ DELETE FROM obras WHERE usuario_id = id                              │
│     │  OBS: Esta query é executada manualmente (a FK também cascateia)      │
│     │                                                                        │
│     └─ DELETE FROM usuarios WHERE id = id                                   │
│                                                                             │
│  5. REDIRECIONAMENTO                                                        │
│     │                                                                        │
│     └─ HTTP 302 Redirect → /dashboard/tablesUsers                           │
│                                                                             │
│  ⚠️  NOTA: A ordem das exclusões é importante para evitar                  │
│      violações de integridade referencial.                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.4 Fluxo de Login

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             FLUXO DE LOGIN                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. ACESSO À PÁGINA DE LOGIN                                                │
│     │                                                                        │
│     └─ GET /login                                                           │
│        └─ Renderiza login.handlebars                                        │
│                                                                             │
│  2. ENVIO DO FORMULÁRIO                                                     │
│     │                                                                        │
│     └─ POST /login                                                          │
│        com dados: email, password                                            │
│                                                                             │
│  3. VALIDAÇÕES DE ENTRADA                                                   │
│     │                                                                        │
│     ├─ Verifica email e senha preenchidos                                   │
│     ├─ Valida formato do email (regex)                                      │
│     └─ Verifica tamanho da senha (mínimo 6)                                 │
│                                                                             │
│  4. BUSCA NO BANCO                                                          │
│     │                                                                        │
│     └─ Admin.findByEmail(email.toLowerCase().trim())                        │
│                                                                             │
│  5. COMPARAÇÃO DE SENHA                                                     │
│     │                                                                        │
│     └─ bcrypt.compare(password, admin.password)                             │
│                                                                             │
│  6. CRIAÇÃO DE SESSÃO (SE LOGIN SUCEDIDO)                                   │
│     │                                                                        │
│     ├─ req.session.adminId = admin.id                                       │
│     ├─ req.session.adminEmail = admin.email                                 │
│     └─ Cookie configurado com:                                              │
│        ├─ httpOnly: true (segurança XSS)                                    │
│        ├─ secure: true (apenas HTTPS em produção)                           │
│        ├─ sameSite: 'strict' (CSRF protection)                              │
│        └─ maxAge: 24 horas                                                  │
│                                                                             │
│  7. REDIRECIONAMENTO                                                         │
│     │                                                                        │
│     └─ HTTP 302 Redirect → /dashboard                                       │
│                                                                             │
│  ❌ CASO DE ERRO:                                                           │
│     ├─ 400: Campos faltando ou inválidos                                    │
│     ├─ 401: Email ou senha incorretos                                       │
│     └─ 500: Erro interno do servidor                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.5 Fluxo de Atualização de Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE ATUALIZAÇÃO DE CHECKLIST                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. REQUISIÇÃO                                                              │
│     │                                                                        │
│     └─ POST /dashboard/usuarios/:id/checklist                               │
│        com: campo, valor, admin_override = true                             │
│                                                                             │
│  2. VALIDAÇÕES DE SEGURANÇA                                                 │
│     │                                                                        │
│     ├─ admin_override DEVE ser true                                         │
│     │  (Impede atualizações diretas sem passar pela edição completa)        │
│     │                                                                        │
│     ├─ ID do usuário válido                                                  │
│     ├─ Campo válido (um dos 6 campos)                                       │
│     │  └─ uso_solo, licenca, condominio, habite_se, averbacao, vistoria    │
│     │                                                                        │
│     └─ Valor válido                                                          │
│        └─ Nao Tem, Andamento, Feito, Finalizado, Proxima-Etapa             │
│                                                                             │
│  3. VERIFICAÇÃO DE EXISTÊNCIA                                               │
│     │                                                                        │
│     ├─ User.findById(id)                                                    │
│     │  └─ 404 se não existir                                                │
│     │                                                                        │
│     └─ Checklist.createIfNotExists(id)                                      │
│        └─ Garante que existe registro para atualizar                        │
│                                                                             │
│  4. BUSCA VALOR ANTERIOR                                                    │
│     │                                                                        │
│     └─ Checklist.findByUser(id)                                             │
│        └─ Captura valor atual antes da atualização                          │
│                                                                             │
│  5. ATUALIZAÇÃO                                                              │
│     │                                                                        │
│     └─ UPDATE checklist_usuarios SET campo = valor WHERE usuario_id = id    │
│                                                                             │
│  6. REGISTRO DE AUDITORIA                                                   │
│     │                                                                        │
│     └─ INSERT INTO auditoria                                                 │
│        └─ admin_id, usuario_id, acao, campo, valor_anterior, valor_novo     │
│                                                                             │
│  7. REGISTRO DE HISTÓRICO                                                   │
│     │                                                                        │
│     └─ INSERT INTO historico                                                 │
│        └─ "Campo X alterado de A para B"                                    │
│                                                                             │
│  8. CÁLCULO DE PROGRESSO                                                    │
│     │                                                                        │
│     └─ Checklist.getProgresso(id)                                           │
│        └─ Retorna { progresso: 0-100 }                                      │
│                                                                             │
│  9. RESPOSTA JSON                                                           │
│     │                                                                        │
│     └─ { success: true, progresso: XX }                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.6 Fluxo de Movimentação de Estoque (Entrada)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FLUXO DE ENTRADA DE MATERIAL NO ESTOQUE                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. REQUISIÇÃO                                                              │
│     │                                                                        │
│     └─ POST /estoque/entrada                                                │
│        com: material_id, quantidade, obra_id, motivo, valor_unitario        │
│                                                                             │
│  2. VALIDAÇÕES                                                              │
│     │                                                                        │
│     ├─ material_id obrigatório                                              │
│     ├─ quantidade obrigatória e > 0                                         │
│     └─ admin_id na sessão                                                    │
│                                                                             │
│  3. TRANSAÇÃO NO BANCO (BEGIN TRANSACTION)                                  │
│     │                                                                        │
│     ├─ INSERT INTO estoque_movimentacoes                                    │
│     │  └─ tipo = 'entrada', material_id, quantidade, admin_id              │
│     │                                                                        │
│     └─ UPDATE materiais                                                     │
│        └─ estoque_atual = estoque_atual + quantidade                        │
│                                                                             │
│  4. COMMIT DA TRANSAÇÃO                                                     │
│     │                                                                        │
│     └─ Se tudo OK, confirma as alterações                                   │
│                                                                             │
│  5. CASO DE ERRO (ROLLBACK)                                                 │
│     │                                                                        │
│     └─ Desfaz todas as alterações                                           │
│                                                                             │
│  6. REDIRECIONAMENTO                                                        │
│     │                                                                        │
│     └─ HTTP 302 → /estoque/movimentacoes                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.7 Fluxo de Movimentação de Estoque (Saída)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE SAÍDA DE MATERIAL DO ESTOQUE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. REQUISIÇÃO                                                              │
│     │                                                                        │
│     └─ POST /estoque/saida                                                  │
│        com: material_id, quantidade, obra_id, motivo, valor_unitario        │
│                                                                             │
│  2. VALIDAÇÕES                                                              │
│     │                                                                        │
│     ├─ material_id obrigatório                                              │
│     ├─ quantidade obrigatória e > 0                                         │
│     ├─ obra_id obrigatório (saída SEMPRE precisa de obra)                   │
│     └─ admin_id na sessão                                                    │
│                                                                             │
│  3. TRANSAÇÃO NO BANCO (BEGIN TRANSACTION)                                  │
│     │                                                                        │
│     ├─ Verifica estoque disponível                                          │
│     │  └─ SELECT estoque_atual FROM materiais WHERE id = material_id        │
│     │  └─ ERRO se estoque_atual < quantidade                                │
│     │                                                                        │
│     ├─ INSERT INTO estoque_movimentacoes                                    │
│     │  └─ tipo = 'saida', material_id, quantidade, obra_id, admin_id       │
│     │                                                                        │
│     └─ UPDATE materiais                                                     │
│        └─ estoque_atual = estoque_atual - quantidade                        │
│                                                                             │
│  4. COMMIT OU ROLLBACK                                                      │
│     │                                                                        │
│     └─ Se estoque insuficiente → ERRO com mensagem                          │
│                                                                             │
│  5. REDIRECIONAMENTO                                                        │
│     │                                                                        │
│     └─ HTTP 302 → /estoque/movimentacoes                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 9️⃣ ERROS COMUNS E DECISÕES IMPORTANTES

## 9.1 Erros que Podem Acontecer

### Erros de Conexão com Banco de Dados
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Causa:** MySQL não está rodando ou configuração incorreta
**Solução:** Verificar se o serviço MySQL está iniciado e configurações de host/porta no .env

```
Error: Access denied for user 'root'@'localhost'
```
**Causa:** Credenciais incorretas no .env
**Solução:** Verificar DB_USER e DB_PASSWORD no arquivo .env

```
Error: Too many connections
```
**Causa:** Pool de conexões esgotado
**Solução:** Aumentar connectionLimit no connection.js ou otimizar queries

### Erros de Validação
```
Error: Email já cadastrado
```
**Causa:** Tentativa de criar usuário com email que já existe
**Solução:** Verificar se email já está em uso antes de criar

```
Error: Campos obrigatórios faltando
```
**Causa:** Dados incompletos no formulário
**Solução:** Validar todos os campos obrigatórios no controller

### Erros de Sessão
```
Error: Cannot set headers after they are sent to the client
```
**Causa:** Múltiplas respostas em uma mesma requisição
**Solução:** Garantir que apenas um res.send/redirect/json seja executado por rota

```
Error: req.session is undefined
```
**Causa:** Session middleware não configurado corretamente
**Solução:** Verificar configuração do express-session no app.js

### Erros de Foreign Key
```
Error: ER_ROW_IS_REFERENCED_2: Cannot delete or update a parent row
```
**Causa:** Tentativa de deletar registro que é referenciado por outras tabelas
**Solução:** Deletar registros dependentes primeiro ou usar CASCADE

### Erros de Rate Limiting
```
Error: 429 Too Many Requests
```
**Causa:** Excesso de tentativas de login
**Solução:** Aguardar 15 minutos ou limpar cookies

## 9.2 Decisões Técnicas Críticas

### Decisão 1: Soft Delete vs Hard Delete para Materiais
**Escolhido:** Soft delete (campo `ativo = FALSE`)
**Motivo:** Preserva histórico de movimentações e permite reativação acidental
**Observação:** Para usuários e obras, foi escolhido hard delete por questões de conformidade GDPR e simplificação

### Decisão 2: Rate Limiting apenas na rota de login
**Escolhido:** Limitar apenas /login com 50 tentativas/15min
**Motivo:** Protege contra brute force sem impactar performance de outras rotas
**Alternativa considerada:** Rate limiting global (rejeitado por ser muito restritivo)

### Decisão 3: Session vs JWT
**Escolhido:** Server-side sessions com cookies httpOnly
**Motivo:** Simplicidade, facilidade de revogação, proteção contra XSS
**Alternativa considerada:** JWT (rejeitado por dificuldade de logout e armazenamento no client)

### Decisão 4: Checklists com campos fixos vs JSON
**Escolhido:** Colunas fixas (uso_solo, licenca, etc.)
**Motivo:** Validação mais rígida, queries mais simples, indexing possível
**Alternativa considerada:** JSON field (rejeitado por perda de estruturação)

### Decisão 5: MySQL com InnoDB
**Escolhido:** Engine InnoDB com Foreign Keys
**Motivo:** Suporte a transações ACID, integridade referencial
**Alternativa considerada:** MyISAM (rejeitado por falta de transações)

### Decisão 6: Usar SQLite para CONTROLEGERAL
**Escolhido:** SQLite desabilitado no Render
**Motivo:** Problemas de compatibilidade com serverless/stateless
**Status:** Feature legada, mantida mas não utilizada em produção

### Decisão 7: Cálculo de Progresso em Tempo Real
**Escolhido:** Calcular progresso na hora da requisição
**Motivo:** Simplicidade, dados sempre atualizados
**Alternativa considerada:** Cache (não implementado por ser desnecessário no volume atual)

### Decisão 8: Middleware de autenticação com redirect
**Escolhido:** Retornar 401 + redirect para /login
**Motivo:** UX melhor para usuário não logado
**Observação:** API routes retornam 401, páginas web retornam redirect

## 9.3 O Que NÃO Deve Ser Alterado Sem Cuidado

### 1. Estrutura de Tabelas do Banco
**Por quê:** Foreign keys dependem de campos específicos
**O que acontece se mudar:** Erros de integridade, dados órfãos
**Como fazer com cuidado:** Criar migration, testar em ambiente isolado

### 2. Campo `adminId` na Sessão
**Por quê:** Todos os controllers verificam req.session.adminId
 se mudar:** Sistema inteiro**O que acontece para de autenticar
**Como fazer com cuidado:** Manter compatibilidade retroativa

### 3. Validação de Checklist
**Por quê:** Protege contra valores inválidos no banco
**O que acontece se mudar:** Dados inconsistentes no checklist
**Como fazer com cuidado:** Expandir lista de valores válidos

### 4. Foreign Keys com CASCADE
**Por quê:** Garantem integridade referencial automática
**O que acontece se mudar:** Registros órfãos, dados inconsistentes
**Como fazer com cuidado:** Manter cascade nas FKs existentes

### 5. Middleware isAuth
**Por quê:** Protege todas as rotas administrativas
**O que acontece se mudar:** Vulnerabilidade de segurança
**Como fazer com cuidado:** Manter mesma lógica de verificação

### 6. Configuração de Cookie de Sessão
**Por quê:** Afeta segurança (httpOnly, secure, sameSite)
**O que acontece se mudar:** Vulnerabilidades XSS, CSRF
**Como fazer com cuidado:** Manter ou melhorar configurações de segurança

### 7. Rate Limiter de Login
**Por quê:** Protege contra brute force
**O que acontece se mudar:** Vulnerabilidade a ataques
**Como fazer com cuidado:** Ajustar apenas se necessário

---

# 10️⃣ BOAS PRÁTICAS APLICADAS

## 10.1 Organização do Código

### Separação em Camadas
```
src/
├── controllers/  (Lógica de apresentação)
├── models/       (Acesso a dados)
├── routes/       (Definição de rotas)
├── middlewares/  (Filters/Interceptors)
├── views/        (Templates)
├── utils/        (Helpers)
└── database/     (Conexão)
```

### Princípio da Responsabilidade Única
- Cada arquivo tem uma única responsabilidade
- Models não acessam sessão
- Controllers não fazem queries diretas
- Views não contêm lógica de negócio

### Modularização
```
src/modules/estoque/
├── controllers/
├── models/
├── routes/
└── views/
```
Estrutura independente que pode ser plugada ou removida.

## 10.2 Separação de Responsabilidades

| Camada | Responsabilidade | Exemplos |
|--------|------------------|----------|
| Routes | Definir rotas e direcionar | router.js, authRoutes.js |
| Controllers | Lógica de negócio, validações | authController.js |
| Models | Acesso a dados, validações de schema | User.js, Obra.js |
| Views | Apresentação de dados | dashboard.handlebars |
| Middlewares | Preprocessing de requisições | isAuth.js |
| Utils | Funções auxiliares | logger.js |

## 10.3 Padrões Seguidos

### Padrão MVC (Model-View-Controller)
- **Model:** Lógica de dados (src/models/)
- **View:** Apresentação (src/views/)
- **Controller:** Orquestração (src/controllers/)

### Padrão Repository
Cada modelo encapsula todas as operações do banco:
```javascript
// User.js
exports.create = async (...) => { ... }
exports.findById = async (...) => { ... }
exports.update = async (...) => { ... }
exports.delete = async (...) => { ... }
```

### Padrão Middleware
```javascript
// Exemplo de middleware em cadeia
app.use(helmet())           // Segurança
  .use(cors())              // CORS
  .use(session())           // Sessão
  .use(bodyParser())        // Parser
  .use(router);             // Rotas
```

### Padrão Promise/Async-Await
Todas as operações assíncronas usam async/await:
```javascript
const usuario = await User.findById(id);
await db.execute(sql, params);
```

### Tratamento de Erros em Camadas
```javascript
// No model - não lança para não quebrar fluxo
try {
  await db.execute(sql);
} catch (err) {
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return []; // Graceful degradation
  }
  throw err;
}

// No controller - propaga erro
try {
  await User.deleteById(id);
} catch (err) {
  res.status(500).send('Erro ao deletar');
}
```

## 10.4 Segurança Aplicada

### Senhas Hasheadas
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(senha, 10);
const ok = await bcrypt.compare(senha, hash);
```

### Cookies Seguros
```javascript
cookie: {
  httpOnly: true,   // Inacessível via JavaScript
  secure: true,     // Apenas HTTPS
  sameSite: 'strict' // CSRF protection
}
```

### Headers de Segurança
```javascript
app.use(helmet()); // X-Content-Type-Options, X-Frame-Options, etc.
```

### Rate Limiting
```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
});
```

### Prepared Statements
```javascript
await db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
// Impede SQL Injection
```

## 10.5 Pontos de Melhoria Futura

### 1. Documentação Automática
- Adicionar Swagger/OpenAPI para APIs
- Gerar documentação JSDoc

### 2. Testes Automatizados
- Unit tests (Jest/Mocha)
- Integration tests
- E2E tests (Cypress/Playwright)

### 3. Cache
- Redis para sessões
- Cache de queries frequentes

### 4. Logs Estruturados
- JSON logs para melhor parse
- Integração com ELK Stack

### 5. Validação com Biblioteca
- Joi ou Yup para validação de schemas
- Documentação automática de validações

### 6. API REST Completa
- Documentação OpenAPI
- Versionamento de API
- Autenticação JWT para APIs

### 7. Frontend Separado
- React/Vue/Angular para SPA
- Aplicação mobile (React Native)

### 8. Background Jobs
- Bull/Agenda para jobs assíncronos
- Relatórios agendados
- Limpeza automática de dados

### 9. Monitoramento
- Sentry para error tracking
- Prometheus/Grafana para métricas
- Health checks

### 10. CI/CD
- GitHub Actions
- Testes automatizados
- Deploy automático

---

# 📋 GUIA DE INSTALAÇÃO E EXECUÇÃO

## 1. Pré-requisitos

- Node.js 18.x ou superior
- MySQL 8.0 ou superior
- npm ou yarn

## 2. Configuração do Ambiente

### 2.1. Criar arquivo .env

```env
# Servidor
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=rp_empreendimentos

# Sessão
SESSION_SECRET=sua_chave_secreta_aqui_muito_longa_e_segura_2024

# (Opcional) SSL para produção
# DB_SSL=true
```

### 2.2. Criar Banco de Dados

```sql
CREATE DATABASE rp_empreendimentos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2.3. Importar Estrutura do Banco

```bash
mysql -u root -p rp_empreendimentos < rp_empreendimentos.sql
```

### 2.4. Instalar Dependências

```bash
cd src
npm install
```

## 3. Executar o Sistema

### Desenvolvimento (com auto-reload)

```bash
cd src
npm run dev
```

### Produção (com PM2)

```bash
cd src
npm start
# ou
pm2 start app.js --name rp-app
```

### Acessar

- URL: http://localhost:5000
- Login: admin@empresa.com
- Senha: admin123 (ou configurar via script)

## 4. Criar Administrador Inicial

```bash
node scripts/create_admin.js
```

---

# 📝 RESUMO EXECUTIVO

O **RP-Empreendimentos** é um sistema de gestão web completo para construtoras, desenvolvido em Node.js com Express e MySQL. O sistema oferece funcionalidades de gestão de obras, usuários, checklists de progresso, controle de estoque, equipes, financeiro, comunicação e relatórios.

A arquitetura segue o padrão MVC com separação clara de responsabilidades, utilizando Handlebars para renderização server-side. A segurança é garantida através de criptografia bcrypt para senhas, sessões httpOnly, headers de segurança helmet, rate limiting para login, e validação rigorosa de inputs.

O sistema está pronto para produção, com documentação completa, scripts de setup do banco, e configuração para deploy em serviços de cloud como Clever Cloud ou similares.

---

**FIM DO DOCUMENTO TÉCNICO COMPLETO**

*Este documento foi gerado automaticamente e contém todas as informações necessárias para recriar o sistema RP-Empreendimentos do zero.*
