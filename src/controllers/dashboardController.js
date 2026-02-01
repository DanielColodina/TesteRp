const Checklist = require('../models/Checklist');
const Auditoria = require('../models/Auditoria');
const Historico = require('../models/Historico');
const Obra = require('../models/Obra');
const User = require('../models/User');
const db = require('../database/connection');

// Dashboard com progresso das obras
exports.dashboardProgresso = async (req, res) => {
  try {
    const checklists = await Checklist.findAllWithProgresso();
    const auditoria = await Auditoria.findAll();
    const historicoRecente = await Historico.findRecente();
    const contarAcoes = await Auditoria.contarPorAcao();

    // Calcular percentual médio de progresso
    const progressoMedio = checklists && checklists.length > 0 
      ? (checklists.reduce((sum, item) => sum + (item.progresso || 0), 0) / checklists.length).toFixed(2)
      : 0;

    // Contar obras completas (100%)
    const obrasCompletas = checklists ? checklists.filter(item => item.progresso === 100).length : 0;

    // Contar obras em andamento (1-99%)
    const obrasAndamento = checklists ? checklists.filter(item => item.progresso > 0 && item.progresso < 100).length : 0;

    // Contar obras não iniciadas (0%)
    const obrasNaoIniciadas = checklists ? checklists.filter(item => item.progresso === 0).length : 0;

    res.render('dashboardProgresso', {
      checklists: checklists || [],
      auditoria: (auditoria || []).slice(0, 10),
      historicoRecente: historicoRecente || [],
      progressoMedio,
      obrasCompletas,
      obrasAndamento,
      obrasNaoIniciadas,
      totalObras: checklists ? checklists.length : 0,
      contarAcoes: contarAcoes || []
    });
  } catch (err) {
    console.error('❌ Erro ao carregar dashboard de progresso:', err);
    res.status(500).send('❌ Erro ao carregar dashboard de progresso');
  }
};

// Ver auditoria completa
exports.auditoria = async (req, res) => {
  try {
    const logs = await Auditoria.findAll();
    res.render('auditoria', { logs: logs || [] });
  } catch (err) {
    console.error('❌ Erro ao carregar auditoria:', err);
    res.status(500).send('❌ Erro ao carregar auditoria');
  }
};

// Ver histórico completo
exports.historicoCompleto = async (req, res) => {
  try {
    const historico = await Historico.findRecente();
    res.render('historico', { historico: historico || [] });
  } catch (err) {
    console.error('❌ Erro ao carregar histórico:', err);
    res.status(500).send('❌ Erro ao carregar histórico');
  }
};

// API para histórico
exports.apiHistorico = async (req, res) => {
  try {
    const historico = await Historico.findRecente();
    res.json({ historico: historico || [] });
  } catch (err) {
    console.error('❌ Erro ao carregar API histórico:', err);
    res.status(500).json({ error: 'Erro ao carregar histórico' });
  }
};

// API para estatísticas do dashboard
exports.apiStats = async (req, res) => {
  try {
    const adminId = req.session.adminId;
    if (!adminId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const checklists = await Checklist.findAllWithProgresso();
    const usuarios = await User.findAllByAdmin(adminId);

    const progressoMedio = checklists && checklists.length > 0
      ? (checklists.reduce((sum, item) => sum + (item.progresso || 0), 0) / checklists.length).toFixed(2)
      : 0;

    const totalUsuarios = usuarios ? usuarios.length : 0;
    const totalObras = checklists ? checklists.length : 0;

    res.json({
      totalUsuarios,
      totalObras,
      progressoMedio: parseFloat(progressoMedio)
    });
  } catch (err) {
    console.error('❌ Erro ao carregar estatísticas:', err);
    res.status(500).json({ error: 'Erro ao carregar estatísticas' });
  }
};

// Controle Geral - Renderiza a página de menu dos módulos
exports.controleGeral = async (req, res) => {
  try {
    res.render('controlegeral');
  } catch (err) {
    console.error('❌ Erro ao acessar Controle Geral:', err);
    res.status(500).send('❌ Erro ao acessar Controle Geral');
  }
};

// API para carregar obras recentes do admin
exports.obrasRecentes = async (req, res) => {
  try {
    const adminId = req.session.adminId;
    if (!adminId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    // Buscar obras dos usuários do admin com dados do checklist
    const sql = `
      SELECT
        o.id,
        o.nome_obra as nome,
        o.created_at,
        o.updated_at,
        u.nome as usuario_nome,
        u.id as usuario_id,
        u.obra as endereco_obra,
        cu.uso_solo,
        cu.licenca,
        cu.condominio,
        cu.habite_se,
        cu.averbacao,
        cu.vistoria,
        cu.observacoes
      FROM obras o
      JOIN usuarios u ON o.usuario_id = u.id
      LEFT JOIN checklist_usuarios cu ON cu.usuario_id = u.id
      WHERE u.admin_id = ?
      ORDER BY o.created_at DESC
      LIMIT 50
    `;

    const [obras] = await db.execute(sql, [adminId]);

    // Calcular progresso para cada obra
    const obrasComProgresso = (obras || []).map(obra => {
      const camposChecklist = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
      let completos = 0;

      camposChecklist.forEach(campo => {
        if (obra[campo] === 'Feito') {
          completos++;
        }
      });

      const progresso = camposChecklist.length > 0 ? Math.round((completos / camposChecklist.length) * 100) : 0;

      return {
        ...obra,
        progresso,
        checklist: {
          uso_solo: obra.uso_solo || 'Nao Tem',
          licenca: obra.licenca || 'Nao Tem',
          condominio: obra.condominio || 'Nao Tem',
          habite_se: obra.habite_se || 'Nao Tem',
          averbacao: obra.averbacao || 'Nao Tem',
          vistoria: obra.vistoria || 'Nao Tem'
        }
      };
    });

    res.json({ obras: obrasComProgresso });
  } catch (err) {
    console.error('❌ Erro ao carregar obras recentes:', err);
    res.status(500).json({ error: 'Erro ao carregar obras recentes' });
  }
};
