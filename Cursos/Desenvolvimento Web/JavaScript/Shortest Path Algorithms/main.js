const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const toggleWallButton = document.getElementById('toggleWallButton');
const rows = 20;
const cols = 20;
const cellSize = canvas.width / cols;
let grid = [];
let startNode = null;
let endNode = null;
let drawingWalls = false; // Variável para controlar se estamos desenhando ou apagando walls
let animationFrameId; // Variável para armazenar o ID da animação
let animationRunning = false; // Variável para controlar se a animação está em execução
let animationSpeed = 20; // Valor padrão para a velocidade da animação

function setAnimationSpeed(speed) {
    animationSpeed = speed;
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.distance = Infinity;
        this.predecessor = null;
        this.isStart = false;
        this.isEnd = false;
        this.isWall = false; // Adicionamos uma propriedade para identificar se é uma parede
    }

    draw(color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
        ctx.strokeRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
        if (this.distance < Infinity && !this.isWall && !this.isStart && !this.isEnd) {
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.distance, this.x * cellSize + cellSize / 2, this.y * cellSize + cellSize / 2);
        }
    }
}

function createGrid() {
    for (let y = 0; y < rows; y++) {
        let row = [];
        for (let x = 0; x < cols; x++) {
            row.push(new Node(x, y));
        }
        grid.push(row);
    }
}

function drawGrid() {
    for (let row of grid) {
        for (let node of row) {
            if (node.isWall) {
                node.draw('#262626');
            } else if (node.isStart) {
                node.draw('green');
            } else if (node.isEnd) {
                node.draw('red');
            } else {
                node.draw('white');
            }
        }
    }
}

function getNode(x, y) {
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        return grid[y][x];
    } else {
        return null;
    }
}

function toggleWall(x, y) {
    if (!animationRunning) { // Impede desenhar paredes durante a execução da animação
        const node = getNode(x, y);
        if (!node.isStart && !node.isEnd) {
            node.isWall = !node.isWall; // Alterna entre desenhar e apagar a parede
            drawGrid();
        }
    }
}

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    const gridX = Math.floor(mouseX / cellSize);
    const gridY = Math.floor(mouseY / cellSize);
    return { x: gridX, y: gridY };
}

canvas.addEventListener('mousedown', (e) => {
    if (drawingWalls) {
        const { x, y } = getMousePos(e);
        toggleWall(x, y);
    } else {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        const node = getNode(x, y);

        if (node) {
            if (!startNode && !node.isWall) {
                startNode = node;
                startNode.isStart = true;
                startNode.distance = 0;
                node.draw('green');
                document.getElementById("nodeInfo").innerHTML = "Define your ending point by clicking somewhere on the grid.";
            } else if (!endNode && node !== startNode && !node.isWall) {
                endNode = node;
                endNode.isEnd = true;
                node.draw('red');
                document.getElementById("nodeInfo").innerHTML = "Now you can start the algorithm!";
            }   
        }
    }
});

toggleWallButton.addEventListener('click', () => {
    drawingWalls = !drawingWalls; // Alterna o estado do desenho de paredes
    if (drawingWalls) {
        toggleWallButton.textContent = 'Drawing Walls ON';
    } else {
        toggleWallButton.textContent = 'Drawing Walls OFF';
    }
});

function findShortestPathBellmanFord() {
    const startTime = performance.now(); // Capture the start time

    const edges = [];
    for (let row of grid) {
        for (let node of row) {
            for (let neighbor of getNeighbors(node)) {
                edges.push([node, neighbor, 1]);
            }
        }
    }

    const nodes = grid.flat();
    for (let i = 0; i < nodes.length - 1; i++) {
        for (let [u, v, weight] of edges) {
            if (u.distance + weight < v.distance) {
                v.distance = u.distance + weight;
                v.predecessor = u;
            }
        }
    }

    animationRunning = true;
    animateSearch(() => {
        const path = [];
        let currentNode = endNode;
        while (currentNode) {
            path.push(currentNode);
            currentNode = currentNode.predecessor;
        }
        path.reverse();
        animatePath(path, startTime);
    });
}

function findShortestPathAStar(startNode, endNode) {
    const startTime = performance.now(); // Capture the start time
    animationRunning = true;
    animateSearch(() => {
        const openSet = new Set();
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        gScore.set(startNode, 0);
        fScore.set(startNode, heuristic(startNode, endNode));
        openSet.add(startNode);

        while (openSet.size > 0) {
            let current = null;
            let minFScore = Infinity;
            for (const node of openSet) {
                if (fScore.get(node) < minFScore) {
                    minFScore = fScore.get(node);
                    current = node;
                }
            }

            if (current === endNode) {
                reconstructPath(cameFrom, current, startTime);
                break;
            }

            openSet.delete(current);
            closedSet.add(current);

            for (const neighbor of getNeighbors(current)) {
                if (closedSet.has(neighbor)) continue;

                const tentativeGScore = gScore.get(current) + 1; // Assuming uniform cost

                if (!openSet.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentativeGScore);
                    fScore.set(neighbor, tentativeGScore + heuristic(neighbor, endNode));
                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    }
                    neighbor.distance = gScore.get(neighbor);
                }
            }
        }
    });
}

function heuristic(nodeA, nodeB) {
    // Heuristic function (Euclidean distance)
    const dx = Math.abs(nodeA.x - nodeB.x);
    const dy = Math.abs(nodeA.y - nodeB.y);
    return Math.sqrt(dx * dx + dy * dy);
}

function reconstructPath(cameFrom, current, startTime) {
    const path = [];
    while (cameFrom.has(current)) {
        path.unshift(current);
        current = cameFrom.get(current);
    }
    path.unshift(startNode); // Adiciona o nó inicial ao caminho
    animatePath(path, startTime);
}

function findShortestPathDijkstra(startNode, endNode) {
    const startTime = performance.now(); // Capture the start time
    animationRunning = true;
    animateSearch(() => {
        const openSet = new Set();
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();

        gScore.set(startNode, 0);
        openSet.add(startNode);

        while (openSet.size > 0) {
            let current = null;
            let minGScore = Infinity;
            for (const node of openSet) {
                if (gScore.get(node) < minGScore) {
                    minGScore = gScore.get(node);
                    current = node;
                }
            }

            if (current === endNode) {
                reconstructPath(cameFrom, current, startTime);
                break;
            }

            openSet.delete(current);
            closedSet.add(current);

            for (const neighbor of getNeighbors(current)) {
                if (closedSet.has(neighbor)) continue;

                const tentativeGScore = gScore.get(current) + 1; // Assuming uniform cost

                if (!openSet.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentativeGScore);
                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    }
                    neighbor.distance = gScore.get(neighbor);
                }
            }
        }
    });
}

function animateSearch(callback) {
    const nodesToVisit = [startNode]; // Iniciar com o nó de partida
    const visitedNodes = new Set(); // Conjunto para armazenar os nós visitados

    // Função para animar cada iteração do algoritmo Bellman-Ford
    function animateIteration() {
        if (animationRunning && nodesToVisit.length > 0) { // Adicione a verificação de animationRunning aqui
            const currentNode = nodesToVisit.shift(); // Remover o próximo nó a ser visitado
            visitedNodes.add(currentNode); // Adicionar o nó atual aos nós visitados
            if (!currentNode.isStart && !currentNode.isEnd && !currentNode.isWall) {
                currentNode.draw('#5d9ee3'); // Destacar o nó visitado apenas se não for o nó de partida ou chegada
            }

            for (let neighbor of getNeighbors(currentNode)) {
                if (!visitedNodes.has(neighbor) && !nodesToVisit.includes(neighbor)) {
                    nodesToVisit.push(neighbor); // Adicionar vizinhos não visitados à lista de nós a visitar
                    neighbor.distance = currentNode.distance + 1; // Atualizar a distância do vizinho
                }
            }

            setTimeout(animateIteration, 1000 / animationSpeed); // Ajustar o tempo de espera com base na velocidade
        } else {
            callback(); // Chamar a função de callback quando a busca estiver concluída
        }
    }

    animateIteration();
}

function animatePath(path, startTime) {
    let index = 0;

    function step() {
        if (index < path.length) {
            const node = path[index];
            if (!node.isStart && !node.isEnd) {
                node.draw('yellow');
            }
            index++;
            animationFrameId = setTimeout(step, 1000 / animationSpeed); // Ajustando o tempo de espera com base na velocidade
        } else if (animationRunning) {
            const endTime = performance.now(); // Capture the end time
            const duration = (endTime - startTime) / 1000; // Calculate the duration in seconds
            const algorithmSelect = document.getElementById('algorithmSelect');
            const selectedText = algorithmSelect.options[algorithmSelect.selectedIndex].text;
            document.getElementById("nodeInfo").innerHTML = `${selectedText} Algorithm Finished! Execution Time: ${duration.toFixed(2)} seconds`;
        }
    }

    step();
}

function reset() {
    startNode = null;
    endNode = null;
    grid = [];
    clearTimeout(animationFrameId); // Limpa a animação pendente
    createGrid();
    drawGrid();
    animationRunning = false; // Marcar que a animação não está em execução após o reset
    drawingWalls = false;
    toggleWallButton.textContent = 'Drawing Walls OFF';
    startButton.disabled = false;
    generateMazeButton.disabled = false;
    document.getElementById("nodeInfo").innerHTML = "Define your starting point by clicking somewhere on the grid.";
}

startButton.addEventListener('click', () => {
    if (!animationRunning) {
        if (startNode && endNode) {
            startButton.disabled = true;
            generateMazeButton.disabled = true;
            const algorithmSelect = document.getElementById('algorithmSelect');
            const selectedAlgorithm = algorithmSelect.value;

            if (selectedAlgorithm === 'bellman-ford') {
                findShortestPathBellmanFord();
                document.getElementById("nodeInfo").innerHTML = "Bellman-Ford Algorithm Started!";
            } else if (selectedAlgorithm === 'a-star') {
                findShortestPathAStar(startNode, endNode); // Passa startNode e endNode como argumentos
                document.getElementById("nodeInfo").innerHTML = "A* Algorithm Started!";
            } else if (selectedAlgorithm === 'dijkstra') {
                findShortestPathDijkstra(startNode, endNode); // Passa startNode e endNode como argumentos
                document.getElementById("nodeInfo").innerHTML = "Dijkstra Algorithm Started!";
            }

        } else {
            alert('Please select both start and end points.');
        }    
    }
});

resetButton.addEventListener('click', () => {
    reset();
});

// Função para obter os vizinhos de um nó
function getNeighbors(node) {
    const neighbors = [];
    const { x, y } = node;
    if (x > 0 && !getNode(x - 1, y).isWall) neighbors.push(getNode(x - 1, y));
    if (x < cols - 1 && !getNode(x + 1, y).isWall) neighbors.push(getNode(x + 1, y));
    if (y > 0 && !getNode(x, y - 1).isWall) neighbors.push(getNode(x, y - 1));
    if (y < rows - 1 && !getNode(x, y + 1).isWall) neighbors.push(getNode(x, y + 1));
    return neighbors;
}

const speedRange = document.getElementById('speedRange');

speedRange.addEventListener('input', () => {
    const speed = parseInt(speedRange.value);
    setAnimationSpeed(speed);
});

const generateMazeButton = document.getElementById('generateMazeButton');

generateMazeButton.addEventListener('click', () => {
    generateMaze();
});

function generateMaze() {
    if (!animationRunning) { // Verifica se a animação não está em execução
        reset(); // Limpa o grid antes de gerar o novo labirinto

        // Escolhe um ponto aleatório como ponto de partida
        const startX = randomInt(0, cols - 1);
        const startY = randomInt(0, rows - 1);

        // Chama a função de Recursive Backtracking para gerar o labirinto
        recursiveBacktracking(startX, startY);

        drawGrid(); // Desenha o labirinto gerado no canvas
    }
}

function recursiveBacktracking(x, y) {
    const directions = shuffleDirections(); // Embaralha as direções para explorar aleatoriamente

    for (let direction of directions) {
        const newX = x + direction[0] * 2; // Multiplica por 2 para garantir que sempre pule uma célula
        const newY = y + direction[1] * 2;

        if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && !getNode(newX, newY).isWall) {
            // Se a próxima célula não estiver fora dos limites e não for uma parede
            getNode(x + direction[0], y + direction[1]).isWall = true; // Marca a célula intermediária como caminho
            getNode(newX, newY).isWall = true; // Marca a próxima célula como caminho
            recursiveBacktracking(newX, newY); // Chama recursivamente a função para a próxima célula
        }
    }
}

function shuffleDirections() {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Direções: direita, esquerda, baixo, cima
    return directions.sort(() => Math.random() - 0.5); // Embaralha as direções
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

createGrid();
drawGrid();