# EcoGuardians - Script Simples e Funcional
# NASA Space Apps Challenge 2025

Write-Host "=====================================" -ForegroundColor Green
Write-Host "  EcoGuardians - Sistema GSAP Premium" -ForegroundColor Green  
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Parar jobs existentes primeiro
Write-Host "[LIMPEZA] Removendo jobs antigos..." -ForegroundColor Yellow
Stop-Job * -ErrorAction SilentlyContinue
Remove-Job * -ErrorAction SilentlyContinue

# Navegar para o diretório
$ProjectPath = "C:\projtos pessoais\NASA\EcoPathogens\web_app_production"
Set-Location $ProjectPath

Write-Host "[INFO] Diretorio: $ProjectPath" -ForegroundColor Cyan

# 1. VERIFICAR DEPENDÊNCIAS
Write-Host ""
Write-Host "[VERIFICACAO] Checando dependencias..." -ForegroundColor Cyan

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] Node.js nao encontrado!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Node.js encontrado" -ForegroundColor Green

if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] Python nao encontrado!" -ForegroundColor Red  
    exit 1
}
Write-Host "[OK] Python encontrado" -ForegroundColor Green

# 2. VERIFICAR PLUGINS GSAP
Write-Host ""
Write-Host "[VERIFICACAO] Checando plugins GSAP..." -ForegroundColor Cyan

$GSAPPath = "frontend\public\assets\js\gsap"
if (Test-Path $GSAPPath) {
    $PluginsCount = (Get-ChildItem -Path $GSAPPath -Filter "*.js").Count
    Write-Host "[OK] $PluginsCount plugins GSAP encontrados!" -ForegroundColor Green
    
    # Contar plugins premium
    $PremiumPlugins = @("MorphSVG", "DrawSVG", "SplitText", "ScrollSmoother", "Physics2D", "Draggable", "Flip", "CustomEase")
    $PremiumCount = 0
    foreach ($plugin in $PremiumPlugins) {
        if (Get-ChildItem -Path $GSAPPath -Filter "*$plugin*" -ErrorAction SilentlyContinue) {
            $PremiumCount++
        }
    }
    Write-Host "[PREMIUM] $PremiumCount plugins premium detectados!" -ForegroundColor Magenta
} else {
    Write-Host "[AVISO] Pasta GSAP nao encontrada" -ForegroundColor Yellow
}

# 3. CONFIGURAR FRONTEND SIMPLES
Write-Host ""
Write-Host "[SETUP] Preparando frontend..." -ForegroundColor Cyan

Set-Location "frontend"

# Criar pasta dev se não existir
if (!(Test-Path "dev")) {
    New-Item -ItemType Directory -Name "dev" -Force | Out-Null
}

# Copiar arquivos
Copy-Item -Path "public\*" -Destination "dev" -Recurse -Force

# Criar arquivo de config
$ConfigJS = @"
// EcoGuardians Config
window.EcoConfig = {
    API_BASE_URL: 'http://localhost:5000',
    ENVIRONMENT: 'development',
    FEATURES: {
        GSAP_PREMIUM: true,
        DEBUG_MODE: true
    }
};
console.log('EcoGuardians configurado!');
"@

$ConfigJS | Out-File -FilePath "dev\config.js" -Encoding UTF8

Write-Host "[OK] Frontend preparado" -ForegroundColor Green

# 4. INSTALAR LIVE-SERVER SE NECESSÁRIO
Write-Host ""
Write-Host "[SETUP] Verificando live-server..." -ForegroundColor Cyan

if (!(Get-Command live-server -ErrorAction SilentlyContinue)) {
    Write-Host "[INSTALL] Instalando live-server..." -ForegroundColor Yellow
    npm install -g live-server
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Falha ao instalar live-server" -ForegroundColor Red
        exit 1
    }
}
Write-Host "[OK] live-server disponivel" -ForegroundColor Green

# 5. CONFIGURAR API PYTHON
Write-Host ""
Write-Host "[SETUP] Configurando API Python..." -ForegroundColor Cyan

Set-Location "..\python_ml_api"

# Criar venv se não existir
if (!(Test-Path "venv")) {
    Write-Host "[INSTALL] Criando ambiente virtual..." -ForegroundColor Yellow
    python -m venv venv
}

# Ativar venv
& .\venv\Scripts\Activate.ps1

# Instalar dependências se requirements.txt existir
if (Test-Path "requirements.txt") {
    Write-Host "[INSTALL] Instalando dependencias Python..." -ForegroundColor Yellow
    pip install -r requirements.txt | Out-Null
}

Write-Host "[OK] Ambiente Python configurado" -ForegroundColor Green

# 6. INFORMAÇÕES FINAIS
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "         SETUP CONCLUIDO!            " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "PARA INICIAR O SISTEMA:" -ForegroundColor Cyan
Write-Host ""

# Voltar ao diretório frontend
Set-Location "..\frontend"

Write-Host "1. INICIAR API (Novo terminal):" -ForegroundColor Yellow
Write-Host "   cd python_ml_api" -ForegroundColor White
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "   python app.py" -ForegroundColor White
Write-Host ""

Write-Host "2. INICIAR FRONTEND (Este terminal):" -ForegroundColor Yellow
Write-Host "   live-server dev --port=3000 --open=/index.html" -ForegroundColor White
Write-Host ""

Write-Host "URLS FINAIS:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   API: http://localhost:5000" -ForegroundColor White
Write-Host ""

Write-Host "RECURSOS DISPONIVEIS:" -ForegroundColor Magenta
Write-Host "   - $PluginsCount plugins GSAP carregados" -ForegroundColor White
Write-Host "   - $PremiumCount plugins premium detectados" -ForegroundColor White
Write-Host "   - Sistema de animacoes avancadas" -ForegroundColor White
Write-Host "   - Debugging no console (F12)" -ForegroundColor White
Write-Host ""

Write-Host "INICIAR FRONTEND AGORA? (S/N): " -ForegroundColor Yellow -NoNewline
$resposta = Read-Host

if ($resposta -eq "S" -or $resposta -eq "s") {
    Write-Host ""
    Write-Host "[START] Iniciando live-server..." -ForegroundColor Green
    Write-Host "[INFO] Pressione Ctrl+C para parar" -ForegroundColor Yellow
    Write-Host ""
    
    # Iniciar live-server (bloqueia o terminal)
    live-server dev --port=3000 --open=/index.html
} else {
    Write-Host ""
    Write-Host "[INFO] Para iniciar depois:" -ForegroundColor Cyan
    Write-Host "   live-server dev --port=3000 --open=/index.html" -ForegroundColor White
    Write-Host ""
}
