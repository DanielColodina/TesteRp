const db = require('../database/connection');
const Checklist = require('../models/Checklist');
const Historico = require('../models/Historico');
const MaterialObra = require('../modules/estoque/models/MaterialObra');

// Verificar se coluna obra_id existe na tabela funcionarios
async function funcionariosTableHasObraId() {
  try {
    const [columns] = await db.execute("SHOW COLUMNS FROM funcionarios LIKE 'obra_id'");
    return columns.length > 0;
  } catch (err) {
    console.warn('⚠️ Erro ao verificar coluna obra_id:', err.message);
    return false;
  }
}

// Página de rotas completas - todas as obras com informações detalhadas
exports.index = async (req, res) => {
  try {
    const adminId = req.session.adminId;

    // Verificar se a tabela funcionarios tem obra_id
    const hasObraId = await funcionariosTableHasObraId();
    console.log('📋 Tabela funcionarios tem coluna obra_id:', hasObraId);

    // Buscar todas as obras com informações do cliente
    const sqlObras = `
      SELECT
        o.id,
        o.nome_obra,
        o.descricao,
        o.created_at,
        u.id as cliente_id,
        u.nome as cliente_nome,
        u.email as cliente_email,
        u.telefone as cliente_telefone,
        u.endereco as cliente_endereco,
        u.obra as endereco_obra
      FROM obras o
      LEFT JOIN usuarios u ON o.usuario_id = u.id
      ORDER BY o.created_at DESC
    `;

    const [obras] = await db.execute(sqlObras);
    console.log(`📋 Total de obras encontradas: ${obras.length}`);

    // Para cada obra, buscar informações adicionais
    const obrasCompletas = await Promise.all(
      (obras || []).map(async (obra) => {
        // Buscar checklist e progresso
        let checklist = null;
        let progresso = 0;
        let status_uso_solo = 'Nao Tem';
        let status_licenca = 'Nao Tem';
        let status_condominio = 'Nao Tem';
        let status_habite_se = 'Nao Tem';
        let status_averbacao = 'Nao Tem';
        let status_vistoria = 'Nao Tem';

        if (obra.cliente_id) {
          checklist = await Checklist.findByUser(obra.cliente_id);
          const progressoData = await Checklist.getProgresso(obra.cliente_id);
          progresso = progressoData.progresso;

          if (checklist) {
            status_uso_solo = checklist.uso_solo || 'Nao Tem';
            status_licenca = checklist.licenca || 'Nao Tem';
            status_condominio = checklist.condominio || 'Nao Tem';
            status_habite_se = checklist.habite_se || 'Nao Tem';
            status_averbacao = checklist.averbacao || 'Nao Tem';
            status_vistoria = checklist.vistoria || 'Nao Tem';
          }
        }

        // Buscar materiais da obra
        let materiais = [];
        try {
          materiais = await MaterialObra.findByObra(obra.id);
          console.log(`📦 Materiais encontrados para obra ${obra.id}: ${materiais.length}`);
        } catch (err) {
          console.warn('⚠️ Erro ao buscar materiais da obra:', err.message);
        }

        // Buscar funcionários da obra (tabela funcionarios)
        let funcionarios = [];
        try {
          if (hasObraId) {
            const [funcs] = await db.execute(
              'SELECT id, nome, funcao FROM funcionarios WHERE obra_id = ? ORDER BY nome',
              [obra.id]
            );
            funcionarios = funcs || [];
            console.log(`👷 Funcionários encontrados para obra ${obra.id}: ${funcionarios.length}`);
          } else {
            // Se não tem obra_id, buscar todos os funcionários
            const [funcs] = await db.execute(
              'SELECT id, nome, funcao FROM funcionarios ORDER BY nome'
            );
            funcionarios = funcs || [];
            console.log(`👷 Todos os funcionários (sem filtro de obra): ${funcionarios.length}`);
          }
        } catch (err) {
          console.warn('⚠️ Erro ao buscar funcionários da obra:', err.message);
        }

        // Buscar financeiro da obra (lancamentos de custo + financeiro)
        let lancamentosFinanceiro = [];
        let totalGanhos = 0;
        let totalDespesas = 0;
        try {
          // Busca da tabela lancamento_custo (via centro_custo)
          const [lancamentosCusto] = await db.execute(
            `SELECT lc.*, cc.nome as centro_custo_nome 
             FROM lancamento_custo lc 
             LEFT JOIN centro_custo cc ON lc.centro_custo_id = cc.id 
             WHERE lc.centro_custo_id IN (SELECT id FROM centro_custo WHERE obra_id = ?)
             ORDER BY lc.data DESC LIMIT 50`,
            [obra.id]
          );
          
          // Busca da tabela financeiro
          const [financeiros] = await db.execute(
            `SELECT f.*, 'Financeiro' as centro_custo_nome
             FROM financeiro f
             WHERE f.obra_id = ?
             ORDER BY f.data DESC LIMIT 50`,
            [obra.id]
          );
          
          // Combina os resultados
          lancamentosFinanceiro = [...(lancamentosCusto || []), ...(financeiros || [])];
          
          // Ordena por data (mais recente primeiro)
          lancamentosFinanceiro.sort((a, b) => new Date(b.data || b.created_at) - new Date(a.data || a.created_at));
          
          // Calcular totais
          lancamentosFinanceiro.forEach(l => {
            if (l.tipo === 'entrada' || l.tipo === 'ganho' || l.tipo === 'receita') {
              totalGanhos += parseFloat(l.valor) || 0;
            } else if (l.tipo === 'saida' || l.tipo === 'despesa' || l.tipo === 'custo') {
              totalDespesas += parseFloat(l.valor) || 0;
            }
          });
          
          console.log(`💰 Financeiro encontrado para obra ${obra.id}: ${lancamentosFinanceiro.length} registros`);
        } catch (err) {
          console.warn('⚠️ Erro ao buscar financeiro da obra:', err.message);
        }

        // Buscar histórico da obra (relacionado ao cliente)
        let historico = [];
        if (obra.cliente_id) {
          try {
            historico = await Historico.findByUsuario(obra.cliente_id);
          } catch (err) {
            console.warn('⚠️ Erro ao buscar histórico:', err.message);
          }
        }

        return {
          ...obra,
          progresso,
          status_uso_solo,
          status_licenca,
          status_condominio,
          status_habite_se,
          status_averbacao,
          status_vistoria,
          materiais,
          funcionarios,
          lancamentosFinanceiro,
          totalGanhos,
          totalDespesas,
          historico
        };
      })
    );

    console.log(`✅ Total de obras processadas: ${obrasCompletas.length}`);
    res.render('rotascompletas', { obras: obrasCompletas });
  } catch (err) {
    console.error('❌ Erro ao carregar rotas completas:', err);
    res.status(500).send('Erro ao carregar página: ' + err.message);
  }
};
