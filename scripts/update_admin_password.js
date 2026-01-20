require('dotenv').config();

(async () => {
  try {
    const db = require('../src/database/connection');
    let bcrypt;
    try {
      bcrypt = require('bcrypt');
    } catch (e) {
      console.warn('bcrypt require failed, falling back to bcryptjs');
      bcrypt = require('bcryptjs');
    }

    const email = 'admin@empresa.com';
    const password = '123456';
    const saltRounds = 12;

    let hash;
    if (bcrypt.hashSync) {
      hash = bcrypt.hashSync(password, saltRounds);
    } else {
      hash = await bcrypt.hash(password, saltRounds);
    }

    await db.execute('UPDATE admins SET password = ? WHERE email = ?', [hash, email]);
    console.log('UPDATED_ADMIN:', { email, hashPreview: hash.slice(0, 30) });
    process.exit(0);
  } catch (err) {
    console.error('ERROR_UPDATE_ADMIN', err);
    process.exit(1);
  }
})();
