// Fix navegação do footer - usando GSAP para scroll suave
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔗 Iniciando sistema de navegação do footer...');

    // Mapear links para seletores CSS das seções
    const sectionMap = {
        'hero': '#hero',
        'dashboard': '#dashboard',
        'timeline': '#timeline',
        'gallery': '#gallery',
        'predictions': '#predictions',
        'earth-live': '#earth-live',
        'space-weather': '#space-weather',
        'about': '#about'
    };

    // Pegar todos os links do footer
    const footerLinks = document.querySelectorAll('.footer a[href^="#"]');
    console.log(`📍 Encontrados ${footerLinks.length} links no footer`);

    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const href = link.getAttribute('href');
            const sectionId = href.replace('#', '');

            console.log(`🔗 Clicou em: ${sectionId}`);

            // Buscar elemento
            let element = document.getElementById(sectionId);

            // Se não encontrar por ID, tentar pelo mapeamento
            if (!element && sectionMap[sectionId]) {
                element = document.querySelector(sectionMap[sectionId]);
            }

            if (element) {
                console.log(`✅ Navegando para: ${sectionId}`);

                // Tentar usar GSAP ScrollToPlugin se disponível
                if (typeof gsap !== 'undefined' && gsap.to) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: element,
                            offsetY: 80
                        },
                        ease: 'power2.inOut'
                    });
                } else {
                    // Fallback para scrollIntoView nativo
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else {
                console.warn(`❌ Seção não encontrada: ${sectionId}`);
            }
        });
    });

    // Também adicionar para links da navbar
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .navbar a[href^="#"]');
    console.log(`📍 Encontrados ${navLinks.length} links na navbar`);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const href = link.getAttribute('href');
            const sectionId = href.replace('#', '');

            let element = document.getElementById(sectionId);
            if (!element && sectionMap[sectionId]) {
                element = document.querySelector(sectionMap[sectionId]);
            }

            if (element) {
                if (typeof gsap !== 'undefined' && gsap.to) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: element,
                            offsetY: 80
                        },
                        ease: 'power2.inOut'
                    });
                } else {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    console.log('✅ Sistema de navegação do footer ativado!');
});
