// Rotas Completas - JavaScript com Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
  const accordionHeaders = document.querySelectorAll('.accordion-header[data-toggle="accordion"]');
  
  accordionHeaders.forEach(function(header) {
    header.addEventListener('click', function() {
      const obraId = this.closest('.accordion-item').dataset.obraId;
      const content = document.getElementById('content-' + obraId);
      
      // Toggle do accordion
      const isActive = this.classList.contains('active');
      
      // Fechar todos os outros
      accordionHeaders.forEach(function(otherHeader) {
        if (otherHeader !== header) {
          otherHeader.classList.remove('active');
          const otherObraId = otherHeader.closest('.accordion-item').dataset.obraId;
          const otherContent = document.getElementById('content-' + otherObraId);
          if (otherContent) {
            otherContent.style.display = 'none';
          }
        }
      });
      
      if (isActive) {
        // Fechar
        this.classList.remove('active');
        content.style.display = 'none';
      } else {
        // Abrir
        this.classList.add('active');
        content.style.display = 'block';
        
        // Carregar dados via AJAX se ainda não foram carregados
        if (!content.dataset.loaded) {
          carregarDetalhesObra(obraId, content);
        }
      }
    });
  });
});

async function carregarDetalhesObra(obraId, content) {
  // Mostrar loading
  content.innerHTML = `
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i> Carregando dados...
    </div>
  `;
  
  try {
    const response = await fetch('/api/rotascompletas/' + obraId);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar dados');
    }
    
    const obra = await response.json();
    
    // Renderizar conteúdo
    content.innerHTML = renderizarConteudoObra(obra);
    content.dataset.loaded = 'true';
    
  } catch (err) {
    console.error('Erro ao carregar detalhes:', err);
    content.innerHTML = `
      <div class="info-section">
        <p class="no-data">Erro ao carregar dados. Tente novamente.</p>
      </div>
    `;
  }
}

function renderizarConteudoObra(obra) {
  // Helper para formatar status
  const formatStatus = (status) => {
    const icons = {
      'Feito': '✅',
      'Andamento': '⏳',
      'Nao Tem': '❌'
    };
    return icons[status] || '❌';
  };
  
  // Renderizar materiais
  const materiaisHTML = obra.materiais && obra.materiais.length > 0 ? `
    <div class="materiais-list">
      ${obra.materiais.map(m => `
        <div class="material-item">
          <div class="material-info">
            <strong>${m.material_nome}</strong>
            <span class="material-quantidade">Saldo: ${m.saldo_atual} ${m.unidade}</span>
          </div>
          <span class="material-fase">${m.fase_obra || '-'}</span>
        </div>
      `).join('')}
    </div>
  ` : '<p class="no-data">Nenhum material vinculado a esta obra.</p>';
  
  // Renderizar funcionários
  const funcionariosHTML = obra.funcionarios && obra.funcionarios.length > 0 ? `
    <div class="funcionarios-list">
      ${obra.funcionarios.map(f => `
        <div class="funcionario-item">
          <div class="funcionario-info">
            <strong>${f.nome}</strong>
            <span class="funcionario-funcao">${f.funcao}</span>
          </div>
        </div>
      `).join('')}
    </div>
  ` : '<p class="no-data">Nenhum funcionário vinculado a esta obra.</p>';
  
  // Renderizar financeiro
  const lancamentosHTML = obra.lancamentosFinanceiro && obra.lancamentosFinanceiro.length > 0 ? `
    <div class="financeiro-list">
      ${obra.lancamentosFinanceiro.map(l => `
        <div class="financeiro-item ${l.tipo}">
          <div class="financeiro-info">
            <strong>${l.descricao || l.motivo || '-'}</strong>
            <span class="financeiro-tipo">${l.tipo}</span>
          </div>
          <div class="financeiro-valores">
            <span class="financeiro-valor ${l.tipo}">${l.tipo === 'receita' || l.tipo === 'entrada' || l.tipo === 'ganho' ? '+' : '-'}R$ ${parseFloat(l.valor).toFixed(2)}</span>
            <span class="financeiro-data">${l.data || '-'}</span>
          </div>
        </div>
      `).join('')}
    </div>
  ` : '<p class="no-data">Nenhum lançamento financeiro registrado.</p>';
  
  // Renderizar histórico
  const historicoHTML = obra.historico && obra.historico.length > 0 ? `
    <div class="historico-list">
      ${obra.historico.map(h => `
        <div class="historico-item">
          <div class="historico-header">
            <strong>${h.tipo}</strong>
            <span class="historico-data">${new Date(h.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
          <p>${h.descricao || '-'}</p>
          <small>Por: ${h.admin_nome || '-'}</small>
        </div>
      `).join('')}
    </div>
  ` : '<p class="no-data">Nenhum registro no histórico.</p>';
  
  return `
    <!-- INFORMAÇÕES DA OBRA -->
    <div class="info-section">
      <h3>🏗️ Informações da Obra</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>Endereço:</label>
          <span>${obra.endereco_obra || '-'}</span>
        </div>
        <div class="info-item">
          <label>Data de Criação:</label>
          <span>${new Date(obra.created_at).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>

    <!-- INFORMAÇÕES DO CLIENTE/USUÁRIO -->
    <div class="info-section">
      <h3>👤 Informações do Cliente</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>Nome:</label>
          <span>${obra.cliente_nome || '-'}</span>
        </div>
        <div class="info-item">
          <label>Email:</label>
          <span>${obra.cliente_email || '-'}</span>
        </div>
        <div class="info-item">
          <label>Telefone:</label>
          <span>${obra.cliente_telefone || '-'}</span>
        </div>
        <div class="info-item">
          <label>Endereço do Cliente:</label>
          <span>${obra.cliente_endereco || '-'}</span>
        </div>
      </div>
    </div>

    <!-- PROGRESSO E CHECKLIST -->
    <div class="info-section">
      <h3>📊 Progresso e Checklist</h3>
      <div class="progress-overview">
        <div class="progress-bar-container large">
          <div class="progress-bar" style="width: ${obra.progresso}%;">
            <span class="progress-text">${obra.progresso}%</span>
          </div>
        </div>
      </div>
      
      <div class="checklist-grid">
        <div class="checklist-item ${obra.status_uso_solo}">
          <span class="checklist-icon">${formatStatus(obra.status_uso_solo)}</span>
          <span>Uso do Solo</span>
          <span class="checklist-status">${obra.status_uso_solo}</span>
        </div>
        <div class="checklist-item ${obra.status_licenca}">
          <span class="checklist-icon">${formatStatus(obra.status_licenca)}</span>
          <span>Licença</span>
          <span class="checklist-status">${obra.status_licenca}</span>
        </div>
        <div class="checklist-item ${obra.status_condominio}">
          <span class="checklist-icon">${formatStatus(obra.status_condominio)}</span>
          <span>Condomínio</span>
          <span class="checklist-status">${obra.status_condominio}</span>
        </div>
        <div class="checklist-item ${obra.status_habite_se}">
          <span class="checklist-icon">${formatStatus(obra.status_habite_se)}</span>
          <span>Habite-se</span>
          <span class="checklist-status">${obra.status_habite_se}</span>
        </div>
        <div class="checklist-item ${obra.status_averbacao}">
          <span class="checklist-icon">${formatStatus(obra.status_averbacao)}</span>
          <span>Averbação</span>
          <span class="checklist-status">${obra.status_averbacao}</span>
        </div>
        <div class="checklist-item ${obra.status_vistoria}">
          <span class="checklist-icon">${formatStatus(obra.status_vistoria)}</span>
          <span>Vistoria</span>
          <span class="checklist-status">${obra.status_vistoria}</span>
        </div>
      </div>
    </div>

    <!-- MATERIAIS DA OBRA -->
    <div class="info-section">
      <div class="section-header">
        <h3>📦 Materiais da Obra</h3>
        <a href="/dashboard/controle-grade/estoque?obra_id=${obra.id}" class="btn-add" title="Adicionar Material">+</a>
      </div>
      ${materiaisHTML}
    </div>

    <!-- FUNCIONÁRIOS DA OBRA -->
    <div class="info-section">
      <div class="section-header">
        <h3>👷 Funcionários da Obra</h3>
        <a href="/dashboard/controle-grade/equipes?obra_id=${obra.id}" class="btn-add" title="Adicionar Funcionário">+</a>
      </div>
      ${funcionariosHTML}
    </div>

    <!-- FINANCEIRO DA OBRA -->
    <div class="info-section">
      <div class="section-header">
        <h3>💰 Financeiro da Obra</h3>
        <a href="/dashboard/controle-grade/financeiro?obra_id=${obra.id}" class="btn-add" title="Adicionar Transação">+</a>
      </div>
      
      <div class="financeiro-resumo">
        <div class="resumo-item ganho">
          <span class="resumo-label">💵 Ganhos</span>
          <span class="resumo-valor">R$ ${obra.totalGanhos.toFixed(2)}</span>
        </div>
        <div class="resumo-item despesa">
          <span class="resumo-label">💸 Despesas</span>
          <span class="resumo-valor">R$ ${obra.totalDespesas.toFixed(2)}</span>
        </div>
        <div class="resumo-item saldo">
          <span class="resumo-label">💼 Saldo</span>
          <span class="resumo-valor">R$ ${(obra.totalGanhos - obra.totalDespesas).toFixed(2)}</span>
        </div>
      </div>
      
      ${lancamentosHTML}
    </div>

    <!-- HISTÓRICO DA OBRA -->
    <div class="info-section">
      <h3>📜 Histórico da Obra</h3>
      ${historicoHTML}
    </div>
  `;
}
