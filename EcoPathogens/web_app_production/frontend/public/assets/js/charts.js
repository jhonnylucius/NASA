// 📊 EcoGuardians - Charts Manager
// Sistema de gráficos interativos com Plotly.js

class ChartsManager {
    constructor() {
        this.charts = new Map();
        this.colors = {
            primary: '#2E8B57',
            secondary: '#228B22',
            accent: '#FF6B35',
            warning: '#FFC107',
            danger: '#DC3545',
            success: '#28A745'
        };
        this.init();
    }

    init() {
        console.log('📊 ChartsManager inicializado');
        this.setupEventListeners();

        // Aguardar dados serem carregados
        window.addEventListener('dataLoaded', (event) => {
            console.log('✅ Dados recebidos via evento dataLoaded');
            this.createAllCharts(event.detail);
        });

        // ✅ FALLBACK: Se dados já existem, usa diretamente
        setTimeout(() => {
            if (window.dataLoader?.historicalData && !this.charts.has('timeline')) {
                console.log('📊 Carregando charts com dados existentes (fallback)');
                this.createAllCharts({
                    historical: window.dataLoader.historicalData,
                    realTime: window.dataLoader.realTimeData
                });
            }
        }, 1000);
    }

    setupEventListeners() {
        // Timeline slider
        const yearSlider = document.getElementById('year-range');
        if (yearSlider) {
            yearSlider.addEventListener('input', (e) => {
                this.updateChartsForYear(parseInt(e.target.value));
            });
        }

        // Prediction sliders
        const tempSlider = document.getElementById('temp-slider');
        if (tempSlider) {
            tempSlider.addEventListener('input', (e) => {
                this.updatePredictions('temperature', parseFloat(e.target.value));
            });
        }

        const precipSlider = document.getElementById('precip-slider');
        if (precipSlider) {
            precipSlider.addEventListener('input', (e) => {
                this.updatePredictions('precipitation', parseInt(e.target.value));
            });
        }

        // ✅ NOVO: Controles da Timeline (Play/Pause/Reset)
        this.setupTimelineControls();
    }

    setupTimelineControls() {
        const playBtn = document.getElementById('play-timeline');
        const pauseBtn = document.getElementById('pause-timeline');
        const resetBtn = document.getElementById('reset-timeline');
        const yearSlider = document.getElementById('year-range');

        this.timelineInterval = null;
        this.isPlaying = false;

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (!this.isPlaying) {
                    console.log('▶️ Play timeline');
                    this.isPlaying = true;
                    this.timelineInterval = setInterval(() => {
                        const current = parseInt(yearSlider.value);
                        if (current >= 2025) {
                            yearSlider.value = 1975;
                        } else {
                            yearSlider.value = current + 1;
                        }
                        this.updateChartsForYear(parseInt(yearSlider.value));
                    }, 500); // Avança 1 ano a cada 500ms
                }
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                console.log('⏸️ Pause timeline');
                this.isPlaying = false;
                if (this.timelineInterval) {
                    clearInterval(this.timelineInterval);
                    this.timelineInterval = null;
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                console.log('🔄 Reset timeline');
                this.isPlaying = false;
                if (this.timelineInterval) {
                    clearInterval(this.timelineInterval);
                    this.timelineInterval = null;
                }
                yearSlider.value = 1975;
                this.updateChartsForYear(1975);
            });
        }
    }

    createAllCharts(data) {
        if (!data.historical) return;

        // Gráficos das métricas
        this.createDeforestationChart(data.historical);
        this.createFiresChart(data.historical);
        this.createTemperatureChart(data.historical);
        this.createBiodiversityChart(data.historical);

        // Gráfico da timeline
        this.createTimelineChart(data.historical);

        // Gráficos de predição
        this.createPredictionCharts(data.historical);

        // Gráfico hero
        this.createHeroChart(data.historical);
    }

    createDeforestationChart(data) {
        const element = document.getElementById('deforestation-chart');
        if (!element) return;

        const years = data.slice(-10).map(d => d.year);
        const values = data.slice(-10).map(d => d.deforestation);

        const trace = {
            x: years,
            y: values,
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: this.colors.danger, width: 3 },
            marker: { size: 8, color: this.colors.danger },
            name: 'Desmatamento (km²)',
            hovertemplate: '%{y:,.0f} km²<br>%{x}<extra></extra>'
        };

        const layout = {
            showlegend: false,
            margin: { l: 40, r: 20, t: 20, b: 40 },
            xaxis: { showgrid: false, zeroline: false },
            yaxis: { showgrid: true, zeroline: false, gridcolor: '#f0f0f0' },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Open Sans', size: 12 }
        };

        Plotly.newPlot(element, [trace], layout, {
            responsive: true,
            displayModeBar: false
        });

        this.charts.set('deforestation', { element, trace, layout });
    }

    createFiresChart(data) {
        const element = document.getElementById('fires-chart');
        if (!element) return;

        const years = data.slice(-10).map(d => d.year);
        const values = data.slice(-10).map(d => d.fires);

        const trace = {
            x: years,
            y: values,
            type: 'bar',
            marker: {
                color: values.map(v => v > 80000 ? this.colors.danger : this.colors.warning),
                line: { width: 0 }
            },
            name: 'Focos de Queimadas',
            hovertemplate: '%{y:,.0f} focos<br>%{x}<extra></extra>'
        };

        const layout = {
            showlegend: false,
            margin: { l: 40, r: 20, t: 20, b: 40 },
            xaxis: { showgrid: false, zeroline: false },
            yaxis: { showgrid: true, zeroline: false, gridcolor: '#f0f0f0' },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Open Sans', size: 12 }
        };

        Plotly.newPlot(element, [trace], layout, {
            responsive: true,
            displayModeBar: false
        });

        this.charts.set('fires', { element, trace, layout });
    }

    createTemperatureChart(data) {
        const element = document.getElementById('temperature-chart');
        if (!element) return;

        const years = data.slice(-20).map(d => d.year);
        const values = data.slice(-20).map(d => d.temperature);
        const baseline = 25.5;

        const trace = {
            x: years,
            y: values.map(v => v - baseline),
            type: 'scatter',
            mode: 'lines',
            fill: 'tonexty',
            line: { color: this.colors.accent, width: 2 },
            fillcolor: `${this.colors.accent}20`,
            name: 'Anomalia de Temperatura',
            hovertemplate: '+%{y:.1f}°C<br>%{x}<extra></extra>'
        };

        const layout = {
            showlegend: false,
            margin: { l: 40, r: 20, t: 20, b: 40 },
            xaxis: { showgrid: false, zeroline: false },
            yaxis: {
                showgrid: true,
                zeroline: true,
                zerolinecolor: '#ccc',
                gridcolor: '#f0f0f0',
                title: 'Anomalia (°C)'
            },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Open Sans', size: 12 }
        };

        Plotly.newPlot(element, [trace], layout, {
            responsive: true,
            displayModeBar: false
        });

        this.charts.set('temperature', { element, trace, layout });
    }

    createBiodiversityChart(data) {
        const element = document.getElementById('biodiversity-chart');
        if (!element) return;

        const years = data.slice(-15).map(d => d.year);
        const values = data.slice(-15).map(d => d.biodiversity);

        const trace = {
            x: years,
            y: values,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: this.colors.success,
                width: 3,
                shape: 'spline',
                smoothing: 1.3
            },
            marker: { size: 6, color: this.colors.success },
            name: 'Espécies Estimadas',
            hovertemplate: '%{y:,.0f} espécies<br>%{x}<extra></extra>'
        };

        const layout = {
            showlegend: false,
            margin: { l: 40, r: 20, t: 20, b: 40 },
            xaxis: { showgrid: false, zeroline: false },
            yaxis: {
                showgrid: true,
                zeroline: false,
                gridcolor: '#f0f0f0',
                tickformat: '.0s'
            },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Open Sans', size: 12 }
        };

        Plotly.newPlot(element, [trace], layout, {
            responsive: true,
            displayModeBar: false
        });

        this.charts.set('biodiversity', { element, trace, layout });
    }

    createTimelineChart(data) {
        const element = document.getElementById('timeline-chart');
        if (!element) {
            console.warn('⚠️ Elemento #timeline-chart não encontrado');
            return;
        }

        if (!data || data.length === 0) {
            console.warn('⚠️ Dados vazios para timeline');
            element.innerHTML = `
                <div style="padding: 60px 20px; text-align: center; color: #666; background: #f5f5f5; border-radius: 8px;">
                    <div style="font-size: 48px; margin-bottom: 15px;">⌛</div>
                    <p style="font-size: 16px; margin: 0;">Aguardando dados da timeline...</p>
                </div>
            `;
            return;
        }

        console.log(`📊 Criando timeline com ${data.length} pontos de dados`);

        const years = data.map(d => d.year);
        const deforestation = data.map(d => d.deforestation);
        const fires = data.map(d => d.fires / 10); // Escalar para visualização
        const temperature = data.map(d => (d.temperature - 25) * 1000); // Escalar anomalia

        const traces = [
            {
                x: years,
                y: deforestation,
                type: 'scatter',
                mode: 'lines',
                name: 'Desmatamento',
                line: { color: this.colors.danger, width: 2 },
                yaxis: 'y',
                hovertemplate: '%{y:,.0f} km²<br>%{x}<extra></extra>'
            },
            {
                x: years,
                y: fires,
                type: 'scatter',
                mode: 'lines',
                name: 'Queimadas (÷10)',
                line: { color: this.colors.warning, width: 2 },
                yaxis: 'y2',
                hovertemplate: '%{y:,.0f} focos<br>%{x}<extra></extra>'
            },
            {
                x: years,
                y: temperature,
                type: 'scatter',
                mode: 'lines',
                name: 'Temp. Anomalia (×1000)',
                line: { color: this.colors.accent, width: 2 },
                yaxis: 'y3',
                hovertemplate: '%{y:,.0f}<br>%{x}<extra></extra>'
            }
        ];

        const layout = {
            title: '50 Anos de Dados Ambientais da Amazônia',
            xaxis: { title: 'Ano', range: [1975, 2025] },
            yaxis: { title: 'Desmatamento (km²)', side: 'left' },
            yaxis2: { title: 'Queimadas', side: 'right', overlaying: 'y' },
            yaxis3: { overlaying: 'y', side: 'right', position: 0.9 },
            legend: { x: 0, y: 1 },
            margin: { l: 60, r: 60, t: 50, b: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Open Sans', size: 12 }
        };

        Plotly.newPlot(element, traces, layout, {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToAdd: ['pan2d', 'lasso2d']
        });

        this.charts.set('timeline', { element, traces, layout });
        console.log('✅ Timeline chart criado com sucesso');

        // ✅ Inicializa mostrando apenas dados até o ano do slider
        const yearSlider = document.getElementById('year-range');
        if (yearSlider) {
            const currentYear = parseInt(yearSlider.value);
            this.updateChartsForYear(currentYear);
        }
    }

    createPredictionCharts(data) {
        this.createDeforestationPrediction(data);
        this.createFiresPrediction(data);
        this.createBiodiversityPrediction(data);
    }

    createDeforestationPrediction(data) {
        const element = document.getElementById('deforestation-prediction');
        if (!element) return;

        // Dados históricos recentes
        const historicalYears = data.slice(-10).map(d => d.year);
        const historicalValues = data.slice(-10).map(d => d.deforestation);

        // Predições
        const futureYears = [2026, 2027, 2028, 2029, 2030];
        const predictions = [42000, 43500, 44200, 44800, 45000];
        const upperBound = predictions.map(p => p * 1.2);
        const lowerBound = predictions.map(p => p * 0.8);

        const traces = [
            {
                x: historicalYears,
                y: historicalValues,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Dados Históricos',
                line: { color: this.colors.primary, width: 3 },
                marker: { size: 8 }
            },
            {
                x: futureYears,
                y: predictions,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Predição IA',
                line: { color: this.colors.accent, width: 3, dash: 'dash' },
                marker: { size: 10, symbol: 'diamond' }
            },
            {
                x: futureYears,
                y: upperBound,
                type: 'scatter',
                mode: 'lines',
                name: 'Limite Superior',
                line: { width: 0 },
                showlegend: false,
                hoverinfo: 'skip'
            },
            {
                x: futureYears,
                y: lowerBound,
                type: 'scatter',
                mode: 'lines',
                name: 'Intervalo de Confiança',
                line: { width: 0 },
                fill: 'tonexty',
                fillcolor: `${this.colors.accent}20`
            }
        ];

        const layout = {
            title: 'Predição de Desmatamento até 2030',
            xaxis: { title: 'Ano' },
            yaxis: { title: 'Desmatamento (km²)' },
            margin: { l: 60, r: 40, t: 60, b: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Open Sans', size: 12 }
        };

        Plotly.newPlot(element, traces, layout, {
            responsive: true,
            displayModeBar: false
        });

        this.charts.set('deforestation-prediction', { element, traces, layout });
    }

    createFiresPrediction(data) {
        const element = document.getElementById('fires-prediction');
        if (!element) return;

        // Dados de precipitação vs queimadas
        const precipitation = data.slice(-20).map(d => d.precipitation);
        const fires = data.slice(-20).map(d => d.fires);

        const trace = {
            x: precipitation,
            y: fires,
            type: 'scatter',
            mode: 'markers',
            marker: {
                size: 12,
                color: fires,
                colorscale: 'YlOrRd',
                showscale: true,
                colorbar: { title: 'Queimadas' }
            },
            name: 'Precipitação vs Queimadas',
            hovertemplate: 'Precipitação: %{x:.0f}mm<br>Queimadas: %{y:,.0f}<extra></extra>'
        };

        // Linha de tendência
        const { slope, intercept } = this.linearRegression(precipitation, fires);
        const trendLine = {
            x: [Math.min(...precipitation), Math.max(...precipitation)],
            y: [
                Math.min(...precipitation) * slope + intercept,
                Math.max(...precipitation) * slope + intercept
            ],
            type: 'scatter',
            mode: 'lines',
            name: 'Tendência',
            line: { color: this.colors.danger, width: 3, dash: 'dash' }
        };

        const layout = {
            title: 'Relação: Precipitação × Queimadas',
            xaxis: { title: 'Precipitação (mm)' },
            yaxis: { title: 'Queimadas' },
            margin: { l: 60, r: 40, t: 60, b: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Open Sans', size: 12 }
        };

        Plotly.newPlot(element, [trace, trendLine], layout, {
            responsive: true,
            displayModeBar: false
        });

        this.charts.set('fires-prediction', { element, traces: [trace, trendLine], layout });
    }

    createBiodiversityPrediction(data) {
        const element = document.getElementById('biodiversity-prediction');
        if (!element) return;

        // Cenários de biodiversidade
        const years = [2025, 2026, 2027, 2028, 2029, 2030];
        const optimistic = [66924, 67200, 67400, 67500, 67600, 68000];
        const realistic = [66924, 66000, 65200, 64500, 63800, 62341];
        const pessimistic = [66924, 65000, 63500, 61800, 59500, 57000];

        const traces = [
            {
                x: years,
                y: optimistic,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Cenário Otimista',
                line: { color: this.colors.success, width: 3 },
                marker: { size: 8 }
            },
            {
                x: years,
                y: realistic,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Cenário Realista',
                line: { color: this.colors.warning, width: 3 },
                marker: { size: 8 }
            },
            {
                x: years,
                y: pessimistic,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Cenário Pessimista',
                line: { color: this.colors.danger, width: 3 },
                marker: { size: 8 }
            }
        ];

        const layout = {
            title: 'Predições de Biodiversidade por Cenário',
            xaxis: { title: 'Ano' },
            yaxis: { title: 'Número de Espécies' },
            margin: { l: 60, r: 40, t: 60, b: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Open Sans', size: 12 }
        };

        Plotly.newPlot(element, traces, layout, {
            responsive: true,
            displayModeBar: false
        });

        this.charts.set('biodiversity-prediction', { element, traces, layout });
    }

    createHeroChart(data) {
        const element = document.getElementById('hero-chart');
        if (!element) return;

        // Mini gráfico para o hero
        const years = data.slice(-5).map(d => d.year);
        const values = data.slice(-5).map(d => d.deforestation);

        const trace = {
            x: years,
            y: values,
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: 'rgba(255, 255, 255, 0.8)', width: 3 },
            marker: { size: 8, color: 'white' },
            hovertemplate: '%{y:,.0f} km²<br>%{x}<extra></extra>'
        };

        const layout = {
            showlegend: false,
            margin: { l: 20, r: 20, t: 20, b: 20 },
            xaxis: { showgrid: false, zeroline: false, showticklabels: false },
            yaxis: { showgrid: false, zeroline: false, showticklabels: false },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent'
        };

        Plotly.newPlot(element, [trace], layout, {
            responsive: true,
            displayModeBar: false
        });

        this.charts.set('hero', { element, trace, layout });
    }

    updateChartsForYear(year) {
        const yearDisplay = document.getElementById('current-year');
        if (yearDisplay) {
            yearDisplay.textContent = year;
        }

        // ✅ ANIMAÇÃO PROGRESSIVA: Atualiza gráfico mostrando apenas dados até o ano atual
        if (this.charts.has('timeline') && window.dataLoader?.historicalData) {
            const timelineChart = this.charts.get('timeline');
            const element = timelineChart.element;

            if (element) {
                // Filtra dados até o ano atual
                const dataUpToYear = window.dataLoader.historicalData.filter(d => d.year <= year);

                const years = dataUpToYear.map(d => d.year);
                const deforestation = dataUpToYear.map(d => d.deforestation);
                const fires = dataUpToYear.map(d => d.fires / 10);
                const temperature = dataUpToYear.map(d => (d.temperature - 25) * 1000);

                // Atualiza os dados do gráfico (animação das linhas)
                Plotly.restyle(element, {
                    x: [years, years, years],
                    y: [deforestation, fires, temperature]
                }, [0, 1, 2]);

                // Adiciona linha vertical mostrando o ano atual
                Plotly.relayout(element, {
                    shapes: [{
                        type: 'line',
                        x0: year,
                        x1: year,
                        y0: 0,
                        y1: 1,
                        yref: 'paper',
                        line: {
                            color: '#FF6B35',
                            width: 3,
                            dash: 'dash'
                        }
                    }],
                    annotations: [{
                        x: year,
                        y: 1.05,
                        yref: 'paper',
                        text: `<b>${year}</b>`,
                        showarrow: false,
                        font: {
                            size: 16,
                            color: '#FF6B35',
                            family: 'Open Sans'
                        },
                        bgcolor: 'rgba(255,255,255,0.9)',
                        bordercolor: '#FF6B35',
                        borderwidth: 2,
                        borderpad: 4
                    }]
                });
            }
        }

        // Atualizar dados baseado no ano
        if (window.dataLoader) {
            const yearData = window.dataLoader.getDataForYear(year);
            if (yearData) {
                this.updateMetricCardsForYear(yearData);
            }
        }
    }

    updateMetricCardsForYear(yearData) {
        // Atualizar valores dos cards baseado no ano
        const deforestValue = document.querySelector('[data-metric="deforestation"] .metric-value');
        if (deforestValue) {
            deforestValue.textContent = Math.round(yearData.deforestation).toLocaleString();
        }

        const firesValue = document.querySelector('[data-metric="fires"] .metric-value');
        if (firesValue) {
            firesValue.textContent = Math.round(yearData.fires).toLocaleString();
        }

        const tempValue = document.querySelector('[data-metric="temperature"] .metric-value');
        if (tempValue) {
            const anomaly = yearData.temperature - 25.5;
            tempValue.textContent = anomaly > 0 ? `+${anomaly.toFixed(1)}` : anomaly.toFixed(1);
        }

        const bioValue = document.querySelector('[data-metric="biodiversity"] .metric-value');
        if (bioValue) {
            bioValue.textContent = Math.round(yearData.biodiversity).toLocaleString();
        }
    }

    updatePredictions(type, value) {
        const valueDisplay = document.getElementById(`${type === 'temperature' ? 'temp' : 'precip'}-value`);
        if (valueDisplay) {
            valueDisplay.textContent = type === 'temperature' ? value.toFixed(1) : value;
        }

        // Recalcular predições baseado no novo valor
        // Implementar lógica específica para cada tipo de predição
    }

    linearRegression(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
        const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return { slope, intercept };
    }

    // Método para redimensionar todos os gráficos
    resizeCharts() {
        this.charts.forEach(chart => {
            if (chart.element) {
                Plotly.Plots.resize(chart.element);
            }
        });
    }
}

// Inicializar ChartsManager
window.addEventListener('DOMContentLoaded', () => {
    window.chartsManager = new ChartsManager();

    // Redimensionar gráficos quando a janela mudar de tamanho
    window.addEventListener('resize', () => {
        if (window.chartsManager) {
            window.chartsManager.resizeCharts();
        }
    });
});
