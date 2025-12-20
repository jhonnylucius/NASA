/**
 * 🎭 SCRIPT DE TESTE LOCAL - USANDO IMAGENS REAIS
 * Controles de desenvolvimento para as 128+ imagens reais do projeto
 * NASA Space Apps Challenge 2025
 */

/**
 * Função para testar a introdução cinematográfica
 */
function testCinematicIntro() {
    console.log('🎬 Testando introdução cinematográfica com imagens reais...');
    
    // Remove qualquer intro existente
    const existingIntro = document.getElementById('cinematic-intro');
    if (existingIntro) {
        existingIntro.remove();
    }
    
    // Cria nova instância
    if (window.CinematicIntro) {
        new window.CinematicIntro();
    } else {
        console.error('❌ CinematicIntro não encontrado!');
    }
}

/**
 * Função para pular a introdução (para desenvolvimento)
 */
function skipIntro() {
    const intro = document.getElementById('cinematic-intro');
    if (intro) {
        intro.style.opacity = '0';
        setTimeout(() => {
            intro.remove();
            document.body.style.overflow = 'auto';
            
            // Mostra aplicação principal
            const smoothWrapper = document.getElementById('smooth-wrapper');
            if (smoothWrapper) {
                smoothWrapper.style.opacity = '1';
            }
        }, 500);
    }
}

/**
 * Adiciona controles de desenvolvimento
 */
function addDevControls() {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:') {
        const devPanel = document.createElement('div');
        devPanel.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                z-index: 999999;
                font-size: 12px;
                max-width: 300px;
            ">
                <h4 style="margin: 0 0 10px 0; color: #2E8B57;">🎬 Dev Controls - Imagens Reais</h4>
                <button onclick="testCinematicIntro()" style="margin: 5px; padding: 5px 10px; background: #2E8B57; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ▶️ Testar Intro
                </button><br>
                <button onclick="skipIntro()" style="margin: 5px; padding: 5px 10px; background: #FF6B35; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ⏭️ Pular Intro
                </button><br>
                <button onclick="location.reload()" style="margin: 5px; padding: 5px 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔄 Reload
                </button><br>
                <button onclick="showImageStats()" style="margin: 5px; padding: 5px 10px; background: #8B4513; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    📊 Stats das Imagens
                </button>
                <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">
                    <strong>128+ imagens reais:</strong><br>
                    • 125 desastres ambientais<br>
                    • 3 planetas (PLANETA1-3)<br>
                    • 16 categorias diferentes<br>
                    • Nomes originais preservados
                </div>
            </div>
        `;
        document.body.appendChild(devPanel);
        
        // Adiciona atalhos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey) {
                switch(e.key) {
                    case 'I': // Ctrl+Shift+I para testar intro
                        e.preventDefault();
                        testCinematicIntro();
                        break;
                    case 'S': // Ctrl+Shift+S para pular intro
                        e.preventDefault();
                        skipIntro();
                        break;
                    case 'D': // Ctrl+Shift+D para stats
                        e.preventDefault();
                        showImageStats();
                        break;
                }
            }
        });
        
        console.log('🛠️ Controles de desenvolvimento ativados!');
        console.log('📌 Atalhos: Ctrl+Shift+I (Testar), Ctrl+Shift+S (Pular), Ctrl+Shift+D (Stats)');
    }
}

/**
 * Mostra estatísticas das imagens carregadas
 */
function showImageStats() {
    if (window.CinematicIntro) {
        const tempIntro = new window.CinematicIntro();
        const images = tempIntro.generateImageList();
        
        // Conta por categoria
        const categories = {};
        images.forEach(img => {
            if (img.type === 'disaster') {
                const cat = img.category || 'unknown';
                categories[cat] = (categories[cat] || 0) + 1;
            }
        });
        
        const statsWindow = window.open('', '_blank', 'width=600,height=400');
        statsWindow.document.write(`
            <html>
                <head>
                    <title>📊 Estatísticas das Imagens - EcoGuardians</title>
                    <style>
                        body { font-family: Arial; padding: 20px; background: #1a1a1a; color: white; }
                        .stat { margin: 10px 0; padding: 10px; background: #333; border-radius: 5px; }
                        .category { color: #2E8B57; font-weight: bold; }
                        .count { color: #FF6B35; }
                        h1 { color: #2E8B57; }
                        .total { font-size: 1.2em; background: #2E8B57; color: white; padding: 15px; border-radius: 8px; }
                    </style>
                </head>
                <body>
                    <h1>📊 Estatísticas das Imagens Reais</h1>
                    <div class="total">
                        <strong>Total: ${images.length} imagens</strong><br>
                        • ${images.filter(i => i.type === 'disaster').length} desastres ambientais<br>
                        • ${images.filter(i => i.type === 'planet').length} planetas especiais
                    </div>
                    <h2>📋 Por Categoria:</h2>
                    ${Object.entries(categories).map(([cat, count]) => `
                        <div class="stat">
                            <span class="category">${cat}:</span> 
                            <span class="count">${count} imagens</span>
                        </div>
                    `).join('')}
                    <h2>🌍 Planetas Especiais:</h2>
                    ${images.filter(i => i.type === 'planet').map(p => `
                        <div class="stat">🔥 ${p.name} - ${p.src}</div>
                    `).join('')}
                </body>
            </html>
        `);
    }
}

/**
 * Verifica se as imagens existem no diretório
 */
async function checkImageAvailability() {
    if (window.CinematicIntro) {
        const tempIntro = new window.CinematicIntro();
        const images = tempIntro.generateImageList();
        
        console.log('🔍 Verificando disponibilidade das imagens...');
        
        let available = 0;
        let missing = 0;
        
        for (const image of images) {
            try {
                const response = await fetch(image.src, { method: 'HEAD' });
                if (response.ok) {
                    available++;
                } else {
                    missing++;
                    console.warn(`❌ Imagem não encontrada: ${image.src}`);
                }
            } catch (error) {
                missing++;
                console.warn(`❌ Erro ao verificar: ${image.src}`);
            }
        }
        
        console.log(`✅ Imagens disponíveis: ${available}`);
        console.log(`❌ Imagens faltando: ${missing}`);
        console.log(`📊 Total verificado: ${available + missing}`);
    }
}

// Auto-execução
document.addEventListener('DOMContentLoaded', () => {
    // Aguarda um pouco para garantir que tudo carregou
    setTimeout(() => {
        addDevControls();
    }, 100);
});

// Exporta funções para console
window.testCinematicIntro = testCinematicIntro;
window.skipIntro = skipIntro;
window.showImageStats = showImageStats;
window.checkImageAvailability = checkImageAvailability;

console.log('🎭 Script de teste local carregado com suporte às imagens reais!');
