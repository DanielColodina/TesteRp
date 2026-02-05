/**
 * Script para diagnosticar problemas de charset no banco de dados
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function diagnose() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'rp_empreendimentos',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci'
  });

  try {
    console.log('🔍 Diagnosticando charset do banco de dados...\n');

    // Verificar charset da conexão
    const [connCharset] = await pool.execute('SELECT @@character_set_connection as cs');
    console.log(`✅ Charset da conexão: ${connCharset[0].cs}`);

    // Verificar charset do banco
    const [dbCharset] = await pool.execute('SELECT @@character_set_database as cs');
    console.log(`✅ Charset do banco: ${dbCharset[0].cs}`);

    // Verificar dados na tabela usuarios
    const [usuarios] = await pool.execute('SELECT id, nome, obra, endereco FROM usuarios LIMIT 5');
    
    console.log('\n📋 Verificando dados dos usuários:');
    usuarios.forEach((u, i) => {
      console.log(`\nUsuário ${i + 1}:`);
      console.log(`  Nome: "${u.nome}" (bytes: ${Buffer.from(u.nome || '').length})`);
      console.log(`  Obra: "${u.obra}" (bytes: ${Buffer.from(u.obra || '').length})`);
      console.log(`  Endereço: "${u.endereco}" (bytes: ${Buffer.from(u.endereco || '').length})`);
      
      // Verificar se há caracteres UTF-8 válidos
      const nomeBytes = Buffer.from(u.nome || '');
      console.log(`  Nome bytes hex: ${nomeBytes.toString('hex').slice(0, 40)}...`);
    });

    // Testar se caracteres especiais funcionam
    console.log('\n🧪 Testando inserção de caracteres especiais...');
    const testString = 'Teste çãõáéíóú ÇÃÕÁÉÍÓÚ';
    console.log(`String original: "${testString}"`);
    console.log(`String bytes hex: ${Buffer.from(testString).toString('hex')}`);
    
    // Inserir teste (se não existir)
    await pool.execute(`
      INSERT INTO usuarios (nome, email, telefone, endereco, obra, admin_id)
      VALUES (?, ?, '12345678900', 'Teste Endereço', 'Teste Obra', 1)
      ON DUPLICATE KEY UPDATE nome = VALUES(nome)
    `, [testString, 'test_charset@test.com']);
    
    // Ler de volta
    const [testResult] = await pool.execute(
      'SELECT nome FROM usuarios WHERE email = ?',
      ['test_charset@test.com']
    );
    
    if (testResult.length > 0) {
      const readBack = testResult[0].nome;
      console.log(`String lida de volta: "${readBack}"`);
      console.log(`✅ Comparação: ${readBack === testString ? 'OK - Caracteres especiais funcionando!' : 'FALHA - Caracteres especiais não funcionaram!'}`);
    }

    console.log('\n✨ Diagnóstico concluído!');
    
  } catch (err) {
    console.error('❌ Erro no diagnóstico:', err.message);
  } finally {
    await pool.end();
  }
}

diagnose();
