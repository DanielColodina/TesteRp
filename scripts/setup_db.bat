@echo off
REM Script para criar as tabelas no banco MySQL (Windows)

setlocal enabledelayedexpansion

REM Configurar aqui
set MYSQL_USER=seu_usuario
set MYSQL_PASSWORD=sua_senha
set DB_NAME=rp_empreendimentos
set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe

echo 🔄 Executando script SQL para criar tabelas...

REM Verificar se MySQL existe
if not exist "%MYSQL_PATH%" (
  echo ❌ MySQL não encontrado em %MYSQL_PATH%
  echo Por favor, configure o MYSQL_PATH correto
  pause
  exit /b 1
)

REM Executar SQL
"%MYSQL_PATH%" -u "%MYSQL_USER%" -p"%MYSQL_PASSWORD%" "%DB_NAME%" < scripts\create_missing_tables.sql

if %ERRORLEVEL% equ 0 (
  echo ✅ Tabelas criadas com sucesso!
) else (
  echo ❌ Erro ao criar tabelas
  pause
  exit /b 1
)

pause
