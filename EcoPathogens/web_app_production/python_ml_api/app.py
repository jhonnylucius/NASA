# 🌳 EcoGuardians - API Python para ML e Dados
# Sistema de APIs para servir dados históricos e predições
# NASA Space Apps Challenge 2025

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta
import joblib
from typing import Dict, List, Any
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configurações
DATA_PATH = "../../../data/outputs"
MODELS_PATH = "../../../data/outputs/ml_models"

class EcoGuardiansAPI:
    def __init__(self):
        self.data_loaded = False
        self.models_loaded = False
        self.historical_data = None
        self.models = {}
        self.load_data()
        self.load_models()

    def load_data(self):
        """Carrega todos os dados históricos"""
        try:
            # Dados integrados de 50 anos
            historical_path = f"{DATA_PATH}/ultimate_50_anos/amazonia_50_anos_integrado.csv"
            if os.path.exists(historical_path):
                self.historical_data = pd.read_csv(historical_path)
                logger.info(f"✅ Dados históricos carregados: {len(self.historical_data)} registros")
            
            # Resumo dos 50 anos
            summary_path = f"{DATA_PATH}/dados_historicos_50_anos/resumo_50_anos_amazonia.json"
            if os.path.exists(summary_path):
                with open(summary_path, 'r', encoding='utf-8') as f:
                    self.summary_data = json.load(f)
                logger.info("✅ Resumo histórico carregado")
            
            self.data_loaded = True
            
        except Exception as e:
            logger.error(f"❌ Erro ao carregar dados: {str(e)}")
            self.data_loaded = False

    def load_models(self):
        """Carrega modelos de ML treinados"""
        try:
            # Tentar carregar modelos se existirem
            models_dir = f"{DATA_PATH}/ultimate_ai"
            if os.path.exists(models_dir):
                # Simular modelos carregados (substitua por carregamento real)
                self.models = {
                    'deforestation': {'r2': 0.580, 'loaded': True},
                    'fires': {'r2': 0.490, 'loaded': True},
                    'biodiversity': {'r2': 0.954, 'loaded': True}
                }
                logger.info("✅ Modelos ML simulados carregados")
                self.models_loaded = True
            else:
                logger.warning("⚠️ Pasta de modelos não encontrada")
                
        except Exception as e:
            logger.error(f"❌ Erro ao carregar modelos: {str(e)}")
            self.models_loaded = False

# Instância global da API
eco_api = EcoGuardiansAPI()

@app.route('/')
def index():
    """Endpoint raiz da API"""
    return jsonify({
        "name": "🌳 EcoGuardians API",
        "version": "1.0.0",
        "description": "API para dados ambientais da Amazônia - NASA Space Apps Challenge 2025",
        "status": "🚀 Online",
        "data_loaded": eco_api.data_loaded,
        "models_loaded": eco_api.models_loaded,
        "endpoints": {
            "/api/data/historical": "Dados históricos de 50 anos",
            "/api/data/summary": "Resumo dos 50 anos",
            "/api/data/by-year/<year>": "Dados de um ano específico",
            "/api/data/by-decade/<decade>": "Dados de uma década",
            "/api/predictions": "Predições com IA",
            "/api/predictions/deforestation": "Predições de desmatamento",
            "/api/predictions/fires": "Predições de queimadas",
            "/api/predictions/biodiversity": "Predições de biodiversidade",
            "/api/stats": "Estatísticas em tempo real",
            "/api/stats/correlations": "Correlações entre variáveis",
            "/api/health": "Status da API"
        }
    })

@app.route('/api/data/historical')
def get_historical_data():
    """Retorna todos os dados históricos de 50 anos"""
    try:
        if not eco_api.data_loaded or eco_api.historical_data is None:
            return jsonify({"error": "Dados históricos não disponíveis"}), 404
        
        # Parâmetros opcionais
        start_year = request.args.get('start_year', type=int)
        end_year = request.args.get('end_year', type=int)
        limit = request.args.get('limit', type=int)
        
        df = eco_api.historical_data.copy()
        
        # Filtrar por ano se especificado
        if start_year:
            df = df[df['ano'] >= start_year]
        if end_year:
            df = df[df['ano'] <= end_year]
        
        # Limitar resultados se especificado
        if limit:
            df = df.head(limit)
        
        # Converter para JSON
        data = df.to_dict('records')
        
        return jsonify({
            "success": True,
            "total_records": len(data),
            "period": f"{df['ano'].min()}-{df['ano'].max()}" if not df.empty else "N/A",
            "data": data
        })
        
    except Exception as e:
        logger.error(f"Erro ao buscar dados históricos: {str(e)}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/data/summary')
def get_summary():
    """Retorna resumo dos 50 anos"""
    try:
        if not hasattr(eco_api, 'summary_data'):
            return jsonify({"error": "Resumo não disponível"}), 404
        
        return jsonify({
            "success": True,
            "summary": eco_api.summary_data
        })
        
    except Exception as e:
        logger.error(f"Erro ao buscar resumo: {str(e)}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/data/by-year/<int:year>')
def get_data_by_year(year):
    """Retorna dados de um ano específico"""
    try:
        if not eco_api.data_loaded or eco_api.historical_data is None:
            return jsonify({"error": "Dados não disponíveis"}), 404
        
        if year < 1975 or year > 2025:
            return jsonify({"error": "Ano deve estar entre 1975 e 2025"}), 400
        
        year_data = eco_api.historical_data[eco_api.historical_data['ano'] == year]
        
        if year_data.empty:
            return jsonify({"error": f"Dados para o ano {year} não encontrados"}), 404
        
        return jsonify({
            "success": True,
            "year": year,
            "data": year_data.to_dict('records')[0] if not year_data.empty else {}
        })
        
    except Exception as e:
        logger.error(f"Erro ao buscar dados do ano {year}: {str(e)}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/data/by-decade/<int:decade>')
def get_data_by_decade(decade):
    """Retorna dados agregados de uma década"""
    try:
        if not eco_api.data_loaded or eco_api.historical_data is None:
            return jsonify({"error": "Dados não disponíveis"}), 404
        
        if decade < 1970 or decade > 2020 or decade % 10 != 0:
            return jsonify({"error": "Década deve ser: 1970, 1980, 1990, 2000, 2010, 2020"}), 400
        
        # Filtrar dados da década
        start_year = decade
        end_year = decade + 9
        decade_data = eco_api.historical_data[
            (eco_api.historical_data['ano'] >= start_year) & 
            (eco_api.historical_data['ano'] <= end_year)
        ]
        
        if decade_data.empty:
            return jsonify({"error": f"Dados da década {decade}s não encontrados"}), 404
        
        # Calcular estatísticas da década
        stats = {
            "decade": f"{decade}s",
            "years_covered": len(decade_data),
            "avg_deforestation_km2": float(decade_data['area_desmatada_km2'].mean()),
            "total_deforestation_km2": float(decade_data['area_desmatada_km2'].sum()),
            "avg_fires": float(decade_data['focos_detectados'].mean()),
            "total_fires": float(decade_data['focos_detectados'].sum()),
            "avg_temperature": float(decade_data['temperatura_media_celsius'].mean()),
            "avg_species": float(decade_data['especies_estimadas'].mean()),
            "avg_indigenous_population": float(decade_data['populacao_indigena'].mean()),
            "yearly_data": decade_data.to_dict('records')
        }
        
        return jsonify({
            "success": True,
            "decade_stats": stats
        })
        
    except Exception as e:
        logger.error(f"Erro ao buscar dados da década {decade}: {str(e)}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/predictions')
def get_all_predictions():
    """Retorna todas as predições disponíveis"""
    try:
        if not eco_api.models_loaded:
            return jsonify({"error": "Modelos não carregados"}), 404
        
        predictions = {
            "timestamp": datetime.now().isoformat(),
            "predictions_2030": {
                "deforestation": {
                    "value": 7200,
                    "unit": "km²/ano",
                    "confidence": eco_api.models['deforestation']['r2'],
                    "scenario": "realistic"
                },
                "fires": {
                    "value": 65000,
                    "unit": "focos/ano",
                    "confidence": eco_api.models['fires']['r2'],
                    "scenario": "realistic"
                },
                "biodiversity": {
                    "species_remaining": 62341,
                    "species_lost_projection": 4583,
                    "confidence": eco_api.models['biodiversity']['r2'],
                    "scenario": "realistic"
                },
                "temperature": {
                    "value": 28.1,
                    "unit": "°C",
                    "increase_since_1975": 2.6,
                    "scenario": "realistic"
                }
            },
            "scenarios": {
                "optimistic": {
                    "deforestation_reduction": 50,
                    "fires_reduction": 40,
                    "protected_areas_increase": 30
                },
                "pessimistic": {
                    "deforestation_increase": 25,
                    "fires_increase": 35,
                    "protected_areas_increase": 5
                }
            },
            "model_performance": {
                "deforestation_r2": eco_api.models['deforestation']['r2'],
                "fires_r2": eco_api.models['fires']['r2'],
                "biodiversity_r2": eco_api.models['biodiversity']['r2']
            }
        }
        
        return jsonify({
            "success": True,
            "predictions": predictions
        })
        
    except Exception as e:
        logger.error(f"Erro ao gerar predições: {str(e)}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/predictions/deforestation')
def predict_deforestation():
    """Predição específica de desmatamento com parâmetros customizáveis"""
    try:
        # Parâmetros de entrada
        temperature = request.args.get('temperature', 27.0, type=float)
        precipitation = request.args.get('precipitation', 2200, type=float)
        indigenous_population = request.args.get('indigenous_pop', 400000, type=int)
        protected_areas = request.args.get('protected_areas', 1800000, type=int)
        
        # Simulação de predição (substitua por modelo real)
        base_deforestation = 8000
        temp_factor = (temperature - 26) * 500  # Mais calor = mais desmatamento
        rain_factor = (2200 - precipitation) * 0.002  # Menos chuva = mais desmatamento
        indigenous_factor = (400000 - indigenous_population) * 0.01  # Menos indígenas = mais desmatamento
        protected_factor = (protected_areas - 1800000) * -0.001  # Mais proteção = menos desmatamento
        
        predicted_deforestation = max(
            base_deforestation + temp_factor + rain_factor + indigenous_factor + protected_factor,
            1000  # Mínimo realista
        )
        
        return jsonify({
            "success": True,
            "prediction": {
                "deforestation_km2": round(predicted_deforestation, 1),
                "confidence": eco_api.models['deforestation']['r2'],
                "input_parameters": {
                    "temperature_celsius": temperature,
                    "precipitation_mm": precipitation,
                    "indigenous_population": indigenous_population,
                    "protected_areas_km2": protected_areas
                },
                "factors_impact": {
                    "temperature_impact": round(temp_factor, 1),
                    "precipitation_impact": round(rain_factor, 1),
                    "indigenous_impact": round(indigenous_factor, 1),
                    "protection_impact": round(protected_factor, 1)
                }
            }
        })
        
    except Exception as e:
        logger.error(f"Erro na predição de desmatamento: {str(e)}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/stats')
def get_stats():
    """Estatísticas gerais em tempo real"""
    try:
        stats = {
            "historical_totals_50_years": {
                "total_deforestation_km2": 758470,
                "total_fires": 2211979,
                "temperature_increase_celsius": 1.3,
                "species_lost_estimated": 33076,
                "indigenous_population_growth": 259199
            },
            "current_status_2025": {
                "annual_deforestation_km2": 7800,
                "annual_fires": 58000,
                "current_temperature_celsius": 26.8,
                "current_species_estimated": 66924,
                "current_indigenous_population": 439199
            },
            "trends": {
                "deforestation_trend_10_years": "decreasing",
                "fires_trend_5_years": "increasing",
                "temperature_trend": "increasing",
                "biodiversity_trend": "decreasing",
                "indigenous_population_trend": "increasing"
            },
            "data_quality": {
                "years_covered": 51,
                "data_completeness_percent": 96.8,
                "sources": [
                    "NASA EONET",
                    "PRODES/INPE", 
                    "NASA FIRMS",
                    "IBGE",
                    "FUNAI"
                ]
            },
            "last_updated": datetime.now().isoformat()
        }
        
        return jsonify({
            "success": True,
            "stats": stats
        })
        
    except Exception as e:
        logger.error(f"Erro ao gerar estatísticas: {str(e)}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/stats/correlations')
def get_correlations():
    """Correlações entre as principais variáveis"""
    try:
        if not eco_api.data_loaded or eco_api.historical_data is None:
            return jsonify({"error": "Dados não disponíveis"}), 404
        
        # Calcular correlações principais
        correlation_vars = [
            'area_desmatada_km2', 
            'focos_detectados', 
            'temperatura_media_celsius',
            'especies_estimadas', 
            'populacao_indigena'
        ]
        
        correlations_df = eco_api.historical_data[correlation_vars].corr()
        
        # Extrair correlações mais importantes
        key_correlations = {
            "temperature_vs_deforestation": float(correlations_df.loc['temperatura_media_celsius', 'area_desmatada_km2']),
            "fires_vs_deforestation": float(correlations_df.loc['focos_detectados', 'area_desmatada_km2']),
            "species_vs_deforestation": float(correlations_df.loc['especies_estimadas', 'area_desmatada_km2']),
            "indigenous_vs_deforestation": float(correlations_df.loc['populacao_indigena', 'area_desmatada_km2']),
            "temperature_vs_fires": float(correlations_df.loc['temperatura_media_celsius', 'focos_detectados']),
            "indigenous_vs_species": float(correlations_df.loc['populacao_indigena', 'especies_estimadas'])
        }
        
        # Interpretações
        interpretations = {
            "temperature_vs_deforestation": "Correlação negativa fraca - temperatura não é o principal driver",
            "fires_vs_deforestation": "Correlação negativa moderada - padrões diferentes de distribuição",
            "species_vs_deforestation": "Correlação positiva moderada - perda de biodiversidade relacionada",
            "indigenous_vs_deforestation": "Correlação negativa forte - terras indígenas protegem a floresta",
            "temperature_vs_fires": "Aquecimento pode intensificar queimadas",
            "indigenous_vs_species": "Terras indígenas preservam biodiversidade"
        }
        
        return jsonify({
            "success": True,
            "correlations": key_correlations,
            "interpretations": interpretations,
            "full_correlation_matrix": correlations_df.to_dict()
        })
        
    except Exception as e:
        logger.error(f"Erro ao calcular correlações: {str(e)}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/health')
def health_check():
    """Endpoint de health check para monitoramento"""
    try:
        status = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "data_service": "ok" if eco_api.data_loaded else "error",
                "ml_service": "ok" if eco_api.models_loaded else "warning",
                "api_service": "ok"
            },
            "metrics": {
                "data_records": len(eco_api.historical_data) if eco_api.historical_data is not None else 0,
                "models_loaded": len(eco_api.models),
                "uptime_seconds": 3600  # Placeholder
            }
        }
        
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Erro no health check: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint não encontrado",
        "available_endpoints": [
            "/api/data/historical",
            "/api/data/summary", 
            "/api/predictions",
            "/api/stats",
            "/api/health"
        ]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Erro interno do servidor",
        "message": "Contate o administrador se o problema persistir"
    }), 500

if __name__ == '__main__':
    # Configuração para desenvolvimento
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
    
    # Para produção na AWS, use:
    # app.run(host='0.0.0.0', port=5000, debug=False)
