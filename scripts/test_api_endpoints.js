const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let cookieJar = null;

async function test() {
  try {
    console.log('🧪 TESTANDO ENDPOINTS...\n');

    // 1. Teste Login
    console.log('1️⃣  Testando LOGIN...');
    let loginRes = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@empresa.com',
      password: '123456'
    }, {
      validateStatus: () => true,
      withCredentials: true
    });
    console.log(`   Status: ${loginRes.status}`);
    console.log(`   Redirect: ${loginRes.data?.includes('dashboard') ? '✅ Para dashboard' : '❌'}`);
    cookieJar = loginRes.headers['set-cookie']?.join('; ') || '';
    
    // 2. Teste Dashboard
    console.log('\n2️⃣  Testando DASHBOARD...');
    let dashRes = await axios.get(`${BASE_URL}/dashboard`, {
      validateStatus: () => true,
      withCredentials: true,
      headers: { 'Cookie': cookieJar }
    });
    console.log(`   Status: ${dashRes.status}`);
    console.log(`   Conteúdo: ${dashRes.data?.includes('usuários') || dashRes.data?.includes('usuarios') ? '✅ Usuários encontrados' : '❌'}`);

    // 3. Teste Get Usuário
    console.log('\n3️⃣  Testando GET usuário (ID 1)...');
    let userRes = await axios.get(`${BASE_URL}/dashboard/usuario/1`, {
      validateStatus: () => true,
      headers: { 'Cookie': cookieJar }
    });
    console.log(`   Status: ${userRes.status}`);
    if (userRes.status === 200) {
      console.log(`   ✅ Usuário carregado: ${userRes.data?.nome}`);
    }

    // 4. Teste Get Checklist
    console.log('\n4️⃣  Testando GET checklist (usuário 1)...');
    let checkRes = await axios.get(`${BASE_URL}/dashboard/usuarios/1/checklist`, {
      validateStatus: () => true,
      headers: { 'Cookie': cookieJar }
    });
    console.log(`   Status: ${checkRes.status}`);
    if (checkRes.status === 200) {
      console.log(`   ✅ Checklist carregado`);
      console.log(`   Dados: ${JSON.stringify(checkRes.data).substring(0, 100)}...`);
    }

    // 5. Teste Update Checklist
    console.log('\n5️⃣  Testando UPDATE checklist...');
    let updateRes = await axios.post(`${BASE_URL}/dashboard/usuarios/1/checklist`, {
      uso_solo: 'Feito',
      licenca: 'Andamento',
      condominio: 'Finalizado',
      habite_se: 'Proxima-Etapa',
      averbacao: 'Nao Tem',
      vistoria: 'Feito'
    }, {
      validateStatus: () => true,
      headers: { 'Cookie': cookieJar }
    });
    console.log(`   Status: ${updateRes.status}`);
    console.log(`   Resposta: ${updateRes.status === 200 ? '✅ Atualizado' : '❌ Erro'}`);
    if (updateRes.data?.success === false) {
      console.log(`   Erro: ${updateRes.data?.error}`);
    }

    console.log('\n✅ TESTES COMPLETADOS!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

// Aguarda servidor estar pronto
setTimeout(test, 2000);
