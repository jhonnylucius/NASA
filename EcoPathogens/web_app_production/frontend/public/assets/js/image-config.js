/**
 * 🖼️ GERADOR DE IMAGENS PLACEHOLDER
 * Gera 128 imagens de placeholder para desenvolvimento
 * NASA Space Apps Challenge 2025
 */

// Lista de URLs de imagens de exemplo relacionadas a desastres ambientais
const PLACEHOLDER_IMAGES = [
    // Queimadas e incêndios
    'https://images.unsplash.com/photo-1574482620007-57f80dc0de84?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1574482603530-8030899f3770?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1567095752298-461e11bc1ac9?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=300&h=200&fit=crop',
    
    // Desmatamento
    'https://images.unsplash.com/photo-1569163140394-de4e4f43e4e3?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1570026269387-4d7deb58ce06?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1569163139494-de4e4f43e4e3?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1599128267031-b2a5c9c3ada8?w=300&h=200&fit=crop',
    
    // Inundações
    'https://images.unsplash.com/photo-1574482620007-57f80dc0de84?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1569163139494-de4e4f43e4e3?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1599155195406-edc11c73c6d9?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1569163139494-de4e4f43e4e3?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1599128267031-b2a5c9c3ada8?w=300&h=200&fit=crop',
    
    // Secas
    'https://images.unsplash.com/photo-1569163139494-de4e4f43e4e3?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1599128267031-b2a5c9c3ada8?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1569163139494-de4e4f43e4e3?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1599155195406-edc11c73c6d9?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1569163139494-de4e4f43e4e3?w=300&h=200&fit=crop',
    
    // Poluição
    'https://images.unsplash.com/photo-1569163139494-de4e4f43e4e3?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1599128267031-b2a5c9c3ada8?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1569163139494-de4e4f43e4e3?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1599155195406-edc11c73c6d9?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1569163139494-de4e4f43e4e3?w=300&h=200&fit=crop'
];

/**
 * Gera configuração de imagens com dados simulados
 */
function generateImageConfig() {
    const config = {
        disasters: [],
        planets: []
    };
    
    // Gera 125 imagens de desastres
    for (let i = 1; i <= 125; i++) {
        const category = ['deforestation', 'fires', 'floods', 'drought', 'pollution'][Math.floor(Math.random() * 5)];
        const year = 1975 + Math.floor(Math.random() * 50);
        
        config.disasters.push({
            id: i,
            filename: `disaster${i}.jpg`,
            src: PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)],
            category: category,
            title: `Desastre Ambiental #${i}`,
            description: `Evento de ${category} registrado na Amazônia`,
            date: `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            location: getRandomAmazonLocation(),
            coordinates: getRandomAmazonCoordinates(),
            severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
            tags: generateRandomTags(category)
        });
    }
    
    // Gera 3 imagens de planetas
    for (let i = 1; i <= 3; i++) {
        config.planets.push({
            id: i,
            filename: `planeta${i}.jpg`,
            src: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop',
            title: `Planeta ${i}`,
            description: `Visão do planeta Terra em estado ${i === 1 ? 'saudável' : i === 2 ? 'degradado' : 'crítico'}`,
            year: 1975 + (i - 1) * 25,
            condition: i === 1 ? 'healthy' : i === 2 ? 'degraded' : 'critical'
        });
    }
    
    return config;
}

/**
 * Gera localização aleatória na Amazônia
 */
function getRandomAmazonLocation() {
    const locations = [
        'Manaus, AM', 'Belém, PA', 'Rio Branco, AC', 'Boa Vista, RR',
        'Macapá, AP', 'Palmas, TO', 'Cuiabá, MT', 'Porto Velho, RO',
        'Alta Floresta, MT', 'Santarém, PA', 'Marabá, PA', 'Altamira, PA',
        'Cruzeiro do Sul, AC', 'Parintins, AM', 'Tucuruí, PA', 'Sinop, MT'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
}

/**
 * Gera coordenadas aleatórias na Amazônia
 */
function getRandomAmazonCoordinates() {
    const lat = -18 + Math.random() * 23; // -18° a 5°
    const lng = -74 + Math.random() * 30; // -74° a -44°
    
    return {
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6))
    };
}

/**
 * Gera tags aleatórias baseadas na categoria
 */
function generateRandomTags(category) {
    const tagsByCategory = {
        deforestation: ['desmatamento', 'corte', 'madeira', 'pecuária', 'soja', 'agricultura'],
        fires: ['queimada', 'incêndio', 'fogo', 'fumaça', 'calor', 'seca'],
        floods: ['enchente', 'inundação', 'chuva', 'rio', 'alagamento', 'água'],
        drought: ['seca', 'estiagem', 'calor', 'falta-água', 'solo-rachado', 'clima'],
        pollution: ['poluição', 'contaminação', 'lixo', 'química', 'água-suja', 'ar-poluído']
    };
    
    const availableTags = tagsByCategory[category] || [];
    const numTags = Math.floor(Math.random() * 3) + 2; // 2-4 tags
    
    return availableTags
        .sort(() => Math.random() - 0.5)
        .slice(0, numTags);
}

/**
 * Salva configuração no localStorage para desenvolvimento
 */
function saveImageConfig() {
    const config = generateImageConfig();
    localStorage.setItem('ecoguardians_images_config', JSON.stringify(config));
    console.log('✅ Configuração de 128 imagens gerada:', config);
    return config;
}

/**
 * Carrega configuração do localStorage
 */
function loadImageConfig() {
    const stored = localStorage.getItem('ecoguardians_images_config');
    if (stored) {
        return JSON.parse(stored);
    }
    return saveImageConfig();
}

/**
 * Gera e baixa arquivo de configuração como JSON
 */
function downloadImageConfig() {
    const config = generateImageConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ecoguardians-images-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📥 Arquivo de configuração baixado!');
}

// Auto-execução para gerar configuração se não existir
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('ecoguardians_images_config')) {
        saveImageConfig();
    }
});

// Exporta funções para uso externo
window.ImageConfigGenerator = {
    generate: generateImageConfig,
    save: saveImageConfig,
    load: loadImageConfig,
    download: downloadImageConfig
};

console.log('📸 Gerador de configuração de imagens carregado!');
