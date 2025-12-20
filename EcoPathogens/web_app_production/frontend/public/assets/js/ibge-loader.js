
// 🗺️ Carregador atualizado com dados IBGE processados

class IBGEDataLoader {
    constructor() {
        this.amazoniaLegalData = null;
        this.isLoaded = false;
        this.baseUrl = 'data/';
    }
    
    async loadAmazoniaLegal(simplified = true) {
        try {
            console.log('📊 Carregando dados oficiais IBGE...');
            
            // Escolhe versão simplificada ou completa
            const filename = simplified ? 
                'amazonia_legal_simplified.geojson' : 
                'amazonia_legal_ibge.geojson';
            
            const response = await fetch(this.baseUrl + filename);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            this.amazoniaLegalData = await response.json();
            this.isLoaded = true;
            
            console.log('✅ Dados IBGE carregados:', {
                features: this.amazoniaLegalData.features?.length || 0,
                metadata: this.amazoniaLegalData.metadata
            });
            
            return this.amazoniaLegalData;
            
        } catch (error) {
            console.warn('⚠️ Dados IBGE não disponíveis, usando fallback:', error.message);
            return this.loadFallbackData();
        }
    }
    
    loadFallbackData() {
        // Dados de fallback se os arquivos IBGE não estiverem disponíveis
        this.amazoniaLegalData = {
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                properties: {
                    nome: "Amazônia Legal",
                    fonte: "IBGE (fallback)",
                    area_km2: 5217423
                },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-42.91, -18.03], [-42.91, -5.16], [-48.90, 5.16],
                        [-60.64, 5.16], [-73.99, 2.81], [-73.99, -7.53],
                        [-57.64, -18.03], [-42.91, -18.03]
                    ]]
                }
            }]
        };
        
        this.isLoaded = true;
        console.log('✅ Dados de fallback carregados');
        return this.amazoniaLegalData;
    }
    
    addToMap(map) {
        if (!this.isLoaded || !this.amazoniaLegalData) {
            console.warn('Dados IBGE não carregados');
            return null;
        }
        
        const layer = L.geoJSON(this.amazoniaLegalData, {
            style: {
                color: '#228B22',
                fillColor: '#32CD32', 
                fillOpacity: 0.2,
                weight: 3,
                dashArray: '10, 5',
                opacity: 0.8
            },
            onEachFeature: (feature, layer) => {
                const props = feature.properties;
                const metadata = this.amazoniaLegalData.metadata;
                
                layer.bindPopup(`
                    <div style="text-align: center; min-width: 300px;">
                        <h3>🏛️ Amazônia Legal</h3>
                        <p><strong>Dados Oficiais do IBGE</strong></p>
                        <hr>
                        <p><strong>Área:</strong> ${(props.area_km2 || metadata?.area_km2 || 5217423).toLocaleString('pt-BR')} km²</p>
                        <p><strong>Estados:</strong> ${metadata?.estados || 9}</p>
                        <p><strong>Municípios:</strong> ${metadata?.municipios || 772}</p>
                        <p><strong>Fonte:</strong> ${metadata?.fonte || 'IBGE'}</p>
                        <p><strong>Ano:</strong> ${metadata?.ano || 2024}</p>
                        <hr>
                        <p><em>Instituto Brasileiro de Geografia e Estatística</em></p>
                    </div>
                `);
            }
        });
        
        return layer;
    }
    
    // Adiciona marcadores dos estados
    addEstadosAmazonicos(map) {
        const estados = [
            {nome: 'Amazonas', sigla: 'AM', lat: -3.47, lon: -62.96, capital: 'Manaus'},
            {nome: 'Pará', sigla: 'PA', lat: -5.53, lon: -52.29, capital: 'Belém'},
            {nome: 'Mato Grosso', sigla: 'MT', lat: -12.64, lon: -55.42, capital: 'Cuiabá'},
            {nome: 'Rondônia', sigla: 'RO', lat: -8.76, lon: -63.90, capital: 'Porto Velho'},
            {nome: 'Roraima', sigla: 'RR', lat: 2.82, lon: -60.67, capital: 'Boa Vista'},
            {nome: 'Acre', sigla: 'AC', lat: -8.77, lon: -70.55, capital: 'Rio Branco'},
            {nome: 'Amapá', sigla: 'AP', lat: 1.41, lon: -51.77, capital: 'Macapá'},
            {nome: 'Tocantins', sigla: 'TO', lat: -10.25, lon: -48.25, capital: 'Palmas'},
            {nome: 'Maranhão', sigla: 'MA', lat: -4.94, lon: -45.44, capital: 'São Luís', obs: 'Parcial'}
        ];
        
        const estadosLayer = L.layerGroup();
        
        estados.forEach(estado => {
            const marker = L.marker([estado.lat, estado.lon], {
                icon: L.divIcon({
                    className: 'estado-marker-ibge',
                    html: `<div style="
                        background: linear-gradient(135deg, #228B22, #32CD32);
                        color: white;
                        padding: 6px 10px;
                        border-radius: 20px;
                        font-weight: bold;
                        font-size: 11px;
                        border: 2px solid rgba(255,255,255,0.9);
                        text-align: center;
                        min-width: 40px;
                        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                    ">${estado.sigla}</div>`,
                    iconSize: [50, 28],
                    iconAnchor: [25, 14]
                })
            }).bindPopup(`
                <div style="text-align: center;">
                    <h3>🏛️ ${estado.nome}</h3>
                    <p><strong>Capital:</strong> ${estado.capital}</p>
                    <p><strong>Sigla:</strong> ${estado.sigla}</p>
                    ${estado.obs ? `<p><strong>Inclusão:</strong> ${estado.obs}</p>` : ''}
                    <hr>
                    <p><em>Estado da Amazônia Legal - IBGE</em></p>
                </div>
            `);
            
            estadosLayer.addLayer(marker);
        });
        
        console.log(`🏛️ ${estados.length} estados da Amazônia Legal adicionados`);
        
        return estadosLayer;
    }
    
    // Adiciona principais municípios
    addMunicipiosAmazonicos(map) {
        const municipios = [
            {nome: 'Manaus', uf: 'AM', lat: -3.1190, lon: -60.0217, pop: 2219, capital: true},
            {nome: 'Belém', uf: 'PA', lat: -1.4558, lon: -48.4902, pop: 1499, capital: true},
            {nome: 'São Luís', uf: 'MA', lat: -2.5387, lon: -44.2826, pop: 1108, capital: true},
            {nome: 'Cuiabá', uf: 'MT', lat: -15.6014, lon: -56.0979, pop: 650, capital: true},
            {nome: 'Porto Velho', uf: 'RO', lat: -8.7612, lon: -63.9023, pop: 539, capital: true},
            {nome: 'Macapá', uf: 'AP', lat: 0.0389, lon: -51.0664, pop: 512, capital: true},
            {nome: 'Rio Branco', uf: 'AC', lat: -9.9747, lon: -67.8073, pop: 413, capital: true},
            {nome: 'Boa Vista', uf: 'RR', lat: 2.8197, lon: -60.6733, pop: 419, capital: true},
            {nome: 'Palmas', uf: 'TO', lat: -10.1689, lon: -48.3317, pop: 306, capital: true},
            {nome: 'Santarém', uf: 'PA', lat: -2.4426, lon: -54.7083, pop: 308, capital: false},
            {nome: 'Marabá', uf: 'PA', lat: -5.3686, lon: -49.1178, pop: 275, capital: false}
        ];
        
        const municipiosLayer = L.layerGroup();
        
        municipios.forEach(municipio => {
            const size = municipio.capital ? 12 : (municipio.pop > 500 ? 10 : 8);
            const color = municipio.capital ? '#FF4444' : '#FF6B35';
            
            const marker = L.circleMarker([municipio.lat, municipio.lon], {
                radius: size,
                fillColor: color,
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`
                <div style="text-align: center;">
                    <h3>🏙️ ${municipio.nome}</h3>
                    <p><strong>Estado:</strong> ${municipio.uf}</p>
                    <p><strong>População:</strong> ${municipio.pop.toLocaleString('pt-BR')} mil hab.</p>
                    <p><strong>Tipo:</strong> ${municipio.capital ? 'Capital' : 'Município'}</p>
                    <hr>
                    <p><em>Município da Amazônia Legal - IBGE</em></p>
                </div>
            `);
            
            municipiosLayer.addLayer(marker);
        });
        
        console.log(`🏙️ ${municipios.length} municípios principais adicionados`);
        return municipiosLayer;
    }
    
    // Integração com o mapa principal
    async initializeWithMap(mapManager) {
        try {
            // Carrega dados IBGE
            await this.loadAmazoniaLegal();
            
            // Adiciona ao mapa
            const amazonLegalLayer = this.addToMap(mapManager.map);
            const estadosLayer = this.addEstadosAmazonicos(mapManager.map);
            const municipiosLayer = this.addMunicipiosAmazonicos(mapManager.map);
            
            // Registra as camadas no manager
            mapManager.layers.amazonLegal = amazonLegalLayer;
            mapManager.layers.estados = estadosLayer;
            mapManager.layers.municipios = municipiosLayer;
            
            console.log('✅ Integração IBGE concluída');
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro na integração IBGE:', error);
            return false;
        }
    }
}

// Torna disponível globalmente
window.IBGEDataLoader = IBGEDataLoader;

console.log('📊 IBGE Data Loader atualizado com dados processados');
