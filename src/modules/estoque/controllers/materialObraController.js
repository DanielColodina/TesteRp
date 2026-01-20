const MaterialObra = require('../models/MaterialObra');
const Material = require('../models/Material');
const Obra = require('../../../models/Obra');

// Listar materiais de uma obra
exports.list = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const obra = await Obra.findById(obraId);

        if (!obra) {
            return res.status(404).send('Obra não encontrada');
        }

        const filtros = {
            fase_obra: req.query.fase_obra,
            categoria: req.query.categoria,
            busca: req.query.busca,
            limit: req.query.limit || 100
        };

        const materiais = await MaterialObra.findByObra(obraId, filtros);
        const fases = await MaterialObra.findFases();

        // Estatísticas
        const totalMateriais = materiais.length;
        const materiaisComSaldo = materiais.filter(m => m.saldo_atual > 0).length;
        const materiaisBaixo = materiais.filter(m => m.saldo_atual <= (m.quantidade_estimada * 0.2)).length;

        res.render('modules/estoque/materiaisObra', {
            obra,
            materiais,
            fases,
            filtros,
            stats: {
                totalMateriais,
                materiaisComSaldo,
                materiaisBaixo
            }
        });
    } catch (err) {
        console.error('❌ Erro ao listar materiais da obra:', err);
        res.status(500).send('Erro ao carregar materiais da obra');
    }
};

// Página para adicionar material à obra
exports.addPage = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const obra = await Obra.findById(obraId);

        if (!obra) {
            return res.status(404).send('Obra não encontrada');
        }

        const materiais = await Material.findAll({ limit: 200 });
        const fases = [
            'Terraplenagem e Fundações',
            'Alvenaria Estrutural',
            'Estrutura (Pilares, Vigas e Lajes)',
            'Alvenaria de Vedação',
            'Cobertura',
            'Instalações Elétricas',
            'Instalações Hidráulicas',
            'Revestimentos e Acabamentos',
            'Esquadrias e Serralheria'
        ];

        res.render('modules/estoque/materialObraForm', {
            obra,
            materiais,
            fases,
            materialObra: null,
            action: 'add'
        });
    } catch (err) {
        console.error('❌ Erro ao carregar página de adição:', err);
        res.status(500).send('Erro ao carregar página');
    }
};

// Adicionar material à obra
exports.add = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const dados = {
            obra_id: obraId,
            material_id: parseInt(req.body.material_id),
            quantidade_estimada: parseFloat(req.body.quantidade_estimada) || 0,
            quantidade_inicial: parseFloat(req.body.quantidade_inicial) || 0,
            fase_obra: req.body.fase_obra?.trim(),
            categoria: req.body.categoria?.trim(),
            subcategoria: req.body.subcategoria?.trim()
        };

        // Validações
        if (!dados.material_id) {
            return res.status(400).send('Material é obrigatório');
        }

        if (!dados.fase_obra) {
            return res.status(400).send('Fase da obra é obrigatória');
        }

        dados.saldo_atual = dados.quantidade_inicial;

        const materialObraId = await MaterialObra.create(dados);
        console.log(`✅ Material adicionado à obra: ${dados.material_id} (ID: ${materialObraId})`);

        res.redirect(`/estoque/obras/${obraId}/materiais`);
    } catch (err) {
        console.error('❌ Erro ao adicionar material à obra:', err);
        res.status(500).send('Erro ao adicionar material');
    }
};

// Página de edição
exports.editPage = async (req, res) => {
    try {
        const id = req.params.id;
        const materialObra = await MaterialObra.findById(id);

        if (!materialObra) {
            return res.status(404).send('Material da obra não encontrado');
        }

        const obra = await Obra.findById(materialObra.obra_id);
        const materiais = await Material.findAll({ limit: 200 });
        const fases = [
            'Terraplenagem e Fundações',
            'Alvenaria Estrutural',
            'Estrutura (Pilares, Vigas e Lajes)',
            'Alvenaria de Vedação',
            'Cobertura',
            'Instalações Elétricas',
            'Instalações Hidráulicas',
            'Revestimentos e Acabamentos',
            'Esquadrias e Serralheria'
        ];

        res.render('modules/estoque/materialObraForm', {
            obra,
            materiais,
            fases,
            materialObra,
            action: 'edit'
        });
    } catch (err) {
        console.error('❌ Erro ao carregar página de edição:', err);
        res.status(500).send('Erro ao carregar página');
    }
};

// Atualizar material da obra
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const dados = {
            quantidade_estimada: parseFloat(req.body.quantidade_estimada) || 0,
            quantidade_inicial: parseFloat(req.body.quantidade_inicial) || 0,
            fase_obra: req.body.fase_obra?.trim(),
            categoria: req.body.categoria?.trim(),
            subcategoria: req.body.subcategoria?.trim()
        };

        // Recalcular saldo atual baseado nas movimentações
        const materialObra = await MaterialObra.findById(id);
        if (materialObra) {
            // Aqui seria necessário calcular o saldo real baseado nas movimentações
            // Por simplicidade, mantemos o saldo atual
            dados.saldo_atual = materialObra.saldo_atual;
        }

        const sucesso = await MaterialObra.update(id, dados);
        if (!sucesso) {
            return res.status(404).send('Material da obra não encontrado');
        }

        console.log(`✅ Material da obra atualizado: ${id}`);
        res.redirect(`/estoque/obras/${materialObra.obra_id}/materiais`);
    } catch (err) {
        console.error('❌ Erro ao atualizar material da obra:', err);
        res.status(500).send('Erro ao atualizar material');
    }
};

// Remover material da obra
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const materialObra = await MaterialObra.findById(id);

        if (!materialObra) {
            return res.status(404).send('Material da obra não encontrado');
        }

        const sucesso = await MaterialObra.delete(id);
        if (!sucesso) {
            return res.status(404).send('Material da obra não encontrado');
        }

        console.log(`✅ Material removido da obra: ${id}`);
        res.redirect(`/estoque/obras/${materialObra.obra_id}/materiais`);
    } catch (err) {
        console.error('❌ Erro ao remover material da obra:', err);
        res.status(500).send('Erro ao remover material');
    }
};

// Importar catálogo completo para obra
exports.importarCatalogo = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const obra = await Obra.findById(obraId);

        if (!obra) {
            return res.status(404).send('Obra não encontrada');
        }

        // Catálogo completo de materiais baseado no documento técnico
        const catalogoMateriais = [
            // Terraplenagem e Fundações
            { nome: 'Terra de Escavação', unidade: 'm³', quantidade_estimada: 25.0, fase_obra: 'Terraplenagem e Fundações', categoria: 'Materiais Básicos', subcategoria: 'Escavação' },
            { nome: 'Pedra de Mão', unidade: 'm³', quantidade_estimada: 8.0, fase_obra: 'Terraplenagem e Fundações', categoria: 'Materiais Básicos', subcategoria: 'Escavação' },
            { nome: 'Cimento Portland CP-II', unidade: 'kg', quantidade_estimada: 2500, fase_obra: 'Terraplenagem e Fundações', categoria: 'Materiais Básicos', subcategoria: 'Ligantes' },
            { nome: 'Areia Média', unidade: 'm³', quantidade_estimada: 12.0, fase_obra: 'Terraplenagem e Fundações', categoria: 'Materiais Básicos', subcategoria: 'Agregados' },
            { nome: 'Pedra Britada 0-19mm', unidade: 'm³', quantidade_estimada: 15.0, fase_obra: 'Terraplenagem e Fundações', categoria: 'Materiais Básicos', subcategoria: 'Agregados' },
            { nome: 'Ferro CA-50 Ø8mm', unidade: 'kg', quantidade_estimada: 180, fase_obra: 'Terraplenagem e Fundações', categoria: 'Estrutura', subcategoria: 'Armadura' },
            { nome: 'Ferro CA-50 Ø10mm', unidade: 'kg', quantidade_estimada: 120, fase_obra: 'Terraplenagem e Fundações', categoria: 'Estrutura', subcategoria: 'Armadura' },
            { nome: 'Arame Recozido', unidade: 'kg', quantidade_estimada: 15, fase_obra: 'Terraplenagem e Fundações', categoria: 'Estrutura', subcategoria: 'Armadura' },
            { nome: 'Tábua Pinus 1" x 6"', unidade: 'm', quantidade_estimada: 45, fase_obra: 'Terraplenagem e Fundações', categoria: 'Estrutura', subcategoria: 'Formas' },
            { nome: 'Prego 18x30', unidade: 'kg', quantidade_estimada: 5, fase_obra: 'Terraplenagem e Fundações', categoria: 'Acessórios', subcategoria: 'Fixação' },

            // Alvenaria Estrutural
            { nome: 'Bloco Cerâmico 9x19x39cm', unidade: 'un', quantidade_estimada: 3200, fase_obra: 'Alvenaria Estrutural', categoria: 'Alvenaria', subcategoria: 'Cerâmicos' },
            { nome: 'Bloco Cerâmico 14x19x39cm', unidade: 'un', quantidade_estimada: 450, fase_obra: 'Alvenaria Estrutural', categoria: 'Alvenaria', subcategoria: 'Cerâmicos' },
            { nome: 'Cimento Portland', unidade: 'kg', quantidade_estimada: 1200, fase_obra: 'Alvenaria Estrutural', categoria: 'Materiais Básicos', subcategoria: 'Ligantes' },
            { nome: 'Areia Fina', unidade: 'm³', quantidade_estimada: 8.0, fase_obra: 'Alvenaria Estrutural', categoria: 'Materiais Básicos', subcategoria: 'Agregados' },
            { nome: 'Ferro CA-50 Ø6.3mm', unidade: 'kg', quantidade_estimada: 80, fase_obra: 'Alvenaria Estrutural', categoria: 'Estrutura', subcategoria: 'Armadura' },
            { nome: 'Ferro CA-50 Ø8mm', unidade: 'kg', quantidade_estimada: 250, fase_obra: 'Alvenaria Estrutural', categoria: 'Estrutura', subcategoria: 'Armadura' },
            { nome: 'Cimento Portland', unidade: 'kg', quantidade_estimada: 800, fase_obra: 'Alvenaria Estrutural', categoria: 'Materiais Básicos', subcategoria: 'Ligantes' },
            { nome: 'Areia', unidade: 'm³', quantidade_estimada: 4.0, fase_obra: 'Alvenaria Estrutural', categoria: 'Materiais Básicos', subcategoria: 'Agregados' },
            { nome: 'Pedra Britada', unidade: 'm³', quantidade_estimada: 5.0, fase_obra: 'Alvenaria Estrutural', categoria: 'Materiais Básicos', subcategoria: 'Agregados' },
            { nome: 'Forma Circular Ø15cm', unidade: 'un', quantidade_estimada: 25, fase_obra: 'Alvenaria Estrutural', categoria: 'Estrutura', subcategoria: 'Formas' },

            // Estrutura (Pilares, Vigas e Lajes)
            { nome: 'Ferro CA-50 Ø12.5mm', unidade: 'kg', quantidade_estimada: 450, fase_obra: 'Estrutura (Pilares, Vigas e Lajes)', categoria: 'Estrutura', subcategoria: 'Armadura' },
            { nome: 'Ferro CA-50 Ø10mm', unidade: 'kg', quantidade_estimada: 380, fase_obra: 'Estrutura (Pilares, Vigas e Lajes)', categoria: 'Estrutura', subcategoria: 'Armadura' },
            { nome: 'Ferro CA-50 Ø6.3mm', unidade: 'kg', quantidade_estimada: 120, fase_obra: 'Estrutura (Pilares, Vigas e Lajes)', categoria: 'Estrutura', subcategoria: 'Armadura' },
            { nome: 'Cimento Portland', unidade: 'kg', quantidade_estimada: 1800, fase_obra: 'Estrutura (Pilares, Vigas e Lajes)', categoria: 'Materiais Básicos', subcategoria: 'Ligantes' },
            { nome: 'Areia', unidade: 'm³', quantidade_estimada: 9.0, fase_obra: 'Estrutura (Pilares, Vigas e Lajes)', categoria: 'Materiais Básicos', subcategoria: 'Agregados' },
            { nome: 'Pedra Britada 0-19mm', unidade: 'm³', quantidade_estimada: 11.0, fase_obra: 'Estrutura (Pilares, Vigas e Lajes)', categoria: 'Materiais Básicos', subcategoria: 'Agregados' },
            { nome: 'Tábua Pinus 1" x 12"', unidade: 'm', quantidade_estimada: 120, fase_obra: 'Estrutura (Pilares, Vigas e Lajes)', categoria: 'Estrutura', subcategoria: 'Formas' },
            { nome: 'Sarrafo 1" x 3"', unidade: 'm', quantidade_estimada: 200, fase_obra: 'Estrutura (Pilares, Vigas e Lajes)', categoria: 'Estrutura', subcategoria: 'Escoramento' },
            { nome: 'Prego 25x35', unidade: 'kg', quantidade_estimada: 8, fase_obra: 'Estrutura (Pilares, Vigas e Lajes)', categoria: 'Acessórios', subcategoria: 'Fixação' },
            { nome: 'Arame 2mm', unidade: 'kg', quantidade_estimada: 25, fase_obra: 'Estrutura (Pilares, Vigas e Lajes)', categoria: 'Estrutura', subcategoria: 'Armadura' },

            // Alvenaria de Vedação
            { nome: 'Bloco Cerâmico 9x19x19cm', unidade: 'un', quantidade_estimada: 2800, fase_obra: 'Alvenaria de Vedação', categoria: 'Alvenaria', subcategoria: 'Cerâmicos' },
            { nome: 'Bloco de Concreto 9x19x39cm', unidade: 'un', quantidade_estimada: 600, fase_obra: 'Alvenaria de Vedação', categoria: 'Alvenaria', subcategoria: 'Concreto' },
            { nome: 'Cimento Portland', unidade: 'kg', quantidade_estimada: 600, fase_obra: 'Alvenaria de Vedação', categoria: 'Materiais Básicos', subcategoria: 'Ligantes' },
            { nome: 'Cal Hidratada', unidade: 'kg', quantidade_estimada: 150, fase_obra: 'Alvenaria de Vedação', categoria: 'Materiais Básicos', subcategoria: 'Ligantes' },
            { nome: 'Areia Fina', unidade: 'm³', quantidade_estimada: 6.0, fase_obra: 'Alvenaria de Vedação', categoria: 'Materiais Básicos', subcategoria: 'Agregados' },
            { nome: 'Canto de PVC', unidade: 'm', quantidade_estimada: 50, fase_obra: 'Alvenaria de Vedação', categoria: 'Acessórios', subcategoria: 'Alvenaria' },
            { nome: 'Emenda de PVC', unidade: 'm', quantidade_estimada: 30, fase_obra: 'Alvenaria de Vedação', categoria: 'Acessórios', subcategoria: 'Alvenaria' },

            // Cobertura
            { nome: 'Caibro 5x10cm', unidade: 'm', quantidade_estimada: 180, fase_obra: 'Cobertura', categoria: 'Estrutura', subcategoria: 'Madeira' },
            { nome: 'Terça 5x15cm', unidade: 'm', quantidade_estimada: 120, fase_obra: 'Cobertura', categoria: 'Estrutura', subcategoria: 'Madeira' },
            { nome: 'Ripas 2.5x5cm', unidade: 'm', quantidade_estimada: 300, fase_obra: 'Cobertura', categoria: 'Estrutura', subcategoria: 'Madeira' },
            { nome: 'Telha Cerâmica Portuguesa', unidade: 'un', quantidade_estimada: 850, fase_obra: 'Cobertura', categoria: 'Cobertura', subcategoria: 'Telhas' },
            { nome: 'Cumeeira Cerâmica', unidade: 'un', quantidade_estimada: 25, fase_obra: 'Cobertura', categoria: 'Cobertura', subcategoria: 'Telhas' },
            { nome: 'Rincão Cerâmico', unidade: 'un', quantidade_estimada: 50, fase_obra: 'Cobertura', categoria: 'Cobertura', subcategoria: 'Telhas' },
            { nome: 'Manta Asfáltica', unidade: 'm²', quantidade_estimada: 120, fase_obra: 'Cobertura', categoria: 'Cobertura', subcategoria: 'Impermeabilizante' },
            { nome: 'Prego Galvanizado 25mm', unidade: 'kg', quantidade_estimada: 12, fase_obra: 'Cobertura', categoria: 'Acessórios', subcategoria: 'Fixação' },
            { nome: 'Arame Galvanizado', unidade: 'kg', quantidade_estimada: 8, fase_obra: 'Cobertura', categoria: 'Acessórios', subcategoria: 'Fixação' },

            // Instalações Elétricas
            { nome: 'Fio 2.5mm²', unidade: 'm', quantidade_estimada: 250, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Fios' },
            { nome: 'Fio 1.5mm²', unidade: 'm', quantidade_estimada: 180, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Fios' },
            { nome: 'Fio 6mm²', unidade: 'm', quantidade_estimada: 50, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Fios' },
            { nome: 'Tomada 2P+T 20A', unidade: 'un', quantidade_estimada: 15, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Dispositivos' },
            { nome: 'Tomada 2P+T 10A', unidade: 'un', quantidade_estimada: 8, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Dispositivos' },
            { nome: 'Interruptor Simples', unidade: 'un', quantidade_estimada: 12, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Dispositivos' },
            { nome: 'Interruptor Paralelo', unidade: 'un', quantidade_estimada: 6, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Dispositivos' },
            { nome: 'Luminária LED 18W', unidade: 'un', quantidade_estimada: 10, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Dispositivos' },
            { nome: 'Quadro de Distribuição', unidade: 'un', quantidade_estimada: 1, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Quadros' },
            { nome: 'Disjuntor 40A', unidade: 'un', quantidade_estimada: 1, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Quadros' },
            { nome: 'Disjuntor 20A', unidade: 'un', quantidade_estimada: 6, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Quadros' },
            { nome: 'Disjuntor 10A', unidade: 'un', quantidade_estimada: 4, fase_obra: 'Instalações Elétricas', categoria: 'Instalações', subcategoria: 'Quadros' },

            // Instalações Hidráulicas
            { nome: 'Tubo PVC 100mm', unidade: 'm', quantidade_estimada: 25, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Tubos' },
            { nome: 'Tubo PVC 75mm', unidade: 'm', quantidade_estimada: 35, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Tubos' },
            { nome: 'Tubo PVC 40mm', unidade: 'm', quantidade_estimada: 45, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Tubos' },
            { nome: 'Tubo PVC 25mm', unidade: 'm', quantidade_estimada: 60, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Tubos' },
            { nome: 'Joelho 90° 100mm', unidade: 'un', quantidade_estimada: 8, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Conexões' },
            { nome: 'Joelho 90° 75mm', unidade: 'un', quantidade_estimada: 12, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Conexões' },
            { nome: 'Joelho 90° 40mm', unidade: 'un', quantidade_estimada: 15, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Conexões' },
            { nome: 'Tee 100mm', unidade: 'un', quantidade_estimada: 6, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Conexões' },
            { nome: 'Tee 75mm', unidade: 'un', quantidade_estimada: 10, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Conexões' },
            { nome: 'Adaptador PVC/metal', unidade: 'un', quantidade_estimada: 8, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Conexões' },
            { nome: 'Vaso Sanitário', unidade: 'un', quantidade_estimada: 1, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Louças' },
            { nome: 'Lavatório', unidade: 'un', quantidade_estimada: 1, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Louças' },
            { nome: 'Chuveiro', unidade: 'un', quantidade_estimada: 1, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Louças' },
            { nome: 'Tanque', unidade: 'un', quantidade_estimada: 1, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Louças' },
            { nome: 'Sifão de Piso', unidade: 'un', quantidade_estimada: 1, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Metais' },
            { nome: 'Sifão de Lavatório', unidade: 'un', quantidade_estimada: 1, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Metais' },
            { nome: 'Registro de Gaveta', unidade: 'un', quantidade_estimada: 4, fase_obra: 'Instalações Hidráulicas', categoria: 'Instalações', subcategoria: 'Metais' },

            // Revestimentos e Acabamentos
            { nome: 'Piso Cerâmico 60x60cm', unidade: 'm²', quantidade_estimada: 85, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acabamentos', subcategoria: 'Pisos' },
            { nome: 'Porcelanato 80x80cm', unidade: 'm²', quantidade_estimada: 25, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acabamentos', subcategoria: 'Pisos' },
            { nome: 'Azulejo 20x30cm', unidade: 'm²', quantidade_estimada: 18, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acabamentos', subcategoria: 'Revestimentos' },
            { nome: 'Azulejo 15x15cm', unidade: 'm²', quantidade_estimada: 12, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acabamentos', subcategoria: 'Revestimentos' },
            { nome: 'Argamassa Colante', unidade: 'kg', quantidade_estimada: 180, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acabamentos', subcategoria: 'Argamassas' },
            { nome: 'Rejunte', unidade: 'kg', quantidade_estimada: 45, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acabamentos', subcategoria: 'Argamassas' },
            { nome: 'Tinta Látex PVA', unidade: 'L', quantidade_estimada: 120, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acabamentos', subcategoria: 'Tintas' },
            { nome: 'Massa Acrílica', unidade: 'kg', quantidade_estimada: 80, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acabamentos', subcategoria: 'Tintas' },
            { nome: 'Tinta Acrílica', unidade: 'L', quantidade_estimada: 45, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acabamentos', subcategoria: 'Tintas' },
            { nome: 'Massa Corrida', unidade: 'kg', quantidade_estimada: 35, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acabamentos', subcategoria: 'Tintas' },
            { nome: 'Rolo de Pintura', unidade: 'un', quantidade_estimada: 3, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acessórios', subcategoria: 'Pintura' },
            { nome: 'Pincel 4"', unidade: 'un', quantidade_estimada: 2, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acessórios', subcategoria: 'Pintura' },
            { nome: 'Bandeja de Pintura', unidade: 'un', quantidade_estimada: 2, fase_obra: 'Revestimentos e Acabamentos', categoria: 'Acessórios', subcategoria: 'Pintura' },

            // Esquadrias e Serralheria
            { nome: 'Porta MDP 70cm', unidade: 'un', quantidade_estimada: 3, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Portas' },
            { nome: 'Porta MDP 80cm', unidade: 'un', quantidade_estimada: 2, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Portas' },
            { nome: 'Porta de Entrada', unidade: 'un', quantidade_estimada: 1, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Portas' },
            { nome: 'Janela Alumínio 1.20m', unidade: 'un', quantidade_estimada: 4, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Janelas' },
            { nome: 'Janela Alumínio 1.50m', unidade: 'un', quantidade_estimada: 3, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Janelas' },
            { nome: 'Janela Alumínio 2.00m', unidade: 'un', quantidade_estimada: 2, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Janelas' },
            { nome: 'Vidro Temperado 4mm', unidade: 'm²', quantidade_estimada: 15, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Vidros' },
            { nome: 'Dobradiça 4"', unidade: 'un', quantidade_estimada: 20, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Ferragens' },
            { nome: 'Fechadura Yale', unidade: 'un', quantidade_estimada: 6, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Ferragens' },
            { nome: 'Trinco de Janela', unidade: 'un', quantidade_estimada: 9, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Ferragens' },
            { nome: 'Grade de Proteção', unidade: 'm', quantidade_estimada: 25, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Serralheria' },
            { nome: 'Barra de Ferro Ø12mm', unidade: 'kg', quantidade_estimada: 45, fase_obra: 'Esquadrias e Serralheria', categoria: 'Esquadrias', subcategoria: 'Serralheria' }
        ];

        let importados = 0;
        let erros = 0;

        for (const item of catalogoMateriais) {
            try {
                // Verificar se o material já existe
                const materialExistente = await Material.findByName(item.nome);

                let materialId;
                if (materialExistente) {
                    materialId = materialExistente.id;
                } else {
                    // Criar o material se não existir
                    const materialDados = {
                        nome: item.nome,
                        unidade: item.unidade,
                        categoria: item.categoria,
                        descricao: `Material para ${item.fase_obra} - ${item.subcategoria}`
                    };
                    materialId = await Material.create(materialDados);
                }

                // Verificar se já está associado à obra
                const jaAssociado = await MaterialObra.findByObra(obraId, { busca: item.nome });
                const materialJaExiste = jaAssociado.some(m => m.material_nome === item.nome);

                if (!materialJaExiste) {
                    // Adicionar à obra
                    await MaterialObra.create({
                        obra_id: obraId,
                        material_id: materialId,
                        quantidade_estimada: item.quantidade_estimada,
                        quantidade_inicial: 0,
                        fase_obra: item.fase_obra,
                        categoria: item.categoria,
                        subcategoria: item.subcategoria
                    });
                    importados++;
                }
            } catch (err) {
                console.error(`❌ Erro ao importar ${item.nome}:`, err);
                erros++;
            }
        }

        console.log(`✅ Catálogo importado: ${importados} materiais adicionados, ${erros} erros`);
        req.session.message = `Catálogo importado com sucesso! ${importados} materiais adicionados.`;

        res.redirect(`/estoque/obras/${obraId}/materiais`);
    } catch (err) {
        console.error('❌ Erro ao importar catálogo:', err);
        res.status(500).send('Erro ao importar catálogo');
    }
};

// API: Buscar materiais da obra
exports.apiSearch = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const materiais = await MaterialObra.findByObra(obraId, {
            busca: req.query.q,
            limit: 10
        });

        res.json({
            success: true,
            materiais: materiais.map(m => ({
                id: m.id,
                material_nome: m.material_nome,
                unidade: m.unidade,
                saldo_atual: m.saldo_atual,
                quantidade_estimada: m.quantidade_estimada
            }))
        });
    } catch (err) {
        console.error('❌ Erro na busca de materiais da obra:', err);
        res.status(500).json({ success: false, error: 'Erro na busca' });
    }
};

// API: Materiais com saldo baixo
exports.apiSaldoBaixo = async (req, res) => {
    try {
        const obraId = req.params.obra_id;
        const materiais = await MaterialObra.findSaldoBaixo(obraId);

        res.json({
            success: true,
            materiais,
            total: materiais.length
        });
    } catch (err) {
        console.error('❌ Erro ao buscar materiais com saldo baixo:', err);
        res.status(500).json({ success: false, error: 'Erro na busca' });
    }
};