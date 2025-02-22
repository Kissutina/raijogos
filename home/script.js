document.querySelectorAll('.image-container img').forEach(img => {
    img.addEventListener('mouseenter', function() {
        const audioId = this.getAttribute('data-audio');
        const audio = document.getElementById(audioId);
        audio.volume = 0.03; // Ajuste o volume (0.3 = 30% do volume máximo)
        audio.play();
    });

    img.addEventListener('mouseleave', function() {
        const audioId = this.getAttribute('data-audio');
        const audio = document.getElementById(audioId);
        audio.pause();
        audio.currentTime = 0; // Reinicia o áudio
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Carrega o arquivo JSON
    fetch('../dados.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o JSON: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Contador para cada status
            const contador = {
                zerado: 0,
                platinado: 0,
                playlist: 0
            };

            // Percorre a lista de jogos
            data.forEach(jogo => {
                // Converte o status para minúsculas para evitar problemas de case sensitivity
                const status = Array.isArray(jogo.status) 
                    ? jogo.status.map(s => s.toLowerCase()) 
                    : jogo.status.toLowerCase();

                // Verifica se o status é um array ou uma string
                if (Array.isArray(status)) {
                    // Se for um array, conta cada status
                    status.forEach(s => {
                        if (s === "zerado") contador.zerado++;
                        if (s === "platinado") contador.platinado++;
                        if (s === "playlist") contador.playlist++;
                    });
                } else {
                    // Se for uma string, conta diretamente
                    if (status === "zerado") contador.zerado++;
                    if (status === "platinado") contador.platinado++;
                    if (status === "playlist") contador.playlist++;
                }
            });

            // Atualiza os valores nos cards
            document.getElementById("zerados").textContent = contador.zerado;
            document.getElementById("platinados").textContent = contador.platinado;
            document.getElementById("playlists").textContent = contador.playlist;
        })
        .catch(error => console.error(error));
});