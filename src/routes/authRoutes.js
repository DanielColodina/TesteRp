// Chamando os módulos
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const usuarioController = require('../controllers/usuarioController');
const dashboardController = require('../controllers/dashboardController');
const isAuth = require('../middlewares/isAuth');
const obraController = require('../controllers/obraController');

// ---------------- ROTAS PÚBLICAS ----------------

// Rota raiz
router.get('/', (req, res) => {
  console.log('DEBUG: Rota raiz chamada - redirecionando para /login');
  res.redirect('/login');
});

// Página de login
router.get('/login', (req, res) => {
  console.log('DEBUG: Rota /login acessada');
  authController.loginPage(req, res);
});

// Processa login
router.post('/login', authController.login);

// ---------------- ROTAS PROTEGIDAS ----------------

// Dashboard
router.get('/dashboard', isAuth, authController.dashboard);

// Criar usuário
router.post('/dashboard/usuarios', isAuth, usuarioController.create);

// Listar usuários
router.get('/dashboard/tablesUsers', isAuth, usuarioController.list);

// EXCLUIR USUARIO 
router.post('/dashboard/usuarios/:id/delete', isAuth, usuarioController.delete);

// EDITAR USUARIO
router.get('/dashboard/usuarios/:id/edit', isAuth, usuarioController.editpage);
router.post('/dashboard/usuarios/:id/edit', isAuth, usuarioController.update);

// HISTORICO POR OBRA
router.get('/dashboard/usuarios/:id/historico', isAuth, usuarioController.historico);

// AUDITORIA DE USUÁRIO
router.get('/dashboard/usuarios/:id/auditoria', isAuth, usuarioController.auditoria);

// PROGRESSO DA OBRA
router.get('/dashboard/usuarios/:id/progresso', isAuth, usuarioController.progresso);

// criar obra vinculada ao usuário
router.post('/dashboard/obras', isAuth, obraController.create);

// buscar obra + etapas (para modal)
router.get('/dashboard/obras/:id', isAuth, obraController.view);

// editar obra
router.post('/dashboard/obras/:id/edit', isAuth, obraController.update);

// excluir obra
router.post('/dashboard/obras/:id/delete', isAuth, obraController.delete);

// ROTAS CHECKLIST
router.get('/dashboard/usuarios/:id/checklist', isAuth, usuarioController.getChecklist);
router.post('/dashboard/usuarios/:id/checklist', isAuth, usuarioController.updateChecklist);
router.post('/dashboard/usuarios/:id/observacoes', isAuth, usuarioController.updateObservacoes);

// DASHBOARD COM PROGRESSO
router.get('/dashboard/progresso', isAuth, dashboardController.dashboardProgresso);

// AUDITORIA COMPLETA
router.get('/dashboard/auditoria', isAuth, dashboardController.auditoria);

// HISTÓRICO COMPLETO
router.get('/dashboard/historico', isAuth, dashboardController.historicoCompleto);

// API HISTÓRICO
router.get('/dashboard/api/historico', isAuth, dashboardController.apiHistorico);

// API OBRAS RECENTES
router.get('/dashboard/api/obras-recentes', isAuth, dashboardController.obrasRecentes);

// API ESTATÍSTICAS
router.get('/dashboard/api/stats', isAuth, dashboardController.apiStats);

// =================== GERENCIAMENTO DE OBRAS ===================

// Listar todas as obras do admin
router.get('/obras', isAuth, obraController.listAll);

// Página de criação de obra
router.get('/obras/nova', isAuth, obraController.createPage);

// Criar obra
router.post('/obras', isAuth, obraController.createStandalone);

// Página de edição de obra
router.get('/obras/:id/editar', isAuth, obraController.editPage);

// Atualizar obra
router.post('/obras/:id', isAuth, obraController.update);

// Excluir obra
router.post('/obras/:id/excluir', isAuth, obraController.delete);

// Desvincular obra do usuário
router.post('/obras/:id/desvincular', isAuth, obraController.desvincular);

// API para buscar usuários do admin (para dropdown)
router.get('/api/usuarios', isAuth, usuarioController.getUsuariosForDropdown);

// CONTROLE GERAL
router.get('/dashboard/controle-geral', dashboardController.controleGeral);

// ---------------- EXPORT ----------------
module.exports = router;
