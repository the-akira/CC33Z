// Retrieve the canvas element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas size and pixel size
const canvasSize = 600;
const pixelSize = 20;
const columns = Math.floor(canvasSize / pixelSize);
const rows = Math.floor(canvasSize / pixelSize);
canvas.width = canvasSize;
canvas.height = canvasSize;

// Initialize the pixel grid
const pixelGrid = [];
for (let i = 0; i < rows; i++) {
    pixelGrid[i] = [];
    for (let j = 0; j < columns; j++) {
        pixelGrid[i][j] = '#FFFFFF'; // Set initial color to white
    }
}

// Function to draw the pixel grid
function drawPixels() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const color = pixelGrid[i][j];
            ctx.fillStyle = color;
            ctx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
            ctx.strokeRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
        }
    }
}

// Variables for the square tool
let isDrawingSquare = false;

// Function to draw the outline of a square during mouse movement
function drawSquareOutline(x0, y0, x1, y1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPixels();
    ctx.strokeRect(x0 * pixelSize, y0 * pixelSize, (x1 - x0 + 1) * pixelSize, (y1 - y0 + 1) * pixelSize);
}

// Function to handle mouse events
function handleMouseEvent(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);
    const color = document.getElementById('color-picker').value;
    const pencilSize = parseInt(document.getElementById('pencil-size').value, 10);

    if (event.buttons === 1 || event.type === 'mousedown') {
        const tool = getActiveTool();
        switch (tool) {
            case 'pencil':
                drawWithPencil(x, y, color, pencilSize);
                break;
            case 'bucket':
                fillArea(x, y, color);
                break;
            case 'line':
                if (!isDrawingLine) {
                    startX = x;
                    startY = y;
                    isDrawingLine = true;
                } else {
                    drawLine(startX, startY, x, y, color);
                    isDrawingLine = false;
                }
                break;
            case 'square':
                if (!isDrawingSquare) {
                    startX = x;
                    startY = y;
                    isDrawingSquare = true;
                } else {
                    isDrawingSquare = false;
                    drawSquare(startX, startY, x, y, color);
                }
                break;
        }
        drawPixels();
    }
}

// Function to draw a square using the square tool
function drawSquare(x0, y0, x1, y1, color) {
    const minX = Math.min(x0, x1);
    const minY = Math.min(y0, y1);
    const maxX = Math.max(x0, x1);
    const maxY = Math.max(y0, y1);

    for (let i = minY; i <= maxY; i++) {
        pixelGrid[i][minX] = color;
        pixelGrid[i][maxX] = color;
    }

    for (let j = minX; j <= maxX; j++) {
        pixelGrid[minY][j] = color;
        pixelGrid[maxY][j] = color;
    }
}

// Function to handle mouse movement during square tool
function handleSquareToolMouseMove(event) {
    if (isDrawingSquare) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / pixelSize);
        const y = Math.floor((event.clientY - rect.top) / pixelSize);
        const color = document.getElementById('color-picker').value;
        drawSquareOutline(startX, startY, x, y);
    }
}

// Add event listeners for mouse movement during square tool
canvas.addEventListener('mousemove', handleSquareToolMouseMove);
canvas.addEventListener('mouseleave', () => {
    if (isDrawingSquare) {
        isDrawingSquare = false;
        drawPixels();
    }
});

// Function to get the active tool
function getActiveTool() {
    const toolButtons = document.querySelectorAll('#tools button');
    for (let i = 0; i < toolButtons.length; i++) {
        if (toolButtons[i].classList.contains('active')) {
            return toolButtons[i].dataset.tool;
        }
    }
    return 'pencil'; // Default to pencil tool
}

// Function to fill an area with a color using the bucket tool (flood fill)
function fillArea(x, y, color) {
    const targetColor = pixelGrid[y][x];
    if (targetColor === color) {
        return;
    }
    const queue = [[x, y]];

    while (queue.length > 0) {
        const [currentX, currentY] = queue.shift();
        if (pixelGrid[currentY][currentX] === targetColor) {
            pixelGrid[currentY][currentX] = color;

            if (currentX > 0) {
                queue.push([currentX - 1, currentY]);
            }
            if (currentX < columns - 1) {
                queue.push([currentX + 1, currentY]);
            }
            if (currentY > 0) {
                queue.push([currentX, currentY - 1]);
            }
            if (currentY < rows - 1) {
                queue.push([currentX, currentY + 1]);
            }
        }
    }
}

// Function to draw a line using the line tool
function drawLine(x0, y0, x1, y1, color) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;

    let err = dx - dy;
    let e2;

    while (true) {
        pixelGrid[y0][x0] = color;

        if (x0 === x1 && y0 === y1) {
            break;
        }

        e2 = err * 2;

        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }

        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }

    drawPixels();
}

// Function to draw with the pencil tool
function drawWithPencil(x, y, color, pencilSize) {
    const halfSize = Math.floor(pencilSize / 2);
    const startX = Math.max(x - halfSize, 0);
    const startY = Math.max(y - halfSize, 0);
    const endX = Math.min(x + halfSize, columns - 1);
    const endY = Math.min(y + halfSize, rows - 1);

    for (let i = startY; i <= endY; i++) {
        for (let j = startX; j <= endX; j++) {
            pixelGrid[i][j] = color;
       }
    }
}

// Add event listeners to the canvas
canvas.addEventListener('mousedown', handleMouseEvent);
canvas.addEventListener('mousemove', handleMouseEvent);
canvas.addEventListener('mouseup', handleMouseEvent);

// Add event listener to the pencil size input
const pencilSizeInput = document.getElementById('pencil-size');
pencilSizeInput.addEventListener('input', () => {
    const size = parseInt(pencilSizeInput.value, 10);
    if (isNaN(size) || size < 1 || size > 10) {
        pencilSizeInput.value = 1;
    } else {
        const color = document.getElementById('color-picker').value;
        highlightCurrentTile(currentX, currentY, size, color);
    }
});

// Add event listeners to the tool buttons
const toolButtons = document.querySelectorAll('#tools button');
for (let i = 0; i < toolButtons.length; i++) {
    toolButtons[i].addEventListener('click', () => {
        for (let j = 0; j < toolButtons.length; j++) {
            toolButtons[j].classList.remove('active');
        }
        toolButtons[i].classList.add('active');
    });
}

// Variables for the line tool
let isDrawingLine = false;
let startX, startY;

// Highlight the current tile on the grid
function highlightCurrentTile(x, y, pencilSize, color) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPixels();
    const halfSize = Math.floor(pencilSize / 2);
    const startX = Math.max(x - halfSize, 0);
    const startY = Math.max(y - halfSize, 0);
    const endX = Math.min(x + halfSize, columns - 1);
    const endY = Math.min(y + halfSize, rows - 1);
    for (let i = startY; i <= endY; i++) {
        for (let j = startX; j <= endX; j++) {
            ctx.fillStyle = color
            ctx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
            ctx.fillStyle = color;
            ctx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
        }
    }
}

// Function to handle mouse movement
function handleMouseMovement(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);
    const pencilSize = parseInt(document.getElementById('pencil-size').value, 10);
    const color = document.getElementById('color-picker').value;
    highlightCurrentTile(x, y, pencilSize, color);
}

// Function to clear the board
function clearBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            pixelGrid[i][j] = '#FFFFFF'; // Reset all pixels to white
        }
    }
    let pencilTool = document.getElementById("pencil-tool");
    let clearButton = document.getElementById("clear-button");
    pencilTool.classList.add("active");
    clearButton.classList.remove("active");
    drawPixels();
}

// Add event listener to the clear button
const clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', clearBoard);

// Add event listeners for mouse movement
canvas.addEventListener('mousemove', handleMouseMovement);
canvas.addEventListener('mouseleave', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPixels();
});

// Function to export the canvas as an image file
function exportImage() {
    // Remove grid lines before exporting
    ctx.strokeStyle = 'transparent';
    drawPixels();

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'pixel_art.png';
    link.click();

    // Restore grid lines after exporting
    ctx.strokeStyle = '#000';
    drawPixels();
    let exportButton = document.getElementById("export-button");
    let pencilTool = document.getElementById("pencil-tool");
    pencilTool.classList.add("active");
    exportButton.classList.remove("active");
}

// Functions to enable and disable the pencil tool
function disablePencilSize() { 
    document.getElementById('pencil-size').value = 1;
    document.getElementById('pencil-size').disabled = true;
}

function enablePencilSize() { 
    document.getElementById('pencil-size').disabled = false;
}

// Add event listeners to the buttons
const exportButton = document.getElementById('export-button');
exportButton.addEventListener('click', exportImage);

const lineButton = document.getElementById('line-tool')
lineButton.addEventListener('click', disablePencilSize)

const squareButton = document.getElementById('square-tool')
squareButton.addEventListener('click', disablePencilSize)

const pencilButton = document.getElementById('pencil-tool')
pencilButton.addEventListener('click', enablePencilSize)

const bucketButton = document.getElementById('bucket-tool')
bucketButton.addEventListener('click', enablePencilSize)

clearButton.addEventListener('click', enablePencilSize)
exportButton.addEventListener('click', enablePencilSize)

// Initial drawing of the pixel grid
drawPixels();