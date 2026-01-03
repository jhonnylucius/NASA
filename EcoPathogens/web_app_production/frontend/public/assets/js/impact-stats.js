document.addEventListener('DOMContentLoaded', () => {
    fetchImpactStats();
});

const API_BASE_IMPACT = 'https://api.ecoguardians.com.br:8443';

async function fetchImpactStats() {
    try {
        const response = await fetch(`${API_BASE_IMPACT}/api/impact`);
        if (!response.ok) throw new Error('Falha ao buscar dados de impacto');

        const data = await response.json();

        // Animate numbers
        animateValue("impact-deaths", 0, data.totalDeaths || 0, 2000);
        animateValue("impact-injured", 0, data.totalInjured || 0, 2000);

        const totalDisplaced = (data.totalHomeless || 0) + (data.totalDisplaced || 0);
        animateValue("impact-displaced", 0, totalDisplaced, 2000);

        animateValue("impact-total", 0, data.totalAffected || 0, 2000);

    } catch (error) {
        console.error('Erro no Dashboard de Impacto:', error);
    }
}

function animateValue(id, start, end, duration) {
    if (start === end) return;
    const range = end - start;
    const obj = document.getElementById(id);
    if (!obj) return;

    let current = start;
    const increment = end > start ? Math.ceil(range / (duration / 20)) : Math.floor(range / (duration / 20));
    const stepTime = Math.abs(Math.floor(duration / (range / increment))); // Adjust speed

    // Safety for small numbers
    const timer = setInterval(function () {
        current += increment;

        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }

        obj.innerHTML = current.toLocaleString('pt-BR');
    }, Math.max(stepTime, 20));
}
