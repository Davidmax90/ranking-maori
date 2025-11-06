// SCRIPT.JS
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbwarKee2ANgbBqPuDwOUzBw1Z9DcLIElo8O_T4R74rootLqrg_SYz_JG1iJXGPuIbiN/exec';

    const loadingMessage = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const dashboardTop = document.getElementById('dashboard-top');
    const topRankingsContainer = document.getElementById('top-rankings-container');
    const fullRankingContainer = document.getElementById('full-ranking-container');

    const memberImages = {
        "Alex Uchôa": "assets/alex_uchoa.png",
        "Amanda Ribeiro": "assets/amanda_ribeiro.png",
        "André Queiroz": "assets/andre_queiroz.png",
        "Jossiane": "assets/jossiane.png",
        "David Marques": "assets/david_marques.png",
        "Clailton": "assets/claiton.png",
        "Everton Lopes": "assets/everton_lopes.png",
        "João Victor": "assets/joao_victor.png",
    };
    const defaultPhoto = "assets/default-avatar.png";

const formatCurrency = (value) => {
  if (!value || isNaN(value)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};

    
    const formatPercentage = (value) => {
        const strValue = String(value).trim();
        if (strValue.endsWith('%')) {
            return strValue;
        }
        const num = parseFloat(strValue.replace(',', '.'));
        if (!isNaN(num)) {
            return `${num.toFixed(2).replace('.', ',')}%`;
        }
        return value;
    };
    
    const fetchData = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.status}`);
            }
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            renderDashboard(data.generalData);
            renderTopRankings(data.ranking.slice(0, 3));
            renderFullRanking(data.ranking);

            dashboardTop.style.display = 'grid';
            topRankingsContainer.style.display = 'flex';
            fullRankingContainer.style.display = 'flex';

        } catch (error) {
            console.error('Falha ao carregar os dados:', error);
            errorMessage.style.display = 'block';
        } finally {
            loadingMessage.style.display = 'none';
        }
    };

    const renderDashboard = (generalData) => {
        const generalDataElement = document.getElementById('general-data');
        
        const meta = formatCurrency(generalData.meta);
        const resultado = formatCurrency(generalData.resultado);
        const faltante = formatCurrency(generalData.faltante);
        const ticketMedio = formatCurrency(generalData.ticketMedio);
        const percentual = formatPercentage(generalData.percentualAtingimento);

        generalDataElement.innerHTML = `
            <h3>SQUAD MAORI > LÍDER : RAUL VIANA</h3>
            <div class="info-and-circle">
                <div class="general-info-grid">
                    <span>META :</span><span>${meta}</span>
                    <span>RESULTADO :</span><span>${resultado}</span>
                    <span>FALTA : -</span><span>${faltante}</span>
                    <span>TICKET :</span><span>${ticketMedio}</span>
                </div>
                <div class="general-metric-circle">${percentual}</div>
            </div>
        `;
        
        const progressBarFill = document.querySelector('.progress-bar-fill');
        const percentageValue = parseFloat(percentual.replace('%', '').replace(',', '.'));
        if (!isNaN(percentageValue)) {
            progressBarFill.style.width = `${percentageValue > 100 ? 100 : percentageValue}%`;
        }
    };

    const renderTopRankings = (topMembers) => {
        topRankingsContainer.innerHTML = '';

        const topOrder = ["top-2", "top-1", "top-3"];
        const iconMap = {
            "top-1": "🏆",
            "top-2": "🥈",
            "top-3": "🥉"
        };

        const orderedTopMembers = [topMembers[1], topMembers[0], topMembers[2]];

        orderedTopMembers.forEach((member, index) => {
            if (!member) return;

            const className = topOrder[index];
            const card = document.createElement('div');
            card.className = `ranking-card ${className}`;
            
            card.innerHTML = `
                <div class="card-title">${className.toUpperCase().replace('-', ' ')}</div>
                <div class="card-icon">${iconMap[className]}</div>
                <h3 class="member-name">${member.nome}</h3>
                <div class="info-section">
                    <img src="${memberImages[member.nome] || defaultPhoto}" alt="${member.nome}" class="member-photo">
                    <div class="metric-circle-small">${formatPercentage(member.percentualAtingimento)}</div>
                </div>
                <div class="ranking-info-buttons">
                    <div class="info-button">
                        <span>META:</span>
                        <span>${formatCurrency(member.meta)}</span>
                    </div>
                    <div class="info-button">
                        <span>RESULTADO:</span>
                        <span>${formatCurrency(member.resultado)}</span>
                    </div>
                    <div class="info-button">
                        <span>FALTA: -</span>
                        <span>${formatCurrency(member.faltante)}</span>
                    </div>
                    <div class="info-button">
                        <span>TICKET:</span>
                        <span>${formatCurrency(member.ticketMedio)}</span>
                    </div>
                </div>
            `;
            topRankingsContainer.appendChild(card);
        });
    };

    const renderFullRanking = (allMembers) => {
        fullRankingContainer.innerHTML = '';
        const top3Names = allMembers.slice(0, 3).map(member => member.nome);
        const otherMembers = allMembers.filter(member => !top3Names.includes(member.nome));

        const defaultPhoto = "assets/default-avatar.png";

        otherMembers.forEach(member => {
            const item = document.createElement('div');
            item.className = 'ranking-card small-card'; // Adiciona uma nova classe para estilização
            item.innerHTML = `
                <h3 class="member-name">${member.nome}</h3>
                <div class="info-section">
                    <img src="${memberImages[member.nome] || defaultPhoto}" alt="${member.nome}" class="member-photo">
                    <div class="metric-circle-small">${formatPercentage(member.percentualAtingimento)}</div>
                </div>
                <div class="ranking-info-buttons">
                    <div class="info-button">
                        <span>META:</span>
                        <span>${formatCurrency(member.meta)}</span>
                    </div>
                    <div class="info-button">
                        <span>RESULTADO:</span>
                        <span>${formatCurrency(member.resultado)}</span>
                    </div>
                    <div class="info-button">
                        <span>FALTA: -</span>
                        <span>${formatCurrency(member.faltante)}</span>
                    </div>
                    <div class="info-button">
                        <span>TICKET:</span>
                        <span>${formatCurrency(member.ticketMedio)}</span>
                    </div>
                </div>
            `;
            fullRankingContainer.appendChild(item);
        });
    };


    fetchData();

});
