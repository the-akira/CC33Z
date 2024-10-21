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
    const originalShape = this.shape; // Salva a forma original
    const n = this.shape.length;
    const m = this.shape[0].length;
    const newShape = [];

    // Calcular nova forma
    for (let i = m - 1; i >= 0; i--) {
      const newRow = [];
      for (let j = 0; j < n; j++) {
        newRow.push(this.shape[j][i]);
      }
      newShape.push(newRow);
    }

    // Tenta rotacionar
    this.shape = newShape;

    // Verificar colisões
    if (hasRightCollisions() && !hasLeftCollisions()) {
      this.moveLeft(); // Tenta mover uma vez para a esquerda
      if (hasRightCollisions() && !hasLeftCollisions()) {
        this.moveLeft(); // Tenta mover mais uma vez
        if (hasRightCollisions() && !hasLeftCollisions()) {
          this.moveLeft(); // Tenta mover mais uma vez, se necessário
          if (hasRightCollisions() && !hasLeftCollisions()) {
            // Se ainda colidir, restaura a forma original
            this.shape = originalShape;
          }
        }
      }
    }
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

function hasRightCollisions() {
  const shape = currentTetromino.getShape();
  const x = currentTetromino.getX();
  const y = currentTetromino.getY();
  const rightBoundary = x + shape[0].length; // Uma unidade a mais, para checar a borda

  // Verifica se a posição da peça está na borda direita do tabuleiro
  if (rightBoundary > COLS) {
    return true; // Colisão com a borda direita do tabuleiro
  }

  return false; // Sem colisão à direita
}

function hasLeftCollisions() {
  const shape = currentTetromino.getShape(); // Obter a forma atual
  const x = currentTetromino.getX(); // Posição x da peça
  const y = currentTetromino.getY(); // Posição y da peça

  // Verificar se a peça está na borda esquerda
  if (x <= 0) {
    return true; // Colisão com a borda esquerda do tabuleiro
  }

  const isPieceI = shape.length === 1 && shape[0].length === 4;

  // Percorre as linhas e colunas da peça
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) { // Se a célula estiver ocupada (parte da peça)
        let nextX = x + col - 1; // Verifica o tile imediatamente à esquerda
        const nextY = y + row;

        if (isPieceI) {
          nextX = x + col - 3;
        }

        // Se a célula à esquerda está fora do tabuleiro ou é uma célula ocupada
        // A verificação para nextY deve ser incluída para garantir que não saímos do limite
        if (nextX < 0 || (nextY < ROWS && board[nextY][nextX] !== "white")) {
          return true; // Colisão detectada
        }
      }
    }
  }

  return false; // Sem colisão à esquerda
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

let keys = {
  left: false,
  right: false,
  down: false,
  rotate: false,
};

let dropInterval;
let moveLeftInterval;
let moveRightInterval;
let dropSpeed = 100;  // Velocidade de descida rápida
let autoDropSpeed = 400;  // Velocidade de descida automática
let moveSpeed = 150;  // Velocidade do movimento lateral contínuo

function handleKeyDown(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      if (!keys.left) {
        keys.left = true;
        moveTetrominoLeft();  // Movimento único ao pressionar
        startMoveLeft();      // Iniciar o movimento contínuo ao segurar
      }
      break;
    case 38: // up arrow
      if (!keys.rotate) {
        currentTetromino.rotateCounterClockwise();
        if (hasCollisions()) {
          currentTetromino.rotateClockwise();
        }
        keys.rotate = true;
      }
      draw();
      break;
    case 39: // right arrow
      if (!keys.right) {
        keys.right = true;
        moveTetrominoRight(); // Movimento único ao pressionar
        startMoveRight();     // Iniciar o movimento contínuo ao segurar
      }
      break;
    case 40: // down arrow
      if (!keys.down) {
        keys.down = true;
        startFastDrop();
      }
      break;
  }
}

function handleKeyUp(event) {
  switch (event.keyCode) {
    case 37:
      keys.left = false;
      stopMoveLeft();
      break;
    case 38:
      keys.rotate = false;
      break;
    case 39:
      keys.right = false;
      stopMoveRight();
      break;
    case 40:
      keys.down = false;
      stopFastDrop();
      break;
  }
}

// Movimento único para a esquerda
function moveTetrominoLeft() {
  currentTetromino.moveLeft();
  if (hasCollisions()) {
    currentTetromino.moveRight();
  }
  draw();
}

// Movimento único para a direita
function moveTetrominoRight() {
  currentTetromino.moveRight();
  if (hasCollisions()) {
    currentTetromino.moveLeft();
  }
  draw();
}

// Movimento lateral contínuo (esquerda)
function startMoveLeft() {
  clearInterval(moveLeftInterval);
  moveLeftInterval = setInterval(() => {
    moveTetrominoLeft();
  }, moveSpeed);
}

function stopMoveLeft() {
  clearInterval(moveLeftInterval);
}

// Movimento lateral contínuo (direita)
function startMoveRight() {
  clearInterval(moveRightInterval);
  moveRightInterval = setInterval(() => {
    moveTetrominoRight();
  }, moveSpeed);
}

function stopMoveRight() {
  clearInterval(moveRightInterval);  // Para o movimento ao soltar a tecla
}

// Movimento contínuo rápido para baixo
function startFastDrop() {
  clearInterval(dropInterval);
  dropInterval = setInterval(() => {
    currentTetromino.moveDown();
    if (hasCollisions()) {
      currentTetromino.moveUp();
      mergeTetromino();
      if (isGameOver()) {
        endGame();
      } else {
        currentTetromino = tetrominos.getRandomTetromino();
      }
    }
    draw();
  }, dropSpeed);
}

function stopFastDrop() {
  clearInterval(dropInterval);
  dropInterval = setInterval(() => {
    currentTetromino.moveDown();
    if (hasCollisions()) {
      currentTetromino.moveUp();
      mergeTetromino();
      if (isGameOver()) {
        endGame();
      } else {
        currentTetromino = tetrominos.getRandomTetromino();
      }
    }
    draw();
  }, autoDropSpeed);
}

function resetBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      board[row][col] = "white";
    }
  }
}

function endGame() {
  clearInterval(dropInterval);
  clearInterval(moveLeftInterval);
  clearInterval(moveRightInterval);

  resetBoard();
  alert("Game Over!");
  startGame();
}

function startGame() {
  // Reiniciar o Tetromino atual
  currentTetromino = tetrominos.getRandomTetromino();

  // Reiniciar intervalos e o loop de queda automática
  dropInterval = setInterval(() => {
    currentTetromino.moveDown();
    if (hasCollisions()) {
      currentTetromino.moveUp();
      mergeTetromino();
      if (isGameOver()) {
        endGame();
      } else {
        currentTetromino = tetrominos.getRandomTetromino();
      }
    }
    draw();
  }, autoDropSpeed);

  // Reiniciar as teclas pressionadas
  keys = {
    left: false,
    right: false,
    down: false,
    rotate: false,
  };
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
startGame();