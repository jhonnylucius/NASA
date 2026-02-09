window.EcoConfig = {
    // URL da API em Produção (VPS)
    // Baseado no seu MANUAL_DEPLOY.md e application.properties
    API_BASE_URL: 'https://api.ecoguardians.com.br:8443',

    // Configurações de Features
    FEATURES: {
        USE_PROXY: true, // Usa o proxy Java para evitar CORS
        DEBUG_MODE: true
    }
};

console.log('🌍 EcoGuardians Config Carregado via config.js');
console.log('🔗 API Base URL:', window.EcoConfig.API_BASE_URL);
