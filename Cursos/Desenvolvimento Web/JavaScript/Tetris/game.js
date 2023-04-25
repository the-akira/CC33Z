const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

const board = [];
for (let row = 0; row < ROWS; row++) {
  board[row] = [];
  for (let col = 0; col < COLS; col++) {
    board[row][col] = "white";
  }
}

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      drawSquare(col, row, board[row][col]);
    }
  }
}

drawBoard();

class Tetromino {
  constructor(shape, color) {
    this.shape = shape;
    this.color = color;
    this.x = 0;
    this.y = 0;
  }

  getShape() {
    return this.shape;
  }

  getColor() {
    return this.color;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  rotateClockwise() {
    const n = this.shape.length;
    const m = this.shape[0].length;
    const newShape = [];
    for (let i = 0; i < m; i++) {
      const newRow = [];
      for (let j = n - 1; j >= 0; j--) {
        newRow.push(this.shape[j][i]);
      }
      newShape.push(newRow);
    }
    this.shape = newShape;
  }

  rotateCounterClockwise() {
    const n = this.shape.length;
    const m = this.shape[0].length;
    const newShape = [];
    for (let i = m - 1; i >= 0; i--) {
      const newRow = [];
      for (let j = 0; j < n; j++) {
        newRow.push(this.shape[j][i]);
      }
      newShape.push(newRow);
    }
    this.shape = newShape;
  }

  moveDown() {
    this.y += 1;
  }

  moveLeft() {
    this.x -= 1;
  }

  moveRight() {
    this.x += 1;
  }

  moveUp() {
    this.y -= 1;
  }
}

class Tetrominos {
  constructor() {
    this.colors = ["cyan", "yellow", "purple", "green", "red", "orange", "blue"];
  }

  getRandomTetromino() {
    const shapes = [
      [[1, 1, 1, 1]], // I
      [[1, 1], [1, 1]], // O
      [[1, 1, 0], [0, 1, 1]], // S
      [[0, 1, 1], [1, 1, 0]], // Z
      [[1, 1, 1], [0, 1, 0]], // T
      [[1, 1, 1], [0, 0, 1]], // L
      [[1, 1, 1], [1, 0, 0]] // J
    ];

    const randomShapeIndex = Math.floor(Math.random() * shapes.length);
    const randomColorIndex = Math.floor(Math.random() * this.colors.length);
    const randomShape = shapes[randomShapeIndex];
    const randomColor = this.colors[randomColorIndex];
    return new Tetromino(randomShape, randomColor);
  }
}

const tetrominos = new Tetrominos();
let currentTetromino = tetrominos.getRandomTetromino();

function drawTetromino() {
  const shape = currentTetromino.getShape();
  const color = currentTetromino.getColor();
  const x = currentTetromino.getX();
  const y = currentTetromino.getY();
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        drawSquare(x + col, y + row, color);
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawTetromino();
}

function isGameOver() {
  for (let col = 0; col < COLS; col++) {
    if (board[0][col] !== "white") {
      return true;
    }
  }
  return false;
}

scoreElement = document.getElementById("score")
score = 0

function update() {
  currentTetromino.moveDown();
  if (hasCollisions()) {
    currentTetromino.moveUp();
    mergeTetromino();
    if (isGameOver()) {
      score = 0;
      scoreElement.innerHTML = `Pontuação: ${score}`;
      alert("Game Over!")
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          board[row][col] = "white";
        }
      }
    } else {
      currentTetromino = tetrominos.getRandomTetromino();
    }
  }
}

function hasCollisions() {
  const shape = currentTetromino.getShape();
  const x = currentTetromino.getX();
  const y = currentTetromino.getY();
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const nextX = x + col;
        const nextY = y + row;
        if (nextY < 0 || nextX < 0 || nextX >= COLS || nextY >= ROWS || board[nextY][nextX] !== "white") {
          return true;
        }
      }
    }
  }
  return false;
}

function isRowComplete(row) {
  for (let col = 0; col < COLS; col++) {
    if (board[row][col] === "white") {
      return false;
    }
  }
  return true;
}

function mergeTetromino() {
  const shape = currentTetromino.getShape();
  const x = currentTetromino.getX();
  const y = currentTetromino.getY();
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        board[y + row][x + col] = currentTetromino.getColor();
      }
    }
  }
  for (let row = 0; row < ROWS; row++) {
    if (isRowComplete(row)) {
      score++;
      scoreElement.innerHTML = `Pontuação: ${score}`;
      for (let r = row; r > 0; r--) {
        for (let col = 0; col < COLS; col++) {
          board[r][col] = board[r - 1][col];
        }
      }
      for (let col = 0; col < COLS; col++) {
        board[0][col] = "white";
      }
    }
  }
}

function handleKeyPress(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      currentTetromino.moveLeft();
      if (hasCollisions()) {
        currentTetromino.moveRight();
      }
      break;
    case 38: // up arrow
      currentTetromino.rotateCounterClockwise();
      if (hasCollisions()) {
        currentTetromino.rotateClockwise();
      }
      break;
    case 39: // right arrow
      currentTetromino.moveRight();
      if (hasCollisions()) {
        currentTetromino.moveLeft();
      }
      break;
    case 40: // down arrow
      currentTetromino.moveDown();
      if (hasCollisions()) {
        currentTetromino.moveUp();
        mergeTetromino();
        currentTetromino = tetrominos.getRandomTetromino();
      }
      break;
  }
}

document.addEventListener("keydown", handleKeyPress);

setInterval(() => {
  update();
  draw();
}, 400);