# RP Empreendimentos - Sistema de Gestão de Obras

## Visão Geral

O RP Empreendimentos é um sistema web completo para gestão de obras de construção civil, desenvolvido em Node.js com Express.js. Oferece funcionalidades para administradores e usuários gerenciarem obras, materiais, equipes, finanças e muito mais.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Banco de Dados**: MySQL
- **Template Engine**: Handlebars
- **Autenticação**: Sessões com bcrypt
- **Frontend**: HTML5, CSS3, JavaScript
- **Processamento**: PM2 para produção
- **Outros**: Compression, CORS, Helmet, Rate Limiting

## Estrutura do Projeto

```
rp-empreendimentos/
├── src/
│   ├── app.js                 # Arquivo principal da aplicação
│   ├── router.js              # Centralização de todas as rotas
│   ├── package.json           # Dependências e scripts
│   ├── controllers/           # Controladores da aplicação
│   │   ├── authController.js
│   │   ├── controleGeralController.js
│   │   ├── dashboardController.js
│   │   ├── obraController.js
│   │   └── usuarioController.js
│   ├── models/                # Modelos de dados
│   │   ├── Admin.js
│   │   ├── Auditoria.js
│   │   ├── Checklist.js
│   │   ├── EtapaObra.js
│   │   ├── Historico.js
│   │   ├── Obra.js
│   │   └── User.js
│   ├── routes/                # Definições de rotas
│   │   ├── authRoutes.js
│   │   └── controleGeralRoutes.js
│   ├── modules/               # Módulos especializados
│   │   └── estoque/
│   │       ├── controllers/
│   │       ├── models/
│   │       └── routes/
│   ├── middlewares/           # Middlewares personalizados
│   │   └── isAuth.js
│   ├── utils/                 # Utilitários
│   │   └── logger.js
│   ├── views/                 # Templates Handlebars
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── login.handlebars
│   │   ├── dashboard.handlebars
│   │   └── ...
│   └── database/              # Configuração do banco
│       └── connection.js
├── public/                    # Arquivos estáticos
│   ├── css/
│   ├── js/
│   └── img/
├── scripts/                   # Scripts de manutenção
├── logs/                      # Arquivos de log
├── CONTROLEGERAL/             # Documentação adicional
└── package.json
```

## Funcionalidades Principais

### 👤 Gestão de Usuários
- Cadastro e autenticação de usuários
- Perfis de administrador e usuário comum
- Controle de permissões por sessão

### 🏗️ Gestão de Obras
- Criação e edição de obras
- Acompanhamento de progresso
- Vinculação de usuários às obras
- Controle de etapas e checklists

### 📦 Controle de Estoque
- Cadastro de materiais
- Controle de entrada/saída
- Gestão por obra
- Alertas de estoque baixo

### 👷 Gestão de Equipes
- Cadastro de funcionários
- Vinculação a obras
- Controle de presença e atividades

### 💰 Gestão Financeira
- Controle de custos por obra
- Relatórios financeiros
- Orçamentos e previsões

### 📊 Dashboards e Relatórios
- Dashboard principal com estatísticas
- Relatórios de progresso
- Histórico de atividades
- Auditoria completa

### 🔒 Segurança
- Autenticação segura com bcrypt
- Proteção CSRF com sessões
- Rate limiting para prevenir ataques
- Headers de segurança com Helmet
- CORS configurado

## Instalação e Execução

### Pré-requisitos
- Node.js 18.x
- MySQL 8.0+
- NPM ou Yarn

### Instalação
```bash
# Clonar repositório
git clone <repository-url>
cd rp-empreendimentos

# Instalar dependências
npm install

# Configurar banco de dados
# Executar scripts em scripts/ para criar banco
node scripts/create_db.js

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações
```

### Execução
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## API Endpoints

### Autenticação
- `GET /login` - Página de login
- `POST /login` - Processar login
- `GET /logout` - Logout

### Dashboard
- `GET /dashboard` - Dashboard principal
- `GET /dashboard/progresso` - Dashboard de progresso

### Gestão de Usuários
- `GET /dashboard/tablesUsers` - Listar usuários
- `POST /dashboard/usuarios` - Criar usuário
- `POST /dashboard/usuarios/:id/delete` - Excluir usuário

### Gestão de Obras
- `GET /obras` - Listar obras
- `POST /obras` - Criar obra
- `GET /obras/:id/editar` - Editar obra
- `POST /obras/:id` - Atualizar obra

### API de Controle Geral
- `GET /api/obras` - API de obras
- `GET /api/materiais` - API de materiais
- `GET /api/funcionarios` - API de funcionários

## Banco de Dados

### Tabelas Principais
- `users` - Usuários do sistema
- `admins` - Administradores
- `obras` - Obras cadastradas
- `materiais` - Materiais do estoque
- `funcionarios` - Equipe de funcionários
- `financeiro` - Dados financeiros
- `historico` - Log de atividades
- `auditoria` - Auditoria do sistema

### Relacionamentos
- Usuário ↔ Obras (N:N)
- Obras ↔ Materiais (através de material_obra)
- Obras ↔ Funcionários
- Sistema de checklists por obra

## Segurança

- **Autenticação**: Sessões seguras com expiração
- **Autorização**: Middleware de autenticação em rotas protegidas
- **Proteção**: Rate limiting, Helmet, CORS
- **Logs**: Sistema de logging completo
- **Validação**: Sanitização de inputs

## Desempenho

- **Compressão**: Gzip para respostas HTTP
- **Cache**: Headers de cache para estáticos
- **Otimização**: Queries eficientes, async/await
- **Clustering**: PM2 para múltiplas instâncias

## Desenvolvimento

### Scripts Disponíveis
```bash
npm run dev      # Desenvolvimento com nodemon
npm start        # Produção com PM2
npm test         # Executar testes (quando implementados)
```

### Estrutura de Commits
- `feat:` - Novas funcionalidades
- `fix:` - Correções de bugs
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `perf:` - Melhorias de performance

## Deploy

### Render.com
- **Root Directory**: `src`
- **Build Command**: `npm install`
- **Start Command**: `node app.js`
- **Node Version**: 18.x

### Variáveis de Ambiente
```env
NODE_ENV=production
PORT=10000
DB_HOST=localhost
DB_USER=usuario
DB_PASS=senha
DB_NAME=rp_empreendimentos
SESSION_SECRET=chave-secreta-forte
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença ISC.

## Suporte

Para suporte, entre em contato com a equipe de desenvolvimento ou abra uma issue no repositório.