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
    fetch('dados.json')
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
                playlist: 0,
                zerado25: 0,
                platinado25: 0,
                notamedia: 0,
                somaNotasZerados25: 0
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

                        // Verifica se o jogo é zerado e jogado em 2025
                        if (s === "zerado" && jogo.played === "2025") {
                            contador.zerado25++;
                            contador.somaNotasZerados25 += parseFloat(jogo.score);
                        }

                        // Verifica se o jogo é platinado e jogado em 2025
                        if (s === "platinado" && jogo.played === "2025") {
                            contador.platinado25++;
                        }
                    });
                } else {
                    // Se for uma string, conta diretamente
                    if (status === "zerado") contador.zerado++;
                    if (status === "platinado") contador.platinado++;
                    if (status === "playlist") contador.playlist++;

                    // Verifica se o jogo é zerado e jogado em 2025
                    if (status === "zerado" && jogo.played === "2025") {
                        contador.zerado25++;
                        contador.somaNotasZerados25 += parseFloat(jogo.score);
                    }

                    // Verifica se o jogo é platinado e jogado em 2025
                    if (status === "platinado" && jogo.played === "2025") {
                        contador.platinado25++;
                    }
                }
            });

            // Calcula a média das notas dos jogos zerados em 2025
            const mediaZerados25 = contador.zerado25 > 0 ? (contador.somaNotasZerados25 / contador.zerado25).toFixed(2) : 0;
            contador.notamedia = mediaZerados25;

            // Atualiza os valores nos cards
            document.getElementById("zerados").textContent = contador.zerado;
            document.getElementById("platinados").textContent = contador.platinado;
            document.getElementById("playlists").textContent = contador.playlist;
            document.getElementById("zerados25").textContent = contador.zerado25;
            document.getElementById("platinados25").textContent = contador.platinado25;
            document.getElementById("notamedia").textContent = contador.notamedia;
        })
        .catch(error => console.error(error));
});
