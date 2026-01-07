const http = require('http');

function makeRequest(method, path, data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TestBot/1.0',
      }
    };

    if (cookies) {
      options.headers['Cookie'] = cookies;
    }

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        const setCookie = res.headers['set-cookie'];
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body,
          setCookie: setCookie
        });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testEndpoints() {
  console.log('\n🧪 TESTE DE ENDPOINTS (SEM NAVEGADOR)\n');
  console.log('═'.repeat(100));

  let cookies = '';
  const results = {};

  try {
    // 1. GET /login page
    console.log('\n1️⃣  GET /login');
    let res = await makeRequest('GET', '/login');
    results.loginPage = { status: res.status, pass: res.status === 200 };
    console.log(`   ${results.loginPage.pass ? '✅' : '❌'} Status ${res.status}`);

    // 2. POST /login
    console.log('\n2️⃣  POST /login');
    res = await makeRequest('POST', '/login', {
      email: 'admin@empresa.com',
      password: '123456'
    });
    results.login = { status: res.status, pass: [200, 302].includes(res.status) };
    console.log(`   ${results.login.pass ? '✅' : '❌'} Status ${res.status}`);
    
    // Capturar cookies da sessão
    if (res.setCookie) {
      cookies = res.setCookie.join('; ');
      console.log(`   ✅ Cookies de sessão capturados`);
    }

    // 3. GET /dashboard (protegido)
    console.log('\n3️⃣  GET /dashboard');
    res = await makeRequest('GET', '/dashboard', null, cookies);
    results.dashboard = { status: res.status, pass: res.status === 200 };
    console.log(`   ${results.dashboard.pass ? '✅' : '❌'} Status ${res.status}`);

    // 4. GET /dashboard/tablesUsers
    console.log('\n4️⃣  GET /dashboard/tablesUsers');
    res = await makeRequest('GET', '/dashboard/tablesUsers', null, cookies);
    results.listUsuarios = { status: res.status, pass: res.status === 200 };
    console.log(`   ${results.listUsuarios.pass ? '✅' : '❌'} Status ${res.status}`);

    // 5. POST /dashboard/usuarios (criar)
    console.log('\n5️⃣  POST /dashboard/usuarios');
    res = await makeRequest('POST', '/dashboard/usuarios', {
      nome: 'Teste API',
      email: 'testeapi@teste.com',
      telefone: '11999999999',
      endereco: 'Rua Teste API',
      obra: 'Obra API'
    }, cookies);
    results.createUsuario = { status: res.status, pass: [200, 302].includes(res.status) };
    console.log(`   ${results.createUsuario.pass ? '✅' : '❌'} Status ${res.status}`);

    // 6. GET /dashboard/usuarios/1/checklist (JSON)
    console.log('\n6️⃣  GET /dashboard/usuarios/1/checklist');
    res = await makeRequest('GET', '/dashboard/usuarios/1/checklist', null, cookies);
    results.getChecklist = { status: res.status, pass: res.status === 200 };
    console.log(`   ${results.getChecklist.pass ? '✅' : '❌'} Status ${res.status}`);
    if (res.status === 200) {
      try {
        const data = JSON.parse(res.body);
        console.log(`   ✅ JSON válido: ${Object.keys(data).slice(0, 3).join(', ')}...`);
      } catch (e) {
        console.log(`   ❌ JSON inválido: ${res.body.substring(0, 50)}...`);
        results.getChecklist.pass = false;
      }
    }

    // 7. POST /dashboard/usuarios/1/checklist (update)
    console.log('\n7️⃣  POST /dashboard/usuarios/1/checklist');
    res = await makeRequest('POST', '/dashboard/usuarios/1/checklist', {
      campo: 'uso_solo',
      valor: 'Feito'
    }, cookies);
    results.updateChecklist = { status: res.status, pass: res.status === 200 };
    console.log(`   ${results.updateChecklist.pass ? '✅' : '❌'} Status ${res.status}`);
    if (res.status === 200) {
      try {
        const data = JSON.parse(res.body);
        console.log(`   ✅ Resposta: success=${data.success}, progresso=${data.progresso}%`);
      } catch (e) {
        console.log(`   ❌ Resposta inválida`);
        results.updateChecklist.pass = false;
      }
    }

    // 8. GET /dashboard/usuarios/1/progresso
    console.log('\n8️⃣  GET /dashboard/usuarios/1/progresso');
    res = await makeRequest('GET', '/dashboard/usuarios/1/progresso', null, cookies);
    results.getProgresso = { status: res.status, pass: res.status === 200 };
    console.log(`   ${results.getProgresso.pass ? '✅' : '❌'} Status ${res.status}`);
    if (res.status === 200) {
      try {
        const data = JSON.parse(res.body);
        console.log(`   ✅ Progresso: ${data.progresso}%`);
      } catch (e) {
        console.log(`   ❌ Resposta inválida`);
        results.getProgresso.pass = false;
      }
    }

    // 9. GET /dashboard/usuarios/1/auditoria
    console.log('\n9️⃣  GET /dashboard/usuarios/1/auditoria');
    res = await makeRequest('GET', '/dashboard/usuarios/1/auditoria', null, cookies);
    results.getAuditoria = { status: res.status, pass: res.status === 200 };
    console.log(`   ${results.getAuditoria.pass ? '✅' : '❌'} Status ${res.status}`);
    if (res.status === 200) {
      try {
        const data = JSON.parse(res.body);
        console.log(`   ✅ Registros: ${Array.isArray(data) ? data.length : '?'}`);
      } catch (e) {
        console.log(`   ❌ Resposta inválida`);
        results.getAuditoria.pass = false;
      }
    }

    // 10. GET /dashboard/usuarios/1/historico
    console.log('\n🔟 GET /dashboard/usuarios/1/historico');
    res = await makeRequest('GET', '/dashboard/usuarios/1/historico', null, cookies);
    results.getHistorico = { status: res.status, pass: res.status === 200 };
    console.log(`   ${results.getHistorico.pass ? '✅' : '❌'} Status ${res.status}`);
    if (res.status === 200) {
      try {
        const data = JSON.parse(res.body);
        console.log(`   ✅ Registros: ${Array.isArray(data) ? data.length : '?'}`);
      } catch (e) {
        console.log(`   ❌ Resposta inválida`);
        results.getHistorico.pass = false;
      }
    }

    // 11. GET /dashboard/progresso
    console.log('\n1️⃣1️⃣  GET /dashboard/progresso');
    res = await makeRequest('GET', '/dashboard/progresso', null, cookies);
    results.dashboardProgresso = { status: res.status, pass: res.status === 200 };
    console.log(`   ${results.dashboardProgresso.pass ? '✅' : '❌'} Status ${res.status}`);

    // Resumo
    console.log('\n' + '═'.repeat(100));
    console.log('\n📊 RESUMO:');
    
    let passed = 0;
    for (const [test, result] of Object.entries(results)) {
      console.log(`   ${result.pass ? '✅' : '❌'} ${test} (${result.status})`);
      if (result.pass) passed++;
    }

    console.log(`\n✅ Testes passados: ${passed}/${Object.keys(results).length}`);
    
    process.exit(passed === Object.keys(results).length ? 0 : 1);

  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

setTimeout(testEndpoints, 500);
