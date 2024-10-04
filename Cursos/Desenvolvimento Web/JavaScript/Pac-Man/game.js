const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameStarted = false; 
let gameOver = false; 
const tileSize = 30;
let powerPillActive = false;
let powerPillTimer = 0;
const powerPillDuration = 7000;
let score = 0;

let maze = [
    "11111111111111111111111111111",
    "14000000000000000000000000041",
    "10111111011111111111011111101",
    "10000041000000000000014000001",
    "10111101011111011111010111101",
    "10000101000000000000010100001",
    "10110101011111011111010101101",
    "10000100000000000000000100001",
    "10110101010111211101010101101",
    "100000010101g333g101010101101",
    "101101010101g333g101010000001",
    "10110101010111111101010101101",
    "10000100000000000000000100001",
    "10110101011111011111010101101",
    "10000101000000000000010100001",
    "10111101011111011111010111101",
    "10000041000000000000014000001",
    "10111111011111111111011111101",
    "14000000000000p00000000000041",
    "11111111111111111111111111111"
];

const rows = maze.length; // Número de linhas
const cols = maze[0].length; // Número de colunas
const canvasWidth = cols * tileSize; // Largura do canvas
const canvasHeight = rows * tileSize; // Altura do canvas
canvas.width = canvasWidth;
canvas.height = canvasHeight;

maze = maze.map(row => row.split('').map(cell => {
    if (cell === 'p') return 'p';  // Pac-Man
    if (cell === 'g') return 'g';  // Fantasmas
    return Number(cell);  // Todos os outros (convertendo para números)
}));

let player = { x: 0, y: 0, direction: 'right', speed: 2, frame: 0 };
let ghosts = [];
let ghostDirections = ['left', 'right', 'up', 'down'];

const pacmanSprites = [];
for (let i = 0; i < 8; i++) {
    const img = new Image();
    img.src = `sprites/pacman/${i}.png`;
    pacmanSprites.push(img);
}

function initializeGame() {
    let ghostIndex = 0;
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 'p') {
                player.x = col;
                player.y = row;
                maze[row][col] = 3; // Espaço vazio
            }
            if (maze[row][col] === 'g') {
                const type = ghostTypes[ghostIndex % ghostTypes.length]; // Define o tipo de fantasma
                ghosts.push({
                    x: col,
                    y: row,
                    direction: ghostDirections[Math.floor(Math.random() * 4)],
                    type: type, // Adiciona o tipo de fantasma
                });
                maze[row][col] = 3; // Espaço vazio
                ghostIndex++;
            }
        }
    }
}

function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            switch (maze[row][col]) {
                case 1: 
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                    break;
                case 0: 
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.arc(
                        col * tileSize + tileSize / 2,
                        row * tileSize + tileSize / 2,
                        tileSize / 6,
                        0, Math.PI * 2
                    );
                    ctx.fill();
                    break;
                case 4: 
                    ctx.fillStyle = 'orange';
                    ctx.beginPath();
                    ctx.arc(
                        col * tileSize + tileSize / 2,
                        row * tileSize + tileSize / 2,
                        tileSize / 3,
                        0, Math.PI * 2
                    );
                    ctx.fill();
                    break;
            }
        }
    }
}

function countCoins(grid) {
    let coinCount = 0;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 0 || grid[row][col] === 4) {
                coinCount++;
            }
        }
    }

    return coinCount;
}

const coinTotal = countCoins(maze);

let spriteFrameInterval = 100; // Tempo em milissegundos para mudar de quadro
let lastFrameUpdateTime = 0; // Armazena o tempo da última atualização do quadro

function drawPlayer(timestamp) {
    // Atualiza o quadro da animação se o tempo decorrido for maior que o intervalo
    if (lastFrameUpdateTime === 0) lastFrameUpdateTime = timestamp;
    const deltaTime = timestamp - lastFrameUpdateTime;

    if (deltaTime > spriteFrameInterval) {
        player.frame++; // Muda para o próximo quadro
        lastFrameUpdateTime = timestamp; // Atualiza o tempo da última atualização
    }

    let sprite = pacmanSprites[player.frame % 4];
    ctx.save();

    const posX = player.x * tileSize;
    const posY = player.y * tileSize;

    ctx.translate(posX + tileSize / 2, posY + tileSize / 2);
    switch (currentDirection) {
        case 'up':
            ctx.rotate(-Math.PI / 2);
            break;
        case 'down':
            ctx.rotate(Math.PI / 2);
            break;
        case 'left':
            ctx.rotate(Math.PI);
            break;
    }

    ctx.drawImage(sprite, -tileSize / 2, -tileSize / 2, tileSize, tileSize);
    ctx.restore();
}

let currentDirection = null;
let nextDirection = null;

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            nextDirection = 'up';
            break;
        case 'ArrowDown':
            nextDirection = 'down';
            break;
        case 'ArrowLeft':
            nextDirection = 'left';
            break;
        case 'ArrowRight':
            nextDirection = 'right';
            break;
    }
});

function canMove(x, y) {
    if (x < 0 || x >= cols || y < 0 || y >= rows) return false;
    return maze[y][x] !== 1; 
}

function updatePlayerPosition() {
    if (nextDirection) {
        let newX = player.x;
        let newY = player.y;

        switch (nextDirection) {
            case 'up':
                if (canMove(player.x, player.y - 1)) {
                    currentDirection = 'up';
                }
                break;
            case 'down':
                if (canMove(player.x, player.y + 1)) {
                    currentDirection = 'down';
                }
                break;
            case 'left':
                if (canMove(player.x - 1, player.y)) {
                    currentDirection = 'left';
                }
                break;
            case 'right':
                if (canMove(player.x + 1, player.y)) {
                    currentDirection = 'right';
                }
                break;
        }

        player.x = newX;
        player.y = newY;

        // Não reiniciar a direção
        // nextDirection = null; 
    }
    if (currentDirection) {
        // Move automaticamente se a direção atual não for nula
        updatePlayerPositionInCurrentDirection();
    }
}

function updatePlayerPositionInCurrentDirection() {
    let newX = player.x;
    let newY = player.y;

    switch (currentDirection) {
        case 'up':
            if (canMove(player.x, player.y - 1)) newY--;
            break;
        case 'down':
            if (canMove(player.x, player.y + 1)) newY++;
            break;
        case 'left':
            if (canMove(player.x - 1, player.y)) newX--;
            break;
        case 'right':
            if (canMove(player.x + 1, player.y)) newX++;
            break;
    }

    // Verifica a coleta de moedas
    if (maze[newY][newX] === 0) {
        // Remove a moeda (círculo branco)
        maze[newY][newX] = 3; // Espaço vazio
        score += 1;
    } else if (maze[newY][newX] === 4) {
        // Remove a pílula (círculo laranja)
        maze[newY][newX] = 3; // Espaço vazio
        score += 1;
        activatePowerPill();
    }

    player.x = newX;
    player.y = newY;
}

function activatePowerPill() {
    powerPillActive = true;
    powerPillTimer = powerPillDuration; // Define a duração do efeito
    ghosts.forEach(ghost => {
        ghost.inFleeMode = true; // Coloca todos os fantasmas em modo de fuga
    });
}

const ghostTypes = ['clyde', 'inky', 'pinky', 'blinky'];
const ghostImages = {};
const numGhostFrames = 3;

const ghostFleeImages = [
    new Image(),
    new Image(),
    new Image()
];
ghostFleeImages[0].src = 'sprites/fear/0.png'; 
ghostFleeImages[1].src = 'sprites/fear/1.png'; 
ghostFleeImages[2].src = 'sprites/fear/2.png';

const ghostCapturedImage = [
    new Image(),
    new Image(),
    new Image()
];
ghostCapturedImage[0].src = 'sprites/running/0.png'; 
ghostCapturedImage[1].src = 'sprites/running/1.png'; 
ghostCapturedImage[2].src = 'sprites/running/2.png'; 

ghostTypes.forEach(type => {
    ghostImages[type] = [];
    for (let i = 0; i < numGhostFrames; i++) {
        const img = new Image();
        img.src = `sprites/${type}/${i}.png`;
        ghostImages[type].push(img);
    }
});

let ghostFrame = 0; // Frame atual da animação
const ghostAnimationSpeed = 10; // Velocidade da animação
let ghostAnimationCounter = 0; // Contador para controle de animação

function drawGhosts() {
    ghosts.forEach(ghost => {
        const ghostType = ghost.type;

        if (ghost.captured) {
            ctx.drawImage(
                ghostCapturedImage[ghostFrame], // Sprite correspondente ao frame atual
                ghost.x * tileSize,
                ghost.y * tileSize,
                tileSize,
                tileSize
            );
        }
        else if (powerPillActive && ghost.inFleeMode) {
            ctx.drawImage(
                ghostFleeImages[ghostFrame], // Sprite de fuga correspondente ao frame atual
                ghost.x * tileSize,
                ghost.y * tileSize,
                tileSize,
                tileSize
            );
        } else {
            const img = ghostImages[ghostType][ghostFrame];
            ctx.drawImage(
                img,
                ghost.x * tileSize,
                ghost.y * tileSize,
                tileSize,
                tileSize
            );
        }
    });

    // Controle de animação: altere o frame a cada `ghostAnimationSpeed` ticks
    ghostAnimationCounter++;
    if (ghostAnimationCounter >= ghostAnimationSpeed) {
        ghostAnimationCounter = 0;
        ghostFrame = (ghostFrame + 1) % numGhostFrames; // Muda para o próximo frame
    }
}

function canMoveGhost(ghost, direction) {
    let newX = ghost.x;
    let newY = ghost.y;

    switch (direction) {
        case 'up':
            newY--;
            break;
        case 'down':
            newY++;
            break;
        case 'left':
            newX--;
            break;
        case 'right':
            newX++;
            break;
    }

    return canMove(newX, newY); // Certifique-se de que a função canMove está definida
}

function getValidDirections(ghost) {
    const validDirections = [];
    const directions = ['up', 'down', 'left', 'right'];

    directions.forEach(direction => {
        if (canMoveGhost(ghost, direction)) {
            validDirections.push(direction);
        }
    });

    return validDirections;
}

function isPlayerInSight(ghost, player) {
    return (ghost.x === player.x && Math.abs(ghost.y - player.y) < 9) || 
           (ghost.y === player.y && Math.abs(ghost.x - player.x) < 9);
}

function moveTowardsPlayer(ghost, player) {
    const validDirections = getValidDirections(ghost);
    let chosenDirection = null;

    // Prioritize moving towards the player if in sight
    if (ghost.x < player.x && validDirections.includes('right')) {
        chosenDirection = 'right';
    } else if (ghost.x > player.x && validDirections.includes('left')) {
        chosenDirection = 'left';
    } else if (ghost.y < player.y && validDirections.includes('down')) {
        chosenDirection = 'down';
    } else if (ghost.y > player.y && validDirections.includes('up')) {
        chosenDirection = 'up';
    }

    // If no direction towards player, pick a random valid direction
    if (!chosenDirection) {
        const randomDirections = validDirections.length > 0 ? validDirections : ['up', 'down', 'left', 'right'];
        chosenDirection = randomDirections[Math.floor(Math.random() * randomDirections.length)];
    }

    switch (chosenDirection) {
        case 'up':
            ghost.y--;
            break;
        case 'down':
            ghost.y++;
            break;
        case 'left':
            ghost.x--;
            break;
        case 'right':
            ghost.x++;
            break;
    }
}

function checkPlayerCollisionWithGhosts() {
    for (const ghost of ghosts) {
        if (Math.abs(player.x - ghost.x) < player.speed && Math.abs(player.y - ghost.y) < player.speed) {
            if (powerPillActive && ghost.inFleeMode) {
                // Captura o fantasma em modo de fuga e envia de volta à posição inicial
                console.log('colisão especial!')
                ghost.captured = true; // Marca o fantasma como capturado
                ghost.inFleeMode = false; // Sai do modo de fuga
                ghost.returningToBase = true; // Ativa o estado de retorno à base

                // Muda o sprite do fantasma capturado para indicar captura (pode ser um sprite com olhos)
                setTimeout(() => {
                    ghost.returningToBase = false; // Desativa o estado de retorno após um tempo
                    ghost.captured = false; // Restaura o estado normal
                }, 5000); // Exemplo: retorna ao normal após 3 segundos
            } else if (!ghost.captured) {
                // Se o jogador colidir com um fantasma que não está em fuga, game over
                console.log('Colisão detectada!');
                gameOver = true;
                break;
            }
        }
    }
}

let originalMaze = JSON.parse(JSON.stringify(maze)); // Faz uma cópia do labirinto

function resetMaze() {
    maze = JSON.parse(JSON.stringify(originalMaze)); // Restaura o labirinto
}

const initialGhostPositions = [
    { x: 15, y: 10, type: 'blinky' },
    { x: 13, y: 10, type: 'clyde' },
    { x: 15, y: 9, type: 'inky' },
    { x: 14, y: 9, type: 'pinky' }
];

function resetGhosts() {
    ghosts = initialGhostPositions.map(position => {
        return {
            x: position.x,
            y: position.y,
            direction: ghostDirections[Math.floor(Math.random() * 4)], // Nova direção aleatória
            type: position.type // Define o tipo de fantasma
        };
    });
}

function startGame() {
    gameStarted = true;
    initializeGame();
}

function resetGame() {
    player.x = 14; // Redefine a posição inicial do jogador
    player.y = 18;
    score = 0;
    resetMaze(); // Reseta o mapa
    resetGhosts();
    gameOver = false; // Redefine o estado do jogo
    currentDirection = null;
    nextDirection = null;
    lastUpdateTime = 0; // Redefine o tempo para sincronizar com o próximo loop
}

function drawGameOverScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Preenche a tela toda de preto

    ctx.fillStyle = '#E0DF19';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 60);

    ctx.font = '20px Arial';
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 15);

    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 35);
}

function drawStartScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Preenche a tela toda de preto

    ctx.fillStyle = '#E0DF19';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Pac-Man Game', canvas.width / 2, canvas.height / 2 - 60);

    ctx.font = '20px Arial';
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText('Use Arrow Keys to Move', canvas.width / 2, canvas.height / 2 - 15);

    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Press Enter to Start', canvas.width / 2, canvas.height / 2 + 35);
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !gameStarted) {
        startGame();
    }
    if (e.key === 'Enter' && gameOver) {
        resetGame();
    }
});

function moveGhosts() {
    ghosts.forEach(ghost => {
        let chosenDirection;
        const randomFactor = Math.random() < 0.2;

        if (ghost.returningToBase) {
            // Movimento para retornar à posição inicial se capturado
            moveToBase(ghost);
        }
        else if (ghost.inFleeMode && powerPillActive) {
            const validDirections = getValidDirections(ghost);
            if (validDirections.length > 0) {
                chosenDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
            }
        } else {
            // Comportamento normal de perseguição
            if (!randomFactor && isPlayerInSight(ghost, player)) {
                moveTowardsPlayer(ghost, player);
            } else {
                const validDirections = getValidDirections(ghost).filter(direction => direction !== getOppositeDirection(ghost.previousDirection));
                if (validDirections.length > 0) {
                    const closestCoinDirection = !randomFactor ? getClosestCoinDirection(ghost, validDirections) : null;

                    if (closestCoinDirection) {
                        chosenDirection = closestCoinDirection; // Movimenta em direção à moeda mais próxima
                    } else {
                        // Se não houver moedas próximas ou se o fator aleatório for acionado, escolhe uma direção aleatória válida
                        chosenDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
                    }
                }
            }
        }

        // Move o fantasma de acordo com a direção escolhida
        if (chosenDirection) {
            switch (chosenDirection) {
                case 'up':
                    ghost.y--;
                    break;
                case 'down':
                    ghost.y++;
                    break;
                case 'left':
                    ghost.x--;
                    break;
                case 'right':
                    ghost.x++;
                    break;
            }

            ghost.previousDirection = chosenDirection;
        }
    });
}

function moveToBase(ghost) {
    const initialPosition = initialGhostPositions[ghosts.indexOf(ghost)];

    // Se o fantasma não tem um caminho para a base, calcula a rota usando A*
    if (!ghost.path || ghost.path.length === 0) {
        ghost.path = calculatePath(ghost, initialPosition);
    }

    // Se há um caminho definido, move o fantasma para a próxima posição
    if (ghost.path && ghost.path.length > 0) {
        const nextMove = ghost.path.shift(); // Pega a próxima direção a seguir
        switch (nextMove) {
            case 'up':
                ghost.y--;
                break;
            case 'down':
                ghost.y++;
                break;
            case 'left':
                ghost.x--;
                break;
            case 'right':
                ghost.x++;
                break;
        }
    }

    // Se chegou à posição inicial, remove o estado de retorno e limpa o caminho
    if (ghost.x === initialPosition.x && ghost.y === initialPosition.y) {
        ghost.returningToBase = false;
        ghost.path = []; // Limpa o caminho
    }
}

// Função que calcula a rota mais curta usando o algoritmo A*
function calculatePath(ghost, target) {
    // Cria um mapa de custos e um conjunto de nós visitados
    const startNode = { x: ghost.x, y: ghost.y, path: [], cost: 0 };
    const visited = new Set(); // Guarda posições já visitadas
    const queue = [startNode];

    // Função auxiliar para gerar a chave única de cada posição
    const positionKey = (x, y) => `${x},${y}`;

    // Adiciona a posição inicial ao conjunto de visitados
    visited.add(positionKey(ghost.x, ghost.y));

    while (queue.length > 0) {
        // Remove o nó com menor custo
        queue.sort((a, b) => a.cost - b.cost); // Ordena a fila pelo custo
        const currentNode = queue.shift();

        // Se chegou ao destino, retorna o caminho
        if (currentNode.x === target.x && currentNode.y === target.y) {
            return currentNode.path;
        }

        // Explora todas as direções possíveis (cima, baixo, esquerda, direita)
        const directions = [
            { x: 0, y: -1, direction: 'up' },
            { x: 0, y: 1, direction: 'down' },
            { x: -1, y: 0, direction: 'left' },
            { x: 1, y: 0, direction: 'right' }
        ];

        for (const { x, y, direction } of directions) {
            const newX = currentNode.x + x;
            const newY = currentNode.y + y;

            // Verifica se a posição é válida e ainda não foi visitada
            if (canMove(newX, newY) && !visited.has(positionKey(newX, newY))) {
                visited.add(positionKey(newX, newY));
                const newPath = [...currentNode.path, direction];
                queue.push({ x: newX, y: newY, path: newPath, cost: newPath.length });
            }
        }
    }

    return []; // Retorna uma lista vazia se não há caminho
}

// Função para encontrar a direção mais próxima de uma moeda
function getClosestCoinDirection(ghost, validDirections) {
    let closestCoin = null;
    let closestDistance = Infinity;

    validDirections.forEach(direction => {
        let newX = ghost.x;
        let newY = ghost.y;

        switch (direction) {
            case 'up':
                newY--;
                break;
            case 'down':
                newY++;
                break;
            case 'left':
                newX--;
                break;
            case 'right':
                newX++;
                break;
        }

        // Verifica se a nova posição tem uma moeda (0 ou 4) e calcula a distância
        if (maze[newY][newX] === 0 || maze[newY][newX] === 4) {
            const distance = Math.abs(newX - ghost.x) + Math.abs(newY - ghost.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCoin = direction;
            }
        }
    });

    return closestCoin;
}

// Função para retornar a direção oposta, evitando reversão imediata
function getOppositeDirection(direction) {
    switch (direction) {
        case 'up': return 'down';
        case 'down': return 'up';
        case 'left': return 'right';
        case 'right': return 'left';
        default: return null;
    }
}

let lastUpdateTime = 0; // Armazena o tempo da última atualização
const moveInterval = 200; // Intervalo em milissegundos para mover o jogador

function gameLoop(timestamp) {
    if (!gameStarted) {
        drawStartScreen(); // Desenha a tela de início se o jogo não começou
    } else if (!gameOver) {
        if (lastUpdateTime === 0) lastUpdateTime = timestamp;
        const deltaTime = timestamp - lastUpdateTime;

        if (deltaTime > moveInterval) {
            updatePlayerPosition();
            moveGhosts();
            checkPlayerCollisionWithGhosts();
            lastUpdateTime = timestamp;

            // Atualiza o timer do efeito de pílula, se estiver ativo
            if (powerPillActive) {
                powerPillTimer -= deltaTime;
                if (powerPillTimer <= 0) {
                    powerPillActive = false;
                    ghosts.forEach(ghost => ghost.inFleeMode = false); // Todos os fantasmas voltam ao normal
                }
            }
        }

        if (score === coinTotal) {
            gameOver = true;
        }

        // Renderiza o jogo
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMaze();
        drawPlayer(timestamp);
        drawGhosts();
    } else {
        drawGameOverScreen();
    }

    requestAnimationFrame(gameLoop); // Solicita o próximo quadro
}

requestAnimationFrame(gameLoop);