const MaterialObra = require('../models/MaterialObra');
const Obra = require('../../../models/Obra');
const Admin = require('../../../models/Admin');

// Página de entrada de material na obra
exports.entradaPage = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const obra = await Obra.findById(obraId);

        if (!obra) {
            return res.status(404).send('Obra não encontrada');
        }

        const materialObraId = req.query.material_obra_id;
        let materialSelecionado = null;

        if (materialObraId) {
            materialSelecionado = await MaterialObra.findById(materialObraId);
        }

        const materiaisObra = await MaterialObra.findByObra(obraId, { limit: 200 });

        res.render('modules/estoque/movimentacaoObraForm', {
            obra,
            materiaisObra,
            materialSelecionado,
            tipo: 'entrada',
            action: 'entrada'
        });
    } catch (err) {
        console.error('❌ Erro ao carregar página de entrada:', err);
        res.status(500).send('Erro ao carregar página');
    }
};

// Registrar entrada de material na obra
exports.registrarEntrada = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const dados = {
            obra_id: obraId,
            material_obra_id: parseInt(req.body.material_obra_id),
            quantidade: parseFloat(req.body.quantidade),
            etapa_obra: req.body.etapa_obra?.trim(),
            motivo: req.body.motivo?.trim(),
            documento: req.body.documento?.trim(),
            responsavel_id: req.session.adminId,
            data_movimentacao: req.body.data_movimentacao || new Date().toISOString().split('T')[0],
            observacoes: req.body.observacoes?.trim(),
            abater_estoque_geral: req.body.abater_estoque_geral === 'on'
        };

        // Validações
        if (!dados.material_obra_id || !dados.quantidade || dados.quantidade <= 0) {
            return res.status(400).send('Material e quantidade válida são obrigatórios');
        }

        const movimentacaoId = await MaterialObra.registrarEntrada(dados);
        console.log(`✅ Entrada na obra registrada: Material ${dados.material_obra_id}, Quantidade ${dados.quantidade} (ID: ${movimentacaoId})`);

        res.redirect(`/estoque/obras/${obraId}/materiais`);
    } catch (err) {
        console.error('❌ Erro ao registrar entrada na obra:', err);
        res.status(500).send('Erro ao registrar entrada');
    }
};

// Página de saída/consumo de material da obra
exports.saidaPage = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const obra = await Obra.findById(obraId);

        if (!obra) {
            return res.status(404).send('Obra não encontrada');
        }

        const materialObraId = req.query.material_obra_id;
        let materialSelecionado = null;

        if (materialObraId) {
            materialSelecionado = await MaterialObra.findById(materialObraId);
        }

        const materiaisObra = await MaterialObra.findByObra(obraId, { limit: 200 });

        res.render('modules/estoque/movimentacaoObraForm', {
            obra,
            materiaisObra,
            materialSelecionado,
            tipo: 'saida',
            action: 'saida'
        });
    } catch (err) {
        console.error('❌ Erro ao carregar página de saída:', err);
        res.status(500).send('Erro ao carregar página');
    }
};

// Registrar saída/consumo de material da obra
exports.registrarSaida = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const dados = {
            obra_id: obraId,
            material_obra_id: parseInt(req.body.material_obra_id),
            quantidade: parseFloat(req.body.quantidade),
            etapa_obra: req.body.etapa_obra?.trim(),
            motivo: req.body.motivo?.trim(),
            documento: req.body.documento?.trim(),
            responsavel_id: req.session.adminId,
            data_movimentacao: req.body.data_movimentacao || new Date().toISOString().split('T')[0],
            observacoes: req.body.observacoes?.trim()
        };

        // Validações
        if (!dados.material_obra_id || !dados.quantidade || dados.quantidade <= 0) {
            return res.status(400).send('Material e quantidade válida são obrigatórios');
        }

        const movimentacaoId = await MaterialObra.registrarSaida(dados);
        console.log(`✅ Saída da obra registrada: Material ${dados.material_obra_id}, Quantidade ${dados.quantidade} (ID: ${movimentacaoId})`);

        res.redirect(`/estoque/obras/${obraId}/materiais`);
    } catch (err) {
        console.error('❌ Erro ao registrar saída da obra:', err);
        if (err.message.includes('Saldo insuficiente')) {
            return res.status(400).send(err.message);
        }
        res.status(500).send('Erro ao registrar saída');
    }
};

// Listar movimentações de uma obra
exports.list = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const obra = await Obra.findById(obraId);

        if (!obra) {
            return res.status(404).send('Obra não encontrada');
        }

        const filtros = {
            tipo: req.query.tipo,
            etapa_obra: req.query.etapa_obra,
            data_inicio: req.query.data_inicio,
            data_fim: req.query.data_fim,
            limit: req.query.limit || 100
        };

        const movimentacoes = await MaterialObra.getMovimentacoes(obraId, filtros);

        res.render('modules/estoque/movimentacoesObra', {
            obra,
            movimentacoes,
            filtros
        });
    } catch (err) {
        console.error('❌ Erro ao listar movimentações da obra:', err);
        res.status(500).send('Erro ao carregar movimentações');
    }
};

// Relatório de consumo por etapa
exports.relatorioConsumo = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const obra = await Obra.findById(obraId);

        if (!obra) {
            return res.status(404).send('Obra não encontrada');
        }

        const consumo = await MaterialObra.relatorioConsumoPorEtapa(obraId);

        res.render('modules/estoque/relatorioConsumoObra', {
            obra,
            consumo
        });
    } catch (err) {
        console.error('❌ Erro ao gerar relatório de consumo:', err);
        res.status(500).send('Erro ao gerar relatório');
    }
};