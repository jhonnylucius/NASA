// 🌍 NASA EPIC Viewer - Terra ao Vivo
// Visualizador de imagens da Terra do espaço profundo

class EPICViewer {
    constructor() {
        this.apiBase = 'https://epic.gsfc.nasa.gov/api';
        this.archiveBase = 'https://epic.gsfc.nasa.gov/archive';
        this.images = [];
        this.currentIndex = 0;
        this.isLoading = false;
        this.currentState = null;

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

    async fetchLatestImages() {
        try {
            console.log('📡 Buscando imagens da NASA EPIC...');
            const response = await fetch(`${this.apiBase}/natural`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.images = await response.json();
            console.log(`✅ ${this.images.length} imagens carregadas`);

            if (this.images.length === 0) {
                throw new Error('Nenhuma imagem disponível');
            }
        } catch (error) {
            console.error('❌ Erro ao buscar imagens:', error);
            // Fallback: tentar data específica recente
            await this.fetchFallbackImages();
        }
    }

    async fetchFallbackImages() {
        try {
            // Tentar último mês
            const date = new Date();
            date.setDate(date.getDate() - 30);
            const dateStr = date.toISOString().split('T')[0];

            const response = await fetch(`${this.apiBase}/natural/date/${dateStr}`);
            if (response.ok) {
                this.images = await response.json();
                console.log(`✅ Fallback: ${this.images.length} imagens de ${dateStr}`);
            }
        } catch (error) {
            console.error('❌ Fallback falhou:', error);
            throw new Error('Não foi possível carregar imagens EPIC');
        }
    }

    setupControls() {
        if (!this.dateSlider) return;

        // Configurar slider
        this.dateSlider.max = this.images.length - 1;
        this.dateSlider.value = 0;

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

        console.log('🎮 Controles configurados');
    }

    displayImage(index) {
        if (!this.images || this.images.length === 0) return;

        const image = this.images[index];
        const dateParts = image.date.split(' ')[0].split('-');
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        // Construir URL da imagem
        const imageUrl = `${this.archiveBase}/natural/${year}/${month}/${day}/png/${image.image}.png`;

        console.log(`📸 Carregando imagem: ${image.image}`);

        // Mostrar loading enquanto carrega
        this.showLoading(true);

        // Criar nova imagem para pré-carregar
        const img = new Image();
        img.onload = () => {
            this.imageElement.src = imageUrl;
            this.updateInfo(image);
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
}

// Inicializar quando DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
    window.epicViewer = new EPICViewer();
});
