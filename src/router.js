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
const rotasCompletasController = require('./controllers/rotasCompletasController');

// Mount routes
router.get('/test-rota', (req, res) => res.send('TESTE OK'));

// Rota para limpar administradores (mantém apenas test@example.com)
router.get('/limpar-admins', async (req, res) => {
  const db = require('./database/connection');
  try {
    const [result] = await db.query(`DELETE FROM admins WHERE email != 'test@example.com'`);
    res.send(`✓ Removidos ${result.affectedRows} administradores (exceto test@example.com)`);
  } catch (err) {
    res.send('Erro: ' + err.message);
  }
});

router.use('/', authRoutes);
router.use('/estoque', estoqueRoutes);

// Rota Rotas Completas
router.get('/rotascompletas', isAuth, rotasCompletasController.index);
router.post('/rotascompletas', isAuth, rotasCompletasController.index);
router.get('/api/rotascompletas/:obraId', isAuth, rotasCompletasController.getObraDetails);

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
router.get('/controle-grade', isAuth, controleGeralController.controleGeral);
router.get('/dashboard/controle-grade', isAuth, controleGeralController.controleGeral);
router.get('/controle-grade/obras', isAuth, controleGeralController.obras);
router.post('/controle-grade/obras', isAuth, controleGeralController.criarObra);
router.get('/dashboard/controle-grade/obras', isAuth, controleGeralController.obras);
router.post('/dashboard/controle-grade/obras', isAuth, controleGeralController.criarObra);
router.get('/dashboard/controle-grade/obras/edit/:id', isAuth, controleGeralController.editarObraPage);
router.post('/dashboard/controle-grade/obras/edit/:id', isAuth, controleGeralController.editarObra);
router.post('/dashboard/controle-grade/obras/delete/:id', isAuth, controleGeralController.excluirObra);
router.get('/controle-grade/estoque', isAuth, controleGeralController.estoque);
router.post('/controle-grade/estoque', isAuth, controleGeralController.criarMaterial);
router.get('/dashboard/controle-grade/estoque', isAuth, controleGeralController.estoque);
router.post('/dashboard/controle-grade/estoque', isAuth, controleGeralController.criarMaterial);
router.get('/dashboard/controle-grade/estoque/edit/:id', isAuth, controleGeralController.editarMaterialPage);
router.post('/dashboard/controle-grade/estoque/edit/:id', isAuth, controleGeralController.editarMaterial);
router.post('/dashboard/controle-grade/estoque/delete/:id', isAuth, controleGeralController.excluirMaterial);

// Materiais por obra
router.get('/dashboard/controle-grade/estoque/obra/:obra_id', isAuth, controleGeralController.materiaisObra);
router.post('/dashboard/controle-grade/estoque/obra/:obra_id/adicionar', isAuth, controleGeralController.adicionarMaterialObra);
router.post('/dashboard/controle-grade/estoque/obra/:obra_id/editar/:material_obra_id', isAuth, controleGeralController.editarMaterialObra);
router.post('/dashboard/controle-grade/estoque/obra/:obra_id/remover/:material_obra_id', isAuth, controleGeralController.removerMaterialObra);

// Movimentações de materiais na obra
router.get('/dashboard/controle-grade/estoque/obra/:obra_id/movimentacoes', isAuth, controleGeralController.movimentacoesObra);
router.post('/dashboard/controle-grade/estoque/obra/:obra_id/entrada', isAuth, controleGeralController.registrarEntradaObra);
router.post('/dashboard/controle-grade/estoque/obra/:obra_id/saida', isAuth, controleGeralController.registrarSaidaObra);

// Equipes
router.get('/controle-grade/equipes', isAuth, controleGeralController.equipes);
router.get('/dashboard/controle-grade/equipes', isAuth, controleGeralController.equipes);
router.post('/controle-grade/equipes', isAuth, controleGeralController.criarFuncionario);
router.post('/dashboard/controle-grade/equipes/update', isAuth, controleGeralController.editarFuncionario);
router.post('/dashboard/controle-grade/equipes/delete/:id', isAuth, controleGeralController.excluirFuncionario);

// Financeiro
router.get('/controle-grade/financeiro', isAuth, controleGeralController.financeiro);
router.post('/controle-grade/financeiro', isAuth, controleGeralController.criarFinanceiro);
router.get('/dashboard/controle-grade/financeiro', isAuth, controleGeralController.financeiro);
router.post('/dashboard/controle-grade/financeiro', isAuth, controleGeralController.criarFinanceiro);
router.get('/dashboard/controle-grade/financeiro/edit/:id', isAuth, controleGeralController.editarFinanceiroPage);
router.post('/dashboard/controle-grade/financeiro/edit/:id', isAuth, controleGeralController.editarFinanceiro);
router.post('/dashboard/controle-grade/financeiro/delete/:id', isAuth, controleGeralController.excluirFinanceiro);

// Comunicação
router.get('/controle-grade/comunicacao', isAuth, controleGeralController.comunicacao);
router.get('/dashboard/controle-grade/comunicacao', isAuth, controleGeralController.comunicacao);

// Relatórios
router.get('/controle-grade/relatorios', isAuth, controleGeralController.relatorios);
router.post('/controle-grade/relatorios', isAuth, controleGeralController.criarRelatorio);
router.get('/dashboard/controle-grade/relatorios', isAuth, controleGeralController.relatorios);
router.post('/dashboard/controle-grade/relatorios', isAuth, controleGeralController.criarRelatorio);

module.exports = router;
