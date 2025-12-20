// 🔍 VERIFICADOR DE PLUGINS GSAP
// Execute este código no console do navegador (F12) para verificar plugins

function verificarPluginsGSAP() {
    console.log("🎬 VERIFICANDO PLUGINS GSAP...");
    console.log("=====================================");
    
    // Verificar GSAP core
    if (typeof gsap !== 'undefined') {
        console.log("✅ GSAP Core carregado - Versão:", gsap.version);
    } else {
        console.log("❌ GSAP Core NÃO encontrado!");
        return;
    }
    
    // Lista COMPLETA de plugins para verificar (todos que você tem!)
    const plugins = [
        // Core e essenciais
        { name: 'GSAP Core', obj: 'gsap', type: 'core' },
        { name: 'ScrollTrigger', obj: 'ScrollTrigger', type: 'free' },
        { name: 'Observer', obj: 'Observer', type: 'free' },
        { name: 'ScrollToPlugin', obj: 'ScrollToPlugin', type: 'free' },
        
        // Premium Animation
        { name: 'MorphSVGPlugin', obj: 'MorphSVGPlugin', type: 'premium' },
        { name: 'DrawSVGPlugin', obj: 'DrawSVGPlugin', type: 'premium' },
        { name: 'SplitText', obj: 'SplitText', type: 'premium' },
        { name: 'ScrollSmoother', obj: 'ScrollSmoother', type: 'premium' },
        { name: 'MotionPathPlugin', obj: 'MotionPathPlugin', type: 'premium' },
        
        // Premium Physics & Interaction
        { name: 'Physics2DPlugin', obj: 'Physics2DPlugin', type: 'premium' },
        { name: 'PhysicsPropsPlugin', obj: 'PhysicsPropsPlugin', type: 'premium' },
        { name: 'InertiaPlugin', obj: 'InertiaPlugin', type: 'premium' },
        { name: 'Draggable', obj: 'Draggable', type: 'premium' },
        
        // Premium Easing
        { name: 'CustomEase', obj: 'CustomEase', type: 'premium' },
        { name: 'CustomBounce', obj: 'CustomBounce', type: 'premium' },
        { name: 'CustomWiggle', obj: 'CustomWiggle', type: 'premium' },
        { name: 'EasePack', obj: 'EasePack', type: 'free' },
        
        // Premium Text
        { name: 'TextPlugin', obj: 'TextPlugin', type: 'free' },
        { name: 'ScrambleTextPlugin', obj: 'ScrambleTextPlugin', type: 'premium' },
        
        // Premium Layout
        { name: 'Flip', obj: 'Flip', type: 'premium' },
        { name: 'CSSRulePlugin', obj: 'CSSRulePlugin', type: 'premium' },
        
        // Premium Integrations
        { name: 'EaselPlugin', obj: 'EaselPlugin', type: 'premium' },
        { name: 'PixiPlugin', obj: 'PixiPlugin', type: 'premium' },
        
        // Development Tools
        { name: 'GSDevTools', obj: 'GSDevTools', type: 'premium' },
        { name: 'MotionPathHelper', obj: 'MotionPathHelper', type: 'premium' }
    ];
    
    let pluginsCarregados = 0;
    let pluginsPremium = 0;
    let pluginsFree = 0;
    let pluginsCore = 0;
    
    plugins.forEach(plugin => {
        try {
            const isLoaded = window[plugin.obj] || (plugin.obj === 'gsap' && typeof gsap !== 'undefined');
            
            if (isLoaded) {
                const emoji = plugin.type === 'premium' ? '💎' : plugin.type === 'free' ? '🆓' : '🔧';
                console.log(`✅ ${emoji} ${plugin.name} - FUNCIONANDO`);
                pluginsCarregados++;
                
                if (plugin.type === 'premium') pluginsPremium++;
                else if (plugin.type === 'free') pluginsFree++;
                else if (plugin.type === 'core') pluginsCore++;
                
            } else {
                const emoji = plugin.type === 'premium' ? '💎' : plugin.type === 'free' ? '🆓' : '🔧';
                console.log(`❌ ${emoji} ${plugin.name} - NÃO ENCONTRADO`);
            }
        } catch (e) {
            console.log(`❌ ${plugin.name} - ERRO: ${e.message}`);
        }
    });
    
    console.log("=====================================");
    console.log(`📊 RESULTADO FINAL:`);
    console.log(`   Total: ${pluginsCarregados}/${plugins.length} plugins funcionando`);
    console.log(`   💎 Premium: ${pluginsPremium} plugins`);
    console.log(`   🆓 Gratuitos: ${pluginsFree} plugins`);
    console.log(`   🔧 Core: ${pluginsCore} plugins`);
    
    // Análise de capacidades
    if (pluginsPremium >= 15) {
        console.log("🎉 ARSENAL COMPLETO! Você tem uma licença GSAP Premium completa!");
        console.log("🚀 O EcoGuardians vai ter animações de HOLLYWOOD!");
        console.log("🏆 Recursos disponíveis:");
        console.log("   • Morphing SVG cinematográfico");
        console.log("   • Partículas físicas realistas");
        console.log("   • Scroll ultra suave");
        console.log("   • Texto animado profissionalmente");
        console.log("   • Transições de layout fluidas");
        console.log("   • Elementos arrastáveis");
        console.log("   • Efeitos de física 2D");
        console.log("   • Ferramentas de desenvolvimento");
    } else if (pluginsPremium >= 8) {
        console.log("🎊 MUITO BOM! Você tem muitos plugins premium!");
        console.log("� O EcoGuardians vai impressionar!");
    } else if (pluginsPremium >= 3) {
        console.log("👍 BOM! Alguns plugins premium funcionando");
        console.log("💡 Mais plugins = mais efeitos incríveis");
    } else {
        console.log("⚠️ Poucos plugins premium detectados");
        console.log("💡 Adicione mais plugins para efeitos avançados");
    }
    
    // Teste rápido de funcionalidade
    console.log("\n🧪 TESTANDO FUNCIONALIDADES:");
    
    try {
        gsap.to({}, { duration: 0.1 });
        console.log("✅ Animações básicas - OK");
    } catch (e) {
        console.log("❌ Animações básicas - ERRO");
    }
    
    if (pluginsCarregados > 0) {
        console.log("✅ Sistema pronto para animações avançadas!");
    }
    
    return {
        total: pluginsCarregados,
        premium: pluginsPremium,
        functioning: pluginsCarregados >= 3
    };
}

// Auto-executar quando o DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verificarPluginsGSAP);
} else {
    verificarPluginsGSAP();
}

// Também disponibilizar globalmente
window.verificarPluginsGSAP = verificarPluginsGSAP;
