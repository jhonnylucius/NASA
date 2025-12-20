# EcoGuardians - Iniciar apenas Frontend
# NASA Space Apps Challenge 2025

Write-Host "===============================" -ForegroundColor Green
Write-Host "  EcoGuardians - Frontend GSAP  " -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Navegar para o diretório do frontend
$FrontendPath = "C:\projtos pessoais\NASA\EcoPathogens\web_app_production\frontend"
Set-Location $FrontendPath

Write-Host "[INFO] Diretorio: $FrontendPath" -ForegroundColor Cyan

# Verificar se live-server está instalado
if (!(Get-Command live-server -ErrorAction SilentlyContinue)) {
    Write-Host "[INSTALL] Instalando live-server..." -ForegroundColor Yellow
    npm install -g live-server
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Falha ao instalar live-server" -ForegroundColor Red
        Write-Host "[INFO] Tente instalar manualmente: npm install -g live-server" -ForegroundColor Yellow
        exit 1
    }
}

# Criar pasta dev se não existir
if (!(Test-Path "dev")) {
    Write-Host "[SETUP] Criando pasta dev..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Name "dev" -Force | Out-Null
}

# Copiar arquivos public para dev
Write-Host "[SETUP] Copiando arquivos..." -ForegroundColor Cyan
Copy-Item -Path "public\*" -Destination "dev" -Recurse -Force

# Criar arquivo de configuração
$ConfigJS = @"
// EcoGuardians - Configuracao de Desenvolvimento
window.EcoConfig = {
    API_BASE_URL: 'http://localhost:5000',
    ENVIRONMENT: 'development',
    VERSION: '1.0.0',
    FEATURES: {
        GSAP_PREMIUM: true,
        MORPH_SVG: true,
        DRAW_SVG: true,
        SPLIT_TEXT: true,
        SCROLL_SMOOTHER: true,
        PHYSICS_2D: true,
        DRAGGABLE: true,
        FLIP_TRANSITIONS: true,
        DEBUG_MODE: true,
        DEV_TOOLS: true
    },
    PERFORMANCE: {
        FORCE_3D: true,
        AUTO_SLEEP: 60,
        GPU_ACCELERATION: true
    }
};

console.log('🎬 EcoGuardians GSAP Premium carregado!');
console.log('📊 Configuracoes:', window.EcoConfig);
"@

$ConfigJS | Out-File -FilePath "dev\config.js" -Encoding UTF8

# Verificar plugins GSAP
$GSAPPath = "dev\assets\js\gsap"
if (Test-Path $GSAPPath) {
    $PluginsCount = (Get-ChildItem -Path $GSAPPath -Filter "*.js").Count
    Write-Host "[OK] $PluginsCount plugins GSAP encontrados!" -ForegroundColor Green
    
    # Listar plugins premium encontrados
    $PremiumPlugins = @("MorphSVG", "DrawSVG", "SplitText", "ScrollSmoother", "Physics2D", "Draggable", "Flip", "CustomEase", "GSDevTools")
    $Found = @()
    foreach ($plugin in $PremiumPlugins) {
        if (Get-ChildItem -Path $GSAPPath -Filter "*$plugin*" -ErrorAction SilentlyContinue) {
            $Found += $plugin
        }
    }
    Write-Host "[PREMIUM] Plugins encontrados: $($Found -join ', ')" -ForegroundColor Magenta
} else {
    Write-Host "[AVISO] Pasta GSAP nao encontrada" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "         FRONTEND PRONTO!        " -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Pasta: dev/" -ForegroundColor Cyan
Write-Host ""

Write-Host "RECURSOS ATIVOS:" -ForegroundColor Yellow
Write-Host "  - $PluginsCount plugins GSAP carregados" -ForegroundColor White
Write-Host "  - $($Found.Count) plugins premium detectados" -ForegroundColor White
Write-Host "  - Animacoes avancadas habilitadas" -ForegroundColor White
Write-Host "  - Debug no console (F12)" -ForegroundColor White
Write-Host "  - GSDevTools (se disponivel)" -ForegroundColor White
Write-Host ""

Write-Host "TESTE DOS PLUGINS:" -ForegroundColor Cyan
Write-Host "  1. Abra F12 -> Console" -ForegroundColor White
Write-Host "  2. Digite: verificarPluginsGSAP()" -ForegroundColor White
Write-Host "  3. Veja a lista completa de plugins" -ForegroundColor White
Write-Host ""

Write-Host "[START] Iniciando live-server na porta 3000..." -ForegroundColor Green
Write-Host "[INFO] Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host ""

# Iniciar live-server
live-server dev --port=3000 --open=/index.html
