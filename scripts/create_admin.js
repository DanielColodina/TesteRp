(async () => {
  try {
    require('dotenv').config();
    console.log('DB Config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ? '***' : 'NO PASSWORD',
      database: process.env.DB_NAME
    });
    const db = require('../src/database/connection');
    let bcrypt;
    try {
      bcrypt = require('bcrypt');
    } catch (e) {
      console.warn('bcrypt require failed, falling back to bcryptjs', e);
      bcrypt = require('bcryptjs');
    }

    const nome = 'Administrador';
    const email = 'test@example.com';
    const password = 'teste123';
    const saltRounds = 10;

    let hash;
    if (bcrypt.hash) {
      // bcryptjs and bcrypt both support promise or sync hash differently
      if (bcrypt.hash.length === 2) {
        // bcryptjs hashSync signature detection fallback
        hash = bcrypt.hashSync(password, saltRounds);
      } else {
        hash = await bcrypt.hash(password, saltRounds);
      }
    } else {
      throw new Error('No hash function available on bcrypt');
    }

    await db.execute('INSERT INTO admins (nome, email, password) VALUES (?, ?, ?)', [nome, email, hash]);
    console.log('CREATED_ADMIN:', { email, hashPreview: hash.slice(0, 30) });
    process.exit(0);
  } catch (err) {
    console.error('ERROR_CREATE_ADMIN', err);
    process.exit(1);
  }
})();
