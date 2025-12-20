// 🌞 NASA DONKI Viewer - Clima Espacial
// Monitora eventos de clima espacial que afetam a Terra

class DONKIViewer {
    constructor() {
        this.apiBase = 'https://api.nasa.gov/DONKI';
        this.apiKey = 'L7dUAuSkdGYzKofnh2TqZ9PIWbbZnF64soPkEDAh';
        this.notifications = [];
        this.solarFlares = [];
        this.geomagneticStorms = [];
        this.cmes = [];

        this.init();
    }

    async init() {
        console.log('🌞 Inicializando DONKI Viewer...');

        try {
            await this.fetchAllEvents();
            this.displayAlerts();
            this.displayTimeline();
            this.displayStats();

            // Auto-refresh a cada 30 minutos
            setInterval(() => this.refresh(), 30 * 60 * 1000);
        } catch (error) {
            console.error('❌ Erro ao carregar DONKI:', error);
        }
    }

    async fetchAllEvents() {
        const startDate = this.getStartDate(30); // Últimos 30 dias

        try {
            console.log('📡 Buscando eventos DONKI...');

            // Buscar em paralelo
            const [notifications, flares, storms, cmes] = await Promise.all([
                this.fetchNotifications(),
                this.fetchSolarFlares(startDate),
                this.fetchGeomagneticStorms(startDate),
                this.fetchCMEs(startDate)
            ]);

            this.notifications = notifications || [];
            this.solarFlares = flares || [];
            this.geomagneticStorms = storms || [];
            this.cmes = cmes || [];

            console.log(`✅ ${this.notifications.length} notificações, ${this.solarFlares.length} erupções, ${this.geomagneticStorms.length} tempestades`);
        } catch (error) {
            console.error('❌ Erro ao buscar eventos:', error);
        }
    }

    async fetchNotifications() {
        try {
            const response = await fetch(`${this.apiBase}/notifications?api_key=${this.apiKey}`);
            if (!response.ok) throw new Error('Erro ao buscar notificações');
            return await response.json();
        } catch (error) {
            console.error('Erro notifications:', error);
            return [];
        }
    }

    async fetchSolarFlares(startDate) {
        try {
            const response = await fetch(`${this.apiBase}/FLR?startDate=${startDate}&api_key=${this.apiKey}`);
            if (!response.ok) throw new Error('Erro ao buscar erupções');
            return await response.json();
        } catch (error) {
            console.error('Erro FLR:', error);
            return [];
        }
    }

    async fetchGeomagneticStorms(startDate) {
        try {
            const response = await fetch(`${this.apiBase}/GST?startDate=${startDate}&api_key=${this.apiKey}`);
            if (!response.ok) throw new Error('Erro ao buscar tempestades');
            return await response.json();
        } catch (error) {
            console.error('Erro GST:', error);
            return [];
        }
    }

    async fetchCMEs(startDate) {
        try {
            const response = await fetch(`${this.apiBase}/CME?startDate=${startDate}&api_key=${this.apiKey}`);
            if (!response.ok) throw new Error('Erro ao buscar CMEs');
            return await response.json();
        } catch (error) {
            console.error('Erro CME:', error);
            return [];
        }
    }

    getStartDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split('T')[0];
    }

    displayAlerts() {
        const container = document.getElementById('donki-alerts');
        if (!container) return;

        container.innerHTML = '';

        // Alertas de tempestades geomagnéticas ativas
        const activeStorms = this.geomagneticStorms.slice(0, 3);

        if (activeStorms.length === 0) {
            container.innerHTML = '<div class="no-alerts">✅ Nenhum alerta ativo no momento</div>';
            return;
        }

        activeStorms.forEach(storm => {
            const severity = this.getStormSeverity(storm);
            const card = document.createElement('div');
            card.className = `alert-card ${severity.class}`;
            card.innerHTML = `
                <div class="alert-icon">⚡</div>
                <div class="alert-content">
                    <h3>Tempestade Geomagnética</h3>
                    <span class="severity-badge ${severity.class}">${severity.label}</span>
                    <p>${storm.linkedEvents ? storm.linkedEvents.length + ' eventos relacionados' : 'Monitoramento ativo'}</p>
                    <span class="alert-time">${this.formatDate(storm.startTime)}</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    displayTimeline() {
        const container = document.getElementById('donki-timeline');
        if (!container) return;

        container.innerHTML = '';

        // Combinar todos eventos e ordenar por data
        const allEvents = [
            ...this.solarFlares.map(e => ({ ...e, type: 'flare' })),
            ...this.geomagneticStorms.map(e => ({ ...e, type: 'storm' })),
            ...this.cmes.map(e => ({ ...e, type: 'cme' }))
        ].sort((a, b) => new Date(b.startTime || b.beginTime) - new Date(a.startTime || a.beginTime));

        // Mostrar últimos 10 eventos
        allEvents.slice(0, 10).forEach(event => {
            const eventCard = this.createEventCard(event);
            container.appendChild(eventCard);
        });
    }

    createEventCard(event) {
        const card = document.createElement('div');
        card.className = `event-card event-${event.type}`;

        const icon = {
            'flare': '☀️',
            'storm': '⚡',
            'cme': '🌊'
        }[event.type];

        const title = {
            'flare': 'Erupção Solar',
            'storm': 'Tempestade Geomagnética',
            'cme': 'Ejeção de Massa Coronal'
        }[event.type];

        const time = event.startTime || event.beginTime || 'Data desconhecida';
        const classType = event.classType || event.kpIndex || 'N/A';

        card.innerHTML = `
            <div class="event-icon">${icon}</div>
            <div class="event-info">
                <h4>${title}</h4>
                <span class="event-class">${classType}</span>
                <span class="event-time">${this.formatDate(time)}</span>
            </div>
        `;

        return card;
    }

    displayStats() {
        // Contador de erupções
        const flaresEl = document.getElementById('donki-flares-count');
        if (flaresEl) flaresEl.textContent = this.solarFlares.length;

        // Contador de tempestades
        const stormsEl = document.getElementById('donki-storms-count');
        if (stormsEl) stormsEl.textContent = this.geomagneticStorms.length;

        // Contador de CMEs
        const cmesEl = document.getElementById('donki-cmes-count');
        if (cmesEl) cmesEl.textContent = this.cmes.length;

        // Total de eventos
        const totalEl = document.getElementById('donki-total-count');
        if (totalEl) {
            totalEl.textContent = this.solarFlares.length + this.geomagneticStorms.length + this.cmes.length;
        }
    }

    getStormSeverity(storm) {
        const kp = storm.allKpIndex ? Math.max(...storm.allKpIndex.map(k => k.kpIndex)) : 0;

        if (kp >= 8) return { class: 'extreme', label: 'EXTREMA G5' };
        if (kp >= 7) return { class: 'severe', label: 'SEVERA G4' };
        if (kp >= 6) return { class: 'strong', label: 'FORTE G3' };
        if (kp >= 5) return { class: 'moderate', label: 'MODERADA G2' };
        return { class: 'minor', label: 'MENOR G1' };
    }

    formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    }

    async refresh() {
        console.log('🔄 Atualizando DONKI...');
        await this.fetchAllEvents();
        this.displayAlerts();
        this.displayTimeline();
        this.displayStats();
    }
}

// Inicializar quando DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
    window.donkiViewer = new DONKIViewer();
});
