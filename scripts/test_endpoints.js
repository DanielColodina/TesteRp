const http = require('http');

function makeRequest(method, path, postData = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': ''
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function test() {
  console.log('🧪 Testando endpoints...\n');

  try {
    // 1. GET /login
    console.log('1️⃣ GET /login');
    const loginResp = await makeRequest('GET', '/login');
    console.log(`   Status: ${loginResp.statusCode}`);
    console.log(`   Tem "Login": ${loginResp.body.includes('Login') ? '✅' : '❌'}`);

    // 2. POST /login
    console.log('\n2️⃣ POST /login (admin@empresa.com / 123456)');
    const loginPostResp = await makeRequest('POST', '/login', 'email=admin@empresa.com&password=123456');
    console.log(`   Status: ${loginPostResp.statusCode}`);
    const cookie = loginPostResp.headers['set-cookie'];
    console.log(`   Cookie: ${cookie ? '✅' : '❌'}`);

    // 3. GET /dashboard (sem session)
    console.log('\n3️⃣ GET /dashboard (sem session)');
    const dashResp = await makeRequest('GET', '/dashboard');
    console.log(`   Status: ${dashResp.statusCode}`);
    console.log(`   Redirecionado para /login: ${dashResp.statusCode === 302 || dashResp.body.includes('Logingggg') ? 'Sim ✅' : 'Não ❌'}`);

    // 4. GET /
    console.log('\n4️⃣ GET / (raiz)');
    const rootResp = await makeRequest('GET', '/');
    console.log(`   Status: ${rootResp.statusCode}`);
    console.log(`   Resposta: ${rootResp.statusCode === 302 ? 'Redirect ✅' : 'Erro'}`);

    // 5. GET /notfound
    console.log('\n5️⃣ GET /notfound (página que não existe)');
    const notfoundResp = await makeRequest('GET', '/notfound');
    console.log(`   Status: ${notfoundResp.statusCode}`);
    console.log(`   Mensagem: ${notfoundResp.body.substring(0, 100)}...`);

    console.log('\n✅ Testes concluídos!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

test();
