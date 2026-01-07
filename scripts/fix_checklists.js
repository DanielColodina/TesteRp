require('dotenv').config();
const db = require('../src/database/connection');
const Checklist = require('../src/models/Checklist');

async function fixChecklists() {
  try {
    console.log('🔧 Corrigindo checklists faltantes...\n');

    // Buscar todos os usuários
    const [usuarios] = await db.execute('SELECT id, nome FROM usuarios ORDER BY id');

    console.log(`📋 Encontrados ${usuarios.length} usuários:\n`);

    for (const usuario of usuarios) {
      // Usar o método do model que é mais seguro
      const success = await Checklist.createIfNotExists(usuario.id);

      if (success) {
        console.log(`✅ Checklist criado/verificado para ${usuario.nome} (ID: ${usuario.id})`);
      } else {
        console.log(`ℹ️  Problema ao verificar checklist para ${usuario.nome} (ID: ${usuario.id})`);
      }
    }

    // Verificar resultado final
    const [totalChecklists] = await db.execute('SELECT COUNT(*) as total FROM checklist_usuarios');
    console.log(`\n📊 Total de checklists: ${totalChecklists[0].total}`);

    console.log('\n✅ Correção concluída!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

fixChecklists();