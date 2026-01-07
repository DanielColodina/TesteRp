#!/bin/bash
# Script para criar as tabelas no banco MySQL (Linux/Mac)

MYSQL_USER="seu_usuario"
MYSQL_PASSWORD="sua_senha"
DB_NAME="rp_empreendimentos"

echo "🔄 Executando script SQL para criar tabelas..."
mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$DB_NAME" < scripts/create_missing_tables.sql

if [ $? -eq 0 ]; then
  echo "✅ Tabelas criadas com sucesso!"
else
  echo "❌ Erro ao criar tabelas"
  exit 1
fi
