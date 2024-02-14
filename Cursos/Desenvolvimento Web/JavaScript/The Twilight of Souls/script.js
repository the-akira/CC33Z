function updateHeading() {
    var playerName = document.getElementById('inputName').value;
    
    // Verifica se o nome do jogador não está vazio
    if (playerName.trim() === '') {
        playerName = 'Anonymous';
    }

    // Atualiza o texto do h2 com o valor do input
    document.getElementById('heroName').textContent = playerName;
}