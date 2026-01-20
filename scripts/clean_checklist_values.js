require('dotenv').config();
const mysql = require('mysql2/promise');

async function cleanChecklistValues() {
    let connection;

    try {
        console.log('🧹 Limpando valores inválidos da tabela checklist_usuarios...');

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        // Primeiro, vamos ver quais valores existem
        const [rows] = await connection.execute('SELECT * FROM checklist_usuarios');
        console.log('📊 Valores atuais encontrados:', rows);

        // Limpar valores inválidos - definir como 'pendente' para valores não válidos
        await connection.execute(`
            UPDATE checklist_usuarios
            SET
                uso_solo = CASE
                    WHEN uso_solo NOT IN ('pendente', 'em_andamento', 'completo') THEN 'pendente'
                    ELSE uso_solo
                END,
                licenca = CASE
                    WHEN licenca NOT IN ('pendente', 'em_andamento', 'completo') THEN 'pendente'
                    ELSE licenca
                END,
                vistoria = CASE
                    WHEN vistoria NOT IN ('pendente', 'em_andamento', 'completo') THEN 'pendente'
                    ELSE vistoria
                END
        `);

        console.log('✅ Valores inválidos limpos com sucesso!');

        // Verificar resultado
        const [cleanRows] = await connection.execute('SELECT * FROM checklist_usuarios');
        console.log('📊 Valores após limpeza:', cleanRows);

    } catch (error) {
        console.error('❌ Erro durante limpeza:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

cleanChecklistValues();