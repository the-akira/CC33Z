document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = 0.085;

    // Função para reproduzir a música
    function playMusic() {
        backgroundMusic.play();
    }

    // Função para pausar a música
    function pauseMusic() {
        backgroundMusic.pause();
    }

    // Função para parar a música e voltar para o início
    function stopMusic() {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Retorna a música para o início
    }

    // Rolagem de Dados
    var d6 = Math.floor(Math.random() * 6) + 1;
    var randomHP = document.getElementById('randomHP');
    randomHP.textContent = "Health Points: " + d6;

    var d4 = Math.floor(Math.random() * 4) + 1;
    var randomMeteor = document.getElementById('randomMeteor');
    randomMeteor.textContent = "Meteors: " + d4;

    var d8 = Math.floor(Math.random() * 8) + 1;
    var randomShield = document.getElementById('randomShield');
    randomShield.textContent = "Shield: " + d8;

    var d12 = Math.floor(Math.random() * 8) + 1;
    var randomOrbe = document.getElementById('randomOrbe');
    randomOrbe.textContent = "Orbe: " + d12;

    class Bat {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.width = 140;
            this.height = 91;
            this.x = (canvas.width - this.width) / 2;
            this.y = (canvas.height - this.height) / 2;
            this.speedX = 3;
            this.speedY = 4;
            this.images = [];
            for (let i = 1; i <= 4; i++) {
                const img = new Image();
                img.src = 'sprites/bat/bat' + i + '.png';
                this.images.push(img);
            }
            this.currentImageIndex = 0;
            this.frameCounter = 0;
            this.maxHealth = d6; // Vida máxima do jogador
            this.health = this.maxHealth; // Vida atual do jogador
            this.score = 0; // Inicialize o score do jogador como 0
            this.projectileCharges = d12;
            this.lastProjectileTime = 0;
            this.lastShoot = true;
            this.cooldown = 500;
            this.shieldCooldown = 0;
            this.shieldCharges = d8; // Número de cargas do escudo
            this.shieldActive = false; // Indica se o escudo está ativo ou não
            // Carregar a imagem do escudo
            this.shieldImage = new Image();
            this.shieldImage.src = 'sprites/itens/shield.png';
            this.cooldownMeteor = 1500;
            this.lastMeteor = true;
            this.meteorCharges = d4;
        }

        update(keysPressed) {
            if ('ArrowLeft' in keysPressed) {
                if (this.x - this.speedX >= 0) {
                    this.x -= this.speedX;
                }
            }
            if ('ArrowRight' in keysPressed) {
                if (this.x + this.width + this.speedX <= this.canvas.width) {
                    this.x += this.speedX;
                }
            }
            if ('ArrowUp' in keysPressed && this.y - this.speedY >= 0) {
                this.y -= this.speedY;
            }
            if ('ArrowDown' in keysPressed && this.y + this.height + this.speedY <= this.canvas.height) {
                this.y += this.speedY;
            }
            this.frameCounter++;
            if (this.frameCounter % 6 === 0) {
                this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            }

            if (this.shieldCooldown > 0) {
                this.shieldCooldown--;
            }
            if (this.shieldCooldown == 0) {
                this.shieldActive = false;
            }
        }

        activateShield() {
            // Ativa o escudo se houver cargas disponíveis e o cooldown estiver zerado
            if (this.shieldCharges > 0 && this.shieldCooldown === 0) {
                this.shieldActive = true;
                this.shieldCharges--; // Reduz uma carga do escudo
                this.shieldCooldown = 400; // Define o cooldown do escudo (300 frames, por exemplo)
            }
        }

        draw() {
            this.ctx.drawImage(this.images[this.currentImageIndex], this.x, this.y, this.width, this.height);
            if (this.shieldActive) {
                this.ctx.drawImage(this.shieldImage, this.x + 46, this.y + 25, 45, 45);
            }
        }

        drawLife() {
            const skullImage = new Image();
            skullImage.src = 'sprites/icons/skull.png'; // Imagem do coração
            const skullWidth = 30;
            const skullHeight = 30;
            const skullSpacing = 10;
            const skullsX = 10; // Posição inicial dos corações
            const skullsY = 10;
            
            for (let i = 0; i < this.health; i++) {
                this.ctx.drawImage(skullImage, skullsX + (skullWidth + skullSpacing) * i, skullsY, skullWidth, skullHeight);
            }
        }

        drawEnergy() {
            const coffinImage = new Image();
            coffinImage.src = 'sprites/icons/coffin.png'; // Imagem do coração
            const coffinWidth = 24;
            const coffinHeight = 33;
            const coffinSpacing = 10;
            const coffinsX = 13; // Posição inicial dos corações
            const coffinsY = 50;
            
            for (let i = 0; i < this.projectileCharges; i++) {
                this.ctx.drawImage(coffinImage, coffinsX + (coffinWidth + coffinSpacing) * i, coffinsY, coffinWidth, coffinHeight);
            }
        }

        drawShields() {
            const shieldImage = new Image();
            shieldImage.src = 'sprites/icons/shield.png'; // Imagem do coração
            const shieldWidth = 24;
            const shieldHeight = 26;
            const shieldSpacing = 10;
            const shieldsX = 13; // Posição inicial dos corações
            const shieldsY = 90;
            
            for (let i = 0; i < this.shieldCharges; i++) {
                this.ctx.drawImage(shieldImage, shieldsX + (shieldWidth + shieldSpacing) * i, shieldsY, shieldWidth, shieldHeight);
            }
        }

        drawFire() {
            const fireImage = new Image();
            fireImage.src = 'sprites/icons/fire.png'; // Imagem do coração
            const fireWidth = 28;
            const fireHeight = 28;
            const fireSpacing = 10;
            const firesX = 13; // Posição inicial dos corações
            const firesY = 130;
            
            for (let i = 0; i < this.meteorCharges; i++) {
                this.ctx.drawImage(fireImage, firesX + (fireWidth + fireSpacing) * i, firesY, fireWidth, fireHeight);
            }
        }

        drawScore() {
            this.ctx.save();
            this.ctx.shadowColor = '#ff00fb'; // Cor da sombra
            this.ctx.shadowBlur = 10; // Intensidade da sombra
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Score: ' + this.score, 11, 586); // Posição do score na tela
            ctx.restore()
        }

        drawShieldCoolDown() {
            this.ctx.save();
            this.ctx.shadowColor = '#ff00fb'; // Cor da sombra
            this.ctx.shadowBlur = 10; // Intensidade da sombra
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Cooldown: ' + this.shieldCooldown, 630, 586); // Posição do score na tela
            ctx.restore()
        }

        // Método para recarregar as cargas de projéteis
        reloadProjectiles() {
            this.projectileCharges += 1; // Recarrega as cargas de projéteis para 3
        }

        // Método para lançar projéteis
        shoot() {
            this.projectileCharges--;
        }

        shootMeteor() {
            criarMeteoros();
            this.meteorCharges--;
        }
    }
    const bat = new Bat(canvas, ctx);

    // Array de imagens de fundo
    const backgroundImages = [];
    for (let i = 1; i <= 4; i++) { // Suponhamos que você tenha 3 imagens de fundo
        const img = new Image();
        img.src = 'sprites/background/background' + i + '.png'; // Substitua o nome da imagem e a extensão
        backgroundImages.push(img);
    }

    let currentBackgroundImageIndex = 0;
    let backgroundFrameCounter = 0;

    function drawBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImages[currentBackgroundImageIndex], 0, 0, canvas.width, canvas.height);
    }

    function updateBackground() {
        backgroundFrameCounter++;

        if (backgroundFrameCounter % 100 === 0) { // Altere o valor para controlar a troca de imagens de fundo
            currentBackgroundImageIndex = (currentBackgroundImageIndex + 1) % backgroundImages.length;
        }
    }

    class Imp {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.width = 66;
            this.height = 83;
            this.x = Math.random() * (canvas.width - this.width); // Posição aleatória no eixo x
            this.y = -this.height; // Começa acima do topo do canvas
            this.speedY = 2; // Velocidade de descida do Imp
            this.images = []; // Array para armazenar as imagens do Imp
            for (let i = 1; i <= 4; i++) {
                const img = new Image();
                img.src = 'sprites/imp/imp' + i + '.png';
                this.images.push(img);
            }
            this.currentImageIndex = 0;
            this.frameCounter = 0;
        }

        update() {
            this.y += this.speedY; // Move o Imp para baixo
            this.frameCounter++;
            if (this.frameCounter % 6 === 0) { // Controla a velocidade da animação do Imp
                this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            }
        }

        draw() {
            this.ctx.drawImage(this.images[this.currentImageIndex], this.x, this.y, this.width, this.height);
        }
    }

    class Death {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.width = 50;
            this.height = 50;
            this.x = Math.random() * (canvas.width - this.width); // Posição aleatória no eixo x
            this.y = canvas.height; // Começa abaixo do canvas
            this.speedY = -2; // Velocidade de subida do Death
            this.images = []; // Array para armazenar as imagens do Death
            for (let i = 1; i <= 6; i++) {
                const img = new Image();
                img.src = 'sprites/death/death' + i + '.png';
                this.images.push(img);
            }
            this.currentImageIndex = 0;
            this.frameCounter = 0;
        }

        update() {
            this.y += this.speedY; // Move o Death para cima
            this.frameCounter++;
            if (this.frameCounter % 6 === 0) { // Controla a velocidade da animação do Death
                this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            }
        }

        draw() {
            this.ctx.drawImage(this.images[this.currentImageIndex], this.x, this.y, this.width, this.height);
        }
    }

    class Pumpkin {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.width = 55;
            this.height = 42;
            this.x = -this.width; // Começa fora do canvas à esquerda
            this.y = Math.random() * (canvas.height - this.height);
            this.speedX = 2; // Velocidade horizontal do Pumpkin
            this.amplitude = 2; // Amplitude do movimento senoidal
            this.frequency = 0.02; // Frequência do movimento senoidal
            this.images = []; // Array para armazenar as imagens do Pumpkin
            for (let i = 1; i <= 3; i++) {
                const img = new Image();
                img.src = 'sprites/pumpkin/pumpkin' + i + '.png';
                this.images.push(img);
            }
            this.currentImageIndex = 0;
            this.frameCounter = 0;
        }

        update() {
            this.x += this.speedX; // Move o Pumpkin para a direita
            // Movimento senoidal
            this.y += this.amplitude * Math.sin(this.frequency * this.x);
            this.frameCounter++;
            if (this.frameCounter % 6 === 0) { // Controla a velocidade da animação do Pumpkin
                this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            }
        }

        draw() {
            this.ctx.drawImage(this.images[this.currentImageIndex], this.x, this.y, this.width, this.height);
        }
    }

    class Crow {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.width = 60;
            this.height = 60;
            this.x = canvas.width; // Começa fora do canvas à direita
            this.y = Math.random() * (canvas.height - this.height);
            this.speedX = -2; // Velocidade horizontal do Crow (da direita para a esquerda)
            this.amplitude = 3; // Amplitude do movimento cossenoidal
            this.frequency = 0.03; // Frequência do movimento cossenoidal
            this.images = []; // Array para armazenar as imagens do Crow
            for (let i = 1; i <= 8; i++) {
                const img = new Image();
                img.src = 'sprites/crow/crow' + i + '.png';
                this.images.push(img);
            }
            this.currentImageIndex = 0;
            this.frameCounter = 0;
        }

        update() {
            this.x += this.speedX; // Move o Crow para a esquerda
            // Movimento cossenoidal
            this.y += this.amplitude * Math.cos(this.frequency * this.x);
            this.frameCounter++;
            if (this.frameCounter % 6 === 0) { // Controla a velocidade da animação do Crow
                this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            }
        }

        draw() {
            this.ctx.drawImage(this.images[this.currentImageIndex], this.x, this.y, this.width, this.height);
        }
    }

    let deaths = []; // Array para armazenar os inimigos Death ativos

    // Função para gerar novos inimigos Death
    function generateDeath() {
        const death = new Death(canvas, ctx);
        deaths.push(death);
    }

    // Função para atualizar e desenhar os inimigos Death
    function updateAndDrawDeaths() {
        for (let i = 0; i < deaths.length; i++) {
            const death = deaths[i];
            death.update(); // Atualiza a posição e animação do Death
            death.draw(); // Desenha o Death no canvas

            // Verifica se o Death está fora do canvas
            if (death.y + death.height < 0) {
                // Remove o Death da lista de inimigos ativos
                deaths.splice(i, 1);
                i--; // Atualiza o índice após remover o Death
                bat.score++;
            }
        }
    }

    let crows = []; // Array para armazenar os inimigos Crow ativos

    // Função para gerar novos inimigos Crow
    function generateCrow() {
        const crow = new Crow(canvas, ctx);
        crows.push(crow);
    }

    // Função para atualizar e desenhar os inimigos Crow
    function updateAndDrawCrows() {
        for (let i = 0; i < crows.length; i++) {
            const crow = crows[i];
            crow.update(); // Atualiza a posição e animação do Crow
            crow.draw(); // Desenha o Crow no canvas

            // Verifica se o Crow está fora do canvas
            if (crow.x > canvas.width) {
                // Remove o Crow da lista de inimigos ativos
                crows.splice(i, 1);
                i--; // Atualiza o índice após remover o Crow
            }
        }
    }

    function checkCrowCollisions() {
        for (let i = 0; i < crows.length; i++) {
            const crow = crows[i];
            if (
                bat.x < crow.x + crow.width &&
                bat.x + bat.width > crow.x &&
                bat.y < crow.y + crow.height &&
                bat.y + bat.height > crow.y
            ) {
                // Colisão detectada com Crow, remover o Crow da lista de inimigos ativos
                crows.splice(i, 1);
                i--; // Atualiza o índice após remover o Crow
                if (!bat.shieldActive) {
                    bat.health--;
                } else {
                    bat.shieldActive = false;
                }
            }
        }
    }

    let enemies = []; // Array para armazenar os inimigos ativos

    // Função para gerar novos inimigos
    function generateEnemy() {
        const enemy = new Imp(canvas, ctx); // Criar um novo inimigo (Imp neste caso)
        enemies.push(enemy); // Adicionar o inimigo à lista de inimigos ativos
    }

    // Intervalo de tempo para gerar novos inimigos (em milissegundos)
    const enemyGenerationInterval = 3000; // Por exemplo, um novo inimigo a cada 3 segundos

    // Função para atualizar e desenhar os inimigos
    function updateAndDrawEnemies() {
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            enemy.update(); // Atualiza a posição e animação do inimigo
            enemy.draw(); // Desenha o inimigo no canvas

            // Verifica se o inimigo está fora do canvas
            if (enemy.y > canvas.height) {
                // Remove o inimigo da lista de inimigos ativos
                enemies.splice(i, 1);
                i--; // Atualiza o índice após remover o inimigo
                bat.score++;
            }
        }
    }

    function checkCollisions() {
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (
                bat.x < enemy.x + enemy.width &&
                bat.x + bat.width > enemy.x &&
                bat.y < enemy.y + enemy.height &&
                bat.y + bat.height > enemy.y
            ) {
                // Colisão detectada, remover o Imp da lista de inimigos ativos
                enemies.splice(i, 1);
                i--; // Atualiza o índice após remover o inimigo
                if (!bat.shieldActive) {
                    bat.health--;
                } else {
                    bat.shieldActive = false;
                }
            }
        }

        // Colisão com inimigos Death
        for (let i = 0; i < deaths.length; i++) {
            const death = deaths[i];
            if (
                bat.x < death.x + death.width &&
                bat.x + bat.width > death.x &&
                bat.y < death.y + death.height &&
                bat.y + bat.height > death.y
            ) {
                // Colisão detectada com Death, remover o Death da lista de inimigos ativos
                deaths.splice(i, 1);
                i--; // Atualiza o índice após remover o inimigo
                if (!bat.shieldActive) {
                    bat.health--;
                } else {
                    bat.shieldActive = false;
                }
            }
        }
    }

    let pumpkins = []; // Array para armazenar os inimigos Pumpkin ativos

    // Função para gerar novos inimigos Pumpkin
    function generatePumpkin() {
        const pumpkin = new Pumpkin(canvas, ctx);
        pumpkins.push(pumpkin);
    }

    // Função para atualizar e desenhar os inimigos Pumpkin
    function updateAndDrawPumpkins() {
        for (let i = 0; i < pumpkins.length; i++) {
            const pumpkin = pumpkins[i];
            pumpkin.update(); // Atualiza a posição e animação do Pumpkin
            pumpkin.draw(); // Desenha o Pumpkin no canvas

            // Verifica se o Pumpkin está fora do canvas
            if (pumpkin.x > canvas.width) {
                // Remove o Pumpkin da lista de inimigos ativos
                pumpkins.splice(i, 1);
                i--; // Atualiza o índice após remover o Pumpkin
            }
        }
    }

    function checkPumpkinCollisions() {
        for (let i = 0; i < pumpkins.length; i++) {
            const pumpkin = pumpkins[i];
            if (
                bat.x < pumpkin.x + pumpkin.width &&
                bat.x + bat.width > pumpkin.x &&
                bat.y < pumpkin.y + pumpkin.height &&
                bat.y + bat.height > pumpkin.y
            ) {
                // Colisão detectada com Pumpkin, remover o Pumpkin da lista de inimigos ativos
                pumpkins.splice(i, 1);
                i--; // Atualiza o índice após remover o Pumpkin
                if (!bat.shieldActive) {
                    bat.health--;
                } else {
                    bat.shieldActive = false;
                }
            }
        }
    }

    function checkProjectileCollisions() {
        if (projectiles.length > 0) {
            for (let i = 0; i < projectiles.length; i++) {
                const projectile = projectiles[i];
                projectile.update(); // Atualiza a posição do projétil
                projectile.draw(); // Desenha o projétil no canvas

                // Verificar colisões com os inimigos
                for (let j = 0; j < enemies.length; j++) {
                    const enemy = enemies[j];
                    if (
                        projectile.x < enemy.x + enemy.width &&
                        projectile.x + projectile.radius > enemy.x &&
                        projectile.y < enemy.y + enemy.height &&
                        projectile.y + projectile.radius > enemy.y
                    ) {
                        // Remove o inimigo da lista de inimigos ativos
                        enemies.splice(j, 1);
                        j--; // Atualiza o índice após remover o inimigo
                        bat.score++; // Incrementa a pontuação do jogador
                        projectiles.splice(i, 1); // Remove o projétil da lista de projéteis
                        i--; // Atualiza o índice após remover o projétil
                    }
                }

                for (let j = 0; j < pumpkins.length; j++) {
                    const pumpkin = pumpkins[j];
                    if (
                        projectile.x < pumpkin.x + pumpkin.width &&
                        projectile.x + projectile.radius > pumpkin.x &&
                        projectile.y < pumpkin.y + pumpkin.height &&
                        projectile.y + projectile.radius > pumpkin.y
                    ) {
                        // Remove o inimigo da lista de inimigos ativos
                        pumpkins.splice(j, 1);
                        j--; // Atualiza o índice após remover o inimigo
                        bat.score++; // Incrementa a pontuação do jogador
                        projectiles.splice(i, 1); // Remove o projétil da lista de projéteis
                        i--; // Atualiza o índice após remover o projétil
                    }
                }

                for (let j = 0; j < crows.length; j++) {
                    const crow = crows[j];
                    if (
                        projectile.x < crow.x + crow.width &&
                        projectile.x + projectile.radius > crow.x &&
                        projectile.y < crow.y + crow.height &&
                        projectile.y + projectile.radius > crow.y
                    ) {
                        // Remove o inimigo da lista de inimigos ativos
                        crows.splice(j, 1);
                        j--; // Atualiza o índice após remover o inimigo
                        bat.score++; // Incrementa a pontuação do jogador
                        projectiles.splice(i, 1); // Remove o projétil da lista de projéteis
                        i--; // Atualiza o índice após remover o projétil
                    }
                }

                for (let j = 0; j < deaths.length; j++) {
                    const death = deaths[j];
                    if (
                        projectile.x < death.x + death.width &&
                        projectile.x + projectile.radius > death.x &&
                        projectile.y < death.y + death.height &&
                        projectile.y + projectile.radius > death.y
                    ) {
                        // Remove o inimigo da lista de inimigos ativos
                        deaths.splice(j, 1);
                        j--; // Atualiza o índice após remover o inimigo
                        bat.score++; // Incrementa a pontuação do jogador
                        projectiles.splice(i, 1); // Remove o projétil da lista de projéteis
                        i--; // Atualiza o índice após remover o projétil
                    }
                }
            }
        }
    }

    function checkMeteorCollisions() {
        if (meteoros.length > 0) {
            for (let i = 0; i < meteoros.length; i++) {
                const meteor = meteoros[i];
                if (meteor) {
                    // Coordenadas dos vértices do retângulo envolvendo o meteoro
                    const meteorLeft = meteor.x;
                    const meteorRight = meteor.x + meteor.largura;
                    const meteorTop = meteor.y;
                    const meteorBottom = meteor.y + meteor.altura;

                    // Verificar colisões com os inimigos
                    for (let j = 0; j < enemies.length; j++) {
                        const enemy = enemies[j];
                        // Coordenadas dos vértices do retângulo envolvendo o inimigo
                        const enemyLeft = enemy.x;
                        const enemyRight = enemy.x + enemy.width;
                        const enemyTop = enemy.y;
                        const enemyBottom = enemy.y + enemy.height;

                        // Verificar colisão entre o meteoro e o inimigo
                        if (
                            meteorRight > enemyLeft &&
                            meteorLeft < enemyRight &&
                            meteorBottom > enemyTop &&
                            meteorTop < enemyBottom
                        ) {
                            // Remover o inimigo e o meteoro
                            enemies.splice(j, 1);
                            j--; // Atualiza o índice após remover o inimigo
                            bat.score++; // Incrementa a pontuação do jogador
                            meteoros.splice(i, 1); // Remove o meteoro
                            i--; // Atualiza o índice após remover o meteoro
                        }
                    }

                    for (let j = 0; j < pumpkins.length; j++) {
                        const pumpkin = pumpkins[j];
                        // Coordenadas dos vértices do retângulo envolvendo o inimigo
                        const pumpkinLeft = pumpkin.x;
                        const pumpkinRight = pumpkin.x + pumpkin.width;
                        const pumpkinTop = pumpkin.y;
                        const pumpkinBottom = pumpkin.y + pumpkin.height;

                        // Verificar colisão entre o meteoro e o inimigo
                        if (
                            meteorRight > pumpkinLeft &&
                            meteorLeft < pumpkinRight &&
                            meteorBottom > pumpkinTop &&
                            meteorTop < pumpkinBottom
                        ) {
                            // Remover o inimigo e o meteoro
                            pumpkins.splice(j, 1);
                            j--; // Atualiza o índice após remover o inimigo
                            bat.score++; // Incrementa a pontuação do jogador
                            meteoros.splice(i, 1); // Remove o meteoro
                            i--; // Atualiza o índice após remover o meteoro
                        }
                    }

                    for (let j = 0; j < crows.length; j++) {
                        const crow = crows[j];
                        // Coordenadas dos vértices do retângulo envolvendo o inimigo
                        const crowLeft = crow.x;
                        const crowRight = crow.x + crow.width;
                        const crowTop = crow.y;
                        const crowBottom = crow.y + crow.height;

                        // Verificar colisão entre o meteoro e o inimigo
                        if (
                            meteorRight > crowLeft &&
                            meteorLeft < crowRight &&
                            meteorBottom > crowTop &&
                            meteorTop < crowBottom
                        ) {
                            // Remover o inimigo e o meteoro
                            crows.splice(j, 1);
                            j--; // Atualiza o índice após remover o inimigo
                            bat.score++; // Incrementa a pontuação do jogador
                            meteoros.splice(i, 1); // Remove o meteoro
                            i--; // Atualiza o índice após remover o meteoro
                        }
                    }

                    for (let j = 0; j < deaths.length; j++) {
                        const death = deaths[j];
                        // Coordenadas dos vértices do retângulo envolvendo o inimigo
                        const deathLeft = death.x;
                        const deathRight = death.x + death.width;
                        const deathTop = death.y;
                        const deathBottom = death.y + death.height;

                        // Verificar colisão entre o meteoro e o inimigo
                        if (
                            meteorRight > deathLeft &&
                            meteorLeft < deathRight &&
                            meteorBottom > deathTop &&
                            meteorTop < deathBottom
                        ) {
                            // Remover o inimigo e o meteoro
                            deaths.splice(j, 1);
                            j--; // Atualiza o índice após remover o inimigo
                            bat.score++; // Incrementa a pontuação do jogador
                            meteoros.splice(i, 1); // Remove o meteoro
                            i--; // Atualiza o índice após remover o meteoro
                        }
                    }
                }
            }
        }
    }

    class Sword {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.width = 30;
            this.height = 30;
            this.x = Math.random() * (canvas.width - this.width);
            this.y = Math.random() * (canvas.height - this.height);
            this.image = new Image();
            this.image.src = 'sprites/itens/sword.png'; // Caminho da imagem do item especial
        }

        draw() {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    let sword = null; // Variável para armazenar o item especial
    let lastSwordGenerationTime = 0; // Momento em que o último item especial foi gerado
    const swordGenerationInterval = 15000; // Intervalo de geração do item especial em milissegundos (15 segundos)

    let swords = []; // Lista para armazenar os itens especiais

    // Função para gerar um novo item especial
    function generateSword() {
        const sword = new Sword(canvas, ctx);
        swords.push(sword);
    }

    // Função para verificar se é hora de gerar novos itens especiais
    function checkSwordGeneration() {
        const currentTime = Date.now();
        if (currentTime - lastSwordGenerationTime >= swordGenerationInterval) {
            generateSword();
            lastSwordGenerationTime = currentTime; // Atualiza o momento em que o item especial foi gerado
        }
    }

    // Função para verificar colisões do jogador com os itens especiais
    function checkSwordCollision() {
        let enemiesRemoved = 0; // Variável para armazenar a contagem de inimigos removidos
        for (let i = 0; i < swords.length; i++) {
            const sword = swords[i];
            if (
                bat.x < sword.x + sword.width &&
                bat.x + bat.width > sword.x &&
                bat.y < sword.y + sword.height &&
                bat.y + bat.height > sword.y
            ) {
                swords.splice(i, 1); // Remove o item especial da lista
                // Aqui você pode adicionar a lógica para o efeito do item especial
                // Por exemplo, limpar a lista de inimigos e contá-los
                bat.projectileCharges += 1;
                // Se necessário, adicione aqui a lógica para outros efeitos do item especial
            }
        }      
    }

    class Eye {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.width = 33;
            this.height = 30;
            this.x = Math.random() * (canvas.width - this.width);
            this.y = Math.random() * (canvas.height - this.height);
            this.image = new Image();
            this.image.src = 'sprites/itens/eye.png'; // Caminho da imagem do item especial
        }

        draw() {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    let eye = null; // Variável para armazenar o item especial
    let lastEyeGenerationTime = 0; // Momento em que o último item especial foi gerado
    const eyeGenerationInterval = 15000; // Intervalo de geração do item especial em milissegundos (15 segundos)

    let eyes = []; // Lista para armazenar os itens especiais

    // Função para gerar um novo item especial
    function generateEye() {
        const eye = new Eye(canvas, ctx);
        eyes.push(eye);
    }

    // Função para verificar se é hora de gerar novos itens especiais
    function checkEyeGeneration() {
        const currentTime = Date.now();
        if (currentTime - lastEyeGenerationTime >= eyeGenerationInterval) {
            generateEye();
            lastEyeGenerationTime = currentTime; // Atualiza o momento em que o item especial foi gerado
        }
    }

    // Função para verificar colisões do jogador com os itens especiais
    function checkEyeCollision() {
        let enemiesRemoved = 0; // Variável para armazenar a contagem de inimigos removidos
        for (let i = 0; i < eyes.length; i++) {
            const eye = eyes[i];
            if (
                bat.x < eye.x + eye.width &&
                bat.x + bat.width > eye.x &&
                bat.y < eye.y + eye.height &&
                bat.y + bat.height > eye.y
            ) {
                eyes.splice(i, 1); // Remove o item especial da lista
                // Aqui você pode adicionar a lógica para o efeito do item especial
                // Por exemplo, limpar a lista de inimigos e contá-los
                bat.meteorCharges += 1;
                // Se necessário, adicione aqui a lógica para outros efeitos do item especial
            }
        }      
    }

    class SpecialItem {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.width = 26;
            this.height = 27;
            this.x = Math.random() * (canvas.width - this.width);
            this.y = Math.random() * (canvas.height - this.height);
            this.image = new Image();
            this.image.src = 'sprites/itens/talisman.png'; // Caminho da imagem do item especial
        }

        draw() {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    let specialItem = null; // Variável para armazenar o item especial
    let lastSpecialItemGenerationTime = 0; // Momento em que o último item especial foi gerado
    const specialItemGenerationInterval = 15000; // Intervalo de geração do item especial em milissegundos (15 segundos)

    let specialItems = []; // Lista para armazenar os itens especiais

    // Função para gerar um novo item especial
    function generateSpecialItem() {
        const specialItem = new SpecialItem(canvas, ctx);
        specialItems.push(specialItem);
    }

    // Função para verificar se é hora de gerar novos itens especiais
    function checkSpecialItemGeneration() {
        const currentTime = Date.now();
        if (currentTime - lastSpecialItemGenerationTime >= specialItemGenerationInterval) {
            generateSpecialItem();
            lastSpecialItemGenerationTime = currentTime; // Atualiza o momento em que o item especial foi gerado
        }
    }

    // Função para verificar colisões do jogador com os itens especiais
    function checkSpecialItemCollision() {
        let enemiesRemoved = 0; // Variável para armazenar a contagem de inimigos removidos
        for (let i = 0; i < specialItems.length; i++) {
            const specialItem = specialItems[i];
            if (
                bat.x < specialItem.x + specialItem.width &&
                bat.x + bat.width > specialItem.x &&
                bat.y < specialItem.y + specialItem.height &&
                bat.y + bat.height > specialItem.y
            ) {
                specialItems.splice(i, 1); // Remove o item especial da lista
                // Aqui você pode adicionar a lógica para o efeito do item especial
                // Por exemplo, limpar a lista de inimigos e contá-los
                enemiesRemoved = enemies.length + pumpkins.length + crows.length + deaths.length;
                enemies = [];
                pumpkins = [];
                crows = [];
                deaths = [];
                // Se necessário, adicione aqui a lógica para outros efeitos do item especial
            }
        }
        // Adiciona a contagem de inimigos removidos à pontuação do jogador
        bat.score += enemiesRemoved;
    }

    projectiles = [];

    class Projectile {
        constructor(x, y, directionX, directionY, ctx) {
            this.x = x; // Posição inicial x do projétil
            this.y = y; // Posição inicial y do projétil
            this.directionX = directionX; // Direção horizontal do projétil (positiva ou negativa)
            this.directionY = directionY; // Direção vertical do projétil (positiva ou negativa)
            this.speed = 5; // Velocidade do projétil
            this.radius = 7; // Raio do projétil
            this.ctx = ctx; // Contexto do canvas
        }

        // Método para atualizar a posição do projétil
        update() {
            this.x += this.directionX * this.speed;
            this.y += this.directionY * this.speed;
        }

        // Método para desenhar o projétil no canvas
        draw() {
            // Salva o estado atual do contexto
            this.ctx.save();

            // Aplica a sombra apenas ao projetil
            this.ctx.shadowColor = 'green'; // Cor da sombra
            this.ctx.shadowBlur = 10; // Intensidade da sombra

            // Desenha o projetil
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#f9ff54'; // Cor do projétil
            this.ctx.fill();
            this.ctx.closePath();

            // Restaura o estado original do contexto
            this.ctx.restore();
        }
    }

    class Flower {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.width = 33;
            this.height = 33;
            this.x = Math.random() * (canvas.width - this.width);
            this.y = Math.random() * (canvas.height - this.height);
            this.image = new Image();
            this.image.src = 'sprites/itens/flower.png'; // Caminho da imagem do item especial
        }

        draw() {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    let flower = null; // Variável para armazenar o item especial
    let lastFlowerGenerationTime = 0; // Momento em que o último item especial foi gerado
    const flowerGenerationInterval = 15000; // Intervalo de geração do item especial em milissegundos (15 segundos)

    let flowers = []; // Lista para armazenar os itens especiais

    // Função para gerar um novo item especial
    function generateFlower() {
        const flower = new Flower(canvas, ctx);
        flowers.push(flower);
    }

    // Função para verificar se é hora de gerar novos itens especiais
    function checkFlowerGeneration() {
        const currentTime = Date.now();
        if (currentTime - lastFlowerGenerationTime >= flowerGenerationInterval) {
            generateFlower();
            lastFlowerGenerationTime = currentTime; // Atualiza o momento em que o item especial foi gerado
        }
    }

    // Função para verificar colisões do jogador com os itens especiais
    function checkFlowerCollision() {
        for (let i = 0; i < flowers.length; i++) {
            const flower = flowers[i];
            if (
                bat.x < flower.x + flower.width &&
                bat.x + bat.width > flower.x &&
                bat.y < flower.y + flower.height &&
                bat.y + bat.height > flower.y
            ) {
                flowers.splice(i, 1); // Remove o item especial da lista
                // Aqui você pode adicionar a lógica para o efeito do item especial
                // Por exemplo, limpar a lista de inimigos
                bat.health += 1;
            }
        }
    }

    class MagicShield {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.width = 27;
            this.height = 31;
            this.x = Math.random() * (canvas.width - this.width);
            this.y = Math.random() * (canvas.height - this.height);
            this.image = new Image();
            this.image.src = 'sprites/itens/crystal.png'; // Caminho da imagem do item especial
        }

        draw() {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    let magicShield = null; // Variável para armazenar o item especial
    let lastMagicShieldGenerationTime = 0; // Momento em que o último item especial foi gerado
    const magicShieldGenerationInterval = 15000; // Intervalo de geração do item especial em milissegundos (15 segundos)

    let magicShields = []; // Lista para armazenar os itens especiais

    // Função para gerar um novo item especial
    function generateMagicShield() {
        const magicShield = new MagicShield(canvas, ctx);
        magicShields.push(magicShield);
    }

    // Função para verificar se é hora de gerar novos itens especiais
    function checkMagicShieldGeneration() {
        const currentTime = Date.now();
        if (currentTime - lastMagicShieldGenerationTime >= magicShieldGenerationInterval) {
            generateMagicShield();
            lastMagicShieldGenerationTime = currentTime; // Atualiza o momento em que o item especial foi gerado
        }
    }

    // Função para verificar colisões do jogador com os itens especiais
    function checkMagicShieldCollision() {
        for (let i = 0; i < magicShields.length; i++) {
            const magicShield = magicShields[i];
            if (
                bat.x < magicShield.x + magicShield.width &&
                bat.x + bat.width > magicShield.x &&
                bat.y < magicShield.y + magicShield.height &&
                bat.y + bat.height > magicShield.y
            ) {
                magicShields.splice(i, 1); // Remove o item especial da lista
                // Aqui você pode adicionar a lógica para o efeito do item especial
                // Por exemplo, limpar a lista de inimigos
                bat.shieldCharges += 1;
            }
        }
    }

    // Defina uma classe para representar um meteoro
    class Meteoro {
        constructor(x, y, ctx, velocidade) {
            this.x = x;
            this.y = y;
            this.velocidade = velocidade;
            this.largura = 85; // Largura da imagem do meteoro
            this.altura = 85; // Altura da imagem do meteoro
            this.imagem = new Image();
            this.imagem.src = 'sprites/itens/meteor.png'; 
            this.ctx = ctx
        }

        // Atualiza a posição do meteoro
        update() {
            this.x -= this.velocidade; // Move para a esquerda
            this.y += this.velocidade; // Move para baixo
        }

        // Desenha o meteoro
        draw() {
            // Desenha a imagem do meteoro
            this.ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
        }
    }

    // Crie uma lista para armazenar os meteoros
    let meteoros = [];

    // Função para criar meteoros
    function criarMeteoros() {
        // Defina a quantidade de meteoros e as posições iniciais
        const numMeteoros = 10;
        const posYInicial = -50; // Começa fora do topo da tela

        for (let i = 0; i < numMeteoros; i++) {
            // Gere posições aleatórias na parte superior da tela
            const posX = Math.random() * canvas.width;
            const velocidade = Math.random() * 2 + 1; // Velocidade aleatória entre 1 e 3

            // Crie um novo meteoro e adicione à lista
            const meteoro = new Meteoro(posX, posYInicial, ctx, velocidade);
            meteoros.push(meteoro);
        }
    }

    // Função para atualizar e desenhar os meteoros
    function desenharMeteoros() {
        for (let i = 0; i < meteoros.length; i++) {
            const meteoro = meteoros[i];
            meteoro.draw();
        }
    }

    // Função para atualizar e desenhar os meteoros
    function atualizarMeteoros() {
        for (let i = 0; i < meteoros.length; i++) {
            const meteoro = meteoros[i];
            meteoro.update();

            // Remova os meteoros que saíram da tela
            if (meteoro.y - meteoro.altura > canvas.height || meteoro.x + meteoro.largura < 0) {
                meteoros.splice(i, 1);
            }
        }
    }

    // Variável para rastrear o estado do jogo
    let gameState = 'menu'; // Pode ser 'menu' ou 'running'

    // Função para desenhar o menu inicial
    function drawMenu() {
        // Carregar a imagem de fundo
        const backgroundImage = new Image();
        backgroundImage.src = 'sprites/background/start.png';

        // Desenhar a imagem de fundo assim que ela for carregada
        backgroundImage.onload = function() {
            // Desenhar a imagem de fundo
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            // Desenhar o texto sobre a imagem de fundo
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            const text = 'Pressione Enter para Iniciar';
            const textWidth = ctx.measureText(text).width;
            const textX = (canvas.width - textWidth) / 2;
            ctx.fillText(text, textX, canvas.height / 2);
        };
    }

    // Função para iniciar o jogo quando o jogador pressionar Enter
    function startGame() {
        if (gameState === 'menu') {
            gameState = 'running';
            gameLoop();
        }
    }

    function gameOver() {
        // Limpa o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stopMusic();

        // Carregar a imagem de fundo para o game over
        const backgroundImage = new Image();
        backgroundImage.src = 'sprites/background/gameover.png';

        // Desenhar a imagem de fundo assim que ela for carregada
        backgroundImage.onload = function() {
            // Desenhar a imagem de fundo
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            // Exibe a mensagem de "Game Over"
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            const text = 'GAME OVER';
            const textWidth = ctx.measureText(text).width;
            const textX = (canvas.width - textWidth) / 2;
            ctx.fillText(text, textX, canvas.height / 2 - 40);

            ctx.font = '20px Arial';
            const textRestart = 'Pressione a tecla X para recomeçar';
            const textRestartWidth = ctx.measureText(textRestart).width;
            const textRestartX = (canvas.width - textRestartWidth) / 2;
            ctx.fillText(textRestart, textRestartX, canvas.height / 2);

            const textScore = 'Sua pontuação foi: ' + bat.score;
            const textScoreWidth = ctx.measureText(textScore).width;
            const textScoreX = (canvas.width - textScoreWidth) / 2;
            ctx.fillText(textScore, textScoreX, canvas.height / 2 + 40);
        };

        saveHighScore(bat.score);
    }

    const keysPressed = {};

    // Evento de teclado para capturar a tecla Enter
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            startGame();
        }
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === " ") {
            event.preventDefault();
        }
    });

    document.addEventListener('keydown', function(event) {
        keysPressed[event.key] = true;

        if (gameState === "running"){      
            if (event.key === 'x') { // Verifica se a tecla pressionada é X e se o jogador está sem vida
                if (bat.health === 0) {
                    // Reinicia o jogo
                    bat.health = d6;
                    bat.score = 0;
                    enemies = [];
                    pumpkins = [];
                    crows = [];
                    deaths = [];
                    specialItems = [];
                    flowers = [];
                    bat.x = (canvas.width - bat.width) / 2;
                    bat.y = (canvas.height - bat.height) / 2;
                    swords = [];
                    projectiles = [];
                    bat.projectileCharges = d12;
                    bat.shieldCharges = d8;
                    bat.shieldCooldown = 0;
                    magicShields = [];
                    meteoros = [];
                    bat.meteorCharges = d4;
                    eyes = [];
                    gameLoop(); // Reinicia o loop do jogo
                }
            }

            if (event.key === 'f' && bat.lastShoot && bat.projectileCharges > 0) {
                // Disparar múltiplos projéteis com base na potência do tiro
                bat.shoot(); // Deduza uma carga quando o morcego atirar

                // Projétil para cima
                projectiles.push(new Projectile(bat.x + bat.width / 2, bat.y, 0, -1, ctx));
                // Projétil para baixo
                projectiles.push(new Projectile(bat.x + bat.width / 2, bat.y + bat.height, 0, 1, ctx));
                // Projétil para a esquerda
                projectiles.push(new Projectile(bat.x, bat.y + bat.height / 2, -1, 0, ctx));
                // Projétil para a direita
                projectiles.push(new Projectile(bat.x + bat.width, bat.y + bat.height / 2, 1, 0, ctx));

                bat.lastShoot = false;
                setTimeout(function() {
                    bat.lastShoot = true;
                }, bat.cooldown);
            }

            if (event.key === 'u' && bat.lastMeteor && bat.meteorCharges > 0) {
                // Disparar múltiplos projéteis com base na potência do tiro
                bat.shootMeteor(); // Deduza uma carga quando o morcego atirar

                bat.lastMeteor = false;
                setTimeout(function() {
                    bat.lastMeteor = true;
                }, bat.cooldownMeteor);
            }
            if (event.key === 's') {
                bat.activateShield();
            }
        }
    });

    document.addEventListener('keydown', function(event) {
        keysPressed[event.key] = true;
    });

    document.addEventListener('keyup', function(event) {
        delete keysPressed[event.key];
    });

    function gameLoop() {
        if (gameState === 'running') {
            if (bat.health === 0) {
                gameOver();
                return;
            }

            // Verifica se as teclas de movimento estão pressionadas e move o jogador
            if ('ArrowLeft' in keysPressed) {
                if (bat.x - bat.speedX >= 0) {
                    bat.x -= bat.speedX;
                }
            }
            if ('ArrowRight' in keysPressed) {
                if (bat.x + bat.width + bat.speedX <= canvas.width) {
                    bat.x += bat.speedX;
                }
            }

            // Atualiza a posição do jogador e os elementos do jogo
            bat.update(keysPressed);
            updateBackground();

            // Desenha o fundo, o jogador, a vida e a pontuação
            drawBackground();
            bat.draw();
            bat.drawLife();
            bat.drawEnergy();
            bat.drawScore();
            bat.drawShieldCoolDown();
            bat.drawShields();
            bat.drawFire();

            // Gera inimigos e atualiza e desenha os elementos do jogo
            if (Math.random() < 0.01) { // Por exemplo, 1% de chance a cada frame
                generateEnemy(); // Gera um novo inimigo
            }
            updateAndDrawEnemies();

            if (Math.random() < 0.009) {
                generateDeath(); // Gera um novo inimigo Death
            }
            updateAndDrawDeaths(); // Atualiza e desenha os inimigos Death

            checkCollisions();

            if (Math.random() < 0.0075) {
                generatePumpkin(); 
            }
            updateAndDrawPumpkins(); 
            checkPumpkinCollisions();

            if (Math.random() < 0.0075) {
                generateCrow(); 
            }
            updateAndDrawCrows(); 
            checkCrowCollisions();

            checkProjectileCollisions();

            // Desenha e verifica colisões com itens especiais e flores
            for (let i = 0; i < specialItems.length; i++) {
                const specialItem = specialItems[i];
                specialItem.draw(); // Desenha o item especial
                checkSpecialItemCollision(); // Verifica se o jogador coletou o item especial
            }
            checkSpecialItemGeneration();

            for (let i = 0; i < flowers.length; i++) {
                const flower = flowers[i];
                flower.draw(); // Desenha o item especial
                checkFlowerCollision(); // Verifica se o jogador coletou o item especial
            }
            checkFlowerGeneration();

            for (let i = 0; i < swords.length; i++) {
                const sword = swords[i];
                sword.draw(); // Desenha o item especial
                checkSwordCollision(); // Verifica se o jogador coletou o item especial
            }
            checkSwordGeneration();

            for (let i = 0; i < magicShields.length; i++) {
                const magicShield = magicShields[i];
                magicShield.draw(); // Desenha o item especial
                checkMagicShieldCollision(); // Verifica se o jogador coletou o item especial
            }
            checkMagicShieldGeneration();

            for (let i = 0; i < eyes.length; i++) {
                const eye = eyes[i];
                eye.draw(); // Desenha o item especial
                checkEyeCollision(); // Verifica se o jogador coletou o item especial
            }
            checkEyeGeneration();

            for (let i = 0; i < projectiles.length; i++) {
                const projectile = projectiles[i];
                projectile.update(); // Atualiza a posição do projétil
                projectile.draw(); // Desenha o projétil no canvas
            }

            atualizarMeteoros();
            desenharMeteoros();
            checkMeteorCollisions();

            playMusic();

            requestAnimationFrame(gameLoop);
        } else if (gameState === 'menu') {
            drawMenu();
        }      
    }

    gameLoop();

    function saveHighScore(score) {
        // Obtém as maiores pontuações do localStorage
        var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        var heroName = document.getElementById("heroName");
        // Verifica se a nova pontuação já existe na lista para o mesmo jogador
        var existingScore = highScores.find(entry => entry.name === name && entry.score === score);
        if (!existingScore) {
            // Cria um objeto com o nome e a pontuação do jogador
            var playerScore = {
                name: heroName.innerHTML,
                score: score
            };
            // Adiciona o objeto à lista de maiores pontuações
            highScores.push(playerScore);

            // Ordena as pontuações em ordem decrescente
            highScores.sort(function(a, b) {
                return b.score - a.score;
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
        var header3 = document.createElement('th');
        header1.textContent = 'Rank';
        header2.textContent = 'Jogador';
        header3.textContent = 'Pontuação';
        headerRow.appendChild(header1);
        headerRow.appendChild(header2);
        headerRow.appendChild(header3);

        // Preenche a tabela com os dados das maiores pontuações
        for (var i = 0; i < highScores.length; i++) {
            var row = table.insertRow();
            var rankCell = row.insertCell();
            var playerCell = row.insertCell();
            var scoreCell = row.insertCell();
            rankCell.textContent = i + 1;
            playerCell.textContent = highScores[i].name;
            scoreCell.textContent = highScores[i].score;
        }

        // Adiciona a tabela ao elemento HTML
        highScoreTable.appendChild(table);
    }

    // Chame a função para exibir as maiores pontuações quando o jogo iniciar
    displayHighScores();
});