document.addEventListener('DOMContentLoaded', function() {
    fetch('dados1.json')
        .then(response => {
            console.log('Resposta do fetch:', response);
            return response.json();
        })
        .then(data => {
            console.log('Dados carregados:', data); // Verifique se os dados estão corretos
            const categories = ['status', 'genres', 'platform', 'dev'];
            const chartsContainer = document.getElementById('charts');

            const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

            categories.forEach(category => {
                const chartData = processData(data, category);
                const chart = createChart(category, chartData, colorPalette);
                chartsContainer.appendChild(chart);
            });
            createReleaseChart(data);
            createPlayedChart(data);

            createCards(data, 'played', 'played-cards'); 
            createCards(data, 'release', 'release-cards');
            createCards(data, 'genres', 'genre-cards'); 
            createCards(data, 'platform', 'platform-cards'); 
            createCards(data, 'dev', 'dev-cards'); 
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
});




function processData(data, category) {
    const countMap = {};

    data.forEach(item => {
        const values = Array.isArray(item[category]) ? item[category] : [item[category]];
        values.forEach(value => {
            if (value) {
                if (countMap[value]) {
                    countMap[value]++;
                } else {
                    countMap[value] = 1;
                }
            }
        });
    });

    const sortedData = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return sortedData;
}

function createChart(category, data, colorPalette) {
    const total = data.reduce((sum, item) => sum + item[1], 0);

    const chart = document.createElement('div');
    chart.className = 'chart';

    // Título do gráfico
    const title = document.createElement('div');
    title.className = 'chart-title';
    title.textContent = category.toUpperCase();
    chart.appendChild(title);

    // Legenda
    const legend = document.createElement('div');
    legend.className = 'legend';

    // Barras
    const barContainer = document.createElement('div');
    barContainer.className = 'bar-container';

    data.forEach((item, index) => {
        const color = colorPalette[index % colorPalette.length]; // Usa a paleta de cores

        // Item da legenda
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        const legendColor = document.createElement('div');
        legendColor.className = 'legend-color';
        legendColor.style.backgroundColor = color;

        const legendText = document.createElement('div');
        legendText.textContent = `${item[0]} (${item[1]})`;

        legendItem.appendChild(legendColor);
        legendItem.appendChild(legendText);
        legend.appendChild(legendItem);

        // Barra
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = `${(item[1] / total) * 100}%`;
        bar.style.backgroundColor = color;

        // Label da barra (aparece no hover)
        const barLabel = document.createElement('div');
        barLabel.className = 'bar-label';
        barLabel.textContent = `${item[0]} (${item[1]})`;
        bar.appendChild(barLabel);

        barContainer.appendChild(bar);
    });

    chart.appendChild(legend);
    chart.appendChild(barContainer);
    return chart;
}

function createReleaseChart(data) {
    const releaseData = {};

    data.forEach(item => {
        const releaseYear = item.release;
        const score = parseFloat(item.score);
        const status = item.status[0]; // Considera o primeiro status

        // Filtra apenas "Zerado" ou "Dropado"
        if (status === "Zerado" || status === "") {
            if (!releaseData[releaseYear]) {
                releaseData[releaseYear] = { totalScore: 0, count: 0 };
            }
            releaseData[releaseYear].totalScore += score;
            releaseData[releaseYear].count++;
        }
    });

    const years = Object.keys(releaseData).sort((a, b) => a - b);
    const averageScores = years.map(year => (releaseData[year].totalScore / releaseData[year].count).toFixed(2));
    const gameCounts = years.map(year => releaseData[year].count);

    const ctx = document.getElementById('releaseChart').getContext('2d');
    const releaseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'SCORE MÉDIA',
                data: averageScores,
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 6, // Aumenta o tamanho dos nós
                pointHoverRadius: 8 // Aumenta o tamanho dos nós ao passar o mouse
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Atualizar gráfico com base na seleção
    const selector = document.getElementById('releaseDataSelector');
    selector.addEventListener('change', () => {
        const selectedValue = selector.value;
        if (selectedValue === 'average') {
            releaseChart.data.datasets[0].label = 'SCORE MÉDIA';
            releaseChart.data.datasets[0].data = averageScores;
        } else {
            releaseChart.data.datasets[0].label = 'NÚMERO DE TÍTULOS';
            releaseChart.data.datasets[0].data = gameCounts;
        }
        releaseChart.update();
    });
}

function createPlayedChart(data) {
    const playedData = {};

    data.forEach(item => {
        const playedYear = item.played;
        const score = parseFloat(item.score);
        const status = item.status[0]; // Considera o primeiro status

        // Filtra apenas "Zerado" ou "Dropado"
        if (status === "Zerado" || status === "Platinado") {
            if (!playedData[playedYear]) {
                playedData[playedYear] = { totalScore: 0, count: 0 };
            }
            playedData[playedYear].totalScore += score;
            playedData[playedYear].count++;
        }
    });

    const years = Object.keys(playedData).sort((a, b) => a - b);
    const averageScores = years.map(year => (playedData[year].totalScore / playedData[year].count).toFixed(2));
    const gameCounts = years.map(year => playedData[year].count);

    const ctx = document.getElementById('playedChart').getContext('2d');
    const playedChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'SCORE MÉDIA',
                data: averageScores,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 6, // Aumenta o tamanho dos nós
                pointHoverRadius: 8 // Aumenta o tamanho dos nós ao passar o mouse
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Atualizar gráfico com base na seleção
    const selector = document.getElementById('playedDataSelector');
    selector.addEventListener('change', () => {
        const selectedValue = selector.value;
        if (selectedValue === 'average') {
            playedChart.data.datasets[0].label = 'SCORE MÉDIA';
            playedChart.data.datasets[0].data = averageScores;
        } else {
            playedChart.data.datasets[0].label = 'NÚMERO DE TÍTULOS';
            playedChart.data.datasets[0].data = gameCounts;
        }
        playedChart.update();
    });
}

function createScoreChart(data) {
    const scoreCounts = {};

    data.forEach(item => {
        const score = item.score;
        if (scoreCounts[score]) {
            scoreCounts[score]++;
        } else {
            scoreCounts[score] = 1;
        }
    });

    const labels = Object.keys(scoreCounts).sort((a, b) => a - b);
    const counts = labels.map(score => scoreCounts[score]);

    };




    function processScoreData(data) {
        const scoreCounts = {};
    
        // Inicializa o objeto com todas as notas de 1 a 10
        for (let i = 1; i <= 10; i++) {
            scoreCounts[i] = 0;
        }
    
        // Conta as ocorrências de cada score
        data.forEach(item => {
            const score = parseInt(item.score);
            if (score >= 1 && score <= 10) {
                scoreCounts[score]++;
            }
        });
    
        // Converte o objeto em um array de pares [score, count]
        const sortedData = Object.entries(scoreCounts)
            .sort((a, b) => a[0] - b[0]); // Ordena por score (1 a 10)
    
        return sortedData;
    }

function createCards(data, category, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Container ${containerId} não encontrado.`);
        return;
    }

    // Verifica se já existe um <h3>, se não existir, cria um
    let title = container.querySelector('h2');
    if (!title) {
        title = document.createElement('h2');
        title.textContent = category.toUpperCase();
        container.prepend(title); // Garante que o título está no topo
    }

    const groupedData = {};

    data.forEach(item => {
        if (item.status.includes("Zerado")) { // Apenas jogos zerados contam
            const key = item[category];

            if (Array.isArray(key)) {
                key.forEach(subkey => processCardData(subkey, item));
            } else {
                processCardData(key, item);
            }
        }
    });

    function processCardData(key, item) {
        if (!key) return;

        if (!groupedData[key]) {
            groupedData[key] = {
                games: [],
                totalScore: 0,
                count: 0
            };
        }

        groupedData[key].games.push(item);
        groupedData[key].totalScore += parseFloat(item.score);
        groupedData[key].count++;
    }

    const filteredGroups = Object.keys(groupedData).filter(key => groupedData[key].count >= 4);

    let row;
    filteredGroups.forEach((key, index) => {
        if (index % 2 === 0) {
            row = document.createElement('div');
            row.className = 'card-row';
            container.appendChild(row);
        }

        const group = groupedData[key];
        const averageScore = (group.totalScore / group.count).toFixed(2);
        const topGames = group.games.sort((a, b) => parseFloat(b.score) - parseFloat(a.score)).slice(0, 4);

        const card = document.createElement('div');
        card.className = 'card';

        const cardTitle = document.createElement('h4');
        cardTitle.textContent = `${key} | ${group.count} jogos | Nota Média: ${averageScore}`;
        card.appendChild(cardTitle);

        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        topGames.forEach(game => {
            const img = document.createElement('img');
            img.src = game.img;
            img.alt = game.title;
            imgContainer.appendChild(img);
        });

        card.appendChild(imgContainer);
        row.appendChild(card);
    });
}
