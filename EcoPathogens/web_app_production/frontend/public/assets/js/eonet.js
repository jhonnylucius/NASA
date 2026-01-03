// 🌍 NASA EONET - Earth Observatory Natural Event Tracker
// Sistema de rastreamento de desastres naturais em tempo real

class EONETManager {
    constructor() {
        // API Configuration
        // API Configuration
        this.apiBase = 'https://eonet.gsfc.nasa.gov/api/v3';
        // this.apiBase = 'http://83.147.37.100:8081/api/nasa/eonet'; // VPS Java Proxy



        // Event categories with icons and colors
        this.categories = {
            'wildfires': { icon: '🔥', name: 'Incêndios', color: '#ff4500', gradient: 'linear-gradient(135deg, #ff4500, #ff8c00)' },
            'volcanoes': { icon: '🌋', name: 'Vulcões', color: '#dc143c', gradient: 'linear-gradient(135deg, #dc143c, #ff4500)' },
            'severeStorms': { icon: '🌀', name: 'Tempestades', color: '#4169e1', gradient: 'linear-gradient(135deg, #4169e1, #00bfff)' },
            'earthquakes': { icon: '🌍', name: 'Terremotos', color: '#8b4513', gradient: 'linear-gradient(135deg, #8b4513, #cd853f)' },
            'floods': { icon: '🌊', name: 'Inundações', color: '#1e90ff', gradient: 'linear-gradient(135deg, #1e90ff, #00ced1)' },
            'landslides': { icon: '⛰️', name: 'Deslizamentos', color: '#a0522d', gradient: 'linear-gradient(135deg, #a0522d, #d2691e)' },
            'drought': { icon: '☀️', name: 'Secas', color: '#ffa500', gradient: 'linear-gradient(135deg, #ffa500, #ffcc00)' },
            'dustHaze': { icon: '💨', name: 'Poeira', color: '#daa520', gradient: 'linear-gradient(135deg, #daa520, #f4a460)' },
            'seaLakeIce': { icon: '🧊', name: 'Gelo', color: '#00ced1', gradient: 'linear-gradient(135deg, #00ced1, #87ceeb)' },
            'snow': { icon: '❄️', name: 'Nevascas', color: '#add8e6', gradient: 'linear-gradient(135deg, #add8e6, #ffffff)' },
            'tempExtremes': { icon: '🌡️', name: 'Extremos', color: '#ff6347', gradient: 'linear-gradient(135deg, #ff6347, #ffcc00)' },
            'waterColor': { icon: '🦠', name: 'Maré Vermelha', color: '#20b2aa', gradient: 'linear-gradient(135deg, #20b2aa, #3cb371)' },
            'manmade': { icon: '🏭', name: 'Desastres Humanos', color: '#696969', gradient: 'linear-gradient(135deg, #696969, #a9a9a9)' }
        };

        // State
        this.map = null;
        this.events = [];
        this.markers = [];
        this.selectedCategory = 'all';
        this.isLoading = false;

        // DOM Elements
        this.mapElement = document.getElementById('eonet-map');
        this.eventsContainer = document.getElementById('eonet-events');
        this.loadingElement = document.getElementById('eonet-loading');

        this.init();
    }

    init() {
        console.log('🌍 Inicializando EONET Manager...');

        if (!this.mapElement) {
            console.warn('⚠️ Elemento #eonet-map não encontrado');
            return;
        }

        if (typeof L === 'undefined') {
            console.error('❌ Leaflet não está carregado');
            return;
        }

        this.initializeMap();
        this.setupControls();
        this.loadEvents();
        this.setupGSAPAnimations();
    }

    initializeMap() {
        // Centro global
        const worldCenter = [20, 0];

        this.map = L.map('eonet-map', {
            center: worldCenter,
            zoom: 2,
            minZoom: 2,
            maxZoom: 12,
            worldCopyJump: true
        });

        // Dark themed map
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | NASA EONET',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        console.log('🗺️ Mapa EONET inicializado');
    }

    setupControls() {
        // Category filter buttons
        const categoryBtns = document.querySelectorAll('.eonet-category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterByCategory(category);

                // Update active state
                categoryBtns.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('eonet-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadEvents());
        }

        // Focus buttons
        const focusBrazilBtn = document.getElementById('eonet-focus-brazil');
        if (focusBrazilBtn) {
            focusBrazilBtn.addEventListener('click', () => {
                this.map.setView([-14.235, -51.925], 4);
            });
        }

        const focusWorldBtn = document.getElementById('eonet-focus-world');
        if (focusWorldBtn) {
            focusWorldBtn.addEventListener('click', () => {
                this.map.setView([20, 0], 2);
            });
        }

        console.log('🎮 Controles EONET configurados');
    }

    setupGSAPAnimations() {
        // Check if GSAP is available
        if (typeof gsap === 'undefined') {
            console.warn('⚠️ GSAP não encontrado');
            return;
        }

        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        console.log('✨ GSAP configurado para animações');
    }

    async loadEvents() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoading(true);

        console.log('📡 Buscando eventos EONET...');

        try {
            // Fetch all events (limit to recent ones)
            const response = await fetch(`${this.apiBase}/events?status=open&limit=100`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // NASA EONET API returns {events: [...]} structure
            const data = await response.json();
            // Extract events array from response
            this.events = data.events || [];


            console.log(`✅ ${this.events.length} eventos carregados`);

            this.renderMarkers();
            this.renderEventCards();
            this.updateStatistics();
            this.animateCards();

        } catch (error) {
            console.error('❌ Erro ao carregar eventos EONET:', error);
            this.showError('Erro ao carregar eventos naturais');
        } finally {
            this.isLoading = false;
            this.showLoading(false);
        }
    }

    renderMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        const filteredEvents = this.getFilteredEvents();

        filteredEvents.forEach(event => {
            if (!event.geometry || event.geometry.length === 0) return;

            const geometry = event.geometry[event.geometry.length - 1]; // Most recent location
            const categoryId = event.categories[0]?.id || 'unknown';
            const category = this.categories[categoryId] || { icon: '📍', color: '#ffffff' };

            let coordinates;
            if (geometry.type === 'Point') {
                coordinates = [geometry.coordinates[1], geometry.coordinates[0]];
            } else if (geometry.type === 'Polygon') {
                // Get centroid
                const coords = geometry.coordinates[0];
                const lat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
                const lon = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
                coordinates = [lat, lon];
            } else {
                return;
            }

            // Create custom icon
            const icon = L.divIcon({
                className: 'eonet-marker',
                html: `<div class="eonet-marker-icon" style="background: ${category.gradient};">
                    <span>${category.icon}</span>
                </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            const marker = L.marker(coordinates, { icon: icon });
            marker.bindPopup(this.createEventPopup(event));
            marker.addTo(this.map);

            this.markers.push(marker);
        });

        console.log(`📍 ${this.markers.length} marcadores renderizados`);
    }

    createEventPopup(event) {
        const categoryId = event.categories[0]?.id || 'unknown';
        const category = this.categories[categoryId] || { icon: '📍', name: 'Evento', color: '#ffffff' };
        const date = event.geometry[event.geometry.length - 1]?.date || 'N/A';
        const sources = event.sources.map(s => s.id).join(', ');

        return `
            <div class="eonet-popup">
                <div class="eonet-popup-header" style="background: ${category.gradient};">
                    <span class="eonet-popup-icon">${category.icon}</span>
                    <span class="eonet-popup-type">${category.name}</span>
                </div>
                <div class="eonet-popup-content">
                    <h3>${event.title}</h3>
                    <div class="eonet-popup-info">
                        <p><strong>📅 Data:</strong> ${new Date(date).toLocaleDateString('pt-BR')}</p>
                        <p><strong>🔗 ID:</strong> ${event.id}</p>
                        <p><strong>📡 Fontes:</strong> ${sources || 'N/A'}</p>
                    </div>
                    <a href="${event.link}" target="_blank" class="eonet-popup-link">
                        Ver detalhes na NASA →
                    </a>
                </div>
            </div>
        `;
    }

    renderEventCards() {
        if (!this.eventsContainer) return;

        const filteredEvents = this.getFilteredEvents();

        // Group events by category
        const grouped = {};
        filteredEvents.forEach(event => {
            const catId = event.categories[0]?.id || 'unknown';
            if (!grouped[catId]) grouped[catId] = [];
            grouped[catId].push(event);
        });

        let html = '';

        // Render category sections
        Object.entries(grouped).forEach(([catId, events]) => {
            const category = this.categories[catId] || { icon: '📍', name: catId, color: '#fff' };

            html += `
                <div class="eonet-category-group" data-category="${catId}">
                    <div class="eonet-category-header" style="background: ${category.gradient};">
                        <span class="icon">${category.icon}</span>
                        <span class="name">${category.name}</span>
                        <span class="count">${events.length}</span>
                    </div>
                    <div class="eonet-events-list">
                        ${events.slice(0, 5).map(event => this.createEventCard(event)).join('')}
                    </div>
                </div>
            `;
        });

        if (html === '') {
            html = '<div class="eonet-no-events">Nenhum evento encontrado</div>';
        }

        this.eventsContainer.innerHTML = html;

        // Add click handlers
        this.eventsContainer.querySelectorAll('.eonet-event-card').forEach(card => {
            card.addEventListener('click', () => {
                const lat = parseFloat(card.dataset.lat);
                const lon = parseFloat(card.dataset.lon);
                if (!isNaN(lat) && !isNaN(lon)) {
                    this.map.setView([lat, lon], 8);
                }
            });
        });
    }

    createEventCard(event) {
        const categoryId = event.categories[0]?.id || 'unknown';
        const category = this.categories[categoryId] || { icon: '📍', color: '#ffffff' };
        const geometry = event.geometry[event.geometry.length - 1];
        const date = geometry?.date ? new Date(geometry.date).toLocaleDateString('pt-BR') : 'N/A';

        let lat = 0, lon = 0;
        if (geometry?.type === 'Point') {
            lat = geometry.coordinates[1];
            lon = geometry.coordinates[0];
        }

        return `
            <div class="eonet-event-card" data-lat="${lat}" data-lon="${lon}">
                <div class="eonet-event-icon" style="background: ${category.color};">${category.icon}</div>
                <div class="eonet-event-info">
                    <h4>${event.title}</h4>
                    <span class="date">${date}</span>
                </div>
                <div class="eonet-event-arrow">→</div>
            </div>
        `;
    }

    getFilteredEvents() {
        if (this.selectedCategory === 'all') {
            return this.events;
        }
        return this.events.filter(event =>
            event.categories.some(cat => cat.id === this.selectedCategory)
        );
    }

    filterByCategory(category) {
        this.selectedCategory = category;
        this.renderMarkers();
        this.renderEventCards();
        this.updateStatistics();

        // Animate filter transition
        if (typeof gsap !== 'undefined') {
            gsap.from('#eonet-events .eonet-event-card', {
                opacity: 0,
                y: 20,
                stagger: 0.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }

    updateStatistics() {
        const filteredEvents = this.getFilteredEvents();

        // Total events
        const totalEl = document.getElementById('eonet-total-events');
        if (totalEl) {
            this.animateNumber(totalEl, filteredEvents.length);
        }

        // Count by category
        const categoryCounts = {};
        this.events.forEach(event => {
            const catId = event.categories[0]?.id;
            categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
        });

        // Update category stat cards
        Object.entries(categoryCounts).forEach(([catId, count]) => {
            const el = document.getElementById(`eonet-count-${catId}`);
            if (el) {
                this.animateNumber(el, count);
            }
        });

        // Wildfires count
        const wildfiresEl = document.getElementById('eonet-wildfires-count');
        if (wildfiresEl) {
            this.animateNumber(wildfiresEl, categoryCounts['wildfires'] || 0);
        }

        // Storms count
        const stormsEl = document.getElementById('eonet-storms-count');
        if (stormsEl) {
            this.animateNumber(stormsEl, categoryCounts['severeStorms'] || 0);
        }

        // Volcanoes count
        const volcanoesEl = document.getElementById('eonet-volcanoes-count');
        if (volcanoesEl) {
            this.animateNumber(volcanoesEl, categoryCounts['volcanoes'] || 0);
        }

        // Last update time
        const lastUpdatedEl = document.getElementById('eonet-last-updated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = new Date().toLocaleTimeString('pt-BR');
        }

        console.log('📊 Estatísticas atualizadas');
    }

    animateCards() {
        if (typeof gsap === 'undefined') return;

        // Animate category cards entrance
        gsap.from('.eonet-category-group', {
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Animate stat cards
        gsap.from('.eonet-stat-card', {
            opacity: 0,
            scale: 0.9,
            stagger: 0.1,
            duration: 0.4,
            ease: 'back.out(1.7)'
        });
    }

    animateNumber(element, target) {
        if (typeof gsap !== 'undefined') {
            gsap.to(element, {
                textContent: target,
                duration: 1,
                snap: { textContent: 1 },
                ease: 'power2.out'
            });
        } else {
            element.textContent = target;
        }
    }

    showLoading(show) {
        if (this.loadingElement) {
            this.loadingElement.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message) {
        console.error('❌ EONET Error:', message);
    }

    // Public methods
    refresh() {
        this.loadEvents();
    }

    focusOnEvent(lat, lon) {
        this.map.setView([lat, lon], 10);
    }

    getEventsByCategory(categoryId) {
        return this.events.filter(e => e.categories.some(c => c.id === categoryId));
    }

    getStats() {
        const stats = {
            total: this.events.length,
            byCategory: {}
        };

        this.events.forEach(event => {
            const catId = event.categories[0]?.id;
            stats.byCategory[catId] = (stats.byCategory[catId] || 0) + 1;
        });

        return stats;
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.eonetManager = new EONETManager();
    }, 200);
});
