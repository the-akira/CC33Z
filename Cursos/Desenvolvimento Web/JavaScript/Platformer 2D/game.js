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

// Função para verificar se um tile é sólido
function isSolidTile(x, y) {
    if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) {
        return true; // Considera fora dos limites como sólido
    }
    return map[y][x] === 1;
}

// Função para obter tiles próximos ao jogador (otimização)
function getNearbyTiles(player) {
    const tiles = [];
    const startX = Math.max(0, Math.floor((player.x - TILE_SIZE) / TILE_SIZE));
    const endX = Math.min(map[0].length - 1, Math.floor((player.x + player.width + TILE_SIZE) / TILE_SIZE));
    const startY = Math.max(0, Math.floor((player.y - TILE_SIZE) / TILE_SIZE));
    const endY = Math.min(map.length - 1, Math.floor((player.y + player.height + TILE_SIZE) / TILE_SIZE));

    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            if (isSolidTile(x, y)) {
                tiles.push({
                    x: x * TILE_SIZE,
                    y: y * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE
                });
            }
        }
    }
    return tiles;
}

// Função para verificar colisão entre dois retângulos
function checkRectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Função para verificar colisões horizontais
function checkHorizontalCollisions(player) {
    const tiles = getNearbyTiles(player);
    
    for (let tile of tiles) {
        if (checkRectCollision(player, tile)) {
            // Determinar o lado da colisão baseado na velocidade e posição
            const playerCenterX = player.x + player.width / 2;
            const tileCenterX = tile.x + tile.width / 2;
            
            if (playerCenterX < tileCenterX) {
                // Colisão pela esquerda do tile
                player.x = tile.x - player.width;
            } else {
                // Colisão pela direita do tile
                player.x = tile.x + tile.width;
            }
            
            // Pequeno ajuste para evitar travamento
            const overlap = Math.min(
                (player.x + player.width) - tile.x,
                (tile.x + tile.width) - player.x
            );
            
            if (overlap > 0 && overlap < 2) {
                if (playerCenterX < tileCenterX) {
                    player.x -= 1;
                } else {
                    player.x += 1;
                }
            }
            
            return true;
        }
    }
    return false;
}

// Função para verificar colisões verticais
function checkVerticalCollisions(player) {
    const tiles = getNearbyTiles(player);
    let onGround = false;
    
    for (let tile of tiles) {
        if (checkRectCollision(player, tile)) {
            // Determinar o lado da colisão baseado na velocidade
            if (player.velocityY > 0) {
                // Caindo - colisão com o topo do tile
                player.y = tile.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
                onGround = true;
            } else if (player.velocityY < 0) {
                // Subindo - colisão com a parte inferior do tile
                player.y = tile.y + tile.height;
                player.velocityY = 0;
            }
            
            // Pequeno ajuste para evitar tremulação
            const overlap = Math.min(
                (player.y + player.height) - tile.y,
                (tile.y + tile.height) - player.y
            );
            
            if (overlap > 0 && overlap < 2) {
                if (player.velocityY >= 0) {
                    player.y -= 1;
                } else {
                    player.y += 1;
                }
            }
        }
    }
    
    return onGround;
}

// Classe do jogador com sistema de colisões melhorado
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
        this.direction = 'right';
        this.onGround = false;
        
        // Variáveis para controle mais suave
        this.prevX = x;
        this.prevY = y;
    }

    update() {
        // Salvar posição anterior
        this.prevX = this.x;
        this.prevY = this.y;
        
        // Movimento horizontal
        let horizontalMovement = 0;
        if (controls.ArrowLeft) {
            horizontalMovement = -this.speed;
            this.direction = 'left';
        }
        if (controls.ArrowRight) {
            horizontalMovement = this.speed;
            this.direction = 'right';
        }
        
        // Aplicar movimento horizontal e verificar colisões
        this.x += horizontalMovement;
        checkHorizontalCollisions(this);
        
        // Pulo
        if (controls.Space && this.onGround && !this.isJumping) {
            this.isJumping = true;
            this.velocityY = -this.jumpHeight * 2;
            this.onGround = false;
        }
        
        // Aplicar gravidade
        this.velocityY += 0.5;
        
        // Aplicar movimento vertical e verificar colisões
        this.y += this.velocityY;
        this.onGround = checkVerticalCollisions(this);
        
        // Verificar limites do mapa
        this.checkMapBounds();
    }
    
    checkMapBounds() {
        // Limites horizontais
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > map[0].length * TILE_SIZE) {
            this.x = map[0].length * TILE_SIZE - this.width;
        }
        
        // Limites verticais
        if (this.y < 0) {
            this.y = 0;
            this.velocityY = 0;
        }
        if (this.y + this.height > map.length * TILE_SIZE) {
            this.y = map.length * TILE_SIZE - this.height;
            this.velocityY = 0;
            this.isJumping = false;
            this.onGround = true;
        }
    }

    draw() {
        // Desenhar a imagem do jogador
        if (this.direction === 'right') {
            ctx.drawImage(this.image, this.x - camera.x, this.y - camera.y, this.width, this.height);
        } else {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, -(this.x + this.width - camera.x), this.y - camera.y, this.width, this.height);
            ctx.restore();
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
        this.direction = direction;
    }

    update() {
        if (this.direction === 'left') {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }
    }

    draw() {
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
    }
}

// Lista de projéteis
let projectiles = [];
let projectileCooldown = 0;
let projectileCooldownTime = 180;
let deltaTime = 10;

// Função para lançar projéteis
function launchProjectile() {
    if (projectileCooldown > 0) {
        return;
    }

    let projectile = new Projectile(player.x + player.width / 2, player.y + player.height / 2, player.direction);
    projectiles.push(projectile);
    projectileCooldown = projectileCooldownTime;
}

function updateProjectiles() {
    if (projectileCooldown > 0) {
        projectileCooldown -= deltaTime;
    }

    for (let i = 0; i < projectiles.length; i++) {
        const projectile = projectiles[i];
        if (projectile) {
            projectile.update();
            projectile.draw();

            // Verificar colisões do projétil com tiles
            if (checkProjectileCollisions(projectile)) {
                projectiles.splice(i, 1);
                i--;
                continue;
            }

            // Remover projétil se estiver fora da tela
            if (projectile.x < 0 || projectile.x > map[0].length * TILE_SIZE || 
                projectile.y < 0 || projectile.y > map.length * TILE_SIZE) {
                projectiles.splice(i, 1);
                i--;
            }
        }
    }
}

// Função melhorada para verificar colisões do projétil
function checkProjectileCollisions(projectile) {
    const tileX = Math.floor(projectile.x / TILE_SIZE);
    const tileY = Math.floor(projectile.y / TILE_SIZE);
    const tileXEnd = Math.floor((projectile.x + projectile.width) / TILE_SIZE);
    const tileYEnd = Math.floor((projectile.y + projectile.height) / TILE_SIZE);
    
    for (let y = tileY; y <= tileYEnd; y++) {
        for (let x = tileX; x <= tileXEnd; x++) {
            if (isSolidTile(x, y)) {
                return true;
            }
        }
    }
    return false;
}

// Inicializar o jogador
const player = new Player(50, 50);

// Função para renderizar o mapa
function drawMap() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
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