(async () => {
  try {
    const fetch = global.fetch || (await import('node-fetch')).default;
    const params = new URLSearchParams();
    params.append('email', 'admin@empresa.com');
    params.append('password', '123456');

    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const text = await res.text();
    console.log('RESPONSE_STATUS:', res.status);
    console.log('RESPONSE_BODY:\n', text);
    process.exit(0);
  } catch (err) {
    console.error('ERROR_TEST_LOGIN', err);
    process.exit(1);
  }
})();
