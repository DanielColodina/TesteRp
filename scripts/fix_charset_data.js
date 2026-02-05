/**
 * Script para corrigir dados com charset corrompido no banco de dados
 * Execute este script se os caracteres especiais estiverem aparecendo como "??"
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixCharset() {
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
    console.log('🔧 Corrigindo charset dos dados no banco...\n');

    // Função para detectar se uma string parece estar em Latin1 corrompido
    // (caracteres UTF-8 sendo interpretados como Latin1)
    function isProbablyCorrupted(str) {
      if (!str) return false;
      // Padrões comuns de corrupção: "??", "Ã§", "Ã£", etc.
      return str.includes('??') || 
             str.includes('Ã§') || 
             str.includes('Ã£') || 
             str.includes('Ã') ||
             /[^\x00-\x7F]/.test(str) && /[^\x80-\xFF]/.test(str);
    }

    // Função para corrigir Latin1 para UTF-8
    function latin1ToUtf8(str) {
      if (!str) return str;
      // Se a string já está em UTF-8正确, retorna como está
      // Se foi armazenada incorretamente como Latin1, converte
      const buf = Buffer.from(str, 'latin1');
      return buf.toString('utf8');
    }

    // Tabelas e campos a verificar
    const tables = [
      { name: 'usuarios', fields: ['nome', 'email', 'telefone', 'endereco', 'obra'] },
      { name: 'obras', fields: ['nome_obra', 'descricao'] },
      { name: 'checklist_usuarios', fields: ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria', 'observacoes'] },
      { name: 'historico', fields: ['tipo', 'descricao'] },
      { name: 'auditoria', fields: ['acao', 'campo', 'valor_anterior', 'valor_novo'] },
      { name: 'etapas_obra', fields: ['etapa_nome', 'descricao', 'status'] },
      { name: 'materiais', fields: ['nome', 'descricao', 'unidade', 'categoria', 'fornecedor_padrao'] },
      { name: 'materiais_obra', fields: ['fase_obra', 'categoria'] },
      { name: 'estoque_movimentacoes', fields: ['motivo'] },
      { name: 'centro_custo', fields: ['nome', 'descricao'] },
      { name: 'lancamento_custo', fields: ['descricao', 'tipo'] },
      { name: 'financeiro', fields: ['tipo', 'descricao'] },
      { name: 'mensagens', fields: ['de', 'para', 'mensagem'] },
      { name: 'funcionarios', fields: ['nome', 'funcao'] }
    ];

    let totalFixes = 0;

    for (const table of tables) {
      console.log(`📋 Verificando tabela: ${table.name}`);
      
      for (const field of table.fields) {
        try {
          // Buscar registros com possíveis problemas
          const [rows] = await pool.execute(
            `SELECT id, ${field} FROM ${table.name} WHERE ${field} IS NOT NULL`
          );

          for (const row of rows) {
            const original = row[field];
            if (isProbablyCorrupted(original)) {
              const fixed = latin1ToUtf8(original);
              
              // Atualizar apenas se a correção fez diferença
              if (fixed !== original) {
                await pool.execute(
                  `UPDATE ${table.name} SET ${field} = ? WHERE id = ?`,
                  [fixed, row.id]
                );
                console.log(`  ✅ Corrigido: ${table.name}.${field} ID ${row.id}`);
                console.log(`     "${original}" -> "${fixed}"`);
                totalFixes++;
              }
            }
          }
        } catch (err) {
          console.log(`  ⚠️ Erro ao verificar ${table.name}.${field}: ${err.message}`);
        }
      }
    }

    console.log(`\n✨ Total de correções realizadas: ${totalFixes}`);
    
    if (totalFixes === 0) {
      console.log('✅ Nenhum dado corrompido encontrado! O charset está correto.');
    } else {
      console.log('⚠️ Execute o diagnóstico novamente após reiniciar o servidor.');
    }

  } catch (err) {
    console.error('❌ Erro ao corrigir charset:', err.message);
  } finally {
    await pool.end();
  }
}

fixCharset();
