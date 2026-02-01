@echo off
echo ==========================================
echo    Iniciando EcoGuardians Java Backend
echo ==========================================
echo.
echo 1. Verificando instalacao do Java...
java -version
if %errorlevel% neq 0 (
    echo [ERRO] Java nao encontrado! Por favor instale o Java 17+.
    pause
    exit /b
)

echo.
echo 2. Iniciando Servidor Spring Boot...
echo    - Conectando ao Banco: postgresql-194952-0.cloudclusters.net
echo    - Porta Local: 8081
echo.

cd backend
call mvn spring-boot:run


if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao iniciar o backend. Verifique os erros acima.
    pause
)
