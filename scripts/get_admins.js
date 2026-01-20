require('dotenv').config();

(async () => {
  try {
    const db = require('../src/database/connection');
    const [rows] = await db.execute('SELECT id, email, password FROM admins LIMIT 10');
    console.log('ADMINS_ROWS:', JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('ERROR_GET_ADMINS', err);
    process.exit(1);
  }
})();
