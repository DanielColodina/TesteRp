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

      // Gerar HTML completo do modal
      const userDetails = document.getElementById('userDetails');
      if (userDetails) {
        userDetails.innerHTML = `
          <div class="user-info">
            <h3>👤 Informações do Usuário</h3>
            <p><strong>Nome:</strong> ${link.dataset.nome || 'N/A'}</p>
            <p><strong>Email:</strong> ${link.dataset.email || 'N/A'}</p>
            <p><strong>Telefone:</strong> ${link.dataset.telefone || 'N/A'}</p>
            <p><strong>Endereço da Obra:</strong> ${link.dataset.endereco || 'N/A'}</p>
            <p><strong>Nome da Obra:</strong> ${link.dataset.obra || 'N/A'}</p>
            <p><strong>Administrador:</strong> ${link.dataset.admin || 'N/A'}</p>
            <p><strong>Data de Cadastro:</strong> ${link.dataset.data || 'N/A'}</p>
          </div>

          <div id="progressoObra" class="user-info">
            <h3>📊 Progresso da Obra</h3>
            <p>Carregando...</p>
          </div>

          <div class="user-info">
            <h3>📋 Checklist da Obra</h3>
            <div class="checklist-container">
              <div class="check-item">
                <label for="uso_solo">Uso do Solo:</label>
                <select id="uso_solo" data-field="uso_solo">
                  <option value="Nao Tem">❌ Não Tem</option>
                  <option value="Andamento">⏳ Andamento</option>
                  <option value="Feito">✅ Feito</option>
                </select>
              </div>
              <div class="check-item">
                <label for="licenca">Licença:</label>
                <select id="licenca" data-field="licenca">
                  <option value="Nao Tem">❌ Não Tem</option>
                  <option value="Andamento">⏳ Andamento</option>
                  <option value="Feito">✅ Feito</option>
                </select>
              </div>
              <div class="check-item">
                <label for="condominio">Condomínio:</label>
                <select id="condominio" data-field="condominio">
                  <option value="Nao Tem">❌ Não Tem</option>
                  <option value="Andamento">⏳ Andamento</option>
                  <option value="Feito">✅ Feito</option>
                </select>
              </div>
              <div class="check-item">
                <label for="habite_se">Habite-se:</label>
                <select id="habite_se" data-field="habite_se">
                  <option value="Nao Tem">❌ Não Tem</option>
                  <option value="Andamento">⏳ Andamento</option>
                  <option value="Feito">✅ Feito</option>
                </select>
              </div>
              <div class="check-item">
                <label for="averbacao">Averbação:</label>
                <select id="averbacao" data-field="averbacao">
                  <option value="Nao Tem">❌ Não Tem</option>
                  <option value="Andamento">⏳ Andamento</option>
                  <option value="Feito">✅ Feito</option>
                </select>
              </div>
              <div class="check-item">
                <label for="vistoria">Vistoria:</label>
                <select id="vistoria" data-field="vistoria">
                  <option value="Nao Tem">❌ Não Tem</option>
                  <option value="Andamento">⏳ Andamento</option>
                  <option value="Feito">✅ Feito</option>
                </select>
              </div>
            </div>
            <div style="margin-top: 15px;">
              <label for="observacoesChecklist"><strong>📝 Observações:</strong></label>
              <textarea id="observacoesChecklist" rows="3" style="width: 100%; margin-top: 5px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Observações sobre o checklist..."></textarea>
            </div>
          </div>

          <div class="user-info">
            <h3>📜 Histórico de Atividades</h3>
            <ul id="uHistorico">
              <li>⏳ Carregando histórico...</li>
            </ul>
          </div>

          <div class="user-actions">
            <button id="btnEdit" class="btn-edit">✏️ Editar Usuário</button>
            <form id="formDelete" method="POST" style="display: inline;">
              <button type="submit" class="btn-delete" onclick="return confirm('Tem certeza que deseja excluir este usuário?')">🗑️ Excluir Usuário</button>
            </form>
          </div>
        `;
      }

      // Configurar rota de exclusão
      const formDelete = document.getElementById('formDelete');
      if (formDelete) {
        formDelete.action = `/dashboard/usuarios/${currentUserId}/delete`;
      }

      // Botão editar
      const btnEdit = document.getElementById('btnEdit');
      if (btnEdit) {
        btnEdit.onclick = () => {
          window.location.href = `/dashboard/usuarios/${currentUserId}/edit`;
        };
      }

      // Carregar histórico
      const historicoList = document.getElementById('uHistorico');
      if (historicoList) {
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

      // Adicionar evento para salvar observações
      const observacoesEl = document.getElementById('observacoesChecklist');
      if (observacoesEl) {
        observacoesEl.addEventListener('blur', async () => {
          const observacoes = observacoesEl.value;
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
              console.log('✅ Observações salvas automaticamente');
            }
          } catch (err) {
            console.error('❌ Erro ao salvar observações:', err);
          }
        });
      }

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


  // Fechar modal ao clicar fora
  window.addEventListener('click', (e) => {
    if (e.target === userModal) {
      userModal.style.display = 'none';
    }
  });
});

