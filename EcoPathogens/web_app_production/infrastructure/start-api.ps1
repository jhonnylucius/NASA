# EcoGuardians - Iniciar apenas API Python
# NASA Space Apps Challenge 2025

Write-Host "==============================" -ForegroundColor Green
Write-Host "  EcoGuardians - API Python   " -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Navegar para a pasta da API
$APIPath = "C:\projtos pessoais\NASA\EcoPathogens\web_app_production\python_ml_api"
Set-Location $APIPath

Write-Host "[INFO] Diretorio: $APIPath" -ForegroundColor Cyan

# Verificar se existe venv
if (!(Test-Path "venv")) {
    Write-Host "[SETUP] Criando ambiente virtual..." -ForegroundColor Yellow
    python -m venv venv
}

# Ativar ambiente virtual
Write-Host "[SETUP] Ativando ambiente virtual..." -ForegroundColor Cyan
& .\venv\Scripts\Activate.ps1

# Instalar dependências se necessário
if (Test-Path "requirements.txt") {
    Write-Host "[SETUP] Verificando dependencias..." -ForegroundColor Cyan
    pip install -r requirements.txt | Out-Null
}

# Verificar se app.py existe
if (!(Test-Path "app.py")) {
    Write-Host "[ERRO] app.py nao encontrado!" -ForegroundColor Red
    Write-Host "[INFO] Criando app.py basico..." -ForegroundColor Yellow
    
    $BasicApp = @"
from flask import Flask, jsonify, render_template
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Dados mock para demonstração
MOCK_DATA = {
    "stats": {
        "deforestation_area": 758470,
        "fire_hotspots": 2211979,
        "temperature_increase": 1.3,
        "years_analyzed": 50,
        "ai_models_active": 7
    },
    "predictions": {
        "2025": {"deforestation": 15000, "fires": 45000, "temperature": 1.4},
        "2026": {"deforestation": 16200, "fires": 48500, "temperature": 1.5},
        "2027": {"deforestation": 17500, "fires": 52000, "temperature": 1.6}
    },
    "historical": [
        {"year": 2020, "deforestation": 11568, "fires": 103000, "temperature": 1.1},
        {"year": 2021, "deforestation": 13038, "fires": 75000, "temperature": 1.2},
        {"year": 2022, "deforestation": 14700, "fires": 91000, "temperature": 1.25},
        {"year": 2023, "deforestation": 13900, "fires": 67000, "temperature": 1.28},
        {"year": 2024, "deforestation": 14500, "fires": 79000, "temperature": 1.3}
    ]
}

@app.route('/')
def home():
    return jsonify({
        "message": "EcoGuardians API - NASA Space Apps 2025",
        "status": "active",
        "version": "1.0.0",
        "gsap_premium": True
    })

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/stats')
def get_stats():
    return jsonify(MOCK_DATA["stats"])

@app.route('/api/predictions')
def get_predictions():
    return jsonify(MOCK_DATA["predictions"])

@app.route('/api/data/historical')
def get_historical():
    return jsonify(MOCK_DATA["historical"])

@app.route('/api/data/by-year/<int:year>')
def get_by_year(year):
    historical = MOCK_DATA["historical"]
    year_data = next((item for item in historical if item["year"] == year), None)
    if year_data:
        return jsonify(year_data)
    return jsonify({"error": "Year not found"}), 404

if __name__ == '__main__':
    print("=" * 50)
    print("  EcoGuardians API - GSAP Premium Edition")
    print("=" * 50)
    print("  URL: http://localhost:5000")
    print("  Health: http://localhost:5000/api/health")
    print("  Stats: http://localhost:5000/api/stats")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)
"@

    $BasicApp | Out-File -FilePath "app.py" -Encoding UTF8
    Write-Host "[OK] app.py criado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "[START] Iniciando API na porta 5000..." -ForegroundColor Green
Write-Host "[INFO] Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host ""

# Iniciar a API
python app.py
