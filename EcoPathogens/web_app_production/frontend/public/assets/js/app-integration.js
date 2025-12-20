/**
 * 🔗 INTEGRAÇÃO CINEMATOGRÁFICA
 * Conecta perfeitamente a introdução cinematográfica com a aplicação principal
 * NASA Space Apps Challenge 2025
 */

class AppIntegration {
    constructor() {
        this.isIntroCompleted = false;
        this.mainAppReady = false;
        
        this.init();
    }

    /**
     * Inicializa a integração
     */
    init() {
        // Aguarda DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startIntegration());
        } else {
            this.startIntegration();
        }
    }

    /**
     * Inicia a integração entre intro e app principal
     */
    startIntegration() {
        console.log('🔗 Iniciando integração cinematográfica...');
        
        // Verifica se deve mostrar a introdução
        const skipIntro = this.shouldSkipIntro();
        
        if (skipIntro) {
            this.skipToMainApp();
        } else {
            this.startCinematicIntro();
        }
    }

    /**
     * Verifica se deve pular a introdução
     */
    shouldSkipIntro() {
        // Pula em desenvolvimento se solicitado
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('skip-intro') === 'true') {
            return true;
        }
        
        // Pula se já foi vista recentemente (sessionStorage)
        if (sessionStorage.getItem('ecoguardians_intro_seen') === 'true') {
            return true;
        }
        
        // Pula se dispositivo com performance limitada
        if (this.isLowPerformanceDevice()) {
            return true;
        }
        
        return false;
    }

    /**
     * Detecta dispositivos com performance limitada
     */
    isLowPerformanceDevice() {
        // Verifica hardware limitado
        const memory = navigator.deviceMemory;
        if (memory && memory < 4) return true;
        
        // Verifica conexão lenta
        const connection = navigator.connection;
        if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
            return true;
        }
        
        // Verifica user agent móvel muito antigo
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('android 4') || userAgent.includes('ios 9')) {
            return true;
        }
        
        return false;
    }

    /**
     * Inicia a introdução cinematográfica
     */
    startCinematicIntro() {
        console.log('🎬 Iniciando introdução cinematográfica...');
        
        // Garante que GSAP está carregado
        this.waitForGSAP().then(() => {
            // Esconde loading screen padrão
            this.hideDefaultLoadingScreen();
            
            // Esconde aplicação principal
            this.hideMainApp();
            
            // Inicia introdução cinematográfica
            if (window.CinematicIntro) {
                window.cinematicIntroInstance = new window.CinematicIntro();
                
                // Marca como vista
                sessionStorage.setItem('ecoguardians_intro_seen', 'true');
            } else {
                console.error('❌ CinematicIntro não encontrado! Pulando para app principal...');
                this.skipToMainApp();
            }
        });
    }

    /**
     * Aguarda GSAP carregar
     */
    waitForGSAP() {
        return new Promise((resolve) => {
            if (typeof gsap !== 'undefined') {
                resolve();
            } else {
                const checkGSAP = setInterval(() => {
                    if (typeof gsap !== 'undefined') {
                        clearInterval(checkGSAP);
                        resolve();
                    }
                }, 100);
                
                // Timeout de segurança (10 segundos)
                setTimeout(() => {
                    clearInterval(checkGSAP);
                    console.warn('⚠️ GSAP não carregou em 10s, continuando...');
                    resolve();
                }, 10000);
            }
        });
    }

    /**
     * Esconde loading screen padrão
     */
    hideDefaultLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    /**
     * Esconde aplicação principal durante a intro
     */
    hideMainApp() {
        const smoothWrapper = document.getElementById('smooth-wrapper');
        if (smoothWrapper) {
            smoothWrapper.style.opacity = '0';
            smoothWrapper.style.pointerEvents = 'none';
        }
        
        // Previne scroll durante intro
        document.body.style.overflow = 'hidden';
    }

    /**
     * Pula direto para aplicação principal
     */
    skipToMainApp() {
        console.log('⏭️ Pulando introdução, carregando app principal...');
        
        this.hideDefaultLoadingScreen();
        
        // Mostra aplicação principal imediatamente
        const smoothWrapper = document.getElementById('smooth-wrapper');
        if (smoothWrapper) {
            smoothWrapper.style.opacity = '1';
            smoothWrapper.style.pointerEvents = 'auto';
        }
        
        document.body.style.overflow = 'auto';
        
        // Animação suave de entrada
        if (typeof gsap !== 'undefined') {
            gsap.from(smoothWrapper, {
                duration: 1.5,
                opacity: 0,
                y: 30,
                ease: 'power2.out'
            });
        }
        
        this.isIntroCompleted = true;
        this.mainAppReady = true;
        
        // Inicia app principal
        this.initMainApp();
    }

    /**
     * Inicializa aplicação principal após intro
     */
    initMainApp() {
        console.log('🚀 Inicializando aplicação principal...');
        
        // Inicializa outros módulos se existirem
        if (typeof window.initCharts === 'function') {
            window.initCharts();
        }
        
        if (typeof window.initMaps === 'function') {
            window.initMaps();
        }
        
        if (typeof window.initAnimations === 'function') {
            window.initAnimations();
        }
        
        // Carrega dados se necessário
        if (typeof window.loadEnvironmentalData === 'function') {
            window.loadEnvironmentalData();
        }
        
        // Eventos personalizados
        document.dispatchEvent(new CustomEvent('ecoguardians:appReady', {
            detail: { 
                introCompleted: this.isIntroCompleted,
                timestamp: Date.now()
            }
        }));
    }

    /**
     * Adiciona controles de desenvolvimento
     */
    addDevControls() {
        // Só em desenvolvimento
        if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1' && location.protocol !== 'file:') {
            return;
        }
        
        // Adiciona controles de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey) {
                switch(e.key) {
                    case 'i': // Ctrl+Alt+I - Restartar intro
                        e.preventDefault();
                        sessionStorage.removeItem('ecoguardians_intro_seen');
                        location.reload();
                        break;
                    case 's': // Ctrl+Alt+S - Pular intro
                        e.preventDefault();
                        if (window.cinematicIntroInstance && window.cinematicIntroInstance.skipIntro) {
                            window.cinematicIntroInstance.skipIntro();
                        }
                        break;
                    case 'r': // Ctrl+Alt+R - Reset completo
                        e.preventDefault();
                        sessionStorage.clear();
                        localStorage.removeItem('ecoguardians_intro_seen');
                        location.reload();
                        break;
                }
            }
        });

        console.log('🛠️ Controles de dev ativados:');
        console.log('   Ctrl+Alt+I: Restartar intro');
        console.log('   Ctrl+Alt+S: Pular intro');
        console.log('   Ctrl+Alt+R: Reset completo');
    }
}

// Auto-inicialização
window.addEventListener('load', () => {
    window.appIntegration = new AppIntegration();
    window.appIntegration.addDevControls();
});

// Exporta para uso externo
window.AppIntegration = AppIntegration;

console.log('🔗 Sistema de integração cinematográfica carregado!');
