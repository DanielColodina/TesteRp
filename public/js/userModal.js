document.addEventListener('DOMContentLoaded', () => {
  const userModal = document.getElementById('userModal');
  const closeUser = document.querySelector('.close-user');
  const userLinks = document.querySelectorAll('.user-link');
  const formDelete = document.getElementById('formDelete');
  const historicoList = document.getElementById('uHistorico');
  const btnEdit = document.getElementById('btnEdit');

  let currentUserId = null;

  // Verificar se elementos existem
  if (!userModal || userLinks.length === 0) {
    console.warn('⚠️ Modal ou links de usuário não encontrados');
    return;
  }

  // Event listener para cada link de usuário
  userLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();

      currentUserId = link.dataset.id;

      // Preencher informações do usuário
      const nomeEl = document.getElementById('uNome');
      const emailEl = document.getElementById('uEmail');
      const telefoneEl = document.getElementById('uTelefone');
      const enderecoEl = document.getElementById('uEndereco');
      const obraEl = document.getElementById('uObra');
      const adminEl = document.getElementById('uAdmin');
      const dataEl = document.getElementById('uData');

      if (nomeEl) nomeEl.innerText = link.dataset.nome || 'N/A';
      if (emailEl) emailEl.innerText = link.dataset.email || 'N/A';
      if (telefoneEl) telefoneEl.innerText = link.dataset.telefone || 'N/A';
      if (enderecoEl) enderecoEl.innerText = link.dataset.endereco || 'N/A';
      if (obraEl) obraEl.innerText = link.dataset.obra || 'N/A';
      if (adminEl) adminEl.innerText = link.dataset.admin || 'N/A';
      if (dataEl) dataEl.innerText = link.dataset.data || 'N/A';

      // Configurar rota de exclusão
      if (formDelete) {
        formDelete.action = `/dashboard/usuarios/${currentUserId}/delete`;
      }

      // Botão editar
      if (btnEdit) {
        btnEdit.onclick = () => {
          window.location.href = `/dashboard/usuarios/${currentUserId}/edit`;
        };
      }

      // Carregar histórico
      if (historicoList) {
        historicoList.innerHTML = '<li>⏳ Carregando histórico...</li>';

        try {
          const res = await fetch(`/dashboard/usuarios/${currentUserId}/historico`);
          
          if (!res.ok) throw new Error('Erro ao carregar histórico');
          
          const data = await res.json();

          historicoList.innerHTML = '';

          if (!data || data.length === 0) {
            historicoList.innerHTML = '<li>📭 Sem histórico</li>';
          } else {
            data.forEach(item => {
              const li = document.createElement('li');
              const dataFormatada = new Date(item.created_at).toLocaleDateString('pt-BR');
              li.innerText = `${item.descricao} (${dataFormatada})`;
              historicoList.appendChild(li);
            });
          }
        } catch (err) {
          console.error('❌ Erro ao carregar histórico:', err);
          historicoList.innerHTML = '<li>❌ Erro ao carregar histórico</li>';
        }
      }

      // Carregar e renderizar checklist editável
      await carregarChecklist(currentUserId);

      // Mostrar modal
      if (userModal) {
        userModal.style.display = 'block';
      }
    });
  });

  // Função para carregar checklist
  async function carregarChecklist(usuarioId) {
    try {
      const res = await fetch(`/dashboard/usuarios/${usuarioId}/checklist`);
      
      if (!res.ok) throw new Error('Erro ao carregar checklist');
      
      const data = await res.json();

      // Limpar selects anteriores
      document.querySelectorAll('.check-item select').forEach(select => {
        select.innerHTML = '';
      });

      // Preenchendo os selects com opções e valor salvo
      const opcoes = ['Nao Tem', 'Andamento', 'Feito'];
      const labels = ['❌ Não Tem', '⏳ Andamento', '✅ Feito'];

      document.querySelectorAll('.check-item select').forEach(select => {
        const field = select.getAttribute('data-field');
        const valorAtual = data[field] || 'Nao Tem';

        opcoes.forEach((opcao, idx) => {
          const option = document.createElement('option');
          option.value = opcao;
          option.textContent = labels[idx];
          option.selected = (valorAtual === opcao);
          select.appendChild(option);
        });

        // Evento ao mudar valor
        select.addEventListener('change', async (e) => {
          const novoValor = e.target.value;
          select.disabled = true;
          
          try {
            const updateRes = await fetch(`/dashboard/usuarios/${usuarioId}/checklist`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                campo: field,
                valor: novoValor,
                admin_override: true
              })
            });

            if (!updateRes.ok) throw new Error('Erro ao atualizar checklist');
            
            const result = await updateRes.json();
            if (result.success) {
              // Atualizar barra de progresso
              atualizarProgresso(result.progresso);
              console.log(`✅ ${field} atualizado para ${novoValor}`);
            } else {
              alert('❌ Erro ao atualizar checklist');
            }
          } catch (err) {
            console.error('❌ Erro ao atualizar checklist:', err);
            alert('❌ Erro ao atualizar checklist');
          } finally {
            select.disabled = false;
          }
        });
      });

      // Preencher observações
      const observacoesEl = document.getElementById('observacoesChecklist');
      if (observacoesEl) {
        observacoesEl.value = data.observacoes || '';
      }

      // Mostrar progresso inicial
      if (data.progresso !== undefined) {
        atualizarProgresso(data.progresso);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar checklist:', err);
      alert('❌ Erro ao carregar checklist');
    }
  }

  // Função para atualizar a barra de progresso
  function atualizarProgresso(percentual) {
    const progressoDiv = document.getElementById('progressoObra');
    if (progressoDiv) {
      progressoDiv.innerHTML = `
        <h3>📊 Progresso da Obra</h3>
        <div style="background: #1e293b; border-radius: 8px; overflow: hidden; margin: 10px 0; height: 30px; border: 2px solid #38bdf8;">
          <div style="width: ${Math.min(percentual, 100)}%; height: 100%; background: linear-gradient(90deg, #10b981 0%, #059669 100%); transition: width 0.3s; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">
            ${Math.round(percentual)}%
          </div>
        </div>
      `;
    }
  }

  // Fechar modal
  if (closeUser) {
    closeUser.addEventListener('click', () => {
      if (userModal) {
        userModal.style.display = 'none';
      }
    });
  }

  // Event listener para salvar observações
  const btnSalvarObservacoes = document.getElementById('btnSalvarObservacoes');
  if (btnSalvarObservacoes) {
    btnSalvarObservacoes.addEventListener('click', async () => {
      const observacoesEl = document.getElementById('observacoesChecklist');
      if (!observacoesEl || !currentUserId) return;

      const observacoes = observacoesEl.value;
      btnSalvarObservacoes.disabled = true;
      btnSalvarObservacoes.textContent = 'Salvando...';

      try {
        const res = await fetch(`/dashboard/usuarios/${currentUserId}/observacoes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ observacoes })
        });

        if (!res.ok) throw new Error('Erro ao salvar observações');

        const result = await res.json();
        if (result.success) {
          alert('✅ Observações salvas com sucesso!');
        } else {
          alert('❌ Erro ao salvar observações');
        }
      } catch (err) {
        console.error('❌ Erro ao salvar observações:', err);
        alert('❌ Erro ao salvar observações');
      } finally {
        btnSalvarObservacoes.disabled = false;
        btnSalvarObservacoes.textContent = '💾 Salvar Observações';
      }
    });
  }

  // Fechar modal ao clicar fora
  window.addEventListener('click', (e) => {
    if (e.target === userModal) {
      userModal.style.display = 'none';
    }
  });
});

