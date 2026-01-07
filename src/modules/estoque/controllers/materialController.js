const Material = require('../models/Material');
const EstoqueMovimentacao = require('../models/EstoqueMovimentacao');

// Listar materiais
exports.list = async (req, res) => {
    try {
        const filtros = {
            categoria: req.query.categoria,
            busca: req.query.busca,
            limit: req.query.limit || 100
        };

        const materiais = await Material.findAll(filtros);
        const categorias = await Material.findCategorias();

        res.render('modules/estoque/materiais', {
            materiais,
            categorias,
            filtros
        });
    } catch (err) {
        console.error('❌ Erro ao listar materiais:', err);
        res.status(500).send('Erro ao carregar materiais');
    }
};

// Página de criação
exports.createPage = async (req, res) => {
    try {
        const categorias = await Material.findCategorias();
        res.render('modules/estoque/materialForm', {
            material: null,
            categorias,
            action: 'create'
        });
    } catch (err) {
        console.error('❌ Erro ao carregar página de criação:', err);
        res.status(500).send('Erro ao carregar página');
    }
};

// Criar material
exports.create = async (req, res) => {
    try {
        const dados = {
            nome: req.body.nome?.trim(),
            descricao: req.body.descricao?.trim(),
            unidade: req.body.unidade?.trim(),
            categoria: req.body.categoria?.trim(),
            preco_unitario: parseFloat(req.body.preco_unitario) || 0,
            estoque_minimo: parseInt(req.body.estoque_minimo) || 0,
            fornecedor_padrao: req.body.fornecedor_padrao?.trim()
        };

        // Validações
        if (!dados.nome) {
            return res.status(400).send('Nome do material é obrigatório');
        }

        const materialId = await Material.create(dados);
        console.log(`✅ Material criado: ${dados.nome} (ID: ${materialId})`);

        res.redirect('/estoque/materiais');
    } catch (err) {
        console.error('❌ Erro ao criar material:', err);
        res.status(500).send('Erro ao criar material');
    }
};

// Página de edição
exports.editPage = async (req, res) => {
    try {
        const id = req.params.id;
        const material = await Material.findById(id);
        const categorias = await Material.findCategorias();

        if (!material) {
            return res.status(404).send('Material não encontrado');
        }

        res.render('modules/estoque/materialForm', {
            material,
            categorias,
            action: 'edit'
        });
    } catch (err) {
        console.error('❌ Erro ao carregar página de edição:', err);
        res.status(500).send('Erro ao carregar página');
    }
};

// Atualizar material
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const dados = {
            nome: req.body.nome?.trim(),
            descricao: req.body.descricao?.trim(),
            unidade: req.body.unidade?.trim(),
            categoria: req.body.categoria?.trim(),
            preco_unitario: parseFloat(req.body.preco_unitario) || 0,
            estoque_minimo: parseInt(req.body.estoque_minimo) || 0,
            fornecedor_padrao: req.body.fornecedor_padrao?.trim()
        };

        // Validações
        if (!dados.nome) {
            return res.status(400).send('Nome do material é obrigatório');
        }

        const sucesso = await Material.update(id, dados);
        if (!sucesso) {
            return res.status(404).send('Material não encontrado');
        }

        console.log(`✅ Material atualizado: ${dados.nome} (ID: ${id})`);
        res.redirect('/estoque/materiais');
    } catch (err) {
        console.error('❌ Erro ao atualizar material:', err);
        res.status(500).send('Erro ao atualizar material');
    }
};

// Deletar material
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const sucesso = await Material.delete(id);

        if (!sucesso) {
            return res.status(404).send('Material não encontrado');
        }

        console.log(`✅ Material deletado (ID: ${id})`);
        res.redirect('/estoque/materiais');
    } catch (err) {
        console.error('❌ Erro ao deletar material:', err);
        res.status(500).send('Erro ao deletar material');
    }
};

// Ver detalhes do material
exports.view = async (req, res) => {
    try {
        const id = req.params.id;
        const material = await Material.findById(id);
        const movimentacoes = await EstoqueMovimentacao.findByMaterial(id, 20);

        if (!material) {
            return res.status(404).send('Material não encontrado');
        }

        res.render('modules/estoque/materialView', {
            material,
            movimentacoes
        });
    } catch (err) {
        console.error('❌ Erro ao carregar material:', err);
        res.status(500).send('Erro ao carregar material');
    }
};

// API: Buscar materiais (para autocomplete)
exports.apiSearch = async (req, res) => {
    try {
        const busca = req.query.q || '';
        const materiais = await Material.findAll({
            busca,
            limit: 10
        });

        res.json({
            success: true,
            materiais: materiais.map(m => ({
                id: m.id,
                nome: m.nome,
                unidade: m.unidade,
                estoque_atual: m.estoque_atual,
                preco_unitario: m.preco_unitario
            }))
        });
    } catch (err) {
        console.error('❌ Erro na busca de materiais:', err);
        res.status(500).json({ success: false, error: 'Erro na busca' });
    }
};

// API: Verificar estoque baixo
exports.apiEstoqueBaixo = async (req, res) => {
    try {
        const materiais = await Material.findEstoqueBaixo();
        res.json({
            success: true,
            materiais,
            total: materiais.length
        });
    } catch (err) {
        console.error('❌ Erro ao verificar estoque baixo:', err);
        res.status(500).json({ success: false, error: 'Erro ao verificar estoque' });
    }
};