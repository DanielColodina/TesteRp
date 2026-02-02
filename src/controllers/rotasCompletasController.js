const db = require('../database/connection');

// Página de rotas completas - otimizada com queries agrupadas
exports.index = async (req, res) => {
  const adminId = req.session.adminId;
  
  try {
    if (!adminId) {
      return res.redirect('/login');
    }

    console.log('🚀 [rotasCompletas] Carregando...');

    // 1. Buscar todas as obras de uma vez
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

    if (obras.length === 0) {
      return res.render('rotascompletas', { obras: [] });
    }

    const obraIds = obras.map(o => o.id);
    const clienteIds = obras.filter(o => o.cliente_id).map(o => o.cliente_id);

    // 2. Buscar todos os checklists de uma vez
    let checklistMap = new Map();
    if (clienteIds.length > 0) {
      const placeholders = clienteIds.map(() => '?').join(',');
      const [checklists] = await db.execute(
        `SELECT * FROM checklist_usuarios WHERE usuario_id IN (${placeholders})`,
        clienteIds
      );
      checklists.forEach(c => checklistMap.set(c.usuario_id, c));
    }

    // 3. Buscar todos os materiais de uma vez
    let materiaisMap = new Map();
    if (obraIds.length > 0) {
      const placeholders = obraIds.map(() => '?').join(',');
      const [materiais] = await db.execute(
        `SELECT mo.*, m.nome as material_nome, m.unidade 
         FROM materiais_obra mo
         LEFT JOIN materiais m ON mo.material_id = m.id
         WHERE mo.obra_id IN (${placeholders}) AND mo.ativo = TRUE`,
        obraIds
      );
      
      materiais.forEach(m => {
        if (!materiaisMap.has(m.obra_id)) {
          materiaisMap.set(m.obra_id, []);
        }
        materiaisMap.get(m.obra_id).push(m);
      });
    }

    // 4. Buscar funcionários de uma vez
    let funcionariosMap = new Map();
    if (obraIds.length > 0) {
      const placeholders = obraIds.map(() => '?').join(',');
      const [funcionarios] = await db.execute(
        `SELECT id, nome, funcao, obra_id FROM funcionarios WHERE obra_id IN (${placeholders})`,
        obraIds
      );

      funcionarios.forEach(f => {
        if (!funcionariosMap.has(f.obra_id)) {
          funcionariosMap.set(f.obra_id, []);
        }
        funcionariosMap.get(f.obra_id).push(f);
      });
    }

    // 5. Buscar financeiro de uma vez
    let financeiroMap = new Map();
    let ganhoMap = new Map();
    let despesaMap = new Map();

    if (obraIds.length > 0) {
      const placeholders = obraIds.map(() => '?').join(',');
      
      // Buscar custos
      const [custos] = await db.execute(
        `SELECT lc.*, cc.obra_id 
         FROM lancamento_custo lc 
         LEFT JOIN centro_custo cc ON lc.centro_custo_id = cc.id
         WHERE cc.obra_id IN (${placeholders})
         ORDER BY lc.data DESC LIMIT 100`,
        obraIds
      );

      // Buscar financeiros
      const [financeiros] = await db.execute(
        `SELECT f.*, f.obra_id 
         FROM financeiro f
         WHERE f.obra_id IN (${placeholders})
         ORDER BY f.data DESC LIMIT 100`,
        obraIds
      );

      // Processar custos
      custos.forEach(c => {
        if (!financeiroMap.has(c.obra_id)) {
          financeiroMap.set(c.obra_id, []);
          ganhoMap.set(c.obra_id, 0);
          despesaMap.set(c.obra_id, 0);
        }
        financeiroMap.get(c.obra_id).push(c);
        if (['entrada', 'receita', 'ganho'].includes(c.tipo)) {
          ganhoMap.set(c.obra_id, ganhoMap.get(c.obra_id) + (parseFloat(c.valor) || 0));
        } else {
          despesaMap.set(c.obra_id, despesaMap.get(c.obra_id) + (parseFloat(c.valor) || 0));
        }
      });

      // Processar financeiros
      financeiros.forEach(f => {
        if (!financeiroMap.has(f.obra_id)) {
          financeiroMap.set(f.obra_id, []);
          ganhoMap.set(f.obra_id, 0);
          despesaMap.set(f.obra_id, 0);
        }
        financeiroMap.get(f.obra_id).push(f);
        if (f.tipo === 'receita') {
          ganhoMap.set(f.obra_id, ganhoMap.get(f.obra_id) + (parseFloat(f.valor) || 0));
        } else {
          despesaMap.set(f.obra_id, despesaMap.get(f.obra_id) + (parseFloat(f.valor) || 0));
        }
      });

      // Ordenar
      obraIds.forEach(obraId => {
        if (financeiroMap.has(obraId)) {
          financeiroMap.get(obraId).sort((a, b) => 
            new Date(b.data || b.created_at) - new Date(a.data || a.created_at)
          );
        }
      });
    }

    // 6. Buscar histórico de uma vez
    let historicoMap = new Map();
    if (clienteIds.length > 0) {
      const placeholders = clienteIds.map(() => '?').join(',');
      const [historicos] = await db.execute(
        `SELECT h.*, a.nome as admin_nome
         FROM historico h
         LEFT JOIN admins a ON h.admin_id = a.id
         WHERE h.usuario_id IN (${placeholders})
         ORDER BY h.created_at DESC LIMIT 100`,
        clienteIds
      );

      historicos.forEach(h => {
        if (!historicoMap.has(h.usuario_id)) {
          historicoMap.set(h.usuario_id, []);
        }
        historicoMap.get(h.usuario_id).push(h);
      });
    }

    // Montar resultado final
    const obrasCompletas = obras.map(obra => {
      const checklist = checklistMap.get(obra.cliente_id);
      
      // Calcular progresso
      let progresso = 0;
      if (checklist) {
        const campos = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
        const completos = campos.filter(c => checklist[c] === 'Feito').length;
        progresso = Math.round((completos / campos.length) * 100);
      }

      return {
        ...obra,
        progresso,
        status_uso_solo: checklist?.uso_solo || 'Nao Tem',
        status_licenca: checklist?.licenca || 'Nao Tem',
        status_condominio: checklist?.condominio || 'Nao Tem',
        status_habite_se: checklist?.habite_se || 'Nao Tem',
        status_averbacao: checklist?.averbacao || 'Nao Tem',
        status_vistoria: checklist?.vistoria || 'Nao Tem',
        materiais: materiaisMap.get(obra.id) || [],
        funcionarios: funcionariosMap.get(obra.id) || [],
        lancamentosFinanceiro: financeiroMap.get(obra.id) || [],
        totalGanhos: ganhoMap.get(obra.id) || 0,
        totalDespesas: despesaMap.get(obra.id) || 0,
        historico: historicoMap.get(obra.cliente_id) || []
      };
    });

    console.log(`✅ [rotasCompletas] ${obrasCompletas.length} obras carregadas`);
    res.render('rotascompletas', { obras: obrasCompletas });
    
  } catch (err) {
    console.error('❌ [rotasCompletas] Erro:', err.message);
    res.status(500).send('Erro ao carregar página: ' + err.message);
  }
};
