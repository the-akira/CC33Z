var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var player = new Player(canvas.width / 2, canvas.height - 90);
var playerImg = new Image();
playerImg.src = 'images/spaceship.png';

var enemyImg = new Image();
enemyImg.src = 'images/alien.png';

var enemies = [];
var bullets = [];

scoreElement = document.getElementById("score");
score = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var rightPressed = false;
var leftPressed = false;

function Bullet(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 12;
    this.color = "#00f7ff";
    this.speed = 5;

    this.update = function() {
        this.y -= this.speed;
    };

    this.draw = function() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };
}

function Player(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 80;
    this.color = "blue";
    this.health = 100;
    this.invincibility = false;
    
    this.draw = function() {
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    };
}

function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.color = "red";

    this.update = function() {
        this.y += 3;
    };

    this.draw = function() {
        ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height);
    };
}

function collides(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

var lastShotTime = 0;
var shotDelay = 300; // milliseconds

function keyDownHandler(event) {
    if (event.keyCode == 39) {
        rightPressed = true;
    } else if (event.keyCode == 37) {
        leftPressed = true;
    } else if (event.keyCode == 32) { // Space bar
        var now = Date.now();
        // check if enough time has elapsed since the last shot
        if (now - lastShotTime > shotDelay) { 
            bullets.push(new Bullet(player.x + player.width / 2 - 1, player.y));
            lastShotTime = now;
        }
    }
}

function keyUpHandler(event) {
    if (event.keyCode == 39) {
        rightPressed = false;
    } else if (event.keyCode == 37) {
        leftPressed = false;
    }
}

function update() {
    // Update player position
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += 5;
    } else if (leftPressed && player.x > 0) {
        player.x -= 5;
    }

    // Update enemy positions
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update();
        // Check if enemy has passed through the bottom of the screen
        if (enemies[i].y > canvas.height) {
            player.health -= 10; // decrease health by 10
            if (player.health <= 0) {
                console.log("Game Over");
                resetGame();
            }
            enemies.splice(i, 1); // remove the enemy
        }
    }

    // Update bullet positions
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].update();
    }

    // Check for collisions between player and enemies
    for (var i = 0; i < enemies.length; i++) {
        if (collides(player, enemies[i])) {
            if (!player.invincibility) { // 
                player.invincibility = true; 
                setTimeout(function() {
                    player.invincibility = false;
                }, 1000);
                
                player.health -= 10; // decrease health by 10
                if (player.health <= 0) {
                    console.log("Game Over");
                    resetGame();
                }
            }
        }
    }

    // Check for collisions between bullets and enemies
    for (var i = 0; i < bullets.length; i++) {
        for (var j = 0; j < enemies.length; j++) {
            if (collides(bullets[i], enemies[j])) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score++;
                scoreElement.innerHTML = `Pontuação: ${score}`;
            }
        }
    }
}

function drawHealthBar() {
    ctx.beginPath();
    ctx.rect(10, 10, 100, 10);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(10, 10, player.health, 10);
    ctx.fillStyle = "#00ff26";
    ctx.fill();
    ctx.closePath();
}

function resetGame() {
  player.x = canvas.width / 2;
  player.y = canvas.height - 90;
  
  enemies = [];
  bullets = [];

  score = 0;
  scoreElement.innerHTML = `Pontuação: ${score}`;
  
  player.health = 100;
  requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();
    drawHealthBar();

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }

    for (var i = 0; i < bullets.length; i++) {
        bullets[i].draw();
    }
}

function gameLoop() {
    update();
    draw();
}

function spawnEnemy() {
    var enemy = new Enemy(Math.random() * (canvas.width - 40), 0);
    enemies.push(enemy);
}

setInterval(spawnEnemy, 1000);
setInterval(gameLoop, 16);