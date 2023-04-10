const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function getSpeed(score) {
    const baseSpeed = 5;
    const increaseFactor = 0.1;
    return baseSpeed + increaseFactor * score;
}

class Obstacle {
    constructor(x, y, w, h, speed) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = getSpeed(speed);
        this.scored = false;
        this.img = new Image();
        this.img.src = 'tree.png'; 
    }

    update() {
        this.x -= this.speed;
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
}

class Dino {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.yVel = 0;
        this.isJumping = false;
        this.img = new Image();
        this.img.src = 'kangaroo.png'; 
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.yVel = -17.5;
        }
    }

    update() {
        if (this.isJumping) {
            this.y += this.yVel;
            this.yVel += 1;

            if (this.y > canvas.height - this.h) {
                this.y = canvas.height - this.h;
                this.yVel = 0;
                this.isJumping = false;
            }
        }
        
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
}

const dino = new Dino(50, canvas.height - 50, 80, 50);

let obstacles = [];
let score = 0;
let lastObstacleTime = 0;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Date.now() - lastObstacleTime > 600 && Math.random() < 0.015) {
        obstacles.push(new Obstacle(canvas.width, canvas.height - 50, 35, 55, score));
        lastObstacleTime = Date.now();
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();

        if (obstacles[i].x + obstacles[i].w < 0) {
            obstacles.splice(i, 1);
            i--;
        } else if (
            dino.x < obstacles[i].x + obstacles[i].w &&
            dino.x + dino.w > obstacles[i].x &&
            dino.y < obstacles[i].y + obstacles[i].h &&
            dino.y + dino.h > obstacles[i].y
        ) {
            location.reload();
        } else if (!obstacles[i].scored && obstacles[i].x < dino.x) {
            obstacles[i].scored = true;
            score++;
        }
    }

    dino.update();
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 245, 30);
    requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        dino.jump();
    }
});