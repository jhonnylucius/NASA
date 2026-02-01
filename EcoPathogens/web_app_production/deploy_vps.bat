@echo off
echo ==========================================
echo    Deploy EcoGuardians para VPS
echo ==========================================
echo.
echo 1. Gerando o arquivo JAR...
cd backend
call mvn clean package -DskipTests


if %errorlevel% neq 0 (
    echo [ERRO] Falha ao compilar o projeto.
    pause
    exit /b
)

echo.
echo 2. Enviando para o Servidor (83.147.37.100)...
echo    ATENCAO: Digite a senha B!*****D29 quando pedido.
echo.

scp -P 22 target/backend-0.0.1-SNAPSHOT.jar administrator@83.147.37.100:/home/administrator/ecoguardians-backend.jar

echo.
echo 3. Fim do Upload!
echo    Agora acesse o servidor e rode:
echo    ssh -p 22 administrator@83.147.37.100
echo    nohup java -jar ecoguardians-backend.jar ^> log.txt 2^>^&1 ^&
echo.
pause
