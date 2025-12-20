// 🌍 EcoGuardians - Mapa PROFISSIONAL da Amazônia
// Sistema avançado com Google Satellite + dados científicos sobrepostos

class MapsManager {
    constructor() {
        this.mapElement = document.getElementById('interactive-map');
        this.map = null;
        this.currentLayer = 'satellite';
        this.mapData = null;
        this.isInitialized = false;
        this.markers = [];
        this.layers = {};
        
        // Centro da Amazônia (Manaus)
        this.amazonCenter = [-3.4653, -60.0217];
        
        // Cores para diferentes tipos de dados
        this.colors = {
            indigenous: '#8B4513',
            protected: '#228B22', 
            deforestation: '#FF4500',
            cities: '#FFD700',
            rivers: '#4169E1'
        };
        
        this.init();
    }

    init() {
        // 🛰️ EcoGuardians - Mapa Satelital com Google Earth + Dados IBGE
// Sistema avançado usando Google Earth como base e shapefiles oficiais

class SatelliteMapManager {
    constructor() {
        this.mapElement = document.getElementById('interactive-map');
        this.map = null;
        this.currentLayer = 'satellite';
        this.isInitialized = false;
        this.layers = {};
        this.ibgeData = null;
        
        // Coordenadas da Amazônia Legal (IBGE)
        this.amazonLegalBounds = {
            north: 5.16,      // Norte (Roraima)
            south: -18.03,    // Sul (Mato Grosso)
            east: -42.91,     // Leste (Maranhão)
            west: -73.99      // Oeste (Acre)
        };
        
        // Centro da Amazônia Legal
        this.amazonCenter = [-3.4653, -60.0217]; // Manaus
        
        this.init();
    }

    init() {
        console.log('🛰️ Inicializando mapa satelital avançado...');
        
        if (!this.mapElement) {
            console.warn('Elemento do mapa não encontrado');
            return;
        }

        this.setupMapFilters();
        this.initializeSatelliteMap();
        this.loadIBGEData();
    }

    initializeSatelliteMap() {
        try {
            console.log('🌍 Inicializando Google Earth Integration...');
            
            // Inicializa mapa com foco satelital
            this.map = L.map(this.mapElement.id, {
                center: this.amazonCenter,
                zoom: 6,
                minZoom: 4,
                maxZoom: 18,
                zoomControl: true,
                attributionControl: true
            });
            
            // Camadas satelitais de alta qualidade
            const satelliteLayers = {
                '🛰️ Google Satellite': L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                    attribution: '© Google',
                    subdomains: ['0', '1', '2', '3'],
                    maxZoom: 18
                }),
                '🌍 Google Hybrid': L.tileLayer('https://mt{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                    attribution: '© Google',
                    subdomains: ['0', '1', '2', '3'],
                    maxZoom: 18
                }),
                '🗺️ Google Terrain': L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
                    attribution: '© Google',
                    subdomains: ['0', '1', '2', '3'],
                    maxZoom: 18
                }),
                '🌲 Esri World Imagery': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: '© Esri WorldImagery',
                    maxZoom: 18
                })
            };
            
            // Adiciona camada padrão (Google Satellite)
            satelliteLayers['🛰️ Google Satellite'].addTo(this.map);
            
            // Controle de camadas
            L.control.layers(satelliteLayers, {}, {
                position: 'topright',
                collapsed: true
            }).addTo(this.map);
            
            // Controles avançados
            this.addAdvancedControls();
            
            // Foca na Amazônia
            const bounds = L.latLngBounds(
                [this.amazonLegalBounds.south, this.amazonLegalBounds.west],
                [this.amazonLegalBounds.north, this.amazonLegalBounds.east]
            );
            this.map.fitBounds(bounds);
            
            console.log('✅ Mapa satelital inicializado');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('❌ Erro ao carregar mapa:', error);
            this.showMapError('Erro ao carregar imagem satelital');
        }
    }
    
    addAdvancedControls() {
        // Controle de coordenadas em tempo real
        const coordsControl = L.control({position: 'bottomright'});
        coordsControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'coords-control');
            div.innerHTML = `
                <div style="
                    background: rgba(0,0,0,0.8); 
                    color: white; 
                    padding: 8px 12px; 
                    border-radius: 5px;
                    font-family: monospace;
                    font-size: 12px;
                " id="coords-display">
                    <strong>📍</strong> <span id="current-coords">-3.465, -60.021</span>
                </div>
            `;
            return div;
        };
        coordsControl.addTo(this.map);
        
        // Atualiza coordenadas em tempo real
        this.map.on('mousemove', (e) => {
            const { lat, lng } = e.latlng;
            const coordsElement = document.getElementById('current-coords');
            if (coordsElement) {
                coordsElement.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            }
        });

        // Controle de zoom para Amazônia
        const amazonZoomControl = L.control({position: 'topright'});
        amazonZoomControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            div.innerHTML = `
                <a href="#" title="Focar na Amazônia Legal" style="
                    display: block; 
                    padding: 10px; 
                    background: #228B22; 
                    color: white; 
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 14px;
                ">🌳 IBGE</a>
            `;
            div.onclick = (e) => {
                e.preventDefault();
                this.focusAmazonLegal();
            };
            return div;
        };
        amazonZoomControl.addTo(this.map);

        // Indicador de carregamento
        this.loadingControl = L.control({position: 'bottomleft'});
        this.loadingControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'loading-control');
            div.innerHTML = `
                <div style="
                    background: rgba(34,139,34,0.9); 
                    color: white; 
                    padding: 10px 15px; 
                    border-radius: 8px;
                    display: none;
                    font-size: 14px;
                " id="map-loading">
                    <span>🔄 Carregando dados IBGE...</span>
                </div>
            `;
            return div;
        };
        this.loadingControl.addTo(this.map);
    }

    focusAmazonLegal() {
        const bounds = L.latLngBounds(
            [this.amazonLegalBounds.south, this.amazonLegalBounds.west],
            [this.amazonLegalBounds.north, this.amazonLegalBounds.east]
        );
        this.map.fitBounds(bounds, {
            padding: [20, 20]
        });
        console.log('🌳 Focado na Amazônia Legal (IBGE)');
    }

    async loadIBGEData() {
        console.log('📊 Carregando dados oficiais do IBGE...');
        this.showLoading(true);
        
        try {
            // Simula carregamento dos shapefiles do IBGE
            // Na implementação real, você carregaria os arquivos .shp
            await this.loadAmazonLegalBoundary();
            await this.loadEstadosAmazonicos();
            await this.loadMunicipiosAmazonicos();
            await this.loadUnidadesConservacao();
            await this.loadTerrasIndigenas();
            
            this.showLoading(false);
            console.log('✅ Dados IBGE carregados com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados IBGE:', error);
            this.showLoading(false);
            this.loadFallbackData();
        }
    }

    async loadAmazonLegalBoundary() {
        // Contorno oficial da Amazônia Legal baseado nos dados IBGE
        const amazonLegalCoords = [
            // Coordenadas baseadas nos limites oficiais da Amazônia Legal
            [-18.03, -42.91], // SE - Minas Gerais/Espírito Santo
            [-5.16, -42.91],  // NE - Maranhão
            [5.16, -48.90],   // N - Amapá
            [5.16, -60.64],   // N - Roraima
            [2.81, -73.99],   // NW - Fronteira Colômbia
            [-7.53, -73.99],  // W - Acre
            [-18.03, -57.64], // SW - Mato Grosso do Sul
            [-18.03, -42.91]  // Volta ao início
        ];
        
        const amazonLegalPolygon = L.polygon(amazonLegalCoords, {
            color: '#228B22',
            fillColor: '#32CD32',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '10, 5'
        }).bindPopup(`
            <div style="text-align: center; min-width: 250px;">
                <h3>🌳 Amazônia Legal</h3>
                <p><strong>Definição oficial do IBGE</strong></p>
                <hr>
                <p><strong>Área:</strong> 5.217.423 km² (61% do Brasil)</p>
                <p><strong>Estados:</strong> 9 estados</p>
                <p><strong>Municípios:</strong> 772 municípios</p>
                <p><strong>População:</strong> ~28 milhões habitantes</p>
                <hr>
                <p><em>Lei 1.806/1953 e atualizações</em></p>
            </div>
        `);
        
        this.layers.amazonLegal = L.layerGroup([amazonLegalPolygon]);
        this.layers.amazonLegal.addTo(this.map);
        
        console.log('🏛️ Limites oficiais da Amazônia Legal carregados');
    }

    async loadEstadosAmazonicos() {
        // Estados que compõem a Amazônia Legal
        const estados = [
            {nome: 'Amazonas', sigla: 'AM', lat: -3.47, lon: -62.96, area: '1.559.149 km²'},
            {nome: 'Pará', sigla: 'PA', lat: -5.53, lon: -52.29, area: '1.247.955 km²'},
            {nome: 'Mato Grosso', sigla: 'MT', lat: -12.64, lon: -55.42, area: '903.207 km²'},
            {nome: 'Rondônia', sigla: 'RO', lat: -8.76, lon: -63.90, area: '237.765 km²'},
            {nome: 'Roraima', sigla: 'RR', lat: 2.82, lon: -60.67, area: '224.301 km²'},
            {nome: 'Acre', sigla: 'AC', lat: -8.77, lon: -70.55, area: '164.123 km²'},
            {nome: 'Amapá', sigla: 'AP', lat: 1.41, lon: -51.77, area: '142.828 km²'},
            {nome: 'Tocantins', sigla: 'TO', lat: -10.25, lon: -48.25, area: '277.721 km²'},
            {nome: 'Maranhão', sigla: 'MA', lat: -4.94, lon: -45.44, area: '329.642 km²', parcial: true}
        ];
        
        const estadosLayer = L.layerGroup();
        
        estados.forEach(estado => {
            const marker = L.marker([estado.lat, estado.lon], {
                icon: L.divIcon({
                    className: 'estado-marker',
                    html: `<div style="
                        background: rgba(34,139,34,0.9);
                        color: white;
                        padding: 5px 8px;
                        border-radius: 15px;
                        font-weight: bold;
                        font-size: 12px;
                        border: 2px solid white;
                        text-align: center;
                        min-width: 35px;
                    ">${estado.sigla}</div>`,
                    iconSize: [40, 25],
                    iconAnchor: [20, 12]
                })
            }).bindPopup(`
                <div style="text-align: center;">
                    <h3>🏛️ ${estado.nome}</h3>
                    <p><strong>Sigla:</strong> ${estado.sigla}</p>
                    <p><strong>Área:</strong> ${estado.area}</p>
                    ${estado.parcial ? '<p><strong>Inclusão:</strong> Parcial (Amazônia Legal)</p>' : '<p><strong>Inclusão:</strong> Total</p>'}
                    <hr>
                    <p><em>Estado da Amazônia Legal - IBGE</em></p>
                </div>
            `);
            
            estadosLayer.addLayer(marker);
        });
        
        this.layers.estados = estadosLayer;
        console.log(`🏛️ ${estados.length} estados da Amazônia Legal carregados`);
    }

    async loadMunicipiosAmazonicos() {
        // Principais municípios da Amazônia Legal
        const municipios = [
            {nome: 'Manaus', uf: 'AM', lat: -3.1190, lon: -60.0217, pop: 2.219},
            {nome: 'Belém', uf: 'PA', lat: -1.4558, lon: -48.4902, pop: 1.499},
            {nome: 'São Luís', uf: 'MA', lat: -2.5387, lon: -44.2826, pop: 1.108},
            {nome: 'Cuiabá', uf: 'MT', lat: -15.6014, lon: -56.0979, pop: 650},
            {nome: 'Porto Velho', uf: 'RO', lat: -8.7612, lon: -63.9023, pop: 539},
            {nome: 'Macapá', uf: 'AP', lat: 0.0389, lon: -51.0664, pop: 512},
            {nome: 'Rio Branco', uf: 'AC', lat: -9.9747, lon: -67.8073, pop: 413},
            {nome: 'Boa Vista', uf: 'RR', lat: 2.8197, lon: -60.6733, pop: 419},
            {nome: 'Palmas', uf: 'TO', lat: -10.1689, lon: -48.3317, pop: 306}
        ];
        
        const municipiosLayer = L.layerGroup();
        
        municipios.forEach(municipio => {
            const size = municipio.pop > 1000 ? 10 : (municipio.pop > 500 ? 8 : 6);
            
            const marker = L.circleMarker([municipio.lat, municipio.lon], {
                radius: size,
                fillColor: '#FF6B35',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`
                <div style="text-align: center;">
                    <h3>🏙️ ${municipio.nome}</h3>
                    <p><strong>Estado:</strong> ${municipio.uf}</p>
                    <p><strong>População:</strong> ${municipio.pop.toLocaleString('pt-BR')} mil hab.</p>
                    <p><strong>Coordenadas:</strong> ${municipio.lat.toFixed(4)}, ${municipio.lon.toFixed(4)}</p>
                    <hr>
                    <p><em>Município da Amazônia Legal - IBGE</em></p>
                </div>
            `);
            
            municipiosLayer.addLayer(marker);
        });
        
        this.layers.municipios = municipiosLayer;
        console.log(`🏙️ ${municipios.length} municípios principais carregados`);
    }

    async loadUnidadesConservacao() {
        // Principais Unidades de Conservação
        const ucs = [
            {nome: 'Parque Nacional da Amazônia', lat: -4.5, lon: -56.5, tipo: 'PI'},
            {nome: 'Reserva Extrativista do Alto Juruá', lat: -8.7, lon: -72.6, tipo: 'US'},
            {nome: 'Floresta Nacional do Tapajós', lat: -2.8, lon: -55.0, tipo: 'US'},
            {nome: 'Estação Ecológica Anavilhanas', lat: -2.4, lon: -60.9, tipo: 'PI'},
            {nome: 'Parque Nacional do Jaú', lat: -1.9, lon: -61.6, tipo: 'PI'}
        ];
        
        const ucsLayer = L.layerGroup();
        
        ucs.forEach(uc => {
            const color = uc.tipo === 'PI' ? '#006400' : '#32CD32';
            
            const marker = L.circle([uc.lat, uc.lon], {
                radius: 30000,
                fillColor: color,
                color: '#228B22',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.4
            }).bindPopup(`
                <h3>🛡️ ${uc.nome}</h3>
                <p><strong>Tipo:</strong> ${uc.tipo === 'PI' ? 'Proteção Integral' : 'Uso Sustentável'}</p>
                <p><em>SNUC - Sistema Nacional de Unidades de Conservação</em></p>
            `);
            
            ucsLayer.addLayer(marker);
        });
        
        this.layers.conservacao = ucsLayer;
        console.log(`🛡️ ${ucs.length} unidades de conservação carregadas`);
    }

    async loadTerrasIndigenas() {
        // Principais Terras Indígenas
        const tis = [
            {nome: 'Yanomami', lat: 2.5, lon: -63.5, povo: 'Yanomami'},
            {nome: 'Kayapó', lat: -7.5, lon: -53.5, povo: 'Kayapó'},
            {nome: 'Raposa Serra do Sol', lat: 3.5, lon: -60.0, povo: 'Macuxi'},
            {nome: 'Alto Xingu', lat: -11.5, lon: -53.0, povo: 'Múltiplos'}
        ];
        
        const tisLayer = L.layerGroup();
        
        tis.forEach(ti => {
            const marker = L.circle([ti.lat, ti.lon], {
                radius: 40000,
                fillColor: '#DEB887',
                color: '#8B4513',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.4
            }).bindPopup(`
                <h3>🏞️ ${ti.nome}</h3>
                <p><strong>Povo:</strong> ${ti.povo}</p>
                <p><em>Terra Indígena Demarcada - FUNAI</em></p>
            `);
            
            tisLayer.addLayer(marker);
        });
        
        this.layers.terrasIndigenas = tisLayer;
        console.log(`🏞️ ${tis.length} terras indígenas carregadas`);
    }

    changeLayer(layerType) {
        if (!this.isInitialized) return;
        
        // Remove camadas opcionais
        ['estados', 'municipios', 'conservacao', 'terrasIndigenas'].forEach(key => {
            if (this.layers[key] && this.map.hasLayer(this.layers[key])) {
                this.map.removeLayer(this.layers[key]);
            }
        });
        
        // Adiciona camada selecionada
        switch(layerType) {
            case 'estados':
                if (this.layers.estados) this.map.addLayer(this.layers.estados);
                break;
            case 'municipios':
                if (this.layers.municipios) this.map.addLayer(this.layers.municipios);
                break;
            case 'conservacao':
                if (this.layers.conservacao) this.map.addLayer(this.layers.conservacao);
                break;
            case 'terrasIndigenas':
                if (this.layers.terrasIndigenas) this.map.addLayer(this.layers.terrasIndigenas);
                break;
            case 'all':
                ['estados', 'municipios', 'conservacao', 'terrasIndigenas'].forEach(key => {
                    if (this.layers[key]) this.map.addLayer(this.layers[key]);
                });
                break;
        }
        
        console.log(`📍 Camada alterada para: ${layerType}`);
    }

    setupMapFilters() {
        // Configura os filtros do mapa
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('map-filter')) {
                // Remove active de todos
                document.querySelectorAll('.map-filter').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Adiciona active no clicado
                e.target.classList.add('active');
                
                // Muda a camada
                const layer = e.target.dataset.layer;
                this.changeLayer(layer);
            }
        });
    }

    showLoading(show) {
        const loadingElement = document.getElementById('map-loading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    showMapError(message) {
        if (this.mapElement) {
            this.mapElement.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    background: linear-gradient(135deg, #2E8B57, #228B22);
                    color: white;
                    text-align: center;
                    padding: 40px;
                    border-radius: 15px;
                ">
                    <div>
                        <div style="font-size: 64px; margin-bottom: 20px;">🛰️</div>
                        <h3 style="margin: 0 0 15px 0;">Erro no Mapa Satelital</h3>
                        <p style="margin: 0 0 20px 0; opacity: 0.9;">${message}</p>
                        <button onclick="window.location.reload()" style="
                            padding: 12px 24px;
                            background: rgba(255,255,255,0.2);
                            color: white;
                            border: 2px solid rgba(255,255,255,0.3);
                            border-radius: 25px;
                            cursor: pointer;
                            font-weight: bold;
                        ">🔄 Tentar Novamente</button>
                    </div>
                </div>
            `;
        }
    }

    loadFallbackData() {
        console.log('🔄 Carregando dados de fallback...');
        // Implementar dados de fallback se necessário
    }
}

// Função para inicializar o mapa satelital
function initializeSatelliteMap() {
    return new SatelliteMapManager();
}

// Torna disponível globalmente
window.SatelliteMapManager = SatelliteMapManager;
window.initializeSatelliteMap = initializeSatelliteMap;

console.log('🛰️ Sistema de mapa satelital carregado');
        
        if (!this.mapElement) {
            console.warn('Elemento do mapa não encontrado');
            return;
        }

        this.setupMapFilters();
        this.initializeMap();
        this.loadAmazonData();
    }

    initializeMap() {
        try {
            console.log('🛰️ Carregando imagem satelital da Amazônia...');
            
            // Inicializa mapa com foco na Amazônia
            this.map = L.map(this.mapElement.id, {
                center: this.amazonCenter,
                zoom: 6,
                minZoom: 4,
                maxZoom: 18,
                zoomControl: true,
                attributionControl: true
            });
            
            // Camadas base PROFISSIONAIS
            const baseLayers = {
                '🌍 Satellite': L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                    attribution: '© Google',
                    maxZoom: 20
                }),
                '🛰️ Hybrid': L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
                    attribution: '© Google',
                    maxZoom: 20
                }),
                '🌎 Terrain': L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
                    attribution: '© Google',
                    maxZoom: 20
                }),
                '🗺️ Streets': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap',
                    maxZoom: 18
                })
            };
            
            // Adiciona camada satelital por padrão
            baseLayers['🌍 Satellite'].addTo(this.map);
            
            // Controle de camadas
            L.control.layers(baseLayers, {}, {
                position: 'topright',
                collapsed: true
            }).addTo(this.map);
            
            // Controle de escala
            L.control.scale({
                position: 'bottomleft',
                metric: true
            }).addTo(this.map);
            
            // Limita à região amazônica
            const amazonBounds = L.latLngBounds(
                [-15, -75], // SW
                [5, -44]    // NE
            );
            this.map.setMaxBounds(amazonBounds);
            
            // Adiciona estilos customizados
            this.addCustomStyles();
            
            // Adiciona controles customizados
            this.addCustomControls();
            
            // Event listeners
            this.addMapEventListeners();
            
            console.log('✅ Mapa satelital HD carregado');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('❌ Erro ao carregar mapa:', error);
            this.showMapError('Erro ao carregar imagem satelital');
        }
    }

    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Marcadores profissionais sobre imagem satelital */
            .amazon-marker {
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.6);
                opacity: 0.9;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .amazon-marker:hover {
                transform: scale(1.3);
                opacity: 1;
                z-index: 1000;
                box-shadow: 0 6px 20px rgba(0,0,0,0.8);
            }
            
            .indigenous-marker {
                background: radial-gradient(circle, #8B4513, #D2691E);
            }
            
            .protected-marker {
                background: radial-gradient(circle, #228B22, #32CD32);
            }
            
            .deforestation-marker {
                background: radial-gradient(circle, #FF4500, #FF6347);
                animation: pulse-red 2s infinite;
            }
            
            .city-marker {
                background: radial-gradient(circle, #FFD700, #FFA500);
            }
            
            @keyframes pulse-red {
                0% { box-shadow: 0 0 0 0 rgba(255, 69, 0, 0.7); }
                70% { box-shadow: 0 0 0 20px rgba(255, 69, 0, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 69, 0, 0); }
            }
            
            /* Popups elegantes */
            .leaflet-popup-content-wrapper {
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                border: 2px solid rgba(255,255,255,0.3);
            }
            
            .leaflet-popup-content {
                margin: 20px;
                line-height: 1.8;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .popup-header {
                text-align: center;
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 15px;
                color: #2E8B57;
                border-bottom: 2px solid #2E8B57;
                padding-bottom: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    addCustomControls() {
        // Botão para centrar na Amazônia
        const amazonControl = L.control({position: 'topright'});
        amazonControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            div.innerHTML = `
                <a href="#" title="Focar na Amazônia" style="
                    display: block; 
                    padding: 12px; 
                    background: #2E8B57; 
                    color: white; 
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 18px;
                    border-radius: 4px;
                ">🌳</a>
            `;
            div.onclick = (e) => {
                e.preventDefault();
                this.map.setView(this.amazonCenter, 6);
                console.log('🌳 Centralizado na Amazônia');
            };
            return div;
        };
        amazonControl.addTo(this.map);

        // Indicador de coordenadas
        const coordsControl = L.control({position: 'bottomright'});
        coordsControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'coords-display');
            div.innerHTML = `
                <div style="
                    background: rgba(0,0,0,0.8); 
                    color: white; 
                    padding: 10px 15px; 
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 12px;
                    border: 1px solid rgba(255,255,255,0.2);
                " id="coords-info">
                    📍 <span id="current-coords">-3.4653, -60.0217</span>
                </div>
            `;
            return div;
        };
        coordsControl.addTo(this.map);

        // Loading indicator
        this.loadingControl = L.control({position: 'bottomleft'});
        this.loadingControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'loading-control');
            div.innerHTML = `
                <div style="
                    background: rgba(46,139,87,0.9); 
                    color: white; 
                    padding: 12px 18px; 
                    border-radius: 10px;
                    display: none;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                " id="map-loading">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="
                            width: 20px; 
                            height: 20px; 
                            border: 2px solid #ffffff; 
                            border-top: 2px solid transparent; 
                            border-radius: 50%; 
                            animation: spin 1s linear infinite;
                        "></div>
                        <span>Carregando dados da Amazônia...</span>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
            return div;
        };
        this.loadingControl.addTo(this.map);
    }

    addMapEventListeners() {
        // Atualiza coordenadas ao mover o mouse
        this.map.on('mousemove', (e) => {
            const { lat, lng } = e.latlng;
            const coordsElement = document.getElementById('current-coords');
            if (coordsElement) {
                coordsElement.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            }
        });

        // Clique no mapa
        this.map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            console.log(`🖱️ Clique em: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        });
    }

    async loadAmazonData() {
        console.log('🌍 Carregando dados da Amazônia sobre imagem satelital...');
        
        try {
            this.showLoading(true);
            
            // Carrega dados em sequência
            await this.loadIndigenousLands();
            await this.delay(500);
            
            await this.loadProtectedAreas();
            await this.delay(500);
            
            await this.loadMajorCities();
            await this.delay(500);
            
            await this.loadDeforestationHotspots();
            await this.delay(500);
            
            await this.loadMajorRivers();
            
            this.showLoading(false);
            console.log('✅ Dados da Amazônia carregados sobre imagem satelital');
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            this.showLoading(false);
        }
    }

    async loadIndigenousLands() {
        // Terras Indígenas principais da Amazônia
        const indigenousData = [
            {name: 'Yanomami', lat: 2.5, lon: -63.5, area: '96.649 km²', people: 'Yanomami', population: '26.780'},
            {name: 'Kayapó', lat: -7.5, lon: -53.5, area: '32.600 km²', people: 'Kayapó', population: '11.000'},
            {name: 'Tikuna', lat: -3.8, lon: -68.2, area: '11.000 km²', people: 'Tikuna', population: '53.500'},
            {name: 'Alto Xingu', lat: -11.5, lon: -53.0, area: '26.420 km²', people: 'Múltiplos povos', population: '6.000'},
            {name: 'Surui', lat: -11.0, lon: -61.0, area: '2.407 km²', people: 'Paiter Surui', population: '1.400'},
            {name: 'Raposa Serra do Sol', lat: 3.5, lon: -60.0, area: '17.430 km²', people: 'Macuxi, Wapixana', population: '20.000'},
            {name: 'Munduruku', lat: -7.0, lon: -57.0, area: '23.750 km²', people: 'Munduruku', population: '13.500'}
        ];

        const indigenousLayer = L.layerGroup();

        indigenousData.forEach(territory => {
            const marker = L.circleMarker([territory.lat, territory.lon], {
                radius: 12,
                className: 'amazon-marker indigenous-marker',
                weight: 3,
                color: 'white',
                fillOpacity: 1
            }).bindPopup(`
                <div class="popup-header">🏞️ ${territory.name}</div>
                <div>
                    <strong>Povo:</strong> ${territory.people}<br>
                    <strong>População:</strong> ${territory.population} pessoas<br>
                    <strong>Área:</strong> ${territory.area}<br>
                    <strong>Status:</strong> Terra Indígena Demarcada<br>
                    <strong>Proteção:</strong> Constituição Federal Art. 231
                </div>
            `);

            indigenousLayer.addLayer(marker);
        });

        this.layers.indigenous = indigenousLayer;
        console.log(`🏞️ ${indigenousData.length} terras indígenas adicionadas`);
    }

    async loadProtectedAreas() {
        // Unidades de Conservação
        const protectedData = [
            {name: 'Parque Nacional da Amazônia', lat: -4.5, lon: -56.5, area: '9.940 km²', type: 'Parque Nacional'},
            {name: 'Reserva Mamirauá', lat: -3.0, lon: -64.8, area: '11.240 km²', type: 'Reserva de Desenvolvimento'},
            {name: 'Parque Nacional do Pico da Neblina', lat: 0.7, lon: -66.0, area: '22.000 km²', type: 'Parque Nacional'},
            {name: 'Estação Ecológica Anavilhanas', lat: -2.4, lon: -60.9, area: '3.500 km²', type: 'Estação Ecológica'},
            {name: 'Parque Nacional do Jaú', lat: -1.9, lon: -61.6, area: '22.720 km²', type: 'Parque Nacional'},
            {name: 'RESEX Alto Juruá', lat: -8.7, lon: -72.6, area: '5.063 km²', type: 'Reserva Extrativista'}
        ];

        const protectedLayer = L.layerGroup();

        protectedData.forEach(area => {
            const marker = L.circleMarker([area.lat, area.lon], {
                radius: 10,
                className: 'amazon-marker protected-marker',
                weight: 3,
                color: 'white',
                fillOpacity: 1
            }).bindPopup(`
                <div class="popup-header">🛡️ ${area.name}</div>
                <div>
                    <strong>Tipo:</strong> ${area.type}<br>
                    <strong>Área:</strong> ${area.area}<br>
                    <strong>Proteção:</strong> Integral<br>
                    <strong>Órgão:</strong> ICMBio/IBAMA<br>
                    <strong>Sistema:</strong> SNUC
                </div>
            `);

            protectedLayer.addLayer(marker);
        });

        this.layers.protected = protectedLayer;
        console.log(`🛡️ ${protectedData.length} unidades de conservação adicionadas`);
    }

    async loadMajorCities() {
        // Principais cidades da Amazônia
        const citiesData = [
            {name: 'Manaus', lat: -3.1190, lon: -60.0217, pop: '2.2M', state: 'AM', economy: 'Zona Franca'},
            {name: 'Belém', lat: -1.4558, lon: -48.4902, pop: '1.5M', state: 'PA', economy: 'Porto'},
            {name: 'Porto Velho', lat: -8.7612, lon: -63.9023, pop: '540K', state: 'RO', economy: 'Agropecuária'},
            {name: 'Rio Branco', lat: -9.9747, lon: -67.8073, pop: '420K', state: 'AC', economy: 'Borracha/Madeira'},
            {name: 'Macapá', lat: 0.0389, lon: -51.0664, pop: '512K', state: 'AP', economy: 'Mineração'},
            {name: 'Boa Vista', lat: 2.8197, lon: -60.6733, pop: '420K', state: 'RR', economy: 'Agropecuária'},
            {name: 'Santarém', lat: -2.4426, lon: -54.7083, pop: '308K', state: 'PA', economy: 'Soja/Porto'},
            {name: 'Parintins', lat: -2.6286, lon: -56.7356, pop: '115K', state: 'AM', economy: 'Festival/Turismo'}
        ];

        const citiesLayer = L.layerGroup();

        citiesData.forEach(city => {
            const size = city.pop.includes('M') ? 14 : 8;
            
            const marker = L.circleMarker([city.lat, city.lon], {
                radius: size,
                className: 'amazon-marker city-marker',
                weight: 3,
                color: 'white',
                fillOpacity: 1
            }).bindPopup(`
                <div class="popup-header">🏙️ ${city.name}</div>
                <div>
                    <strong>Estado:</strong> ${city.state}<br>
                    <strong>População:</strong> ${city.pop}<br>
                    <strong>Economia:</strong> ${city.economy}<br>
                    <strong>Coordenadas:</strong> ${city.lat.toFixed(3)}, ${city.lon.toFixed(3)}
                </div>
            `);

            citiesLayer.addLayer(marker);
        });

        this.layers.cities = citiesLayer;
        console.log(`🏙️ ${citiesData.length} cidades adicionadas`);
    }

    async loadDeforestationHotspots() {
        // Focos de desmatamento
        const hotspots = [
            {name: 'Arco do Desmatamento - Rondônia', lat: -9.0, lon: -63.0, severity: 'Alta', area: '2.450 km²'},
            {name: 'Arco do Desmatamento - Mato Grosso', lat: -13.0, lon: -57.0, severity: 'Crítica', area: '3.890 km²'},
            {name: 'Sul do Pará', lat: -7.0, lon: -52.0, severity: 'Alta', area: '1.670 km²'},
            {name: 'Acre - Fronteira Peru', lat: -9.5, lon: -70.0, severity: 'Média', area: '890 km²'},
            {name: 'Roraima Sul', lat: 1.0, lon: -61.0, severity: 'Média', area: '1.200 km²'},
            {name: 'Amazonas - BR-319', lat: -7.5, lon: -62.0, severity: 'Alta', area: '2.100 km²'}
        ];

        const deforestationLayer = L.layerGroup();

        hotspots.forEach(spot => {
            const marker = L.circleMarker([spot.lat, spot.lon], {
                radius: 10,
                className: 'amazon-marker deforestation-marker',
                weight: 3,
                color: 'white',
                fillOpacity: 1
            }).bindPopup(`
                <div class="popup-header">⚠️ ${spot.name}</div>
                <div>
                    <strong>Severidade:</strong> ${spot.severity}<br>
                    <strong>Área afetada:</strong> ${spot.area}<br>
                    <strong>Monitoramento:</strong> INPE/PRODES<br>
                    <strong>Status:</strong> Ativo<br>
                    <strong>Ação:</strong> Fiscalização necessária
                </div>
            `);

            deforestationLayer.addLayer(marker);
        });

        this.layers.deforestation = deforestationLayer;
        console.log(`⚠️ ${hotspots.length} focos de desmatamento adicionados`);
    }

    async loadMajorRivers() {
        // Rios principais
        const rivers = [
            {
                name: 'Rio Amazonas',
                coords: [[-3.7, -73.2], [-3.1, -60.0], [-1.8, -55.5], [-1.4, -48.5]]
            },
            {
                name: 'Rio Negro', 
                coords: [[-0.5, -67.0], [-1.0, -62.0], [-3.1, -60.0]]
            },
            {
                name: 'Rio Tapajós',
                coords: [[-7.0, -56.5], [-4.0, -56.0], [-2.4, -54.7]]
            },
            {
                name: 'Rio Xingu',
                coords: [[-11.0, -53.0], [-8.0, -52.0], [-3.2, -52.2]]
            }
        ];

        const riversLayer = L.layerGroup();

        rivers.forEach(river => {
            const polyline = L.polyline(river.coords, {
                color: '#4169E1',
                weight: 5,
                opacity: 0.8
            }).bindPopup(`
                <div class="popup-header">🌊 ${river.name}</div>
                <div>
                    <strong>Tipo:</strong> Rio principal<br>
                    <strong>Bacia:</strong> Amazônica<br>
                    <strong>Importância:</strong> Navegação e biodiversidade
                </div>
            `);

            riversLayer.addLayer(polyline);
        });

        this.layers.rivers = riversLayer;
        console.log(`🌊 ${rivers.length} rios adicionados`);
    }

    setupMapFilters() {
        const filterButtons = document.querySelectorAll('.map-filter');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const layer = e.target.getAttribute('data-layer');
                this.changeLayer(layer);
            });
        });
    }

    changeLayer(layerType) {
        if (!this.map || !this.isInitialized) {
            console.warn('Mapa não inicializado');
            return;
        }
        
        this.currentLayer = layerType;
        
        // Remove todas as camadas
        Object.values(this.layers).forEach(layer => {
            if (this.map.hasLayer(layer)) {
                this.map.removeLayer(layer);
            }
        });
        
        // Adiciona camada selecionada
        switch(layerType) {
            case 'satellite':
                // Apenas a imagem satelital
                break;
                
            case 'indigenous':
                if (this.layers.indigenous) {
                    this.map.addLayer(this.layers.indigenous);
                }
                break;
                
            case 'protected':
                if (this.layers.protected) {
                    this.map.addLayer(this.layers.protected);
                }
                break;
                
            case 'cities':
                if (this.layers.cities) {
                    this.map.addLayer(this.layers.cities);
                }
                break;
                
            case 'deforestation':
                if (this.layers.deforestation) {
                    this.map.addLayer(this.layers.deforestation);
                }
                break;
                
            case 'rivers':
                if (this.layers.rivers) {
                    this.map.addLayer(this.layers.rivers);
                }
                break;
                
            case 'all':
                Object.values(this.layers).forEach(layer => {
                    this.map.addLayer(layer);
                });
                break;
        }
        
        this.updateMapInfo(layerType);
        console.log(`🔄 Camada alterada para: ${layerType}`);
    }

    updateMapInfo(layerType) {
        const layerInfo = {
            satellite: {
                title: '🌍 Imagem Satelital',
                description: 'Vista satelital HD da região amazônica em tempo real'
            },
            indigenous: {
                title: '🏞️ Terras Indígenas',
                description: 'Territórios tradicionais demarcados - 305 etnias na Amazônia'
            },
            protected: {
                title: '🛡️ Unidades de Conservação',
                description: 'Parques nacionais, reservas e estações ecológicas protegidas'
            },
            cities: {
                title: '🏙️ Centros Urbanos',
                description: 'Principais cidades amazônicas: Manaus, Belém, Porto Velho'
            },
            deforestation: {
                title: '⚠️ Focos de Desmatamento',
                description: 'Áreas críticas de perda florestal monitoradas pelo INPE'
            },
            rivers: {
                title: '🌊 Rede Hidrográfica',
                description: 'Principais rios da bacia amazônica e seus afluentes'
            },
            all: {
                title: '🌍 Amazônia Completa',
                description: 'Visão integrada de todos os dados sobre imagem satelital'
            }
        };

        const info = layerInfo[layerType] || layerInfo.satellite;
        
        // Atualiza interface
        const titleElement = document.querySelector('.map-title');
        if (titleElement) {
            titleElement.textContent = info.title;
        }
        
        const descElement = document.querySelector('.map-description');
        if (descElement) {
            descElement.textContent = info.description;
        }
    }

    showLoading(show) {
        const loadingElement = document.getElementById('map-loading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    showMapError(message) {
        if (this.mapElement) {
            this.mapElement.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                    color: white;
                    text-align: center;
                    padding: 20px;
                    border-radius: 8px;
                ">
                    <div>
                        <div style="font-size: 48px; margin-bottom: 10px;">🛰️</div>
                        <h3 style="margin: 0 0 10px 0;">Erro no Mapa Satelital</h3>
                        <p style="margin: 0;">${message}</p>
                        <button onclick="window.location.reload()" style="
                            margin-top: 15px;
                            padding: 10px 20px;
                            background: white;
                            color: #ee5a24;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: bold;
                        ">Tentar Novamente</button>
                    </div>
                </div>
            `;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Função para exportar dados
    exportMapData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            center: this.map.getCenter(),
            zoom: this.map.getZoom(),
            currentLayer: this.currentLayer,
            layersCount: Object.keys(this.layers).length
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `amazonia-satelital-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        console.log('📁 Dados do mapa exportados');
    }

    // Função para buscar localizações
    searchLocation(query) {
        if (!query || query.length < 3) return;

        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}&bounded=1&viewbox=-75,5,-44,-15`;
        
        fetch(url)
            .then(response => response.json())
            .then(results => {
                if (results && results.length > 0) {
                    const result = results[0];
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);
                    
                    this.map.setView([lat, lon], 10);
                    
                    const searchMarker = L.marker([lat, lon])
                        .addTo(this.map)
                        .bindPopup(`
                            <div class="popup-header">📍 ${result.display_name}</div>
                            <div><em>Resultado da busca</em></div>
                        `)
                        .openPopup();
                    
                    setTimeout(() => {
                        this.map.removeLayer(searchMarker);
                    }, 10000);
                    
                    console.log(`🔍 Localização encontrada: ${result.display_name}`);
                }
            })
            .catch(error => {
                console.error('❌ Erro na busca:', error);
            });
    }
}

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌍 Carregando Mapa PROFISSIONAL da Amazônia...');
    new MapsManager();
});

// Exporta globalmente para uso em outros scripts
window.MapsManager = MapsManager;
