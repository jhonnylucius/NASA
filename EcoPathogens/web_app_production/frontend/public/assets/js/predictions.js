// 🔮 EcoGuardians - Predictions Manager
// Sistema de predições com IA e Machine Learning

class PredictionsManager {
    constructor() {
        this.models = {
            deforestation: { accuracy: 0.580, name: 'Random Forest' },
            fires: { accuracy: 0.490, name: 'Gradient Boosting' },
            biodiversity: { accuracy: 0.954, name: 'Neural Network' }
        };
        this.predictionData = {};
        this.isCalculating = false;
        this.init();
    }

    init() {
        console.log('🔮 PredictionsManager inicializado');
        
        this.setupSliders();
        this.initializeModels();
        this.loadPredictionData();
        this.updatePredictionCharts();
    }

    setupSliders() {
        // Temperature slider
        const tempSlider = document.getElementById('temp-slider');
        const tempValue = document.getElementById('temp-value');
        
        if (tempSlider && tempValue) {
            tempSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                tempValue.textContent = value.toFixed(1);
                this.updateDeforestationPrediction('temperature', value);
            });
        }

        // Precipitation slider
        const precipSlider = document.getElementById('precip-slider');
        const precipValue = document.getElementById('precip-value');
        
        if (precipSlider && precipValue) {
            precipSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                precipValue.textContent = value;
                this.updateFiresPrediction('precipitation', value);
            });
        }

        // Timeline year changes also affect predictions
        window.addEventListener('yearChanged', (event) => {
            this.updatePredictionsForYear(event.detail.year);
        });
    }

    initializeModels() {
        // Simular carregamento dos modelos de ML
        console.log('🤖 Inicializando modelos de IA...');
        
        // Modelo de Desmatamento (Random Forest)
        this.models.deforestation.coefficients = {
            temperature: 1250.5,
            precipitation: -0.8,
            road_density: 450.2,
            population: 0.003,
            intercept: -28500
        };

        // Modelo de Queimadas (Gradient Boosting)
        this.models.fires.coefficients = {
            temperature: 2100.3,
            precipitation: -1.5,
            humidity: -800.1,
            wind_speed: 150.7,
            intercept: -45000
        };

        // Modelo de Biodiversidade (Neural Network)
        this.models.biodiversity.weights = {
            deforestation_rate: -0.85,
            temperature_anomaly: -0.62,
            precipitation_change: 0.34,
            protected_areas: 0.78,
            bias: 75000
        };

        console.log('✅ Modelos inicializados com sucesso');
    }

    loadPredictionData() {
        // Carregar dados históricos para treinamento dos modelos
        this.predictionData = {
            historical: this.generateTrainingData(),
            scenarios: this.generateScenarios(),
            confidence_intervals: this.generateConfidenceIntervals()
        };

        console.log('📊 Dados de predição carregados');
    }

    generateTrainingData() {
        const data = [];
        const startYear = 2000;
        const endYear = 2025;

        for (let year = startYear; year <= endYear; year++) {
            const progress = (year - startYear) / (endYear - startYear);
            
            data.push({
                year: year,
                temperature: 25.5 + progress * 2.5 + (Math.random() - 0.5) * 0.5,
                precipitation: 2200 - progress * 300 + (Math.random() - 0.5) * 200,
                deforestation: 8000 + progress * 3000 + Math.sin(year * 0.3) * 2000,
                fires: 50000 + progress * 20000 + Math.sin(year * 0.4) * 15000,
                biodiversity: 100000 - progress * 25000,
                humidity: 75 - progress * 5,
                wind_speed: 8 + Math.random() * 4,
                road_density: progress * 100,
                population: 25000000 + progress * 10000000,
                protected_areas: 15 + progress * 10
            });
        }

        return data;
    }

    generateScenarios() {
        return {
            optimistic: {
                name: 'Cenário Otimista',
                description: 'Políticas ambientais rigorosas e investimentos em conservação',
                parameters: {
                    deforestation_reduction: 0.5,
                    fires_reduction: 0.4,
                    protected_areas_increase: 0.3,
                    temperature_mitigation: 0.2
                },
                predictions_2030: {
                    deforestation: 25000,
                    fires: 65000,
                    biodiversity: 68000,
                    confidence: 0.75
                }
            },
            realistic: {
                name: 'Cenário Realista',
                description: 'Continuação das tendências atuais com pequenas melhorias',
                parameters: {
                    deforestation_reduction: 0.2,
                    fires_reduction: 0.1,
                    protected_areas_increase: 0.15,
                    temperature_mitigation: 0.05
                },
                predictions_2030: {
                    deforestation: 45000,
                    fires: 89000,
                    biodiversity: 62341,
                    confidence: 0.85
                }
            },
            pessimistic: {
                name: 'Cenário Pessimista',
                description: 'Desregulamentação e redução de políticas de proteção',
                parameters: {
                    deforestation_reduction: -0.25,
                    fires_reduction: -0.35,
                    protected_areas_increase: -0.05,
                    temperature_mitigation: -0.1
                },
                predictions_2030: {
                    deforestation: 65000,
                    fires: 125000,
                    biodiversity: 57000,
                    confidence: 0.78
                }
            }
        };
    }

    generateConfidenceIntervals() {
        return {
            deforestation: { lower: 0.75, upper: 1.25 },
            fires: { lower: 0.8, upper: 1.3 },
            biodiversity: { lower: 0.95, upper: 1.05 }
        };
    }

    updateDeforestationPrediction(parameter, value) {
        if (this.isCalculating) return;
        
        this.isCalculating = true;
        
        // Simular cálculo do modelo
        setTimeout(() => {
            const model = this.models.deforestation;
            const baseValue = 45000; // Predição base para 2030
            
            let adjustment = 0;
            if (parameter === 'temperature') {
                // Maior temperatura = mais desmatamento
                adjustment = (value - 27.0) * model.coefficients.temperature;
            }
            
            const prediction = Math.max(10000, baseValue + adjustment);
            const confidence = model.accuracy * (1 - Math.abs(adjustment) / baseValue * 0.2);
            
            this.updateDeforestationDisplay(prediction, confidence);
            this.updateDeforestationChart(value, prediction);
            
            this.isCalculating = false;
        }, 500);
    }

    updateFiresPrediction(parameter, value) {
        if (this.isCalculating) return;
        
        this.isCalculating = true;
        
        setTimeout(() => {
            const model = this.models.fires;
            const baseValue = 89000; // Predição base para 2030
            
            let adjustment = 0;
            if (parameter === 'precipitation') {
                // Menos chuva = mais queimadas
                adjustment = (2200 - value) * Math.abs(model.coefficients.precipitation);
            }
            
            const prediction = Math.max(20000, baseValue + adjustment);
            const confidence = model.accuracy * (1 - Math.abs(adjustment) / baseValue * 0.1);
            
            this.updateFiresDisplay(prediction, confidence);
            this.updateFiresChart(value, prediction);
            
            this.isCalculating = false;
        }, 500);
    }

    updateDeforestationDisplay(prediction, confidence) {
        // Atualizar valores no card de predição
        const predictionElement = document.querySelector('#deforestation-prediction-value');
        const confidenceElement = document.querySelector('#deforestation-confidence');
        
        if (predictionElement) {
            this.animateNumber(predictionElement, Math.round(prediction));
        }
        
        if (confidenceElement) {
            confidenceElement.textContent = `${(confidence * 100).toFixed(1)}%`;
        }
        
        // Atualizar cor baseado na severidade
        this.updatePredictionSeverity('deforestation', prediction, 45000);
    }

    updateFiresDisplay(prediction, confidence) {
        const predictionElement = document.querySelector('#fires-prediction-value');
        const confidenceElement = document.querySelector('#fires-confidence');
        
        if (predictionElement) {
            this.animateNumber(predictionElement, Math.round(prediction));
        }
        
        if (confidenceElement) {
            confidenceElement.textContent = `${(confidence * 100).toFixed(1)}%`;
        }
        
        this.updatePredictionSeverity('fires', prediction, 89000);
    }

    updatePredictionSeverity(type, prediction, baseline) {
        const card = document.querySelector(`[data-prediction="${type}"]`);
        if (!card) return;
        
        const ratio = prediction / baseline;
        let severity = 'low';
        
        if (ratio > 1.2) severity = 'high';
        else if (ratio > 1.05) severity = 'medium';
        
        // Remover classes anteriores
        card.classList.remove('severity-low', 'severity-medium', 'severity-high');
        card.classList.add(`severity-${severity}`);
    }

    updateDeforestationChart(temperature, prediction) {
        // Atualizar gráfico de predição de desmatamento
        const chartElement = document.getElementById('deforestation-prediction');
        if (!chartElement || !window.Plotly) return;
        
        // Gerar dados para diferentes temperaturas
        const temperatures = [];
        const predictions = [];
        
        for (let t = 25; t <= 30; t += 0.1) {
            temperatures.push(t);
            const tempPrediction = 45000 + (t - 27.0) * 1250.5;
            predictions.push(Math.max(10000, tempPrediction));
        }
        
        const trace = {
            x: temperatures,
            y: predictions,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#dc3545', width: 3 },
            name: 'Predição'
        };
        
        const currentPoint = {
            x: [temperature],
            y: [prediction],
            type: 'scatter',
            mode: 'markers',
            marker: { size: 12, color: '#ff6b35' },
            name: 'Valor Atual'
        };
        
        const layout = {
            title: 'Predição: Temperatura × Desmatamento',
            xaxis: { title: 'Temperatura (°C)' },
            yaxis: { title: 'Desmatamento (km²)' },
            showlegend: false,
            margin: { l: 60, r: 40, t: 60, b: 50 }
        };
        
        Plotly.react(chartElement, [trace, currentPoint], layout);
    }

    updateFiresChart(precipitation, prediction) {
        const chartElement = document.getElementById('fires-prediction');
        if (!chartElement || !window.Plotly) return;
        
        // Gerar dados para diferentes precipitações
        const precipitations = [];
        const predictions = [];
        
        for (let p = 1500; p <= 3000; p += 25) {
            precipitations.push(p);
            const firesPrediction = 89000 + (2200 - p) * 1.5;
            predictions.push(Math.max(20000, firesPrediction));
        }
        
        const trace = {
            x: precipitations,
            y: predictions,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#fd7e14', width: 3 },
            name: 'Predição'
        };
        
        const currentPoint = {
            x: [precipitation],
            y: [prediction],
            type: 'scatter',
            mode: 'markers',
            marker: { size: 12, color: '#dc3545' },
            name: 'Valor Atual'
        };
        
        const layout = {
            title: 'Predição: Precipitação × Queimadas',
            xaxis: { title: 'Precipitação (mm)' },
            yaxis: { title: 'Queimadas' },
            showlegend: false,
            margin: { l: 60, r: 40, t: 60, b: 50 }
        };
        
        Plotly.react(chartElement, [trace, currentPoint], layout);
    }

    updatePredictionCharts() {
        this.createBiodiversityPredictionChart();
        this.createScenariosComparisonChart();
    }

    createBiodiversityPredictionChart() {
        const chartElement = document.getElementById('biodiversity-prediction');
        if (!chartElement || !window.Plotly) return;
        
        const years = [2025, 2026, 2027, 2028, 2029, 2030];
        const scenarios = this.predictionData.scenarios;
        
        const traces = [
            {
                x: years,
                y: [66924, 67200, 67400, 67500, 67600, scenarios.optimistic.predictions_2030.biodiversity],
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Otimista',
                line: { color: '#28a745', width: 3 },
                marker: { size: 8 }
            },
            {
                x: years,
                y: [66924, 66000, 65200, 64500, 63800, scenarios.realistic.predictions_2030.biodiversity],
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Realista',
                line: { color: '#ffc107', width: 3 },
                marker: { size: 8 }
            },
            {
                x: years,
                y: [66924, 65000, 63500, 61800, 59500, scenarios.pessimistic.predictions_2030.biodiversity],
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Pessimista',
                line: { color: '#dc3545', width: 3 },
                marker: { size: 8 }
            }
        ];
        
        const layout = {
            title: 'Predições de Biodiversidade (2030)',
            xaxis: { title: 'Ano' },
            yaxis: { title: 'Número de Espécies' },
            legend: { x: 0, y: 1 },
            margin: { l: 60, r: 40, t: 60, b: 50 }
        };
        
        Plotly.newPlot(chartElement, traces, layout, { responsive: true });
    }

    createScenariosComparisonChart() {
        // Criar gráfico comparativo dos cenários no elemento apropriado
        const scenarios = this.predictionData.scenarios;
        
        // Atualizar valores nos cards dos cenários
        this.updateScenarioCard('optimistic', scenarios.optimistic);
        this.updateScenarioCard('realistic', scenarios.realistic);
        this.updateScenarioCard('pessimistic', scenarios.pessimistic);
    }

    updateScenarioCard(type, scenarioData) {
        const card = document.querySelector(`.scenario-card.${type}`);
        if (!card) return;
        
        // Atualizar valores dinamicamente
        const deforestationEl = card.querySelector('[data-metric="deforestation"]');
        const firesEl = card.querySelector('[data-metric="fires"]');
        const biodiversityEl = card.querySelector('[data-metric="biodiversity"]');
        
        if (deforestationEl) {
            const change = ((scenarioData.predictions_2030.deforestation - 45000) / 45000 * 100).toFixed(0);
            deforestationEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
        }
        
        if (firesEl) {
            const change = ((scenarioData.predictions_2030.fires - 89000) / 89000 * 100).toFixed(0);
            firesEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
        }
        
        if (biodiversityEl) {
            const change = ((scenarioData.predictions_2030.biodiversity - 62341) / 62341 * 100).toFixed(0);
            biodiversityEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
        }
    }

    updatePredictionsForYear(year) {
        // Atualizar predições baseado no ano selecionado na timeline
        if (year >= 2025) {
            const yearsToProject = year - 2025;
            this.projectToYear(2025 + yearsToProject);
        }
    }

    projectToYear(targetYear) {
        const scenarios = this.predictionData.scenarios;
        const realistic = scenarios.realistic;
        
        // Calcular projeções lineares
        const yearProgress = (targetYear - 2025) / 5; // Progresso até 2030
        
        const projectedData = {
            deforestation: 45000 + (realistic.predictions_2030.deforestation - 45000) * yearProgress,
            fires: 89000 + (realistic.predictions_2030.fires - 89000) * yearProgress,
            biodiversity: 66924 + (realistic.predictions_2030.biodiversity - 66924) * yearProgress
        };
        
        // Atualizar displays
        this.updateProjectionDisplays(projectedData, targetYear);
    }

    updateProjectionDisplays(data, year) {
        // Atualizar os resultados de predição
        const species2030 = document.getElementById('species-2030');
        const speciesLoss = document.getElementById('species-loss');
        
        if (species2030) {
            species2030.textContent = Math.round(data.biodiversity).toLocaleString();
        }
        
        if (speciesLoss) {
            const loss = 66924 - data.biodiversity;
            speciesLoss.textContent = loss > 0 ? `-${Math.round(loss).toLocaleString()}` : `+${Math.round(-loss).toLocaleString()}`;
            speciesLoss.className = `result-value ${loss > 0 ? 'warning' : 'success'}`;
        }
    }

    animateNumber(element, targetValue) {
        const startValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = startValue + (targetValue - startValue) * this.easeOutCubic(progress);
            element.textContent = Math.round(currentValue).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Método para calcular métricas de performance do modelo
    calculateModelPerformance() {
        const performance = {};
        
        Object.keys(this.models).forEach(modelName => {
            const model = this.models[modelName];
            const trainingData = this.predictionData.historical;
            
            // Simular cálculo de métricas
            performance[modelName] = {
                accuracy: model.accuracy,
                mse: Math.random() * 1000000, // Mean Squared Error simulado
                mae: Math.random() * 500, // Mean Absolute Error simulado
                r2: model.accuracy,
                training_samples: trainingData.length,
                features: Object.keys(model.coefficients || model.weights || {}).length
            };
        });
        
        return performance;
    }

    // Método para exportar predições
    exportPredictions() {
        const exportData = {
            timestamp: new Date().toISOString(),
            models: this.models,
            scenarios: this.predictionData.scenarios,
            performance: this.calculateModelPerformance(),
            current_parameters: {
                temperature: document.getElementById('temp-slider')?.value || 27.0,
                precipitation: document.getElementById('precip-slider')?.value || 2200
            }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecoguardians-predictions-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Inicializar PredictionsManager
window.addEventListener('DOMContentLoaded', () => {
    window.predictionsManager = new PredictionsManager();
});
