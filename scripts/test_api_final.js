/**
 * Teste final: validar atualização de checklist via API HTTP
 * Simula exatamente o que o frontend fará quando atualizar o checklist
 */

const http = require('http');
require('dotenv').config();

const API_BASE = 'http://localhost:3000';
const USER_ID = 1; // Usuário "Daniel"

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Teste Final - Atualização de Checklist via API\n');
  console.log(`📍 Base URL: ${API_BASE}`);
  console.log(`👤 Usuário: ID ${USER_ID}\n`);

  try {
    // 1. Testar GET checklist
    console.log('1️⃣  GET /dashboard/usuarios/:id/checklist');
    try {
      const getRes = await makeRequest('GET', `/dashboard/usuarios/${USER_ID}/checklist`);
      console.log(`   Status: ${getRes.status}`);
      if (getRes.status === 200) {
        console.log('   ✅ Checklist carregado');
      } else {
        console.log('   ⚠️  Resposta:', getRes.data);
      }
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}`);
    }

    // 2. Teste PUT - atualizar um campo
    const testFields = [
      { campo: 'uso_solo', valor: 'Feito' },
      { campo: 'licenca', valor: 'Andamento' },
      { campo: 'condominio', valor: 'Finalizado' },
      { campo: 'habite_se', valor: 'Proxima-Etapa' },
      { campo: 'averbacao', valor: 'Feito' },
      { campo: 'vistoria', valor: 'Finalizado' }
    ];

    console.log('\n2️⃣  POST /dashboard/usuarios/:id/checklist (múltiplas atualizações)\n');
    
    for (const field of testFields) {
      try {
        const updateRes = await makeRequest(
          'POST',
          `/dashboard/usuarios/${USER_ID}/checklist`,
          field
        );
        
        if (updateRes.status === 200 && updateRes.data.success) {
          console.log(`   ✅ ${field.campo} = ${field.valor} (Progresso: ${updateRes.data.progresso}%)`);
        } else {
          console.log(`   ❌ ${field.campo} - Erro: ${updateRes.data.error || updateRes.status}`);
        }
      } catch (err) {
        console.log(`   ❌ ${field.campo} - ${err.message}`);
      }
      
      // Pequeno delay entre requisições
      await new Promise(r => setTimeout(r, 100));
    }

    // 3. GET progresso final
    console.log('\n3️⃣  GET /dashboard/usuarios/:id/progresso');
    try {
      const progressRes = await makeRequest('GET', `/dashboard/usuarios/${USER_ID}/progresso`);
      if (progressRes.status === 200) {
        console.log(`   ✅ Progresso final: ${progressRes.data.progresso}%`);
      } else {
        console.log(`   ❌ Erro: ${progressRes.data.error}`);
      }
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}`);
    }

    // 4. GET histórico
    console.log('\n4️⃣  GET /dashboard/usuarios/:id/historico');
    try {
      const historicoRes = await makeRequest('GET', `/dashboard/usuarios/${USER_ID}/historico`);
      if (historicoRes.status === 200 && Array.isArray(historicoRes.data)) {
        console.log(`   ✅ Histórico carregado (${historicoRes.data.length} registros)`);
        if (historicoRes.data.length > 0) {
          historicoRes.data.slice(0, 2).forEach(h => {
            console.log(`      • ${h.tipo}: ${h.descricao}`);
          });
        }
      } else {
        console.log(`   ⚠️  ${historicoRes.data.length || 0} registros`);
      }
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}`);
    }

    // 5. GET auditoria
    console.log('\n5️⃣  GET /dashboard/usuarios/:id/auditoria');
    try {
      const auditoriaRes = await makeRequest('GET', `/dashboard/usuarios/${USER_ID}/auditoria`);
      if (auditoriaRes.status === 200 && Array.isArray(auditoriaRes.data)) {
        console.log(`   ✅ Auditoria carregada (${auditoriaRes.data.length} registros)`);
        if (auditoriaRes.data.length > 0) {
          auditoriaRes.data.slice(0, 2).forEach(a => {
            console.log(`      • ${a.acao}: ${a.campo}`);
          });
        }
      } else {
        console.log(`   ⚠️  ${auditoriaRes.data.length || 0} registros`);
      }
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}`);
    }

    console.log('\n✅ TESTES CONCLUÍDOS!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Acesse http://localhost:3000 no navegador');
    console.log('   2. Faça login com as credenciais de admin');
    console.log('   3. Vá para "Tabela de Usuários" e abra o modal de um usuário');
    console.log('   4. Atualize o checklist e verifique se os dados persistem');
    console.log('   5. Verifique se "Progresso" mostra o percentual correto');

  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

// Aguardar um pouco para o servidor ficar pronto
setTimeout(runTests, 1000);
