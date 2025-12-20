#!/bin/bash

# 🚀 Script de Desenvolvimento Local - EcoGuardians
# Testa o sistema completo antes do deploy
# NASA Space Apps Challenge 2025

echo "🌳 INICIANDO TESTES LOCAIS DO EcoGuardians"
echo "=========================================="

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# 1. VERIFICAR DEPENDÊNCIAS
log "📋 Verificando dependências..."

# Node.js (para live-server)
if ! command -v node &> /dev/null; then
    warn "Node.js não encontrado. Instalando..."
    # Para Windows com Chocolatey
    # choco install nodejs
    # Para Ubuntu/Debian
    # sudo apt-get install nodejs npm
    error "Por favor, instale Node.js primeiro"
    exit 1
fi

# Python
if ! command -v python3 &> /dev/null; then
    error "Python 3 não encontrado. Instale Python 3.8+"
    exit 1
fi

# Verificar se live-server está instalado
if ! command -v live-server &> /dev/null; then
    log "Instalando live-server..."
    npm install -g live-server
fi

log "✅ Dependências verificadas"

# 2. SETUP DO AMBIENTE PYTHON
log "🐍 Configurando ambiente Python..."

cd python_ml_api

# Criar ambiente virtual se não existir
if [ ! -d "venv" ]; then
    python3 -m venv venv
    log "Ambiente virtual criado"
fi

# Ativar ambiente virtual
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

# Instalar dependências
pip install -r requirements.txt

log "✅ Ambiente Python configurado"

# 3. TESTAR API PYTHON
log "🧪 Testando API Python..."

# Iniciar API em background
python app.py &
API_PID=$!
log "API iniciada (PID: $API_PID)"

# Aguardar API inicializar
sleep 3

# Testar endpoints
log "Testando endpoints..."

# Health check
if curl -s http://localhost:5000/api/health | grep -q "healthy"; then
    log "✅ Health check OK"
else
    error "❌ Health check falhou"
fi

# Dados históricos
if curl -s http://localhost:5000/api/data/historical?limit=1 | grep -q "success"; then
    log "✅ Dados históricos OK"
else
    warn "⚠️ Dados históricos podem não estar disponíveis"
fi

# Estatísticas
if curl -s http://localhost:5000/api/stats | grep -q "success"; then
    log "✅ Estatísticas OK"
else
    warn "⚠️ Estatísticas podem não estar disponíveis"
fi

# Predições
if curl -s http://localhost:5000/api/predictions | grep -q "success"; then
    log "✅ Predições OK"
else
    warn "⚠️ Predições podem não estar disponíveis"
fi

log "✅ Testes da API concluídos"

# 4. PREPARAR FRONTEND
log "🎨 Preparando frontend..."

cd ../frontend

# Criar diretório de desenvolvimento
mkdir -p dev

# Copiar arquivos
cp -r public/* dev/

# Atualizar URLs da API para localhost
sed -i 's/\/api\//http:\/\/localhost:5000\/api\//g' dev/assets/js/*.js 2>/dev/null || true

# Criar arquivo de configuração local
cat > dev/config.js << EOF
// Configuração para desenvolvimento local
window.EcoConfig = {
    API_BASE_URL: 'http://localhost:5000',
    ENVIRONMENT: 'development',
    FEATURES: {
        GSAP_PREMIUM: true,
        REAL_DATA: true,
        DEBUG_MODE: true
    }
};
EOF

# Adicionar script de configuração ao HTML
if ! grep -q "config.js" dev/index.html; then
    sed -i 's/<\/head>/<script src="config.js"><\/script><\/head>/' dev/index.html
fi

log "✅ Frontend preparado"

# 5. INICIAR SERVIDOR DE DESENVOLVIMENTO
log "🚀 Iniciando servidor de desenvolvimento..."

# Abrir em background
live-server dev --port=3000 --open=/index.html &
FRONTEND_PID=$!

log "Frontend iniciado (PID: $FRONTEND_PID)"
log "🌍 Acesse: http://localhost:3000"
log "🔧 API: http://localhost:5000"

# 6. MOSTRAR INFORMAÇÕES ÚTEIS
echo ""
echo "=========================================="
echo "🎉 EcoGuardians rodando localmente!"
echo "=========================================="
echo ""
echo "🌐 URLS:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:5000"
echo "   API Health: http://localhost:5000/api/health"
echo ""
echo "📊 ENDPOINTS DISPONÍVEIS:"
echo "   GET /api/data/historical - Dados de 50 anos"
echo "   GET /api/data/summary - Resumo histórico"
echo "   GET /api/data/by-year/2024 - Dados de um ano"
echo "   GET /api/predictions - Predições com IA"
echo "   GET /api/stats - Estatísticas gerais"
echo ""
echo "🎮 RECURSOS TESTÁVEIS:"
echo "   ✅ GSAP Premium animations"
echo "   ✅ Dados históricos 50 anos"
echo "   ✅ Modelos de ML/predições"
echo "   ✅ Visualizações interativas"
echo "   ✅ Timeline animada"
echo "   ✅ Dashboard completo"
echo ""
echo "🔧 DEVELOPMENT TOOLS:"
echo "   F12 - DevTools (debug JS)"
echo "   Ctrl+R - Reload página"
echo "   Ctrl+Shift+R - Hard reload"
echo ""
echo "⚠️ PARA PARAR OS SERVIDORES:"
echo "   kill $API_PID (API Python)"
echo "   kill $FRONTEND_PID (Frontend)"
echo "   ou use Ctrl+C neste terminal"
echo ""

# 7. AGUARDAR INTERRUPÇÃO
log "🎯 Sistema rodando. Pressione Ctrl+C para parar..."

# Função para cleanup quando interrompido
cleanup() {
    echo ""
    log "🛑 Parando servidores..."
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    
    # Cleanup de arquivos temporários
    rm -rf frontend/dev 2>/dev/null
    
    log "🧹 Cleanup concluído"
    log "👋 Obrigado por testar o EcoGuardians!"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Aguardar indefinidamente
while true; do
    sleep 1
    
    # Verificar se processos ainda estão rodando
    if ! kill -0 $API_PID 2>/dev/null; then
        error "API Python parou inesperadamente"
        break
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        error "Frontend parou inesperadamente"  
        break
    fi
done

# Cleanup final se sair do loop
cleanup
