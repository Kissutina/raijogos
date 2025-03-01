document.addEventListener('DOMContentLoaded', function() {
    let data = []; // Armazena os dados do JSON
    const filtersContainer = document.getElementById('filters-container');
    const sectionsContainer = document.getElementById('sections-container');
    let currentCategory = 'dev'; // Categoria padrão é 'dev'
    let currentSort = 'count';  // Ordenação padrão é 'Número de Jogos'
    

    // Carrega os dados do JSON
    fetch('dados.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            setupFilters(); // Configura os botões de filtro
            setupSorting(); // Configura os botões de ordenação
            displayCategory(currentCategory); // Exibe a categoria padrão
    
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));

    // Configura os botões de filtro
    function setupFilters() {
        const categories = ['played', 'release', 'genres', 'platform', 'dev'];

        categories.forEach(category => {
            const button = filtersContainer.querySelector(`button[data-category="${category}"]`);
            if (category === currentCategory) {
                button.classList.add('active'); // Marca o botão como ativo
            }
            button.addEventListener('click', () => {
                currentCategory = category;
                displayCategory(category); // Exibe a categoria selecionada
                updateActiveButton('category', category);
            });
        });
    }

    // Configura os botões de ordenação
    function setupSorting() {
        const sortButtons = {
            'sort-alphabetical': 'alphabetical',
            'sort-count': 'count',
            'sort-score': 'score'
        };

        for (const [buttonId, sortType] of Object.entries(sortButtons)) {
            const button = document.getElementById(buttonId);
            if (sortType === currentSort) {
                button.classList.add('active'); // Marca o botão de ordenação como ativo
            }
            button.addEventListener('click', () => {
                currentSort = sortType;
                displayCategory(currentCategory); // Exibe a categoria com a nova ordenação
                updateActiveButton('sort', sortType);
            });
        }
    }

        // Atualiza o botão ativo de acordo com a categoria ou ordenação
        function updateActiveButton(type, value) {
            const buttons = type === 'category' 
                ? filtersContainer.querySelectorAll('button[data-category]')
                : document.querySelectorAll('.filters button');
    
            buttons.forEach(button => {
                if ((type === 'category' && button.dataset.category === value) || 
                    (type === 'sort' && button.id === `sort-${value}`)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        }

    // Exibe a categoria selecionada
    function displayCategory(category) {
        sectionsContainer.innerHTML = ''; // Limpa a área de cards

        const section = createSection(category, data);
        if (section) {
            sectionsContainer.appendChild(section);
        }
    }

    // Cria uma seção para a categoria
    function createSection(category, data) {
        const section = document.createElement('div');
        section.className = 'section';
    
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';
    
        let categoryData = processCategory(data, category);
    
        // Ordena os cards
        if (currentSort === 'alphabetical') {
            categoryData.sort((a, b) => a.key.localeCompare(b.key));
        } else if (currentSort === 'count') {
            categoryData.sort((a, b) => b.count - a.count);
        } else if (currentSort === 'score') {
            categoryData.sort((a, b) => b.averageScore - a.averageScore);
        }
    
        categoryData.forEach(item => {
            if (item.count > 3 && item.key !== "") { // Ignora valores vazios e cards com menos de 3 jogos
                const card = createCard(item);
                cardsContainer.appendChild(card);
            }
        });
    
        if (cardsContainer.children.length > 0) {
            section.appendChild(cardsContainer);
            return section;
        } else {
            return null; // Retorna null se não houver cards válidos
        }
    }

    // Processa os dados da categoria
    function processCategory(data, category) {
        const categoryMap = new Map();

        data.forEach(game => {
            const keys = Array.isArray(game[category]) ? game[category] : [game[category]];
            keys.forEach(key => {
                if (key !== "") { // Ignora valores vazios
                    if (!categoryMap.has(key)) {
                        categoryMap.set(key, []);
                    }
                    categoryMap.get(key).push(game);
                }
            });
        });

        return Array.from(categoryMap.entries()).map(([key, games]) => {
            const averageScore = calculateAverageScore(games);
            const topGames = getTopRatedGames(games, 4);
            return {
                key,
                count: games.length,
                averageScore,
                topGames
            };
        });
    }

    // Calcula a média das notas
    function calculateAverageScore(games) {
        const validGames = games.filter(game => game.status.includes('Zerado') || game.status.includes('Platinado'));
        if (validGames.length === 0) return 0;
        const totalScore = validGames.reduce((sum, game) => sum + parseInt(game.score), 0);
        return (totalScore / validGames.length).toFixed(2);
    }

    // Retorna os jogos com as melhores notas
    function getTopRatedGames(games, limit) {
        return games
            .filter(game => game.status.includes('Zerado') || game.status.includes('Platinado'))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    // Cria um card
    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'card';
    
        // Título do card
        const title = document.createElement('h3');
        title.textContent = item.key;
        card.appendChild(title);
    
        // Container para "Jogos" e "Média"
        const infoContainer = document.createElement('div');
        infoContainer.className = 'info';
    
        // Jogos
        const count = document.createElement('p');
        count.className = 'count';
        count.textContent = `Jogos: ${item.count}`;
        infoContainer.appendChild(count);
    
        // Média
        const averageScore = document.createElement('p');
        averageScore.className = 'average';
        averageScore.textContent = `Média: ${item.averageScore}`;
        infoContainer.appendChild(averageScore);
    
        card.appendChild(infoContainer);
    
        // Imagens
        const imagesContainer = document.createElement('div');
        item.topGames.forEach(game => {
            const img = document.createElement('img');
            img.src = game.img;
            img.alt = game.title;
            imagesContainer.appendChild(img);
        });
        card.appendChild(imagesContainer);
    
        return card;
    }
});