const axios = require('axios');
const http = require('http');
const https = require('https');

const BASE_URL = 'http://127.0.0.1:5000';

// Usar agente HTTP com cookie jar para manter sessão entre requisições
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

let sessionCookie = '';

const axiosInstance = axios.create({
  httpAgent,
  httpsAgent,
  validateStatus: () => true,
  maxRedirects: 0
});

// Interceptor para adicionar cookie em cada request
axiosInstance.interceptors.request.use((config) => {
  if (sessionCookie) {
    config.headers.Cookie = sessionCookie;
  }
  return config;
});

// Interceptor para capturar Set-Cookie nas respostas
axiosInstance.interceptors.response.use((response) => {
  const setCookie = response.headers['set-cookie'];
  if (setCookie) {
    sessionCookie = Array.isArray(setCookie) 
      ? setCookie[0].split(';')[0]
      : setCookie.split(';')[0];
  }
  return response;
});

let cookies = '';

const tests = {
  login: false,
  dashboard: false,
  listarUsuarios: false,
  criarUsuario: false,
  editarUsuario: false,
  getChecklist: false,
  updateChecklist: false,
  getProgresso: false,
  getAuditoria: false,
  getHistorico: false,
  dashboardProgresso: false,
};

async function runTests() {
  try {
    console.log('\n🧪 TESTE COMPLETO DE ENDPOINTS\n');
    console.log('═'.repeat(100));

    // 1. Login
    console.log('\n1️⃣  POST /login');
    try {
      const loginRes = await axiosInstance.post(`${BASE_URL}/login`, {
        email: 'admin@empresa.com',
        password: '123456'
      });
      
      tests.login = loginRes.status === 302;
      console.log(`   ${tests.login ? '✅' : '❌'} Status: ${loginRes.status}`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }

    // 2. Dashboard
    console.log('\n2️⃣  GET /dashboard');
    try {
      const dashRes = await axiosInstance.get(`${BASE_URL}/dashboard`);
      tests.dashboard = dashRes.status === 200;
      console.log(`   ${tests.dashboard ? '✅' : '❌'} Status: ${dashRes.status}`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }

    // 3. Listar usuários
    console.log('\n3️⃣  GET /dashboard/tablesUsers');
    try {
      const usersRes = await axiosInstance.get(`${BASE_URL}/dashboard/tablesUsers`);
      tests.listarUsuarios = usersRes.status === 200;
      console.log(`   ${tests.listarUsuarios ? '✅' : '❌'} Status: ${usersRes.status}`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }

    // 4. Criar usuário
    console.log('\n4️⃣  POST /dashboard/usuarios');
    try {
      const timestamp = Date.now();
      const createRes = await axiosInstance.post(`${BASE_URL}/dashboard/usuarios`, {
        nome: 'Teste Endpoint',
        email: `teste.endpoint.${timestamp}@teste.com`,
        telefone: '11999999999',
        endereco: 'Rua Teste Endpoint',
        obra: 'Obra Endpoint'
      });
      tests.criarUsuario = [200, 301, 302, 303, 307].includes(createRes.status);
      console.log(`   ${tests.criarUsuario ? '✅' : '❌'} Status: ${createRes.status}`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }

    // 5. Get checklist (último usuário criado)
    console.log('\n5️⃣  GET /dashboard/usuarios/34/checklist');
    try {
      const checkRes = await axiosInstance.get(`${BASE_URL}/dashboard/usuarios/34/checklist`);
      tests.getChecklist = checkRes.status === 200 && checkRes.data?.usuario_id;
      console.log(`   ${tests.getChecklist ? '✅' : '❌'} Status: ${checkRes.status}`);
      if (tests.getChecklist) {
        console.log(`      Checklist: ${JSON.stringify(checkRes.data).substring(0, 80)}...`);
      }
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }

    // 6. Update checklist (deve falhar pois está bloqueado)
    console.log('\n6️⃣  POST /dashboard/usuarios/34/checklist (bloqueado)');
    try {
      const updateRes = await axiosInstance.post(`${BASE_URL}/dashboard/usuarios/34/checklist`, {
        campo: 'uso_solo',
        valor: 'Feito'
      });
      // Agora deve retornar 403 (bloqueado) - isso é esperado
      tests.updateChecklist = updateRes.status === 403;
      console.log(`   ${tests.updateChecklist ? '✅' : '❌'} Status: ${updateRes.status} (bloqueado como esperado)`);
      if (updateRes.data?.error) console.log(`      Erro: ${updateRes.data.error}`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }

    // 7. Get progresso
    console.log('\n7️⃣  GET /dashboard/usuarios/34/progresso');
    try {
      const progRes = await axiosInstance.get(`${BASE_URL}/dashboard/usuarios/34/progresso`);
      tests.getProgresso = progRes.status === 200 && progRes.data?.progresso !== undefined;
      console.log(`   ${tests.getProgresso ? '✅' : '❌'} Status: ${progRes.status}`);
      if (tests.getProgresso) {
        console.log(`      Progresso: ${progRes.data.progresso}%`);
      }
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }

    // 8. Get auditoria
    console.log('\n8️⃣  GET /dashboard/usuarios/34/auditoria');
    try {
      const auditRes = await axiosInstance.get(`${BASE_URL}/dashboard/usuarios/34/auditoria`);
      tests.getAuditoria = auditRes.status === 200 && Array.isArray(auditRes.data);
      console.log(`   ${tests.getAuditoria ? '✅' : '❌'} Status: ${auditRes.status}`);
      if (tests.getAuditoria) {
        console.log(`      Total de logs: ${auditRes.data.length}`);
      }
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }

    // 9. Get histórico
    console.log('\n9️⃣  GET /dashboard/usuarios/34/historico');
    try {
      const histRes = await axiosInstance.get(`${BASE_URL}/dashboard/usuarios/34/historico`);
      tests.getHistorico = histRes.status === 200 && Array.isArray(histRes.data);
      console.log(`   ${tests.getHistorico ? '✅' : '❌'} Status: ${histRes.status}`);
      if (tests.getHistorico) {
        console.log(`      Total de registros: ${histRes.data.length}`);
      }
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }

    // 10. Dashboard de progresso
    console.log('\n🔟 GET /dashboard/progresso');
    try {
      const progDashRes = await axiosInstance.get(`${BASE_URL}/dashboard/progresso`);
      tests.dashboardProgresso = progDashRes.status === 200;
      console.log(`   ${tests.dashboardProgresso ? '✅' : '❌'} Status: ${progDashRes.status}`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }

    // Resumo
    console.log('\n' + '═'.repeat(100));
    console.log('\n📊 RESUMO DOS TESTES:');
    let passed = 0;
    for (const [test, result] of Object.entries(tests)) {
      console.log(`   ${result ? '✅' : '❌'} ${test}`);
      if (result) passed++;
    }
    console.log(`\n✅ Testes passados: ${passed}/${Object.keys(tests).length}`);
    
    if (passed === Object.keys(tests).length) {
      console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    } else {
      console.log(`\n⚠️  ${Object.keys(tests).length - passed} testes falharam`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

setTimeout(runTests, 1000);
