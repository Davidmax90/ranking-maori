document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbwarKee2ANgbBqPuDwOUzBw1Z9DcLIElo8O_T4R74rootLqrg_SYz_JG1iJXGPuIbiN/exec';

    const memberImages = {
        "Alex Uchôa": "assets/alex_uchoa.png",
        "Amanda Ribeiro": "assets/amanda_ribeiro.png",
        "André Queiroz": "assets/andre_queiroz.png",
        "Jossiane": "assets/jossiane.png",
        "David Marques": "assets/david_marques.png",
        "Clailton": "assets/clailton.png",
        "Emerson Rocha": "assets/emerson_rocha.png",
        "João Victor": "assets/joao_victor.png",
    };
    const defaultPhoto = "assets/default-avatar.png";

    const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
    const formatPct = (v) => {
        const n = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : v;
        return `${(n || 0).toFixed(2).replace('.', ',')}%`;
    };

    const fetchData = async () => {
        try {
            const res = await fetch(apiUrl);
            const data = await res.json();
            
            renderHeader(data.generalData);
            renderPodium(data.ranking.slice(0, 3));
            renderFullList(data.ranking.slice(3));

            document.getElementById('dashboard-top').style.display = 'block';
            document.getElementById('top-rankings-container').style.display = 'flex';
            document.getElementById('full-ranking-container').style.display = 'grid';
        } catch (err) {
            document.getElementById('error-message').style.display = 'block';
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    };

    const renderHeader = (d) => {
        const el = document.getElementById('general-data');
        el.innerHTML = `
            <div class="stat-box"><label>Meta</label><p>${formatCurrency(d.meta)}</p></div>
            <div class="stat-box"><label>Feito</label><p style="color:var(--success)">${formatCurrency(d.resultado)}</p></div>
            <div class="stat-box"><label>Falta</label><p>${formatCurrency(d.faltante)}</p></div>
            <div class="stat-box"><label>Ticket</label><p>${formatCurrency(d.ticketMedio)}</p></div>
        `;
        const pct = parseFloat(String(d.percentualAtingimento).replace(',', '.'));
        setTimeout(() => { document.querySelector('.progress-fill').style.width = `${Math.min(pct, 100)}%`; }, 200);
    };

    const renderPodium = (m) => {
        const container = document.getElementById('top-rankings-container');
        const medals = ["🥇", "🥈", "🥉"];
        // Ordem 2-1-3
        const order = [m[1], m[0], m[2]];

        order.forEach((user) => {
            if(!user) return;
            const isTop1 = user.nome === m[0].nome;
            const medal = user.nome === m[0].nome ? medals[0] : (user.nome === m[1].nome ? medals[1] : medals[2]);
            
            const card = document.createElement('div');
            card.className = `ranking-card ${isTop1 ? 'top-1' : ''}`;
            card.innerHTML = `
                <div class="photo-c">
                    <img src="${memberImages[user.nome] || defaultPhoto}">
                    <span class="medal">${medal}</span>
                </div>
                <div class="pct-tag" style="margin-bottom:15px">${formatPct(user.percentualAtingimento)}</div>
                <h2 style="margin:0 0 15px">${user.nome}</h2>
                <div class="metrics-grid">
                    <div class="m-box"><label>Meta</label><span>${formatCurrency(user.meta)}</span></div>
                    <div class="m-box"><label>Feito</label><span>${formatCurrency(user.resultado)}</span></div>
                    <div class="m-box"><label>Falta</label><span>${formatCurrency(user.faltante)}</span></div>
                    <div class="m-box"><label>Ticket</label><span>${formatCurrency(user.ticketMedio)}</span></div>
                </div>
            `;
            container.appendChild(card);
        });
    };

    const renderFullList = (members) => {
        const container = document.getElementById('full-ranking-container');
        members.forEach((user, i) => {
            const card = document.createElement('div');
            card.className = 'member-detail-card';
            card.innerHTML = `
                <div class="member-header">
                    <span style="font-weight:900; color:var(--text-dim)">${i+4}º</span>
                    <img src="${memberImages[user.nome] || defaultPhoto}">
                    <h3>${user.nome}</h3>
                    <div class="pct-tag">${formatPct(user.percentualAtingimento)}</div>
                </div>
                <div class="metrics-grid">
                    <div class="m-box"><label>Meta</label><span>${formatCurrency(user.meta)}</span></div>
                    <div class="m-box"><label>Resultado</label><span style="color:var(--success)">${formatCurrency(user.resultado)}</span></div>
                    <div class="m-box"><label>Falta</label><span style="color:var(--danger)">${formatCurrency(user.faltante)}</span></div>
                    <div class="m-box"><label>Ticket</label><span>${formatCurrency(user.ticketMedio)}</span></div>
                </div>
            `;
            container.appendChild(card);
        });
    };

    fetchData();
});
