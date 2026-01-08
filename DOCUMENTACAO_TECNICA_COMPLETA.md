# Documentação Técnica Completa - Sistema de Gestão de Empreendimentos RP

## 1. Introdução Geral do Sistema

### 1.1 Nome do Sistema
Sistema de Gestão de Empreendimentos RP

### 1.2 Finalidade
O sistema tem como finalidade principal gerenciar e acompanhar o progresso de empreendimentos imobiliários, especificamente obras de construção civil, através de um painel administrativo que permite o controle completo de usuários, obras, checklists de documentação, auditoria e relatórios.

### 1.3 Problema que Resolve
Resolve a necessidade de empresas construtoras de ter um controle centralizado e organizado sobre:
- Cadastro e gestão de clientes/usuários associados a obras
- Acompanhamento do status de documentação necessária para obras (uso do solo, licenças, condomínio, habite-se, averbação, vistorias)
- Controle de progresso das obras baseado em checklists
- Auditoria de todas as ações realizadas no sistema
- Geração de relatórios e estatísticas
- Gestão de múltiplos módulos (obras, estoque, financeiro, equipes, comunicação, relatórios)

### 1.4 Escopo Funcional
O sistema abrange as seguintes funcionalidades principais:
- **Autenticação e Autorização**: Login de administradores com controle de sessão
- **Gestão de Usuários**: CRUD completo de usuários associados a administradores
- **Controle de Obras**: Criação e gestão de obras por usuário
- **Checklists de Documentação**: Acompanhamento de 6 itens obrigatórios por obra (uso_solo, licenca, condominio, habite_se, averbacao, vistoria)
- **Auditoria**: Registro completo de todas as ações realizadas no sistema
- **Histórico**: Controle temporal das alterações em usuários
- **Dashboard**: Visualização de estatísticas e progresso das obras
- **Módulos Especializados**:
  - Controle de Estoque e Materiais
  - Gestão Financeira
  - Controle de Equipes
  - Sistema de Comunicação
  - Geração de Relatórios

### 1.5 Público-Alvo
- Administradores de empresas construtoras
- Gestores de obras
- Equipes responsáveis pelo acompanhamento documental de empreendimentos

### 1.6 Contexto de Uso
O sistema é utilizado em ambiente corporativo para empresas do ramo de construção civil que necessitam de um controle rigoroso sobre a documentação e progresso de múltiplas obras simultaneamente. É acessado via web browser em computadores desktop e dispositivos móveis.

## 2. Stack Tecnológica

### 2.1 Linguagens de Programação
- **JavaScript/Node.js**: Versão 14.0.0 ou superior
  - Finalidade: Backend do sistema, lógica de negócio, APIs REST
  - Justificativa: Ecossistema maduro, grande comunidade, suporte a aplicações web em tempo real
  - Dependências: Runtime Node.js
  - Alternativas consideradas: Python (Django/Flask), Java (Spring), PHP (Laravel)

### 2.2 Frameworks e Bibliotecas
- **Express.js**: Versão 5.2.1
  - Finalidade: Framework web para Node.js, roteamento, middlewares
  - Justificativa: Leve, flexível, middleware extensível, alta performance
  - Dependências: Node.js
  - Alternativas consideradas: Koa.js, Fastify, Hapi

- **Express-Handlebars**: Versão 8.0.3
  - Finalidade: Engine de templates para renderização de views HTML
  - Justificativa: Sintaxe familiar, helpers customizáveis, integração nativa com Express
  - Dependências: Express.js, Handlebars
  - Alternativas consideradas: EJS, Pug, Nunjucks

- **MySQL2**: Versão 3.16.0
  - Finalidade: Driver MySQL para Node.js com promises
  - Justificativa: Performance superior, suporte a promises/async-await, pool de conexões
  - Dependências: MySQL Server
  - Alternativas consideradas: mysql (versão callback), Sequelize (ORM)

- **SQLite3**: Versão 5.1.7
  - Finalidade: Banco de dados embutido para desenvolvimento/testes
  - Justificativa: Arquivo único, sem servidor, fácil setup para desenvolvimento
  - Dependências: Nenhuma (embutido)
  - Alternativas consideradas: PostgreSQL, MariaDB

- **bcrypt**: Versão 6.0.0
  - Finalidade: Hashing de senhas
  - Justificativa: Algoritmo seguro, salt automático, resistente a rainbow tables
  - Dependências: OpenSSL
  - Alternativas consideradas: argon2, scrypt

- **express-session**: Versão 1.18.2
  - Finalidade: Gerenciamento de sessões HTTP
  - Justificativa: Middleware confiável, armazenamento em memória/redis, segurança
  - Dependências: Express.js
  - Alternativas consideradas: cookie-session, JWT

- **Helmet**: Versão 7.2.0
  - Finalidade: Segurança de headers HTTP
  - Justificativa: Configuração automática de headers de segurança, OWASP compliance
  - Dependências: Express.js
  - Alternativas consideradas: Manual configuration

- **CORS**: Versão 2.8.5
  - Finalidade: Controle de Cross-Origin Resource Sharing
  - Justificativa: Controle fino de origens permitidas, segurança contra CSRF
  - Dependências: Express.js
  - Alternativas consideradas: Configuração manual

- **express-rate-limit**: Versão 8.2.1
  - Finalidade: Controle de taxa de requisições
  - Justificativa: Proteção contra ataques de força bruta e DDoS
  - Dependências: Express.js
  - Alternativas consideradas: Custom middleware

- **Axios**: Versão 1.13.2
  - Finalidade: Cliente HTTP para requisições externas
  - Justificativa: Promises-based, interceptors, configuração global
  - Dependências: Node.js
  - Alternativas consideradas: node-fetch, request (deprecated)

- **Body-parser**: Versão 2.2.1
  - Finalidade: Parsing de corpos de requisição HTTP
  - Justificativa: Suporte a JSON, URL-encoded, multipart
  - Dependências: Express.js
  - Alternativas consideradas: Express built-in (para JSON limitado)

### 2.3 Banco de Dados
- **MySQL**: Versão 8.0+
  - Finalidade: Banco de dados relacional principal
  - Justificativa: ACID compliance, relacionamentos complexos, performance em produção
  - Dependências: MySQL Server
  - Alternativas consideradas: PostgreSQL, MariaDB, MongoDB

### 2.4 Ferramentas de Desenvolvimento
- **Nodemon**: Versão 3.1.11
  - Finalidade: Reinício automático do servidor em desenvolvimento
  - Justificativa: Hot reload, desenvolvimento ágil
  - Dependências: Node.js
  - Alternativas consideradas: node --watch (Node 18+), pm2

### 2.5 Versionamento e Controle
- **Git**: Sistema de controle de versão distribuído
  - Finalidade: Controle de versão do código fonte
  - Justificativa: Padrão da indústria, branching eficiente, colaboração
  - Dependências: Git instalado
  - Alternativas consideradas: SVN, Mercurial

### 2.6 Ambiente de Desenvolvimento
- **Visual Studio Code**: Editor de código
  - Finalidade: Desenvolvimento e debugging
  - Justificativa: Extensões poderosas, integração Git, debugging Node.js
  - Dependências: VS Code instalado
  - Alternativas consideradas: WebStorm, Sublime Text, Vim

## 3. Arquitetura do Sistema

### 3.1 Modelo Arquitetural
O sistema adota uma arquitetura **MVC (Model-View-Controller)** com camadas bem definidas e separação de responsabilidades, seguindo os princípios de arquitetura limpa e modularidade.

### 3.2 Organização de Camadas e Módulos

#### 3.2.1 Camada de Apresentação (Views)
- **Localização**: `src/views/`
- **Responsabilidade**: Renderização de interfaces HTML usando Handlebars
- **Componentes**:
  - Templates Handlebars (.handlebars)
  - Layout principal (`main.handlebars`)
  - Views específicas por funcionalidade (dashboard, usuários, obras, etc.)
- **Padrões**: Template inheritance, partials, helpers customizados

#### 3.2.2 Camada de Controle (Controllers)
- **Localização**: `src/controllers/`
- **Responsabilidade**: Lógica de negócio, processamento de requisições, validação de dados
- **Componentes**:
  - `authController.js`: Autenticação e autorização
  - `usuarioController.js`: Gestão de usuários
  - `obraController.js`: Gestão de obras
  - `dashboardController.js`: Lógica do dashboard e estatísticas
  - `controleGeralController.js`: Controle dos módulos especializados
- **Padrões**: Funções assíncronas, tratamento de erros consistente

#### 3.2.3 Camada de Modelo (Models)
- **Localização**: `src/models/`
- **Responsabilidade**: Interação com banco de dados, definição de entidades
- **Componentes**:
  - `User.js`: Operações CRUD de usuários
  - `Obra.js`: Operações CRUD de obras
  - `Checklist.js`: Gestão de checklists de documentação
  - `Auditoria.js`: Registro de auditoria
  - `Historico.js`: Controle de histórico
  - `Admin.js`: Gestão de administradores
- **Padrões**: Queries SQL diretas, validação de dados, tratamento de erros

#### 3.2.4 Camada de Rotas (Routes)
- **Localização**: `src/routes/`
- **Responsabilidade**: Definição de endpoints REST, mapeamento URL-controller
- **Componentes**:
  - `authRoutes.js`: Rotas de autenticação e usuários
  - `controleGeralRoutes.js`: Rotas dos módulos especializados
- **Padrões**: Agrupamento por funcionalidade, middlewares de autenticação

#### 3.2.5 Camada de Middlewares
- **Localização**: `src/middlewares/`
- **Responsabilidade**: Funcionalidades transversais (autenticação, validação, segurança)
- **Componentes**:
  - `isAuth.js`: Middleware de autenticação de sessão
- **Padrões**: Funções middleware Express padrão

#### 3.2.6 Módulos Especializados
- **Localização**: `src/modules/`
- **Responsabilidade**: Funcionalidades específicas do negócio
- **Componentes**:
  - `estoque/`: Controle de materiais e movimentações
    - Controllers: `estoqueController.js`, `materialController.js`
    - Models: `Material.js`, `EstoqueMovimentacao.js`
    - Routes: `estoqueRoutes.js`
    - Views: Templates Handlebars específicos
- **Padrões**: Estrutura MVC replicada por módulo

#### 3.2.7 Utilitários
- **Localização**: `src/utils/`
- **Responsabilidade**: Funções auxiliares reutilizáveis
- **Componentes**:
  - `logger.js`: Sistema de logging estruturado
- **Padrões**: Funções puras, configuração centralizada

### 3.3 Responsabilidade de Cada Camada

#### 3.3.1 Camada de Apresentação
- Receber entrada do usuário via formulários HTML
- Exibir dados processados em templates
- Gerenciar estado da interface (JavaScript frontend)
- Não conter lógica de negócio

#### 3.3.2 Camada de Controle
- Validar dados de entrada
- Coordenar operações entre modelos
- Controlar fluxo de navegação
- Tratar erros e exceções
- Preparar dados para apresentação

#### 3.3.3 Camada de Modelo
- Executar operações CRUD no banco de dados
- Validar integridade de dados
- Implementar regras de negócio específicas de entidade
- Abstrair complexidade do acesso a dados

#### 3.3.4 Camada de Rotas
- Mapear URLs para controllers
- Aplicar middlewares apropriados
- Definir estrutura RESTful
- Controlar acesso baseado em autenticação

### 3.4 Fluxo de Comunicação Entre Componentes

```
Cliente Browser
    ↓ (HTTP Request)
Express Server (app.js)
    ↓ (Routing)
Routes (authRoutes.js, controleGeralRoutes.js)
    ↓ (Middleware)
isAuth Middleware
    ↓ (Controller)
Controllers (authController, usuarioController, etc.)
    ↓ (Business Logic)
Models (User.js, Obra.js, Checklist.js, etc.)
    ↓ (Database Operations)
MySQL Database
    ↓ (Data)
Views (Handlebars Templates)
    ↓ (HTML Response)
Cliente Browser
```

### 3.5 Padrões Arquiteturais Utilizados

#### 3.5.1 MVC (Model-View-Controller)
- Separação clara entre dados, apresentação e controle
- Controllers como intermediários entre views e models
- Models independentes de apresentação

#### 3.5.2 Middleware Pattern
- Chain of responsibility para processamento de requisições
- Reutilização de funcionalidades transversais
- Facilita testes e manutenção

#### 3.5.3 Repository Pattern (implícito)
- Models como repositórios de dados
- Abstração do acesso ao banco
- Interface consistente para operações CRUD

#### 3.5.4 Module Pattern
- Organização em módulos especializados
- Baixo acoplamento entre componentes
- Alta coesão dentro de módulos

### 3.6 Descrição Textual do Diagrama Arquitetural

O sistema é estruturado em camadas horizontais com fluxo unidirecional de dados:

1. **Entrada**: Requisições HTTP chegam ao servidor Express através das rotas definidas
2. **Autenticação**: Middleware `isAuth` verifica sessão do usuário
3. **Roteamento**: Rotas direcionam para controllers apropriados
4. **Processamento**: Controllers validam dados e coordenam operações
5. **Persistência**: Models executam operações no banco MySQL
6. **Apresentação**: Dados são renderizados em templates Handlebars
7. **Saída**: HTML é enviado de volta ao cliente

Os módulos especializados (estoque, financeiro, etc.) seguem a mesma arquitetura MVC, mantendo consistência e facilitando manutenção.

## 4. Estrutura do Projeto

### 4.1 Estrutura de Diretórios

```
rp-empreendimentos/
├── .env                                    # Variáveis de ambiente
├── app.js                                 # Ponto de entrada da aplicação
├── package.json                           # Dependências e scripts npm
├── package-lock.json                      # Lockfile das dependências
├── CONTROLEGERAL/                         # Sistema legado de controle geral
│   ├── backend/
│   ├── frontend/
│   ├── arquitetura/
│   ├── contexto_br.md
│   ├── README.md
│   ├── database/
│   ├── frontend/
│   ├── mensagens/
│   ├── modulos/
│   └── relatorios/
├── logs/                                  # Arquivos de log da aplicação
│   └── app.log
├── public/                                # Arquivos estáticos públicos
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── dashboard.js
│       └── userModal.js
├── scripts/                               # Scripts de manutenção e setup
│   ├── add_obra_id_funcionarios.js
│   ├── add_observacoes_tecnicas.sql
│   ├── audit_database.js
│   ├── audit_usuarios.js
│   ├── check_admin.js
│   ├── check_checklist_table.js
│   ├── check_db.js
│   ├── check_schema.js
│   ├── clean_checklist_values.js
│   ├── create_admin.js
│   ├── create_database_only.js
│   ├── create_db.js
│   ├── create_estoque_tables.sql
│   ├── create_materiais_obra_tables.sql
│   ├── create_missing_tables.sql
│   ├── debug_endpoints.js
│   ├── diagnose_checklist.js
│   ├── diagnostico_completo.js
│   ├── fix_checklists.js
│   ├── fix_missing_data.js
│   ├── fix_obras_schema.sql
│   ├── full_setup.js
│   ├── get_admins.js
│   ├── insert_test_data.js
│   ├── run_migrations.js
│   ├── setup_complete.sql
│   ├── SETUP_COMPLETO.sql
│   ├── setup_db.bat
│   ├── setup_db.sh
│   ├── test_all_endpoints.js
│   ├── test_api_endpoints.js
│   ├── test_api_final.js
│   ├── test_checklist_update.js
│   ├── test_create_user.js
│   ├── test_endpoints.bat
│   ├── test_endpoints.js
│   ├── test_enum_direct.js
│   ├── test_login.js
│   ├── test_with_http.js
│   ├── teste_integracao_final.js
│   ├── update_admin_password.js
│   ├── update_checklist_enum.js
│   ├── modal/
│   └── scripts/modal/modal.js
├── src/                                   # Código fonte principal
│   ├── controllers/                       # Controladores da aplicação
│   │   ├── authController.js
│   │   ├── controleGeralController.js
│   │   ├── dashboardController.js
│   │   ├── obraController.js
│   │   └── usuarioController.js
│   ├── database/                          # Configuração de banco de dados
│   │   └── connection.js
│   ├── middlewares/                       # Middlewares customizados
│   │   └── isAuth.js
│   ├── models/                            # Modelos de dados
│   │   ├── Admin.js
│   │   ├── Auditoria.js
│   │   ├── Checklist.js
│   │   ├── EtapaObra.js
│   │   ├── Historico.js
│   │   ├── Obra.js
│   │   └── User.js
│   ├── modules/                           # Módulos especializados
│   │   └── estoque/
│   │       ├── controllers/
│   │       │   ├── estoqueController.js
│   │       │   ├── materialController.js
│   │       │   └── movimentacaoObraController.js
│   │       ├── models/
│   │       │   ├── EstoqueMovimentacao.js
│   │       │   └── Material.js
│   │       ├── routes/
│   │       │   └── estoqueRoutes.js
│   │       └── views/
│   │           ├── dashboard.handlebars
│   │           ├── materiais.handlebars
│   │           ├── materiaisObra.handlebars
│   │           ├── materialObraForm.handlebars
│   │           └── movimentacaoObraForm.handlebars
│   ├── routes/                            # Definição de rotas
│   │   ├── authRoutes.js
│   │   └── controleGeralRoutes.js
│   ├── utils/                             # Utilitários
│   │   └── logger.js
│   └── views/                             # Templates Handlebars
│       ├── layouts/
│       │   └── main.handlebars
│       └── [arquivos .handlebars]
└── [documentos de documentação]
```

### 4.2 Função de Cada Pasta

#### 4.2.1 Raiz do Projeto
- **app.js**: Arquivo principal que inicializa o servidor Express, configura middlewares, rotas e inicia a aplicação
- **package.json**: Define dependências, scripts e metadados do projeto Node.js
- **.env**: Arquivo de configuração de variáveis de ambiente (banco, sessão, etc.)

#### 4.2.2 CONTROLEGERAL/
- Sistema legado mantido para compatibilidade
- Contém backend, frontend, documentação e módulos específicos
- Estrutura separada do sistema principal

#### 4.2.3 logs/
- Armazenamento de arquivos de log da aplicação
- Logs estruturados com Winston para debugging e monitoramento

#### 4.2.4 public/
- Arquivos estáticos servidos diretamente pelo Express
- CSS para estilos da interface
- JavaScript para interatividade do frontend

#### 4.2.5 scripts/
- Scripts de manutenção, setup e debugging
- Automação de tarefas administrativas
- Scripts SQL para criação e migração de banco

#### 4.2.6 src/
- Código fonte principal da aplicação
- Estrutura organizada por responsabilidades (MVC)

#### 4.2.7 src/controllers/
- Lógica de negócio e processamento de requisições
- Um controller por domínio funcional

#### 4.2.8 src/database/
- Configuração de conexão com banco de dados
- Pool de conexões MySQL com mysql2/promise

#### 4.2.9 src/middlewares/
- Middlewares customizados para autenticação e autorização
- Funções transversais aplicadas a múltiplas rotas

#### 4.2.10 src/models/
- Interação com banco de dados
- Queries SQL e validação de dados
- Um model por entidade do sistema

#### 4.2.11 src/modules/
- Módulos especializados com arquitetura MVC própria
- Exemplo: módulo de estoque com controllers, models, routes e views

#### 4.2.12 src/routes/
- Definição de endpoints REST
- Mapeamento URL para controllers
- Aplicação de middlewares de autenticação

#### 4.2.13 src/utils/
- Funções auxiliares reutilizáveis
- Logger estruturado com Winston

#### 4.2.14 src/views/
- Templates Handlebars para renderização HTML
- Layout base e views específicas por funcionalidade

### 4.3 Função dos Arquivos Principais

#### 4.3.1 app.js
- Configuração do servidor Express
- Setup de middlewares (CORS, helmet, session, rate limiting)
- Configuração do engine de templates Handlebars
- Definição de rotas e handlers de erro
- Inicialização do servidor na porta configurada

#### 4.3.2 src/database/connection.js
- Configuração do pool de conexões MySQL
- Teste de conectividade na inicialização
- Export de pool para uso nos models

#### 4.3.3 src/utils/logger.js
- Configuração do sistema de logging com Winston
- Níveis de log (info, warn, error)
- Formatação estruturada para debugging

#### 4.3.4 src/middlewares/isAuth.js
- Verificação de autenticação baseada em sessão
- Redirecionamento para login se não autenticado
- Logging de tentativas de acesso não autorizado

### 4.4 Convenções de Nomenclatura

#### 4.4.1 Arquivos
- **Controllers**: `[dominio]Controller.js` (ex: `authController.js`)
- **Models**: Nome da entidade em PascalCase (ex: `User.js`, `Obra.js`)
- **Routes**: `[dominio]Routes.js` (ex: `authRoutes.js`)
- **Views**: nome em camelCase com extensão `.handlebars` (ex: `dashboard.handlebars`)
- **Middlewares**: nome descritivo em camelCase (ex: `isAuth.js`)

#### 4.4.2 Diretórios
- Nomes em minúsculas
- Separados por underscore se necessário (ex: `controle_geral`)
- Estrutura hierárquica lógica por funcionalidade

#### 4.4.3 Banco de Dados
- **Tabelas**: nomes em plural em snake_case (ex: `usuarios`, `obras`)
- **Colunas**: snake_case (ex: `admin_id`, `created_at`)
- **Índices**: `idx_[coluna]` (ex: `idx_email`)
- **Foreign Keys**: `fk_[tabela]_[referencia]` (ex: `fk_usuarios_admin_id`)

## 5. Componentes, Módulos e Classes

### 5.1 Controllers

#### 5.1.1 AuthController (`src/controllers/authController.js`)
**Responsabilidade**: Gerenciar autenticação e autorização de usuários administradores
**Descrição funcional**: Processa login, logout, validação de credenciais e gerenciamento de sessão
**Interfaces expostas**:
- `login(req, res)`: Processa tentativa de login
- `loginPage(req, res)`: Renderiza página de login
- `dashboard(req, res)`: Renderiza dashboard principal
- `logout(req, res)`: Encerra sessão do usuário
**Dependências**: bcrypt, express-session, Admin model
**Fluxo interno**:
1. Recebe credenciais via POST
2. Valida formato dos dados
3. Consulta banco para verificar admin
4. Compara senha com hash usando bcrypt
5. Cria sessão se válido
6. Redireciona para dashboard

#### 5.1.2 UsuarioController (`src/controllers/usuarioController.js`)
**Responsabilidade**: Gerenciar operações CRUD de usuários/clientes
**Descrição funcional**: Criar, listar, editar, excluir usuários e gerenciar seus checklists
**Interfaces expostas**:
- `create(req, res)`: Cria novo usuário
- `list(req, res)`: Lista usuários do admin
- `editpage(req, res)`: Página de edição
- `update(req, res)`: Atualiza usuário
- `delete(req, res)`: Remove usuário
- `historico(req, res)`: Histórico do usuário
- `progresso(req, res)`: Progresso da obra
- `getChecklist(req, res)`: Dados do checklist
- `updateChecklist(req, res)`: Atualiza status do checklist
**Dependências**: User model, Checklist model, Auditoria model
**Fluxo interno**:
1. Valida dados de entrada
2. Executa operação no model
3. Registra auditoria se necessário
4. Redireciona ou retorna JSON

#### 5.1.3 ObraController (`src/controllers/obraController.js`)
**Responsabilidade**: Gerenciar obras vinculadas a usuários
**Descrição funcional**: CRUD de obras, vinculação a usuários, listagem por admin
**Interfaces expostas**:
- `create(req, res)`: Cria obra vinculada a usuário
- `listAll(req, res)`: Lista todas as obras do admin
- `editPage(req, res)`: Página de edição
- `update(req, res)`: Atualiza obra
- `delete(req, res)`: Remove obra
**Dependências**: Obra model, User model
**Fluxo interno**:
1. Valida usuário proprietário
2. Executa operação na obra
3. Atualiza relacionamentos

#### 5.1.4 DashboardController (`src/controllers/dashboardController.js`)
**Responsabilidade**: Agregar dados para dashboards e relatórios
**Descrição funcional**: Calcular estatísticas, progresso, fornecer dados para gráficos
**Interfaces expostas**:
- `dashboardProgresso(req, res)`: Dashboard com progresso das obras
- `apiStats(req, res)`: API de estatísticas
- `apiHistorico(req, res)`: API de histórico
- `obrasRecentes(req, res)`: API de obras recentes
- `controleGeral(req, res)`: Página de controle geral
**Dependências**: Checklist model, Auditoria model, Historico model, Obra model
**Fluxo interno**:
1. Agrega dados de múltiplos models
2. Calcula métricas (progresso médio, contadores)
3. Formata dados para apresentação

#### 5.1.5 ControleGeralController (`src/controllers/controleGeralController.js`)
**Responsabilidade**: Controlar acesso aos módulos especializados
**Descrição funcional**: Renderizar páginas de menu e coordenar módulos
**Interfaces expostas**:
- `controleGeral(req, res)`: Página principal de controle
- `obras(req, res)`, `estoque(req, res)`, etc.: Páginas de módulos
**Dependências**: Models específicos de cada módulo
**Fluxo interno**:
1. Verifica permissões
2. Renderiza interface apropriada
3. Coordena com controllers específicos

### 5.2 Models

#### 5.2.1 User Model (`src/models/User.js`)
**Responsabilidade**: Operações CRUD na tabela `usuarios`
**Descrição funcional**: Gerenciar dados de usuários/clientes
**Interfaces expostas**:
- `create(nome, email, telefone, endereco, obra, adminId)`: Insere usuário
- `findAllByAdmin(adminId)`: Lista usuários do admin
- `findById(id)`: Busca usuário específico
- `update(id, nome, email, telefone, endereco, obra)`: Atualiza usuário
- `deleteById(id)`: Remove usuário
- `getHistoricoByUsuario(id)`: Histórico de alterações
**Dependências**: connection.js (banco de dados)
**Fluxo interno**:
1. Valida parâmetros
2. Executa query SQL
3. Trata erros e retorna resultado

#### 5.2.2 Checklist Model (`src/models/Checklist.js`)
**Responsabilidade**: Gerenciar checklist de documentação das obras
**Descrição funcional**: Controlar status de 6 itens obrigatórios por usuário
**Campos válidos**: `uso_solo`, `licenca`, `condominio`, `habite_se`, `averbacao`, `vistoria`
**Valores válidos**: `Nao Tem`, `Andamento`, `Feito`
**Interfaces expostas**:
- `findByUser(userId)`: Busca checklist do usuário
- `update(userId, field, value)`: Atualiza campo específico
- `getProgresso(userId)`: Calcula progresso (0-100%)
- `findAllWithProgresso()`: Lista todos com progresso
- `updateObservacoes(userId, observacoes)`: Atualiza observações
**Dependências**: connection.js
**Fluxo interno**:
1. Valida campo e valor
2. Executa UPDATE na tabela `checklist_usuarios`
3. Trata casos onde tabela não existe (fallback graceful)

#### 5.2.3 Obra Model (`src/models/Obra.js`)
**Responsabilidade**: Operações CRUD na tabela `obras`
**Descrição funcional**: Gerenciar obras vinculadas a usuários
**Interfaces expostas**:
- `create(usuarioId, nome, descricao)`: Cria obra
- `findByUsuario(usuarioId)`: Lista obras do usuário
- `findById(id)`: Busca obra específica
- `update(id, nome)`: Atualiza nome
- `delete(id)`: Remove obra
- `findAllRecent(limit)`: Obras mais recentes
**Dependências**: connection.js
**Fluxo interno**:
1. Valida parâmetros
2. Executa operação SQL
3. Trata joins com tabela usuarios

#### 5.2.4 Auditoria Model (`src/models/Auditoria.js`)
**Responsabilidade**: Registrar todas as ações do sistema
**Descrição funcional**: Log de auditoria para compliance e rastreabilidade
**Interfaces expostas**:
- `create(adminId, usuarioId, acao, campo, valorAnterior, valorNovo)`: Registra ação
- `findAll()`: Lista todas as auditorias
- `findByUsuario(usuarioId)`: Auditoria de usuário específico
- `contarPorAcao()`: Estatísticas por tipo de ação
**Dependências**: connection.js
**Fluxo interno**:
1. Recebe dados da ação
2. Insere na tabela `auditoria`
3. Mantém histórico completo

#### 5.2.5 Historico Model (`src/models/Historico.js`)
**Responsabilidade**: Controlar histórico temporal de alterações
**Descrição funcional**: Timeline de mudanças em usuários
**Interfaces expostas**:
- `create(usuarioId, tipo, descricao, adminId)`: Registra evento
- `findRecente()`: Histórico recente do sistema
- `findByUsuario(usuarioId)`: Histórico específico
**Dependências**: connection.js
**Fluxo interno**:
1. Registra evento com timestamp
2. Permite consultas por período

#### 5.2.6 Admin Model (`src/models/Admin.js`)
**Responsabilidade**: Gerenciar administradores do sistema
**Descrição funcional**: Autenticação e dados de admins
**Interfaces expostas**:
- `findByEmail(email)`: Busca admin por email
- `findById(id)`: Busca admin por ID
- `create(nome, email, password)`: Cria novo admin
**Dependências**: connection.js, bcrypt
**Fluxo interno**:
1. Hash de senha na criação
2. Validação de unicidade de email

### 5.3 Módulos Especializados

#### 5.3.1 Módulo de Estoque (`src/modules/estoque/`)
**Responsabilidade**: Gerenciar materiais, estoque e movimentações
**Componentes**:
- **Controllers**:
  - `estoqueController.js`: Dashboard e listagem
  - `materialController.js`: CRUD de materiais
  - `movimentacaoObraController.js`: Movimentações em obras
- **Models**:
  - `Material.js`: Dados de materiais
  - `EstoqueMovimentacao.js`: Movimentações de estoque
- **Routes**: `estoqueRoutes.js`
- **Views**: Templates Handlebars específicos
**Fluxo interno**:
1. Controle de entrada/saída de materiais
2. Vinculação de materiais a obras
3. Rastreamento de movimentações

### 5.4 Middlewares

#### 5.4.1 isAuth (`src/middlewares/isAuth.js`)
**Responsabilidade**: Verificar autenticação em rotas protegidas
**Descrição funcional**: Middleware que verifica sessão ativa
**Fluxo interno**:
1. Verifica `req.session.adminId`
2. Redireciona para `/login` se não autenticado
3. Permite continuação se válido
4. Log de tentativas não autorizadas

### 5.5 Utilitários

#### 5.5.1 Logger (`src/utils/logger.js`)
**Responsabilidade**: Sistema de logging estruturado
**Descrição funcional**: Registrar eventos, erros e informações
**Níveis**: info, warn, error
**Saídas**: Console e arquivo (`logs/app.log`)
**Formato**: Timestamp, nível, mensagem

## 6. Fluxos de Execução do Sistema

### 6.1 Fluxo Principal de Autenticação
1. **Entrada**: Usuário acessa `/login`
2. **Apresentação**: Sistema renderiza formulário de login
3. **Submissão**: POST para `/login` com email/senha
4. **Validação**: AuthController valida credenciais
5. **Verificação**: Consulta Admin model no banco
6. **Comparação**: bcrypt compara senha com hash
7. **Sessão**: Cria sessão com `adminId`
8. **Redirecionamento**: Para `/dashboard`
9. **Middleware**: `isAuth` protege rotas subsequentes

### 6.2 Fluxo de Gestão de Usuários
1. **Listagem**: GET `/dashboard/tablesUsers`
2. **Validação**: Middleware verifica autenticação
3. **Consulta**: User.findAllByAdmin(adminId)
4. **Apresentação**: Renderiza lista com dados
5. **CRUD**: Operações delegadas para respectivos endpoints
6. **Auditoria**: Cada alteração registrada automaticamente

### 6.3 Fluxo de Checklist de Obra
1. **Acesso**: GET `/dashboard/usuarios/:id/checklist`
2. **Carregamento**: Checklist.findByUser(userId)
3. **Cálculo**: Progresso baseado em 6 campos obrigatórios
4. **Atualização**: POST com campo específico
5. **Validação**: Verifica valores permitidos
6. **Persistência**: UPDATE na tabela checklist_usuarios
7. **Feedback**: Retorno visual do progresso

### 6.4 Fluxo de Dashboard
1. **Carregamento**: GET `/dashboard`
2. **Agregação**: Múltiplas consultas paralelas
3. **Cálculos**: Progresso médio, contadores, estatísticas
4. **APIs**: Endpoints JSON para dados dinâmicos
5. **Renderização**: Template com dados agregados

### 6.5 Pontos de Entrada
- **Web**: `/login`, `/dashboard`, `/controle-geral`
- **APIs**: `/api/*` para dados JSON
- **Middleware**: `isAuth` em todas as rotas protegidas

### 6.6 Sequência de Execução Típica
1. Inicialização: `app.js` configura servidor
2. Conexão: Testa pool MySQL
3. Requisição: Cliente acessa rota protegida
4. Middleware: `isAuth` verifica sessão
5. Roteamento: `authRoutes.js` direciona
6. Controller: Processa lógica de negócio
7. Model: Executa operações no banco
8. View: Renderiza resposta HTML
9. Cliente: Recebe página atualizada

### 6.7 Tratamento de Exceções
- **Erros de validação**: Retorno com mensagens específicas
- **Erros de banco**: Fallback graceful, logging
- **Erros 404**: Página customizada
- **Erros 500**: Handler global com logging
- **Sessão expirada**: Redirecionamento automático

### 6.8 Logs e Mensagens de Erro
- **Logger**: Winston estruturado
- **Níveis**: info, warn, error
- **Contexto**: Timestamps, módulo, operação
- **Persistência**: Arquivo `logs/app.log`
- **Console**: Output colorido em desenvolvimento

## 7. Persistência e Dados

### 7.1 Estratégia de Persistência
- **Banco principal**: MySQL com InnoDB
- **Pool de conexões**: mysql2/promise com 10 conexões
- **Transações**: Suporte implícito via queries diretas
- **Backup**: Scripts manuais via mysqldump

### 7.2 Modelo de Dados

#### 7.2.1 Tabela `admins`
- **id**: INT AUTO_INCREMENT PRIMARY KEY
- **nome**: VARCHAR(150) NOT NULL
- **email**: VARCHAR(100) UNIQUE NOT NULL
- **password**: VARCHAR(255) NOT NULL (bcrypt hash)
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP ON UPDATE

#### 7.2.2 Tabela `usuarios`
- **id**: INT AUTO_INCREMENT PRIMARY KEY
- **nome**: VARCHAR(150) NOT NULL
- **email**: VARCHAR(100) UNIQUE NOT NULL
- **telefone**: VARCHAR(20)
- **endereco**: VARCHAR(255)
- **obra**: VARCHAR(150)
- **admin_id**: INT (FK para admins)
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP ON UPDATE

#### 7.2.3 Tabela `checklist_usuarios`
- **id**: INT AUTO_INCREMENT PRIMARY KEY
- **usuario_id**: INT UNIQUE (FK para usuarios)
- **uso_solo**: ENUM('Nao Tem','Andamento','Feito')
- **licenca**: ENUM('Nao Tem','Andamento','Feito')
- **condominio**: ENUM('Nao Tem','Andamento','Feito')
- **habite_se**: ENUM('Nao Tem','Andamento','Feito')
- **averbacao**: ENUM('Nao Tem','Andamento','Feito')
- **vistoria**: ENUM('Nao Tem','Andamento','Feito')
- **observacoes**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP ON UPDATE

#### 7.2.4 Tabela `obras`
- **id**: INT AUTO_INCREMENT PRIMARY KEY
- **usuario_id**: INT (FK para usuarios)
- **nome_obra**: VARCHAR(150)
- **descricao**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP ON UPDATE

#### 7.2.5 Tabela `historico`
- **id**: INT AUTO_INCREMENT PRIMARY KEY
- **usuario_id**: INT (FK para usuarios)
- **tipo**: VARCHAR(50)
- **descricao**: TEXT
- **admin_id**: INT (FK para admins)
- **created_at**: TIMESTAMP

#### 7.2.6 Tabela `auditoria`
- **id**: INT AUTO_INCREMENT PRIMARY KEY
- **admin_id**: INT
- **usuario_id**: INT (FK para usuarios)
- **acao**: VARCHAR(100)
- **campo**: VARCHAR(50)
- **valor_anterior**: TEXT
- **valor_novo**: TEXT
- **created_at**: TIMESTAMP

### 7.3 Relacionamentos
- **admins (1) → usuarios (N)**: Um admin gerencia múltiplos usuários
- **usuarios (1) → checklist_usuarios (1)**: Um usuário tem um checklist
- **usuarios (1) → obras (N)**: Um usuário pode ter múltiplas obras
- **usuarios (1) → historico (N)**: Histórico de alterações por usuário
- **usuarios (1) → auditoria (N)**: Registros de auditoria por usuário

### 7.4 Regras de Integridade
- **Foreign Keys**: CASCADE on DELETE para relacionamentos dependentes
- **Unique Constraints**: Email único em admins e usuarios
- **Not Null**: Campos obrigatórios validados em aplicação
- **ENUM**: Valores restritos em campos de checklist

### 7.5 Operações CRUD
- **Create**: INSERT com validação de unicidade
- **Read**: SELECT com JOINs para dados relacionados
- **Update**: UPDATE com validação de existência
- **Delete**: DELETE com verificação de dependências

### 7.6 Estratégia de Backup
- **Manual**: Scripts SQL para export/import
- **Automação**: Recomendado mysqldump diário
- **Recuperação**: Restauração via scripts de setup

## 8. Regras de Negócio

### 8.1 Regras de Autenticação
- Administradores têm acesso exclusivo aos seus usuários
- Sessão expira após 24 horas de inatividade
- Rate limiting: máximo 5 tentativas de login por 15 minutos
- Senhas hasheadas com bcrypt (salt rounds: 10)

### 8.2 Regras de Usuários
- Email único por usuário
- Usuários vinculados obrigatoriamente a um admin
- Campos obrigatórios: nome, email, endereco, obra
- Exclusão cascata: remove obras e histórico associados

### 8.3 Regras de Checklist
- 6 campos obrigatórios por obra: uso_solo, licenca, condominio, habite_se, averbacao, vistoria
- Valores permitidos: 'Nao Tem', 'Andamento', 'Feito'
- Progresso calculado: (campos 'Feito' / 6) * 100
- Observações livres para anotações adicionais

### 8.4 Regras de Auditoria
- Toda alteração em usuários é registrada
- Campos auditados: ação, campo, valores anterior/novo
- Admin responsável identificado
- Histórico imutável (apenas INSERT)

### 8.5 Regras de Segurança
- Middleware de autenticação em todas as rotas protegidas
- Headers de segurança via Helmet
- CORS restrito a localhost:3000
- Sessão HTTP-only e SameSite strict

### 8.6 Validações
- **Entrada**: Sanitização e validação em controllers
- **Tipos**: Conversão e verificação de tipos
- **Existência**: Verificação de registros relacionados
- **Permissões**: Admin só acessa seus próprios usuários

### 8.7 Automatizações
- Criação automática de checklist ao criar usuário
- Cálculo automático de progresso
- Registro automático de auditoria
- Timestamps automáticos (created_at, updated_at)

### 8.8 Dependências entre Regras
- Usuário deve existir antes de criar checklist
- Admin deve existir antes de vincular usuários
- Obra deve estar vinculada a usuário existente
- Auditoria depende de existência de admin e usuário

## 9. Segurança e Boas Práticas

### 9.1 Medidas de Segurança Implementadas

#### 9.1.1 Autenticação e Autorização
- **Sessões seguras**: HTTP-only, SameSite strict, expiração 24h
- **Rate limiting**: 5 tentativas/15min na rota de login
- **Middleware de auth**: Verificação em todas as rotas protegidas
- **Isolamento por admin**: Usuários visíveis apenas para seu admin

#### 9.1.2 Proteção de Dados
- **Hash de senhas**: bcrypt com salt automático
- **Validação de entrada**: Sanitização em controllers
- **CORS configurado**: Origem restrita a localhost
- **Headers de segurança**: Helmet para OWASP compliance

#### 9.1.3 Auditoria e Rastreabilidade
- **Log completo**: Toda ação registrada na tabela auditoria
- **Histórico temporal**: Mudanças versionadas por timestamp
- **Admin responsável**: Identificação de quem fez cada alteração
- **Imutabilidade**: Registros de auditoria não editáveis

### 9.2 Validação de Entradas
- **Obrigatórios**: Verificação de campos required
- **Tipos**: Conversão e validação de tipos (number, string)
- **Formatos**: Email, telefone validados por regex
- ** Unicidade**: Email único verificado antes do INSERT
- **Existência**: FK validadas antes de operações

### 9.3 Proteção de Dados
- **Criptografia**: Senhas hasheadas irreversivelmente
- **Isolamento**: Dados de um admin invisíveis para outros
- **Backup seguro**: Scripts manuais para export
- **Logs seguros**: Informações sensíveis não logadas

### 9.4 Boas Práticas de Código

#### 9.4.1 Estrutura MVC
- Separação clara entre Models, Views, Controllers
- Responsabilidades bem definidas
- Reutilização de componentes

#### 9.4.2 Tratamento de Erros
- Try-catch em todas as operações assíncronas
- Logging estruturado de erros
- Fallback graceful para operações críticas
- Mensagens de erro apropriadas por ambiente

#### 9.4.3 Padrões de Codificação
- **Nomenclatura consistente**: camelCase, PascalCase, snake_case
- **Funções puras**: Separação de lógica e efeitos colaterais
- **Validação antecipada**: Fail fast em entradas inválidas
- **Documentação**: Comentários explicativos em código complexo

#### 9.4.4 Performance
- **Pool de conexões**: Reutilização eficiente do banco
- **Queries otimizadas**: JOINs apropriados, índices utilizados
- **Middleware chain**: Processamento sequencial eficiente
- **Caching implícito**: Sessões em memória

### 9.5 Padrões de Projeto Utilizados
- **MVC**: Separação de responsabilidades
- **Middleware Pattern**: Chain of responsibility
- **Repository Pattern**: Abstração de dados (implícito)
- **Observer Pattern**: Logging automático de ações
- **Factory Pattern**: Criação de objetos complexos

### 9.6 Convenções Adotadas
- **Git Flow**: Branches feature, develop, main
- **Commits semânticos**: tipo: descrição
- **Documentação**: README, comentários em código
- **Environment**: Separação dev/prod via variáveis
- **Logs estruturados**: Winston com níveis apropriados

## 10. Configuração e Execução do Sistema

### 10.1 Pré-requisitos
- **Node.js**: Versão 14.0.0 ou superior
- **MySQL**: Versão 8.0 ou superior
- **npm**: Gerenciador de pacotes (incluído com Node.js)
- **Git**: Para controle de versão

### 10.2 Configuração do Ambiente

#### 10.2.1 Arquivo .env
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin
DB_NAME=rp_empreendimentos
DB_PORT=3306
SESSION_SECRET=chave-secreta-muito-forte-para-sessao-2024-rp-empreendimentos
PORT=5000
NODE_ENV=development
```

#### 10.2.2 Banco de Dados
- Criar banco: `CREATE DATABASE rp_empreendimentos;`
- Executar script: `scripts/SETUP_COMPLETO.sql`
- Verificar tabelas criadas

### 10.3 Procedimento de Execução

#### 10.3.1 Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento (com nodemon)
npm run dev
```

#### 10.3.2 Produção
```bash
# Instalar dependências
npm install --production

# Executar em modo produção
npm run prod
```

#### 10.3.3 Verificação
- Acessar: http://localhost:5000
- Login: admin@empresa.com / 123456
- Verificar conexão com banco nos logs

### 10.4 Procedimento para Desenvolvimento
1. **Clone**: `git clone <repo>`
2. **Install**: `npm install`
3. **Setup DB**: Executar `scripts/SETUP_COMPLETO.sql`
4. **Config**: Ajustar `.env` se necessário
5. **Run**: `npm run dev`
6. **Test**: Acessar endpoints via browser/Postman

### 10.5 Procedimento para Produção
1. **Build**: Ambiente limpo sem devDependencies
2. **Config**: Variáveis de produção no `.env`
3. **Database**: Backup e migração se necessário
4. **Deploy**: `npm run prod`
5. **Monitor**: Logs em `logs/app.log`
6. **Backup**: Automatizar mysqldump diário

## 11. Manutenção e Evolução

### 11.1 Pontos Críticos do Sistema
- **Conexão MySQL**: Pool de conexões pode saturar
- **Sessões**: Memória pode crescer com muitas sessões
- **Logs**: Arquivo de log pode crescer indefinidamente
- **Rate limiting**: Pode bloquear usuários legítimos
- **Checklist**: Validação rigorosa dos ENUMs

### 11.2 Como Adicionar Novos Módulos
1. **Estrutura**: Criar `src/modules/novo_modulo/`
2. **MVC**: Implementar controllers, models, routes, views
3. **Rotas**: Registrar em `app.js` e `controleGeralRoutes.js`
4. **Menu**: Adicionar link na view `controlegeral.handlebars`
5. **Database**: Criar tabelas e relacionamentos
6. **Testes**: Validar integração completa

### 11.3 Como Modificar Regras Existentes
1. **Análise**: Entender impacto da mudança
2. **Models**: Modificar queries e validações
3. **Controllers**: Ajustar lógica de negócio
4. **Views**: Atualizar interface se necessário
5. **Database**: Migration se schema mudar
6. **Testes**: Validar não-quebra de funcionalidades

### 11.4 Estratégias de Escalabilidade
- **Horizontal**: Load balancer para múltiplas instâncias
- **Database**: Read replicas para consultas pesadas
- **Cache**: Redis para sessões e dados frequentes
- **CDN**: Para assets estáticos
- **Microserviços**: Separar módulos em serviços independentes

### 11.5 Riscos Técnicos Conhecidos
- **Dependência MySQL**: Single point of failure
- **Sessões em memória**: Perdidas em restart
- **Rate limiting memory**: Contadores não persistidos
- **Logs síncronos**: Podem bloquear em alta carga
- **Sem testes automatizados**: Risco de regressões

## 12. Considerações Técnicas Finais

### 12.1 Limitações Atuais
- **Escalabilidade vertical**: Limitada por Node.js single-threaded
- **Persistência de sessão**: Perdida em restarts do servidor
- **Backup automático**: Não implementado
- **Testes**: Ausência de suíte automatizada
- **Monitoramento**: Sem métricas ou alertas
- **Cache**: Sem camada de cache implementada

### 12.2 Possíveis Melhorias
- **Containerização**: Docker para ambientes consistentes
- **ORM**: Sequelize ou Prisma para abstração de dados
- **Autenticação JWT**: Para APIs REST puras
- **Testes**: Jest para unitários e integração
- **CI/CD**: Pipelines automatizados
- **Monitoramento**: PM2, New Relic ou similar
- **Cache**: Redis para sessões e dados
- **API RESTful**: Endpoints padronizados
- **TypeScript**: Tipagem estática para maior robustez
- **Documentação API**: Swagger/OpenAPI

### 12.3 Recomendações Técnicas
- **Monitoramento**: Implementar logging centralizado e alertas
- **Backup**: Automatizar backups diários do banco
- **Testes**: Desenvolver suíte completa antes de produção
- **Performance**: Otimizar queries N+1 e implementar paginação
- **Segurança**: Revisão periódica de vulnerabilidades
- **Documentação**: Manter atualizada com mudanças
- **Code Review**: Processo obrigatório para mudanças
- **Versionamento**: Semantic versioning para releases

### 12.4 Boas Práticas para Continuidade do Projeto
- **Documentação**: Atualizar este documento com mudanças
- **Versionamento**: Usar Git Flow para desenvolvimento
- **Code Style**: ESLint e Prettier para consistência
- **Commits**: Mensagens semânticas e descritivas
- **Branches**: Feature branches para desenvolvimento
- **Reviews**: Code review obrigatório
- **Testes**: Cobertura mínima de 80% em produção
- **Deploy**: Blue-green ou canary deployments
- **Monitoramento**: Logs, métricas e alertas 24/7
- **Backup**: Estratégia 3-2-1 (3 cópias, 2 mídias, 1 offsite)

#### 4.4.4 Variáveis e Funções
- **JavaScript**: camelCase para variáveis e funções
- **Constantes**: UPPER_SNAKE_CASE
- **Classes/Models**: PascalCase