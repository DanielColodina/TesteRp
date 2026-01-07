const API_BASE = '/api';

// Função auxiliar para fetch com credenciais
async function apiFetch(url, options = {}) {
    return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
}

function showModule(moduleName) {
    const modules = document.querySelectorAll('.module');
    modules.forEach(module => module.classList.add('hidden'));
    document.getElementById(moduleName).classList.remove('hidden');
}

async function loadObras() {
    try {
        const response = await apiFetch(`${API_BASE}/obras`);
        const obras = await response.json();
        const obrasList = document.getElementById('obras-list');
        obrasList.innerHTML = obras.map(obra => `
            <div class="obra-item">
                <h3>${obra.nome}</h3>
                <p>Cliente: ${obra.cliente}</p>
                <p>Status: ${obra.status}</p>
                <p>Orçamento: R$ ${obra.orcamento}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar obras:', error);
    }
}

document.getElementById('obra-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const obra = {
        nome: formData.get('nome'),
        endereco: formData.get('endereco'),
        cliente: formData.get('cliente'),
        orcamento: parseFloat(formData.get('orcamento')),
        data_inicio: formData.get('data_inicio'),
        data_fim: formData.get('data_fim'),
        status: formData.get('status')
    };

    try {
        const response = await apiFetch(`${API_BASE}/obras`, {
            method: 'POST',
            body: JSON.stringify(obra)
        });
        if (response.ok) {
            alert('Obra adicionada com sucesso!');
            e.target.reset();
            loadObras();
        } else {
            alert('Erro ao adicionar obra');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

async function loadMateriais() {
    try {
        const response = await apiFetch(`${API_BASE}/materiais`);
        const materiais = await response.json();
        const materiaisList = document.getElementById('materiais-list');
        materiaisList.innerHTML = materiais.map(material => `
            <div class="material-item">
                <h3>${material.descricao}</h3>
                <p>Código: ${material.codigo}</p>
                <p>Quantidade: ${material.quantidade} ${material.unidade}</p>
                <p>Preço Médio: R$ ${material.preco_medio}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar materiais:', error);
    }
}

document.getElementById('material-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const material = {
        codigo: formData.get('codigo'),
        descricao: formData.get('descricao'),
        unidade: formData.get('unidade'),
        quantidade: parseFloat(formData.get('quantidade')),
        preco_medio: parseFloat(formData.get('preco_medio')),
        estoque_minimo: parseFloat(formData.get('estoque_minimo'))
    };

    try {
        const response = await apiFetch(`${API_BASE}/materiais`, {
            method: 'POST',
            body: JSON.stringify(material)
        });
        if (response.ok) {
            alert('Material adicionado com sucesso!');
            e.target.reset();
            loadMateriais();
        } else {
            alert('Erro ao adicionar material');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

async function loadFuncionarios() {
    try {
        const response = await apiFetch(`${API_BASE}/funcionarios`);
        const funcionarios = await response.json();
        const funcionariosList = document.getElementById('funcionarios-list');
        funcionariosList.innerHTML = funcionarios.map(func => `
            <div class="funcionario-item">
                <h3>${func.nome}</h3>
                <p>Função: ${func.funcao}</p>
                <p>Salário: R$ ${func.salario}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
    }
}

document.getElementById('funcionario-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const funcionario = {
        nome: formData.get('nome_func'),
        funcao: formData.get('funcao'),
        salario: parseFloat(formData.get('salario'))
    };

    try {
        const response = await apiFetch(`${API_BASE}/funcionarios`, {
            method: 'POST',
            body: JSON.stringify(funcionario)
        });
        if (response.ok) {
            alert('Funcionário adicionado com sucesso!');
            e.target.reset();
            loadFuncionarios();
        } else {
            alert('Erro ao adicionar funcionário');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

async function loadFinanceiro() {
    try {
        const response = await apiFetch(`${API_BASE}/financeiro`);
        const lancamentos = await response.json();
        const financeiroList = document.getElementById('financeiro-list');
        financeiroList.innerHTML = lancamentos.map(lanc => `
            <div class="lancamento-item">
                <h3>${lanc.tipo}: ${lanc.descricao}</h3>
                <p>Valor: R$ ${lanc.valor}</p>
                <p>Data: ${lanc.data}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar financeiro:', error);
    }
}

document.getElementById('financeiro-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const lancamento = {
        tipo: formData.get('tipo'),
        descricao: formData.get('descricao_fin'),
        valor: parseFloat(formData.get('valor')),
        data: formData.get('data_fin'),
        obra_id: parseInt(formData.get('obra_id'))
    };

    try {
        const response = await apiFetch(`${API_BASE}/financeiro`, {
            method: 'POST',
            body: JSON.stringify(lancamento)
        });
        if (response.ok) {
            alert('Lançamento adicionado com sucesso!');
            e.target.reset();
            loadFinanceiro();
        } else {
            alert('Erro ao adicionar lançamento');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

async function loadMensagens() {
    try {
        const response = await apiFetch(`${API_BASE}/mensagens`);
        const mensagens = await response.json();
        const mensagensList = document.getElementById('mensagens-list');
        mensagensList.innerHTML = mensagens.map(msg => `
            <div class="mensagem-item">
                <p><strong>${msg.de} para ${msg.para}:</strong> ${msg.mensagem}</p>
                <p>Data: ${msg.data}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
    }
}

document.getElementById('mensagem-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mensagem = {
        de: formData.get('de'),
        para: formData.get('para'),
        mensagem: formData.get('mensagem'),
        data: formData.get('data_msg'),
        obra_id: parseInt(formData.get('obra_id_msg'))
    };

    try {
        const response = await apiFetch(`${API_BASE}/mensagens`, {
            method: 'POST',
            body: JSON.stringify(mensagem)
        });
        if (response.ok) {
            alert('Mensagem enviada com sucesso!');
            e.target.reset();
            loadMensagens();
        } else {
            alert('Erro ao enviar mensagem');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

function gerarRelatorioObras() {
    const relatorioContent = document.getElementById('relatorio-content');
    relatorioContent.innerHTML = '<h3>Relatório de Obras</h3><p>Funcionalidade de geração de PDF em desenvolvimento.</p>';
}

function gerarRelatorioEstoque() {
    const relatorioContent = document.getElementById('relatorio-content');
    relatorioContent.innerHTML = '<h3>Relatório de Estoque</h3><p>Funcionalidade de geração de PDF em desenvolvimento.</p>';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Detectar módulo pela URL
    const path = window.location.pathname;
    let module = 'obras'; // padrão

    if (path.includes('/materiais')) module = 'estoque';
    else if (path.includes('/funcionarios')) module = 'equipes';
    else if (path.includes('/financeiro')) module = 'financeiro';
    else if (path.includes('/mensagens')) module = 'comunicacao';
    else if (path.includes('/relatorios')) module = 'relatorios';

    showModule(module);

    // Carregar dados do módulo atual
    if (module === 'obras') loadObras();
    else if (module === 'estoque') loadMateriais();
    else if (module === 'equipes') loadFuncionarios();
    else if (module === 'financeiro') loadFinanceiro();
    else if (module === 'comunicacao') loadMensagens();
});