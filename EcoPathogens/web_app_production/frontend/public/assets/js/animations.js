/**
 * 🌳 EcoGuardians - GSAP Premium Animations
 * Sistema de animações avançadas para NASA Space Apps Challenge 2025
 * 
 * Recursos GSAP Premium utilizados:
 * - ScrollTrigger: Animações baseadas no scroll
 * - MotionPath: Animações de movimento ao longo de caminhos
 * - MorphSVG: Transformações de formas SVG
 * - DrawSVG: Animações de desenho de SVG
 * - SplitText: Animações de texto caractere por caractere
 * - ScrollSmoother: Scroll suave e performático
 * - CustomEase: Curvas de animação personalizadas
 * - Physics2D: Simulações físicas 2D
 */

class EcoGuardiansAnimations {
    constructor() {
        this.initGSAP();
        this.setupScrollSmoother();
        this.initDevTools();
        this.initLoadingScreen();
        this.initHeroAnimations();
        this.initScrollTriggers();
        this.initNavigationAnimations();
        this.initParticleSystem();
        this.initInteractiveElements();
        this.initAdvancedEffects();
    }

    initGSAP() {
        // Registrar TODOS os plugins GSAP Premium disponíveis
        gsap.registerPlugin(
            // Plugins essenciais
            ScrollTrigger,
            Observer,
            ScrollToPlugin,
            
            // Plugins Premium de animação
            MorphSVGPlugin,
            DrawSVGPlugin,
            SplitText,
            ScrollSmoother,
            MotionPathPlugin,
            
            // Plugins Premium de física
            Physics2DPlugin,
            PhysicsPropsPlugin,
            InertiaPlugin,
            Draggable,
            
            // Plugins Premium de easing
            CustomEase,
            CustomBounce,
            CustomWiggle,
            EasePack,
            
            // Plugins Premium de texto
            TextPlugin,
            ScrambleTextPlugin,
            
            // Plugins Premium de layout
            Flip,
            CSSRulePlugin,
            
            // Plugins Premium de integração
            EaselPlugin,
            PixiPlugin,
            
            // Ferramentas de desenvolvimento
            GSDevTools,
            MotionPathHelper
        );

        // Configurações globais otimizadas
        gsap.config({
            force3D: true,
            autoSleep: 60,
            nullTargetWarn: false
        });

        // Custom eases exclusivos usando CustomEase Premium
        CustomEase.create("ecoEase", "M0,0 C0.25,0.46 0.45,0.94 1,1");
        CustomEase.create("forestBounce", "M0,0 C0.7,0 0.3,1 1,1");
        CustomEase.create("leafFall", "M0,0 C0.55,0 0.55,1 1,1");
        CustomEase.create("organicFlow", "M0,0 C0.4,0 0.6,1 1,1");
        
        // Custom bounces usando CustomBounce Premium
        CustomBounce.create("gentleBounce", {strength: 0.7, squash: 3});
        CustomBounce.create("elasticBounce", {strength: 0.3, squash: 2});
        
        // Custom wiggles usando CustomWiggle Premium  
        CustomWiggle.create("leafShake", {wiggles: 6, type: "easeOut"});
        CustomWiggle.create("treeWind", {wiggles: 3, type: "anticipate"});

        console.log('🎬 GSAP Premium COMPLETO inicializado com TODOS os 25+ plugins!');
        console.log('💎 Recursos disponíveis: MorphSVG, DrawSVG, SplitText, Physics2D, ScrollSmoother, Flip, e muito mais!');
    }

    setupScrollSmoother() {
        // ScrollSmoother para scroll ultra suave
        this.scrollSmoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1.5,
            effects: true,
            normalizeScroll: true,
            ignoreMobileResize: true
        });

        console.log('📜 ScrollSmoother configurado');
    }

    initLoadingScreen() {
        const tl = gsap.timeline();

        // Animação do logo com DrawSVGPlugin Premium
        tl.set(".logo-circle", { drawSVG: "0%" })
        .to(".logo-circle", {
            drawSVG: "100%",
            duration: 2,
            ease: "ecoEase"
        });

        // MorphSVG Premium para transformar o logo
        if (window.MorphSVGPlugin) {
            tl.to(".logo-leaf", {
                morphSVG: "M30 60 Q60 20 90 60 Q60 100 30 60",
                duration: 1,
                ease: "elasticBounce"
            }, "-=1");
        }

        // SplitText Premium para animação de caracteres
        const titleSplit = new SplitText(".loading-title", { 
            type: "chars,words",
            charsClass: "char",
            wordsClass: "word"
        });
        
        // Animação épica de texto
        tl.to(titleSplit.chars, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(1.7)"
        }, "-=1");

        // ScrambleText Premium para efeito hacker no subtítulo
        if (window.ScrambleTextPlugin) {
            tl.to(".loading-subtitle", {
                scrambleText: {
                    text: "Carregando dados de 50 anos da Amazônia...",
                    chars: "01",
                    revealDelay: 0.5,
                    speed: 0.3,
                    newClass: "scrambled"
                },
                duration: 2
            }, "-=0.5");
        }

        // CustomWiggle Premium para tremor orgânico
        tl.to(".loading-logo", {
            motionPath: {
                path: "M0,0 Q5,5 0,10 Q-5,5 0,0",
                autoRotate: false
            },
            duration: 3,
            ease: "treeWind",
            repeat: 2
        }, "-=2");

        // Barra de progresso com CustomBounce
        tl.to(".progress-bar", {
            x: "0%",
            duration: 3,
            ease: "gentleBounce"
        }, "-=2");

        // Estatísticas com Physics2D Premium
        tl.to(".stat-item", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            onComplete: () => this.initPhysicsCounters()
        }, "-=2");

        // Remover loading screen com Flip Premium
        tl.to(".loading-screen", {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            delay: 1,
            ease: "power2.inOut",
            onComplete: () => {
                const state = Flip.getState(".loading-screen");
                document.querySelector('.loading-screen').style.display = 'none';
                Flip.from(state, {duration: 0.6, ease: "power2.inOut"});
                this.startMainAnimations();
            }
        });
    }

    // Método para contadores com Physics2D Premium
    initPhysicsCounters() {
        document.querySelectorAll('.stat-number').forEach(element => {
            const target = parseInt(element.dataset.target);
            
            // Usar Physics2DPlugin para movimento realista
            gsap.to(element, {
                physics2D: {
                    velocity: 100,
                    angle: 90,
                    gravity: 300,
                    friction: 0.8
                },
                duration: 0.1,
                onComplete: () => {
                    // Contador numérico suave
                    gsap.to({ value: 0 }, {
                        value: target,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: function() {
                            element.textContent = Math.round(this.targets()[0].value).toLocaleString();
                        }
                    });
                }
            });
        });
    }

    initHeroAnimations() {
        // Animação do título com SplitText
        const heroTitle = new SplitText(".hero-title .title-line", { 
            type: "chars",
            charsClass: "char"
        });

        const heroTl = gsap.timeline({ delay: 0.5 });

        // Animação caractere por caractere
        heroTl.to(".title-line .char", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: "back.out(1.7)"
        });

        // Animação do conteúdo hero
        heroTl.to(".hero-text", {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.5")
        .to(".hero-visual", {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.8")
        .to(".stat-card", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.4");

        // Animação da floresta de fundo
        this.animateForestBackground();

        console.log('🏔️ Hero animations inicializadas');
    }

    animateForestBackground() {
        // Criar SVG animado da floresta usando MorphSVG
        const forestSVG = `
            <svg width="100%" height="100%" viewBox="0 0 1200 400" class="forest-svg">
                <defs>
                    <linearGradient id="forestGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#4a9c7a;stop-opacity:0.9" />
                        <stop offset="100%" style="stop-color:#228B22;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path class="forest-layer-1" d="M0,400 L0,200 Q200,150 400,180 Q600,210 800,160 Q1000,120 1200,140 L1200,400 Z" fill="url(#forestGradient)" />
                <path class="forest-layer-2" d="M0,400 L0,250 Q300,200 600,220 Q900,240 1200,200 L1200,400 Z" fill="#2d7a5f" opacity="0.8" />
                <path class="forest-layer-3" d="M0,400 L0,300 Q400,280 800,290 Q1000,295 1200,285 L1200,400 Z" fill="#1a4a3a" opacity="0.7" />
            </svg>
        `;

        document.querySelector('.animated-forest').innerHTML = forestSVG;

        // Animação de morphing das camadas
        gsap.to(".forest-layer-1", {
            morphSVG: "M0,400 L0,180 Q200,130 400,160 Q600,190 800,140 Q1000,100 1200,120 L1200,400 Z",
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".forest-layer-2", {
            morphSVG: "M0,400 L0,230 Q300,180 600,200 Q900,220 1200,180 L1200,400 Z",
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1
        });

        // Parallax das camadas
        gsap.to(".forest-layer-1", {
            x: "-5%",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });

        gsap.to(".forest-layer-2", {
            x: "-3%",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });
    }

    initParticleSystem() {
        // Sistema de partículas avançado com Physics2D + Draggable Premium
        const particles = [];
        const particleContainer = document.querySelector('.floating-particles');

        // Criar partículas interativas
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.innerHTML = ['🍃', '✨', '🌿', '💧', '🦋'][Math.floor(Math.random() * 5)];
            particle.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 10}px;
                opacity: ${Math.random() * 0.7 + 0.3};
                pointer-events: auto;
                cursor: grab;
                user-select: none;
            `;

            particleContainer.appendChild(particle);
            particles.push(particle);

            // Posição inicial aleatória
            gsap.set(particle, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotation: Math.random() * 360
            });

            // Tornar draggable com InertiaPlugin Premium
            Draggable.create(particle, {
                type: "x,y",
                inertia: true,
                bounds: window,
                edgeResistance: 0.65,
                onDragStart: function() {
                    gsap.to(this.target, {scale: 1.2, duration: 0.2});
                },
                onDragEnd: function() {
                    gsap.to(this.target, {scale: 1, duration: 0.2});
                    
                    // Aplicar physics depois do drag
                    gsap.to(this.target, {
                        physics2D: {
                            velocity: Math.random() * 200 + 100,
                            angle: Math.random() * 360,
                            gravity: 300,
                            friction: 0.7
                        },
                        duration: 2
                    });
                }
            });

            // Animação de flutuação com CustomWiggle Premium
            gsap.to(particle, {
                y: `-=${Math.random() * 100 + 50}`,
                x: `+=${(Math.random() - 0.5) * 100}`,
                rotation: `+=${Math.random() * 360}`,
                duration: Math.random() * 15 + 10,
                repeat: -1,
                yoyo: true,
                ease: "leafShake",
                delay: Math.random() * 5
            });

            // Interação com mouse usando Observer Premium
            Observer.create({
                target: particle,
                type: "pointer",
                onHover: () => {
                    gsap.to(particle, {
                        scale: 1.3,
                        rotation: `+=${Math.random() * 180}`,
                        duration: 0.3,
                        ease: "back.out(1.7)"
                    });
                },
                onHoverEnd: () => {
                    gsap.to(particle, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        }

        console.log('✨ Sistema de partículas PREMIUM iniciado com 50 partículas interativas!');
    }

    initScrollTriggers() {
        // Animações baseadas no scroll

        // Métricas do dashboard
        gsap.utils.toArray('.metric-card').forEach((card, index) => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                delay: index * 0.1
            });

            // Animação de números
            const value = card.querySelector('.metric-value');
            const finalValue = value.textContent.replace(/[^\d.-]/g, '');
            
            if (!isNaN(finalValue)) {
                const tempObj = { value: 0 };
                gsap.to(tempObj, {
                    value: parseFloat(finalValue),
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 70%"
                    },
                    onUpdate: function() {
                        if (finalValue.includes('.')) {
                            value.textContent = tempObj.value.toFixed(1);
                        } else {
                            value.textContent = Math.round(tempObj.value).toLocaleString();
                        }
                    }
                });
            }
        });

        // Cards das décadas
        gsap.utils.toArray('.decade-card').forEach((card, index) => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                delay: index * 0.15
            });
        });

        // Seções principais
        gsap.utils.toArray('section').forEach(section => {
            gsap.to(section.querySelector('.section-header'), {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    end: "bottom 25%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        console.log('📍 ScrollTriggers configurados');
    }

    initNavigationAnimations() {
        // Navbar aparece no scroll
        ScrollTrigger.create({
            start: "top -80",
            end: 99999,
            toggleClass: { className: "visible", targets: ".navbar" }
        });

        // Smooth scroll para links de navegação
        document.querySelectorAll('[data-scroll-to]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(`#${link.dataset.scrollTo}`);
                
                if (target) {
                    this.scrollSmoother.scrollTo(target, true, "top top");
                }
            });
        });

        // Animação do menu mobile
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        navToggle?.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            
            gsap.to(navMenu, {
                opacity: isOpen ? 1 : 0,
                y: isOpen ? 0 : -20,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        console.log('🧭 Navegação configurada');
    }

    // GSDevTools Premium para desenvolvimento
    initDevTools() {
        if (window.GSDevTools && window.location.hostname === 'localhost') {
            GSDevTools.create({
                animation: gsap.timeline(),
                minimal: false,
                css: {
                    position: "fixed",
                    top: "10px",
                    right: "10px",
                    zIndex: 9999
                }
            });
            console.log('🛠️ GSDevTools ativado para desenvolvimento');
        }
    }

    initInteractiveElements() {
        // Botões com micro-interações
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });

            btn.addEventListener('click', () => {
                gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                });
            });
        });

        // Cards com hover effects
        document.querySelectorAll('.metric-card, .decade-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    rotationY: 5,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    rotationY: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Parallax no mouse
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            gsap.to('.floating-particles', {
                x: x * 20,
                y: y * 10,
                duration: 1,
                ease: "power2.out"
            });
        });

        console.log('🎭 Elementos interativos configurados');
    }

    // Animação de entrada personalizada para novos elementos
    animateIn(element, delay = 0) {
        gsap.fromTo(element, 
            { 
                opacity: 0, 
                y: 50, 
                scale: 0.8 
            }, 
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: delay
            }
        );
    }

    // Animação de saída
    animateOut(element, callback) {
        gsap.to(element, {
            opacity: 0,
            y: -50,
            scale: 0.8,
            duration: 0.5,
            ease: "power2.in",
            onComplete: callback
        });
    }

    startMainAnimations() {
        // Trigger para animações principais depois do loading
        gsap.set(['.hero-text', '.hero-visual'], { opacity: 0 });
        gsap.set('.hero-text', { x: -50 });
        gsap.set('.hero-visual', { x: 50 });
        gsap.set('.stat-card', { opacity: 0, y: 20 });

        const mainTl = gsap.timeline();
        
        mainTl.to('.hero-text', {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out"
        })
        .to('.hero-visual', {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.8")
        .to('.stat-card', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.6");

        console.log('🚀 Animações principais iniciadas');
    }

    // Efeitos avançados usando TODOS os plugins premium
    initAdvancedEffects() {
        // Flip Premium para transições de layout
        this.setupFlipTransitions();
        
        // Text effects avançados
        this.setupAdvancedTextEffects();
        
        // Motion path complexos
        this.setupMotionPaths();
        
        // Efeitos de hover avançados
        this.setupAdvancedHovers();
    }

    setupFlipTransitions() {
        // Usar Flip para transições suaves entre estados
        const cards = gsap.utils.toArray('.metric-card, .decade-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const state = Flip.getState(cards);
                
                // Simular mudança de layout
                card.classList.toggle('expanded');
                
                Flip.from(state, {
                    duration: 0.6,
                    ease: "power2.inOut",
                    absolute: true
                });
            });
        });
    }

    setupAdvancedTextEffects() {
        // ScrambleText para títulos
        gsap.utils.toArray('.section-title').forEach(title => {
            ScrollTrigger.create({
                trigger: title,
                start: "top 80%",
                onEnter: () => {
                    if (window.ScrambleTextPlugin) {
                        gsap.to(title, {
                            scrambleText: {
                                text: title.textContent,
                                chars: "10",
                                revealDelay: 0.3,
                                speed: 0.5
                            },
                            duration: 1.5
                        });
                    }
                }
            });
        });

        // SplitText para animações complexas
        gsap.utils.toArray('.hero-description, .section-description').forEach(desc => {
            const split = new SplitText(desc, { type: "words,chars" });
            
            gsap.set(split.chars, { opacity: 0, y: 20, rotationX: -90 });
            
            ScrollTrigger.create({
                trigger: desc,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(split.chars, {
                        opacity: 1,
                        y: 0,
                        rotationX: 0,
                        duration: 0.8,
                        stagger: 0.02,
                        ease: "back.out(1.7)"
                    });
                }
            });
        });
    }

    setupMotionPaths() {
        // MotionPath para elementos flutuantes
        const floatingElements = gsap.utils.toArray('.floating-element');
        
        floatingElements.forEach((element, index) => {
            // Criar path SVG único para cada elemento
            const path = `M${Math.random()*100},${Math.random()*100} Q${Math.random()*200},${Math.random()*200} ${Math.random()*300},${Math.random()*300}`;
            
            gsap.to(element, {
                motionPath: {
                    path: path,
                    autoRotate: true,
                    alignOrigin: [0.5, 0.5]
                },
                duration: Math.random() * 20 + 15,
                repeat: -1,
                yoyo: true,
                ease: "none",
                delay: index * 0.5
            });
        });
    }

    setupAdvancedHovers() {
        // CustomBounce para hover effects
        gsap.utils.toArray('.btn, .metric-card, .decade-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                gsap.to(element, {
                    scale: 1.05,
                    rotation: Math.random() * 4 - 2,
                    duration: 0.3,
                    ease: "gentleBounce"
                });

                // Efeito de brilho com CustomWiggle
                gsap.to(element, {
                    boxShadow: "0 0 30px rgba(46, 139, 87, 0.4)",
                    duration: 0.3,
                    ease: "leafShake"
                });
            });

            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    scale: 1,
                    rotation: 0,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        });
    }

    // Método para criar explosão de partículas usando Physics2D
    createParticleExplosion(x, y, color = '#2E8B57') {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;
            
            document.body.appendChild(particle);

            gsap.to(particle, {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: 0,
                scale: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    particle.remove();
                }
            });
        }
    }

    // Método para refresh das animações
    refresh() {
        ScrollTrigger.refresh();
        this.scrollSmoother?.refresh();
    }

    // Método para destruir animações (cleanup)
    destroy() {
        ScrollTrigger.killAll();
        this.scrollSmoother?.kill();
        gsap.killTweensOf("*");
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um frame para garantir que tudo foi renderizado
    requestAnimationFrame(() => {
        window.ecoAnimations = new EcoGuardiansAnimations();
        console.log('🌳 EcoGuardians Animations Sistema Inicializado!');
    });
});

// Utility functions para uso global
window.EcoUtils = {
    // Animação de contagem
    animateCounter: (element, finalValue, duration = 2) => {
        gsap.fromTo({ value: 0 }, {
            value: finalValue,
            duration: duration,
            ease: "power2.out",
            onUpdate: function() {
                element.textContent = Math.round(this.targets()[0].value).toLocaleString();
            }
        });
    },

    // Shake animation
    shake: (element, intensity = 10) => {
        gsap.to(element, {
            x: intensity,
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(element, { x: 0 });
            }
        });
    },

    // Pulse animation
    pulse: (element, scale = 1.1) => {
        gsap.to(element, {
            scale: scale,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }
};

// Export para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EcoGuardiansAnimations;
}
