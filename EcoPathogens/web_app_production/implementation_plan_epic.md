# 🌍 Terra ao Vivo - NASA EPIC

## Objetivo
Criar seção interativa mostrando a Terra do espaço em tempo real usando NASA EPIC API, com destaque visual para a região da Amazônia.

## NASA EPIC API

### Endpoints
```
GET https://epic.gsfc.nasa.gov/api/natural
GET https://epic.gsfc.nasa.gov/api/natural/date/YYYY-MM-DD
GET https://epic.gsfc.nasa.gov/archive/natural/YYYY/MM/DD/png/[image].png
```

### Resposta Exemplo
```json
[{
  "image": "epic_1b_20231215121055",
  "date": "2023-12-15 12:10:55",
  "centroid_coordinates": {
    "lat": -3.0,
    "lon": -60.0
  },
  "coords": {
    "centroid_coordinates": {
      "lat": -3.0,
      "lon": -60.0
    }
  }
}]
```

## Arquitetura

### HTML (index.html)
```html
<section id="earth-live" class="earth-section">
  <div class="container">
    <h2>🌍 Terra ao Vivo</h2>
    <p>Imagens da Terra capturadas do espaço pela NASA EPIC</p>
    
    <div class="earth-viewer">
      <!-- Imagem principal -->
      <div class="earth-image-container">
        <img id="epic-image" src="" alt="Terra vista do espaço">
        <div class="amazon-highlight"></div>
        <div class="loading-spinner"></div>
      </div>
      
      <!-- Controles -->
      <div class="earth-controls">
        <div class="date-slider">
          <input type="range" id="epic-date-slider">
          <span id="epic-current-date"></span>
        </div>
        <div class="earth-actions">
          <button id="epic-zoom-amazon">🔍 Zoom Amazônia</button>
          <button id="epic-refresh">🔄 Atualizar</button>
        </div>
      </div>
      
      <!-- Info panel -->
      <div class="earth-info">
        <div class="info-item">
          <span class="label">📅 Data:</span>
          <span id="epic-info-date"></span>
        </div>
        <div class="info-item">
          <span class="label">📍 Centro:</span>
          <span id="epic-info-coords"></span>
        </div>
        <div class="info-item">
          <span class="label">🛰️ Distância:</span>
          <span id="epic-info-distance"></span>
        </div>
      </div>
    </div>
  </div>
</section>
```

### JavaScript (epic.js)
```javascript
class EPICViewer {
  constructor() {
    this.apiBase = 'https://epic.gsfc.nasa.gov/api';
    this.images = [];
    this.currentIndex = 0;
    this.init();
  }

  async init() {
    await this.fetchLatestImages();
    this.setupControls();
    this.displayImage(0);
  }

  async fetchLatestImages() {
    const response = await fetch(`${this.apiBase}/natural`);
    this.images = await response.json();
  }

  displayImage(index) {
    const image = this.images[index];
    const date = image.date.split(' ')[0].replace(/-/g, '/');
    const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${image.image}.png`;
    
    document.getElementById('epic-image').src = imageUrl;
    this.updateInfo(image);
  }

  zoomToAmazon() {
    // Implementar zoom na região da Amazônia
    // Coordenadas: lat: -3, lon: -60
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new EPICViewer();
});
```

### CSS (epic.css)
```css
.earth-section {
  background: linear-gradient(180deg, #000 0%, #0a1929 100%);
  color: white;
  padding: 100px 0;
}

.earth-viewer {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-top: 40px;
}

.earth-image-container {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 100px rgba(66, 153, 225, 0.5);
  aspect-ratio: 1;
}

#epic-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: rotate 60s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.amazon-highlight {
  position: absolute;
  top: 40%;
  left: 35%;
  width: 15%;
  height: 15%;
  border: 3px solid #48bb78;
  border-radius: 50%;
  box-shadow: 0 0 30px #48bb78;
  pointer-events: none;
  animation: pulse 2s ease-in-out infinite;
}
```

## Funcionalidades

### 1. Busca de Imagens
- [x] Endpoint: `/api/natural`
- [ ] Cache local (1 hora)
- [ ] Fallback para data anterior se atual indisponível

### 2. Slider de Datas
- [ ] Mostrar últimas 30 imagens
- [ ] Smooth transition entre imagens
- [ ] Indicador visual de data

### 3. Zoom Amazônia
- [ ] Destacar região com círculo verde
- [ ] Animação de aproximação
- [ ] Mostrar coordenadas (-3°, -60°)

### 4. Auto-atualização
- [ ] A cada 1 hora
- [ ] Notificação de nova imagem
- [ ] Background fetch

## Performance

- Lazy load de imagens
- Progressive JPEG
- Caching agressivo
- Loading skeleton

## Testes

- [ ] Testar com API offline
- [ ] Diferentes resoluções
- [ ] Mobile responsivo
- [ ] Anima
ções suaves
