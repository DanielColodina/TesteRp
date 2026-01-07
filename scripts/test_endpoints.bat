@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo TESTE DE ENDPOINTS COM CURL
echo ========================================
echo.

REM Arquivo para armazenar cookies
set COOKIE_JAR="%TEMP%\cookies.txt"

echo [1/11] Testando GET /login...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:3000/login

echo [2/11] Testando POST /login...
curl -s -c %COOKIE_JAR% -X POST http://localhost:3000/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@empresa.com\",\"password\":\"123456\"}" ^
  -w "Status: %%{http_code}\n"

echo [3/11] Testando GET /dashboard...
curl -s -b %COOKIE_JAR% -o nul -w "Status: %%{http_code}\n" http://localhost:3000/dashboard

echo [4/11] Testando GET /dashboard/tablesUsers...
curl -s -b %COOKIE_JAR% -o nul -w "Status: %%{http_code}\n" http://localhost:3000/dashboard/tablesUsers

echo [5/11] Testando GET /dashboard/usuarios/1/checklist...
curl -s -b %COOKIE_JAR% -o nul -w "Status: %%{http_code}\n" http://localhost:3000/dashboard/usuarios/1/checklist

echo [6/11] Testando POST /dashboard/usuarios/1/checklist...
curl -s -b %COOKIE_JAR% -X POST http://localhost:3000/dashboard/usuarios/1/checklist ^
  -H "Content-Type: application/json" ^
  -d "{\"campo\":\"uso_solo\",\"valor\":\"Feito\"}" ^
  -w "Status: %%{http_code}\n"

echo [7/11] Testando GET /dashboard/usuarios/1/progresso...
curl -s -b %COOKIE_JAR% -o nul -w "Status: %%{http_code}\n" http://localhost:3000/dashboard/usuarios/1/progresso

echo [8/11] Testando GET /dashboard/usuarios/1/auditoria...
curl -s -b %COOKIE_JAR% -o nul -w "Status: %%{http_code}\n" http://localhost:3000/dashboard/usuarios/1/auditoria

echo [9/11] Testando GET /dashboard/usuarios/1/historico...
curl -s -b %COOKIE_JAR% -o nul -w "Status: %%{http_code}\n" http://localhost:3000/dashboard/usuarios/1/historico

echo [10/11] Testando GET /dashboard/progresso...
curl -s -b %COOKIE_JAR% -o nul -w "Status: %%{http_code}\n" http://localhost:3000/dashboard/progresso

echo.
echo ========================================
echo TESTE CONCLUÍDO
echo ========================================
echo.

pause
