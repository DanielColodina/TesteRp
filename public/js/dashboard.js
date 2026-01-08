document.addEventListener('DOMContentLoaded', () => {
    // Carregar estatísticas
    carregarEstatisticas();

    // Carregar obras recentes
    carregarObrasRecentes();

    // Carregar atividades recentes
    carregarAtividadesRecentes();

    // Atualizar a cada 30 segundos
    setInterval(() => {
        carregarEstatisticas();
        carregarAtividadesRecentes();
        carregarObrasRecentes();
    }, 30000);
});

async function carregarEstatisticas() {
    try {
        // Buscar dados atualizados do servidor
        const statsRes = await fetch('/dashboard/api/stats');
        if (statsRes.ok) {
            const stats = await statsRes.json();
            document.getElementById('totalUsuarios').textContent = stats.totalUsuarios || '0';
            document.getElementById('totalObras').textContent = stats.totalObras || '0';
            document.getElementById('progressoMedio').textContent = `${stats.progressoMedio || 0}%`;
        }

        // Atividades hoje - contar atividades do dia atual
        const hoje = new Date().toISOString().split('T')[0];
        const atividadesRes = await fetch('/dashboard/api/historico');
        if (atividadesRes.ok) {
            const data = await atividadesRes.json();
            const atividadesHoje = (data.historico || []).filter(item => {
                const dataItem = new Date(item.created_at).toISOString().split('T')[0];
                return dataItem === hoje;
            }).length;
            document.getElementById('atividadesHoje').textContent = atividadesHoje;
        }

    } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
    }
}

async function carregarObrasRecentes() {
    try {
        console.log('Carregando obras recentes...');
        const res = await fetch('/dashboard/api/obras-recentes');
        const data = await res.json();
        console.log('Dados recebidos:', data);

        const worksList = document.getElementById('recentWorksList');

        if (!data.obras || data.obras.length === 0) {
            worksList.innerHTML = '<div style="text-align: center; color: #22c55e; padding: 20px;"><p>Nenhuma obra cadastrada ainda.</p></div>';
            return;
        }

        worksList.innerHTML = data.obras.map(obra => {
            const progresso = obra.progresso || 0;

            // Função para obter emoji e cor do status
            const getStatusInfo = (status) => {
                switch(status) {
                    case 'Finalizado':
                    case 'Feito':
                        return { emoji: '✅', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
                    case 'Andamento':
                        return { emoji: '⏳', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
                    case 'Proxima-Etapa':
                        return { emoji: '🔄', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
                    default:
                        return { emoji: '⏸️', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };
                }
            };

            // Gerar HTML dos campos do checklist
            const checklistItems = [
                { key: 'uso_solo', name: 'Uso do Solo' },
                { key: 'licenca', name: 'Licença' },
                { key: 'condominio', name: 'Condomínio' },
                { key: 'habite_se', name: 'Habite-se' },
                { key: 'averbacao', name: 'Averbação' },
                { key: 'vistoria', name: 'Vistoria' }
            ];

            const checklistHtml = checklistItems.map(item => {
                const status = obra.checklist[item.key] || 'Nao Tem';
                const info = getStatusInfo(status);
                return `
                    <div class="checklist-item" style="display: inline-block; margin: 2px; padding: 2px 6px; border-radius: 4px; background: ${info.bg}; border: 1px solid ${info.color}20;">
                        <span style="font-size: 0.7rem; color: ${info.color};">
                            ${info.emoji} ${item.name}: ${status === 'Nao Tem' ? 'Não Tem' : status}
                        </span>
                    </div>
                `;
            }).join('');

            return `
                <div class="work-item" style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: #fafafa;">
                    <div class="work-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div class="work-info">
                            <h4 style="margin: 0 0 5px 0; color: #1f2937;">${obra.nome || 'Obra sem nome'}</h4>
                            <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">Cliente: ${obra.usuario_nome || 'N/A'}</p>
                            <p style="margin: 0; color: #6b7280; font-size: 0.8rem;">Criada: ${new Date(obra.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div class="work-actions">
                            <button class="btn-edit" title="Editar cliente" data-user-id="${obra.usuario_id}">✏️</button>
                            <button class="btn-unlink" title="Remover das obras recentes" data-obra-id="${obra.id}" data-obra-nome="${obra.nome}" data-user-id="${obra.usuario_id}">❌</button>
                        </div>
                    </div>

                    <div class="work-progress" style="margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <span style="font-size: 0.8rem; color: #6b7280; margin-right: 10px;">Progresso:</span>
                            <div class="progress-bar" style="flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                                <div class="progress-fill" style="width: ${progresso}%; height: 100%; background: linear-gradient(90deg, #10b981 0%, #059669 100%); transition: width 0.3s;"></div>
                            </div>
                            <span class="progress-text" style="margin-left: 10px; font-weight: bold; color: #1f2937;">${progresso}%</span>
                        </div>
                    </div>

                    <div class="work-checklist" style="margin-top: 10px;">
                        <div style="font-size: 0.8rem; color: #6b7280; margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
                            <span>Status Inicial do Checklist:</span>
                            <button class="btn-edit-checklist" title="Editar checklist completo" data-user-id="${obra.usuario_id}" style="background: none; border: 1px solid #3b82f6; color: #3b82f6; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem; cursor: pointer;">Editar</button>
                        </div>
                        <div class="checklist-grid">
                            ${checklistHtml}
                        </div>
                        <div style="font-size: 0.7rem; color: #059669; margin-top: 5px;">🔒 Status definido no cadastro - só muda na edição completa</div>
                    </div>
                </div>
            `;
        }).join('');

        // Anexar event listeners aos botões
        setTimeout(() => {
            // Botões de editar
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', function() {
                    const userId = this.getAttribute('data-user-id');
                    editarUsuario(userId);
                });
            });

            // Botões de editar checklist (redireciona para edição completa)
            document.querySelectorAll('.btn-edit-checklist').forEach(btn => {
                btn.addEventListener('click', function() {
                    const userId = this.getAttribute('data-user-id');
                    editarUsuario(userId);
                });
            });

            // Botões de desvincular
            document.querySelectorAll('.btn-unlink').forEach(btn => {
                btn.addEventListener('click', function() {
                    const obraId = this.getAttribute('data-obra-id');
                    const obraNome = this.getAttribute('data-obra-nome');
                    const userId = this.getAttribute('data-user-id');
                    desvincularObra(obraId, obraNome, userId);
                });
            });

            // Botões de excluir usuário
            document.querySelectorAll('.btn-delete-user').forEach(btn => {
                btn.addEventListener('click', function() {
                    const userId = this.getAttribute('data-user-id');
                    const userNome = this.getAttribute('data-user-nome');
                    excluirUsuario(userId, userNome);
                });
            });
        }, 100);

    } catch (err) {
        console.error('Erro ao carregar obras recentes:', err);
        document.getElementById('recentWorksList').innerHTML = '<div style="text-align: center; color: #ef4444; padding: 20px;"><p>Erro ao carregar obras</p></div>';
    }
}

async function carregarAtividadesRecentes() {
    try {
        const res = await fetch('/dashboard/api/historico');
        const data = await res.json();

        const activitiesList = document.getElementById('recentActivities');

        if (!data.historico || data.historico.length === 0) {
            activitiesList.innerHTML = '<div style="text-align: center; color: #6b7280; padding: 20px;"><p>Nenhuma atividade recente.</p></div>';
            return;
        }

        activitiesList.innerHTML = data.historico.slice(0, 10).map(activity => {
            const dataFormatada = new Date(activity.created_at).toLocaleString('pt-BR');
            return `
                <div class="activity-item">
                    <div class="activity-icon">📝</div>
                    <div class="activity-content">
                        <p><strong>${activity.tipo}: ${activity.descricao}</strong></p>
                        <p>${activity.admin_nome} • ${dataFormatada}</p>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Erro ao carregar atividades:', err);
        document.getElementById('recentActivities').innerHTML = '<p>Erro ao carregar atividades</p>';
    }
}

// Adicionar estilos para os novos elementos
const style = document.createElement('style');
style.textContent = `
.work-item, .activity-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 10px;
    background: #f9fafb;
}

.work-info h4 {
    margin: 0 0 5px 0;
    color: #333;
}

.work-info p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
}

.work-progress {
    margin-left: auto;
    text-align: right;
}

.progress-bar {
    width: 100px;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 5px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
    transition: width 0.3s;
}

.progress-text {
    font-size: 0.8rem;
    color: #666;
}

.activity-icon {
    font-size: 1.5rem;
    margin-right: 15px;
}

.activity-content p {
    margin: 0;
    font-size: 0.9rem;
}

.activity-content p:first-child {
    color: #333;
    font-weight: bold;
}

.activity-content p:last-child {
    color: #666;
}

.work-actions {
    display: flex;
    gap: 5px;
    margin-left: 10px;
}

.btn-edit, .btn-delete {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    font-size: 1rem;
    transition: background 0.2s;
}

.btn-edit:hover {
    background: rgba(59, 130, 246, 0.1);
}

.btn-edit-checklist:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #1d4ed8;
    border-color: #1d4ed8;
}

.btn-unlink:hover {
    background: rgba(245, 158, 11, 0.1);
}

.btn-delete:hover {
    background: rgba(239, 68, 68, 0.1);
}

/* Novos estilos para checklist */
.checklist-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    max-width: 100%;
}

.work-item {
    transition: all 0.3s ease;
}

.work-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}
`;
document.head.appendChild(style);

// Funções para editar usuário e desvincular obra
function editarUsuario(usuarioId) {
    console.log('Editar usuário chamado com ID:', usuarioId);
    if (usuarioId) {
        window.location.href = `/dashboard/usuarios/${usuarioId}/edit`;
    } else {
        alert('Cliente não encontrado para esta obra.');
    }
}

function desvincularObra(obraId, obraNome, usuarioId) {
    if (confirm(`Tem certeza que deseja desvincular a obra "${obraNome}" do cliente?\n\nA obra continuará existindo, mas não estará mais associada a nenhum cliente.`)) {
        fetch(`/obras/${obraId}/desvincular`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `usuario_id=${usuarioId}`
        })
        .then(response => {
            if (response.ok) {
                alert('Obra desvinculada com sucesso! Ela não aparecerá mais nas obras recentes.');
                carregarObrasRecentes();
            } else {
                alert('Erro ao desvincular obra.');
            }
        })
        .catch(err => {
            console.error('Erro:', err);
            alert('Erro ao desvincular obra.');
        });
    }
}

function excluirUsuario(usuarioId, usuarioNome) {
    if (confirm(`⚠️ ATENÇÃO: Tem certeza que deseja EXCLUIR COMPLETAMENTE o cliente "${usuarioNome}"?\n\nEsta ação irá:\n• Remover o cliente do sistema\n• Desvincular todas as obras associadas\n• Apagar todo o histórico e auditoria\n\nEsta ação NÃO pode ser desfeita!`)) {
        fetch(`/dashboard/usuarios/${usuarioId}/delete`, {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                alert(`Cliente "${usuarioNome}" excluído completamente do sistema!`);
                carregarObrasRecentes();
            } else {
                alert('Erro ao excluir cliente.');
            }
        })
        .catch(err => {
            console.error('Erro:', err);
            alert('Erro ao excluir cliente.');
        });
    }
}