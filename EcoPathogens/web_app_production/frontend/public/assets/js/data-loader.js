// 📊 EcoGuardians - Data Loader
// Sistema de carregamento e gerenciamento de dados

class DataLoader {
    constructor() {
        this.baseURL = window.EcoConfig?.API_BASE_URL || 'http://localhost:5000';
        this.cache = new Map();
        this.isLoading = false;
        this.historicalData = null;
        this.realTimeData = null;
        this.init();
    }

    async init() {
        console.log('📊 DataLoader inicializado');
        await this.loadInitialData();
    }

    async loadInitialData() {
        this.isLoading = true;
        
        try {
            // Carregar dados históricos
            this.historicalData = await this.generateHistoricalData();
            
            // Carregar dados em tempo real (simulados)
            this.realTimeData = await this.generateRealTimeData();
            
            // Atualizar UI
            this.updateUI();
            
            console.log('✅ Dados iniciais carregados');
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar dados da API, usando dados simulados:', error);
            this.useSimulatedData();
        } finally {
            this.isLoading = false;
        }
    }

    async generateHistoricalData() {
        const data = [];
        const startYear = 1975;
        const endYear = 2025;
        
        for (let year = startYear; year <= endYear; year++) {
            const progress = (year - startYear) / (endYear - startYear);
            
            data.push({
                year: year,
                deforestation: this.calculateDeforestation(year, progress),
                fires: this.calculateFires(year, progress),
                temperature: this.calculateTemperature(year, progress),
                precipitation: this.calculatePrecipitation(year, progress),
                biodiversity: this.calculateBiodiversity(year, progress)
            });
        }
        
        return data;
    }

    calculateDeforestation(year, progress) {
        // Simulação baseada em dados reais da Amazônia
        const baseValue = 8000;
        const cyclical = Math.sin((year - 1975) * 0.3) * 3000;
        const trend = progress * 5000;
        const random = (Math.random() - 0.5) * 2000;
        
        return Math.max(1000, baseValue + cyclical + trend + random);
    }

    calculateFires(year, progress) {
        const baseValue = 50000;
        const cyclical = Math.sin((year - 1975) * 0.4) * 20000;
        const trend = progress * 30000;
        const random = (Math.random() - 0.5) * 15000;
        
        return Math.max(10000, baseValue + cyclical + trend + random);
    }

    calculateTemperature(year, progress) {
        const baseTemp = 25.5;
        const warming = progress * 2.5; // +2.5°C em 50 anos
        const variation = Math.sin((year - 1975) * 0.2) * 0.3;
        const random = (Math.random() - 0.5) * 0.2;
        
        return baseTemp + warming + variation + random;
    }

    calculatePrecipitation(year, progress) {
        const basePrecip = 2000;
        const trend = -progress * 200; // Diminuição das chuvas
        const cyclical = Math.sin((year - 1975) * 0.5) * 300;
        const random = (Math.random() - 0.5) * 200;
        
        return Math.max(1000, basePrecip + trend + cyclical + random);
    }

    calculateBiodiversity(year, progress) {
        const baseSpecies = 100000;
        const loss = progress * 35000; // Perda de espécies
        const random = (Math.random() - 0.5) * 2000;
        
        return Math.max(60000, baseSpecies - loss + random);
    }

    async generateRealTimeData() {
        return {
            deforestation: {
                current: 758470,
                monthly: 15420,
                trend: '+23%',
                alerts: 1247
            },
            fires: {
                current: 2211979,
                daily: 892,
                trend: '+15%',
                active: 234
            },
            temperature: {
                current: 28.7,
                anomaly: +1.3,
                trend: 'rising',
                lastUpdate: new Date().toISOString()
            },
            biodiversity: {
                species: 66924,
                threatened: 4583,
                endemic: 12450,
                newDiscoveries: 127
            }
        };
    }

    useSimulatedData() {
        // Dados simulados como fallback
        window.ecoData = {
            historical: this.historicalData,
            realTime: this.realTimeData,
            predictions: this.generatePredictions(),
            gallery: this.generateGalleryData()
        };
        
        this.updateUI();
    }

    generatePredictions() {
        return {
            deforestation: {
                2030: 45000,
                confidence: 0.85,
                factors: ['temperature', 'precipitation', 'policy'],
                scenarios: {
                    optimistic: 25000,
                    realistic: 45000,
                    pessimistic: 65000
                }
            },
            fires: {
                2030: 89000,
                confidence: 0.78,
                factors: ['drought', 'temperature', 'deforestation'],
                scenarios: {
                    optimistic: 55000,
                    realistic: 89000,
                    pessimistic: 125000
                }
            },
            biodiversity: {
                species2030: 62341,
                lossEstimate: 4583,
                confidence: 0.92,
                criticalThreshold: 55000
            }
        };
    }

    generateGalleryData() {
        const categories = ['deforestation', 'fires', 'floods', 'drought', 'pollution'];
        const images = [];
        
        for (let i = 1; i <= 128; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            images.push({
                id: i,
                src: `assets/images/disasters/disaster_${i.toString().padStart(3, '0')}.jpg`,
                title: `Impacto Ambiental #${i}`,
                description: `Registro de ${category} na região amazônica`,
                category: category,
                year: 1975 + Math.floor(Math.random() * 50),
                location: this.getRandomLocation(),
                coordinates: this.getRandomCoordinates()
            });
        }
        
        return images;
    }

    getRandomLocation() {
        const locations = [
            'Acre', 'Amazonas', 'Amapá', 'Maranhão', 'Mato Grosso',
            'Pará', 'Rondônia', 'Roraima', 'Tocantins'
        ];
        return locations[Math.floor(Math.random() * locations.length)];
    }

    getRandomCoordinates() {
        return {
            lat: -10 + Math.random() * 15, // Latitude da Amazônia
            lng: -75 + Math.random() * 20  // Longitude da Amazônia
        };
    }

    updateUI() {
        // Disparar evento para outros componentes
        window.dispatchEvent(new CustomEvent('dataLoaded', {
            detail: {
                historical: this.historicalData,
                realTime: this.realTimeData
            }
        }));
        
        // Atualizar elementos da interface
        this.updateMetricCards();
        this.updateHeroStats();
    }

    updateMetricCards() {
        if (!this.realTimeData) return;
        
        // Desmatamento
        const deforestCard = document.querySelector('[data-metric="deforestation"] .metric-value');
        if (deforestCard) {
            this.animateNumber(deforestCard, this.realTimeData.deforestation.current);
        }
        
        // Queimadas
        const firesCard = document.querySelector('[data-metric="fires"] .metric-value');
        if (firesCard) {
            this.animateNumber(firesCard, this.realTimeData.fires.current);
        }
        
        // Temperatura
        const tempCard = document.querySelector('[data-metric="temperature"] .metric-value');
        if (tempCard) {
            tempCard.textContent = `+${this.realTimeData.temperature.anomaly}`;
        }
        
        // Biodiversidade
        const bioCard = document.querySelector('[data-metric="biodiversity"] .metric-value');
        if (bioCard) {
            this.animateNumber(bioCard, this.realTimeData.biodiversity.species);
        }
    }

    updateHeroStats() {
        if (!this.realTimeData) return;
        
        const statValues = document.querySelectorAll('.stat-value');
        const values = [
            this.realTimeData.deforestation.current,
            this.realTimeData.temperature.anomaly,
            7 // Número de modelos IA
        ];
        
        statValues.forEach((element, index) => {
            if (values[index] !== undefined) {
                this.animateNumber(element, values[index]);
            }
        });
    }

    animateNumber(element, targetValue) {
        const startValue = 0;
        const duration = 2000; // 2 segundos
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = startValue + (targetValue - startValue) * this.easeOutCubic(progress);
            
            if (targetValue < 10) {
                element.textContent = currentValue.toFixed(1);
            } else {
                element.textContent = Math.round(currentValue).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Métodos para acessar dados específicos
    getDataForYear(year) {
        if (!this.historicalData) return null;
        return this.historicalData.find(d => d.year === year);
    }

    getDataRange(startYear, endYear) {
        if (!this.historicalData) return [];
        return this.historicalData.filter(d => d.year >= startYear && d.year <= endYear);
    }

    getCurrentMetrics() {
        return this.realTimeData;
    }

    // Cache management
    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    getCache(key, maxAge = 300000) { // 5 minutos default
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < maxAge) {
            return cached.data;
        }
        return null;
    }
}

// Inicializar DataLoader
window.addEventListener('DOMContentLoaded', () => {
    window.dataLoader = new DataLoader();
});
