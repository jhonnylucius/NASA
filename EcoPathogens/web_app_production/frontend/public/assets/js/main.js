// 🚀 EcoGuardians - Aplicação Principal
// Sistema de navegação e controle da aplicação

class EcoGuardiansApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigationButtons();
        this.setupSmoothScroll();
        this.setupNavbar();
        this.initializeData();
        console.log('🚀 EcoGuardians App inicializado');
    }

    setupNavigationButtons() {
        // Botões de navegação da hero section
        const dashboardBtn = document.querySelector('[data-scroll-to="dashboard"]');
        const timelineBtn = document.querySelector('[data-scroll-to="timeline"]');

        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection('dashboard');
                console.log('📊 Navegando para Dashboard');
            });
        }

        if (timelineBtn) {
            timelineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection('timeline');
                console.log('📈 Navegando para Timeline');
            });
        }

        // Todos os botões com data-scroll-to
        document.querySelectorAll('[data-scroll-to]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.getAttribute('data-scroll-to');
                this.scrollToSection(target);
            });
        });

        // Links de navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const target = href.substring(1);
                    this.scrollToSection(target);
                }
            });
        });

        // Botões do mapa
        document.querySelectorAll('.map-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.textContent.toLowerCase();
                this.updateMapFilter(filter);
                
                // Atualizar estado ativo
                document.querySelectorAll('.map-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Timeline controls
        document.querySelectorAll('.timeline-control').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.textContent.toLowerCase();
                this.controlTimeline(action);
            });
        });
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            // Usar GSAP ScrollToPlugin se disponível
            if (window.gsap && gsap.plugins.ScrollToPlugin) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: element,
                        offsetY: 70 // Offset para navbar
                    },
                    ease: "power2.inOut"
                });
            } else {
                // Fallback para scroll nativo
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else {
            console.warn(`Seção "${sectionId}" não encontrada`);
        }
    }

    updateMapFilter(filter) {
        console.log(`🗺️ Filtro do mapa alterado para: ${filter}`);
        
        // Simular mudança de dados do mapa
        const mapContainer = document.querySelector('#interactive-map');
        if (mapContainer) {
            mapContainer.style.background = this.getMapColor(filter);
        }
    }

    getMapColor(filter) {
        const colors = {
            'desmatamento': 'linear-gradient(45deg, #ff4444, #cc2222)',
            'queimadas': 'linear-gradient(45deg, #ff8800, #ee6600)', 
            'temperatura': 'linear-gradient(45deg, #ff6b35, #e55a30)',
            'terras indígenas': 'linear-gradient(45deg, #2e8b57, #228b22)'
        };
        return colors[filter] || colors['desmatamento'];
    }

    controlTimeline(action) {
        console.log(`⏯️ Timeline: ${action}`);
        
        const slider = document.querySelector('.timeline-slider');
        const yearDisplay = document.querySelector('.timeline-year');
        
        if (!slider || !yearDisplay) return;

        switch(action) {
            case 'play':
                this.playTimeline();
                break;
            case 'pause':
                this.pauseTimeline();
                break;
            case 'reset':
                this.resetTimeline();
                break;
        }
    }

    playTimeline() {
        // Simular avanço da timeline
        const slider = document.querySelector('.timeline-slider');
        const yearDisplay = document.querySelector('.timeline-year');
        
        if (this.timelineInterval) {
            clearInterval(this.timelineInterval);
        }

        let currentYear = 1975;
        this.timelineInterval = setInterval(() => {
            currentYear += 1;
            if (currentYear > 2025) {
                currentYear = 1975;
            }
            
            if (yearDisplay) {
                yearDisplay.textContent = currentYear;
            }
            
            // Atualizar dados simulados
            this.updateDataForYear(currentYear);
        }, 100);
    }

    pauseTimeline() {
        if (this.timelineInterval) {
            clearInterval(this.timelineInterval);
            this.timelineInterval = null;
        }
    }

    resetTimeline() {
        this.pauseTimeline();
        const yearDisplay = document.querySelector('.timeline-year');
        if (yearDisplay) {
            yearDisplay.textContent = '1975';
        }
        this.updateDataForYear(1975);
    }

    updateDataForYear(year) {
        // Simular atualização de dados baseado no ano
        const cards = document.querySelectorAll('.metric-card .metric-value');
        cards.forEach((card, index) => {
            const baseValues = [15000, 25.5, 30000]; // valores base
            const yearProgress = (year - 1975) / 50;
            const newValue = Math.round(baseValues[index] * (1 + yearProgress * 0.8));
            
            if (gsap) {
                gsap.to(card, {
                    textContent: newValue.toLocaleString(),
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                card.textContent = newValue.toLocaleString();
            }
        });
    }

    setupSmoothScroll() {
        // ScrollSmoother desativado temporariamente para debug
        console.log('🌊 Smooth scroll: Sistema nativo ativado');
        
        // Scroll nativo suave
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    setupNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateNavbar() {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                navbar.classList.add('visible');
            } else {
                navbar.classList.remove('visible');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }

    async initializeData() {
        // Simular dados se a API não estiver disponível
        if (typeof window.DataLoader === 'undefined') {
            this.simulateData();
        }
    }

    simulateData() {
        // Dados simulados para desenvolvimento
        window.ecoData = {
            historical: this.generateHistoricalData(),
            stats: {
                deforestation: 758470,
                temperature: 1.3,
                fires: 2211979,
                species: 62341
            },
            predictions: this.generatePredictions()
        };

        console.log('📊 Dados simulados carregados');
        this.updateUI();
    }

    generateHistoricalData() {
        const data = [];
        const baseYear = 1975;
        const currentYear = 2025;

        for (let year = baseYear; year <= currentYear; year++) {
            const progress = (year - baseYear) / (currentYear - baseYear);
            data.push({
                year: year,
                deforestation: 5000 + (progress * 20000) + (Math.random() * 5000),
                temperature: 25.5 + (progress * 2.5) + (Math.random() * 0.5),
                fires: 10000 + (progress * 50000) + (Math.random() * 20000),
                precipitation: 2000 + (Math.sin(progress * 10) * 200)
            });
        }

        return data;
    }

    generatePredictions() {
        return {
            deforestation: {
                2030: 45000,
                confidence: 0.85,
                trend: 'increasing'
            },
            temperature: {
                2030: 28.5,
                confidence: 0.78,
                trend: 'increasing'
            },
            biodiversity: {
                species_loss: 4583,
                confidence: 0.92,
                timeline: '2025-2030'
            }
        };
    }

    updateUI() {
        // Atualizar contadores na hero section
        this.updateCounters();
    }

    updateCounters() {
        // Implementar animação de contadores se necessário
        const statValues = document.querySelectorAll('.stat-value');
        const values = [758470, 1.3, 7];
        
        statValues.forEach((element, index) => {
            if (values[index] !== undefined) {
                if (gsap) {
                    gsap.to(element, {
                        textContent: values[index].toLocaleString(),
                        duration: 2,
                        ease: "power2.out"
                    });
                }
            }
        });
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.ecoApp = new EcoGuardiansApp();
});
