// Função para carregar os dados do JSON
async function carregarDados() {
    try {
        const response = await fetch('dados.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar dados: ${response.statusText}`);
        }
        const dados = await response.json();
        console.log("Dados carregados:", dados);
        return dados;
    } catch (erro) {
        console.error('Erro ao carregar os dados:', erro);
        return [];
    }
}


// Função para ordenar os dados
function ordenarDados(dados, ordem) {
    switch (ordem) {
        case 'title':
            return dados.sort((a, b) => a.title.localeCompare(b.title));
        case 'titleDesc':
            return dados.sort((a, b) => b.title.localeCompare(a.title));
        case 'score':
            return dados.sort((a, b) => b.score - a.score);
        case 'scoreDesc':
            return dados.sort((a, b) => a.score - b.score);
        case 'release':
            return dados.sort((a, b) => a.release - b.release);
        case 'releaseDesc':
            return dados.sort((a, b) => b.release - a.release);
        default:
            return dados;
    }
}

// Função para criar os cards dos jogos
// Função para criar os cards dos jogos
function criarCards(dados) {
    const container = document.getElementById('cards-container');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    // Obtém o critério de ordenação selecionado
    const sortOrder = document.getElementById('sortOrder').value;

    dados.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Coluna da imagem
        const colunaImagem = document.createElement('div');
        colunaImagem.classList.add('coluna-imagem');

        // Imagem
        const img = document.createElement('img');
        img.src = item.img; // Usa o link da imagem diretamente
        img.alt = item.title;

        // Adiciona a imagem à coluna
        colunaImagem.appendChild(img);

        // Adiciona o indicador no canto da imagem (nota ou ano)
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');

        // Verifica o critério de ordenação para exibir o indicador correto
        if (sortOrder === 'score' || sortOrder === 'scoreDesc') {
            indicator.textContent = item.score; // Exibe a nota
            indicator.classList.add('score', getScoreClass(item.score)); // Adiciona a classe de cor da nota
        } else if (sortOrder === 'release' || sortOrder === 'releaseDesc') {
            indicator.textContent = item.release; // Exibe o ano de lançamento
            indicator.classList.add('release'); // Adiciona a classe de estilo para o ano
        }

        // Adiciona o indicador à coluna da imagem
        colunaImagem.appendChild(indicator);

        // Coluna de detalhes
        const colunaDetalhes = document.createElement('div');
        colunaDetalhes.classList.add('coluna-detalhes');

        // Título
        const title = document.createElement('h3');
        title.textContent = item.title;

        // Nota
        const score = document.createElement('div');
        score.textContent = `${item.score}`;
        score.classList.add('score', getScoreClass(item.score));

        // Ano de lançamento e ano que foi jogado
        const release = document.createElement('div');
        release.textContent = `${item.release}`;
        release.classList.add('release');

        const played = document.createElement('div');
        played.textContent = `${item.played}`;
        played.classList.add('played');

        // Container para os anos
        const anosContainer = document.createElement('div');
        anosContainer.classList.add('anos-container');
        anosContainer.appendChild(release);
        anosContainer.appendChild(played);

        // Gêneros (cada gênero é um item separado)
        const genresContainer = document.createElement('div');
        genresContainer.classList.add('genres-container');
        item.genres.forEach(genre => {
            const genreElement = document.createElement('div');
            genreElement.textContent = genre;
            genreElement.classList.add('genres');
            genresContainer.appendChild(genreElement);
        });

        // Plataforma (cada plataforma é um item separado)
        const platformContainer = document.createElement('div');
        platformContainer.classList.add('platform-container');
        if (item.platform) {
            const platforms = Array.isArray(item.platform) ? item.platform : [item.platform];
            platforms.forEach(platform => {
                const platformElement = document.createElement('div');
                platformElement.textContent = platform.trim();
                platformElement.classList.add('platform');
                platformContainer.appendChild(platformElement);
            });
        }

        // Desenvolvedor (cada desenvolvedor é um item separado)
        const devContainer = document.createElement('div');
        devContainer.classList.add('dev-container');
        if (item.dev) {
            const devs = Array.isArray(item.dev) ? item.dev : [item.dev];
            devs.forEach(dev => {
                if (dev) { // Verifica se o valor não está vazio
                    const devElement = document.createElement('div');
                    devElement.textContent = dev.trim();
                    devElement.classList.add('dev');
                    devContainer.appendChild(devElement);
                }
            });
        }

        // Adiciona título e informações detalhadas à coluna de detalhes
        colunaDetalhes.appendChild(title);
        colunaDetalhes.appendChild(score);
        colunaDetalhes.appendChild(anosContainer);
        colunaDetalhes.appendChild(genresContainer);
        colunaDetalhes.appendChild(platformContainer);
        colunaDetalhes.appendChild(devContainer);

        // Adiciona as colunas ao card
        card.appendChild(colunaImagem);
        card.appendChild(colunaDetalhes);

        // Adiciona evento de clique ao card
        card.addEventListener('click', () => {
            // Fecha todos os cards expandidos antes de expandir o atual
            document.querySelectorAll('.card.expanded').forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                }
            });
            card.classList.toggle('expanded'); // Expande/recolhe o card clicado
        });

        // Adiciona o card ao container
        container.appendChild(card);
    });
}


// Restante do código permanece o mesmo...

// Função para determinar a classe da nota
function getScoreClass(score) {
    if (score >= 9) return 'score-very-high';
    if (score >= 7) return 'score-high';
    if (score >= 5) return 'score-medium';
    if (score >= 3) return 'score-low';
    return 'score-very-low';
}

// Função para aplicar os filtros
function aplicarFiltros(dados) {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const filterGenres = document.getElementById('filterGenres').value.toLowerCase();
    const filterPlatform = document.getElementById('filterPlatform').value.toLowerCase();
    const filterDev = document.getElementById('filterDev').value.toLowerCase();
    const filterAno = document.getElementById('filterAno').value.toLowerCase();
    const filterJAno = document.getElementById('filterJAno').value; // Filtro de ano que zerei
    const filterNota = document.getElementById('filterNota').value; // Filtro de nota
    const sortOrder = document.getElementById('sortOrder').value;

    // Obtém o status selecionado (do botão ativo)
    const filterStatus = document.querySelector('.status-btn.active').dataset.status.toLowerCase();

    // Filtra os dados
    const dadosFiltrados = dados.filter(item => {
        const title = item.title.toLowerCase();

        // Corrige o campo genres (se for uma string, converte para array)
        const genres = Array.isArray(item.genres) ? item.genres : item.genres.split(', ');
        const genresStr = genres.join(', ').toLowerCase();

        // Corrige o campo platform (se for uma string, converte para array)
        const platform = Array.isArray(item.platform) ? item.platform : [item.platform || ''];
        const platformStr = platform.join(', ').toLowerCase();

        const release = item.release.toString().toLowerCase();
        const played = item.played.toString().toLowerCase();

        // Corrige o campo dev (se for uma string vazia, trata como array vazio)
        const devs = Array.isArray(item.dev) ? item.dev : [item.dev || ''];
        const devStr = devs.join(', ').toLowerCase();

        // Converte status para array (se for string)
        const statusArray = Array.isArray(item.status) ? item.status : [item.status || ''];

        return (
            title.includes(searchTerm) &&
            genresStr.includes(filterGenres) &&
            platformStr.includes(filterPlatform) &&
            devStr.includes(filterDev) &&
            release.includes(filterAno) &&
            (filterJAno === "" || played.includes(filterJAno)) && // Filtro de ano que zerei
            (filterNota === "" || item.score.toString() === filterNota) && // Filtro de nota
            (filterStatus === "" || statusArray.some(status => status.toLowerCase() === filterStatus)) // Filtro de status
        );
    });

    // Ordena os dados
    const dadosOrdenados = ordenarDados(dadosFiltrados, sortOrder);

    // Cria os cards com os dados filtrados e ordenados
    criarCards(dadosOrdenados);

    // Atualiza as informações (número de jogos e nota média)
    atualizarInformacoes(dadosOrdenados);
}

// Função principal para carregar e exibir os dados
// Função principal para carregar e exibir os dados
async function iniciar() {
    const dados = await carregarDados(); // Carrega os dados do JSON

    // Adiciona os eventos de filtro
    const filtros = [
        'searchBar', 'filterGenres', 'filterPlatform', 'filterDev', 'filterAno', 'filterJAno', 'filterNota', 'sortOrder'
    ];
    filtros.forEach(id => {
        document.getElementById(id).addEventListener('input', () => aplicarFiltros(dados));
        document.getElementById(id).addEventListener('change', () => aplicarFiltros(dados)); // Para dropdowns
    });

    // Adiciona eventos de clique aos botões de status
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões
            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            // Adiciona a classe 'active' ao botão clicado
            btn.classList.add('active');
            // Aplica os filtros
            aplicarFiltros(dados);
        });
    });

    // Exibe os dados iniciais (com o botão "Todos" ativo)
    aplicarFiltros(dados);
}

function atualizarInformacoes(dados) {
    const totalJogos = dados.length; // Número de jogos na tela
    const totalNotas = dados.reduce((sum, item) => sum + parseFloat(item.score), 0); // Soma das notas (garantindo que seja número)
    const notaMedia = totalJogos > 0 ? parseFloat((totalNotas / totalJogos).toFixed(2)) : 0; // Nota média com 2 casas decimais

    // Atualiza o conteúdo dos elementos no HTML
    document.getElementById('total-jogos').textContent = totalJogos;
    document.getElementById('nota-media').textContent = notaMedia;
}

// Inicia o processo
iniciar();