// 🔥 NASA FIRMS Fire Hotspot Monitor
// Sistema de monitoramento de focos de queimadas em tempo real

class FIRMSManager {
    constructor() {
        // API Configuration
        // API Configuration
        // this.apiBase = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';
        this.apiBase = 'http://83.147.37.100:8081/api/nasa/firms'; // VPS Java Proxy


        this.mapKey = '02a6b6ad3f23a3af3fe8d8ba432a8c9b';

        // Amazon Legal bounding box: west,south,east,north
        this.amazonBounds = '-74,-18,-44,6';
        this.brazilBounds = '-74,-34,-34,6';

        // Available sensors
        this.sensors = {
            'VIIRS_NOAA20_NRT': { name: 'VIIRS NOAA-20', color: '#FF4500', active: true },
            'VIIRS_NOAA21_NRT': { name: 'VIIRS NOAA-21', color: '#FF6347', active: false },
            'VIIRS_SNPP_NRT': { name: 'VIIRS Suomi-NPP', color: '#FF8C00', active: false },
            'MODIS_NRT': { name: 'MODIS Terra/Aqua', color: '#FFD700', active: false }
        };

        // State
        this.map = null;
        this.fireMarkers = [];
        this.fireData = [];
        this.currentSensor = 'VIIRS_NOAA20_NRT';
        this.currentDays = 1;
        this.isLoading = false;

        // DOM Elements
        this.mapElement = document.getElementById('firms-map');
        this.statsContainer = document.getElementById('firms-stats');
        this.loadingElement = document.getElementById('firms-loading');

        // Brazilian states for statistics
        this.brazilStates = {
            'AC': { name: 'Acre', lat: -9.0, lon: -70.0 },
            'AP': { name: 'Amapá', lat: 1.0, lon: -52.0 },
            'AM': { name: 'Amazonas', lat: -3.5, lon: -64.0 },
            'MT': { name: 'Mato Grosso', lat: -12.5, lon: -55.0 },
            'MA': { name: 'Maranhão', lat: -5.0, lon: -45.0 },
            'PA': { name: 'Pará', lat: -3.0, lon: -52.0 },
            'RO': { name: 'Rondônia', lat: -11.0, lon: -63.0 },
            'RR': { name: 'Roraima', lat: 2.0, lon: -61.0 },
            'TO': { name: 'Tocantins', lat: -10.0, lon: -48.0 }
        };

        this.init();
    }

    init() {
        console.log('🔥 Inicializando FIRMS Manager...');

        if (!this.mapElement) {
            console.warn('⚠️ Elemento #firms-map não encontrado');
            return;
        }

        if (typeof L === 'undefined') {
            console.error('❌ Leaflet não está carregado');
            return;
        }

        this.initializeMap();
        this.setupControls();
        this.loadFireData();
    }

    initializeMap() {
        // Centro da Amazônia
        const amazonCenter = [-5.0, -58.0];

        this.map = L.map('firms-map', {
            center: amazonCenter,
            zoom: 4,
            minZoom: 3,
            maxZoom: 12
        });

        // Tile layer - Dark style para destacar os focos de fogo
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | NASA FIRMS',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        // Adiciona contorno da Amazônia Legal
        this.addAmazonBoundary();

        console.log('🗺️ Mapa FIRMS inicializado');
    }

    addAmazonBoundary() {
        const amazonLegalCoords = [
            [-18.03, -42.91],
            [-5.16, -42.91],
            [5.16, -48.90],
            [5.16, -60.64],
            [2.81, -73.99],
            [-7.53, -73.99],
            [-18.03, -57.64],
            [-18.03, -42.91]
        ];

        L.polygon(amazonLegalCoords, {
            color: '#00ff88',
            fillColor: '#00ff88',
            fillOpacity: 0.05,
            weight: 2,
            dashArray: '8, 5'
        }).addTo(this.map).bindPopup('🌳 Amazônia Legal - Área de Monitoramento');
    }

    setupControls() {
        // Sensor selector
        const sensorSelect = document.getElementById('firms-sensor');
        if (sensorSelect) {
            sensorSelect.addEventListener('change', (e) => {
                this.currentSensor = e.target.value;
                this.loadFireData();
            });
        }

        // Days selector
        const daysSelect = document.getElementById('firms-days');
        if (daysSelect) {
            daysSelect.addEventListener('change', (e) => {
                this.currentDays = parseInt(e.target.value);
                this.loadFireData();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('firms-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadFireData());
        }

        // Focus Amazon button
        const focusAmazonBtn = document.getElementById('firms-focus-amazon');
        if (focusAmazonBtn) {
            focusAmazonBtn.addEventListener('click', () => {
                this.map.setView([-5.0, -58.0], 5);
            });
        }

        console.log('🎮 Controles FIRMS configurados');
    }

    async loadFireData() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoading(true);

        console.log(`📡 Buscando dados de queimadas (${this.currentSensor}, ${this.currentDays} dias)...`);

        try {
            // Build API URL
            const url = `${this.apiBase}/${this.mapKey}/${this.currentSensor}/${this.brazilBounds}/${this.currentDays}`;

            console.log('🔗 URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const csvText = await response.text();
            this.fireData = this.parseCSV(csvText);

            console.log(`✅ ${this.fireData.length} focos de queimadas carregados`);

            this.renderFireMarkers();
            this.updateStatistics();

        } catch (error) {
            console.error('❌ Erro ao carregar dados FIRMS:', error);
            this.showError('Erro ao carregar dados de queimadas');
        } finally {
            this.isLoading = false;
            this.showLoading(false);
        }
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',');
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const row = {};

            headers.forEach((header, index) => {
                row[header.trim()] = values[index]?.trim();
            });

            // Parse numeric values
            if (row.latitude && row.longitude) {
                row.lat = parseFloat(row.latitude);
                row.lon = parseFloat(row.longitude);
                row.frp = parseFloat(row.frp) || 0; // Fire Radiative Power
                row.brightness = parseFloat(row.bright_ti4 || row.brightness) || 0;
                row.confidence = row.confidence || 'nominal';
                data.push(row);
            }
        }

        return data;
    }

    renderFireMarkers() {
        // Clear existing markers
        this.fireMarkers.forEach(marker => this.map.removeLayer(marker));
        this.fireMarkers = [];

        // Create layer group for clustering
        const fireLayer = L.layerGroup();

        this.fireData.forEach(fire => {
            const color = this.getFireColor(fire.frp);
            const radius = this.getFireRadius(fire.frp);

            const marker = L.circleMarker([fire.lat, fire.lon], {
                radius: radius,
                fillColor: color,
                color: '#ffffff',
                weight: 1,
                opacity: 0.9,
                fillOpacity: 0.8
            });

            marker.bindPopup(this.createFirePopup(fire));

            fireLayer.addLayer(marker);
            this.fireMarkers.push(marker);
        });

        fireLayer.addTo(this.map);

        console.log(`🔥 ${this.fireMarkers.length} marcadores renderizados`);
    }

    getFireColor(frp) {
        // Fire Radiative Power colorscale
        if (frp > 100) return '#ff0000';      // Extreme
        if (frp > 50) return '#ff4500';       // High
        if (frp > 20) return '#ff8c00';       // Medium-High
        if (frp > 10) return '#ffa500';       // Medium
        if (frp > 5) return '#ffd700';        // Low-Medium
        return '#ffff00';                      // Low
    }

    getFireRadius(frp) {
        // Scale radius based on FRP
        if (frp > 100) return 8;
        if (frp > 50) return 7;
        if (frp > 20) return 6;
        if (frp > 10) return 5;
        return 4;
    }

    createFirePopup(fire) {
        const date = fire.acq_date || 'N/A';
        const time = fire.acq_time || 'N/A';
        const confidence = this.getConfidenceLabel(fire.confidence);
        const confidenceColor = this.getConfidenceColor(fire.confidence);

        return `
            <div style="text-align: center; min-width: 200px;">
                <h4 style="margin: 0 0 10px 0; color: #ff4500;">🔥 Foco de Queimada</h4>
                <hr style="border-color: #ff4500; opacity: 0.3;">
                <p><strong>📅 Data:</strong> ${date}</p>
                <p><strong>🕐 Hora:</strong> ${time} UTC</p>
                <p><strong>📍 Coordenadas:</strong><br>${fire.lat.toFixed(4)}°, ${fire.lon.toFixed(4)}°</p>
                <p><strong>🔥 Potência (FRP):</strong> ${fire.frp.toFixed(1)} MW</p>
                <p><strong>🌡️ Brilho:</strong> ${fire.brightness.toFixed(1)} K</p>
                <p><strong>📊 Confiança:</strong> <span style="color: ${confidenceColor}; font-weight: bold;">${confidence}</span></p>
                <hr style="border-color: #ff4500; opacity: 0.3;">
                <p style="font-size: 11px; color: #888;">
                    <em>Fonte: NASA FIRMS - ${this.sensors[this.currentSensor]?.name || 'VIIRS'}</em>
                </p>
            </div>
        `;
    }

    getConfidenceLabel(confidence) {
        const labels = {
            'l': 'Baixa',
            'low': 'Baixa',
            'n': 'Nominal',
            'nominal': 'Nominal',
            'h': 'Alta',
            'high': 'Alta'
        };
        return labels[confidence?.toLowerCase()] || confidence || 'N/A';
    }

    getConfidenceColor(confidence) {
        const colors = {
            'l': '#ffa500',
            'low': '#ffa500',
            'n': '#ffff00',
            'nominal': '#ffff00',
            'h': '#00ff00',
            'high': '#00ff00'
        };
        return colors[confidence?.toLowerCase()] || '#ffffff';
    }

    updateStatistics() {
        // Total fires
        const totalFires = this.fireData.length;
        const totalFiresEl = document.getElementById('firms-total-fires');
        if (totalFiresEl) {
            this.animateNumber(totalFiresEl, totalFires);
        }

        // Average FRP
        const avgFRP = this.fireData.length > 0
            ? this.fireData.reduce((sum, f) => sum + f.frp, 0) / this.fireData.length
            : 0;
        const avgFRPEl = document.getElementById('firms-avg-frp');
        if (avgFRPEl) {
            avgFRPEl.textContent = `${avgFRP.toFixed(1)} MW`;
        }

        // High confidence fires
        const highConfidence = this.fireData.filter(f =>
            f.confidence === 'h' || f.confidence === 'high'
        ).length;
        const highConfEl = document.getElementById('firms-high-confidence');
        if (highConfEl) {
            this.animateNumber(highConfEl, highConfidence);
        }

        // Fires in Amazon Legal
        const amazonFires = this.fireData.filter(f => this.isInAmazon(f.lat, f.lon)).length;
        const amazonFiresEl = document.getElementById('firms-amazon-fires');
        if (amazonFiresEl) {
            this.animateNumber(amazonFiresEl, amazonFires);
        }

        // Update last updated time
        const lastUpdatedEl = document.getElementById('firms-last-updated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = new Date().toLocaleTimeString('pt-BR');
        }

        console.log('📊 Estatísticas atualizadas');
    }

    isInAmazon(lat, lon) {
        // Simplified Amazon Legal bounds check
        return lat >= -18.03 && lat <= 5.16 && lon >= -73.99 && lon <= -42.91;
    }

    animateNumber(element, target) {
        const duration = 1000;
        const start = parseInt(element.textContent) || 0;
        const diff = target - start;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.floor(start + diff * this.easeOutQuad(progress));
            element.textContent = current.toLocaleString('pt-BR');

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutQuad(t) {
        return t * (2 - t);
    }

    showLoading(show) {
        if (this.loadingElement) {
            this.loadingElement.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message) {
        console.error('❌ FIRMS Error:', message);
        // Could show an error toast/notification here
    }

    // Public methods for external use
    refresh() {
        this.loadFireData();
    }

    focusOnFire(lat, lon) {
        this.map.setView([lat, lon], 10);
    }

    getSensorStats() {
        return {
            sensor: this.currentSensor,
            days: this.currentDays,
            totalFires: this.fireData.length,
            lastUpdate: new Date()
        };
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure map element is ready
    setTimeout(() => {
        window.firmsManager = new FIRMSManager();
    }, 100);
});
