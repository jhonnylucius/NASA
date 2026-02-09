/**
 * 🌍 EARTHDATA NEXUS CORE SYSTEM v2.0
 * NOW WITH REAL DATA ACCESS:
 * - FIRMS Fire Hotspots (using Earthdata Token)
 * - GIBS Satellite Imagery
 * - Brazil-focused visualizations
 */

class EarthdataNexus {
    constructor() {
        // Configuration
        this.baseUrl = window.EcoConfig?.API_BASE_URL || 'http://localhost:5000';
        // FIRMS now proxied via Java Backend
        this.firmsUrl = `${this.baseUrl}/api/nasa/proxy/firms`;
        // GIBS stays direct as it supports CORS for images
        this.gibsUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best';
        this.token = null;

        // Brazil bounding box [west, south, east, north]
        this.brazilBounds = '-74,-34,-34,6';

        // DOM Elements
        this.dom = {
            status: document.getElementById('connection-status'),
            userUid: document.getElementById('user-uid'),
            userAvatar: document.getElementById('user-avatar'),
            tokenExp: document.getElementById('token-exp'),
            searchInput: document.getElementById('cmr-search-input'),
            searchBtn: document.getElementById('cmr-search-btn'),
            queryLog: document.getElementById('query-log'),
            resultsContainer: document.getElementById('results-container'),
            resultsCount: document.getElementById('results-count'),
            rawTokenPreview: document.getElementById('raw-token-preview')
        };

        this.fireData = [];
        this.init();
    }

    init() {
        this.log('> INITIALIZING REAL DATA ACCESS PROTOCOL...');

        // 1. Load Token
        this.loadToken();

        // 2. Bind Events - NOW WITH REAL DATA ACTIONS
        this.dom.searchBtn.addEventListener('click', () => {
            const query = this.dom.searchInput.value;
            if (query && query.length > 2) {
                this.searchGranules(query);
            } else {
                this.loadFireData();
            }
        });

        // Update filter chips to real data queries
        document.querySelectorAll('.filter-chip').forEach((chip, index) => {
            const actions = [
                { label: '🔥 FIRES NOW', action: () => this.loadFireData() },
                { label: '🛰️ SATELLITE IMG', action: () => this.showSatelliteImagery() },
                { label: '📊 FIRE STATS', action: () => this.showFireStats() },
                { label: '🗺️ BRAZIL HEATMAP', action: () => this.renderFireMap() }
            ];

            if (actions[index]) {
                chip.textContent = actions[index].label;
                chip.onclick = actions[index].action;
            }
        });

        this.dom.searchInput.placeholder = "TYPE 'FIRE' TO LOAD REAL BRAZIL FIRE DATA...";

        // 3. UI Animations
        this.animateIntro();

        // 4. Auto-load fire data after 2 seconds
        setTimeout(() => {
            this.log('> AUTO-LOADING BRAZIL FIRE DATA...');
            this.loadFireData();
        }, 2000);
    }

    loadToken() {
        const providedToken = "eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Imx1Y2lhbm9yaWJlaXJvIiwiZXhwIjoxNzc1NDcyMDE5LCJpYXQiOjE3NzAyODgwMTksImlzcyI6Imh0dHBzOi8vdXJzLmVhcnRoZGF0YS5uYXNhLmdvdiIsImlkZW50aXR5X3Byb3ZpZGVyIjoiZWRsX29wcyIsImFjciI6ImVkbCIsImFzc3VyYW5jZV9sZXZlbCI6M30.iL9UKxTGwVs0JXmKVXth7c5IXRAnsb36SV278IHXhLlkz3EnoWjch3TihPtKcFThXRM48tOYDUcAbaGYpryddki81OCpny8zbxu1p_ctl65o7pA1SqBnUuQQdQJqSzvCpRilHKFvXoGLInoFuRH_kd3ZURvM5rEQkHLu0U2KlEfSCNa-J-q0-9Jh6TkIR5ZZhT_mZsxnty8VDFE5SzW8HZOMpQ3IC4ZbWOp65oOPz03JDl3mi415hnEGftJgzu8UtwcA08e1c5hh3_f9XckWg5tWXqR3uZ6iaP7p9azr9xN78m0BMHmXmxexMwYBQS03boEdD0_wOroyw6zDabReLA";

        this.token = providedToken;
        this.log('> TOKEN LOADED. EARTHDATA ACCESS GRANTED.');
        this.parseAndVisualizeToken();

        this.dom.status.innerText = "AUTHENTICATING...";
        setTimeout(() => {
            this.dom.status.style.color = "#00ff00";
            this.dom.status.innerText = "LIVE DATA STREAM ACTIVE";
            this.dom.status.classList.add('pulse');
        }, 1500);
    }

    parseAndVisualizeToken() {
        try {
            const parts = this.token.split('.');
            if (parts.length !== 3) throw new Error("Invalid Token Structure");

            const payload = JSON.parse(atob(parts[1]));
            console.log("Token Payload:", payload);

            this.dom.userUid.innerText = payload.uid.toUpperCase();
            this.dom.userUid.classList.remove('typing-effect');

            const expDate = new Date(payload.exp * 1000);
            this.dom.tokenExp.innerText = expDate.toLocaleDateString();
            this.dom.userAvatar.src = `https://ui-avatars.com/api/?name=${payload.uid}&background=0b0f19&color=00f3ff&font-size=0.33`;

            this.log(`> OPERATIVE: ${payload.uid}`);
            this.log(`> CLEARANCE LEVEL: ${payload.assurance_level}`);
            this.dom.rawTokenPreview.innerText = this.token.substring(0, 50) + "...";

        } catch (e) {
            console.error(e);
            this.log('> TOKEN VALIDATION FAILED.');
            this.dom.status.innerText = "ACCESS DENIED";
            this.dom.status.style.color = "red";
        }
    }

    // 🔥 REAL FEATURE 1: Load actual fire data from FIRMS
    async loadFireData() {
        this.log('> CONNECTING TO FIRMS SATELLITE NETWORK...');
        this.dom.resultsContainer.innerHTML = '<div class="loading-scanner">DOWNLOADING FIRE HOTSPOT DATA...</div>';
        this.dom.searchBtn.disabled = true;

        try {
            // Proxy call to Java Backend (handles Auth and CORS)
            const url = this.firmsUrl; // /api/nasa/proxy/firms

            this.log('> REQUESTING VIIRS DATA FOR BRAZIL...');
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                const response2 = await fetch(url);
                if (!response2.ok) throw new Error(`FIRMS ERROR: ${response2.statusText}`);
                const csvText = await response2.text();
                this.fireData = this.parseFireCSV(csvText);
            } else {
                const csvText = await response.text();
                this.fireData = this.parseFireCSV(csvText);
            }

            this.log(`> SUCCESS! ${this.fireData.length} ACTIVE FIRES DETECTED.`);
            this.renderFireData();

        } catch (error) {
            this.log(`> CRITICAL ERROR: ${error.message}`);
            this.dom.resultsContainer.innerHTML = `<div class="error-msg">DATA ACQUISITION FAILED: ${error.message}</div>`;
        } finally {
            this.dom.searchBtn.disabled = false;
        }
    }

    parseFireCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',');
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const row = {};

            headers.forEach((header, index) => {
                row[header.trim()] = values[index]?.trim();
            });

            if (row.latitude && row.longitude) {
                row.lat = parseFloat(row.latitude);
                row.lon = parseFloat(row.longitude);
                row.frp = parseFloat(row.frp) || 0;
                row.bright_ti4 = parseFloat(row.bright_ti4) || 0;
                data.push(row);
            }
        }

        return data;
    }

    renderFireData() {
        this.dom.resultsContainer.innerHTML = '';
        this.dom.resultsCount.innerText = `${this.fireData.length} FIRE HOTSPOTS`;

        if (this.fireData.length === 0) {
            this.dom.resultsContainer.innerHTML = '<div class="empty-state">✅ NO ACTIVE FIRES DETECTED (GOOD NEWS!)</div>';
            return;
        }

        const topFires = this.fireData
            .sort((a, b) => b.frp - a.frp)
            .slice(0, 20);

        let delay = 0;
        topFires.forEach(fire => {
            const card = document.createElement('div');
            card.className = 'nexus-card fire-card';
            card.style.animationDelay = `${delay}ms`;

            const intensity = this.getFireIntensity(fire.frp);
            const acqDate = fire.acq_date || 'Unknown';
            const acqTime = fire.acq_time || '';

            card.innerHTML = `
                <div class="card-header">
                    <span class="dataset-id">LAT: ${fire.lat.toFixed(3)}° LON: ${fire.lon.toFixed(3)}°</span>
                    <span class="fire-intensity ${intensity.class}">${intensity.label}</span>
                </div>
                <h4 class="dataset-title">🔥 Fire Radiative Power: ${fire.frp.toFixed(1)} MW</h4>
                <p class="dataset-summary">
                    📅 Detected: ${acqDate} ${acqTime}<br>
                    🌡️ Brightness: ${fire.bright_ti4}K<br>
                    🛰️ Satellite: VIIRS (NOAA-20)
                </p>
                <div class="card-actions">
                    <a href="https://www.google.com/maps?q=${fire.lat},${fire.lon}" target="_blank" class="action-btn">VIEW ON MAP</a>
                </div>
            `;

            this.dom.resultsContainer.appendChild(card);
            delay += 50;
        });
    }

    getFireIntensity(frp) {
        if (frp > 100) return { class: 'extreme', label: 'EXTREME' };
        if (frp > 50) return { class: 'high', label: 'HIGH' };
        if (frp > 20) return { class: 'moderate', label: 'MODERATE' };
        return { class: 'low', label: 'LOW' };
    }

    showSatelliteImagery() {
        this.log('> LOADING GIBS SATELLITE IMAGERY...');
        this.dom.resultsContainer.innerHTML = `
            <div class="satellite-viewer">
                <h3>🛰️ REAL-TIME SATELLITE IMAGERY</h3>
                <p>Source: NASA GIBS (Global Imagery Browse Services)</p>
                <img src="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/2025-02-05/250m/5/15/10.jpg" 
                     alt="VIIRS True Color"
                     style="width: 100%; border: 1px solid var(--nexus-primary); margin-top: 10px;">
                <p style="margin-top: 10px; font-size: 0.8rem; color: #888;">
                    📍 Region: South America<br>
                    🛰️ Instrument: VIIRS<br>
                    📅 Latest available imagery
                </p>
                <div class="card-actions" style="margin-top: 15px;">
                    <a href="https://worldview.earthdata.nasa.gov/" target="_blank" class="action-btn">OPEN NASA WORLDVIEW</a>
                </div>
            </div>
        `;
        this.dom.resultsCount.innerText = 'IMAGERY LOADED';
    }

    showFireStats() {
        if (this.fireData.length === 0) {
            this.log('> NO FIRE DATA LOADED. FETCHING...');
            this.loadFireData();
            return;
        }

        const totalFires = this.fireData.length;
        const avgFRP = (this.fireData.reduce((sum, f) => sum + f.frp, 0) / totalFires).toFixed(1);
        const maxFRP = Math.max(...this.fireData.map(f => f.frp)).toFixed(1);

        this.log('> GENERATING FIRE STATISTICS...');
        this.dom.resultsContainer.innerHTML = `
            <div class="stats-panel">
                <h3>📊 BRAZIL FIRE ANALYSIS (24H)</h3>
                <div class="stat-grid">
                    <div class="stat-box">
                        <div class="stat-label">TOTAL HOTSPOTS</div>
                        <div class="stat-value">${totalFires}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">AVG POWER (MW)</div>
                        <div class="stat-value">${avgFRP}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">MAX POWER (MW)</div>
                        <div class="stat-value">${maxFRP}</div>
                    </div>
                </div>
                <p style="margin-top: 20px; color: #aaa; font-size: 0.9rem;">
                    Data Source: FIRMS<br>
                    Satellite: VIIRS NOAA-20 | Real-time NRT feed
                </p>
            </div>
        `;
        this.dom.resultsCount.innerText = 'STATS GENERATED';
    }

    renderFireMap() {
        this.log('> RENDERING FIRE HEATMAP...');
        this.dom.resultsContainer.innerHTML = `
            <div class="map-placeholder">
                <h3>🗺️ FIRE HEATMAP (Conceptual)</h3>
                <p>To implement: Integrate Leaflet.js + GIBS tiles + Fire markers</p>
                <div style="background: #000; padding: 40px; text-align: center; border: 1px solid var(--nexus-primary); margin-top: 10px;">
                    <p style="color: #0ff;">🔥 ${this.fireData.length} hotspots would be plotted here.</p>
                    <p style="color: #888; font-size: 0.8rem; margin-top: 10px;">
                        Recommendation: Add Leaflet.js library to visualize fires on an interactive map.
                    </p>
                </div>
                <div class="card-actions" style="margin-top: 15px;">
                    <button class="action-btn" onclick="window.nexusSystem.showFireStats()">VIEW STATISTICS</button>
                </div>
            </div>
        `;
        this.dom.resultsCount.innerText = 'MAP READY';
    }

    // 🔥 NEW: CMR Search via Proxy
    async searchGranules(keyword) {
        this.log(`> SEARCHING NASA CMR FOR: ${keyword}...`);
        this.dom.resultsContainer.innerHTML = '<div class="loading-scanner">SEARCHING EARTHDATA CLOUD...</div>';

        try {
            const url = `${this.baseUrl}/api/nasa/proxy/cmr?keyword=${encodeURIComponent(keyword)}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error(`CMR ERROR: ${response.statusText}`);

            const data = await response.json();
            this.log(`> FOUND ${data.feed.entry.length} GRANULES.`);
            this.renderGranules(data.feed.entry);

        } catch (error) {
            this.log(`> SEARCH ERROR: ${error.message}`);
            this.dom.resultsContainer.innerHTML = `<div class="error-msg">SEARCH FAILED: ${error.message}</div>`;
        }
    }

    renderGranules(entries) {
        this.dom.resultsContainer.innerHTML = '';
        this.dom.resultsCount.innerText = `${entries.length} RESULTS`;

        if (entries.length === 0) {
            this.dom.resultsContainer.innerHTML = '<div class="empty-state">NO DATA FOUND</div>';
            return;
        }

        let delay = 0;
        entries.slice(0, 20).forEach(entry => {
            const card = document.createElement('div');
            card.className = 'nexus-card';
            card.style.animationDelay = `${delay}ms`;

            const title = entry.title;
            const start = entry.time_start.split('T')[0];
            const size = (parseFloat(entry.granule_size || 0)).toFixed(2) + ' MB';
            const browse = entry.links.find(l => l.rel.includes('browse'))?.href || '';
            const download = entry.links.find(l => l.rel.includes('data'))?.href || '#';

            card.innerHTML = `
                <div class="card-header">
                    <span class="dataset-id">ID: ${entry.id.substring(0, 15)}...</span>
                     <span class="fire-intensity low">${size}</span>
                </div>
                ${browse ? `<img src="${browse}" style="width:100%; height:120px; object-fit:cover; margin: 5px 0; border: 1px solid #00f3ff;">` : ''}
                <h4 class="dataset-title">${title}</h4>
                <p class="dataset-summary">
                    📅 Date: ${start}<br>
                    📦 Dataset: ${entry.dataset_id}
                </p>
                <div class="card-actions">
                    <a href="${download}" target="_blank" class="action-btn">DOWNLOAD DATA</a>
                </div>
            `;
            this.dom.resultsContainer.appendChild(card);
            delay += 50;
        });
    }

    log(message) {
        const line = document.createElement('div');
        line.innerHTML = message + `<span class="time">[${new Date().toLocaleTimeString()}]</span>`;
        this.dom.queryLog.appendChild(line);
        this.dom.queryLog.scrollTop = this.dom.queryLog.scrollHeight;
    }

    animateIntro() {
        if (typeof gsap !== 'undefined') {
            gsap.from(".nexus-module", {
                duration: 1,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: "power2.out",
                delay: 0.5
            });
        }
    }
}

// Initialize System
window.addEventListener('DOMContentLoaded', () => {
    window.nexusSystem = new EarthdataNexus();
});
