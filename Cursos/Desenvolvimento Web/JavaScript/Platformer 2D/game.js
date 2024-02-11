const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32; 
const mapFile = 'https://gist.githubusercontent.com/the-akira/3f270ea141559343c056fd55cf6743db/raw/d103c095c56c57f2bab03ceb97c8e64c9e1ba75e/mapa.csv'; 

// Definir as teclas de controle
const controls = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

let map = []; // Array bidimensional que armazena o mapa
let camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

// Criar objetos Image para as imagens do jogador e do tile
const playerImage = new Image();
playerImage.src = 'sprites/wizard.png';

const tileImage = new Image();
tileImage.src = 'sprites/wall.png';

// Carregar o mapa e as imagens antes de iniciar o jogo
Promise.all([loadMap(mapFile), loadImage(playerImage), loadImage(tileImage)])
    .then(() => {
        // Iniciar o loop do jogo
        update();
    })
    .catch(error => {
        console.error(error);
    });

// Função para carregar imagens
function loadImage(image) {
    return new Promise((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = reject;
    });
}

// Função para carregar o mapa
function loadMap(file) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', file);
        xhr.onload = () => {
            if (xhr.status === 200) {
                map = xhr.responseText.trim().split('\n').map(row => row.split(',').map(Number));
                resolve();
            } else {
                reject(new Error(`Failed to load ${file}`));
            }
        };
        xhr.onerror = () => {
            reject(new Error(`Failed to load ${file}`));
        };
        xhr.send();
    });
}

// Função para verificar colisões do player com os tiles
function checkCollisions() {
    const playerLeft = player.x;
    const playerRight = player.x + player.width;
    const playerTop = player.y;
    const playerBottom = player.y + player.height;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                const tileLeft = x * TILE_SIZE;
                const tileRight = tileLeft + TILE_SIZE;
                const tileTop = y * TILE_SIZE;
                const tileBottom = tileTop + TILE_SIZE;

                // Verifica se houve colisão
                if (playerRight > tileLeft &&
                    playerLeft < tileRight &&
                    playerBottom > tileTop &&
                    playerTop < tileBottom) {

                    const playerCenterX = player.x + player.width / 2;
                    const playerCenterY = player.y + player.height / 2;
                    const dx = playerCenterX - (tileLeft + TILE_SIZE / 2);
                    const dy = playerCenterY - (tileTop + TILE_SIZE / 2);
                    const width = (player.width + TILE_SIZE) / 2;
                    const height = (player.height + TILE_SIZE) / 2;
                    const crossWidth = width * dy;
                    const crossHeight = height * dx;

                    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
                        if (crossWidth > -crossHeight) {
                            if (crossWidth > crossHeight) {
                                // Colisão por cima
                                player.y = tileBottom;
                                player.velocityY = 0;
                            } else {
                                // Colisão pela esquerda
                                player.x = tileRight;
                            }
                        } else {
                            if (crossWidth > crossHeight) {
                                // Colisão pela direita
                                player.x = tileLeft - player.width;
                            } else {
                                // Colisão por baixo
                                player.y = tileTop - player.height;
                                player.isJumping = false;
                                player.velocityY = 0;
                            }
                        }
                    }
                }
            }
        }
    }
}

// Classe do jogador
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 56;
        this.speed = 5;
        this.jumpHeight = 6.5;
        this.isJumping = false;
        this.velocityY = 0;
        this.image = playerImage;
        this.direction = 'right'; // Inicialmente o jogador está voltado para a direita
    }

    update() {
        // Movimento horizontal
        if (controls.ArrowLeft) {
            this.x -= this.speed;
            this.direction = 'left'; // Define a direção como esquerda
        }
        if (controls.ArrowRight) {
            this.x += this.speed;
            this.direction = 'right'; // Define a direção como direita
        }

        // Simular gravidade e pulo
        if (controls.Space && !this.isJumping) {
            this.isJumping = true;
            this.velocityY = -this.jumpHeight * 2;
        }

        // Aplicar gravidade
        this.velocityY += 0.5;
        this.y += this.velocityY;

        // Verificar colisões
        checkCollisions();

        // Garantir que o jogador não ultrapasse os limites do mapa
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > map[0].length * TILE_SIZE) {
            this.x = map[0].length * TILE_SIZE - this.width;
        }
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > map.length * TILE_SIZE) {
            this.y = map.length * TILE_SIZE - this.height;
        }
    }

    draw() {
        // Desenhar a imagem do jogador
        // Rotacionar o jogador de acordo com a direção
        if (this.direction === 'right') {
            ctx.drawImage(this.image, this.x - camera.x, this.y - camera.y, this.width, this.height);
        } else {
            ctx.save(); // Salva o estado do contexto
            ctx.scale(-1, 1); // Inverte o eixo x
            ctx.drawImage(this.image, -(this.x + this.width - camera.x), this.y - camera.y, this.width, this.height); // Desenha o jogador invertido
            ctx.restore(); // Restaura o estado do contexto
        }
    }
}

// Classe do projétil
class Projectile {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 5;
        this.speed = 10;
        this.direction = direction; // Direção do projétil (pode ser 'left' ou 'right')
    }

    // Atualiza a posição do projétil
    update() {
        if (this.direction === 'left') {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }
    }

    // Desenha o projétil
    draw() {
        ctx.fillStyle = '#f00'; // Cor do projétil
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
    }
}

// Lista de projéteis
let projectiles = [];
let projectileCooldown = 0;
let projectileCooldownTime = 180; // Tempo de cooldown em milissegundos (0.5 segundos)
let deltaTime = 10;

// Função para lançar projéteis
function launchProjectile() {
    // Verificar se o cooldown está ativo
    if (projectileCooldown > 0) {
        return; // Sai da função se o cooldown estiver ativo
    }

    // Criar um novo projétil e adicioná-lo à lista
    let projectile = new Projectile(player.x + player.width / 2, player.y + player.height / 2, player.direction);
    projectiles.push(projectile);

    // Definir o cooldown após o lançamento do projétil
    projectileCooldown = projectileCooldownTime;
}

function updateProjectiles() {
    // Atualizar o cooldown
    if (projectileCooldown > 0) {
        projectileCooldown -= deltaTime; // deltaTime é o tempo decorrido desde a última atualização
    }

    // Usar um loop for para percorrer os projéteis
    for (let i = 0; i < projectiles.length; i++) {
        const projectile = projectiles[i];
        if (projectile) { // Verificar se o projétil é válido
            projectile.update();
            projectile.draw();

            // Verificar colisões do projétil
            checkProjectileCollisions(projectile);

            // Remover o projétil se estiver fora da tela
            if (projectile.x < 0 || projectile.x > map[0].length * TILE_SIZE || projectile.y < 0 || projectile.y > map.length * TILE_SIZE) {
                projectiles.splice(i, 1);
                i--; // Decrementar o índice para compensar a remoção do projétil
            }
        }
    }
}

// Função para verificar colisões do projétil
function checkProjectileCollisions(projectile) {
    // Percorra o mapa e verifique as colisões
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                const tileLeft = x * TILE_SIZE;
                const tileRight = x * TILE_SIZE + TILE_SIZE;
                const tileTop = y * TILE_SIZE;
                const tileBottom = y * TILE_SIZE + TILE_SIZE;

                // Verifica se houve colisão
                if (
                    projectile.x + projectile.width > tileLeft &&
                    projectile.x < tileRight &&
                    projectile.y + projectile.height > tileTop &&
                    projectile.y < tileBottom
                ) {
                    // Se houver colisão, remova o projétil
                    const index = projectiles.indexOf(projectile);
                    if (index !== -1) {
                        projectiles.splice(index, 1);
                    }
                    return; // Sai da função após remover o projétil
                }
            }
        }
    }
}

// Inicializar o jogador
const player = new Player(50, 50);

// Função para renderizar o mapa
function drawMap() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                // Desenhe a imagem do tile
                ctx.drawImage(tileImage, x * TILE_SIZE - camera.x, y * TILE_SIZE - camera.y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

// Função principal para atualizar e renderizar o jogo
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar o jogador
    player.update();

    // Atualizar a posição da câmera
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;

    // Garantir que a câmera não saia dos limites do mapa
    if (camera.x < 0) camera.x = 0;
    if (camera.y < 0) camera.y = 0;
    if (camera.x > map[0].length * TILE_SIZE - camera.width) camera.x = map[0].length * TILE_SIZE - camera.width;
    if (camera.y > map.length * TILE_SIZE - camera.height) camera.y = map.length * TILE_SIZE - camera.height;

    // Atualizar e desenhar os projéteis
    updateProjectiles();

    // Desenhar o mapa
    drawMap();

    // Desenhar o jogador
    player.draw();

    requestAnimationFrame(update);
}

// Event listeners para as teclas de controle
document.addEventListener('keydown', event => {
    if (event.code in controls) {
        event.preventDefault();
        controls[event.code] = true;
    }

    if (event.code === 'KeyX') {
        launchProjectile();
    }
});

document.addEventListener('keyup', event => {
    if (event.code in controls) {
        event.preventDefault();
        controls[event.code] = false;
    }
});