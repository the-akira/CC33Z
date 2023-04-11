const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const snake = [{ x: 0, y: 0 }];
const food = { x: 0, y: 0 };
let dx = 0;
let dy = 0;
let score = 0;

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

function drawSnake() {
    ctx.fillStyle = 'green';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
    }
}

function drawFood() {
    ctx.fillStyle = '#694717';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function checkCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function updateGame() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    if (checkCollision() ||
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height) {
        alert('Game Over');
        resetGame();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();

    document.getElementById('score').innerText = 'Score: ' + score;

    setTimeout(updateGame, 125);
}

function resetGame() {
    snake.length = 1;
    snake[0] = { x: 0, y: 0 };
    dx = 0;
    dy = 0;
    score = 0;
    generateFood();
}

document.addEventListener('keydown', event => {
    switch (event.keyCode) {
        case 37: // left arrow
            dx = -gridSize;
            dy = 0;
            break;
        case 38: // up arrow
            dx = 0;
            dy = -gridSize;
            break;
        case 39: // right arrow
            dx = gridSize;
            dy = 0;
            break;
        case 40: // down arrow
            dx = 0;
            dy = gridSize;
            break;
    }
});

resetGame();
updateGame();