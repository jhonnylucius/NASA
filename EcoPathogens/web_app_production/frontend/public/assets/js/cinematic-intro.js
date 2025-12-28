/**
 * 🎬 CINEMATIC INTRO - EcoGuardians
 * Abertura cinematográfica com 128 imagens + planetas queimando
 * NASA Space Apps Challenge 2025
 */

class CinematicIntro {
    constructor() {
        this.images = this.generateImageList();
        this.currentImageIndex = 0;
        this.imageContainers = [];
        this.isIntroComplete = false;
        this.introContainer = null;

        this.init();
    }

    /**
     * Gera a lista completa de 128 imagens usando as imagens reais do projeto
     */
    generateImageList() {
        // Lista completa das suas imagens reais (128+ imagens)
        const realImages = [
            // Derretimento e Calotas Polares (16 imagens)
            '5DERRETIMENTOCALOTASPOLARES14.jpg',
            'DERRETENDO.jpg',
            'DERRETIMENTOCALOTASPOLARES.jpg',
            'DERRETIMENTOCALOTASPOLARES1.jpg',
            'DERRETIMENTOCALOTASPOLARES2.jpg',
            'DERRETIMENTOCALOTASPOLARES3.jpg',
            'DERRETIMENTOCALOTASPOLARES4.jpg',
            'DERRETIMENTOCALOTASPOLARES5.jpg',
            'DERRETIMENTOCALOTASPOLARES6.jpg',
            'DERRETIMENTOCALOTASPOLARES7.jpg',
            'DERRETIMENTOCALOTASPOLARES8.jpg',
            'DERRETIMENTOCALOTASPOLARES9.jpg',
            'DERRETIMENTOCALOTASPOLARES10.jpg',
            'DERRETIMENTOCALOTASPOLARES11.jpg',
            'DERRETIMENTOCALOTASPOLARES12.jpg',
            'DERRETIMENTOCALOTASPOLARES13.jpg',
            'DERRETIMENTOCALOTASPOLARES14.jpg',
            'DERRETIMENTOCALOTASPOLARES15.jpg',

            // Desmatamento (12 imagens)
            'DESMATAMENTOAWS.jpg',
            'DESMATAMENTOAWS1.jpg',
            'DESMATAMENTOAWS2.jpg',
            'DESMATAMENTOAWS3.jpg',
            'DESMATAMENTOAWS4.jpg',
            'DESMATAMENTOAWS5.jpg',
            'DESMATAMENTOAWS6.jpg',
            'DESMATAMENTOAWS7.jpg',
            'DESMATAMENTOAWS8.jpg',
            'DESMATAMENTOAWS9.jpg',
            'DESMATAMENTOAWS10.jpg',
            'DESMATAMENTOAWS11.jpg',

            // Queimadas (10 imagens)
            'EMCHAMAS.jpg',
            'QUEIMADAS.jpg',
            'QUEIMADAS1.jpg',
            'QUEIMADAS2.jpg',
            'QUEIMADAS3.jpg',
            'QUEIMADAS4.jpg',
            'QUEIMADAS5.jpg',
            'QUEIMADAS6.jpg',
            'QUEIMADAS7.jpg',
            'QUEIMADAS8.jpg',
            'QUEIMADAS9.jpg',

            // Enchentes (10 imagens)
            'ENCHENTES.jpg',
            'ENCHENTES1.jpg',
            'ENCHENTES2.jpg',
            'ENCHENTES3.jpg',
            'ENCHENTES4.jpg',
            'ENCHENTES5.jpg',
            'ENCHENTES6.jpg',
            'ENCHENTES7.jpg',
            'ENCHENTES8.jpg',
            'ENCHENTES9.jpg',

            // Epidemias e Vírus (16 imagens)
            'EPIDEMIAS.jpg',
            'EPIDEMIAS1.jpg',
            'EPIDEMIAS2.jpg',
            'EPIDEMIAS3.jpg',
            'EPIDEMIAS4.jpg',
            'EPIDEMIAS5.jpg',
            'EPIDEMIAS6.jpg',
            'EPIDEMIAS7.jpg',
            'EPIDEMIAS8.jpg',
            'EPIDEMIASAGRICOLA.jpg',
            'VIRUS.jpg',
            'VIRUS1.jpg',
            'VIRUS2.jpg',
            'VIRUS3.jpg',
            'VIRUS4.jpg',
            'VIRUS5.jpg',

            // Tornados e Furacões (11 imagens)
            'FURACAO-TORNADO.jpg',
            'FURACAO.jpg',
            'FURACAO1.jpg',
            'TORNADO.jpg',
            'TORNADO1.jpg',
            'TORNADO2.jpg',
            'TORNADO3.jpg',
            'TORNADO4.jpg',
            'TORNADO5.jpg',
            'TORNADO6.jpg',
            'TORNADO7.jpg',

            // Vulcões (5 imagens)
            'VULCAO.jpg',
            'VULCAO1.jpg',
            'VULCAO2.jpg',
            'VULCAO3.jpg',
            'VULCAO4.jpg',

            // Clima e Secas (12 imagens)
            'CLIMA.jpg',
            'CLIMA2.jpg',
            'CLIMA2SECA.jpg',
            'CLIMA3.jpg',
            'CLIMA4.jpg',
            'CLIMA5.jpg',
            'CLIMA6.jpg',
            'CLIMA8.jpg',
            'SECA.jpg',
            'SECA1.jpg',
            'SECA2.jpg',
            'SECA3.jpg',

            // Indígenas (10 imagens)
            'INDIGINAS.jpg',
            'INDIGINAS1.jpg',
            'INDIGINAS2.jpg',
            'INDIGINAS3.jpg',
            'INDIGINAS4.jpg',
            'INDIGINAS5.jpg',
            'INDIGINAS6.jpg',
            'INDIGINAS7.jpg',
            'INDIGINAS8.jpg',
            'INDIGINAS9.jpg',

            // Garimpo Ilegal (6 imagens)
            'GARIMPOILEGAL.jpg',
            'GARIMPOILEGAL1.jpg',
            'GARIMPOILEGAL2.jpg',
            'GARIMPOILEGAL3.jpg',
            'GARIMPOILEGAL4.jpg',
            'GARIMPOILEGAL5.jpg',

            // Sofrimento e Impacto Humano (6 imagens)
            'DOENTE.jpg',
            'SOFRIMENTO.jpg',
            'SOFRIMENTO1.jpg',
            'SOFRIMENTO2.jpg',
            'SOFRIMENTO3.jpg',
            'SOFRIMENTO4.jpg',
            'SOFRIMENTO5.jpg',

            // Terremotos (3 imagens)
            'TERREMOTO.jpg',
            'TERREMOTO1.jpg',
            'TERREMOTO2.jpg',

            // Agricultura e Lavoura (2 imagens)
            'LAVOURAPERDIDA.jpg',
            'LAVOURAPERDIDA1.jpg',

            // Satélites e Tecnologia (6 imagens)
            'SATELITE.jpg',
            'SATELITE1.jpg',
            'SATELITE-EM-MALHA.jpg',
            'SATELITE-EM-MALHA1.jpg',
            'SATELITE-EM-MALHA2.jpg',
            'SATELITE-EM-MALHA3.jpg',

            // Explosões Solares (3 imagens)
            'EXPLOSÕES-SOLARES/SOL.jpg',
            'EXPLOSÕES-SOLARES/SOL1.jpg',
            'EXPLOSÕES-SOLARES/SOL2.jpg',

            // Análise de Dados (4 imagens)
            'ANALISE DE DADOS.jpg',
            'ANALISE DE DADOS1.jpg',
            'ANALISE DE DADOS2.jpg',
            'ANALISE DE DADOS3.jpg',

            // Brasil e Floresta (1 imagem)
            'BRASILFLORESTA.jpg',

            // Políticos e Culpados (2 imagens)
            'POLITICOS.jpg',
            'CULPADOS.jpg',

            // Terra e Sobrevivência (2 imagens)
            'A TERRA VAI SOBRIVIVER.jpg',
            'A TERRA VAI SOBRIVIVER1.jpg'
        ];

        const images = [];

        // Pega as primeiras 125 imagens para desastres
        const disasterImages = realImages.slice(0, 125);

        // Adiciona as 125 imagens de desastres
        disasterImages.forEach((imageName, index) => {
            images.push({
                src: `assets/images/${imageName}`,
                type: 'disaster',
                name: imageName.replace('.jpg', ''),
                category: this.getCategoryFromName(imageName),
                fallback: `https://picsum.photos/300/200?random=${index + 1}`
            });
        });

        // Adiciona as 3 imagens especiais em triângulo (para queimar)
        const triangleImages = [
            {
                src: `assets/images/EMCHAMAS.jpg`,
                type: 'triangle',
                name: 'EMCHAMAS',
                position: 'top', // Centro-topo do triângulo
                fallback: 'https://images.unsplash.com/photo-1574482620007-57f80dc0de84?w=500&h=400&fit=crop&q=80'
            },
            {
                src: `assets/images/DERRETENDO.jpg`,
                type: 'triangle',
                name: 'DERRETENDO',
                position: 'bottom-left', // Esquerda-baixo do triângulo
                fallback: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop&q=80'
            },
            {
                src: `assets/images/DOENTE.jpg`,
                type: 'triangle',
                name: 'DOENTE',
                position: 'bottom-right', // Direita-baixo do triângulo
                fallback: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&h=400&fit=crop&q=80'
            }
        ];

        // Adiciona as 3 imagens do triângulo
        triangleImages.forEach(triangleImg => {
            images.push(triangleImg);
        });

        return images;
    }

    /**
     * Determina a categoria baseada no nome da imagem
     */
    getCategoryFromName(imageName) {
        const name = imageName.toUpperCase();

        if (name.includes('DERRETIMENTO') || name.includes('CALOTA')) return 'climate-change';
        if (name.includes('DESMATAMENTO')) return 'deforestation';
        if (name.includes('QUEIMADA') || name.includes('CHAMAS')) return 'fires';
        if (name.includes('ENCHENTE')) return 'floods';
        if (name.includes('EPIDEMIA') || name.includes('VIRUS')) return 'epidemics';
        if (name.includes('TORNADO') || name.includes('FURACAO')) return 'storms';
        if (name.includes('VULCAO')) return 'volcanoes';
        if (name.includes('CLIMA') || name.includes('SECA')) return 'climate';
        if (name.includes('INDIGENA')) return 'indigenous';
        if (name.includes('GARIMPO')) return 'mining';
        if (name.includes('SOFRIMENTO') || name.includes('DOENTE')) return 'human-impact';
        if (name.includes('TERREMOTO')) return 'earthquakes';
        if (name.includes('SATELITE')) return 'technology';
        if (name.includes('SOL')) return 'solar';
        if (name.includes('ANALISE')) return 'data';

        return 'environmental';
    }

    /**
     * Inicializa a introdução cinematográfica
     */
    init() {
        this.createIntroStructure();
        this.registerGSAP();
        this.startCinematicIntro();
    }

    /**
     * Cria a estrutura HTML para a introdução
     */
    createIntroStructure() {
        // Remove loading screen existente se houver
        const existingLoading = document.getElementById('loading-screen');
        if (existingLoading) {
            existingLoading.style.display = 'none';
        }

        // Esconde a aplicação principal durante a intro
        const smoothWrapper = document.getElementById('smooth-wrapper');
        if (smoothWrapper) {
            smoothWrapper.style.opacity = '0';
            smoothWrapper.style.pointerEvents = 'none';
        }

        // Cria container principal da introdução
        this.introContainer = document.createElement('div');
        this.introContainer.id = 'cinematic-intro';
        this.introContainer.innerHTML = `
            <div class="intro-overlay">
                <div class="intro-content">
                    <div class="intro-title">
                        <div class="title-row">
                            <div class="intro-logo">
                                <svg width="60" height="60" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="55" stroke="#39FF14" stroke-width="3" fill="none"/>
                                    <ellipse cx="60" cy="60" rx="40" ry="25" fill="#000" stroke="#39FF14" stroke-width="2"/>
                                    <circle cx="60" cy="60" r="12" fill="#39FF14"/>
                                    <path d="M60 35 Q75 50 60 65 Q45 50 60 35" fill="#39FF14"/>
                                </svg>
                            </div>
                            <h1>ECOGUARDIANS</h1>
                        </div>
                        <p>50 Anos de História Ambiental da Amazônia</p>
                        <span class="nasa-badge">UNION DESENVOLVIMENTO DE SOFTWARES</span>
                    </div>
                    <div class="intro-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <span class="progress-text">Carregando impactos ambientais...</span>
                        <div class="image-counter">
                            <span class="current-count">0</span> / <span class="total-count">128</span> imagens
                        </div>
                    </div>
                </div>
                <div class="images-container"></div>
                <div class="skip-intro">
                    <button onclick="window.cinematicIntro && window.cinematicIntro.skipIntro()">
                        ⏭️ Pular Introdução
                    </button>
                </div>
            </div>
        `;

        // Adiciona estilos CSS
        this.addIntroStyles();

        // Insere no DOM
        document.body.insertBefore(this.introContainer, document.body.firstChild);

        // Salva referência global para controles
        window.cinematicIntro = this;
    }

    /**
     * Adiciona estilos CSS para a introdução
     */
    addIntroStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #cinematic-intro {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: radial-gradient(circle at center, #0a0a0a, #000000);
                z-index: 10000;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .intro-overlay {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .intro-content {
                position: relative;
                z-index: 10001;
                text-align: center;
                color: white;
                pointer-events: none;
            }

            .title-row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
            }

            .intro-logo svg {
                filter: drop-shadow(0 0 10px #39FF14) drop-shadow(0 0 20px #39FF14);
            }

            .intro-title h1 {
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 4.5rem;
                font-weight: 900;
                margin: 0;
                color: #000000;
                -webkit-text-stroke: 2px #39FF14;
                text-shadow: 
                    /* Efeito 3D - sombras deslocadas */
                    1px 1px 0 #2E8B57,
                    2px 2px 0 #2E8B57,
                    3px 3px 0 #228B22,
                    4px 4px 0 #1a6b1a,
                    /* Brilho neon */
                    0 0 10px #39FF14,
                    0 0 20px #39FF14,
                    0 0 40px #39FF14,
                    0 0 80px #39FF14;
                letter-spacing: 3px;
                text-transform: uppercase;
                white-space: nowrap;
            }

            .intro-title p {
                font-size: 1.5rem;
                margin: 1rem 0;
                opacity: 0.8;
            }

            .nasa-badge {
                display: inline-block;
                background: linear-gradient(45deg, #FF6B35, #F7931E);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                margin-top: 1rem;
                box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
            }

            .intro-progress {
                width: 400px;
                max-width: 90vw;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 1rem;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #2E8B57, #228B22, #32CD32, #FFD700);
                background-size: 200% 100%;
                width: 0%;
                transition: width 0.3s ease;
                animation: progressShimmer 2s ease-in-out infinite;
            }

            @keyframes progressShimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }

            .progress-text {
                font-size: 1rem;
                opacity: 0.9;
                margin-bottom: 0.5rem;
                display: block;
            }

            .image-counter {
                font-size: 0.9rem;
                opacity: 0.7;
                font-family: 'Courier New', monospace;
            }

            .current-count {
                color: #32CD32;
                font-weight: bold;
                font-size: 1.1em;
            }

            .total-count {
                color: #FFD700;
                font-weight: bold;
            }

            .images-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }

            .intro-image {
                position: absolute;
                width: 150px;
                height: 100px;
                border-radius: 8px;
                overflow: hidden;
                opacity: 0;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                border: 2px solid rgba(255, 255, 255, 0.1);
            }

            .intro-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .planets-container {
                position: absolute;
                bottom: 20%;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 3rem;
                z-index: 10002;
            }

            .planet-wrapper {
                position: relative;
                width: 200px;
                height: 200px;
                border-radius: 50%;
                overflow: hidden;
                opacity: 0;
                box-shadow: 0 8px 25px rgba(0,0,0,0.4);
                border: 3px solid rgba(255,255,255,0.2);
            }

            .planet-wrapper img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .planet-label {
                position: absolute;
                bottom: -35px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 600;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .planet-wrapper:hover .planet-label {
                opacity: 1;
            }

            .burn-effect {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0%;
                background: linear-gradient(
                    to top,
                    #ff4444 0%,
                    #ff6600 25%,
                    #ffaa00 50%,
                    #ffff00 75%,
                    transparent 100%
                );
                border-radius: 50%;
                opacity: 0;
                box-shadow: 0 0 20px rgba(255,68,68,0.6);
            }

            .skip-intro {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 10003;
                opacity: 0;
                animation: fadeInSkip 3s ease-in-out 5s forwards;
            }

            .skip-intro button {
                background: rgba(0,0,0,0.7);
                color: white;
                border: 2px solid rgba(255,255,255,0.3);
                padding: 12px 20px;
                border-radius: 25px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .skip-intro button:hover {
                background: rgba(255,107,53,0.8);
                border-color: #FF6B35;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255,107,53,0.4);
            }

            @keyframes fadeInSkip {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Estilos para as imagens do triângulo */
            .triangle-image {
                position: fixed;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.7);
                border: 4px solid rgba(255,255,255,0.3);
                transition: all 0.3s ease;
            }

            .triangle-image:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 25px 80px rgba(255,107,53,0.5);
                border-color: #FF6B35;
            }

            .triangle-burn-effect {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0%;
                background: linear-gradient(
                    to top,
                    #ff0000 0%,
                    #ff4400 15%,
                    #ff6600 30%,
                    #ff8800 45%,
                    #ffaa00 60%,
                    #ffcc00 75%,
                    #ffff00 90%,
                    transparent 100%
                );
                opacity: 0;
                box-shadow: 
                    inset 0 0 30px rgba(255,0,0,0.8),
                    0 0 50px rgba(255,68,68,0.6);
                animation: flameFlicker 0.5s ease-in-out infinite alternate;
            }

            @keyframes flameFlicker {
                0% { 
                    filter: brightness(1) saturate(1);
                    transform: scaleY(1);
                }
                100% { 
                    filter: brightness(1.2) saturate(1.3);
                    transform: scaleY(1.02);
                }
            }

            .triangle-label {
                position: absolute;
                bottom: -45px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(45deg, rgba(0,0,0,0.9), rgba(255,107,53,0.8));
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 700;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.3s ease;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                border: 2px solid rgba(255,255,255,0.2);
            }

            .triangle-image:hover .triangle-label {
                opacity: 1;
            }

            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            @media (max-width: 768px) {
                .intro-title h1 {
                    font-size: 2.5rem;
                }
                
                .intro-image {
                    width: 100px;
                    height: 70px;
                }
                
                .planet-wrapper {
                    width: 120px;
                    height: 120px;
                }
                
                .planets-container {
                    gap: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Registra plugins GSAP necessários
     */
    registerGSAP() {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger, Physics2DPlugin, CustomEase, DrawSVGPlugin);
        }
    }

    /**
     * Inicia a introdução cinematográfica
     */
    async startCinematicIntro() {
        console.log('🎬 Iniciando abertura cinematográfica...');

        // Animação inicial do título
        this.animateIntroTitle();

        // Aguarda 2 segundos antes de começar as imagens
        await this.delay(100);

        // Mostra as 125 imagens de desastres (agora ficam na tela)
        await this.showDisasterImages();

        // Aguarda 1 segundo
        await this.delay(100);

        // Mostra as 3 imagens em triângulo ao redor do título e queima
        // REMOVIDO: Imagens de triângulo/planetas
        // await this.showTriangleImages();

        // Transição final
        await this.finishIntro();
    }

    /**
     * Anima o título inicial
     */
    animateIntroTitle() {
        const tl = gsap.timeline();

        tl.from('.intro-title h1', {
            duration: 2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        })
            .from('.intro-title p', {
                duration: 1.5,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            }, '-=1')
            .from('.intro-progress', {
                duration: 1,
                y: 20,
                opacity: 0,
                ease: 'power2.out'
            }, '-=0.5');
    }

    /**
     * Mostra as 125 imagens de desastres rapidamente
     */
    async showDisasterImages() {
        const container = this.introContainer.querySelector('.images-container');
        const progressFill = this.introContainer.querySelector('.progress-fill');
        const progressText = this.introContainer.querySelector('.progress-text');
        const currentCount = this.introContainer.querySelector('.current-count');
        const totalCount = this.introContainer.querySelector('.total-count');

        // Filtra apenas as imagens de desastres (não triângulo)
        const disasterImages = this.images.filter(img => img.type === 'disaster');

        // Atualiza contador total
        totalCount.textContent = disasterImages.length;

        for (let i = 0; i < disasterImages.length; i++) {
            const image = disasterImages[i];

            // Cria elemento da imagem
            const imageEl = this.createImageElement(image, i);
            container.appendChild(imageEl);

            // Anima entrada da imagem
            this.animateImageEntrance(imageEl);

            // Atualiza progresso e contador
            const progress = ((i + 1) / disasterImages.length) * 100;
            progressFill.style.width = `${progress}%`;
            currentCount.textContent = i + 1;

            // Mostra informação mais específica baseada na categoria
            const category = image.category;
            const categoryNames = {
                'climate-change': 'mudanças climáticas',
                'deforestation': 'desmatamento',
                'fires': 'queimadas',
                'floods': 'enchentes',
                'epidemics': 'epidemias',
                'storms': 'tempestades',
                'volcanoes': 'vulcões',
                'climate': 'eventos climáticos',
                'indigenous': 'impacto indígena',
                'mining': 'garimpo ilegal',
                'human-impact': 'sofrimento humano',
                'earthquakes': 'terremotos',
                'technology': 'monitoramento',
                'solar': 'explosões solares',
                'data': 'análise de dados',
                'environmental': 'impacto ambiental'
            };

            const categoryName = categoryNames[category] || 'eventos ambientais';
            progressText.textContent = `Processando ${categoryName}...`;

            // Aguarda antes da próxima imagem (0.1 segundos - super rápido)
            await this.delay(100);

            // MUDANÇA: Não remove mais as imagens - elas ficam se sobrepondo
            // Apenas adiciona um pouco de transparência às mais antigas
            if (i > 20) {
                const oldImage = container.children[i - 20];
                if (oldImage) {
                    gsap.to(oldImage, {
                        duration: 0.5,
                        opacity: 0.7,
                        scale: 0.9,
                        zIndex: 1 // Manda para trás
                    });
                }
            }
        }

        progressText.textContent = 'Preparando análise final...';
        currentCount.textContent = disasterImages.length;
    }

    /**
     * Mostra as 3 imagens em triângulo ao redor do título
     */
    async showTriangleImages() {
        const triangleImages = this.images.filter(img => img.type === 'triangle');
        const progressText = this.introContainer.querySelector('.progress-text');

        progressText.textContent = 'Analisando situação crítica...';

        await this.delay(1000);

        // Remove todas as imagens de fundo com fade out
        gsap.to('.intro-image', {
            duration: 1.5,
            opacity: 0.3,
            scale: 0.8,
            filter: 'blur(2px)',
            ease: 'power2.inOut'
        });

        // Esconde a barra de progresso
        gsap.to('.intro-progress', {
            duration: 1,
            opacity: 0,
            y: 50,
            ease: 'power2.in'
        });

        await this.delay(500);

        // Cria e mostra as 3 imagens do triângulo
        for (let i = 0; i < triangleImages.length; i++) {
            const image = triangleImages[i];
            const triangleEl = this.createTriangleElement(image, i);
            this.introContainer.appendChild(triangleEl);

            // Anima entrada com delay escalonado
            await this.delay(100);
            this.animateTriangleEntrance(triangleEl, image.position);
        }

        await this.delay(2000);

        // Inicia efeito de queimadura em todas simultaneamente
        this.startTriangleBurnEffect();
    }

    /**
     * Cria elemento da imagem do triângulo
     */
    createTriangleElement(image, index) {
        const triangleEl = document.createElement('div');
        triangleEl.className = 'triangle-image';
        triangleEl.setAttribute('data-position', image.position);

        // Define posições do triângulo ao redor do título
        const positions = {
            'top': {
                top: '25%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                size: '320px' // EMCHAMAS maior no topo
            },
            'bottom-left': {
                top: '65%',
                left: '25%',
                transform: 'translate(-50%, -50%)',
                size: '280px' // DERRETENDO à esquerda
            },
            'bottom-right': {
                top: '65%',
                right: '25%',
                transform: 'translate(50%, -50%)',
                size: '280px' // DOENTE à direita
            }
        };

        const pos = positions[image.position];

        triangleEl.innerHTML = `
            <img src="${image.src}" alt="${image.name}" 
                 onerror="this.src='${image.fallback}'"
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;">
            <div class="triangle-burn-effect"></div>
            <div class="triangle-label">${this.getTriangleLabel(image.name)}</div>
        `;

        // Aplica estilos de posição
        Object.assign(triangleEl.style, {
            position: 'fixed',
            width: pos.size,
            height: pos.size,
            zIndex: '10002',
            opacity: '0',
            borderRadius: '15px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            border: '4px solid rgba(255,255,255,0.3)',
            overflow: 'hidden',
            ...pos
        });

        return triangleEl;
    }

    /**
     * Retorna label amigável para as imagens
     */
    getTriangleLabel(name) {
        const labels = {
            'EMCHAMAS': '🔥 Em Chamas',
            'DERRETENDO': '🧊 Derretendo',
            'DOENTE': '😷 Doente'
        };
        return labels[name] || name;
    }

    /**
     * Anima entrada da imagem do triângulo
     */
    animateTriangleEntrance(element, position) {
        // Animação de entrada baseada na posição
        const entranceConfig = {
            'top': { y: -200, rotation: -15 },
            'bottom-left': { x: -200, y: 100, rotation: 15 },
            'bottom-right': { x: 200, y: 100, rotation: -15 }
        };

        const config = entranceConfig[position];

        gsap.fromTo(element,
            {
                opacity: 0,
                scale: 0.3,
                x: config.x || 0,
                y: config.y || 0,
                rotation: config.rotation
            },
            {
                duration: 1.5,
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                rotation: 0,
                ease: 'elastic.out(1, 0.8)',
                onComplete: () => {
                    // Adiciona efeito de pulsação sutil
                    gsap.to(element, {
                        duration: 2,
                        scale: 1.03,
                        yoyo: true,
                        repeat: -1,
                        ease: 'sine.inOut'
                    });
                }
            }
        );
    }

    /**
     * Inicia efeito de queimadura nas imagens do triângulo
     */
    startTriangleBurnEffect() {
        const triangleImages = document.querySelectorAll('.triangle-image');

        triangleImages.forEach((triangleEl, index) => {
            const burnEffect = triangleEl.querySelector('.triangle-burn-effect');

            // Delay escalonado para cada imagem
            setTimeout(() => {
                // Anima o efeito de queimadura de baixo para cima
                gsap.fromTo(burnEffect,
                    {
                        height: '0%',
                        opacity: 0.8
                    },
                    {
                        duration: 3,
                        height: '100%',
                        opacity: 1,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            // Adiciona efeito de chamas
                            gsap.to(burnEffect, {
                                duration: 1,
                                opacity: 0.9,
                                scale: 1.1,
                                yoyo: true,
                                repeat: 3,
                                ease: 'sine.inOut'
                            });
                        }
                    }
                );
            }, index * 500);
        });
    }

    /**
     * Cria elemento HTML de uma imagem
     */
    createImageElement(image, index) {
        const imageEl = document.createElement('div');
        imageEl.className = 'intro-image';

        // Posição aleatória na tela (evitando sobreposição)
        const position = this.getRandomPosition(index);
        imageEl.style.left = position.x + 'px';
        imageEl.style.top = position.y + 'px';

        // Cria tag img com fallback
        const imgTag = document.createElement('img');
        imgTag.alt = image.name;
        imgTag.loading = 'lazy';

        // Tenta carregar imagem principal, usa fallback se falhar
        imgTag.src = image.src;
        imgTag.onerror = () => {
            if (image.fallback) {
                imgTag.src = image.fallback;
            }
        };

        imageEl.appendChild(imgTag);

        this.imageContainers.push(imageEl);
        return imageEl;
    }

    /**
     * Gera posição aleatória evitando sobreposição
     */
    getRandomPosition(index) {
        const padding = 50;
        const imageWidth = 150;
        const imageHeight = 100;

        const maxX = window.innerWidth - imageWidth - padding;
        const maxY = window.innerHeight - imageHeight - padding;

        let attempts = 0;
        let position;

        do {
            position = {
                x: Math.random() * maxX + padding,
                y: Math.random() * maxY + padding
            };
            attempts++;
        } while (this.isPositionOccupied(position, imageWidth, imageHeight) && attempts < 10);

        return position;
    }

    /**
     * Verifica se posição está ocupada
     */
    isPositionOccupied(newPos, width, height) {
        const recentImages = this.imageContainers.slice(-6); // Últimas 6 imagens

        return recentImages.some(img => {
            if (!img || img.style.opacity === '0') return false;

            const imgRect = {
                x: parseInt(img.style.left),
                y: parseInt(img.style.top),
                width: width,
                height: height
            };

            return this.isOverlapping(newPos, { width, height }, imgRect);
        });
    }

    /**
     * Verifica sobreposição entre retângulos
     */
    isOverlapping(pos1, size1, rect2) {
        return !(pos1.x + size1.width < rect2.x ||
            rect2.x + rect2.width < pos1.x ||
            pos1.y + size1.height < rect2.y ||
            rect2.y + rect2.height < pos1.y);
    }

    /**
     * Anima entrada de uma imagem
     */
    animateImageEntrance(imageEl) {
        gsap.fromTo(imageEl,
            {
                opacity: 0,
                scale: 0.5,
                rotation: Math.random() * 360
            },
            {
                duration: 0.8,
                opacity: 1,
                scale: 1,
                rotation: 0,
                ease: 'power2.out'
            }
        );
    }

    /**
     * Remove imagem com fade out
     */
    fadeOutImage(imageEl) {
        if (imageEl) {
            gsap.to(imageEl, {
                duration: 0.5,
                opacity: 0,
                scale: 0.8,
                ease: 'power2.in',
                onComplete: () => {
                    if (imageEl.parentNode) {
                        imageEl.parentNode.removeChild(imageEl);
                    }
                }
            });
        }
    }

    /**
     * Mostra e queima os planetas
     */
    async burnPlanets() {
        const progressText = this.introContainer.querySelector('.progress-text');
        progressText.textContent = 'Analisando planetas...';

        const planets = this.introContainer.querySelectorAll('.planet-wrapper');

        // Mostra planetas primeiro
        gsap.to(planets, {
            duration: 1.5,
            opacity: 1,
            y: -50,
            stagger: 0.3,
            ease: 'power3.out'
        });

        await this.delay(100);

        // Queima planetas sequencialmente
        for (let i = 0; i < planets.length; i++) {
            const planet = planets[i];
            const burnEffect = planet.querySelector('.burn-effect');

            progressText.textContent = `Queimando planeta ${i + 1}/3...`;

            // Efeito de queimadura de baixo para cima
            gsap.timeline()
                .to(burnEffect, {
                    duration: 2,
                    height: '100%',
                    opacity: 0.9,
                    ease: 'power2.out'
                })
                .to(planet, {
                    duration: 1,
                    scale: 1.1,
                    filter: 'brightness(1.5) contrast(1.2)',
                    ease: 'power2.out'
                }, '-=1.5')
                .to(planet, {
                    duration: 0.5,
                    scale: 0.8,
                    opacity: 0.3,
                    filter: 'brightness(0.5) grayscale(100%)',
                    ease: 'power2.in'
                });

            await this.delay(2500);
        }

        progressText.textContent = 'Iniciando EcoGuardians...';
    }

    /**
     * Finaliza a introdução e inicia a aplicação
     */
    async finishIntro() {
        await this.delay(100);

        // Remove todas as imagens restantes do fundo
        gsap.to('.intro-image', {
            duration: 1,
            opacity: 0,
            scale: 0.5,
            stagger: 0.05,
            ease: 'power2.in'
        });

        // Fade out do título e progresso
        gsap.to('.intro-content', {
            duration: 1.5,
            opacity: 0,
            y: -100,
            ease: 'power2.in'
        });

        // Fade out das imagens do triângulo
        gsap.to('.triangle-image', {
            duration: 1.5,
            opacity: 0,
            scale: 0.8,
            y: 100,
            stagger: 0.2,
            ease: 'power2.in'
        });

        // Fade out final da introdução completa
        gsap.to(this.introContainer, {
            duration: 2,
            opacity: 0,
            ease: 'power2.inOut',
            onComplete: () => {
                this.completeIntro();
            }
        });
    }

    /**
     * Pula a introdução (botão ou controle)
     */
    skipIntro() {
        console.log('⏭️ Pulando introdução cinematográfica...');

        // Para todas as animações em andamento
        gsap.killTweensOf('*');

        // Fade out rápido
        gsap.to(this.introContainer, {
            duration: 1,
            opacity: 0,
            scale: 0.9,
            ease: 'power2.inOut',
            onComplete: () => {
                this.completeIntro();
            }
        });
    }

    /**
     * Completa a introdução e inicia a aplicação
     */
    completeIntro() {
        // Remove container da introdução
        if (this.introContainer && this.introContainer.parentNode) {
            this.introContainer.parentNode.removeChild(this.introContainer);
        }

        // Remove loading screen se ainda existir
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }

        // Mostra e anima a aplicação principal
        const smoothWrapper = document.getElementById('smooth-wrapper');
        if (smoothWrapper) {
            smoothWrapper.style.pointerEvents = 'auto';
            smoothWrapper.style.opacity = '1';

            // CORREÇÃO: Define estados iniciais e anima para estados finais visíveis
            // Usando gsap.set() para definir estado inicial e gsap.to() para animar para visível

            // Define estados iniciais
            gsap.set('.hero-title .title-line', { y: 50, opacity: 0 });
            gsap.set('.hero-description', { y: 30, opacity: 0 });
            gsap.set('.hero-stats .stat-card', { y: 30, opacity: 0 });
            gsap.set('.hero-text', { opacity: 1, x: 0 });
            gsap.set('.hero-visual', { opacity: 1, x: 0 });
            gsap.set('.metric-card', { opacity: 1, y: 0 });

            // Animação de entrada da aplicação principal
            gsap.timeline()
                .to(smoothWrapper, {
                    duration: 1,
                    opacity: 1,
                    ease: 'power2.out'
                })
                .to('.hero-title .title-line', {
                    duration: 1.5,
                    y: 0,
                    opacity: 1,
                    stagger: 0.2,
                    ease: 'power3.out',
                    clearProps: 'all'
                }, '-=0.5')
                .to('.hero-description', {
                    duration: 1,
                    y: 0,
                    opacity: 1,
                    ease: 'power2.out',
                    clearProps: 'all'
                }, '-=1')
                .to('.hero-stats .stat-card', {
                    duration: 1,
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    ease: 'power2.out',
                    clearProps: 'all'
                }, '-=0.5');
        }

        // Permite scroll novamente
        document.body.style.overflow = 'auto';

        // Inicia outras animações se existirem
        if (typeof window.initMainAnimations === 'function') {
            window.initMainAnimations();
        }

        // CORREÇÃO: Força atualização do mapa e gráficos
        setTimeout(() => {
            console.log('🔄 Intro finalizada - Forçando atualização da UI');

            // Força resize para corrigir Leaflet e Plotly
            window.dispatchEvent(new Event('resize'));

            // Garante que o MapsManager atualize
            if (window.mapsManager) {
                if (window.mapsManager.map) {
                    window.mapsManager.map.invalidateSize();
                }
                // Tenta carregar dados novamente se estiver vazio
                window.mapsManager.loadRealAmazonData();
            }
        }, 100);

        // Limpa referência global
        window.cinematicIntro = null;

        // ✅ DISPARA EVENTO PARA INICIALIZAR O MAPA
        console.log('📡 Disparando evento "cinematicIntroComplete"');
        document.dispatchEvent(new Event('cinematicIntroComplete'));

        console.log('✅ Introdução cinematográfica concluída! Aplicação principal carregada.');
    }

    /**
     * Utility: Delay promisificado
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Auto-inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguarda GSAP carregar
    if (typeof gsap !== 'undefined') {
        new CinematicIntro();
    } else {
        // Aguarda GSAP carregar
        const checkGSAP = setInterval(() => {
            if (typeof gsap !== 'undefined') {
                clearInterval(checkGSAP);
                new CinematicIntro();
            }
        }, 100);
    }
});

// Exporta para uso externo
window.CinematicIntro = CinematicIntro;
