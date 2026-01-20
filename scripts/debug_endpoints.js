const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let cookies = '';

async function debugTests() {
  try {
    console.log('\n🔍 DEBUG DETALHADO DOS ENDPOINTS\n');
    console.log('═'.repeat(100));

    // Login
    console.log('\n1️⃣  DETALHES DO LOGIN:');
    const loginRes = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@empresa.com',
      password: '123456'
    }, { validateStatus: () => true, withCredentials: true, maxRedirects: 0 });
    
    console.log(`   Status: ${loginRes.status}`);
    console.log(`   Headers de Set-Cookie: ${loginRes.headers['set-cookie']?.length || 0} cookies`);
    cookies = loginRes.headers['set-cookie']?.join('; ') || '';
    
    if (loginRes.status === 200) {
      console.log(`   Resposta: ${loginRes.data?.substring(0, 100)}...`);
    }

    // Get Checklist
    console.log('\n2️⃣  DETALHES DO GET CHECKLIST:');
    const checkRes = await axios.get(`${BASE_URL}/dashboard/usuarios/1/checklist`, {
      validateStatus: () => true,
      headers: { 'Cookie': cookies }
    });
    
    console.log(`   Status: ${checkRes.status}`);
    console.log(`   Dados: ${JSON.stringify(checkRes.data)}`);

    // Update Checklist
    console.log('\n3️⃣  DETALHES DO UPDATE CHECKLIST:');
    const updateRes = await axios.post(`${BASE_URL}/dashboard/usuarios/1/checklist`, {
      campo: 'uso_solo',
      valor: 'Feito'
    }, {
      validateStatus: () => true,
      headers: { 'Cookie': cookies }
    });
    
    console.log(`   Status: ${updateRes.status}`);
    console.log(`   Content-Type: ${updateRes.headers['content-type']}`);
    console.log(`   Dados: ${JSON.stringify(updateRes.data)}`);

    // Get Progresso
    console.log('\n4️⃣  DETALHES DO GET PROGRESSO:');
    const progRes = await axios.get(`${BASE_URL}/dashboard/usuarios/1/progresso`, {
      validateStatus: () => true,
      headers: { 'Cookie': cookies }
    });
    
    console.log(`   Status: ${progRes.status}`);
    console.log(`   Dados: ${JSON.stringify(progRes.data)}`);

    // Get Auditoria
    console.log('\n5️⃣  DETALHES DO GET AUDITORIA:');
    const auditRes = await axios.get(`${BASE_URL}/dashboard/usuarios/1/auditoria`, {
      validateStatus: () => true,
      headers: { 'Cookie': cookies }
    });
    
    console.log(`   Status: ${auditRes.status}`);
    console.log(`   Dados: ${JSON.stringify(auditRes.data)}`);

    // Get Histórico
    console.log('\n6️⃣  DETALHES DO GET HISTÓRICO:');
    const histRes = await axios.get(`${BASE_URL}/dashboard/usuarios/1/historico`, {
      validateStatus: () => true,
      headers: { 'Cookie': cookies }
    });
    
    console.log(`   Status: ${histRes.status}`);
    console.log(`   Dados: ${JSON.stringify(histRes.data)}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

setTimeout(debugTests, 1000);
