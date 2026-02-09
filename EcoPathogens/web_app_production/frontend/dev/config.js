window.EcoConfig = {
    // 🌍 Configuração de Produção
    // Baseado no seu MANUAL_DEPLOY.md e application.properties
    API_BASE_URL: 'https://api.ecoguardians.com.br:8443',

    ENVIRONMENT: 'production',
    FEATURES: {
        USE_PROXY: true,
        DEBUG_MODE: true
    }
};
console.log('🔧 Dev/Prod Config loaded');
