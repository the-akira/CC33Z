// Obtém o elemento canvas e seu contexto 2d
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

class MovingTriangle {
    constructor() {
        this.size = 25;
        this.angle = 0; // Ângulo inicial
        this.radius = Math.min(canvas.width, canvas.height) / 3; // Raio do círculo
        this.speed = 0.02; // Velocidade angular inicial
        this.color = '#dbb735';

        // Define um intervalo para mudança de velocidade aleatória
        setInterval(() => {
            this.changeSpeed();
        }, 3000); // Intervalo de 3 segundos
    }

    draw() {
        // Calcula as coordenadas do triângulo com base no ângulo e no raio
        let x = canvas.width / 2 + this.radius * Math.cos(this.angle);
        let y = canvas.height / 2 + this.radius * Math.sin(this.angle);

        ctx.beginPath();
        // Desenha um triângulo equilátero
        ctx.moveTo(x, y - this.size);
        ctx.lineTo(x + this.size * Math.sqrt(3) / 2, y + this.size / 2);
        ctx.lineTo(x - this.size * Math.sqrt(3) / 2, y + this.size / 2);
        ctx.closePath();
        ctx.strokeStyle = '#201787'; // Define a cor da borda
        ctx.lineWidth = 3; // Define a largura da borda
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();

        // Exibe as coordenadas ao lado do objeto
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`(${Math.floor(x)}, ${Math.floor(y)})`, x + this.size + 5, y);
    }

    update() {
        // Atualiza o ângulo para o próximo frame
        this.angle += this.speed;

        // Mantém o ângulo dentro do intervalo [0, 2*pi)
        if (this.angle >= Math.PI * 2) {
            this.angle -= Math.PI * 2;
        }
    }

    changeSpeed() {
        // Altera a velocidade aleatoriamente entre rápida e lenta
        let randomSpeed = Math.random(); // Gera um número aleatório entre 0 e 1
        if (randomSpeed < 0.5) {
            // Velocidade rápida
            this.speed = 0.015;
        } else {
            // Velocidade lenta
            this.speed = 0.01;
        }
    }
}

let movingTriangle = new MovingTriangle();

class BouncingCircle {
    constructor() {
        this.radius = 15;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = 2;
        this.speedY = 2;
        this.color = '#a7eb21';
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#201787'; // Define a cor da borda
        ctx.lineWidth = 3; // Define a largura da borda
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();

        // Exibe as coordenadas ao lado do objeto
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`(${Math.floor(this.x)}, ${Math.floor(this.y)})`, this.x + this.radius + 5, this.y);
    }

    update() {
        // Atualiza a posição do círculo
        this.x += this.speedX;
        this.y += this.speedY;

        // Verifica colisão com os limites do mapa
        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
            // Move o círculo para a posição correta e faz ele quicar
            this.speedX *= -1;
        }
        if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
            // Move o círculo para a posição correta e faz ele quicar
            this.speedY *= -1;
        }

        // Verifica colisão com o jogador (objeto)
        if (
            this.x + this.radius >= object.x &&
            this.x - this.radius <= object.x + object.width &&
            this.y + this.radius >= object.y &&
            this.y - this.radius <= object.y + object.height
        ) {
            // Move o círculo para uma posição aleatória dentro dos limites do mapa
            this.x = Math.random() * (canvas.width - 2 * this.radius) + this.radius;
            this.y = Math.random() * (canvas.height - 2 * this.radius) + this.radius;
        }
    }
}

let bouncingCircle = new BouncingCircle();

let diagonalObjects = []
class DiagonalObject {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = 0;
        this.y = Math.random() * (canvas.height - this.height); // Posição Y aleatória
        this.speedX = Math.random() * 1.3 + 1; // Velocidade horizontal
        this.speedY = Math.random() * 1.3 + 1; // Velocidade vertical
        this.color = '#4c71c2';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = '#201787'; // Cor da borda
        ctx.lineWidth = 1.6; // Espessura da borda
        ctx.strokeRect(this.x, this.y, this.width, this.height); // Desenha o contorno do retângulo

        // Exibe as coordenadas ao lado do objeto
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`(${Math.floor(this.x)}, ${Math.floor(this.y)})`, this.x + this.width + 5, this.y + this.height / 2);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Remove o objeto diagonal se ele sair da tela
        if (this.x > canvas.width || this.y > canvas.height) {
            const index = diagonalObjects.indexOf(this);
            if (index > -1) {
                diagonalObjects.splice(index, 1);
            }
        }
    }
}

// Função para criar novos objetos móveis aleatoriamente
function createDiagonalObjects() {
    diagonalObjects.push(new DiagonalObject());
}

// Função para desenhar os objetos móveis
function drawDiagonalObjects() {
    diagonalObjects.forEach(object => {
        object.draw();
    });
}

// Função para atualizar os objetos móveis
function updateDiagonalObjects() {
    diagonalObjects.forEach(object => {
        object.update();
    });
}

// Função para verificar colisões com o objeto principal
function detectDiagonalObjectCollisions() {
    diagonalObjects.forEach((diagonalObject, index) => {
        if (
            diagonalObject.x < object.x + object.width &&
            diagonalObject.x + diagonalObject.width > object.x &&
            diagonalObject.y < object.y + object.height &&
            diagonalObject.y + diagonalObject.height > object.y
        ) {
            diagonalObjects.splice(index, 1);
        }
    });
}

let sinusoidalObjects = [];
class SinusoidalObject {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.amplitude = 4; // Amplitude do movimento senoidal
        this.frequency = 0.03; // Frequência do movimento senoidal
        this.x = canvas.width; // Começa fora do canvas à direita
        this.y = Math.random() * (canvas.height - this.height);
        this.speedX = -2; // Velocidade horizontal do objeto (da direita para a esquerda)
        this.color = '#41b082';
        this.phase = 0; // Fase inicial
    }

    update() {
        this.x += this.speedX; // Move o objeto para a esquerda
        // Movimento senoidal
        this.y += this.amplitude * Math.sin(this.frequency * this.x + this.phase);
        // Remove o objeto da matriz quando ele sair da tela
        if (this.x + this.width < 0) {
            const index = sinusoidalObjects.indexOf(this);
            if (index > -1) {
                sinusoidalObjects.splice(index, 1);
            }
        }
    }

    draw() {
        ctx.strokeStyle = '#201787'; // Cor da borda
        ctx.lineWidth = 3; // Espessura da borda
        ctx.strokeRect(this.x, this.y, this.width, this.height); // Desenha o contorno do retângulo

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Exibe as coordenadas ao lado do objeto
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`(${Math.floor(this.x)}, ${Math.floor(this.y)})`, this.x + this.width + 5, this.y + this.height / 2);
    }
}

// Função para criar novos objetos senoidais
function createSinusoidalObjects() {
    sinusoidalObjects.push(new SinusoidalObject());
}

// Função para desenhar os objetos senoidais
function drawSinusoidalObjects() {
    sinusoidalObjects.forEach(object => {
        object.draw();
    });
}

// Função para atualizar os objetos senoidais
function updateSinusoidalObjects() {
    sinusoidalObjects.forEach(object => {
        object.update();
    });
}

let movingObjects = []
class MovingObject {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = 0;
        this.speed = Math.random() * 2 + 1;
        this.color = 'red';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = '#201787'; // Cor da borda
        ctx.lineWidth = 1.7; // Espessura da borda
        ctx.strokeRect(this.x, this.y, this.width, this.height); // Desenha o contorno do retângulo

        // Exibe as coordenadas ao lado do objeto
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`(${Math.floor(this.x)}, ${Math.floor(this.y)})`, this.x + this.width + 5, this.y + this.height / 2);
    }

    update() {
        this.y += this.speed;

        // Remove o objeto móvel se ele sair da tela
        if (this.y > canvas.height) {
            const index = movingObjects.indexOf(this);
            if (index > -1) {
                movingObjects.splice(index, 1);
            }
        }
    }
}

// Função para criar novos objetos móveis aleatoriamente
function createMovingObjects() {
    movingObjects.push(new MovingObject());
}

// Função para desenhar os objetos móveis
function drawMovingObjects() {
    movingObjects.forEach(object => {
        object.draw();
    });
}

// Função para atualizar os objetos móveis
function updateMovingObjects() {
    movingObjects.forEach(object => {
        object.update();
    });
}

// Função para verificar colisões com o objeto principal
function detectCollisions() {
    movingObjects.forEach((movingObject, index) => {
        if (
            movingObject.x < object.x + object.width &&
            movingObject.x + movingObject.width > object.x &&
            movingObject.y < object.y + object.height &&
            movingObject.y + movingObject.height > object.y
        ) {
            movingObjects.splice(index, 1);
        }
    });
    sinusoidalObjects.forEach((sinusoidalObject, index) => {
        if (
            sinusoidalObject.x < object.x + object.width &&
            sinusoidalObject.x + sinusoidalObject.width > object.x &&
            sinusoidalObject.y < object.y + object.height &&
            sinusoidalObject.y + sinusoidalObject.height > object.y
        ) {
            sinusoidalObjects.splice(index, 1);
        }
    });
}

// Função para detectar colisões entre dois conjuntos de objetos
function detectCollisionsBetweenLists(list1, list2, list3) {
    list1.forEach((obj1, index1) => {
        list2.forEach((obj2, index2) => {
            // Verificar se obj1 colide com obj2
            if (
                obj1.x < obj2.x + obj2.width &&
                obj1.x + obj1.width > obj2.x &&
                obj1.y < obj2.y + obj2.height &&
                obj1.y + obj1.height > obj2.y
            ) {
                // Lidar com a colisão entre obj1 e obj2
                // Por exemplo, você pode mudar as cores, remover os objetos, etc.
                // Aqui você pode adicionar a lógica específica que deseja executar quando houver uma colisão.
                obj1.color = 'green';
                obj2.color = 'yellow';
            }
        });
    });
    list1.forEach((obj1, index1) => {
        list3.forEach((obj3, index3) => {
            // Verificar se obj1 colide com obj3
            if (
                obj1.x < obj3.x + obj3.width &&
                obj1.x + obj1.width > obj3.x &&
                obj1.y < obj3.y + obj3.height &&
                obj1.y + obj1.height > obj3.y
            ) {
                // Remover os objetos que colidiram
                list1.splice(index1, 1);
                list3.splice(index3, 1);
            }
        });
    });
}

// Pontuação
let score = 0;
// Função para desenhar a pontuação na tela
function drawScore() {
    ctx.fillStyle = '#44ff00';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Pontuação: ${score}`, 10, 30); // Posição da pontuação na tela
}

// Objeto que será desenhado
var object = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    speed: 5 // Velocidade do objeto
};

// Objeto para armazenar as teclas pressionadas
var keysPressed = {};

// Obtém uma referência para o botão de mover
var moveButton = document.getElementById('moveButton');

// Adiciona um ouvinte de eventos para o botão de mover
moveButton.addEventListener('click', movePlayerToRandomPosition);

// Função para mover o jogador para uma posição aleatória dentro dos limites do canvas
function movePlayerToRandomPosition() {
    // Gera coordenadas aleatórias dentro dos limites do canvas
    var randomX = Math.floor(Math.random() * (canvas.width - object.width));
    var randomY = Math.floor(Math.random() * (canvas.height - object.height));

    // Define as novas coordenadas do jogador
    object.x = randomX;
    object.y = randomY;

    // Redesenha o jogo para atualizar a posição do jogador
    update();
}

// Função para desenhar o objeto na tela
function drawObject() {
    ctx.fillStyle = '#5900b3'; // Cor de preenchimento
    ctx.fillRect(object.x, object.y, object.width, object.height); // Desenha o retângulo preenchido

    ctx.strokeStyle = '#201787'; // Cor da borda
    ctx.lineWidth = 3; // Espessura da borda
    ctx.strokeRect(object.x, object.y, object.width, object.height); // Desenha o contorno do retângulo
}

// Define a vida máxima do jogador e sua vida atual
maxLife = 13
currentLife = maxLife

// Função que desenha a barra de vida na tela
function drawObjectLifeBar(currentLife, maxLife) {
    const barWidth = 150;
    const barHeight = 20;
    const barX = 10;
    const barY = 50;
    const barPadding = 2;

    // Calcula a largura da barra com base na porcentagem de vida restante
    const remainingPercentage = currentLife / maxLife;
    const remainingWidth = barWidth * remainingPercentage;

    // Desenha a barra vermelha (parte vazia)
    ctx.fillStyle = '#ff0000'; // Vermelho
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Desenha a barra verde (parte cheia)
    ctx.fillStyle = '#00ff00'; // Verde
    ctx.fillRect(barX + barPadding, barY + barPadding, remainingWidth - barPadding * 2, barHeight - barPadding * 2);
}

// Carrega imagem da nave
var ship = new Image();
ship.src = 'images/ship.png'; 
function drawShip() {
    ctx.drawImage(ship, object.x, object.y, object.width, object.height);
}

// Carrega imagem do plano de fundo espacial
var backgroundImage = new Image();
backgroundImage.src = 'images/background.png'; 
function drawBackground() {
    // Desenha a imagem como plano de fundo do canvas
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Lista para armazenar os projéteis
var projectiles = [];

// Variável para controlar o tempo desde o último tiro
var lastShotTime = 0;
var shootDelay = 350; 

// Variável para controlar o tempo desde a última explosão
var lastExplosionTime = 0;
var explosionDelay = 15000;

// Variável para controlar o tempo desde a última frota
var lastFleetTime = 0;
var fleetDelay = 20000;

// Função para desenhar os projéteis
function drawProjectiles() {
    // Percorre a lista de projéteis e desenha cada um
    for (var i = 0; i < projectiles.length; i++) {
        var projectile = projectiles[i];
        ctx.fillStyle = '#44ff00'; 
        ctx.fillRect(projectile.x - 2, projectile.y, projectile.width, projectile.height);
    }
}

// Função para atualizar o estado dos projéteis
function updateProjectiles() {
    // Percorre a lista de projéteis e atualiza suas posições
    for (var i = 0; i < projectiles.length; i++) {
        var projectile = projectiles[i];
        projectile.y -= projectile.speed; // Move o projétil para cima

        // Verifica se o projétil saiu da tela e remove-o da lista
        if (projectile.y < 0) {
            projectiles.splice(i, 1);
            i--; // Decrementa o índice para compensar a remoção do elemento
        }
    }
}

class Alien {
    constructor(x, y, speed) {
        // Carrega a imagem do alien
        this.alienImages = ['alien1.png', 'alien2.png', 'alien3.png', 'alien4.png', 'alien5.png', 'alien6.png'];
        this.image = new Image();
        let randomIndex = Math.floor(Math.random() * this.alienImages.length);
        this.image.src = 'images/' + this.alienImages[randomIndex];
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        };
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    draw() {
        // Desenha a imagem do alien na tela
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move() {
        // Movimenta o alien para baixo
        this.y += this.speed;
    }

    isOutOfScreen() {
        // Verifica se o alien saiu da tela
        return this.y > canvas.height;
    }
}

// Array para armazenar os aliens
let aliens = [];

// Função para criar um novo alien
function createAlien() {
    // Defina as coordenadas, largura, altura e velocidade do alien
    let x = Math.random() * (canvas.width - 50); // Posição x aleatória na tela
    let y = -50; // Começa fora da tela
    let speed = Math.random() * (3 - 1) + 1;
    let alien = new Alien(x, y, speed);
    aliens.push(alien);
}

// Função para desenhar todos os aliens na tela
function drawAliens() {
    aliens.forEach(alien => {
        alien.draw();
    });
}

// Função para mover todos os aliens
function moveAliens() {
    aliens.forEach(alien => {
        alien.move();
    });
}

// Função para remover aliens que saíram da tela
function removeOutOfScreenAliens() {
    aliens.forEach((alien, index) => {
        if (alien.isOutOfScreen()) {
            aliens.splice(index, 1); // Remove o alien da array
            score -= 1; // Diminui o score
            currentLife -=1; 
        }
    });
}

// Função que verifica se o alien está completamente fora da tela
function isOutOfScreen() {
    return (
        this.x + this.width < 0 ||
        this.x > canvas.width ||
        this.y + this.height < 0 ||
        this.y > canvas.height
    );
}

// Função para verificar a colisão entre dois retângulos
function checkCollision(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        return true; // Houve colisão
    }
    return false; // Não houve colisão
}

// Função para verificar colisões entre aliens e o jogador
function checkPlayerAlienCollision() {
    aliens.forEach((alien, index) => {
        if (checkCollision(object, alien)) {
            // Se houve colisão, remova o alien e faça alguma ação adicional, se necessário
            aliens.splice(index, 1);
            score -= 1
            currentLife -= 1
        }
    });
}

// Função para verificar colisões entre projéteis e aliens
function checkProjectileAlienCollision() {
    projectiles.forEach((projectile, projectileIndex) => {
        aliens.forEach((alien, alienIndex) => {
            if (checkCollision(projectile, alien)) {
                // Se houve colisão, remova o projétil e o alien
                projectiles.splice(projectileIndex, 1);
                aliens.splice(alienIndex, 1);
                score += 10;
            }
        });
    });
}

class Meteor {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.meteorImages = ['meteor1.png', 'meteor2.png', 'meteor3.png', 'meteor4.png', 'meteor5.png'];
        this.image = new Image();
        let randomIndex = Math.floor(Math.random() * this.meteorImages.length);
        this.image.src = 'images/' + this.meteorImages[randomIndex];
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        };
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    checkCollision(object) {
        const distanceX = this.x - object.x;
        const distanceY = this.y - object.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        return distance < this.width + object.width / 2;
    }
}

let meteorShower = [];
function createMeteorShower() {
    // Adiciona meteoros que vêm da esquerda
    for (let i = 0; i < 8; i++) {
        const x = -Math.random() * canvas.width / 2; // Fora da tela à esquerda
        const y = 0; // Inicia no topo
        const speedX = Math.random() * 2; // Velocidade horizontal
        const speedY = Math.random() * 2 + 1; // Velocidade vertical
        meteorShower.push(new Meteor(x, y, speedX, speedY));
    }

    // Adiciona meteoros que vêm da direita
    for (let i = 0; i < 8; i++) {
        const x = canvas.width + Math.random() * canvas.width / 2; // Fora da tela à direita
        const y = 0; // Inicia no topo
        const speedX = -Math.random() * 2; // Velocidade horizontal (negativa para ir para a esquerda)
        const speedY = Math.random() * 2 + 1; // Velocidade vertical
        meteorShower.push(new Meteor(x, y, speedX, speedY));
    }
}

// Função para verificar colisões entre o objeto e a chuva de meteoros
function checkMeteorCollisions(object, meteorShower) {
    for (let i = 0; i < meteorShower.length; i++) {
        if (meteorShower[i].checkCollision(object)) {
            currentLife -= 1
            score -= 1
            meteorShower.splice(i, 1);
        }
    }
    projectiles.forEach((projectile, projectileIndex) => {
        meteorShower.forEach((meteor, meteorIndex) => {
            if (checkCollision(projectile, meteor)) {
                projectiles.splice(projectileIndex, 1);
                meteorShower.splice(meteorIndex, 1);
                score += 10;
            }
        });
    });
    aliens.forEach((alien, alienIndex) => {
        meteorShower.forEach((meteor, meteorIndex) => {
            if (checkCollision(alien, meteor)) {
                aliens.splice(alienIndex, 1);
                meteorShower.splice(meteorIndex, 1);
            }
        });
    });
}

function removeOutOfScreenMeteors() {
    meteorShower = meteorShower.filter(meteor => meteor.y <= canvas.height);
}

// Define a classe LifeUp
class LifeUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 27; // Largura da imagem do LifeUp
        this.height = 27; // Altura da imagem do LifeUp
        this.image = new Image();
        this.image.src = 'images/heart.png'; // Caminho para a imagem do LifeUp
    }

    draw() {
        // Desenhe o item na tela usando a imagem
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Lista para armazenar os objetos LifeUp
let lifeUps = [];

// Função para adicionar um novo LifeUp à lista em uma posição aleatória
function addLifeUp() {
    const x = Math.random() * (canvas.width - 40); // Posição x aleatória
    const y = Math.random() * (canvas.height - 40); // Posição y aleatória
    const lifeUp = new LifeUp(x, y);
    lifeUps.push(lifeUp);
}

// Função para desenhar todos os LifeUps na tela
function drawLifeUps() {
    lifeUps.forEach(lifeUp => lifeUp.draw());
}

// Função para verificar colisão entre o jogador e os LifeUps
function checkLifeUpCollision(player) {
    lifeUps.forEach((lifeUp, index) => {
        if (
            player.x < lifeUp.x + lifeUp.width &&
            player.x + player.width > lifeUp.x &&
            player.y < lifeUp.y + lifeUp.height &&
            player.y + player.height > lifeUp.y
        ) {
            // Remover o LifeUp da lista quando houver colisão
            lifeUps.splice(index, 1);
            currentLife += 1;
            if (currentLife >= maxLife) {
                currentLife = maxLife
            }
        }
    });
}

class Explosao {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10; // Raio inicial da explosão
        this.maxRadius = 500; // Raio máximo da explosão
        this.expansionSpeed = 2; // Velocidade de expansão da explosão
        this.active = false; // Indica se a explosão está ativa ou não
    }

    // Método para lançar a explosão
    launch() {
        this.active = true;
    }

    // Método para atualizar a explosão
    update() {
        if (this.radius < this.maxRadius) {
            this.radius += this.expansionSpeed;
        } else {
            this.active = false; // Desativa a explosão quando atinge o raio máximo
        }
    }

    // Método para desenhar a explosão na tela
    draw() {
        if (this.active) {
            // Cria um gradiente radial para a explosão
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, 'rgba(2, 232, 228, 1)'); // Cor sólida no centro
            gradient.addColorStop(1, 'rgba(85, 15, 250, 0)'); // Cor transparente na borda

            // Define o gradiente como a cor de preenchimento
            ctx.fillStyle = gradient;

            // Desenha o círculo da explosão
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }

    // Método para verificar colisões com meteoros
    checkCollisionsWithMeteors(meteorShower) {
        if (this.active) {
            meteorShower.forEach((meteor, index) => {
                const dx = meteor.x - this.x;
                const dy = meteor.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                 if (distance < this.radius + Math.max(meteor.width, meteor.height) / 2) {
                    // Remove o meteoro se houver colisão
                    meteorShower.splice(index, 1);
                    score += 5;
                }
            });     
        }
    }

    // Método para verificar colisões com aliens
    checkCollisionsWithAliens(aliens) {
        if (this.active) {        
            aliens.forEach((alien, index) => {
                const dx = alien.x - this.x;
                const dy = alien.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.radius + alien.width / 2) {
                    // Remove o alien se houver colisão
                    aliens.splice(index, 1);
                    score += 5;
                }
            });
        }
    }
}

class FrotaDeAjuda {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.image = new Image();
        this.image.src = 'images/fleet.png'; // Caminho para a imagem da nave da Frota de Ajuda
        this.width = 40;
        this.height = 40;
    }

    move() {
        this.y -= this.speed; // Mover para cima
    }

    draw() {
        // Desenhar a nave da Frota de Ajuda
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

let fleet = []; // Array para armazenar as naves da Frota de Ajuda
let isFleetActive = false; // Indica se a Frota de Ajuda está ativa
let fleetActivationTime = 0; // Momento em que a Frota de Ajuda foi ativada
const fleetDuration = 10000; // Duração da Frota de Ajuda em milissegundos (10 segundos)

// Função para ativar a Frota de Ajuda
function activateFleet() {
    isFleetActive = true;
    fleetActivationTime = Date.now();
}

// Função para desativar a Frota de Ajuda
function deactivateFleet() {
    isFleetActive = false;
    fleet = []; // Limpar a Frota de Ajuda quando desativada
}

// Função para gerar naves da Frota de Ajuda aleatórias
function generateRandomShip() {
    const x = Math.random() * (canvas.width - 50); // Posição aleatória na largura do canvas
    const y = canvas.height; // Na parte inferior da tela
    const speed = 2; // Velocidade de movimento

    const ship = new FrotaDeAjuda(x, y, speed);
    fleet.push(ship);
}

// Função para atualizar e desenhar as naves da Frota de Ajuda
function updateAndDrawShips() {
    // Atualizar e desenhar cada nave da Frota de Ajuda
    fleet.forEach((ship, index) => {
        ship.move();
        ship.draw();

        // Remover naves que saem da tela
        if (ship.y + ship.height < 0) {
            fleet.splice(index, 1);
        }
    });
}

// Função para verificar colisões entre a Frota de Ajuda e os meteoros
function checkFleetCollisionsWithMeteors() {
    fleet.forEach((ship, shipIndex) => {
        meteorShower.forEach((meteor, meteorIndex) => {
            if (
                ship.x < meteor.x + meteor.width &&
                ship.x + ship.width > meteor.x &&
                ship.y < meteor.y + meteor.height &&
                ship.y + ship.height > meteor.y
            ) {
                // Remove o meteoro se houver colisão
                score += 5;
                meteorShower.splice(meteorIndex, 1);
            }
        });
    });
}

// Função para verificar colisões entre a Frota de Ajuda e os aliens
function checkFleetCollisionsWithAliens() {
    fleet.forEach((ship, shipIndex) => {
        aliens.forEach((alien, alienIndex) => {
            if (
                ship.x < alien.x + alien.width &&
                ship.x + ship.width > alien.x &&
                ship.y < alien.y + alien.height &&
                ship.y + ship.height > alien.y
            ) {
                // Remove o alien se houver colisão
                score += 5;
                aliens.splice(alienIndex, 1);
            }
        });
    });
}

// Função para desenhar a grade
function drawGrid() {
    ctx.strokeStyle = '#c4dbff';
    ctx.lineWidth = 0.7;

    // Desenha as linhas verticais
    for (var x = 0; x < canvas.width; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Desenha as linhas horizontais
    for (var y = 0; y < canvas.height; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    ctx.strokeStyle = '#478cfc';
    ctx.lineWidth = 1;

    // Desenha as linhas verticais
    for (var x = object.width; x < canvas.width; x += object.width) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Desenha as linhas horizontais
    for (var y = object.height; y < canvas.height; y += object.height) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Função para desenhar o sistema de coordenadas
function drawCoordinates() {
    // Eixo X
    ctx.beginPath();
    ctx.font = 'bold 19px Arial';
    ctx.fillStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    // Eixo Y
    ctx.beginPath();
    ctx.font = 'bold 19px Arial';
    ctx.lineWidth = 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();

    // Marcações numéricas no eixo X
    for (var i = 50; i <= canvas.width; i += 50) {
        ctx.fillText(i.toString(), i + 6, canvas.height - 580);
    }

    // Marcações numéricas no eixo Y
    for (var j = canvas.height; j >= 0; j -= 50) {
        ctx.fillText(j, 6, j - 8);
    }

    // Exibe as coordenadas do objeto
    ctx.fillStyle = '#0e075e';
    ctx.font = 'bold 25px Arial';
    ctx.fillText('Coordenadas: (x: ' + object.x + ', y: ' + (object.y) + ')', 236, 585);
}

// Função para desenhar uma linha diagonal do jogador até a origem (0,0)
function drawDiagonalLineToOrigin(playerX, playerY) {
    ctx.beginPath();
    ctx.strokeStyle = '#034f0b'; // Cor da linha
    ctx.lineWidth = 3; // Largura da linha

    // Move para as coordenadas do jogador
    ctx.moveTo(playerX, playerY);

    // Desenha uma linha até a origem (0,0)
    ctx.lineTo(0, 0);
    
    ctx.stroke(); // Desenha a linha
}

// Função para desenhar as linhas de distância até os eixos X e Y
function drawDistanceLines() {
    // Linha para o eixo X
    ctx.beginPath();
    ctx.strokeStyle = '#8a081a';
    ctx.lineWidth = 4; // Espessura da linha
    ctx.moveTo(object.x, object.y); // Parte de baixo esquerda do objeto
    ctx.lineTo(object.x, -canvas.height); // Estende verticalmente até o eixo X
    ctx.stroke();

    // Linha para o eixo Y
    ctx.beginPath();
    ctx.strokeStyle = '#8a081a';
    ctx.lineWidth = 4; // Espessura da linha
    ctx.moveTo(object.x, object.y + object.height - 50); // Parte de baixo esquerda do objeto
    ctx.lineTo(0, object.y + object.height - 50); // Estende horizontalmente até o eixo Y
    ctx.stroke();
}

// Função para desenhar o círculo unitário e as linhas rotacionando
function drawUnitCircleWithRotatingLines() {
    // Define o ângulo com base no tempo para a animação suave
    let time = Date.now();
    let angleRadians = ((time * 0.0003) % (Math.PI * 2)).toFixed(3); // Um ciclo completo em 2 * PI
    let angleDegrees = (angleRadians * 180 / Math.PI).toFixed(0);

    // Calcula as coordenadas do ponto final do ponteiro (linha que gira)
    let pointerEndX = canvas.width / 2 + 200 * Math.cos(angleRadians);
    let pointerEndY = canvas.height / 2 + 200 * Math.sin(angleRadians);

    // Desenha o círculo unitário
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 200, 0, Math.PI * 2);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Desenha as linhas que dividem os quadrantes
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0); // Linha vertical superior
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2); // Linha horizontal esquerda
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = '#999'; // Cor cinza
    ctx.stroke();

    // Desenha o ponteiro (linha que gira)
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2); // Início do ponteiro
    ctx.lineTo(pointerEndX, pointerEndY); // Fim do ponteiro
    ctx.strokeStyle = '#ff0000'; // Cor vermelha
    ctx.stroke();

    // Exibe o ângulo em graus ao lado do ponteiro vermelho
    ctx.fillStyle = '#043611'; // Cor vermelha
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${angleDegrees}°`, pointerEndX + 10, pointerEndY);

    // Calcula o comprimento da linha perpendicular ao ponteiro
    let perpendicularLength = 100 * Math.sin(angleRadians); // Comprimento depende do seno do ângulo

    // // Calcula as coordenadas do ponto final da linha azul
    let blueLineEndX = pointerEndX; // Mesma coordenada x que o ponteiro vermelho
    let blueLineEndY = canvas.height / 2; // Metade da altura do canvas

    // Desenha a linha azul perpendicular ao ponteiro
    ctx.beginPath();
    ctx.moveTo(pointerEndX, pointerEndY); // Início na extremidade do ponteiro
    ctx.lineTo(blueLineEndX, blueLineEndY); // Fim da linha
    ctx.strokeStyle = '#0000ff'; // Cor azul
    ctx.stroke();
}

// Defina uma variável para a gravidade
let gravity = 0.5; // Ajuste o valor conforme necessário
// Defina uma variável para a velocidade vertical do jogador
let velocityY = 0;
// Função para atualizar a posição do objeto e redesenhar o jogo
function update() {
    // Verifica limites do canvas
    if (object.x < 0) {
        object.x = 0;
    }
    if (object.x + object.width > canvas.width) {
        object.x = canvas.width - object.width;
    }
    if (object.y < 0) {
        object.y = 0;
    }
    if (object.y + object.height > canvas.height) {
        object.y = canvas.height - object.height;
    }

    // Aplica a gravidade se a condição for verdadeira
    if (gravityON) { // Supondo que 'aplicarGravidade' é sua condição booleana
        velocityY += gravity; // Aumenta a velocidade vertical com a gravidade
        object.y += velocityY; // Move o jogador para baixo com base na velocidade vertical
    }

    // Verifica se o jogador está pulando
    if (isJumping && gravityON) {
        // Aplica a velocidade vertical para o pulo
        object.y += velocityY;
        // Reduz a velocidade vertical à medida que o jogador alcança o ponto mais alto do pulo
        if (velocityY < 0) {
            velocityY += gravity;
        }
        // Verifica se o jogador atingiu o ponto mais baixo do pulo
        if (object.y + object.height >= canvas.height) {
            object.y = canvas.height - object.height;
            isJumping = false; // O jogador terminou o pulo
            velocityY = 0; // Zera a velocidade vertical
        }
    }

    // Verifica se o jogador atingiu o limite inferior do canvas
    if (object.y + object.height > canvas.height) {
        object.y = canvas.height - object.height; // Define a posição do jogador no limite inferior
        velocityY = 0; // Define a velocidade vertical como 0 para evitar que o jogador caia mais
    }
}

// Variável para controlar o estado do jogo
var gameState = 'menu'; // Pode ser 'menu' ou 'playing'
var frameCount = 0; // Contador de quadros para controle de intervalo

// Função para desenhar o menu
function drawMenu() {
    var menuImage = new Image();
    menuImage.src = 'images/start.png';
    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
}

function getBackgroundColor(condition) {
    return condition ? '#a0ff7d' : '#ff7d93';
}

var deactivateSquare = document.getElementById('deactivateSquare');
// Adiciona um ouvinte de eventos para o botão de mover
deactivateSquare.addEventListener('click', deactivateSquares);
// Função para mover o jogador para uma posição aleatória dentro dos limites do canvas
function deactivateSquares() {
    if (!shipVisible) {
        squaresVisible = !squaresVisible;
    }
    deactivateSquare.style.backgroundColor = getBackgroundColor(squaresVisible);
}

var deactivateTriangle = document.getElementById('deactivateTriangle');
// Adiciona um ouvinte de eventos para o botão de mover
deactivateTriangle.addEventListener('click', deactivateTriangleFunction);
// Função para mover o jogador para uma posição aleatória dentro dos limites do canvas
function deactivateTriangleFunction() {
    if (!shipVisible) {
        triangleVisible = !triangleVisible;
    }
    deactivateTriangle.style.backgroundColor = getBackgroundColor(triangleVisible);
}

var deactivateCircle = document.getElementById('deactivateCircle');
// Adiciona um ouvinte de eventos para o botão de mover
deactivateCircle.addEventListener('click', deactivateCircleFunction);
// Função para mover o jogador para uma posição aleatória dentro dos limites do canvas
function deactivateCircleFunction() {
    if (!shipVisible) {
        circleVisible = !circleVisible;
    }
    deactivateCircle.style.backgroundColor = getBackgroundColor(circleVisible);
}

var deactivateCoordinates = document.getElementById('deactivateCoordinates');
// Adiciona um ouvinte de eventos para o botão de mover
deactivateCoordinates.addEventListener('click', deactivateCoordinatesFunction);
// Função para mover o jogador para uma posição aleatória dentro dos limites do canvas
function deactivateCoordinatesFunction() {
    if (!shipVisible) {
        coordinatesVisible = !coordinatesVisible;
    }
    deactivateCoordinates.style.backgroundColor = getBackgroundColor(coordinatesVisible);
}

var deactivateGrid = document.getElementById('deactivateGrid');
// Adiciona um ouvinte de eventos para o botão de mover
deactivateGrid.addEventListener('click', deactivateGridFunction);
// Função para mover o jogador para uma posição aleatória dentro dos limites do canvas
function deactivateGridFunction() {
    if (!shipVisible) {
        gridVisible = !gridVisible;
    }
    deactivateGrid.style.backgroundColor = getBackgroundColor(gridVisible);
}

var deactivateGravity = document.getElementById('deactivateGravity');
// Adiciona um ouvinte de eventos para o botão de mover
deactivateGravity.addEventListener('click', deactivateGravityFunction);
// Função para mover o jogador para uma posição aleatória dentro dos limites do canvas
function deactivateGravityFunction() {
    if (!shipVisible) {
        gravityON = !gravityON;
    }
    deactivateGravity.style.backgroundColor = getBackgroundColor(gravityON);
}

var deactivateUnityCircle = document.getElementById('deactivateUnityCircle');
// Adiciona um ouvinte de eventos para o botão de mover
deactivateUnityCircle.addEventListener('click', deactivateUnityCircleFunction);
// Função para mover o jogador para uma posição aleatória dentro dos limites do canvas
function deactivateUnityCircleFunction() {
    if (!shipVisible) {
        unityCircleVisible = !unityCircleVisible;
    }
    deactivateUnityCircle.style.backgroundColor = getBackgroundColor(unityCircleVisible);
}

var deactivateLines = document.getElementById('deactivateLines');
// Adiciona um ouvinte de eventos para o botão de mover
deactivateLines.addEventListener('click', deactivateLinesFunction);
// Função para mover o jogador para uma posição aleatória dentro dos limites do canvas
function deactivateLinesFunction() {
    if (!shipVisible) {
        linesVisible = !linesVisible;
    }
    deactivateLines.style.backgroundColor = getBackgroundColor(linesVisible);
}

var deactivateGame = document.getElementById('deactivateGame');
// Adiciona um ouvinte de eventos para o botão de mover
deactivateGame.addEventListener('click', deactivateGameFunction);
// Função para mover o jogador para uma posição aleatória dentro dos limites do canvas
function deactivateGameFunction() {
    shipVisible = !shipVisible;
    unityCircleVisible = false;
    triangleVisible = false;
    circleVisible = false; 
    squaresVisible = false;
    coordinatesVisible = false;
    gridVisible = false;
    gravityON = false;
    unityCircleVisible = false;
    linesVisible = false;
    if (shipVisible) {
        deactivateGame.style.backgroundColor = '#a0ff7d'; // Se a condição for verdadeira, o fundo será verde
        object.x = canvas.width / 2 - object.width / 2;
        object.y = canvas.height / 2 - object.height / 2;
    } else {
        deactivateGame.style.backgroundColor = '#ff7d93'; // Se a condição for falsa, o fundo será vermelho
    }
    deactivateTriangle.style.backgroundColor = getBackgroundColor(triangleVisible);
    deactivateCircle.style.backgroundColor = getBackgroundColor(circleVisible);
    deactivateSquare.style.backgroundColor = getBackgroundColor(squaresVisible);
    deactivateCoordinates.style.backgroundColor = getBackgroundColor(coordinatesVisible);
    deactivateGrid.style.backgroundColor = getBackgroundColor(gridVisible);
    deactivateGravity.style.backgroundColor = getBackgroundColor(gravityON);
    deactivateUnityCircle.style.backgroundColor = getBackgroundColor(unityCircleVisible);
    deactivateLines.style.backgroundColor = getBackgroundColor(linesVisible);
}

document.addEventListener('keydown', handleMenuKeyPress);

// Função para lidar com os eventos de teclado no menu
function handleMenuKeyPress(event) {
    if (event.key === 'Enter') {
        // Muda o estado do jogo para 'playing'
        gameState = 'playing';
        // Remove o ouvinte de eventos do teclado do menu
        document.removeEventListener('keydown', handleMenuKeyPress);
        // Adiciona o ouvinte de eventos do teclado do jogo principal
        document.addEventListener('keydown', handleKeyDown);
    }
}

let triangleVisible = true;
let circleVisible = true; 
let squaresVisible = true;
let coordinatesVisible = true;
let gridVisible = true;
let gravityON = false;
let unityCircleVisible = false;
let linesVisible = true;
let shipVisible = false;

// Adiciona um ouvinte de eventos para o pressionamento de teclas
document.addEventListener('keydown', function(event) {
    // Verifica se a tecla pressionada é a tecla 'p'
    if (event.key === 't' && !shipVisible) {
        // Inverte o estado da variável triangleVisible
        triangleVisible = !triangleVisible;
        deactivateTriangle.style.backgroundColor = getBackgroundColor(triangleVisible);
    }
    if (event.key === 'c' && !shipVisible) {
        circleVisible = !circleVisible;
        deactivateCircle.style.backgroundColor = getBackgroundColor(circleVisible);
    }
    if (event.key === 's' && !shipVisible) {
        squaresVisible = !squaresVisible;
        deactivateSquare.style.backgroundColor = getBackgroundColor(squaresVisible);
    }
    if (event.key === 'x' && !shipVisible) {
        coordinatesVisible = !coordinatesVisible;
        deactivateCoordinates.style.backgroundColor = getBackgroundColor(coordinatesVisible);
    }
    if (event.key === 'g' && !shipVisible) {
        gridVisible = !gridVisible;
        deactivateGrid.style.backgroundColor = getBackgroundColor(gridVisible);
    }
    if (event.key === 'r' && !shipVisible) {
        gravityON = !gravityON;
        deactivateGravity.style.backgroundColor = getBackgroundColor(gravityON);
    }
    if (event.key === 'u' && !shipVisible) {
        unityCircleVisible = !unityCircleVisible;
        deactivateUnityCircle.style.backgroundColor = getBackgroundColor(unityCircleVisible);
    }
    if (event.key === 'l' && !shipVisible) {
        linesVisible = !linesVisible;
        deactivateLines.style.backgroundColor = getBackgroundColor(linesVisible);
    }
    if (event.key === 'p') {
        movePlayerToRandomPosition();
    }
    if (event.key === 'v') {
        shipVisible = !shipVisible;
        triangleVisible = false;
        circleVisible = false; 
        squaresVisible = false;
        coordinatesVisible = false;
        gridVisible = false;
        gravityON = false;
        unityCircleVisible = false;
        linesVisible = false;
        object.x = canvas.width / 2 - object.width / 2;
        object.y = canvas.height / 2 - object.height / 2;
        deactivateTriangle.style.backgroundColor = getBackgroundColor(triangleVisible);
        deactivateCircle.style.backgroundColor = getBackgroundColor(circleVisible);
        deactivateSquare.style.backgroundColor = getBackgroundColor(squaresVisible);
        deactivateCoordinates.style.backgroundColor = getBackgroundColor(coordinatesVisible);
        deactivateGrid.style.backgroundColor = getBackgroundColor(gridVisible);
        deactivateGravity.style.backgroundColor = getBackgroundColor(gravityON);
        deactivateUnityCircle.style.backgroundColor = getBackgroundColor(unityCircleVisible);
        deactivateLines.style.backgroundColor = getBackgroundColor(linesVisible);
        deactivateGame.style.backgroundColor = getBackgroundColor(shipVisible);
    }
});

// Função principal para desenhar o jogo e atualizar o estado
function gameLoop() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'menu') {
        drawMenu();
    } else if (gameState === 'playing') {
        update();

        if (gridVisible) {
            drawGrid();
        }

        if (unityCircleVisible) {
            drawUnitCircleWithRotatingLines();
        }

        if (shipVisible) {
            if ('ArrowUp' in keysPressed && !gravityON && object.y - object.speed >= 0) {
                object.y -= object.speed;
            }
            if ('ArrowDown' in keysPressed && object.y + object.height + object.speed <= canvas.height) {
                object.y += object.speed;
            }
            if ('ArrowLeft' in keysPressed && object.x - object.speed >= 0) {
                object.x -= object.speed;
            }
            if ('ArrowRight' in keysPressed && object.x + object.width + object.speed <= canvas.width) {
                object.x += object.speed;
            }
            drawBackground();
            drawShip();
            drawProjectiles();
            updateProjectiles();
            drawScore();
            drawObjectLifeBar(currentLife, maxLife);
            drawCooldownText(lastExplosionTime, explosionDelay, "Super Nova!", 10, 95);
            drawCooldownText(lastFleetTime, fleetDelay, "Exército!", 10, 125);
            drawAliens();
            moveAliens();
            removeOutOfScreenAliens();
            checkPlayerAlienCollision();
            checkProjectileAlienCollision();
            meteorShower.forEach(meteor => {
                meteor.move();
                meteor.draw();
            });
            checkMeteorCollisions(object, meteorShower);
            removeOutOfScreenMeteors();
            drawLifeUps();
            checkLifeUpCollision(object);
            triangleVisible = false;
            circleVisible = false; 
            squaresVisible = false;
            coordinatesVisible = false;
            gridVisible = false;
            gravityON = false;
            unityCircleVisible = false;
            linesVisible = false;
            if (explosao !== null) {
                explosao.update();
                explosao.draw();
                explosao.checkCollisionsWithMeteors(meteorShower);
                explosao.checkCollisionsWithAliens(aliens);
            }
            if (isFleetActive && Date.now() - fleetActivationTime < fleetDuration) {
                updateAndDrawShips(); // Atualizar e desenhar as naves da Frota de Ajuda
            } else {
                deactivateFleet(); // Desativar a Frota de Ajuda após o término do tempo
            }
            updateAndDrawShips(); // Atualizar e desenhar as naves da Frota de Ajuda
            checkFleetCollisionsWithAliens();
            checkFleetCollisionsWithMeteors();
            if (currentLife <= 0) {
                shipVisible = false;
                currentLife = 13;
                deactivateGame.style.backgroundColor = getBackgroundColor(shipVisible);
            }
        } else {
            drawObject();
            aliens = [];
            score = 0;
            projectiles = [];
            currentLife = 13;
            meteorShower = [];
            lifeUps = [];
            if (explosao){
                explosao.active = false;
                lastExplosionTime = 0;
            }
            fleet = [];
            lastFleetTime = 0;
            deactivateFleet();
        }

        if (linesVisible) {
            drawDiagonalLineToOrigin(object.x, object.y);
            drawDistanceLines();     
        }

        if (coordinatesVisible){
            drawCoordinates();   
        }

        if (squaresVisible) {
            drawMovingObjects();
            updateMovingObjects();

            detectCollisions();

            drawDiagonalObjects();
            updateDiagonalObjects();
            detectDiagonalObjectCollisions();

            drawSinusoidalObjects();
            updateSinusoidalObjects();

            detectCollisionsBetweenLists(movingObjects, diagonalObjects, sinusoidalObjects);      
        }

        if (circleVisible) {
            bouncingCircle.draw();
            bouncingCircle.update();   
        }

        if (triangleVisible) {
            movingTriangle.update();
            movingTriangle.draw();        
        }

        // Cria novos objetos móveis em intervalos regulares
        if (frameCount % 250 === 0 && squaresVisible) {
            createMovingObjects();
            createDiagonalObjects();
            createSinusoidalObjects();
        }

        if (frameCount % 50 === 0 && shipVisible) {
            createAlien();
            generateRandomShip();
        }

        if (frameCount % 500 === 0 && shipVisible) {
            createMeteorShower();
            addLifeUp();
        }
        
        frameCount++; // Incrementa o contador de quadros
    }

    // Solicita ao navegador que chame a função gameLoop na próxima atualização de quadro
    requestAnimationFrame(gameLoop);
}

// Fora da função gameLoop, crie uma função para calcular o tempo restante em segundos
function calculateCooldownText(startTime, cooldownDuration, readyMessage) {
    const currentTime = Date.now();
    const timeRemaining = startTime + cooldownDuration - currentTime;

    // Se o tempo restante for menor ou igual a zero, o cooldown está completo
    if (timeRemaining <= 0) {
        return readyMessage;
    }

    // Converta o tempo restante de milissegundos para segundos e arredonde para baixo
    const secondsRemaining = Math.floor(timeRemaining / 1000);

    return `Cooldown: ${secondsRemaining} s`;
}

// Dentro da função gameLoop, desenhe o texto do cooldown
function drawCooldownText(startTime, cooldownDuration, readyMessage, positionX, positionY) {
    const cooldownText = calculateCooldownText(startTime, cooldownDuration, readyMessage);
    ctx.fillStyle = '#44ff00'; // Cor do texto
    ctx.font = 'bold 18px Arial'; // Estilo da fonte
    ctx.fillText(cooldownText, positionX, positionY); // Posição do texto na tela
}

let explosao = null;
// Defina uma variável para controlar se o jogador está pulando
let isJumping = false;
// Defina a força do pulo
let jumpStrength = -10; // Ajuste conforme necessário
// Função para lidar com os eventos de teclado
function handleKeyDown(event) {
    keysPressed[event.key] = true;

    // Verifica teclas pressionadas para movimento
    if (!shipVisible) {
        if ('ArrowUp' in keysPressed && !gravityON) {
            object.y -= object.speed;
        }
        if ('ArrowDown' in keysPressed) {
            object.y += object.speed;
        }
        if ('ArrowLeft' in keysPressed) {
            object.x -= object.speed;
        }
        if ('ArrowRight' in keysPressed) {
            object.x += object.speed;
        }       
    }
    if (' ' in keysPressed && !isJumping && gravityON) {
        // Ativa o pulo
        isJumping = true;
        // Aplica a força do pulo à velocidade vertical
        velocityY = jumpStrength;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === " ") {
        event.preventDefault();
    }

    if (event.key === 'q' && shipVisible) {
        // Verifica se já passou tempo suficiente desde o último tiro
        var currentTime = Date.now();
        if (currentTime - lastShotTime > shootDelay) {
            // Adiciona um novo projétil à lista de projéteis
            projectiles.push({
                x: object.x + object.width / 2, // Posição x no meio do objeto
                y: object.y, // Posição y no topo do objeto
                width: 5,
                height: 10,
                speed: 5 // Velocidade ascendente dos projéteis
            });
            // Atualiza o tempo do último tiro
            lastShotTime = currentTime;
        }
    }

    if (event.key === 'b' && shipVisible) {
        // Aqui você cria uma nova instância da explosão e a lança
        var currentExplosionTime = Date.now();
        if (currentExplosionTime - lastExplosionTime > explosionDelay) {
            explosao = new Explosao(object.x + 25, object.y + 25);
            explosao.launch();
            lastExplosionTime = currentExplosionTime;
        }
    }

    if (event.key === 'h' && !isFleetActive) {
        var curretFleetTime = Date.now();
        if (curretFleetTime - lastFleetTime > fleetDelay) {
            activateFleet();
            lastFleetTime = curretFleetTime;
        }
    }

    // Verifica se a tecla pressionada é a tecla que leva de volta ao menu
    if (event.key === 'Escape') {
        // Muda o estado do jogo para 'menu'
        gameState = 'menu';

        // Remove o ouvinte de eventos de teclado do jogo principal
        document.removeEventListener('keydown', handleKeyDown);

        // Adiciona o ouvinte de eventos de teclado para o menu
        document.addEventListener('keydown', handleMenuKeyPress);
    }
}

// Função para lidar com as teclas liberadas
function handleKeyUp(event) {
    delete keysPressed[event.key];
}

// Adiciona ouvintes de eventos de teclado
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Inicializa o jogo
gameLoop();