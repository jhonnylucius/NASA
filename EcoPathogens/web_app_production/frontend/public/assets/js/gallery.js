// 📸 EcoGuardians - Gallery Manager
// Sistema de galeria de impacto ambiental

class GalleryManager {
    constructor() {
        this.galleryGrid = document.getElementById('gallery-grid');
        this.modal = document.getElementById('image-modal');
        this.currentFilter = 'all';
        this.images = [];
        this.loadedImages = new Set();
        this.itemsPerPage = 12;
        this.currentPage = 1;
        this.init();
    }

    init() {
        console.log('📸 GalleryManager inicializado');

        if (!this.galleryGrid) {
            console.warn('Elemento da galeria não encontrado');
            return;
        }

        this.setupFilters();
        this.setupModal();
        this.loadImages();
        this.setupInfiniteScroll();
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remover classe active de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));

                // Adicionar classe active ao botão clicado
                e.target.classList.add('active');

                // Aplicar filtro
                const filter = e.target.getAttribute('data-filter');
                this.applyFilter(filter);

                console.log(`🎯 Filtro aplicado: ${filter}`);
            });
        });
    }

    setupModal() {
        if (!this.modal) return;

        const closeBtn = this.modal.querySelector('.modal-close');
        const modalImage = this.modal.querySelector('#modal-image');

        // Fechar modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Fechar modal ao clicar fora
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display !== 'none') {
                this.closeModal();
            }
        });

        // Navegação com teclado
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display !== 'none') {
                if (e.key === 'ArrowLeft') {
                    this.showPreviousImage();
                } else if (e.key === 'ArrowRight') {
                    this.showNextImage();
                }
            }
        });
    }

    loadImages() {
        // Gerar dados das imagens
        this.images = this.generateImageData();

        // Renderizar primeira página
        this.renderImages();

        console.log(`📊 ${this.images.length} imagens carregadas`);
    }

    generateImageData() {
        // Lista completa de imagens reais (145 fotos)
        const realImages = [
            'DESMATAMENTOAWS.jpg', 'DESMATAMENTOAWS1.jpg', 'DESMATAMENTOAWS2.jpg', 'DESMATAMENTOAWS3.jpg',
            'DESMATAMENTOAWS4.jpg', 'DESMATAMENTOAWS5.jpg', 'DESMATAMENTOAWS6.jpg', 'DESMATAMENTOAWS7.jpg',
            'DESMATAMENTOAWS8.jpg', 'DESMATAMENTOAWS9.jpg', 'DESMATAMENTOAWS10.jpg', 'DESMATAMENTOAWS11.jpg',
            'QUEIMADAS.jpg', 'QUEIMADAS1.jpg', 'QUEIMADAS2.jpg', 'QUEIMADAS3.jpg', 'QUEIMADAS4.jpg',
            'QUEIMADAS5.jpg', 'QUEIMADAS6.jpg', 'QUEIMADAS7.jpg', 'QUEIMADAS8.jpg', 'QUEIMADAS9.jpg', 'EMCHAMAS.jpg',
            'ENCHENTES.jpg', 'ENCHENTES1.jpg', 'ENCHENTES2.jpg', 'ENCHENTES3.jpg', 'ENCHENTES4.jpg',
            'ENCHENTES5.jpg', 'ENCHENTES6.jpg', 'ENCHENTES7.jpg', 'ENCHENTES8.jpg', 'ENCHENTES9.jpg',
            'EPIDEMIAS.jpg', 'EPIDEMIAS1.jpg', 'EPIDEMIAS2.jpg', 'EPIDEMIAS3.jpg', 'EPIDEMIAS4.jpg',
            'EPIDEMIAS5.jpg', 'EPIDEMIAS6.jpg', 'EPIDEMIAS7.jpg', 'EPIDEMIAS8.jpg', 'EPIDEMIASAGRICOLA.jpg',
            'VIRUS.jpg', 'VIRUS1.jpg', 'VIRUS2.jpg', 'VIRUS3.jpg', 'VIRUS4.jpg', 'VIRUS5.jpg',
            'FURACAO-TORNADO.jpg', 'FURACAO.jpg', 'FURACAO1.jpg', 'TORNADO.jpg', 'TORNADO1.jpg',
            'TORNADO2.jpg', 'TORNADO3.jpg', 'TORNADO4.jpg', 'TORNADO5.jpg', 'TORNADO6.jpg', 'TORNADO7.jpg',
            'VULCAO.jpg', 'VULCAO1.jpg', 'VULCAO2.jpg', 'VULCAO3.jpg', 'VULCAO4.jpg',
            'CLIMA.jpg', 'CLIMA2.jpg', 'CLIMA2SECA.jpg', 'CLIMA3.jpg', 'CLIMA4.jpg', 'CLIMA5.jpg', 'CLIMA6.jpg', 'CLIMA8.jpg',
            'SECA.jpg', 'SECA1.jpg', 'SECA2.jpg', 'SECA3.jpg',
            'INDIGINAS.jpg', 'INDIGINAS1.jpg', 'INDIGINAS2.jpg', 'INDIGINAS3.jpg', 'INDIGINAS4.jpg',
            'INDIGINAS5.jpg', 'INDIGINAS6.jpg', 'INDIGINAS7.jpg', 'INDIGINAS8.jpg', 'INDIGINAS9.jpg',
            'GARIMPOILEGAL.jpg', 'GARIMPOILEGAL1.jpg', 'GARIMPOILEGAL2.jpg', 'GARIMPOILEGAL3.jpg',
            'GARIMPOILEGAL4.jpg', 'GARIMPOILEGAL5.jpg',
            'DOENTE.jpg', 'SOFRIMENTO.jpg', 'SOFRIMENTO1.jpg', 'SOFRIMENTO2.jpg', 'SOFRIMENTO3.jpg',
            'SOFRIMENTO4.jpg', 'SOFRIMENTO5.jpg',
            'TERREMOTO.jpg', 'TERREMOTO1.jpg', 'TERREMOTO2.jpg',
            'LAVOURAPERDIDA.jpg', 'LAVOURAPERDIDA1.jpg',
            'SATELITE.jpg', 'SATELITE1.jpg', 'SATELITE-EM-MALHA.jpg', 'SATELITE-EM-MALHA1.jpg',
            'SATELITE-EM-MALHA2.jpg', 'SATELITE-EM-MALHA3.jpg',
            'SOL.jpg', 'SOL1.jpg', 'SOL2.jpg',
            'ANALISE DE DADOS.jpg', 'ANALISE DE DADOS1.jpg', 'ANALISE DE DADOS2.jpg', 'ANALISE DE DADOS3.jpg',
            'BRASILFLORESTA.jpg', 'POLITICOS.jpg', 'CULPADOS.jpg',
            'A TERRA VAI SOBRIVIVER.jpg', 'A TERRA VAI SOBRIVIVER1.jpg',
            'PLANETA.jpg', 'PLANETA1.jpg', 'PLANETA2.jpg', 'PLANETA3.jpg',
            'DERRETENDO.jpg', 'DERRETIMENTOCALOTASPOLARES.jpg', '5DERRETIMENTOCALOTASPOLARES14.jpg',
            'DERRETIMENTOCALOTASPOLARES1.jpg', 'DERRETIMENTOCALOTASPOLARES2.jpg', 'DERRETIMENTOCALOTASPOLARES3.jpg',
            'DERRETIMENTOCALOTASPOLARES4.jpg', 'DERRETIMENTOCALOTASPOLARES5.jpg', 'DERRETIMENTOCALOTASPOLARES6.jpg',
            'DERRETIMENTOCALOTASPOLARES7.jpg', 'DERRETIMENTOCALOTASPOLARES8.jpg', 'DERRETIMENTOCALOTASPOLARES9.jpg',
            'DERRETIMENTOCALOTASPOLARES10.jpg', 'DERRETIMENTOCALOTASPOLARES11.jpg', 'DERRETIMENTOCALOTASPOLARES12.jpg',
            'DERRETIMENTOCALOTASPOLARES13.jpg', 'DERRETIMENTOCALOTASPOLARES14.jpg', 'DERRETIMENTOCALOTASPOLARES15.jpg'
        ];

        const locations = [
            'Acre', 'Amazonas', 'Amapá', 'Maranhão', 'Mato Grosso',
            'Pará', 'Rondônia', 'Roraima', 'Tocantins'
        ];

        const images = realImages.map((filename, index) => {
            const name = filename.toUpperCase().replace('.JPG', '');
            let category = 'deforestation';

            // Categorizar por nome
            if (name.includes('QUEIMADA') || name.includes('CHAMAS') || name.includes('VULCAO')) category = 'fires';
            else if (name.includes('ENCHENTE') || name.includes('TORNADO') || name.includes('FURACAO') || name.includes('TERREMOTO')) category = 'floods';
            else if (name.includes('SECA') || name.includes('CLIMA')) category = 'drought';
            else if (name.includes('EPIDEMIA') || name.includes('VIRUS') || name.includes('DOENTE') || name.includes('SOFRIMENTO') || name.includes('GARIMPO')) category = 'pollution';

            const year = 1975 + Math.floor(Math.random() * 50);
            const location = locations[Math.floor(Math.random() * locations.length)];

            return {
                id: index + 1,
                src: `assets/images/${filename}`,
                title: filename.replace('.jpg', '').replace(/\d+/g, ' #').trim() || `Imagem #${index + 1}`,
                description: this.generateDescription(category, location, year),
                category: category,
                year: year,
                location: location,
                coordinates: this.getRandomCoordinates(),
                severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
                source: 'NASA/MODIS',
                date: this.generateRandomDate(year)
            };
        });

        return images;
    }

    generatePlaceholderImage(category, id) {
        // Gerar uma imagem placeholder com cores baseadas na categoria
        const colors = {
            deforestation: '#8B4513,#228B22',
            fires: '#FF4500,#DC143C',
            floods: '#4682B4,#00BFFF',
            drought: '#DAA520,#D2691E',
            pollution: '#696969,#2F4F4F'
        };

        const colorPair = colors[category] || '#808080,#A0A0A0';
        const [color1, color2] = colorPair.split(',');

        // Criar URL de imagem placeholder usando um serviço online ou dados SVG
        return `data:image/svg+xml,${encodeURIComponent(`
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#grad${id})"/>
                <text x="200" y="140" font-family="Arial" font-size="20" fill="white" text-anchor="middle" font-weight="bold">${category.toUpperCase()}</text>
                <text x="200" y="170" font-family="Arial" font-size="16" fill="white" text-anchor="middle">#${id.toString().padStart(3, '0')}</text>
                <text x="200" y="190" font-family="Arial" font-size="12" fill="rgba(255,255,255,0.8)" text-anchor="middle">NASA/MODIS</text>
            </svg>
        `)}`;
    }

    generateDescription(category, location, year) {
        const descriptions = {
            deforestation: [
                `Área de desmatamento registrada em ${location} no ano de ${year}. Imagem capturada por satélite mostra a extensão da remoção da cobertura vegetal.`,
                `Desmatamento detectado na região de ${location} (${year}). Análise indica perda significativa de biodiversidade local.`,
                `Registro de desmatamento em ${location} durante ${year}. Área afetada: aproximadamente ${(Math.random() * 1000 + 100).toFixed(0)} hectares.`
            ],
            fires: [
                `Foco de queimada identificado em ${location} no ano ${year}. Incêndio de origem ${Math.random() > 0.5 ? 'natural' : 'antrópica'}.`,
                `Grande incêndio registrado em ${location} (${year}). Fumaça visível a mais de ${Math.floor(Math.random() * 50 + 10)}km de distância.`,
                `Queimada em ${location} durante ${year}. Temperatura do foco: ${Math.floor(Math.random() * 200 + 400)}°C.`
            ],
            floods: [
                `Inundação severa em ${location} no ano de ${year}. Nível da água ${Math.floor(Math.random() * 5 + 2)}m acima do normal.`,
                `Enchente histórica registrada em ${location} (${year}). Área alagada: ${Math.floor(Math.random() * 10000 + 1000)} km².`,
                `Inundação em ${location} durante ${year}. Precipitação acumulada: ${Math.floor(Math.random() * 200 + 100)}mm em 24h.`
            ],
            drought: [
                `Período de seca extrema em ${location} registrado em ${year}. ${Math.floor(Math.random() * 120 + 60)} dias sem chuva significativa.`,
                `Seca severa afeta ${location} no ano de ${year}. Nível dos rios ${Math.floor(Math.random() * 80 + 20)}% abaixo da média histórica.`,
                `Estiagem prolongada em ${location} (${year}). Temperatura máxima: ${Math.floor(Math.random() * 10 + 38)}°C.`
            ],
            pollution: [
                `Poluição atmosférica detectada em ${location} durante ${year}. Concentração de PM2.5: ${Math.floor(Math.random() * 50 + 25)}μg/m³.`,
                `Contaminação hídrica registrada em ${location} no ano ${year}. Análise indica presença de metais pesados.`,
                `Poluição do ar em ${location} (${year}). Visibilidade reduzida a ${Math.floor(Math.random() * 5 + 1)}km devido à fumaça.`
            ]
        };

        const categoryDescriptions = descriptions[category] || [`Impacto ambiental registrado em ${location} no ano de ${year}.`];
        return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
    }

    getRandomCoordinates() {
        return {
            lat: (-18 + Math.random() * 23).toFixed(4), // Latitude da Amazônia
            lng: (-82 + Math.random() * 38).toFixed(4)  // Longitude da Amazônia
        };
    }

    generateRandomDate(year) {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);
        const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(randomTime).toLocaleDateString('pt-BR');
    }

    renderImages() {
        if (!this.galleryGrid) return;

        // Filtrar imagens
        let filteredImages = this.images;
        if (this.currentFilter !== 'all') {
            filteredImages = this.images.filter(img => img.category === this.currentFilter);
        }

        // Pagar images
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const imagesToShow = filteredImages.slice(0, endIndex);

        // Limpar grid se for a primeira página
        if (this.currentPage === 1) {
            this.galleryGrid.innerHTML = '';
        }

        // Renderizar imagens
        imagesToShow.slice(startIndex).forEach(image => {
            const imageElement = this.createImageElement(image);
            this.galleryGrid.appendChild(imageElement);
        });

        // Lazy loading das imagens
        this.setupLazyLoading();

        console.log(`🖼️ Renderizadas ${imagesToShow.length} imagens (${this.currentFilter})`);
    }

    createImageElement(image) {
        const div = document.createElement('div');
        div.className = `gallery-item ${image.category}`;
        div.setAttribute('data-category', image.category);
        div.setAttribute('data-year', image.year);
        div.setAttribute('data-severity', image.severity);

        div.innerHTML = `
            <div class="image-container">
                <img src="data:image/svg+xml,${encodeURIComponent('<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="#f0f0f0"/><text x="150" y="100" font-family="Arial" font-size="14" fill="#999" text-anchor="middle">Carregando...</text></svg>')}" 
                     data-src="${image.src}" 
                     alt="${image.title}"
                     class="gallery-image lazy">
                <div class="image-overlay">
                    <div class="image-info">
                        <h3>${image.title}</h3>
                        <p class="image-location">📍 ${image.location}</p>
                        <p class="image-date">📅 ${image.date}</p>
                        <div class="image-tags">
                            <span class="tag category-tag">${this.getCategoryName(image.category)}</span>
                            <span class="tag severity-tag severity-${image.severity}">${image.severity.toUpperCase()}</span>
                        </div>
                    </div>
                    <button class="view-btn" data-image-id="${image.id}">
                        🔍 Ver Detalhes
                    </button>
                </div>
            </div>
        `;

        // Adicionar event listener para abrir modal
        const viewBtn = div.querySelector('.view-btn');
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openModal(image);
        });

        // Click na imagem também abre o modal
        div.addEventListener('click', () => {
            this.openModal(image);
        });

        return div;
    }

    getCategoryName(category) {
        const names = {
            deforestation: 'Desmatamento',
            fires: 'Queimadas',
            floods: 'Inundações',
            drought: 'Secas',
            pollution: 'Poluição'
        };
        return names[category] || category;
    }

    setupLazyLoading() {
        const lazyImages = this.galleryGrid.querySelectorAll('.lazy');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores sem IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.getAttribute('data-src');
                img.classList.remove('lazy');
            });
        }
    }

    setupInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.loadMoreImages();
            }
        }, { threshold: 1.0 });

        // Criar elemento sentinela
        const sentinel = document.createElement('div');
        sentinel.id = 'scroll-sentinel';
        sentinel.style.height = '1px';
        this.galleryGrid.parentElement.appendChild(sentinel);

        observer.observe(sentinel);
    }

    loadMoreImages() {
        let filteredImages = this.images;
        if (this.currentFilter !== 'all') {
            filteredImages = this.images.filter(img => img.category === this.currentFilter);
        }

        const totalPages = Math.ceil(filteredImages.length / this.itemsPerPage);

        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderImages();
        }
    }

    applyFilter(filter) {
        this.currentFilter = filter;
        this.currentPage = 1;
        this.renderImages();

        // Animar transição
        this.animateFilterTransition();
    }

    animateFilterTransition() {
        const items = this.galleryGrid.querySelectorAll('.gallery-item');

        // Fade out
        items.forEach((item, index) => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
        });

        setTimeout(() => {
            // Fade in
            const newItems = this.galleryGrid.querySelectorAll('.gallery-item');
            newItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 50);
            });
        }, 300);
    }

    openModal(image) {
        if (!this.modal) return;

        const modalImage = this.modal.querySelector('#modal-image');
        const titleElement = this.modal.querySelector('#image-title');
        const descriptionElement = this.modal.querySelector('#image-description');
        const dateElement = this.modal.querySelector('#image-date');
        const locationElement = this.modal.querySelector('#image-location');
        const categoryElement = this.modal.querySelector('#image-category');

        // Preencher dados
        if (modalImage) modalImage.src = image.src;
        if (titleElement) titleElement.textContent = image.title;
        if (descriptionElement) descriptionElement.textContent = image.description;
        if (dateElement) dateElement.textContent = image.date;
        if (locationElement) locationElement.textContent = `${image.location} (${image.coordinates.lat}, ${image.coordinates.lng})`;
        if (categoryElement) categoryElement.textContent = this.getCategoryName(image.category);

        // Mostrar modal
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Animar entrada
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.opacity = '1';
        }, 10);

        this.currentModalImageId = image.id;
    }

    closeModal() {
        if (!this.modal) return;

        // Animar saída
        this.modal.style.opacity = '0';

        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    showPreviousImage() {
        const currentIndex = this.images.findIndex(img => img.id === this.currentModalImageId);
        if (currentIndex > 0) {
            this.openModal(this.images[currentIndex - 1]);
        }
    }

    showNextImage() {
        const currentIndex = this.images.findIndex(img => img.id === this.currentModalImageId);
        if (currentIndex < this.images.length - 1) {
            this.openModal(this.images[currentIndex + 1]);
        }
    }

    // Método para busca por texto
    searchImages(query) {
        const filteredImages = this.images.filter(image =>
            image.title.toLowerCase().includes(query.toLowerCase()) ||
            image.description.toLowerCase().includes(query.toLowerCase()) ||
            image.location.toLowerCase().includes(query.toLowerCase())
        );

        this.renderFilteredImages(filteredImages);
    }

    renderFilteredImages(images) {
        this.galleryGrid.innerHTML = '';

        images.forEach(image => {
            const imageElement = this.createImageElement(image);
            this.galleryGrid.appendChild(imageElement);
        });

        this.setupLazyLoading();
    }

    // Método para exportar estatísticas
    getStatistics() {
        const stats = {
            total: this.images.length,
            categories: {},
            years: {},
            locations: {},
            severity: { high: 0, medium: 0, low: 0 }
        };

        this.images.forEach(image => {
            // Categorias
            stats.categories[image.category] = (stats.categories[image.category] || 0) + 1;

            // Anos
            stats.years[image.year] = (stats.years[image.year] || 0) + 1;

            // Localizações
            stats.locations[image.location] = (stats.locations[image.location] || 0) + 1;

            // Severidade
            stats.severity[image.severity]++;
        });

        return stats;
    }
}

// Inicializar GalleryManager
window.addEventListener('DOMContentLoaded', () => {
    window.galleryManager = new GalleryManager();
});
