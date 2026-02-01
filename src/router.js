const express = require('express');
const router = express.Router();

// Middlewares
const isAuth = require('./middlewares/isAuth');

// Routes
const authRoutes = require('./routes/authRoutes');
const { obrasRouter, materiaisRouter, funcionariosRouter, financeiroRouter, mensagensRouter, relatoriosRouter } = require('./routes/controleGeralRoutes');
const estoqueRoutes = require('./modules/estoque/routes/estoqueRoutes');

// Controllers
const controleGeralController = require('./controllers/controleGeralController');

// Mount routes
router.get('/test-rota', (req, res) => res.send('TESTE OK'));
router.use('/', authRoutes);
router.use('/estoque', estoqueRoutes);

// API routes
router.use('/api/obras', obrasRouter);
router.use('/api/materiais', materiaisRouter);
router.use('/api/funcionarios', funcionariosRouter);
router.use('/api/financeiro', financeiroRouter);
router.use('/api/mensagens', mensagensRouter);
router.use('/api/relatorios', relatoriosRouter);

// Controle Geral view routes
router.get('/controle-geral', isAuth, controleGeralController.controleGeral);
router.get('/dashboard/controle-geral', isAuth, controleGeralController.controleGeral);
router.get('/controle-geral/obras', isAuth, controleGeralController.obras);
router.post('/controle-geral/obras', isAuth, controleGeralController.criarObra);
router.get('/dashboard/controle-geral/obras', isAuth, controleGeralController.obras);
router.post('/dashboard/controle-geral/obras', isAuth, controleGeralController.criarObra);
router.get('/dashboard/controle-geral/obras/edit/:id', isAuth, controleGeralController.editarObraPage);
router.post('/dashboard/controle-geral/obras/edit/:id', isAuth, controleGeralController.editarObra);
router.post('/dashboard/controle-geral/obras/delete/:id', isAuth, controleGeralController.excluirObra);
router.get('/controle-geral/estoque', isAuth, controleGeralController.estoque);
router.post('/controle-geral/estoque', isAuth, controleGeralController.criarMaterial);
router.get('/dashboard/controle-geral/estoque', isAuth, controleGeralController.estoque);
router.post('/dashboard/controle-geral/estoque', isAuth, controleGeralController.criarMaterial);
router.get('/dashboard/controle-geral/estoque/edit/:id', isAuth, controleGeralController.editarMaterialPage);
router.post('/dashboard/controle-geral/estoque/edit/:id', isAuth, controleGeralController.editarMaterial);
router.post('/dashboard/controle-geral/estoque/delete/:id', isAuth, controleGeralController.excluirMaterial);

// Materiais por obra
router.get('/dashboard/controle-geral/estoque/obra/:obra_id', isAuth, controleGeralController.materiaisObra);
router.post('/dashboard/controle-geral/estoque/obra/:obra_id/adicionar', isAuth, controleGeralController.adicionarMaterialObra);
router.post('/dashboard/controle-geral/estoque/obra/:obra_id/editar/:material_obra_id', isAuth, controleGeralController.editarMaterialObra);
router.post('/dashboard/controle-geral/estoque/obra/:obra_id/remover/:material_obra_id', isAuth, controleGeralController.removerMaterialObra);

// Movimentações de materiais na obra
router.get('/dashboard/controle-geral/estoque/obra/:obra_id/movimentacoes', isAuth, controleGeralController.movimentacoesObra);
router.post('/dashboard/controle-geral/estoque/obra/:obra_id/entrada', isAuth, controleGeralController.registrarEntradaObra);
router.post('/dashboard/controle-geral/estoque/obra/:obra_id/saida', isAuth, controleGeralController.registrarSaidaObra);

// Equipes
router.get('/controle-geral/equipes', isAuth, controleGeralController.equipes);
router.get('/dashboard/controle-geral/equipes', isAuth, controleGeralController.equipes);
router.post('/controle-geral/equipes', isAuth, controleGeralController.criarFuncionario);
router.post('/dashboard/controle-geral/equipes/update', isAuth, controleGeralController.editarFuncionario);
router.post('/dashboard/controle-geral/equipes/delete/:id', isAuth, controleGeralController.excluirFuncionario);

// Financeiro
router.get('/controle-geral/financeiro', isAuth, controleGeralController.financeiro);
router.post('/controle-geral/financeiro', isAuth, controleGeralController.criarFinanceiro);
router.get('/dashboard/controle-geral/financeiro', isAuth, controleGeralController.financeiro);
router.post('/dashboard/controle-geral/financeiro', isAuth, controleGeralController.criarFinanceiro);

// Comunicação
router.get('/controle-geral/comunicacao', isAuth, controleGeralController.comunicacao);
router.get('/dashboard/controle-geral/comunicacao', isAuth, controleGeralController.comunicacao);

// Relatórios
router.get('/controle-geral/relatorios', isAuth, controleGeralController.relatorios);
router.get('/dashboard/controle-geral/relatorios', isAuth, controleGeralController.relatorios);

module.exports = router;
