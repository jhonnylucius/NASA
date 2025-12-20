<div align="center">
  
# 🌳 EcoGuardians
### Sistema Avançado de Monitoramento Ambiental da Amazônia

[![NASA APIs](https://img.shields.io/badge/NASA-APIs-blue?style=for-the-badge&logo=nasa)](https://api.nasa.gov/)
[![GSAP](https://img.shields.io/badge/GSAP-Premium-88CE02?style=for-the-badge&logo=greensock)](https://greensock.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)

<img src="frontend\dev\assets\images\INDIGINAS7.jpg" alt="EcoGuardians Preview" width="600">

**Plataforma de monitoramento ambiental com 50 anos de dados históricos e inteligência artificial**

[🌐 Demo ao Vivo](https://www.ecoguardians.com.br/)

</div>

---

## 📋 Sobre o Projeto

O **EcoGuardians** é uma plataforma web completa para monitoramento ambiental da Amazônia, desenvolvida po Union Desenvolvimento de Softwares. O sistema integra múltiplas APIs da NASA para fornecer dados em tempo real sobre queimadas, desastres naturais, clima espacial e visualização da Terra do espaço.

### 🎯 Objetivos

- Democratizar o acesso a dados ambientais da Amazônia
- Visualizar 50 anos de dados históricos (1975-2025)
- Fornecer predições com Machine Learning
- Monitorar eventos naturais em tempo real
- Conscientizar sobre a preservação ambiental

---

## ✨ Funcionalidades

### 🗺️ Mapa Interativo da Amazônia
- Contorno real da Amazônia Legal (IBGE)
- Terras indígenas demarcadas
- Unidades de conservação
- Rios principais (Amazonas, Negro, Tapajós, Xingu)
- Zonas de desmatamento

### 🔥 FIRMS - Monitoramento de Queimadas
- Focos de incêndio em tempo real
- Múltiplos satélites: VIIRS NOAA-20/21, MODIS
- Intensidade (Fire Radiative Power)
- Filtros por período (24h, 48h, 7 dias)

### 🌍 EONET - Desastres Naturais
- 13 categorias de eventos (vulcões, tempestades, terremotos...)
- Mapa global interativo
- Filtros por tipo de desastre
- Estatísticas em tempo real

### 🌎 EPIC - Terra ao Vivo
- Imagens da Terra do espaço profundo
- Câmera DSCOVR a 1.5 milhões km
- Navegação por data
- Destaque da região amazônica

### 🌞 DONKI - Clima Espacial
- Erupções solares
- Tempestades geomagnéticas
- Ejeções de massa coronal
- Alertas em tempo real

### 🔮 Predições com IA
- 7 modelos de Machine Learning
- Previsões de desmatamento
- Projeções de queimadas
- Cenários para 2030

### 📸 Galeria de Impacto
- 128 imagens de desastres ambientais
- Categorização por tipo
- Modal com detalhes

---

## 🛠️ Tecnologias

### Frontend
| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilos e animações |
| **JavaScript ES6+** | Lógica e interatividade |
| **GSAP Premium** | Animações avançadas (45+ plugins) |
| **Leaflet.js** | Mapas interativos |
| **Chart.js** | Gráficos e visualizações |
| **Plotly.js** | Gráficos científicos |

### APIs NASA Integradas
| API | Descrição | Endpoint |
|-----|-----------|----------|
| **EPIC** | Earth Polychromatic Imaging Camera | `epic.gsfc.nasa.gov/api` |
| **FIRMS** | Fire Information for Resource Management | `firms.modaps.eosdis.nasa.gov/api` |
| **EONET** | Earth Observatory Natural Event Tracker | `eonet.gsfc.nasa.gov/api/v3` |
| **DONKI** | Space Weather Database | `api.nasa.gov/DONKI` |

### Outras APIs
| API | Descrição |
|-----|-----------|
| **Overpass API** | Dados OpenStreetMap |
| **IBGE** | Limites geográficos oficiais |
| **CartoDB** | Tiles de mapa |

### Plugins GSAP Premium
```
├── Core
│   └── gsap.min.js
├── Scroll
│   ├── ScrollTrigger
│   ├── ScrollSmoother
│   └── ScrollToPlugin
├── Animation
│   ├── MorphSVGPlugin
│   ├── DrawSVGPlugin
│   ├── SplitText
│   └── MotionPathPlugin
├── Physics
│   ├── Physics2DPlugin
│   ├── PhysicsPropsPlugin
│   ├── InertiaPlugin
│   └── Draggable
├── Effects
│   ├── CustomEase
│   ├── CustomBounce
│   ├── CustomWiggle
│   └── Flip
└── Text
    ├── TextPlugin
    └── ScrambleTextPlugin
```

---

## 📁 Estrutura do Projeto

```
EcoPathogens/
├── web_app_production/
│   └── frontend/
│       └── public/
│           ├── index.html          # Página principal
│           ├── assets/
│           │   ├── css/
│           │   │   ├── style.css       # Estilos principais
│           │   │   ├── animations.css  # Animações CSS
│           │   │   ├── firms.css       # Estilos FIRMS
│           │   │   ├── eonet.css       # Estilos EONET
│           │   │   ├── epic.css        # Estilos EPIC
│           │   │   ├── donki.css       # Estilos DONKI
│           │   │   └── responsive.css  # Media queries
│           │   ├── js/
│           │   │   ├── main.js         # Inicialização
│           │   │   ├── maps.js         # MapsManager
│           │   │   ├── firms.js        # FIRMSManager
│           │   │   ├── eonet.js        # EONETManager
│           │   │   ├── epic.js         # EPICViewer
│           │   │   ├── donki.js        # DONKIManager
│           │   │   ├── predictions.js  # Modelos de IA
│           │   │   ├── charts.js       # Gráficos
│           │   │   ├── gallery.js      # Galeria
│           │   │   ├── animations.js   # GSAP animations
│           │   │   └── gsap/           # 45+ GSAP plugins
│           │   └── images/             # 128+ imagens
│           └── data/                   # Dados JSON
└── README.md
```

---

## 🚀 Instalação

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge)
- Servidor HTTP local (opcional)

### Configuração

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/ecoguardians.git
cd ecoguardians
```

2. **Obtenha as API Keys** (opcional, algumas APIs são públicas)
   - FIRMS: [Registrar em firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/download/)
   - NASA API: [api.nasa.gov](https://api.nasa.gov/)

3. **Inicie um servidor local**
```bash
# Com Python
python -m http.server 8080

# Com Node.js
npx http-server -p 8080

# Com Live Server (VS Code)
```

4. **Acesse no navegador**
```
http://localhost:8080
```

---

## 📊 Dados e Métricas

### Dados Históricos (1975-2025)
| Métrica | Valor |
|---------|-------|
| Anos de análise | 50 |
| Área desmatada total | 758.470 km² |
| Focos de queimadas | 2.211.979 |
| Espécies catalogadas | 66.924 |
| Aumento de temperatura | +1.3°C |

### Cobertura Geográfica
- **Amazônia Legal**: 5.217.423 km² (61% do Brasil)
- **Estados**: 9 (AC, AM, AP, MA, MT, PA, RO, RR, TO)
- **Municípios**: 772

---

## 🎨 Screenshots

<details>
<summary>📸 Ver Screenshots</summary>

### Dashboard Principal
![Dashboard](frontend/public/assets/images/screenshot-dashboard.jpeg)

### Mapa de Queimadas (FIRMS)
![FIRMS](frontend/public/assets/images/screenshot-firms.jpeg)

### Desastres Naturais (EONET)
![EONET](frontend/public/assets/images/screenshot-eonet.jpeg)

### Terra ao Vivo (EPIC)
![EPIC](frontend/public/assets/images/screenshot-epic.jpeg)

</details>

---

## 🔧 Configuração de APIs

### FIRMS (Fire Information)
```javascript
// Em firms.js
this.mapKey = 'SUA_MAP_KEY_AQUI';
this.apiBase = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';
```

### EONET (Natural Events)
```javascript
// API pública, não requer chave
this.apiBase = 'https://eonet.gsfc.nasa.gov/api/v3';
```

### EPIC (Earth Imagery)
```javascript
// API pública, não requer chave
this.apiBase = 'https://epic.gsfc.nasa.gov/api';
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença GLP-3.0. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

**UNION Desenvolvimento de Softwares**

- 🌐 Website: [union.dev.br](https://union.dev.br)
- 💼 LinkedIn: [seu-linkedin](#)
- 📧 Email: contato@union.dev.br

---

## 🙏 Agradecimentos

- [NASA](https://www.nasa.gov/) - Dados e APIs
- [INPE](http://www.inpe.br/) - Dados de desmatamento
- [IBGE](https://www.ibge.gov.br/) - Dados geográficos
- [OpenStreetMap](https://www.openstreetmap.org/) - Mapas base
- [GSAP](https://greensock.com/) - Animações premium

---

<div align="center">

**Desenvolvido com 💚 para proteger a Amazônia**

[![Amazônia](https://img.shields.io/badge/🌳-Proteja_a_Amazônia-228B22?style=for-the-badge)](#)

© 2025 EcoGuardians | UNION Desenvolvimento de Softwares

</div>
