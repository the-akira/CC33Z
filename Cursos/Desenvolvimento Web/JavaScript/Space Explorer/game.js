const MAPS = {
    1: {
        width: 1920,
        height: 1080,
        backgroundImage: 'sprites/backgrounds/space1.png',
        blackHoles: [
            { id: 1, x: 150, y: 500, destinationMapId: 2 }, 
            { id: 2, x: 1700, y: 400, destinationMapId: 3 }, 
        ],
        spaceStations: [
            { 
                id: 1, 
                x: 1500, 
                y: 800, 
                StationMapId: 1, 
                photo: 'sprites/spacestations/stationphoto.png',
                text: 'Welcome to Space Station 1!'
            },
        ],
        playerSpawn: {x: 1100, y: 780}
    },
    2: {
        width: 1920,
        height: 1080,
        backgroundImage: 'sprites/backgrounds/space2.png',
        blackHoles: [
            { id: 1, x: 1800, y: 500, destinationMapId: 3 },
        ],
        spaceStations: [
            { 
                id: 1, 
                x: 400, 
                y: 50, 
                StationMapId: 2, 
                photo: 'sprites/spacestations/stationphoto2.png',
                text: 'Space Station 2 awaits!'
            },
        ],
        playerSpawn: {x: 300, y: 300}
    },
    3: {
        width: 816,
        height: 624,
        backgroundImage: 'sprites/backgrounds/desert.png',
        blackHoles: [
            { id: 1, x: 100, y: 200, destinationMapId: 4 },
            // Adicione mais buracos negros, se necessário
        ],
        spaceStations: [
            { 
                id: 1, 
                x: 320, 
                y: 200, 
                StationMapId: 3, 
                photo: 'sprites/spacestations/stationphoto.png',
                text: 'You have arrived at Space Station 3!'
            },
            // Adicione mais estações espaciais, se necessário
        ],
        playerSpawn: {x: 50, y: 50}
    },
    4: {
        width: 992,
        height: 608,
        backgroundImage: 'sprites/backgrounds/forest.png',
        blackHoles: [
            { id: 1, x: 750, y: 200, destinationMapId: 1 },
            // Adicione mais buracos negros, se necessário
        ],
        playerSpawn: {x: 50, y: 50}
    },
};

class SpaceStation {
    constructor(id, x, y, stationMapId, photo, text) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.stationMapId = stationMapId;
        this.image = new Image();
        this.image.src = 'sprites/station.png'; // Caminho para a imagem da estação espacial
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        };
        this.photo = new Image();
        this.photo.src = photo;
        this.photo.onload = () => {
            this.photoWidth = this.photo.width;
            this.photoHeight = this.photo.height;
        };
        this.text = text;
    }

    draw(context, cameraX, cameraY) {
        context.drawImage(this.image, this.x - cameraX, this.y - cameraY, this.width, this.height);
    }

    checkCollision(player) {
        // Verifica se houve colisão entre o jogador e a estação espacial
        if (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        ) {
            return true;
        }
        return false;
    }

    getCollisionDirection(player) {
        // Verifica a direção da colisão com base nas posições x e y do jogador em relação à estação espacial
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;

        const stationCenterX = this.x + this.width / 2;
        const stationCenterY = this.y + this.height / 2;

        const dx = playerCenterX - stationCenterX;
        const dy = playerCenterY - stationCenterY;

        // Calcula a direção da colisão com base nas diferenças em x e y
        if (Math.abs(dx) > Math.abs(dy)) {
            // A colisão ocorreu principalmente na direção horizontal
            return dx > 0 ? 'right' : 'left';
        } else {
            // A colisão ocorreu principalmente na direção vertical
            return dy > 0 ? 'bottom' : 'top';
        }
    }
}

class BlackHole {
    constructor(id, x, y, mapId) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.mapId = mapId;
        this.frameIndex = 0; // Índice do quadro atual da animação
        this.frames = []; // Array para armazenar os quadros da animação
        this.frameWidth = 60; // Largura do quadro da animação
        this.frameHeight = 60; // Altura do quadro da animação
        this.frameCount = 0;
        this.frameDelay = 6; 
        // Carrega as imagens de animação do buraco negro
        this.loadFrames();
    }

    loadFrames() {
        for (let i = 1; i <= 4; i++) { // Suponha que você tenha 6 quadros de animação numerados de 1 a 6
            let image = new Image();
            image.src = `sprites/blackholes/blackhole${i}.png`; // Caminho para a imagem de animação do buraco negro
            this.frames.push(image);
        }
    }

    update() {
        // Atualiza o contador de frames
        this.frameCount++;

        // Verifica se é hora de avançar para o próximo quadro
        if (this.frameCount >= this.frameDelay) {
            // Avança para o próximo quadro
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
            // Reseta o contador de frames
            this.frameCount = 0;
        }
    }

    draw(context, cameraX, cameraY) {
        context.drawImage(
            this.frames[this.frameIndex],
            this.x - cameraX,
            this.y - cameraY,
            this.frameWidth,
            this.frameHeight
        );
    }

    checkCollision(player) {
        // Verificar se houve colisão entre o jogador e o buraco negro
        if (
            player.x < this.x + this.frameWidth &&
            player.x + player.width > this.x &&
            player.y < this.y + this.frameHeight &&
            player.y + player.height > this.y
        ) {
            return true;
        }
        return false;
    }
}

class Player {
    constructor(game, x, y) {
        this.game = game; // Armazena a instância do jogo
        this.x = x;
        this.y = y;
        this.speedX = 5;
        this.speedY = 5;
        this.vx = 0; // Componente x da velocidade
        this.vy = 0; // Componente y da velocidade
        this.image = new Image();
        this.image.src = 'sprites/ship.png'; // Caminho para a imagem do jogador
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        };
        this.angle = 0; // Ângulo de rotação da imagem do jogador (inicialmente para o norte)
    }

    update(keysPressed) {
        this.vx = 0;
        this.vy = 0;

        if ('ArrowLeft' in keysPressed && !('ArrowRight' in keysPressed)) {
            if (this.x - this.speedX >= 0) {
                this.vx = -this.speedX;
                this.angle = -Math.PI / 2; 
            }
        } else if ('ArrowRight' in keysPressed && !('ArrowLeft' in keysPressed)) {
            if (this.x + this.width + this.speedX <= this.game.gameWidth) {
                this.vx = this.speedX;
                this.angle = Math.PI / 2;
            }
        }

        if ('ArrowUp' in keysPressed && !('ArrowDown' in keysPressed)) {
            if (this.y - this.speedY >= 0) {
                this.vy = -this.speedY;
                this.angle = 0; 
            }
        } else if ('ArrowDown' in keysPressed && !('ArrowUp' in keysPressed)) {
            if (this.y + this.height + this.speedY <= this.game.gameHeight) {
                this.vy = this.speedY;
                this.angle = -Math.PI;
            }
        }

        // Atualizar a posição do jogador
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(context, cameraX, cameraY) {
        context.save(); // Salva o estado atual do contexto
        context.translate(this.x - cameraX + this.width / 2, this.y - cameraY + this.height / 2); // Define o ponto de rotação no centro da imagem
        context.rotate(this.angle); // Rotaciona o contexto pelo ângulo especificado
        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height); // Desenha a imagem rotacionada
        context.restore(); // Restaura o estado do contexto para antes da rotação
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');
        this.player = new Player(this, 50, 300);
        this.cameraX = 0;
        this.cameraY = 0;
        this.currentMapId = 1; // ID do mapa atual
        this.backgroundImages = {}; // Objeto para armazenar as imagens de background
        this.keysPressed = {};
        this.blackHoles = [];
        this.spaceStations = []; // Array para armazenar as estações espaciais
        this.isMenuOpen = false; // Variável de estado para controlar se o menu está aberto ou não
        this.menuText = "Pressione ESC para sair do menu";
        const currentMap = MAPS[this.currentMapId];
        this.gameWidth = currentMap.width;
        this.gameHeight = currentMap.height;

        // Dentro do construtor da classe Game
        for (let mapId in MAPS) {
            let image = new Image();
            image.src = MAPS[mapId].backgroundImage;
            this.backgroundImages[mapId] = image;
        }

        // Inicializa as estações espaciais para cada mapa
        for (let mapId in MAPS) {
            if (MAPS[mapId].blackHoles) { // Verifique se blackHoles está definido
                this.blackHoles[mapId] = MAPS[mapId].blackHoles.map(holeInfo => new BlackHole(holeInfo.id, holeInfo.x, holeInfo.y, holeInfo.destinationMapId));
            } else {
                this.blackHoles[mapId] = []; // Se não houver estações espaciais, inicialize como um array vazio
            }
        }

        // Inicializa as estações espaciais para cada mapa
        for (let mapId in MAPS) {
            if (MAPS[mapId].spaceStations) { // Verifique se spaceStations está definido
                this.spaceStations[mapId] = MAPS[mapId].spaceStations.map(stationInfo => 
                    new SpaceStation(
                        stationInfo.id, 
                        stationInfo.x, 
                        stationInfo.y, 
                        stationInfo.StationMapId,
                        stationInfo.photo,
                        stationInfo.text
                    )
                );
            } else {
                this.spaceStations[mapId] = []; // Se não houver estações espaciais, inicialize como um array vazio
            }
        }

        // Inicia o jogo após o carregamento das imagens
        Promise.all(Object.values(this.backgroundImages).map(img => new Promise(resolve => img.onload = resolve)))
            .then(() => this.start());
    }

    start() {
        this.setupInput();
        this.gameLoop();
    }

    setupInput() {
        document.addEventListener('keydown', (event) => {
            this.keysPressed[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            delete this.keysPressed[event.key];
        });
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (!this.isMenuOpen) {
            this.player.update(this.keysPressed);

            const currentBlackHoles = this.blackHoles[this.currentMapId]; // Obtenha os buracos negros do mapa atual
            const collidedBlackHole = currentBlackHoles.find((hole) => hole.checkCollision(this.player)); // Verifique a colisão com os buracos negros do mapa atual

            if (collidedBlackHole) {
                this.changeMap(collidedBlackHole.mapId);
            }

            const currentSpaceStations = this.spaceStations[this.currentMapId];
            const collidedSpaceStation = currentSpaceStations.find(station => station.checkCollision(this.player));
            if (collidedSpaceStation) {
                this.isMenuOpen = true; // Abre o menu quando o jogador colide com a estação espacial
                let direction = collidedSpaceStation.getCollisionDirection(this.player)
                if (direction === 'left') {
                    this.player.x -= 10;
                }
                if (direction === 'right') {
                    this.player.x += 10;
                }
                if (direction === 'top') {
                    this.player.y -= 10;
                }
                if (direction === 'bottom') {
                    this.player.y += 10;
                }
            }

            // Atualiza a posição da câmera
            const cameraMarginX = this.canvas.width / 2; // Margem para movimento da câmera no eixo X
            const cameraMarginY = this.canvas.height / 2; // Margem para movimento da câmera no eixo Y
            const maxCameraX = this.gameWidth - this.canvas.width;
            const maxCameraY = this.gameHeight - this.canvas.height;

            // Centraliza a câmera na posição do jogador
            this.cameraX = Math.max(0, Math.min(this.player.x - cameraMarginX, maxCameraX));
            this.cameraY = Math.max(0, Math.min(this.player.y - cameraMarginY, maxCameraY));
        } else {
            if ('Escape' in this.keysPressed) {
                this.isMenuOpen = false; // Fecha o menu quando o jogador pressiona "Esc"
            }
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(
            this.backgroundImages[this.currentMapId],
            this.cameraX,
            this.cameraY,
            this.canvas.width,
            this.canvas.height,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        const currentBlackHoles = this.blackHoles[this.currentMapId]; // Obtenha os buracos negros do mapa atual
        currentBlackHoles.forEach(hole => hole.draw(this.context, this.cameraX, this.cameraY));
        currentBlackHoles.forEach(hole => hole.update()); // Desenhe os buracos negros do mapa atual

        const currentSpaceStations = this.spaceStations[this.currentMapId];
        currentSpaceStations.forEach(station => station.draw(this.context, this.cameraX, this.cameraY));

        this.player.draw(this.context, this.cameraX, this.cameraY);

        if (this.isMenuOpen) {
            this.drawMenu();
        }
    }

    changeMap(mapId) {
        if (MAPS[mapId]) {
            this.currentMapId = mapId;
            this.gameWidth = MAPS[mapId].width;
            this.gameHeight = MAPS[mapId].height;
        } else {
            console.error('Mapa não encontrado:', mapId);
        }
        
        // Ajustar a posição do jogador em relação à nova posição da câmera
        this.player.x = MAPS[this.currentMapId].playerSpawn.x; // Define a nova posição x do jogador
        this.player.y = MAPS[this.currentMapId].playerSpawn.y; // Define a nova posição y do jogador
    }

    drawMenu() {
        this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillStyle = '#00ff11';
        this.context.font = '24px Arial';
        this.context.textAlign = 'center';

        const currentSpaceStations = this.spaceStations[this.currentMapId];
        this.context.fillText(currentSpaceStations[0].text, this.canvas.width / 2, this.canvas.height / 2 + 200);

        const canvasCenterX = this.canvas.width / 2;
        const canvasCenterY = this.canvas.height / 2;
        const imageCenterX = currentSpaceStations[0].photo.width / 2;
        const imageCenterY = currentSpaceStations[0].photo.height / 2;

        const drawX = canvasCenterX - imageCenterX;
        const drawY = canvasCenterY - imageCenterY;

        this.context.drawImage(currentSpaceStations[0].photo, drawX, drawY - 50);
    }
}

window.onload = function() {
    var game = new Game();
};