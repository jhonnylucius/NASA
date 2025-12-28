// 🌍 NASA EPIC Viewer - Terra ao Vivo ENHANCED 🎂
// Visualizador de imagens da Terra do espaço profundo
// Versão 2.0 - Com 6 novas features!

class EPICViewer {
    constructor() {
        this.apiBase = 'https://epic.gsfc.nasa.gov/api';
        this.archiveBase = 'https://epic.gsfc.nasa.gov/archive';
        this.images = [];
        this.currentIndex = 0;
        this.isLoading = false;
        this.currentState = null;

        // 🎨 Feature 1: Enhanced Color Toggle
        this.imageType = 'natural'; // 'natural' ou 'enhanced'

        // 🎞️ Feature 2: Timelapse
        this.isPlaying = false;
        this.playInterval = null;
        this.playSpeed = 1000; // ms entre frames

        // 📅 Feature 3: Datas Históricas
        this.availableDates = [];
        this.selectedDate = null;

        // 🌙 Feature 4: Posição Lua/Sol
        this.showAstroData = true;

        // 🔥 Feature 5: Integração FIRMS (preparado)
        this.firmsData = [];

        // 📊 Feature 6: Metadados expandidos
        this.showDetailedMetadata = true;

        // Coordenadas aproximadas dos estados brasileiros
        this.stateCoordinates = {
            // Amazônia Legal (9)
            'AC': { lat: -9.0, lon: -70.0, top: '48%', left: '28%' },    // Acre
            'AP': { lat: 1.0, lon: -52.0, top: '32%', left: '40%' },     // Amapá  
            'AM': { lat: -3.5, lon: -64.0, top: '40%', left: '30%' },    // Amazonas
            'MT': { lat: -12.5, lon: -55.0, top: '52%', left: '38%' },   // Mato Grosso
            'MA': { lat: -5.0, lon: -45.0, top: '42%', left: '45%' },    // Maranhão
            'PA': { lat: -3.0, lon: -52.0, top: '40%', left: '38%' },    // Pará
            'RO': { lat: -11.0, lon: -63.0, top: '50%', left: '32%' },   // Rondônia
            'RR': { lat: 2.0, lon: -61.0, top: '28%', left: '33%' },     // Roraima
            'TO': { lat: -10.0, lon: -48.0, top: '50%', left: '42%' },   // Tocantins

            // Nordeste (8)
            'PI': { lat: -7.5, lon: -42.0, top: '46%', left: '47%' },    // Piauí
            'CE': { lat: -5.0, lon: -39.5, top: '42%', left: '48%' },    // Ceará
            'RN': { lat: -5.5, lon: -36.5, top: '43%', left: '50%' },    // Rio Grande do Norte
            'PB': { lat: -7.0, lon: -36.5, top: '45%', left: '50%' },    // Paraíba
            'PE': { lat: -8.0, lon: -37.0, top: '47%', left: '49%' },    // Pernambuco
            'AL': { lat: -9.5, lon: -36.5, top: '49%', left: '50%' },    // Alagoas
            'SE': { lat: -10.5, lon: -37.0, top: '50%', left: '49%' },   // Sergipe
            'BA': { lat: -12.5, lon: -41.5, top: '52%', left: '47%' },   // Bahia

            // Centro-Oeste (3)
            'MS': { lat: -20.0, lon: -54.5, top: '60%', left: '38%' },   // Mato Grosso do Sul
            'GO': { lat: -15.5, lon: -49.5, top: '55%', left: '43%' },   // Goiás
            'DF': { lat: -15.8, lon: -47.9, top: '56%', left: '44%' },   // Distrito Federal

            // Sudeste (4)
            'SP': { lat: -23.5, lon: -46.6, top: '64%', left: '44%' },   // São Paulo
            'RJ': { lat: -22.9, lon: -43.2, top: '63%', left: '47%' },   // Rio de Janeiro
            'MG': { lat: -19.0, lon: -44.0, top: '59%', left: '46%' },   // Minas Gerais
            'ES': { lat: -19.5, lon: -40.3, top: '59%', left: '48%' },   // Espírito Santo

            // Sul (3)
            'PR': { lat: -25.0, lon: -50.0, top: '66%', left: '42%' },   // Paraná
            'SC': { lat: -27.0, lon: -50.0, top: '68%', left: '42%' },   // Santa Catarina
            'RS': { lat: -30.0, lon: -53.0, top: '71%', left: '40%' }    // Rio Grande do Sul
        };

        // Elementos DOM
        this.imageElement = document.getElementById('epic-image');
        this.dateSlider = document.getElementById('epic-date-slider');
        this.currentDateDisplay = document.getElementById('epic-current-date');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.amazonHighlight = document.querySelector('.amazon-highlight');

        this.init();
    }

    async init() {
        console.log('🌍 Inicializando EPIC Viewer...');

        if (!this.imageElement) {
            console.warn('Elementos EPIC não encontrados');
            return;
        }

        this.showLoading(true);

        try {
            await this.fetchLatestImages();
            this.setupControls();
            this.displayImage(0);
        } catch (error) {
            console.error('Erro ao carregar EPIC:', error);
            this.showError();
        } finally {
            this.showLoading(false);
        }
    }

    async fetchLatestImages(date = null) {
        try {
            console.log(`📡 Buscando imagens ${this.imageType}...`);

            let url = `${this.apiBase}/${this.imageType}`;
            if (date) {
                url += `/date/${date}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.images = await response.json();
            console.log(`✅ ${this.images.length} imagens ${this.imageType} carregadas`);

            if (this.images.length === 0) {
                throw new Error('Nenhuma imagem disponível');
            }

            // Encontrar melhor imagem para o Brasil
            const bestIndex = this.findBestImageForBrazil();
            this.currentIndex = bestIndex;

            // Atualizar slider (sem re-registrar event listeners)
            if (this.dateSlider) {
                this.dateSlider.max = this.images.length - 1;
                this.dateSlider.value = this.currentIndex;
            }

            // Exibir a imagem correta
            this.displayImage(this.currentIndex);

        } catch (error) {
            console.error('❌ Erro ao buscar imagens:', error);
            this.showError();
        }
    }

    // 📅 Feature 3: Buscar todas as datas disponíveis
    async fetchAvailableDates() {
        try {
            console.log('📅 Buscando datas disponíveis...');
            const response = await fetch(`${this.apiBase}/${this.imageType}/all`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.availableDates = data.map(item => item.date);
            console.log(`✅ ${this.availableDates.length} datas disponíveis`);

            return this.availableDates;
        } catch (error) {
            console.error('❌ Erro ao buscar datas:', error);
            return [];
        }
    }

    // 🎨 Feature 1: Toggle Enhanced/Natural
    async toggleImageType() {
        this.imageType = this.imageType === 'natural' ? 'enhanced' : 'natural';
        console.log(`🎨 Alterando para: ${this.imageType}`);

        this.showLoading(true);
        await this.fetchLatestImages(this.selectedDate);
        this.showLoading(false);

        // Atualizar UI do toggle
        this.updateImageTypeUI();
    }

    updateImageTypeUI() {
        const toggle = document.getElementById('epic-type-toggle');
        const label = document.getElementById('epic-type-label');

        if (toggle) {
            toggle.checked = this.imageType === 'enhanced';
        }
        if (label) {
            label.textContent = this.imageType === 'enhanced' ? '🎨 Enhanced' : '🌍 Natural';
        }
    }

    // 🎞️ Feature 2: Timelapse
    startTimelapse() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        console.log('▶️ Timelapse iniciado');

        this.playInterval = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.displayImage(this.currentIndex);

            if (this.dateSlider) {
                this.dateSlider.value = this.currentIndex;
            }
        }, this.playSpeed);

        this.updatePlayButtonUI();
    }

    stopTimelapse() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        console.log('⏸️ Timelapse pausado');

        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }

        this.updatePlayButtonUI();
    }

    toggleTimelapse() {
        if (this.isPlaying) {
            this.stopTimelapse();
        } else {
            this.startTimelapse();
        }
    }

    setPlaySpeed(speed) {
        this.playSpeed = speed;
        if (this.isPlaying) {
            this.stopTimelapse();
            this.startTimelapse();
        }
    }

    updatePlayButtonUI() {
        const playBtn = document.getElementById('epic-play-btn');
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? '⏸️ Pausar' : '▶️ Play';
            playBtn.classList.toggle('playing', this.isPlaying);
        }
    }

    // 📅 Feature 3: Selecionar data histórica
    async selectDate(date) {
        this.selectedDate = date;
        console.log(`📅 Selecionando data: ${date}`);

        this.showLoading(true);
        await this.fetchLatestImages(date);
        this.showLoading(false);
    }

    findBestImageForBrazil() {
        if (!this.images || this.images.length === 0) return 0;

        const brazilLon = -55.0; // Longitude central aproximada do Brasil
        let bestIndex = 0;
        let minDiff = Infinity;

        this.images.forEach((img, index) => {
            if (img.centroid_coordinates && typeof img.centroid_coordinates.lon === 'number') {
                // Calcular diferença considerando a rotação da Terra (ciclo de 360 graus)
                let diff = Math.abs(img.centroid_coordinates.lon - brazilLon);
                if (diff > 180) diff = 360 - diff;

                if (diff < minDiff) {
                    minDiff = diff;
                    bestIndex = index;
                }
            }
        });

        console.log(`📍 Melhor imagem para Brasil: Index ${bestIndex} (Lon: ${this.images[bestIndex].centroid_coordinates.lon})`);
        return bestIndex;
    }

    setupControls() {
        if (!this.dateSlider) return;

        // Configurar slider
        this.dateSlider.max = this.images.length - 1;
        this.dateSlider.value = this.currentIndex;

        this.dateSlider.addEventListener('input', (e) => {
            this.currentIndex = parseInt(e.target.value);
            this.displayImage(this.currentIndex);
        });

        // Botões de estados da Amazônia
        const stateButtons = document.querySelectorAll('.state-btn');
        stateButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const state = e.target.getAttribute('data-state');
                this.focusState(state);

                // Visual feedback - marcar botão ativo
                stateButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Botão zoom Amazônia (geral)
        const zoomButton = document.getElementById('epic-zoom-amazon');
        if (zoomButton) {
            zoomButton.addEventListener('click', () => {
                this.zoomToAmazon();
                // Remover seleção de estados específicos
                stateButtons.forEach(b => b.classList.remove('active'));
                this.currentState = null;
            });
        }

        // Botão atualizar
        const refreshButton = document.getElementById('epic-refresh');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.refresh());
        }

        // 🎨 Feature 1: Toggle Enhanced/Natural
        const typeToggle = document.getElementById('epic-type-toggle');
        if (typeToggle) {
            typeToggle.addEventListener('change', () => this.toggleImageType());
        }

        // 🎞️ Feature 2: Timelapse controls
        const playBtn = document.getElementById('epic-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.toggleTimelapse());
        }

        const speedSelect = document.getElementById('epic-speed-select');
        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                this.setPlaySpeed(parseInt(e.target.value));
            });
        }

        // 📅 Feature 3: Date picker
        const datePicker = document.getElementById('epic-date-picker');
        if (datePicker) {
            // Definir data máxima como hoje
            const today = new Date().toISOString().split('T')[0];
            datePicker.max = today;
            datePicker.min = '2015-06-13'; // Primeira imagem EPIC

            datePicker.addEventListener('change', (e) => {
                this.selectDate(e.target.value);
            });
        }

        // 🔥 Feature 5: Toggle Fire Overlay
        const fireToggle = document.getElementById('epic-fire-toggle');
        if (fireToggle) {
            fireToggle.addEventListener('click', () => this.toggleFireOverlay());
        }

        console.log('🎮 Controles configurados (Enhanced!)');
    }

    displayImage(index) {
        if (!this.images || this.images.length === 0) return;

        const image = this.images[index];
        const dateParts = image.date.split(' ')[0].split('-');
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        // Construir URL da imagem usando imageType
        const imageUrl = `${this.archiveBase}/${this.imageType}/${year}/${month}/${day}/png/${image.image}.png`;

        console.log(`📸 Carregando imagem ${this.imageType}: ${image.image}`);

        // Mostrar loading enquanto carrega
        this.showLoading(true);

        // Criar nova imagem para pré-carregar
        const img = new Image();
        img.onload = () => {
            this.imageElement.src = imageUrl;
            this.updateInfo(image);
            this.updateAstroInfo(image);
            this.showLoading(false);
        };
        img.onerror = () => {
            console.error('❌ Erro ao carregar imagem');
            this.showLoading(false);
        };
        img.src = imageUrl;

        // Atualizar display de data
        if (this.currentDateDisplay) {
            const formattedDate = new Date(image.date).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            this.currentDateDisplay.textContent = formattedDate;
        }
    }

    updateInfo(image) {
        // Atualizar painel de informações
        const dateElement = document.getElementById('epic-info-date');
        const coordsElement = document.getElementById('epic-info-coords');
        const distanceElement = document.getElementById('epic-info-distance');

        if (dateElement) {
            dateElement.textContent = new Date(image.date).toLocaleDateString('pt-BR');
        }

        if (coordsElement && image.centroid_coordinates) {
            const lat = image.centroid_coordinates.lat.toFixed(2);
            const lon = image.centroid_coordinates.lon.toFixed(2);
            coordsElement.textContent = `${lat}°, ${lon}°`;
        }

        if (distanceElement && image.dscovr_j2000_position) {
            // Calcular distância aproximada da Terra
            const x = image.dscovr_j2000_position.x;
            const y = image.dscovr_j2000_position.y;
            const z = image.dscovr_j2000_position.z;
            const distance = Math.sqrt(x * x + y * y + z * z);
            distanceElement.textContent = `${distance.toFixed(0)} km`;
        }
    }

    // 🌙 Feature 4: Atualizar informações astronômicas
    updateAstroInfo(image) {
        const sunElement = document.getElementById('epic-sun-position');
        const moonElement = document.getElementById('epic-moon-position');
        const satElement = document.getElementById('epic-sat-position');

        // Posição do Sol
        if (sunElement && image.sun_j2000_position) {
            const sun = image.sun_j2000_position;
            const sunDist = Math.sqrt(sun.x * sun.x + sun.y * sun.y + sun.z * sun.z);
            sunElement.textContent = `${(sunDist / 1000000).toFixed(2)} milhões km`;
        }

        // Posição da Lua
        if (moonElement && image.lunar_j2000_position) {
            const moon = image.lunar_j2000_position;
            const moonDist = Math.sqrt(moon.x * moon.x + moon.y * moon.y + moon.z * moon.z);
            moonElement.textContent = `${moonDist.toFixed(0)} km`;
        }

        // Posição do Satélite DSCOVR
        if (satElement && image.dscovr_j2000_position) {
            const sat = image.dscovr_j2000_position;
            const satDist = Math.sqrt(sat.x * sat.x + sat.y * sat.y + sat.z * sat.z);
            satElement.textContent = `${satDist.toFixed(0)} km`;
        }

        // Atualizar indicadores visuais de Lua/Sol
        this.updateAstroVisualization(image);
    }

    updateAstroVisualization(image) {
        const sunIndicator = document.querySelector('.sun-indicator');
        const moonIndicator = document.querySelector('.moon-indicator');

        if (sunIndicator && image.sun_j2000_position) {
            // Calcular ângulo do sol baseado na posição
            const sun = image.sun_j2000_position;
            const angle = Math.atan2(sun.y, sun.x) * (180 / Math.PI);
            sunIndicator.style.transform = `rotate(${angle}deg)`;
        }

        if (moonIndicator && image.lunar_j2000_position) {
            const moon = image.lunar_j2000_position;
            const angle = Math.atan2(moon.y, moon.x) * (180 / Math.PI);
            moonIndicator.style.transform = `rotate(${angle}deg)`;
        }
    }

    zoomToAmazon() {
        if (!this.amazonHighlight) return;

        // Resetar para posição central da Amazônia
        this.amazonHighlight.style.top = '42%';
        this.amazonHighlight.style.left = '33%';
        this.amazonHighlight.style.width = '18%';
        this.amazonHighlight.style.height = '18%';

        // Animar destaque
        this.amazonHighlight.style.animation = 'none';
        setTimeout(() => {
            this.amazonHighlight.style.animation = 'pulse 2s ease-in-out infinite, zoom-in 1s ease';
        }, 10);

        console.log('🔍 Zoom na Amazônia!');
    }

    focusState(stateCode) {
        if (!this.amazonHighlight || !this.stateCoordinates[stateCode]) return;

        const coords = this.stateCoordinates[stateCode];
        this.currentState = stateCode;

        // Mover círculo para o estado
        this.amazonHighlight.style.top = coords.top;
        this.amazonHighlight.style.left = coords.left;
        this.amazonHighlight.style.width = '12%';
        this.amazonHighlight.style.height = '12%';

        // Animar destaque
        this.amazonHighlight.style.animation = 'none';
        setTimeout(() => {
            this.amazonHighlight.style.animation = 'pulse 2s ease-in-out infinite, focus-state 0.8s ease';
        }, 10);

        console.log(`📍 Focado em: ${stateCode}`);
    }

    async refresh() {
        console.log('🔄 Atualizando...');
        this.showLoading(true);

        try {
            await this.fetchLatestImages();
            this.currentIndex = 0;
            this.dateSlider.value = 0;
            this.displayImage(0);
        } catch (error) {
            console.error('❌ Erro ao atualizar:', error);
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = show ? 'flex' : 'none';
        }
        this.isLoading = show;
    }

    showError() {
        if (this.imageElement) {
            this.imageElement.alt = 'Erro ao carregar imagem da Terra';
        }
        console.error('❌ Falha ao carregar visualizador EPIC');
    }

    // 🔥 Feature 5: Integração FIRMS
    async fetchFireData() {
        try {
            console.log('🔥 Buscando dados de incêndios...');

            const apiBase = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';
            const mapKey = '02a6b6ad3f23a3af3fe8d8ba432a8c9b';
            const brazilBounds = '-74,-34,-34,6';
            const days = 1;

            const url = `${apiBase}/${mapKey}/VIIRS_NOAA20_NRT/${brazilBounds}/${days}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const csvText = await response.text();
            this.firmsData = this.parseFireCSV(csvText);

            console.log(`✅ ${this.firmsData.length} focos de incêndio encontrados`);

            return this.firmsData;
        } catch (error) {
            console.error('❌ Erro ao buscar dados FIRMS:', error);
            return [];
        }
    }

    parseFireCSV(csvText) {
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

            if (row.latitude && row.longitude) {
                row.lat = parseFloat(row.latitude);
                row.lon = parseFloat(row.longitude);
                row.frp = parseFloat(row.frp) || 0;
                data.push(row);
            }
        }

        return data;
    }

    async toggleFireOverlay() {
        const overlay = document.getElementById('fire-overlay');
        const btn = document.getElementById('epic-fire-toggle');
        const epicImage = document.getElementById('epic-image');

        if (!overlay) return;

        if (overlay.classList.contains('active')) {
            // Desativar overlay
            overlay.classList.remove('active');
            overlay.innerHTML = '';
            if (btn) btn.classList.remove('active');

            // Restaurar rotação
            if (epicImage) {
                epicImage.style.animation = 'gentle-rotate 120s linear infinite';
                epicImage.style.transform = '';
            }

            console.log('🔥 Overlay de incêndios desativado');
        } else {
            // Ativar overlay
            overlay.classList.add('active');
            if (btn) btn.classList.add('active');

            // Selecionar a melhor imagem do Brasil automaticamente
            const bestIndex = this.findBestImageForBrazil();
            console.log(`🔥 Selecionando melhor imagem: ${bestIndex}`);

            this.currentIndex = bestIndex;
            if (this.dateSlider) {
                this.dateSlider.value = bestIndex;
            }
            this.displayImage(bestIndex);

            // Parar rotação após um pequeno delay para garantir que a imagem carregou
            setTimeout(() => {
                if (epicImage) {
                    epicImage.style.animation = 'none';
                    epicImage.style.transform = 'rotate(0deg)';
                    console.log('🔥 Rotação parada');
                }
            }, 500);

            // Buscar dados se ainda não tem
            if (this.firmsData.length === 0) {
                await this.fetchFireData();
            }

            this.renderFireOverlay();
            console.log('🔥 Overlay ativado');
        }
    }

    renderFireOverlay() {
        const overlay = document.getElementById('fire-overlay');
        if (!overlay || this.firmsData.length === 0) return;

        overlay.innerHTML = '';

        // Pegar imagem atual para coordenadas
        const currentImage = this.images[this.currentIndex];
        if (!currentImage) return;

        const centerLon = currentImage.centroid_coordinates?.lon || -55;
        const centerLat = currentImage.centroid_coordinates?.lat || -10;

        // Renderizar pontos de fogo
        this.firmsData.forEach(fire => {
            // Converter lat/lon para posição no círculo da Terra
            const position = this.geoToImagePosition(fire.lat, fire.lon, centerLat, centerLon);

            if (position) {
                const dot = document.createElement('div');
                dot.className = 'fire-dot';
                dot.style.left = position.x + '%';
                dot.style.top = position.y + '%';

                // Cor baseada na intensidade
                const color = this.getFireColor(fire.frp);
                dot.style.background = color;
                dot.style.boxShadow = `0 0 ${4 + fire.frp / 20}px ${color}`;

                // Tooltip
                dot.title = `🔥 FRP: ${fire.frp.toFixed(1)} MW\n📍 ${fire.lat.toFixed(2)}°, ${fire.lon.toFixed(2)}°`;

                overlay.appendChild(dot);
            }
        });

        console.log(`🔥 ${overlay.children.length} pontos de fogo renderizados`);
    }

    geoToImagePosition(lat, lon, centerLat, centerLon) {
        // Converter coordenadas geográficas para posição no círculo da imagem
        // A imagem EPIC mostra aproximadamente 180° de longitude e latitude

        const deltaLon = lon - centerLon;
        const deltaLat = lat - centerLat;

        // Se está muito longe do centro, não é visível
        if (Math.abs(deltaLon) > 90 || Math.abs(deltaLat) > 90) {
            return null;
        }

        // Escalar para posição 0-100%
        // Ajustado: mover pontos mais para noroeste (esquerda e cima)
        const scale = 0.50; // Fator de escala ajustado
        const offsetX = -5;  // Mover para esquerda (oeste)
        const offsetY = -8;  // Mover para cima (norte)

        const x = 50 + (deltaLon * scale) + offsetX;
        const y = 50 - (deltaLat * scale) + offsetY;

        // Verificar se está dentro do círculo da Terra
        const distFromCenter = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));
        if (distFromCenter > 48) {
            return null; // Fora do disco da Terra
        }

        return { x, y };
    }

    getFireColor(frp) {
        if (frp > 100) return '#ff0000';
        if (frp > 50) return '#ff4500';
        if (frp > 20) return '#ff8c00';
        if (frp > 10) return '#ffa500';
        return '#ffd700';
    }
}

// Inicializar quando DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
    window.epicViewer = new EPICViewer();
});
