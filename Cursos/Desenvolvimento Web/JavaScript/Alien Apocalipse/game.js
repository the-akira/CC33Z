// Obter o contexto 2D do Canvas
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

// Variáveis do jogador
var player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 5,
    canShoot: true,
    cooldown: 500, // Tempo de cooldown do tiro em milissegundos
    life: 3,
    score: 0,
    bulletPower: 1
};

var playerImg = new Image();
playerImg.src = 'sprites/ship.png';

// Inimigos
var enemyImg = new Image();
enemyImg.src = 'sprites/alien.png';
enemyWidth = 49;
enemyHeight = 42;

var strongEnemyImg = new Image();
strongEnemyImg.src = 'sprites/octupus.png';
var strongEnemyWidth = 47; 
var strongEnemyHeight = 50;

// Carregar a imagem do novo inimigo
var diagonalEnemyImg = new Image();
diagonalEnemyImg.src = 'sprites/serpent.png'; 
var diagonalEnemyWidth = 43;
var diagonalEnemyHeight = 55;

// Adicionar uma nova propriedade para armazenar os inimigos diagonais
var diagonalEnemies = [];

// Nova imagem para o inimigo diagonal de baixo para cima
var diagonalEnemy2Img = new Image();
diagonalEnemy2Img.src = 'sprites/hypno.png'; 
var diagonalEnemy2Width = 36;
var diagonalEnemy2Height = 55;

// Array para armazenar os inimigos diagonais de baixo para cima
var diagonalEnemies2 = [];

// Array para armazenar as estrelas
var stars = [];

// Imagem da estrela
var starImg = new Image();
starImg.src = 'sprites/star.png';

// Função para criar uma nova estrela
function createStar() {
    var buffer = 50; // Margem de segurança para que a estrela não fique muito próxima das bordas
    var starWidth = 25;
    var starHeight = 23;

    var star = {
        x: Math.random() * (canvas.width - starWidth - 2 * buffer) + buffer,
        y: Math.random() * (canvas.height - starHeight - 2 * buffer) + buffer,
        width: 25,
        height: 23,
        available: true
    };
    stars.push(star);
}

// Array para armazenar os olhos
var eyes = [];

// Imagem da estrela
var eyeImg = new Image();
eyeImg.src = 'sprites/eye.png';

// Função para criar uma nova estrela
function createEye() {
    var buffer = 50; // Margem de segurança para que a estrela não fique muito próxima das bordas
    var eyeWidth = 24;
    var eyeHeight = 24;

    var eye = {
        x: Math.random() * (canvas.width - eyeWidth - 2 * buffer) + buffer,
        y: Math.random() * (canvas.height - eyeHeight - 2 * buffer) + buffer,
        width: 24,
        height: 24,
        available: true
    };
    eyes.push(eye);
}

// Variáveis dos tiros
var bullets = [];

// Variáveis dos inimigos
var enemies = [];

// Mapeamento das teclas pressionadas
var keys = {};

// Variável para controlar se o ouvinte de evento de teclado do game over foi adicionado
var gameOverListenerAdded = false;

// Função para desenhar o jogador
function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Função para desenhar as estrelas
function drawStars() {
    stars.forEach(function(star) {
        if (star.available) {
            ctx.drawImage(starImg, star.x, star.y, star.width, star.height);
        }
    });
}

// Função para desenhar os olhos
function drawEyes() {
    eyes.forEach(function(eye) {
        if (eye.available) {
            ctx.drawImage(eyeImg, eye.x, eye.y, eye.width, eye.height);
        }
    });
}

// Função para desenhar a pontuação na tela
function drawScore() {
    ctx.fillStyle = '#F4FFBC';
    ctx.font = 'bold 20px Arial';
    ctx.shadowColor = "pink";
    ctx.shadowBlur = 7;
    ctx.lineWidth = 5;
    ctx.fillText('Score: ' + player.score, 10, 387);
}

// Função para desenhar os tiros
function drawBullets() {
    ctx.fillStyle = '#ff00fb';
    bullets.forEach(function(bullet) {
        ctx.fillRect(bullet.x, bullet.y, 10, 5);
    });
}

// Função para desenhar os inimigos
function drawEnemies() {
    ctx.fillStyle = 'green';
    enemies.forEach(function(enemy) {
        if (enemy.type === 'normal') {
            ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
        } else if (enemy.type === 'strong') {
            ctx.drawImage(strongEnemyImg, enemy.x, enemy.y, strongEnemyWidth, strongEnemyHeight);
        }
    });
}

// Função para desenhar a vida do jogador na tela
function drawLife() {
    var heartImg = new Image();
    heartImg.src = 'sprites/heart.png'; // Imagem do coração

    // Definir a posição inicial para desenhar os corações
    var heartX = 10;
    var heartY = 10;

    // Loop para desenhar corações com base na vida do jogador
    for (var i = 0; i < player.life; i++) {
        ctx.drawImage(heartImg, heartX, heartY, 30, 30); // Desenha o coração na posição atual

        // Atualiza a posição para o próximo coração
        heartX += 35;
    }
}

// Função para verificar colisões entre balas e inimigos
function checkCollisions() {
    bullets.forEach(function(bullet, bulletIndex) {
        enemies.forEach(function(enemy, enemyIndex) {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + 10 > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + 5 > enemy.y
            ) {
                // Remover a bala e o inimigo em caso de colisão
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                player.score += 10;
            }
        });
    });

    enemies.forEach(function(enemy, enemyIndex) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            // Reduzir a vida do jogador em 1 e remover o inimigo
            player.life--;
            enemies.splice(enemyIndex, 1);
        }
    });
}

// Função para verificar colisões entre projéteis e inimigos diagonais
function checkDiagonalEnemyCollisions() {
    bullets.forEach(function(bullet, bulletIndex) {
        diagonalEnemies.forEach(function(diagonalEnemy, diagonalEnemyIndex) {
            // Verificar colisão entre balas e inimigos diagonais
            if (
                bullet.x < diagonalEnemy.x + diagonalEnemyWidth &&
                bullet.x + 10 > diagonalEnemy.x &&
                bullet.y < diagonalEnemy.y + diagonalEnemyHeight &&
                bullet.y + 5 > diagonalEnemy.y
            ) {
                // Remover a bala e o inimigo diagonal em caso de colisão
                bullets.splice(bulletIndex, 1);
                diagonalEnemies.splice(diagonalEnemyIndex, 1);
                player.score += 20;
            }
        });
    });

    // Verificar colisão entre jogador e inimigos diagonais
    diagonalEnemies.forEach(function(diagonalEnemy, diagonalEnemyIndex) {
        if (
            player.x < diagonalEnemy.x + diagonalEnemyWidth &&
            player.x + player.width > diagonalEnemy.x &&
            player.y < diagonalEnemy.y + diagonalEnemyHeight &&
            player.y + player.height > diagonalEnemy.y
        ) {
            // Reduzir a vida do jogador em 1 e remover o inimigo diagonal
            player.life--;
            diagonalEnemies.splice(diagonalEnemyIndex, 1);
        }
    });
}

// Função para verificar colisões entre o jogador e inimigos diagonais
function checkDiagonalEnemy2Collisions() {
    bullets.forEach(function(bullet, bulletIndex) {
        diagonalEnemies2.forEach(function(diagonalEnemy, diagonalEnemyIndex) {
            // Verificar colisão entre balas e inimigos diagonais
            if (
                bullet.x < diagonalEnemy.x + diagonalEnemyWidth &&
                bullet.x + 10 > diagonalEnemy.x &&
                bullet.y < diagonalEnemy.y + diagonalEnemyHeight &&
                bullet.y + 5 > diagonalEnemy.y
            ) {
                // Remover a bala e o inimigo diagonal em caso de colisão
                bullets.splice(bulletIndex, 1);
                diagonalEnemies2.splice(diagonalEnemyIndex, 1);
                player.score += 15;
            }
        });
    });

    diagonalEnemies2.forEach(function(diagonalEnemy2, diagonalEnemyIndex2) {
        if (
            player.x < diagonalEnemy2.x + diagonalEnemy2Width &&
            player.x + player.width > diagonalEnemy2.x &&
            player.y < diagonalEnemy2.y + diagonalEnemy2Height &&
            player.y + player.height > diagonalEnemy2.y
        ) {
            // Reduzir a vida do jogador em 1 e remover o inimigo diagonal
            player.life--;
            diagonalEnemies2.splice(diagonalEnemyIndex2, 1);
        }
    });
}

// Função para verificar a colisão com as estrelas
function checkStarCollision() {
    stars.forEach(function(star, index) {
        if (
            star.available && // Verifica se a estrela está disponível para coleta
            player.x < star.x + star.width &&
            player.x + player.width > star.x &&
            player.y < star.y + star.height &&
            player.y + player.height > star.y
        ) {
            player.life++; // Aumenta a vida do jogador
            player.score += 20;
            star.available = false; // Marca a estrela como coletada
            stars.splice(index, 1); // Remove a estrela do array
        }
    });
}

// Função para verificar a colisão com os olhos
function checkEyeCollision() {
    eyes.forEach(function(eye, index) {
        if (
            eye.available && // Verifica se a estrela está disponível para coleta
            player.x < eye.x + eye.width &&
            player.x + player.width > eye.x &&
            player.y < eye.y + eye.height &&
            player.y + player.height > eye.y
        ) {
            player.bulletPower += 1;
            eye.available = false; // Marca a estrela como coletada
            eyes.splice(index, 1); // Remove a estrela do array
        }
    });
}

// Função para atualizar a posição dos tiros
function updateBullets() {
    bullets = bullets.filter(function(bullet) {
        return bullet.x < canvas.width;
    });

    bullets.forEach(function(bullet) {
        bullet.x += 10;
    });
}

// Função para atualizar a posição dos inimigos
function updateEnemies() {
    updateDiagonalEnemies();
    updateDiagonalEnemies2();

    if (Math.random() < 0.011) {
        var newEnemy = {
            x: canvas.width + enemyWidth, // Coordenada X inicial fora do canvas
            y: Math.random() * (canvas.height - enemyHeight), // Coordenada Y inicial dentro dos limites do canvas
            width: enemyWidth,
            height: enemyHeight,
            type: 'normal'
        };
        enemies.push(newEnemy);
    }

    if (Math.random() < 0.0023) { 
        var newStrongEnemy = {
            x: canvas.width + strongEnemyWidth, // Coordenada X inicial fora do canvas
            y: Math.random() * (canvas.height - strongEnemyHeight), // Coordenada Y inicial dentro dos limites do canvas
            width: strongEnemyWidth,
            height: strongEnemyHeight,
            type: 'strong'
        };
        enemies.push(newStrongEnemy);
    }

    enemies.forEach(function(enemy, index) {
        enemy.x -= 2;
        if (enemy.type === 'strong') {
            enemy.x -= 2.75;
        }
        // Remover inimigos que saíram da tela
        if (enemy.x < 0) {
            player.life--;
            enemies.splice(index, 1);
        }
    });
}

// Função para atualizar a posição dos inimigos diagonais
function updateDiagonalEnemies() {
    // Criar um novo inimigo diagonal com uma certa probabilidade
    if (Math.random() < 0.0035) {
        var newDiagonalEnemy = {
            x: Math.random() * (canvas.width - diagonalEnemyWidth), // Posição X aleatória dentro dos limites do canvas
            y: 0, // Posição Y inicial no topo do canvas
            width: diagonalEnemyWidth,
            height: diagonalEnemyHeight,
            speedX: Math.random() * 4 - 2, // Velocidade horizontal aleatória entre -2 e 2
            speedY: Math.random() * 2 + 1 // Velocidade vertical aleatória entre 1 e 3
        };
        diagonalEnemies.push(newDiagonalEnemy);
    }

    // Atualizar a posição dos inimigos diagonais
    diagonalEnemies.forEach(function(enemy, index) {
        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;

        // Remover inimigos diagonais que saíram da tela
        if (enemy.y > canvas.height || enemy.x < -diagonalEnemyWidth || enemy.x > canvas.width) {
            diagonalEnemies.splice(index, 1);
            player.life--;
        }
    });
}

// Função para atualizar a posição dos inimigos diagonais de baixo para cima
function updateDiagonalEnemies2() {
    if (Math.random() < 0.004) {
        var newDiagonalEnemy2 = {
            x: Math.random() * (canvas.width - diagonalEnemy2Width), // Posição X aleatória dentro dos limites do canvas
            y: canvas.height, // Posição Y inicial no fundo do canvas
            width: diagonalEnemy2Width,
            height: diagonalEnemy2Height,
            speedX: Math.random() * 4 - 2, // Velocidade horizontal aleatória entre -2 e 2
            speedY: -1 * (Math.random() * 2 + 1) // Velocidade vertical negativa aleatória entre -1 e -3 (movimento para cima)
        };
        diagonalEnemies2.push(newDiagonalEnemy2);
    }

    // Atualizar a posição dos inimigos diagonais de baixo para cima
    diagonalEnemies2.forEach(function(enemy, index) {
        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;

        // Remover inimigos diagonais que saíram da tela
        if (enemy.y + diagonalEnemy2Height < 0 || enemy.x < -diagonalEnemy2Width || enemy.x > canvas.width) {
            diagonalEnemies2.splice(index, 1);
        }
    });
}

// Função para desenhar a tela de Game Over
function drawGameOver() {
    ctx.fillStyle = '#F4FFBC';

    ctx.font = 'bold 40px Arial';
    ctx.shadowColor = "pink";
    ctx.shadowBlur = 7;
    ctx.lineWidth = 5;
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 50);

    ctx.font = 'bold 20px Arial';
    ctx.fillText('Pressione X para jogar novamente', canvas.width / 2 - 150, canvas.height / 2 - 10);

    ctx.font = 'bold 35px Arial';
    var scoreText = `Score: ${player.score}`;
    var scoreTextWidth = ctx.measureText(scoreText).width;
    ctx.fillText(scoreText, canvas.width / 2 - scoreTextWidth / 2, canvas.height / 2 - 100); 

    saveHighScore(player.score);
}

// Função para desenhar os inimigos diagonais
function drawDiagonalEnemies() {
    diagonalEnemies.forEach(function(enemy) {
        ctx.drawImage(diagonalEnemyImg, enemy.x, enemy.y, diagonalEnemyWidth, diagonalEnemyHeight);
    });
}

// Função para desenhar os inimigos diagonais de baixo para cima
function drawDiagonalEnemies2() {
    diagonalEnemies2.forEach(function(enemy) {
        ctx.drawImage(diagonalEnemy2Img, enemy.x, enemy.y, diagonalEnemy2Width, diagonalEnemy2Height);
    });
}

// Função para verificar o estado do jogo (se o jogo acabou)
function checkGameOver() {
    if (player.life <= 0) {
        drawGameOver();

        // Adicionar o ouvinte de evento de teclado apenas uma vez
        if (!gameOverListenerAdded) {
            document.addEventListener('keydown', restartGame);
            gameOverListenerAdded = true;
        }

        return true;
    }
    return false;
}

// Função para reiniciar o jogo
function restartGame(event) {
    if ((event.key === 'x' || event.key === 'X') && player.life <= 0) {
        resetGame();
        gameOverListenerAdded = false; // Resetar a flag para permitir a adição futura de ouvintes
    }
}

// Função para resetar o jogo
function resetGame() {
    player.life = 3;
    enemies = [];
    player.x = 50;
    player.y = canvas.height / 2;
    player.score = 0;
    stars = [];
    player.bulletPower = 1;
    eyes = [];
    bullets = [];
    diagonalEnemies = [];
    diagonalEnemies2 = [];
}

// Adicione uma variável para controlar o estado do jogo
var gameState = 'menu'; // Começar com o estado do menu

// Função para desenhar o menu inicial
function drawMenu() {
    ctx.fillStyle = '#F4FFBC';
    ctx.font = 'bold 40px Arial';
    ctx.shadowColor = "pink";
    ctx.shadowBlur = 7;
    ctx.lineWidth = 5;

    // Centralizando horizontalmente
    var textWidth = ctx.measureText('Enter para Iniciar').width;
    var textX = (canvas.width - textWidth) / 2;

    // Centralizando verticalmente
    var textY = canvas.height / 2 + 5; // Ajuste manual para o tamanho da fonte

    ctx.fillText('Enter para Iniciar', textX, textY);
}

// Função para atualizar o jogo com base no estado atual
function updateGame() {
    if (gameState === 'menu') {
        // Desenhar o menu inicial
        drawMenu();

    } else if (gameState === 'playing') {
        // Atualizar o jogo principal
        update();
    }
}

// Função principal de atualização do jogo
function update() {
    if (!checkGameOver()) {
        updateBullets();
        updateEnemies();
        checkCollisions();
        checkStarCollision();
        checkEyeCollision();
        checkDiagonalEnemyCollisions();
        checkDiagonalEnemy2Collisions();

        // Movimentação da nave
        if (keys['ArrowUp'] && player.y > 0) {
            player.y -= player.speed;
        }
        if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
            player.y += player.speed;
        }
        if (keys['ArrowLeft'] && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
            player.x += player.speed;
        }
    }
}

// Função principal de desenho do jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (player.life > 0) {
        drawPlayer();
        drawBullets();
        drawEnemies();
        drawLife();
        drawScore();
        drawStars();
        drawEyes();
        drawDiagonalEnemies();
        drawDiagonalEnemies2();
    }

    if (player.life <= 0) {
        drawGameOver();
    }
}

// Adiciona uma nova estrela a cada X segundos
var lastStarTime = 0;
var nextStarInterval = Math.random() * (35000 - 5000) + 5000;

function updateStars(currentTime) {
    if (currentTime - lastStarTime > nextStarInterval) { 
        createStar();
        lastStarTime = currentTime;
        nextStarInterval = Math.random() * (35000 - 5000) + 5000;
    }
}

// Adiciona um novo olho a cada X segundos
var lastEyeTime = 0;
var nextEyeInterval = Math.random() * (80000 - 5000) + 5000;

function updateEyes(currentTime) {
    if (currentTime - lastEyeTime > nextEyeInterval) { 
        createEye();
        lastEyeTime = currentTime;
        nextEyeInterval = Math.random() * (80000 - 5000) + 5000;
    }
}

// Função de loop do jogo
function gameLoop(currentTime) {
    updateStars(currentTime);
    updateEyes(currentTime);

    // Atualizar o jogo com base no estado atual
    updateGame();

    // Limpar o canvas e desenhar de acordo com o estado do jogo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameState === 'menu') {
        drawMenu(); // Desenhar o menu inicial
    } else if (gameState === 'playing') {
        draw(); // Desenhar o jogo principal
    }

    // Agendar o próximo ciclo do jogo
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// Event listeners para capturar teclas pressionadas
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === " ") {
        event.preventDefault();
    }

    // Atirar ao mesmo tempo
    if (event.code === 'Space' && player.canShoot) {
        // Disparar múltiplos projéteis com base na potência do tiro
        for (let i = 0; i < player.bulletPower; i++) {
            // Ajuste da posição vertical para manter os tiros centralizados
            let offsetY = (player.bulletPower - 1) * 10 / 2; // Espaço total entre os tiros dividido por 2

            bullets.push({ x: player.x + player.width, y: player.y + player.height / 2 - offsetY + 10 * i });
        }

        player.canShoot = false;
        setTimeout(function() {
            player.canShoot = true;
        }, player.cooldown);
    }
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

// Event listener para detectar quando o jogador pressiona Enter
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (gameState === 'menu') {
            // Mudar o estado do jogo para "jogando"
            gameState = 'playing';
            // Reiniciar o jogo
            resetGame();
        }
    }
});

// Função para armazenar as maiores pontuações no localStorage
function saveHighScore(score) {
    // Obtém as maiores pontuações do localStorage
    var highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Verifica se a nova pontuação já existe na lista
    if (!highScores.includes(score)) {
        // Adiciona a nova pontuação à lista de maiores pontuações
        highScores.push(score);

        // Ordena as pontuações em ordem decrescente
        highScores.sort(function(a, b) {
            return b - a;
        });

        // Mantém apenas as 5 maiores pontuações
        highScores = highScores.slice(0, 5);

        // Armazena as maiores pontuações atualizadas no localStorage
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }
}

// Função para exibir as maiores pontuações como uma tabela HTML
function displayHighScores() {
    // Obtém as maiores pontuações do localStorage
    var highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Seleciona o elemento onde a tabela será exibida
    var highScoreTable = document.getElementById('highScoreTable');

    // Limpa qualquer conteúdo existente na tabela
    highScoreTable.innerHTML = '';

    // Cria a estrutura da tabela
    var table = document.createElement('table');
    var headerRow = table.insertRow();
    var header1 = document.createElement('th');
    var header2 = document.createElement('th');
    header1.textContent = 'Rank';
    header2.textContent = 'Pontuação';
    headerRow.appendChild(header1);
    headerRow.appendChild(header2);

    // Preenche a tabela com os dados das maiores pontuações
    for (var i = 0; i < highScores.length; i++) {
        var row = table.insertRow();
        var rankCell = row.insertCell();
        var scoreCell = row.insertCell();
        rankCell.textContent = i + 1;
        scoreCell.textContent = highScores[i];
    }

    // Adiciona a tabela ao elemento HTML
    highScoreTable.appendChild(table);
}

// Chame a função para exibir as maiores pontuações quando o jogo iniciar
displayHighScores();