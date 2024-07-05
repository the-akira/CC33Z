const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const startButton = document.getElementById('start-simulation');
const clearButton = document.getElementById('clear-grid');
const speedControl = document.getElementById('speed-control');

const cellSize = 20;
const viewWidth = canvas.width; // Tamanho visível do canvas
const viewHeight = canvas.height;

let cameraX = 0; // Posição da câmera em relação à grid
let cameraY = 0;

const gridWidth = 100; // Tamanho da grid lógica
const gridHeight = 100;

const EMPTY = 0;
const CONDUCTOR = 1;
const HEAD = 2;
const TAIL = 3;

let grid = createGrid();
let currentType = CONDUCTOR;
let running = false;
let drawing = false;
let simulationSpeed = 100; // Velocidade inicial da simulação em milissegundos

function createGrid() {
    let grid = new Array(gridHeight);
    for (let i = 0; i < gridHeight; i++) {
        grid[i] = new Array(gridWidth).fill(EMPTY);
    }
    return grid;
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#555';
    for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
            const visibleX = col * cellSize - cameraX;
            const visibleY = row * cellSize - cameraY;
            if (visibleX < -cellSize || visibleX > viewWidth ||
                visibleY < -cellSize || visibleY > viewHeight) {
                continue; // Não desenhar células fora da tela visível
            }
            ctx.strokeRect(visibleX, visibleY, cellSize, cellSize);
            switch (grid[row][col]) {
                case EMPTY:
                    ctx.fillStyle = '#000';
                    break;
                case CONDUCTOR:
                    ctx.fillStyle = '#FFD700';
                    break;
                case HEAD:
                    ctx.fillStyle = '#0080FF';
                    break;
                case TAIL:
                    ctx.fillStyle = '#F00';
                    break;
            }
            ctx.fillRect(visibleX + 1, visibleY + 1, cellSize - 1, cellSize - 1);
        }
    }
    drawAxisIndices();
}

function drawAxisIndices() {
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Desenha os índices do eixo X
    for (let col = 1; col < gridWidth; col++) {
        const visibleX = col * cellSize - cameraX;
        if (visibleX >= 1 && visibleX <= viewWidth) {
            ctx.fillText(col, visibleX + cellSize / 2, viewHeight - 10);
        }
    }
    
    // Desenha os índices do eixo Y
    for (let row = 0; row <= gridHeight; row++) {
        const visibleY = row * cellSize - cameraY;
        if (visibleY >= 0 && visibleY <= viewHeight) {
            ctx.fillText(row, 10, visibleY + cellSize / 2);
        }
    }
}

function updateCell(row, col, type) {
    grid[row][col] = type;
    drawGrid(); // Redesenhar apenas a célula modificada
}

function handleCanvasMouseDown(event) {
    if (event.button === 0) {
        handleCanvasMouseMove(event);
    } else if (event.button === 1) { // Botão do meio do mouse
        handleCanvasMiddleClick(event);
    } else if (event.button === 2) {
        handleCanvasRightClick(event);
    }
}

function handleCanvasRightClick(event) {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left + cameraX;
    const y = event.clientY - rect.top + cameraY;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (row >= 0 && row < gridHeight && col >= 0 && col < gridWidth) {
        updateCell(row, col, HEAD);
    }
}

function handleCanvasMiddleClick(event) {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left + cameraX;
    const y = event.clientY - rect.top + cameraY;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (row >= 0 && row < gridHeight && col >= 0 && col < gridWidth) {
        updateCell(row, col, EMPTY); // Tornar a célula vazia
    }
}

function handleCanvasMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left + cameraX;
    const y = event.clientY - rect.top + cameraY;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (event.ctrlKey) { // Verifica se a tecla Ctrl está pressionada
        if (row >= 0 && row < gridHeight && col >= 0 && col < gridWidth) {
            updateCell(row, col, EMPTY); // Torna a célula vazia
        }
    } else if (event.buttons === 1) { // Verifica se o botão esquerdo do mouse está pressionado
        if (row >= 0 && row < gridHeight && col >= 0 && col < gridWidth) {
            updateCell(row, col, currentType); // Define o tipo atual na célula
        }
    }
}

function handleControlClick(event) {
    const button = event.target;
    const type = button.getAttribute('data-type');

    // Verifica se o botão clicado é um dos botões de controle desejados
    if (type === 'EMPTY' || type === 'CONDUCTOR' || type === 'HEAD') {
        // Remove a classe 'active' de todos os botões de controle
        document.querySelectorAll('#controls button[data-type]').forEach(btn => btn.classList.remove('active'));
        
        // Define o tipo atual baseado no botão clicado
        switch (type) {
            case 'EMPTY':
                currentType = EMPTY;
                break;
            case 'CONDUCTOR':
                currentType = CONDUCTOR;
                break;
            case 'HEAD':
                currentType = HEAD;
                break;
        }

        // Adiciona a classe 'active' apenas ao botão clicado
        button.classList.add('active');
    }
    // Se o botão clicado não for um dos tipos válidos, não faz nada (não adiciona 'active')
}

function handleClearGrid() {
    grid = createGrid();
    drawGrid();
}

function startSimulation() {
    running = !running;
    if (running) {
        startButton.textContent = 'Stop Simulation';
        simulate();
    } else {
        startButton.textContent = 'Start Simulation';
    }
}

function simulate() {
    updateGrid();
    drawGrid();
    if (running) {
        setTimeout(simulate, simulationSpeed);
    }
}

function updateGrid() {
    let nextGrid = createGrid();
    for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
            switch (grid[row][col]) {
                case EMPTY:
                    nextGrid[row][col] = EMPTY;
                    break;
                case CONDUCTOR:
                    let heads = countNeighboringHeads(row, col);
                    nextGrid[row][col] = heads === 1 || heads === 2 ? HEAD : CONDUCTOR;
                    break;
                case HEAD:
                    nextGrid[row][col] = TAIL;
                    break;
                case TAIL:
                    nextGrid[row][col] = CONDUCTOR;
                    break;
            }
        }
    }
    grid = nextGrid;
}

function countNeighboringHeads(row, col) {
    let heads = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let newRow = row + i;
            let newCol = col + j;
            if (newRow >= 0 && newRow < gridHeight && newCol >= 0 && newCol < gridWidth) {
                if (grid[newRow][newCol] === HEAD) {
                    heads++;
                }
            }
        }
    }
    return heads;
}

function handleSpeedChange(event) {
    simulationSpeed = parseInt(event.target.value);
}

function handleKeyDown(event) {
    event.preventDefault();
    const speed = 20; // Velocidade do movimento da câmera
    switch (event.key) {
        case 'ArrowUp':
            cameraY -= speed;
            break;
        case 'ArrowDown':
            cameraY += speed;
            break;
        case 'ArrowLeft':
            cameraX -= speed;
            break;
        case 'ArrowRight':
            cameraX += speed;
            break;
    }
    // Limitar a câmera dentro dos limites da grid
    cameraX = Math.max(cameraX, 0);
    cameraY = Math.max(cameraY, 0);
    cameraX = Math.min(cameraX, gridWidth * cellSize - viewWidth);
    cameraY = Math.min(cameraY, gridHeight * cellSize - viewHeight);
    drawGrid();
}

canvas.addEventListener('mousedown', handleCanvasMouseDown);
canvas.addEventListener('mousemove', handleCanvasMouseMove);
canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
controls.addEventListener('click', handleControlClick);
startButton.addEventListener('click', startSimulation);
clearButton.addEventListener('click', handleClearGrid);
speedControl.addEventListener('input', handleSpeedChange);
window.addEventListener('keydown', handleKeyDown);

drawGrid();