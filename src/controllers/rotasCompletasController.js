const db = require('../database/connection');

// Página de rotas completas - versão otimizada com lazy loading
exports.index = async (req, res) => {
  const adminId = req.session.adminId;
  
  try {
    if (!adminId) {
      return res.redirect('/login');
    }

    // 1. Buscar apenas as obras (sem todos os detalhes)
    const [obras] = await db.execute(`
      SELECT o.id, o.nome_obra, o.descricao, o.created_at, 
             u.id as cliente_id, u.nome as cliente_nome, u.email as cliente_email,
             u.telefone as cliente_telefone, u.endereco as cliente_endereco, u.obra as endereco_obra
      FROM obras o
      LEFT JOIN usuarios u ON o.usuario_id = u.id
      WHERE u.admin_id = ?
      ORDER BY o.created_at DESC
      LIMIT 50
    `, [adminId]);

    console.log(`🚀 [rotasCompletas] ${obras.length} obras carregadas`);
    res.render('rotascompletas', { obras });

  } catch (err) {
    console.error('❌ [rotasCompletas] Erro:', err.message);
    res.status(500).send('Erro ao carregar página: ' + err.message);
  }
};

// API: Carregar detalhes de uma obra sob demanda
exports.getObraDetails = async (req, res) => {
  const adminId = req.session.adminId;
  const { obraId } = req.params;

  try {
    if (!adminId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    // 1. Buscar informações da obra
    const [obras] = await db.execute(`
      SELECT o.id, o.nome_obra, o.descricao, o.created_at, 
             u.id as cliente_id, u.nome as cliente_nome, u.email as cliente_email,
             u.telefone as cliente_telefone, u.endereco as cliente_endereco, u.obra as endereco_obra
      FROM obras o
      LEFT JOIN usuarios u ON o.usuario_id = u.id
      WHERE o.id = ? AND u.admin_id = ?
    `, [obraId, adminId]);

    if (obras.length === 0) {
      return res.status(404).json({ error: 'Obra não encontrada' });
    }

    const obra = obras[0];

    // 2. Buscar checklist
    let checklist = null;
    if (obra.cliente_id) {
      const [checklists] = await db.execute(
        `SELECT * FROM checklist_usuarios WHERE usuario_id = ?`,
        [obra.cliente_id]
      );
      if (checklists.length > 0) {
        checklist = checklists[0];
      }
    }

    // Calcular progresso
    let progresso = 0;
    if (checklist) {
      const campos = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
      const completos = campos.filter(c => checklist[c] === 'Feito').length;
      progresso = Math.round((completos / campos.length) * 100);
    }

    // 3. Buscar materiais
    const [materiais] = await db.execute(
      `SELECT mo.*, m.nome as material_nome, m.unidade 
       FROM materiais_obra mo
       LEFT JOIN materiais m ON mo.material_id = m.id
       WHERE mo.obra_id = ? AND mo.ativo = TRUE`,
      [obraId]
    );

    // 4. Buscar funcionários
    const [funcionarios] = await db.execute(
      `SELECT id, nome, funcao, obra_id FROM funcionarios WHERE obra_id = ?`,
      [obraId]
    );

    // 5. Buscar financeiro
    const [custos] = await db.execute(
      `SELECT lc.*, cc.obra_id 
       FROM lancamento_custo lc 
       LEFT JOIN centro_custo cc ON lc.centro_custo_id = cc.id
       WHERE cc.obra_id = ?
       ORDER BY lc.data DESC LIMIT 50`,
      [obraId]
    );

    const [financeiros] = await db.execute(
      `SELECT f.*, f.obra_id 
       FROM financeiro f
       WHERE f.obra_id = ?
       ORDER BY f.data DESC LIMIT 50`,
      [obraId]
    );

    // Calcular totais
    let totalGanhos = 0;
    let totalDespesas = 0;
    
    custos.forEach(c => {
      if (['entrada', 'receita', 'ganho'].includes(c.tipo)) {
        totalGanhos += parseFloat(c.valor) || 0;
      } else {
        totalDespesas += parseFloat(c.valor) || 0;
      }
    });

    financeiros.forEach(f => {
      if (f.tipo === 'receita') {
        totalGanhos += parseFloat(f.valor) || 0;
      } else {
        totalDespesas += parseFloat(f.valor) || 0;
      }
    });

    // Combinar financeiros
    const lancamentosFinanceiro = [
      ...custos.map(c => ({ ...c, source: 'custo' })),
      ...financeiros.map(f => ({ ...f, source: 'financeiro' }))
    ].sort((a, b) => new Date(b.data || b.created_at) - new Date(a.data || a.created_at));

    // 6. Buscar histórico
    let historico = [];
    if (obra.cliente_id) {
      const [historicos] = await db.execute(
        `SELECT h.*, a.nome as admin_nome
         FROM historico h
         LEFT JOIN admins a ON h.admin_id = a.id
         WHERE h.usuario_id = ?
         ORDER BY h.created_at DESC LIMIT 50`,
        [obra.cliente_id]
      );
      historico = historicos;
    }

    res.json({
      ...obra,
      progresso,
      status_uso_solo: checklist?.uso_solo || 'Nao Tem',
      status_licenca: checklist?.licenca || 'Nao Tem',
      status_condominio: checklist?.condominio || 'Nao Tem',
      status_habite_se: checklist?.habite_se || 'Nao Tem',
      status_averbacao: checklist?.averbacao || 'Nao Tem',
      status_vistoria: checklist?.vistoria || 'Nao Tem',
      materiais,
      funcionarios,
      lancamentosFinanceiro,
      totalGanhos,
      totalDespesas,
      historico
    });

  } catch (err) {
    console.error('❌ [getObraDetails] Erro:', err.message);
    res.status(500).json({ error: err.message });
  }
};
