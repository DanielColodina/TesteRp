const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'rp_empreendimentos',
});

const inserts = [
  ["INSERT IGNORE INTO usuarios (nome, email, telefone, endereco, obra, admin_id) VALUES (?, ?, ?, ?, ?, ?)", 
   ['Daniel', 'admin@empresa.com', '11999999999', 'Rua A, 100', 'Obra A', 1]],
  
  ["INSERT IGNORE INTO usuarios (nome, email, telefone, endereco, obra, admin_id) VALUES (?, ?, ?, ?, ?, ?)", 
   ['Daniel Test', 'teste@teste.com', '11888888888', 'Rua B, 200', 'Obra B', 1]],
  
  ["INSERT IGNORE INTO usuarios (nome, email, telefone, endereco, obra, admin_id) VALUES (?, ?, ?, ?, ?, ?)", 
   ['Arroz Silva', 'silvasktnj@gmail.com', '11777777777', 'Rua C, 300', 'Obra C', 1]],
  
  ["INSERT IGNORE INTO usuarios (nome, email, telefone, endereco, obra, admin_id) VALUES (?, ?, ?, ?, ?, ?)", 
   ['Daniel Assunção', 'danielassuncao1129@gmail.com', '11666666666', 'Rua D, 400', 'Obra D', 1]],
  
  ["INSERT IGNORE INTO usuarios (nome, email, telefone, endereco, obra, admin_id) VALUES (?, ?, ?, ?, ?, ?)", 
   ['MARIA ANTONIA SANTOS OLIVEIRA', 'teste2@teste.com', '11555555555', 'Rua E, 500', 'Obra E', 1]],

  ["INSERT IGNORE INTO checklist_usuarios (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria) VALUES (?, ?, ?, ?, ?, ?, ?)",
   [1, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem']],

  ["INSERT IGNORE INTO checklist_usuarios (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria) VALUES (?, ?, ?, ?, ?, ?, ?)",
   [2, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem']],

  ["INSERT IGNORE INTO checklist_usuarios (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria) VALUES (?, ?, ?, ?, ?, ?, ?)",
   [3, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem']],

  ["INSERT IGNORE INTO checklist_usuarios (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria) VALUES (?, ?, ?, ?, ?, ?, ?)",
   [4, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem']],

  ["INSERT IGNORE INTO checklist_usuarios (usuario_id, uso_solo, licenca, condominio, habite_se, averbacao, vistoria) VALUES (?, ?, ?, ?, ?, ?, ?)",
   [5, 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem', 'Nao Tem']],
];

async function insertData() {
  const conn = await connection.getConnection();
  try {
    console.log('📝 Inserindo dados de teste...\n');

    for (const [sql, params] of inserts) {
      try {
        await conn.execute(sql, params);
        console.log(`✅ Inserido: ${params[0] || params[1]}`);
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          console.error(`❌ Erro: ${err.message}`);
        }
      }
    }

    // Verificar dados
    console.log('\n📊 Dados finais:');
    const [usuarios] = await conn.execute('SELECT COUNT(*) as count FROM usuarios');
    const [checklist] = await conn.execute('SELECT COUNT(*) as count FROM checklist_usuarios');
    
    console.log(`  ✅ Usuários: ${usuarios[0].count}`);
    console.log(`  ✅ Checklists: ${checklist[0].count}`);
    console.log('\n✅ Dados inseridos com sucesso!');

  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    conn.release();
    await connection.end();
  }
}

insertData();
