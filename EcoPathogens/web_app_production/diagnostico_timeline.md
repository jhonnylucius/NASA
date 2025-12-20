# 📊 Diagn\u00f3stico da Timeline de 50 Anos

## Problema Identificado

**Timeline não aparece** - Controles (Play, Pause, Reset) visíveis mas gráfico vazio

![Timeline Vazia](C:/Users/lucia/.gemini/antigravity/brain/368ca196-1a9a-49e5-a4c2-88a0ab325de1/uploaded_image_1766201018351.png)

## Causa Raiz

### ❌ Evento 'dataLoaded' Nunca Dispara

**Linha 23-25 em [charts.js](file:///c:/projtos%20pessoais/NASA/EcoPathogens/web_app_production/frontend/public/assets/js/charts.js):**
```javascript
window.addEventListener('dataLoaded', (event) => {
    this.createAllCharts(event.detail);
});
```

O [ChartsManager](file:///c:/projtos%20pessoais/NASA/EcoPathogens/web_app_production/frontend/public/assets/js/charts.js#4-598) aguarda um evento `dataLoaded` que **nunca é disparado**, causando:
- ❌ [createAllCharts()](file:///c:/projtos%20pessoais/NASA/EcoPathogens/web_app_production/frontend/public/assets/js/charts.js#53-71) nunca é chamado
- ❌ [createTimelineChart()](file:///c:/projtos%20pessoais/NASA/EcoPathogens/web_app_production/frontend/public/assets/js/charts.js#235-298) nunca executa
- ❌ Gráfico fica vazio

## Estrutura Existente

### ✅ HTML Correto (index.html linha 328-344)

```html
<div class="timeline-controls">
    <div class="year-slider">
        <input type="range" id="year-range" min="1975" max="2025" value="2025" step="1">
        <div class="year-display">
            <span id="current-year">2025</span>
        </div>
    </div>
    <div class="timeline-buttons">
        <button class="btn btn-sm" id="play-timeline">▶️ Play</button>
        <button class="btn btn-sm" id="pause-timeline">⏸️ Pause</button>
        <button class="btn btn-sm" id="reset-timeline">🔄 Reset</button>
    </div>
</div>

<div class="timeline-visualization">
    <div id="timeline-chart"></div>  <!-- Container vazio -->
</div>
```

### ✅ Código JavaScript Existe

**[createTimelineChart()](file:///c:/projtos%20pessoais/NASA/EcoPathogens/web_app_production/frontend/public/assets/js/charts.js#235-298) existe em charts.js (linha 235):**
- Cria gráfico com 3 linhas (desmatamento, queimadas, temperatura)
- Usa Plotly.js
- Está corretamente implementado

**Mas nunca é chamado!**

## Solução

### Abordagem 1: Remover Dependência do Evento

Chamar [createAllCharts()](file:///c:/projtos%20pessoais/NASA/EcoPathogens/web_app_production/frontend/public/assets/js/charts.js#53-71) diretamente com dados mockados ou carregados

### Abordagem 2: Implementar Botões Play/Pause/Reset

Adicionar event listeners para os botões que **já existem no HTML**

### Abordagem 3: Garantir Evento dataLoaded

Verificar se [data-loader.js](file:///c:/projtos%20pessoais/NASA/EcoPathogens/web_app_production/frontend/public/assets/js/data-loader.js) dispara o evento corretamente

## Arquivos Envolvidos

1. ✅ **index.html** (linhas 318-404) - HTML correto
2. ❌ **charts.js** (linha 23-25) - Aguarda evento que não vem
3. ❓ **data-loader.js** - Precisa investigar se dispara evento
4. ❌ **Faltam** - Event listeners para Play/Pause/Reset

## Próximos Passos

1. Investigar [data-loader.js](file:///c:/projtos%20pessoais/NASA/EcoPathogens/web_app_production/frontend/public/assets/js/data-loader.js)
2. Adicionar fallback se evento não disparar
3. Implementar controles Play/Pause/Reset
4. Testar timeline com dados mock
