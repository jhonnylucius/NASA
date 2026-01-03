document.addEventListener('DOMContentLoaded', () => {
    console.log("🕵️‍♂️ Truth Portal v3.0 Initializing...");

    // --- GLOBAL STATE ---
    let allVerdicts = [];
    let currentMarkers = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50 }); // CLUSTER!
    const map = L.map('truth-map').setView([-14.2350, -51.9253], 4);

    // --- TILE LAYERS ---
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CartoDB' });
    const lightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CartoDB' });
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '&copy; Esri' });
    const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenTopoMap' });
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OSM' });

    // Default Layer
    darkLayer.addTo(map);

    // Layer Control (Top Right)
    const baseMaps = {
        "🌑 Escuro": darkLayer,
        "☀️ Claro": lightLayer,
        "🛰️ Satélite": satelliteLayer,
        "🏔️ Terreno": terrainLayer,
        "🗺️ Ruas": streetLayer
    };
    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    currentMarkers.addTo(map);

    // Coordinate Mapping (Approximate Centers for States/Regions)
    const COORDS = {
        'SC': [-27.2423, -50.2189],
        'RS': [-30.0346, -51.2177],
        'PR': [-25.2521, -52.0215],
        'SP': [-23.5505, -46.6333],
        'RJ': [-22.9068, -43.1729],
        'MG': [-19.9167, -43.9345],
        'ES': [-19.1834, -40.3089],
        'BA': [-12.9777, -38.5016],
        'CE': [-5.0, -39.5], // Expanded Sertão
        'PA': [-3.4168, -52.2228],
        'AM': [-3.4168, -65.0], // Deep Amazon
        'NE (Sertão)': [-7.5, -39.0],
        'RN': [-5.79448, -36.9541],
        'PE': [-8.8137, -36.9541],
        'PB': [-7.11532, -36.7819],
        'MT': [-12.6819, -56.9211],
        'MS': [-20.7722, -54.7863],
        'GO': [-15.8270, -49.8362],
        'DF': [-15.7975, -47.8919],
        'TO': [-10.1753, -48.2982],
        'RO': [-11.5057, -63.5806],
        'AC': [-9.0238, -70.8120]
    };

    // Icons
    const redIcon = L.divIcon({ className: 'custom-icon', html: '<div style="background-color: #ff0000; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 8px #ff0000;"></div>' });
    const greenIcon = L.divIcon({ className: 'custom-icon', html: '<div style="background-color: #00ff00; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 8px #00ff00;"></div>' });
    const yellowIcon = L.divIcon({ className: 'custom-icon', html: '<div style="background-color: #ffff00; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 8px #ffff00;"></div>' });
    const blueIcon = L.divIcon({ className: 'custom-icon', html: '<div style="background-color: #00BFFF; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 5px #00BFFF; opacity: 0.8;"></div>' });
    const darkGreenIcon = L.divIcon({ className: 'custom-icon', html: '<div style="background-color: #006400; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 12px #006400; border: 1px solid white;"></div>' });

    // --- DATA FETCHING ---
    fetch('http://localhost:8081/api/truth')
        .then(response => response.json())
        .then(data => {
            console.log(`⚖️ Verdicts loaded: ${data.length}`);
            allVerdicts = data;

            // Initial Render
            renderView(allVerdicts);
            updateStats(allVerdicts);
            setupFilters();
        })
        .catch(err => console.error("Error loading truth:", err));

    // --- CORE LOGIC ---

    function renderView(dataSet) {
        // 1. Clear Map & List
        currentMarkers.clearLayers();
        const listContainer = document.getElementById('audit-list-container');
        if (listContainer) listContainer.innerHTML = '';

        // 2. Populate
        dataSet.forEach(verdict => {
            const loc = verdict.atlasLocation;
            let latLng = null;

            // Logic: Exact match -> Contains State Key -> Default to Center
            if (COORDS[loc]) {
                latLng = COORDS[loc];
            } else {
                for (const [key, val] of Object.entries(COORDS)) {
                    if (loc.includes(key)) {
                        latLng = val;
                        break;
                    }
                }
            }

            if (!latLng) return; // Skip if cant map

            // Visual Properties
            let icon = redIcon;
            let colorCode = '#dc3545';
            let statusLabel = 'Inconsistente';

            if (verdict.verdict.includes('CONFIRMED')) {
                icon = greenIcon;
                colorCode = '#28a745';
                statusLabel = 'Confirmado';
            }
            if (verdict.verdict.includes('SEVERE')) {
                icon = darkGreenIcon;
                colorCode = '#006400';
                statusLabel = 'Severo';
            }
            if (verdict.verdict.includes('PLAUSIBLE')) {
                icon = yellowIcon;
                colorCode = '#ffc107';
                statusLabel = 'Plausível';
            }
            if (verdict.verdict.includes('NORMAL')) {
                icon = blueIcon;
                colorCode = '#17a2b8';
                statusLabel = 'Normal';
            }

            // Scatter points slightly to avoid total overlap
            const spread = 2.0; // Increased spread for national view
            const finalLat = latLng[0] + (Math.random() * spread - (spread / 2));
            const finalLng = latLng[1] + (Math.random() * spread - (spread / 2));

            // MAP MARKER
            const marker = L.marker([finalLat, finalLng], { icon: icon })
                .bindPopup(createPopup(verdict, colorCode));

            currentMarkers.addLayer(marker);

            // SIDEBAR ITEM
            if (listContainer) {
                const item = createListItem(verdict, colorCode, statusLabel);

                // Interaction
                item.onclick = () => {
                    map.flyTo([finalLat, finalLng], 6, { duration: 1.5 });
                    marker.openPopup();
                    if (window.innerWidth < 768) document.getElementById('truth-map').scrollIntoView({ behavior: 'smooth' });
                };
                listContainer.appendChild(item);
            }
        });
    }

    function updateStats(dataSet) {
        const total = dataSet.length;
        const confirmed = dataSet.filter(v => v.verdict.includes('CONFIRMED')).length;
        const doubtful = dataSet.filter(v => v.verdict.includes('DOUBTFUL') || v.verdict.includes('NORMAL')).length;
        const severe = dataSet.filter(v => v.verdict.includes('SEVERE')).length;

        // Animations for numbers could go here
        document.getElementById('stat-total').innerText = total;
        document.getElementById('stat-confirmed').innerText = total > 0 ? Math.round((confirmed / total) * 100) + '%' : '0%';
        document.getElementById('stat-doubtful').innerText = doubtful;
        document.getElementById('stat-severe').innerText = severe;
    }

    function setupFilters() {
        // Buttons (Verdict Filter)
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Active Class Logic
                buttons.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = '#e0e0e0';
                    b.style.color = '#333';
                });
                btn.classList.add('active');
                btn.style.background = '#333';
                btn.style.color = 'white';

                applyFilters();
            });
        });

        // Dropdown (Type Filter)
        const dropdown = document.getElementById('type-filter');
        if (dropdown) {
            dropdown.addEventListener('change', applyFilters);
        }

        // Dropdown (State Filter)
        const stateDropdown = document.getElementById('state-filter');
        if (stateDropdown) {
            stateDropdown.addEventListener('change', applyFilters);
        }
    }

    function applyFilters() {
        const verdictFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const typeFilter = document.getElementById('type-filter').value;
        const stateFilter = document.getElementById('state-filter').value;

        let filtered = allVerdicts;

        // 1. Verdict Filter
        if (verdictFilter !== 'all') {
            filtered = filtered.filter(v => v.verdict.includes(verdictFilter));
        }

        // 2. Type Filter
        if (typeFilter !== 'all') {
            // Fuzzy match logic
            if (typeFilter === 'Gale') filtered = filtered.filter(v => v.eventType.includes('Gale') || v.eventType.includes('Vendaval'));
            if (typeFilter === 'Drought') filtered = filtered.filter(v => v.eventType.includes('Drought') || v.eventType.includes('Seca') || v.eventType.includes('Estiagem'));
            if (typeFilter === 'Flood') filtered = filtered.filter(v => v.eventType.includes('Flood') || v.eventType.includes('Inunda') || v.eventType.includes('Enxurrada') || v.eventType.includes('Alagamento'));
            if (typeFilter === 'Hail') filtered = filtered.filter(v => v.eventType.includes('Hail') || v.eventType.includes('Granizo'));
            if (typeFilter === 'Fire') filtered = filtered.filter(v => v.eventType.includes('Fire') || v.eventType.includes('Incêndio'));
            if (typeFilter === 'Frost') filtered = filtered.filter(v => v.eventType.includes('Frost') || v.eventType.includes('Geada'));
        }

        // 3. State Filter
        if (stateFilter !== 'all') {
            filtered = filtered.filter(v => v.atlasLocation.includes(stateFilter));
        }

        renderView(filtered);
        updateStats(filtered);
    }

    // --- HELPERS ---

    function createPopup(verdict, color) {
        return `
            <div style="font-family: 'Montserrat', sans-serif; color: #333; min-width: 200px;">
                <h3 style="margin: 0; font-size: 16px; color: ${color}">
                    ${verdict.verdict}
                </h3>
                <p style="margin: 5px 0;"><strong>${verdict.eventType}</strong> (${verdict.atlasYear})</p>
                <p style="margin: 5px 0;"><strong>Local:</strong> ${verdict.atlasLocation}</p>
                <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; margin-top: 5px; font-size: 0.9em; font-style: italic; border-left: 3px solid ${color};">
                    "${verdict.evidenceText}"
                </div>
            </div>
        `;
    }

    function createListItem(verdict, color, label) {
        const item = document.createElement('div');
        item.className = 'audit-item';
        item.style.cssText = `
            background: white; 
            padding: 12px; 
            margin-bottom: 10px; 
            border-radius: 8px; 
            border-left: 4px solid ${color};
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            cursor: pointer;
            transition: transform 0.2s;
        `;
        item.onmouseover = () => item.style.transform = 'translateY(-2px)';
        item.onmouseout = () => item.style.transform = 'translateY(0)';

        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <strong>${verdict.eventType} (${verdict.atlasYear})</strong>
                <span style="font-size: 0.75rem; background: ${color}; color: white; padding: 2px 6px; border-radius: 4px;">${label}</span>
            </div>
            <div style="font-size: 0.85rem; color: #666; margin-top: 4px;">
                📍 ${verdict.atlasLocation}
            </div>
        `;
        return item;
    }
});
