# 🌞 Clima Espacial - NASA DONKI

## Objetivo
Criar seção interativa mostrando eventos do clima espacial em tempo real usando NASA DONKI API, com alertas visuais e timeline de eventos que afetam a Terra.

## NASA DONKI API

### Endpoints Principais
```
GET https://api.nasa.gov/DONKI/notifications?api_key=DEMO_KEY
GET https://api.nasa.gov/DONKI/FLR?startDate=YYYY-MM-DD
GET https://api.nasa.gov/DONKI/GST?startDate=YYYY-MM-DD  
GET https://api.nasa.gov/DONKI/CME?startDate=YYYY-MM-DD
```

### Tipos de Eventos
- **FLR**: Solar Flares (Erupções Solares)
- **GST**: Geomagnetic Storms (Tempestades Geomagnéticas)
- **CME**: Coronal Mass Ejections (Ejeções de Massa Coronal)
- **SEP**: Solar Energetic Particles
- **IPS**: Interplanetary Shocks
- **RBE**: Radiation Belt Enhancement

## Arquitetura

### HTML
```html
<section id="space-weather" class="donki-section">
  <h2>🌞 Clima Espacial</h2>
  <p>Eventos solares monitorados pela NASA DONKI</p>
  
  <!-- Alertas Ativos -->
  <div class="active-alerts">
    <div class="alert-card severe">
      <div class="alert-icon">⚡</div>
      <h3>Tempestade Geomagnética</h3>
      <span class="severity">SEVERA</span>
      <p>G3 - Possível impacto em GPS e comunicações</p>
    </div>
  </div>
  
  <!-- Timeline de Eventos -->
  <div class="events-timeline">
    <!-- Eventos dos últimos 30 dias -->
  </div>
  
  <!-- Estatísticas -->
  <div class="donki-stats">
    <div class="stat">
      <span class="value">12</span>
      <span class="label">Erupções Solares</span>
    </div>
  </div>
</section>
```

### JavaScript
```javascript
class DONKIViewer {
  constructor() {
    this.apiBase = 'https://api.nasa.gov/DONKI';
    this.apiKey = 'DEMO_KEY';
    this.notifications = [];
    this.events = [];
  }

  async fetchNotifications() {
    const url = `${this.apiBase}/notifications?api_key=${this.apiKey}`;
    const response = await fetch(url);
    this.notifications = await response.json();
  }

  async fetchEvents(type, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const dateStr = startDate.toISOString().split('T')[0];
    
    const url = `${this.apiBase}/${type}?startDate=${dateStr}&api_key=${this.apiKey}`;
    const response = await fetch(url);
    return await response.json();
  }

  displayAlerts() {
    // Mostrar alertas ativos com níveis de severidade
  }
}
```

### CSS
```css
.donki-section {
  background: linear-gradient(180deg, #1a0033 0%, #330066 100%);
  padding: 100px 0;
  color: white;
}

.alert-card {
  background: rgba(255, 255, 255, 0.05);
  border-left: 4px solid #ffc107;
  padding: 25px;
  border-radius: 12px;
  animation: pulse 2s ease-in-out infinite;
}

.alert-card.severe {
  border-left-color: #f44336;
  box-shadow: 0 0 30px rgba(244, 67, 54, 0.3);
}

.severity {
  display: inline-block;
  padding: 4px 12px;
  background: #f44336;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}
```

## Funcionalidades

### 1. Alertas em Tempo Real
- Buscar notificações a cada 30 min
- Classificar por severidade
- Badge visual pulsante

### 2. Timeline de Eventos
- Últimos 30 dias
- Filtrar por tipo
- Detalhes ao clicar

### 3. Estatísticas
- Contador de eventos
- Gráfico de tendência
- Próximos eventos previstos

### 4. Conexão com Terrestre
- Explicar impacto na Terra
- Aurora prevista
- Risco para satélites/GPS

## Níveis de Severidade

**Tempestades Geomagnéticas:**
- G1: Menor
- G2: Moderada
- G3: Forte ⚠️
- G4: Severa 🔴
- G5: Extrema 🚨

**Erupções Solares:**
- A, B, C: Pequenas
- M: Moderadas ⚠️
- X: Intensas 🔴

## Implementação

1. Criar `donki.js` e `donki.css`
2. Adicionar seção após EPIC
3. Fetch inicial ao carregar
4. Auto-refresh a cada 30min
5. Notificação de novos alertas
