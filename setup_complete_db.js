// Carregar variáveis de ambiente PRIMEIRO
require('dotenv').config();

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Pool de conexão para Aiven
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

const setupDatabase = async () => {
  const conn = await pool.getConnection();
  try {
    console.log('🔧 Recriando banco de dados com TODAS as tabelas...\n');
    console.log('📊 Conectando em:');
    console.log(`   HOST: ${process.env.DB_HOST}`);
    console.log(`   PORT: ${process.env.DB_PORT}`);
    console.log(`   USER: ${process.env.DB_USER}`);
    console.log(`   DB: ${process.env.DB_NAME}\n`);

    // ============ DROPANDO TABELAS (em ordem reversa de dependências) ============
    const dropQueries = [
      'DROP TABLE IF EXISTS auditoria',
      'DROP TABLE IF EXISTS historico',
      'DROP TABLE IF EXISTS checklist_usuarios',
      'DROP TABLE IF EXISTS estoque_movimentacoes',
      'DROP TABLE IF EXISTS materiais_obra',
      'DROP TABLE IF EXISTS materiais',
      'DROP TABLE IF EXISTS etapas_obra',
      'DROP TABLE IF EXISTS obras',
      'DROP TABLE IF EXISTS usuarios',
      'DROP TABLE IF EXISTS pagamento',
      'DROP TABLE IF EXISTS lancamento_custo',
      'DROP TABLE IF EXISTS centro_custo',
      'DROP TABLE IF EXISTS obra_financeiro',
      'DROP TABLE IF EXISTS usuario_financeiro',
      'DROP TABLE IF EXISTS mensagens',
      'DROP TABLE IF EXISTS financeiro',
      'DROP TABLE IF EXISTS funcionarios',
      'DROP TABLE IF EXISTS materiais_construtora',
      'DROP TABLE IF EXISTS obras_construtora',
      'DROP TABLE IF EXISTS relatorios',
      'DROP TABLE IF EXISTS admins'
    ];

    console.log('🗑️ Removendo tabelas antigas...');
    for (const query of dropQueries) {
      try {
        await conn.execute(query);
      } catch (err) {
        if (err.code !== 'ER_BAD_TABLE_ERROR') {
          console.error(`❌ Erro ao dropar tabela: ${query}`, err.message);
        }
      }
    }
    console.log('✅ Tabelas antigas removidas\n');

    // ============ CRIANDO TABELAS ============
    console.log('📝 Criando novas tabelas...\n');

    // 1. ADMINS
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(150),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela admins criada');

    // 2. USUARIOS
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        endereco VARCHAR(255),
        obra VARCHAR(150),
        admin_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_obra (obra),
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela usuarios criada');

    // 3. CHECKLIST_USUARIOS
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS checklist_usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL UNIQUE,
        uso_solo VARCHAR(50) DEFAULT 'Nao Tem',
        licenca VARCHAR(50) DEFAULT 'Nao Tem',
        condominio VARCHAR(50) DEFAULT 'Nao Tem',
        habite_se VARCHAR(50) DEFAULT 'Nao Tem',
        averbacao VARCHAR(50) DEFAULT 'Nao Tem',
        vistoria VARCHAR(50) DEFAULT 'Nao Tem',
        observacoes LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_usuario (usuario_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela checklist_usuarios criada');

    // 4. HISTORICO
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS historico (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        tipo VARCHAR(50),
        descricao TEXT,
        admin_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_usuario (usuario_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela historico criada');

    // 5. AUDITORIA
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS auditoria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT,
        usuario_id INT,
        acao VARCHAR(100),
        campo VARCHAR(50),
        valor_anterior TEXT,
        valor_novo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_admin (admin_id),
        INDEX idx_usuario (usuario_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela auditoria criada');

    // 6. OBRAS
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS obras (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        nome_obra VARCHAR(150),
        descricao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_usuario (usuario_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela obras criada');

    // 7. ETAPAS_OBRA
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS etapas_obra (
        id INT AUTO_INCREMENT PRIMARY KEY,
        obra_id INT,
        etapa_nome VARCHAR(100),
        descricao TEXT,
        status VARCHAR(50),
        data_inicio DATE,
        data_termino DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_obra (obra_id),
        FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela etapas_obra criada');

    // 8. MATERIAIS
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS materiais (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        descricao TEXT,
        unidade VARCHAR(20),
        categoria VARCHAR(100),
        preco_unitario DECIMAL(10,2),
        estoque_minimo DECIMAL(10,2),
        fornecedor_padrao VARCHAR(150),
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_nome (nome)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela materiais criada');

    // 9. MATERIAIS_OBRA
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS materiais_obra (
        id INT AUTO_INCREMENT PRIMARY KEY,
        obra_id INT,
        material_id INT,
        quantidade_estimada DECIMAL(10,2),
        quantidade_inicial DECIMAL(10,2),
        saldo_atual DECIMAL(10,2),
        fase_obra VARCHAR(100),
        categoria VARCHAR(100),
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_obra (obra_id),
        FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE,
        FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela materiais_obra criada');

    // 10. ESTOQUE_MOVIMENTACOES
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS estoque_movimentacoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        material_id INT,
        tipo VARCHAR(20),
        quantidade DECIMAL(10,2),
        obra_id INT,
        motivo VARCHAR(255),
        admin_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_material (material_id),
        FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE,
        FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela estoque_movimentacoes criada');

    // 11. USUARIO_FINANCEIRO
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS usuario_financeiro (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela usuario_financeiro criada');

    // 12. OBRA_FINANCEIRO
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS obra_financeiro (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        nome_cliente VARCHAR(150),
        endereco VARCHAR(255),
        nome_obra VARCHAR(150),
        valor_total DECIMAL(15,2),
        data_inicio DATE,
        data_finalizacao DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela obra_financeiro criada');

    // 13. CENTRO_CUSTO
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS centro_custo (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        obra_id BIGINT,
        nome VARCHAR(150),
        descricao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela centro_custo criada');

    // 14. LANCAMENTO_CUSTO
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS lancamento_custo (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        centro_custo_id BIGINT,
        descricao TEXT,
        valor DECIMAL(15,2),
        data DATE,
        tipo VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (centro_custo_id) REFERENCES centro_custo(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela lancamento_custo criada');

    // 15. PAGAMENTO
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS pagamento (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        lancamento_custo_id BIGINT,
        valor DECIMAL(15,2),
        data_pagamento DATE,
        metodo_pagamento VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lancamento_custo_id) REFERENCES lancamento_custo(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela pagamento criada');

    // 16. OBRAS_CONSTRUTORA
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS obras_construtora (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        nome TEXT,
        endereco TEXT,
        cliente TEXT,
        orcamento REAL,
        data_inicio TEXT,
        data_fim TEXT,
        status TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela obras_construtora criada');

    // 17. MATERIAIS_CONSTRUTORA
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS materiais_construtora (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        codigo TEXT,
        descricao TEXT,
        unidade TEXT,
        quantidade REAL,
        preco_medio REAL,
        estoque_minimo REAL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela materiais_construtora criada');

    // 18. FUNCIONARIOS
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS funcionarios (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        nome TEXT,
        funcao TEXT,
        salario REAL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela funcionarios criada');

    // 19. FINANCEIRO
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS financeiro (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        tipo TEXT,
        descricao TEXT,
        valor REAL,
        data TEXT,
        obra_id INTEGER
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela financeiro criada');

    // 20. MENSAGENS
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS mensagens (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        de TEXT,
        para TEXT,
        mensagem TEXT,
        data TEXT,
        obra_id INTEGER
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela mensagens criada');

    // 21. RELATORIOS
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS relatorios (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        titulo TEXT,
        descricao TEXT,
        tipo TEXT,
        data TEXT,
        obra_id INTEGER
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela relatorios criada');

    console.log('\n✅ TODAS AS TABELAS CRIADAS COM SUCESSO!\n');

    // Criar admin padrão
    console.log('👤 Criando admin padrão...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    try {
      await conn.execute(
        'INSERT INTO admins (nome, email, password) VALUES (?, ?, ?)',
        ['Admin Sistema', 'admin@rp.com', adminPassword]
      );
      console.log('✅ Admin criado: admin@rp.com / admin123');
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('⚠️  Admin já existe');
      } else {
        throw err;
      }
    }

    console.log('\n✅ Banco de dados configurado completamente!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao configurar banco:', err.message);
    console.error('\n', err);
    process.exit(1);
  } finally {
    await conn.release();
    await pool.end();
  }
};

setupDatabase();
