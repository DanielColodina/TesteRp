const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const materialObraController = require('../controllers/materialObraController');
const movimentacaoObraController = require('../controllers/movimentacaoObraController');
const estoqueController = require('../controllers/estoqueController');
const isAuth = require('../../../middlewares/isAuth');

// Middleware de autenticação para todas as rotas
router.use(isAuth);

// Dashboard de estoque
router.get('/', estoqueController.dashboard);

// === MATERIAIS ===
// Listar materiais
router.get('/materiais', materialController.list);

// Criar material
router.get('/materiais/novo', materialController.createPage);
router.post('/materiais', materialController.create);

// Editar material
router.get('/materiais/:id/editar', materialController.editPage);
router.post('/materiais/:id', materialController.update);

// Ver material
router.get('/materiais/:id', materialController.view);

// Deletar material
router.post('/materiais/:id/deletar', materialController.delete);

// API para busca de materiais
router.get('/api/materiais/busca', materialController.apiSearch);
router.get('/api/materiais/estoque-baixo', materialController.apiEstoqueBaixo);

// === MOVIMENTAÇÕES ===
// Listar movimentações
router.get('/movimentacoes', estoqueController.list);

// Entrada de material
router.get('/entrada', estoqueController.entradaPage);
router.post('/entrada', estoqueController.registrarEntrada);

// Saída de material
router.get('/saida', estoqueController.saidaPage);
router.post('/saida', estoqueController.registrarSaida);

// Ver movimentação
router.get('/movimentacoes/:id', estoqueController.view);

// Relatórios
router.get('/relatorios/consumo/:obra_id', estoqueController.relatorioConsumo);

// APIs
router.get('/api/movimentacoes/material/:material_id', estoqueController.apiByMaterial);
router.get('/api/movimentacoes/obra/:obra_id', estoqueController.apiByObra);

// === MATERIAIS POR OBRA ===
router.get('/obras/:obra_id/materiais', materialObraController.list);
router.get('/obras/:obra_id/materiais/adicionar', materialObraController.addPage);
router.post('/obras/:obra_id/materiais', materialObraController.add);
router.get('/obras/:obra_id/materiais/:id/editar', materialObraController.editPage);
router.post('/obras/:obra_id/materiais/:id', materialObraController.update);
router.post('/obras/:obra_id/materiais/:id/deletar', materialObraController.delete);
router.get('/obras/:obra_id/materiais/importar', materialObraController.importarCatalogo);

// APIs para materiais de obra
router.get('/api/obras/:obra_id/materiais/busca', materialObraController.apiSearch);
router.get('/api/obras/:obra_id/materiais/saldo-baixo', materialObraController.apiSaldoBaixo);

// === MOVIMENTAÇÕES POR OBRA ===
router.get('/obras/:obra_id/movimentacoes', movimentacaoObraController.list);
router.get('/obras/:obra_id/movimentacoes/entrada', movimentacaoObraController.entradaPage);
router.post('/obras/:obra_id/movimentacoes/entrada', movimentacaoObraController.registrarEntrada);
router.get('/obras/:obra_id/movimentacoes/saida', movimentacaoObraController.saidaPage);
router.post('/obras/:obra_id/movimentacoes/saida', movimentacaoObraController.registrarSaida);
router.get('/obras/:obra_id/relatorios/consumo', movimentacaoObraController.relatorioConsumo);

module.exports = router;