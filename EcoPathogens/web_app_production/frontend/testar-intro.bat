@echo off
echo.
echo ======================================
echo   🎬 EcoGuardians - Introducao Cinematografica
echo   UNION DESENVOLVIMENTO DE SOFTWARES
echo   ✨ USANDO SUAS 128+ IMAGENS REAIS! ✨
echo ======================================
echo.

echo 📁 Navegando para o diretorio correto...
cd /d "c:\projtos pessoais\NASA\EcoPathogens\web_app_production\frontend\public"

echo.
echo 🌐 Opcoes de teste:
echo.
echo [1] Abrir demo.html diretamente (Mais rapido - IMAGENS REAIS)
echo [2] Iniciar servidor Python local
echo [3] Abrir index.html completo
echo [4] Mostrar informacoes do projeto
echo [5] Ver lista completa das suas imagens
echo.

set /p choice="Escolha uma opcao (1-5): "

if "%choice%"=="1" (
    echo.
    echo 🎬 Abrindo demonstracao cinematografica com SUAS IMAGENS REAIS...
    start demo.html
    echo ✅ Demo aberto! Clique em "Iniciar Demonstracao"
    echo 📸 Agora usando: DERRETIMENTOCALOTASPOLARES*.jpg, DESMATAMENTOAWS*.jpg, QUEIMADAS*.jpg...
) else if "%choice%"=="2" (
    echo.
    echo 🐍 Iniciando servidor Python na porta 8000...
    echo 🌐 Acesse: http://localhost:8000
    echo 📝 Pressione Ctrl+C para parar o servidor
    echo 📸 Carregara suas imagens reais do diretorio assets/images/
    echo.
    python -m http.server 8000
) else if "%choice%"=="3" (
    echo.
    echo 🎬 Abrindo aplicacao completa com SUAS IMAGENS REAIS...
    start index.html
    echo ✅ Aplicacao aberta! A introducao inicia automaticamente
    echo 📸 Sistema detectara automaticamente suas 128+ imagens
) else if "%choice%"=="4" (
    echo.
    echo 📊 Informacoes do Projeto:
    echo ========================
    echo.
    echo 🎯 Projeto: EcoGuardians - NASA Space Apps 2025
    echo 🖼️  Imagens: 128+ REAIS do seu projeto
    echo ⏱️  Duracao: ~2-3 minutos completo
    echo 🛠️  Tech: GSAP Premium, JavaScript ES6+
    echo 📱 Mobile: Totalmente responsivo
    echo.
    echo 📂 Categorias de Imagens Reais:
    echo   🧊 Derretimento (18 imagens)
    echo   🌳 Desmatamento (12 imagens) 
    echo   🔥 Queimadas (11 imagens)
    echo   � Enchentes (10 imagens)
    echo   🦠 Epidemias/Virus (16 imagens)
    echo   🌪️ Tornados/Furacoes (11 imagens)
    echo   🌋 Vulcoes (5 imagens)
    echo   🏞️ Indigenas (10 imagens)
    echo   ⛏️ Garimpo (6 imagens)
    echo   😷 Sofrimento (7 imagens)
    echo   🌍 Planetas especiais (4 imagens)
    echo   + outras categorias...
    echo.
    echo �📁 Arquivos principais:
    echo   - demo.html          (Demo standalone)
    echo   - index.html         (Aplicacao completa)
    echo   - cinematic-intro.js (Codigo principal)
    echo   - local-test.js      (Controles de dev)
    echo.
    echo 🎮 Controles de desenvolvimento:
    echo   - Ctrl+Shift+I: Reiniciar intro
    echo   - Ctrl+Shift+S: Pular intro
    echo   - Ctrl+Shift+D: Stats das imagens
    echo.
    pause
    goto start
) else if "%choice%"=="5" (
    echo.
    echo 📋 Lista das Suas Imagens Reais:
    echo ================================
    echo.
    echo 🧊 DERRETIMENTO E CALOTAS POLARES:
    echo   - 5DERRETIMENTOCALOTASPOLARES14.jpg
    echo   - DERRETENDO.jpg
    echo   - DERRETIMENTOCALOTASPOLARES.jpg até DERRETIMENTOCALOTASPOLARES15.jpg
    echo.
    echo 🌳 DESMATAMENTO:
    echo   - DESMATAMENTOAWS.jpg até DESMATAMENTOAWS11.jpg
    echo.
    echo 🔥 QUEIMADAS:
    echo   - EMCHAMAS.jpg
    echo   - QUEIMADAS.jpg até QUEIMADAS9.jpg
    echo.
    echo 💧 ENCHENTES:
    echo   - ENCHENTES.jpg até ENCHENTES9.jpg
    echo.
    echo 🦠 EPIDEMIAS E VIRUS:
    echo   - EPIDEMIAS.jpg até EPIDEMIAS8.jpg
    echo   - EPIDEMIASAGRICOLA.jpg
    echo   - VIRUS.jpg até VIRUS5.jpg
    echo.
    echo 🌪️ TORNADOS E FURACOES:
    echo   - FURACAO-TORNADO.jpg, FURACAO.jpg, FURACAO1.jpg
    echo   - TORNADO.jpg até TORNADO7.jpg
    echo.
    echo 🌋 VULCOES:
    echo   - VULCAO.jpg até VULCAO4.jpg
    echo.
    echo 🏞️ INDIGENAS:
    echo   - INDIGINAS.jpg até INDIGINAS9.jpg
    echo.
    echo 🌍 PLANETAS ESPECIAIS (para queimar):
    echo   - PLANETA1.jpg, PLANETA2.jpg, PLANETA3.jpg
    echo.
    echo + Outras categorias: Garimpo, Sofrimento, Terremotos, Satelites, etc.
    echo.
    echo 🎬 Total: 128+ imagens organizadas por impacto ambiental!
    echo.
    pause
    goto start
) else (
    echo ❌ Opcao invalida! Tente novamente.
    pause
    goto start
)

:start
echo.
echo 🎉 Aproveite a demonstracao com suas imagens REAIS!
echo 📸 Todas as 128+ imagens do seu projeto serao exibidas!
echo.
pause
