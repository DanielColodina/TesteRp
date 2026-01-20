const EstoqueMovimentacao = require('../models/EstoqueMovimentacao');
const Material = require('../models/Material');
const Obra = require('../../../models/Obra');

// Página de movimentações
exports.list = async (req, res) => {
    try {
        const filtros = {
            tipo: req.query.tipo,
            material_id: req.query.material_id,
            obra_id: req.query.obra_id,
            data_inicio: req.query.data_inicio,
            data_fim: req.query.data_fim,
            limit: req.query.limit || 100
        };

        const movimentacoes = await EstoqueMovimentacao.findAll(filtros);
        const materiais = await Material.findAll({ limit: 100 });
        const obras = await Obra.findAllRecent(100);

        res.render('modules/estoque/movimentacoes', {
            movimentacoes,
            materiais,
            obras,
            filtros
        });
    } catch (err) {
        console.error('❌ Erro ao listar movimentações:', err);
        res.status(500).send('Erro ao carregar movimentações');
    }
};

// Página de entrada
exports.entradaPage = async (req, res) => {
    try {
        const materiais = await Material.findAll({ limit: 100 });
        const obras = await Obra.findAllRecent(50);

        res.render('modules/estoque/movimentacaoForm', {
            materiais,
            obras,
            tipo: 'entrada',
            movimentacao: null
        });
    } catch (err) {
        console.error('❌ Erro ao carregar página de entrada:', err);
        res.status(500).send('Erro ao carregar página');
    }
};

// Registrar entrada
exports.registrarEntrada = async (req, res) => {
    try {
        const dados = {
            material_id: parseInt(req.body.material_id),
            quantidade: parseInt(req.body.quantidade),
            obra_id: req.body.obra_id ? parseInt(req.body.obra_id) : null,
            motivo: req.body.motivo?.trim(),
            documento: req.body.documento?.trim(),
            valor_unitario: req.body.valor_unitario ? parseFloat(req.body.valor_unitario) : null,
            admin_id: req.session.adminId
        };

        // Validações
        if (!dados.material_id || !dados.quantidade || dados.quantidade <= 0) {
            return res.status(400).send('Material e quantidade válida são obrigatórios');
        }

        const movimentacaoId = await EstoqueMovimentacao.registrarEntrada(dados);
        console.log(`✅ Entrada registrada: Material ${dados.material_id}, Quantidade ${dados.quantidade} (ID: ${movimentacaoId})`);

        res.redirect('/estoque/movimentacoes');
    } catch (err) {
        console.error('❌ Erro ao registrar entrada:', err);
        res.status(500).send('Erro ao registrar entrada');
    }
};

// Página de saída
exports.saidaPage = async (req, res) => {
    try {
        const materiais = await Material.findAll({ limit: 100 });
        const obras = await Obra.findAllRecent(50);

        res.render('modules/estoque/movimentacaoForm', {
            materiais,
            obras,
            tipo: 'saida',
            movimentacao: null
        });
    } catch (err) {
        console.error('❌ Erro ao carregar página de saída:', err);
        res.status(500).send('Erro ao carregar página');
    }
};

// Registrar saída
exports.registrarSaida = async (req, res) => {
    try {
        const dados = {
            material_id: parseInt(req.body.material_id),
            quantidade: parseInt(req.body.quantidade),
            obra_id: req.body.obra_id ? parseInt(req.body.obra_id) : null,
            motivo: req.body.motivo?.trim(),
            documento: req.body.documento?.trim(),
            valor_unitario: req.body.valor_unitario ? parseFloat(req.body.valor_unitario) : null,
            admin_id: req.session.adminId
        };

        // Validações
        if (!dados.material_id || !dados.quantidade || dados.quantidade <= 0) {
            return res.status(400).send('Material e quantidade válida são obrigatórios');
        }

        if (!dados.obra_id) {
            return res.status(400).send('Obra é obrigatória para saídas');
        }

        const movimentacaoId = await EstoqueMovimentacao.registrarSaida(dados);
        console.log(`✅ Saída registrada: Material ${dados.material_id}, Quantidade ${dados.quantidade}, Obra ${dados.obra_id} (ID: ${movimentacaoId})`);

        res.redirect('/estoque/movimentacoes');
    } catch (err) {
        console.error('❌ Erro ao registrar saída:', err);
        if (err.message.includes('Estoque insuficiente')) {
            return res.status(400).send(err.message);
        }
        res.status(500).send('Erro ao registrar saída');
    }
};

// Ver movimentação
exports.view = async (req, res) => {
    try {
        const id = req.params.id;
        const movimentacao = await EstoqueMovimentacao.findById(id);

        if (!movimentacao) {
            return res.status(404).send('Movimentação não encontrada');
        }

        res.render('modules/estoque/movimentacaoView', {
            movimentacao
        });
    } catch (err) {
        console.error('❌ Erro ao carregar movimentação:', err);
        res.status(500).send('Erro ao carregar movimentação');
    }
};

// Relatório de consumo por obra
exports.relatorioConsumo = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const obra = await Obra.findById(obraId);

        if (!obra) {
            return res.status(404).send('Obra não encontrada');
        }

        const consumo = await EstoqueMovimentacao.relatorioConsumoPorObra(obraId);

        res.render('modules/estoque/relatorioConsumo', {
            obra,
            consumo
        });
    } catch (err) {
        console.error('❌ Erro ao gerar relatório de consumo:', err);
        res.status(500).send('Erro ao gerar relatório');
    }
};

// API: Buscar movimentações por material
exports.apiByMaterial = async (req, res) => {
    try {
        const materialId = req.params.material_id;
        const movimentacoes = await EstoqueMovimentacao.findByMaterial(materialId, 50);

        res.json({
            success: true,
            movimentacoes
        });
    } catch (err) {
        console.error('❌ Erro ao buscar movimentações por material:', err);
        res.status(500).json({ success: false, error: 'Erro na busca' });
    }
};

// API: Buscar movimentações por obra
exports.apiByObra = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const movimentacoes = await EstoqueMovimentacao.findByObra(obraId, 100);

        res.json({
            success: true,
            movimentacoes
        });
    } catch (err) {
        console.error('❌ Erro ao buscar movimentações por obra:', err);
        res.status(500).json({ success: false, error: 'Erro na busca' });
    }
};

// Dashboard de estoque
exports.dashboard = async (req, res) => {
    try {
        const materiais = await Material.findAll({ limit: 100 });
        const estoqueBaixo = await Material.findEstoqueBaixo();
        const movimentacoesRecentes = await EstoqueMovimentacao.findAll({ limit: 20 });

        // Estatísticas
        const totalMateriais = materiais.length;
        const materiaisBaixo = estoqueBaixo.length;
        const entradasHoje = movimentacoesRecentes.filter(m => m.tipo === 'entrada' && new Date(m.created_at).toDateString() === new Date().toDateString()).length;
        const saidasHoje = movimentacoesRecentes.filter(m => m.tipo === 'saida' && new Date(m.created_at).toDateString() === new Date().toDateString()).length;

        res.render('modules/estoque/dashboard', {
            materiais,
            estoqueBaixo,
            movimentacoesRecentes,
            stats: {
                totalMateriais,
                materiaisBaixo,
                entradasHoje,
                saidasHoje
            }
        });
    } catch (err) {
        console.error('❌ Erro ao carregar dashboard de estoque:', err);
        res.status(500).send('Erro ao carregar dashboard');
    }
};