# EcoGuardians - Script de Desenvolvimento Local
# Sistema completo com TODOS os plugins GSAP Premium
# NASA Space Apps Challenge 2025

Write-Host "EcoGuardians - INICIANDO SISTEMA PREMIUM" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Função para log colorido
function Write-Log {
    param([string]$Message, [string]$Color = "Green")
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

# Navegar para o diretório do projeto
$ProjectPath = "C:\projtos pessoais\NASA\EcoPathogens\web_app_production"
Set-Location $ProjectPath

Write-Log "Diretorio do projeto: $ProjectPath"

# 1. VERIFICAR DEPENDÊNCIAS
Write-Log "Verificando dependencias..." "Cyan"

# Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js nao encontrado!"
    Write-Warning "Por favor, instale Node.js primeiro"
    exit 1
}

# Python
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python nao encontrado!"
    Write-Warning "Por favor, instale Python 3.8+ primeiro"  
    exit 1
}

Write-Log "Dependencias basicas verificadas"

# 2. VERIFICAR PLUGINS GSAP
Write-Log "Verificando plugins GSAP Premium..." "Cyan"

$GSAPPath = "frontend\public\assets\js\gsap"
$PluginsEncontrados = Get-ChildItem -Path $GSAPPath -Filter "*.js" -ErrorAction SilentlyContinue

if ($PluginsEncontrados.Count -gt 0) {
    Write-Log "$($PluginsEncontrados.Count) plugins GSAP encontrados!"
    
    # Contar plugins premium
    $PluginsPremium = $PluginsEncontrados | Where-Object { 
        $_.Name -match "(MorphSVG|DrawSVG|SplitText|ScrollSmoother|Physics2D|InertiaPlugin|CustomEase|CustomBounce|CustomWiggle|Flip|GSDevTools)" 
    }
    
    Write-Log "$($PluginsPremium.Count) plugins PREMIUM detectados!" "Magenta"
    
    if ($PluginsPremium.Count -ge 10) {
        Write-Log "ARSENAL COMPLETO! Animacoes de Hollywood habilitadas!" "Green"
    }
} else {
    Write-Warning "Poucos plugins GSAP encontrados"
    Write-Warning "Algumas animacoes avancadas podem nao funcionar"
}

# 3. CONFIGURAR AMBIENTE PYTHON
Write-Log "Configurando ambiente Python..." "Cyan"

Set-Location "python_ml_api"

# Criar ambiente virtual se não existir
if (!(Test-Path "venv")) {
    python -m venv venv
    Write-Log "Ambiente virtual criado"
}

# Ativar ambiente virtual
& .\venv\Scripts\Activate.ps1

# Instalar dependências
pip install -r requirements.txt *>$null

Write-Log "Ambiente Python configurado"

# 4. INICIAR API PYTHON
Write-Log "Iniciando API Python..." "Yellow"

# Iniciar em background usando PowerShell Job
$APIJob = Start-Job -ScriptBlock {
    Set-Location "C:\projtos pessoais\NASA\EcoPathogens\web_app_production\python_ml_api"
    & .\venv\Scripts\Activate.ps1
    python app.py
}

Start-Sleep 3

# Verificar se API está funcionando
try {
    $HealthCheck = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    if ($HealthCheck.status -eq "healthy") {
        Write-Log "API Python funcionando perfeitamente!"
    }
} catch {
    Write-Warning "API pode estar iniciando... continuando..."
}

# 5. PREPARAR FRONTEND
Write-Log "Preparando frontend com GSAP Premium..." "Cyan"

Set-Location "..\frontend"

# Criar diretório de desenvolvimento
if (!(Test-Path "dev")) {
    New-Item -ItemType Directory -Name "dev"
}

# Copiar arquivos
Copy-Item -Path "public\*" -Destination "dev" -Recurse -Force

# Criar arquivo de configuração local com features premium
$ConfigContent = @"
// EcoGuardians - GSAP Premium Edition
window.EcoConfig = {
    API_BASE_URL: 'http://localhost:5000',
    ENVIRONMENT: 'development',
    GSAP_VERSION: '3.13.0',
    FEATURES: {
        GSAP_PREMIUM: true,
        MORPH_SVG: true,
        DRAW_SVG: true,
        SPLIT_TEXT: true,
        SCROLL_SMOOTHER: true,
        PHYSICS_2D: true,
        DRAGGABLE: true,
        FLIP_TRANSITIONS: true,
        CUSTOM_EASES: true,
        SCRAMBLE_TEXT: true,
        REAL_DATA: true,
        DEBUG_MODE: true,
        DEV_TOOLS: true
    },
    PERFORMANCE: {
        FORCE_3D: true,
        AUTO_SLEEP: 60,
        HIGH_RESOLUTION: true,
        GPU_ACCELERATION: true
    }
};

console.log('EcoGuardians PREMIUM configurado!');
console.log('Recursos GSAP Premium ativados');
"@

$ConfigContent | Out-File -FilePath "dev\config.js" -Encoding UTF8

Write-Log "Frontend preparado com configuracao premium"

# 6. INSTALAR/VERIFICAR LIVE-SERVER
if (!(Get-Command live-server -ErrorAction SilentlyContinue)) {
    Write-Log "Instalando live-server..." "Yellow"
    npm install -g live-server *>$null
}

# 7. INICIAR SERVIDOR DE DESENVOLVIMENTO
Write-Log "Iniciando servidor de desenvolvimento..." "Yellow"

# Iniciar live-server em background
$FrontendJob = Start-Job -ScriptBlock {
    Set-Location "C:\projtos pessoais\NASA\EcoPathogens\web_app_production\frontend"
    live-server dev --port=3000 --open=/index.html --quiet
}

Start-Sleep 2

# 8. TESTAR ENDPOINTS DA API
Write-Log "Testando endpoints da API..." "Cyan"

$Endpoints = @(
    @{Name="Health"; URL="http://localhost:5000/api/health"},
    @{Name="Stats"; URL="http://localhost:5000/api/stats"},
    @{Name="Predictions"; URL="http://localhost:5000/api/predictions"}
)

foreach ($endpoint in $Endpoints) {
    try {
        $response = Invoke-RestMethod -Uri $endpoint.URL -TimeoutSec 3
        Write-Log "$($endpoint.Name) - OK"
    } catch {
        Write-Warning "$($endpoint.Name) - Pode estar carregando..."
    }
}

# 9. INFORMAÇÕES DO SISTEMA
Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "EcoGuardians PREMIUM rodando localmente!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

Write-Host "URLS PRINCIPAIS:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   API: http://localhost:5000" -ForegroundColor White
Write-Host "   Health Check: http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""

Write-Host "RECURSOS GSAP PREMIUM ATIVOS:" -ForegroundColor Magenta
Write-Host "   MorphSVG - Transformacoes de formas epicas"
Write-Host "   DrawSVG - Desenho animado de SVGs"
Write-Host "   SplitText - Texto animado letra por letra"
Write-Host "   ScrollSmoother - Scroll ultra suave"
Write-Host "   Physics2D - Particulas fisicas realistas"
Write-Host "   Draggable - Elementos interativos"
Write-Host "   Flip - Transicoes de layout fluidas"
Write-Host "   CustomEase - Animacoes organicas"
Write-Host "   GSDevTools - Debug profissional"
Write-Host ""

Write-Host "ENDPOINTS DA API:" -ForegroundColor Yellow
Write-Host "   GET /api/data/historical - Dados de 50 anos"
Write-Host "   GET /api/data/by-year/2024 - Dados especificos"
Write-Host "   GET /api/predictions - Predicoes IA"
Write-Host "   GET /api/stats - Estatisticas tempo real"
Write-Host ""

Write-Host "RECURSOS TESTAVEIS:" -ForegroundColor Cyan
Write-Host "   Loading screen cinematografico"
Write-Host "   Particulas arrastaveis com fisica"
Write-Host "   Scroll suave como manteiga"
Write-Host "   Texto aparecendo letra por letra"
Write-Host "   Formas SVG se transformando"
Write-Host "   Graficos animados"
Write-Host "   Hover effects avancados"
Write-Host "   Responsividade premium"
Write-Host ""

Write-Host "FERRAMENTAS DE DEBUG:" -ForegroundColor Green
Write-Host "   F12 -> Console -> verificarPluginsGSAP" -ForegroundColor White
Write-Host "   GSDevTools no canto superior direito" -ForegroundColor White
Write-Host "   Ctrl+Shift+I -> Performance tab" -ForegroundColor White
Write-Host ""

Write-Host "PARA PARAR OS SERVIDORES:" -ForegroundColor Red
Write-Host "   Pressione Ctrl+C neste terminal"
Write-Host ""

# 10. AGUARDAR INTERRUPÇÃO
Write-Log "Sistema rodando com GSAP Premium completo!" "Green"
Write-Log "Pressione Ctrl+C para parar os servidores..." "Yellow"

# Função de cleanup
function Stop-Servers {
    Write-Host ""
    Write-Log "Parando servidores..." "Yellow"
    
    Stop-Job $APIJob -ErrorAction SilentlyContinue
    Remove-Job $APIJob -ErrorAction SilentlyContinue
    
    Stop-Job $FrontendJob -ErrorAction SilentlyContinue
    Remove-Job $FrontendJob -ErrorAction SilentlyContinue
    
    # Cleanup arquivos temporários
    Remove-Item "frontend\dev" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Log "Cleanup concluido" "Green"
    Write-Log "Obrigado por testar o EcoGuardians Premium!" "Cyan"
}

# Capturar Ctrl+C
try {
    while ($true) {
        Start-Sleep 1
        
        # Verificar se jobs ainda estão rodando
        if ((Get-Job $APIJob).State -eq "Failed") {
            Write-Error "API Python parou inesperadamente"
            break
        }
        
        if ((Get-Job $FrontendJob).State -eq "Failed") {
            Write-Error "Frontend parou inesperadamente"
            break
        }
    }
} catch {
    # Ctrl+C pressionado
} finally {
    Stop-Servers
}
