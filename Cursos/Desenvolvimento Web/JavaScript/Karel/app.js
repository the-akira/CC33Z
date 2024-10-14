const canvas = document.getElementById('karelCanvas');
const ctx = canvas.getContext('2d');

const totalGridSize = 20; // Grid maior 20x20
let cellSize = canvas.width / 10; // Cada célula na câmera será 1/10 do tamanho do canvas
const gridWidth = Math.floor(canvas.width / cellSize); 
const gridHeight = Math.floor(canvas.height / cellSize);
const globalGridWidth = totalGridSize; // Número total de colunas
const globalGridHeight = totalGridSize; // Número total de linhas

let beepers = []; // Lista de beepers no formato {x: 0, y: 0}
let beepersDropped = [];
let barriers = []; // Lista de barreiras no formato {x: 0, y: 0}
let cellColors = [];
let markers = [];
let collectedBeeperPositions = [];
let droppedBeeperPositions = [];

let commandQueue = [];
let isExecuting = false;
let isParsed = false;
let isMoving = false; // Variável para controlar se Karel está em movimento

const availableColors = ['cyan', 'green', 'pink', 'yellow', 'purple'];

const bgColors = {
  light: 'white',
  dark: 'black',
  alternative: 'white'
};

const gridColors = {
  light: '#000',
  dark: 'white',
  alternative: '#630502'
};

const beeperColors = {
  light: 'red',
  dark: '#fa41f1',
  alternative: 'orange'
};

const beepersDroppedColors = {
  light: '#66a62b',
  dark: '#a176cc',
  alternative: 'purple' 
};

const barrierColors = {
  light: 'black',
  dark: '#303030',
  alternative: 'red'
};

const markerColors = {
  light: 'green',
  dark: 'cyan',
  alternative: 'blue'
};

const karelColors = {
  light: { body: 'blue', direction: 'orange' },
  dark: { body: '#4a9e4d', direction: '#fff87d' },
  alternative: { body: 'green', direction: 'red' }
};

const coordinatesColors = {
  light: 'black',
  dark: 'white',
  alternative: '#3d0301' 
};

const gridHighlight = {
  light: { normal: 'rgba(0, 255, 0, 0.3)', hover: 'rgba(0, 255, 0, 0.5)'},
  dark: { normal: 'rgba(255, 160, 51, 0.3)', hover: 'rgba(255, 160, 51, 0.5)' },
  alternative: { normal: 'rgba(0, 255, 255, 0.3)', hover: 'rgba(0, 255, 255, 0.5)' }  
};

const targetColor = {
  light: '#b499ff',
  dark: '#32667d',
  alternative: '#d998bf'   
};

const canvasGradients = {
  light: 'linear-gradient(135deg, #d7fcd7 0%, #c8daf7 100%)',
  dark: 'linear-gradient(135deg, #333 0%, #666 100%)',
  alternative: 'linear-gradient(135deg, #ffefba 0%, #ffb3bf 100%)'
};

const pathColors = {
  light: 'rgba(255, 255, 0, 0.35)',
  dark: 'rgba(255, 0, 0, 0.35)',
  alternative: 'rgba(0, 255, 0, 0.35)'   
};

const themes = ['light', 'dark', 'alternative'];
let currentThemeIndex = 0;

const levels = [
  {
    start: { x: 1, y: 1 },
    target: { x: 5, y: 5 },
    beepersRequired: 3,
    beepersDropRequired: 3,
    maxMoves: 45,
    beepers: [
      { x: 2, y: 3 },
      { x: 4, y: 4 },
      { x: 6, y: 1 },
      { x: 2, y: 17 }
    ],
    barriers: [
      { x: 7, y: 7 },
      { x: 8, y: 8 },
      { x: 9, y: 9 }
    ],
    dropBeepers: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 }
    ],   
  },
  {
    start: { x: 1, y: 1 },
    target: { x: 8, y: 8 },
    beepersRequired: 3,
    beepersDropRequired: 3,
    maxMoves: 45,
    beepers: [
      { x: 3, y: 5 },
      { x: 7, y: 2 },
      { x: 5, y: 6 }
    ],
    barriers: [
      { x: 4, y: 4 },
      { x: 6, y: 7 },
      { x: 2, y: 2 }
    ],
    dropBeepers: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 }
    ], 
  }
];
let currentLevelIndex = 0; // Índice do nível atual
let collectedBeepers = 0; // Beepers coletados
let droppedBeepers = 0; // Beepers dropados
let currentMoves = 0; // Movimentos realizados

// Jogador (Karel)
const karel = {
  x: 0,
  y: 0,
  direction: 'right', // right, left, up, down
  active: true, // Se o Karel está ativo ou desligado
  beeperCount: 3,
  beeperLimit: 10
};

// Câmera para controlar a visão do jogo
const camera = {
  x: 0, // Posição inicial da câmera
  y: 0,
  width: 10, // A câmera mostrará uma visão de 10x10 células
  height: 10
};

canvas.addEventListener('click', (event) => {
  if (!isMoving) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize) + camera.x;
    const y = Math.floor((event.clientY - rect.top) / cellSize) + camera.y;

    // Verifica se já existe uma barreira na posição clicada
    const barrierIndex = barriers.findIndex(barrier => barrier.x === x && barrier.y === y);
    const beeperIndex = beepers.findIndex(beeper => beeper.x === x && beeper.y === y);
    const dropBeeperIndex = beepersDropped.findIndex(dropBeeper => dropBeeper.x === x && dropBeeper.y === y);

    if (beeperIndex !== -1 || dropBeeperIndex !== -1 
      || levels[currentLevelIndex].target.x == x 
      && levels[currentLevelIndex].target.y == y) {
      return;
    }

    // Se já houver uma barreira, remove-a
    if (barrierIndex !== -1) {
      barriers.splice(barrierIndex, 1); // Remove a barreira da lista
    }
    // Caso contrário, adiciona uma barreira, desde que não seja a posição de Karel e esteja dentro do grid
    else if (!(karel.x === x && karel.y === y) && x < totalGridSize && y < totalGridSize) {
      barriers.push({ x, y });
    }

    // Redesenha o grid para refletir as mudanças
    drawGrid();
  }
});

let hoverX = -1; // Variáveis para armazenar a célula atual em que o mouse está
let hoverY = -1;

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Calcula as coordenadas da célula da grid
  hoverX = Math.floor(mouseX / cellSize) + camera.x;
  hoverY = Math.floor(mouseY / cellSize) + camera.y;

  document.getElementById('xyPosition').innerHTML = `<b class="separator">|</b> <strong>Position:</strong> (<b>x</b>: ${hoverX}, <b>y</b>: ${hoverY})`;

  // Atualiza a grid com o destaque
  drawGrid();
});

canvas.addEventListener('mouseout', () => {
  // Quando o mouse sai da grid, remove o destaque
  document.getElementById('xyPosition').textContent = ``;
  hoverX = -1;
  hoverY = -1;
  drawGrid();
});

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Destaca a linha e a coluna do hover
  if (hoverX >= 0 && hoverY >= 0) {
    const highlightColumnX = (hoverX - camera.x) * cellSize; // Posição X do hover
    const highlightRowY = (hoverY - camera.y) * cellSize; // Posição Y do hover

    // Destaca a coluna até o eixo X
    ctx.fillStyle = gridHighlight[themes[currentThemeIndex]].normal; // Cor verde com transparência
    ctx.fillRect(highlightColumnX, 0, cellSize, highlightRowY + cellSize); // Destaque até o eixo X

    // Destaca a linha até o eixo Y
    ctx.fillRect(0, highlightRowY, highlightColumnX + cellSize, cellSize); // Destaque até o eixo Y

    // Destaca a célula que está sob o cursor com uma cor mais forte
    ctx.fillStyle = gridHighlight[themes[currentThemeIndex]].hover; // Cor verde um pouco mais forte
    ctx.fillRect(highlightColumnX, highlightRowY, cellSize, cellSize); // Destaque da célula
  }

  drawTarget(levels[currentLevelIndex].target.x, levels[currentLevelIndex].target.y);

  for (let x = 0; x < globalGridWidth; x++) {
    for (let y = 0; y < globalGridHeight; y++) {
      // Calcula as coordenadas da célula levando em conta a câmera
      const screenX = x - camera.x; // Ajusta a posição X pela câmera
      const screenY = y - camera.y; // Ajusta a posição Y pela câmera

      // Verifica se a célula está visível na tela
      if (screenX >= 0 && screenX < canvas.width / cellSize && screenY >= 0 && screenY < canvas.height / cellSize) {
        // Verifica se cellColors[x] existe e se a célula tem uma cor
        if (cellColors[x] && cellColors[x][y] !== undefined && cellColors[x][y] !== null) {
          ctx.fillStyle = cellColors[x][y];
          ctx.fillRect(screenX * cellSize, screenY * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  // Desenha as coordenadas nos eixos X e Y
  drawCoordinates();

  beepersDropped.forEach(beeper => {
    if (isWithinCamera(beeper)) {
      ctx.fillStyle = beepersDroppedColors[themes[currentThemeIndex]];
      const beeperX = (beeper.x - camera.x) * cellSize + cellSize / 2;
      const beeperY = (beeper.y - camera.y) * cellSize + cellSize / 2;
      const size = cellSize / 4; // Define o tamanho do triângulo

      // Desenha um triângulo
      ctx.beginPath();
      ctx.moveTo(beeperX, beeperY - size); // Vértice superior
      ctx.lineTo(beeperX - size, beeperY + size); // Vértice inferior esquerdo
      ctx.lineTo(beeperX + size, beeperY + size); // Vértice inferior direito
      ctx.closePath();

      // Preenche o triângulo
      ctx.fill();
    }
  });

  // Desenha os beepers dentro da área visível
  beepers.forEach(beeper => {
    if (isWithinCamera(beeper)) {
      ctx.fillStyle = beeperColors[themes[currentThemeIndex]];
      const beeperX = (beeper.x - camera.x) * cellSize + cellSize / 2;
      const beeperY = (beeper.y - camera.y) * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.arc(beeperX, beeperY, cellSize / 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Desenha as barreiras dentro da área visível
  barriers.forEach(barrier => {
    if (isWithinCamera(barrier)) {
      ctx.fillStyle = barrierColors[themes[currentThemeIndex]];
      const barrierX = (barrier.x - camera.x) * cellSize;
      const barrierY = (barrier.y - camera.y) * cellSize;
      ctx.fillRect(barrierX, barrierY, cellSize, cellSize);
    }
  });

  markers.forEach(marker => {
    // Ajusta a posição do marcador com base na câmera
    const markerX = (marker.x - camera.x) * cellSize;
    const markerY = (marker.y - camera.y) * cellSize;

    // Verifica se o marcador está dentro da área visível
    if (marker.x >= camera.x && marker.x <= camera.x + camera.width &&
        marker.y >= camera.y && marker.y <= camera.y + camera.height) {

      // Desenha um quadrado no centro da célula
      const squareSize = cellSize / 1.5;
      ctx.beginPath();
      ctx.rect(markerX + (cellSize - squareSize) / 2, markerY + (cellSize - squareSize) / 2, squareSize, squareSize);
      ctx.fillStyle = markerColors[themes[currentThemeIndex]]; // Cor do marcador
      ctx.fill();
    }
  });

  // Desenha a grid visível com base na posição da câmera
  for (let i = 0; i <= camera.width; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.strokeStyle = gridColors[themes[currentThemeIndex]];
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  // Desenha o jogador (Karel)
  drawKarel();
}

function drawKarel() {
  if (karel.active) {
    ctx.fillStyle = karelColors[themes[currentThemeIndex]].body;
    const centerX = (karel.x - camera.x) * cellSize + cellSize / 2;
    const centerY = (karel.y - camera.y) * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();

    // Desenha a indicação de direção
    ctx.fillStyle = karelColors[themes[currentThemeIndex]].direction;
    let arrowX = centerX;
    let arrowY = centerY;

    // Calcula a posição da seta com base na direção
    if (karel.direction === 'right') {
      arrowX += cellSize / 4;
    } else if (karel.direction === 'left') {
      arrowX -= cellSize / 4;
    } else if (karel.direction === 'up') {
      arrowY -= cellSize / 4;
    } else if (karel.direction === 'down') {
      arrowY += cellSize / 4;
    }

    // Desenha a seta indicando a direção
    ctx.beginPath();
    ctx.arc(arrowX, arrowY, cellSize / 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCoordinates() {
  ctx.fillStyle = coordinatesColors[themes[currentThemeIndex]];
  ctx.font = '14px Arial';

  // Desenha os números das colunas (eixo X) na parte superior
  for (let col = 0; col < camera.width; col++) {
    const xPos = col * cellSize + cellSize / 2;
    const gridX = camera.x + col;
    ctx.fillText(gridX, xPos - 5, 14); // Posição no eixo Y superior
  }

  // Desenha os números das linhas (eixo Y) no lado esquerdo
  for (let row = 0; row < camera.height; row++) {
    const yPos = row * cellSize + cellSize / 2;
    const gridY = camera.y + row;
    ctx.fillText(gridY, 3, yPos + 5); // Posição no eixo X esquerdo
  }
}

function initializeGrid() {
  for (let x = 0; x < globalGridWidth; x++) {
    cellColors[x] = [];
    for (let y = 0; y < globalGridHeight; y++) {
      cellColors[x][y] = null; // Nenhuma cor pintada inicialmente
    }
  }
}

function loadLevel(level) {
  karel.x = level.start.x;
  karel.y = level.start.y;
  let objectiveX = levels[currentLevelIndex].target.x;
  let objectiveY = levels[currentLevelIndex].target.y;
  collectedBeepers = 0; // Beepers coletados
  droppedBeepers = 0;
  currentMoves = 0; // Movimentos realizados
  document.getElementById('objective').innerHTML = `(${objectiveX},${objectiveY})`
  document.getElementById('level').innerHTML = `${currentLevelIndex}`
  document.getElementById('moves').innerHTML = `${currentMoves}/${levels[currentLevelIndex].maxMoves}`;
  document.getElementById('collected').innerHTML = `${collectedBeepers}/${levels[currentLevelIndex].beepersRequired}`;
  document.getElementById('dropped').innerHTML = `${droppedBeepers}/${levels[currentLevelIndex].beepersDropRequired}`;
  addBeepers(level);
  addBarriers(level);
  addDroppedBeepers(level);
  updateBeepersInUI(level);
  updateBarriersInUI(level);
  updateDroppedBeepersInUI(level);
  drawGrid();
  resetGameState(); // Reseta o estado do jogo
}

function updateBeepersInUI(level) {
  const beeperList = document.getElementById('beeperList');
  beeperList.innerHTML = ''; // Limpa a lista anterior

  level.beepers.forEach(beeper => {
    if (!collectedBeeperPositions.some(collected => collected.x === beeper.x && collected.y === beeper.y)) {
      // Só adiciona o beeper na lista se não foi coletado
      const element = document.createElement('span');
      element.textContent = `(${beeper.x},${beeper.y}) `;
      beeperList.appendChild(element);
    }
  });
}

function updateDroppedBeepersInUI(level) {
  const droppedBeeperList = document.getElementById('dropedBeeperList');
  droppedBeeperList.innerHTML = ''; // Limpa a lista anterior

  level.dropBeepers.forEach(beeper => {
    if (!droppedBeeperPositions.some(dropped => dropped.x === beeper.x && dropped.y === beeper.y)) {
      // Só adiciona o beeper na lista se ele ainda não foi dropado
      const element = document.createElement('span');
      element.textContent = `(${beeper.x},${beeper.y}) `;
      droppedBeeperList.appendChild(element);
    }
  });
}

function updateBarriersInUI(level) {
  const barrierList = document.getElementById('barrierList');
  barrierList.innerHTML = ''; // Limpa a lista anterior

  level.barriers.forEach(barrier => {
    const element = document.createElement('span');
    element.textContent = `(${barrier.x},${barrier.y}) `;
    barrierList.appendChild(element);
  });
}

function addBeepers(level) {
  // Limpa a lista de beepers
  beepers = [];

  // Adiciona os beepers de acordo com as coordenadas definidas no nível
  level.beepers.forEach(beeper => {
    // Certifique-se de que não está sobre a posição de Karel ou do alvo
    if (!(karel.x === beeper.x && karel.y === beeper.y) && !(level.target.x === beeper.x && level.target.y === beeper.y)) {
      beepers.push({ x: beeper.x, y: beeper.y });
    }
  });
}

function addDroppedBeepers(level) {
  // Limpa a lista de beepers
  beepersDropped = [];

  // Adiciona os beepers de acordo com as coordenadas definidas no nível
  level.dropBeepers.forEach(beeper => {
    // Certifique-se de que não está sobre a posição de Karel ou do alvo
    if (!(karel.x === beeper.x && karel.y === beeper.y) && !(level.target.x === beeper.x && level.target.y === beeper.y)) {
      beepersDropped.push({ x: beeper.x, y: beeper.y });
    }
  });
}

function addBarriers(level) {
  // Limpa a lista de barreiras
  barriers = [];

  // Adiciona as barreiras de acordo com as coordenadas definidas no nível
  level.barriers.forEach(barrier => {
    // Certifique-se de que a barreira não está sobre a posição de Karel ou do alvo
    if (!(karel.x === barrier.x && karel.y === barrier.y) && !(level.target.x === barrier.x && level.target.y === barrier.y)) {
      barriers.push({ x: barrier.x, y: barrier.y });
    }
  });
}

function resetGameState() {
  collectedBeepers = 0; // Reseta o contador de beepers
  currentMoves = 0; // Reseta o contador de movimentos
}

function drawTarget(x, y) {
  ctx.fillStyle = targetColor[themes[currentThemeIndex]]; // Cor do alvo
  const targetX = (x - camera.x) * cellSize;
  const targetY = (y - camera.y) * cellSize;
  ctx.fillRect(targetX, targetY, cellSize, cellSize); // Desenha o alvo
}

function checkLevelCompletion(level) {
  if (karel.x === level.target.x && karel.y === level.target.y 
      && collectedBeepers >= level.beepersRequired 
      && droppedBeepers >= level.beepersDropRequired) {
    document.getElementById('feedback').innerHTML = 'Você completou o nível!';

    // Exibe a barra de carregamento e redefine o progresso
    let loadingBar = document.getElementById('loadingBar');
    let loadingBarContainer = document.getElementById('loadingBarContainer');
    loadingBar.style.width = '0%';  // Reseta a barra
    loadingBarContainer.style.display = 'block'; // Mostra a barra

    // Inicia a animação da barra de progresso
    setTimeout(function() {
      loadingBar.style.width = '100%'; // Preenche a barra em 2 segundos
    }, 10);

    // Adiciona um delay de 2 segundos antes de passar para o próximo nível
    setTimeout(function() {
      loadingBarContainer.style.display = 'none'; // Esconde a barra
      document.getElementById('feedback').innerHTML = '';
      nextLevel();  // Troca para o próximo nível
    }, 2000); // Delay de 2 segundos (2000 ms)
    
  } else if (currentMoves >= level.maxMoves) {
    document.getElementById('feedback').innerHTML = 'Você excedeu o número de movimentos!';
    resetLevel();
    resetKarel();
  }
}

function nextLevel() {
  currentLevelIndex++;
  if (currentLevelIndex < levels.length) {
    loadLevel(levels[currentLevelIndex]);
  } else {
    alert('Parabéns! Você completou todos os níveis!');
    resetKarel();
  }
}

function resetLevel() {
  loadLevel(levels[currentLevelIndex]);
}

function highlightCell() {
  const ctx = document.getElementById('karelCanvas').getContext('2d');
  const cellSize = 500 / totalGridSize; // Calcula o tamanho da célula baseado no tamanho total da grid

  // Salva o estado do contexto para restaurar mais tarde
  ctx.save();

  // Define uma cor de destaque para a célula
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 1;

  // Define um gradiente de cores para o background
  document.getElementById('karelCanvas').style.background = canvasGradients[themes[currentThemeIndex]];
  // Aguarda um pequeno intervalo antes de limpar a animação
  setTimeout(() => {
    // Restaura o estado do contexto
    ctx.restore();
    drawGrid(); // Redesenha a grid para remover o highlight
    document.getElementById('karelCanvas').style.background = bgColors[themes[currentThemeIndex]]; // Volta para o fundo branco
  }, 300); // Tempo do efeito
}

function moveKarel() {
  if (!karel.active) return;

  // Calcula a próxima posição de Karel com base na direção
  let nextX = karel.x;
  let nextY = karel.y;

  if (karel.direction === 'right' && karel.x < totalGridSize - 1) {
    nextX++;
  } else if (karel.direction === 'left' && karel.x > 0) {
    nextX--;
  } else if (karel.direction === 'up' && karel.y > 0) {
    nextY--;
  } else if (karel.direction === 'down' && karel.y < totalGridSize - 1) {
    nextY++;
  }

  // Verifica se a próxima posição é uma barreira
  const collision = barriers.some(barrier => barrier.x === nextX && barrier.y === nextY);
  if (!collision) {
    highlightCell();
    karel.x = nextX;
    karel.y = nextY;
    updateCamera();
    drawGrid();
  }

  currentMoves++; // Incrementa o contador de movimentos
  document.getElementById('moves').innerHTML = `${currentMoves}/${levels[currentLevelIndex].maxMoves}`;

  checkLevelCompletion(levels[currentLevelIndex]);
}

function turnLeft() {
  if (!karel.active) return;
  if (karel.direction === 'right') {
    karel.direction = 'up';
  } else if (karel.direction === 'up') {
    karel.direction = 'left';
  } else if (karel.direction === 'left') {
    karel.direction = 'down';
  } else if (karel.direction === 'down') {
    karel.direction = 'right';
  }
  drawGrid();
}

function paintCorner(color) {
  if (availableColors.includes(color)) {
    const cellX = karel.x;
    const cellY = karel.y;

    cellColors[cellX][cellY] = color;
    drawGrid();

    console.log(`Karel pintou a célula em (${cellX}, ${cellY}) com a cor ${color}`);
  } else {
    console.error(`Cor inválida: ${color}`);
  }
}

canvas.addEventListener('contextmenu', function(event) {
  event.preventDefault();

  if (isMoving) return;

  // Obtém a posição relativa ao canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Corrige as coordenadas para a grid considerando a câmera
  const targetX = Math.floor((mouseX / cellSize) + camera.x);
  const targetY = Math.floor((mouseY / cellSize) + camera.y);

  // Verifica se o destino é uma barreira
  const isBarrier = barriers.some(barrier => barrier.x === targetX && barrier.y === targetY);
  if (isBarrier) {
    alert('Destino inválido! Há uma barreira nesse local.');
    return;
  }

  console.log("Clicked position: ", targetX, targetY);

  const path = findShortestPath({ x: karel.x, y: karel.y }, { x: targetX, y: targetY });
  
  if (path) {
    console.log("Path found: ", path);
    moveAlongPath(path); // Inicia o movimento
  } else {
    console.error("No path found to the target.");
  }
});

function findShortestPath(start, goal) {
  const queue = [start];
  const cameFrom = {};
  cameFrom[`${start.x},${start.y}`] = null;

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, goal);
    }

    const neighbors = getNeighbors(current);

    neighbors.forEach(next => {
      const nextKey = `${next.x},${next.y}`;
      if (!cameFrom.hasOwnProperty(nextKey) && !isBarrier(next)) {
        queue.push(next);
        cameFrom[nextKey] = current;
      }
    });
  }

  return null; // Se não encontrar um caminho
}

function reconstructPath(cameFrom, goal) {
  let current = goal;
  const path = [];

  while (current) {
    path.unshift(current);
    current = cameFrom[`${current.x},${current.y}`];
  }

  return path;
}

function getNeighbors({ x, y }) {
  const directions = [
    { dx: 0, dy: 1 },  // baixo
    { dx: 1, dy: 0 },  // direita
    { dx: 0, dy: -1 }, // cima
    { dx: -1, dy: 0 }  // esquerda
  ];
  
  const neighbors = [];

  directions.forEach(({ dx, dy }) => {
    const neighborX = x + dx;
    const neighborY = y + dy;

    // Verifica se o vizinho está dentro dos limites da grade e não é uma barreira
    if (isWithinBounds(neighborX, neighborY) && !isBarrier({ x: neighborX, y: neighborY })) {
      neighbors.push({ x: neighborX, y: neighborY });
    }
  });

  return neighbors;
}

function isWithinBounds(x, y) {
  return x >= 0 && x < totalGridSize && y >= 0 && y < totalGridSize; // Ajuste conforme a lógica da sua grade
}

function isBarrier({ x, y }) {
  return barriers.some(barrier => barrier.x === x && barrier.y === y);
}

let moveInterval; // Variável para armazenar a referência do setInterval

function moveAlongPath(path) {
  if (path.length === 0 || !karel.active) return;

  // Indica que Karel está em movimento
  isMoving = true;
  disableButtons();

  // Desenha a rota destacada no canvas
  drawGrid(); // Redesenha a grid
  drawPath(path); // Desenha a rota

  const nextStep = path.shift();

  // Ajusta a direção de Karel para o próximo passo
  adjustDirection(nextStep);

  // Move Karel um passo por vez
  moveInterval = setInterval(function() {
    document.getElementById("command").innerHTML = `(${nextStep.x}, ${nextStep.y})`;
    if (karel.x === nextStep.x && karel.y === nextStep.y) {
      clearInterval(moveInterval);
      if (path.length > 0) {
        moveAlongPath(path); // Chama recursivamente até terminar o caminho
      } else {
        // Quando Karel termina de se mover, desativa isMoving
        isMoving = false;
        enableButtons();
      }
    } else {
      moveKarel(); // Move Karel na direção ajustada
    }
  }, 500); // Delay de 500ms entre cada movimento
}

const controlButtons = document.querySelectorAll('.controlBtn'); // Substitua pela sua classe ou ID

function disableButtons() {
  controlButtons.forEach(button => {
    button.disabled = true;
  });
}

function enableButtons() {
  controlButtons.forEach(button => {
    button.disabled = false;
  });
}

function drawPath(path) {
  ctx.fillStyle = pathColors[themes[currentThemeIndex]]; // Cor do highlight (verde transparente)

  path.forEach(step => {
    const x = (step.x - camera.x) * cellSize;
    const y = (step.y - camera.y) * cellSize;
    ctx.fillRect(x, y, cellSize, cellSize); // Desenha um retângulo em cada célula da rota
  });
}

function adjustDirection(nextStep) {
  if (nextStep.x > karel.x) {
    karel.direction = 'right';
  } else if (nextStep.x < karel.x) {
    karel.direction = 'left';
  } else if (nextStep.y > karel.y) {
    karel.direction = 'down';
  } else if (nextStep.y < karel.y) {
    karel.direction = 'up';
  }
}

function putBeeper() {
  const existingBeeper = beepers.find(beeper => beeper.x === karel.x && beeper.y === karel.y);
  
  if (!existingBeeper) {  // Se não existir um beeper na posição atual
    if (karel.beeperCount > 0) {
      // Adiciona o beeper no array de beepers
      beepers.push({ x: karel.x, y: karel.y });  
      karel.beeperCount--;
      updateBeeperDisplay();
      drawGrid();

      // Verifica se Karel dropou o beeper na posição correta
      const currentLevel = levels[currentLevelIndex];
      const correctDrop = currentLevel.dropBeepers.find(drop => drop.x === karel.x && drop.y === karel.y);
      
      if (correctDrop && !droppedBeeperPositions.some(pos => pos.x === karel.x && pos.y === karel.y)) {
        droppedBeeperPositions.push({ x: karel.x, y: karel.y });
        updateDroppedBeepersInUI(levels[currentLevelIndex]);
        droppedBeepers++; // Incrementa o número de beepers dropados corretamente
        document.getElementById('dropped').innerHTML = `${droppedBeepers}/${levels[currentLevelIndex].beepersDropRequired}`;

        console.log(`Beeper dropado corretamente! Total: ${droppedBeepers}/${currentLevel.beepersDropRequired}`);
        console.log(droppedBeepers)
      }
    } else {
      console.error("Karel não possui beepers suficientes para colocar.");
    }
  } else {
    console.error("Já existe um beeper nesta posição!");
  }
}

function pickBeeper() {
  const beeperIndex = levels[currentLevelIndex].beepers.findIndex(beeper => beeper.x === karel.x && beeper.y === karel.y);
  
  if (beeperIndex !== -1) {
    const beeper = beepers[beeperIndex];
    
    // Verificar se a posição já foi coletada antes
    const isAlreadyCollected = collectedBeeperPositions.some(pos => pos.x === beeper.x && pos.y === beeper.y);
    
    if (!isAlreadyCollected && karel.beeperCount < karel.beeperLimit) {
      // A primeira vez que coleta um beeper desta posição conta para o progresso
      collectedBeeperPositions.push({ x: beeper.x, y: beeper.y });
      updateBeepersInUI(levels[currentLevelIndex]);
      collectedBeepers++;  // Aumenta o progresso do objetivo
      document.getElementById('collected').innerHTML = `${collectedBeepers}/${levels[currentLevelIndex].beepersRequired}`;
      
      karel.beeperCount++;  // Karel coleta o beeper
      beepers.splice(beeperIndex, 1);  // Remove o beeper do tabuleiro
      
      updateBeeperDisplay();
      drawGrid();
    } else if (isAlreadyCollected && karel.beeperCount < karel.beeperLimit) {
      // Permite pegar o beeper, mas sem aumentar o progresso
      karel.beeperCount++;
      beepers.splice(beeperIndex, 1);
      
      updateBeeperDisplay();
      drawGrid();
    } else if (karel.beeperCount >= karel.beeperLimit) {
      console.error("Karel já está carregando o máximo de beepers.");
    }
  }
}

function updateBeeperDisplay() {
  document.getElementById('beeperCount').innerText = `${karel.beeperCount}/${karel.beeperLimit}`;
}

function toggleKarel() {
  if (!isMoving) {
    karel.active = !karel.active; // Alterna o estado de Karel
    updateButtonText(); // Atualiza o texto do botão
    drawGrid(); // Desenha a grid com o novo estado de Karel
  }
}

function updateButtonText() {
  const button = document.getElementById('toggleButton');
  button.textContent = karel.active ? 'Turn Off' : 'Turn On'; // Muda o texto do botão
}

// Atualiza a posição da câmera com base na posição do Karel
function updateCamera() {
  camera.x = Math.max(0, Math.min(karel.x - Math.floor(camera.width / 2), totalGridSize - camera.width));
  camera.y = Math.max(0, Math.min(karel.y - Math.floor(camera.height / 2), totalGridSize - camera.height));
}

function isWithinCamera(object) {
  return object.x >= camera.x && object.x < camera.x + camera.width &&
         object.y >= camera.y && object.y < camera.y + camera.height;
}

function executeScript() {
  if (isExecuting) return;

  clearMessages();

  const script = document.getElementById('karelScript').value.trim();
  const lines = script.split('\n');
  const parsedScript = parseScript(lines, 0);
  commandQueue = parsedScript.commands;

  console.log("Script Parsed:", JSON.stringify(commandQueue, null, 2)); // Verificação da estrutura do script
  isExecuting = true;
  executeNextCommand();
}

// Função recursiva para analisar o script e identificar comandos aninhados
function parseScript(lines, currentIndex = 0, indentLevel = 0) {
  const commands = [];
  let i = currentIndex;
  const stack = [];

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Ignorar linhas vazias
    if (trimmedLine === '') {
      i++;
      continue;
    }

    // Calcular o nível de indentação
    const currentIndentLevel = (line.length - trimmedLine.length) / 2;

    // Verifica se saímos do nível atual
    if (currentIndentLevel < indentLevel) {
      break; // Saímos do bloco atual
    }

    // Bloco `repeat`
    if (trimmedLine.startsWith('repeat')) {
      const match = trimmedLine.match(/repeat\s+(\d+)|repeat\s+(\w+):(\d+)-(\d+)/);
      if (match) {
        let repeatCount;
        if (match[1]) {
          // Se for um número direto
          repeatCount = parseInt(match[1], 10);
          if (isNaN(repeatCount) || repeatCount < 0) {
            console.error("Erro de sintaxe: O número no 'repeat' deve ser um número positivo.");
            break; // Para evitar loop infinito
          }
        } else {
          // Se for a variável
          const variable = match[2];
          const start = parseInt(match[3], 10);
          const end = parseInt(match[4], 10);
          if (isNaN(start) || isNaN(end) || start > end) {
            console.error("Erro de sintaxe: Intervalo inválido no 'repeat'.");
            break; // Para evitar loop infinito
          }

          // Capturar o bloco dentro do `repeat`
          i++;
          const { commands: repeatBlock, nextIndex } = parseScript(lines, i, indentLevel + 1);
          i = nextIndex;

          // Expandir o bloco `repeat` do `start` até `end`
          for (let j = start; j <= end; j++) {
            const expandedBlock = repeatBlock.map(command =>
              command.replace(new RegExp(`\\b${variable}\\b`, 'g'), j)
            );
            commands.push(...expandedBlock);
          }
          continue; // Continue para não adicionar o bloco de repetição novamente
        }

        // Capturar o bloco dentro do `repeat` se for um número direto
        i++;
        const { commands: repeatBlock, nextIndex } = parseScript(lines, i, indentLevel + 1);
        i = nextIndex;

        // Expandir o bloco `repeat` o número de vezes especificado
        for (let j = 0; j < repeatCount; j++) {
          commands.push(...repeatBlock);
        }
      } else {
        console.error("Erro de sintaxe: O bloco 'repeat' está mal formatado.");
        break; // Para evitar o loop infinito
      }
    }
    // Bloco `if`
    else if (trimmedLine.startsWith('if')) {
      const condition = trimmedLine.match(/if (.+)/)[1].trim();
      i++;

      // Capturar o bloco `if`
      const { commands: ifBlock, nextIndex } = parseScript(lines, i, indentLevel + 1);
      i = nextIndex;

      // Criar o comando `if` com `elseBlock` vazio inicialmente
      const ifCommand = { type: 'if', condition, ifBlock, elseBlock: [] };
      commands.push(ifCommand);
      stack.push(ifCommand);
    }
    else if (trimmedLine.startsWith('else')) {
      if (currentIndentLevel < indentLevel) {
        break; // Saímos do bloco atual
      }

      if (stack.length === 0) {
        throw new Error("Erro de sintaxe: 'else' sem um bloco 'if' correspondente.");
      }

      const ifCommand = stack.pop();
      i++;

      const { commands: elseBlock, nextIndex } = parseScript(lines, i, indentLevel + 1);
      i = nextIndex;

      ifCommand.elseBlock = elseBlock;
    }
    // Bloco `while`
    else if (trimmedLine.startsWith('while')) {
      const condition = trimmedLine.match(/while (.+)/)[1].trim();
      i++;

      // Capturar o bloco dentro do `while`
      const { commands: whileBlock, nextIndex } = parseScript(lines, i, indentLevel + 1);
      i = nextIndex;

      // Criar o comando `while` com a condição e bloco associados
      const whileCommand = { type: 'while', condition, whileBlock };
      commands.push(whileCommand);
    }
    // Comando comum (ex: `move()`, `turn_left()`)
    else {
      commands.push(trimmedLine);
      i++;
    }
  }

  return { commands, nextIndex: i };
}

// Função para executar o próximo comando na fila
function executeNextCommand() {
  if (commandQueue.length === 0) {
    isExecuting = false;
    enableButtons();
    return;
  }

  disableButtons();

  const command = commandQueue.shift();

  if (typeof command === 'string') {
    console.log(`Executando comando: ${command}`);
    document.getElementById("command").innerHTML = command;
    evaluateCommand(command);
  } else if (typeof command === 'object' && command.type === 'if') {
    console.log(`Avaliando condição: ${command.condition}`);
    document.getElementById("command").innerHTML = command.condition;
    const conditionMet = evaluateCondition(command.condition);
    console.log(`Condição '${command.condition}' é ${conditionMet ? 'verdadeira' : 'falsa'}`);
    const blockToExecute = conditionMet ? command.ifBlock : command.elseBlock;

    if (blockToExecute.length > 0) {
      commandQueue.unshift(...blockToExecute);
    }
  } else if (typeof command === 'object' && command.type === 'while') {
    console.log(`Avaliando condição do while: ${command.condition}`);
    document.getElementById("command").innerHTML = command.condition;
    const conditionMet = evaluateCondition(command.condition);

    if (conditionMet) {
      console.log(`Condição '${command.condition}' é verdadeira, repetindo bloco.`);
      commandQueue.unshift(command); // Reinserir o próprio comando `while`
      commandQueue.unshift(...command.whileBlock); // Adicionar o bloco do `while`
    } else {
      console.log(`Condição '${command.condition}' é falsa, saindo do while.`);
    }
  }

  setTimeout(executeNextCommand, 500);
}

function executeStep() {
  if (!isParsed) {
    const script = document.getElementById('karelScript').value.trim();
    const lines = script.split('\n');
    const parsedScript = parseScript(lines, 0);
    commandQueue = parsedScript.commands;
    isParsed = true;
    console.log("Script Parsed:", JSON.stringify(commandQueue, null, 2));
  }

  if (commandQueue.length === 0) return;

  const command = commandQueue.shift();

  if (typeof command === 'string') {
    console.log(`Executando comando: ${command}`);
    document.getElementById("command").innerHTML = command;
    evaluateCommand(command);
  } else if (typeof command === 'object') {
    if (command.type === 'if') {
      const conditionMet = evaluateCondition(command.condition);
      const blockToExecute = conditionMet ? command.ifBlock : command.elseBlock;
      document.getElementById("command").innerHTML = command.condition;

      if (blockToExecute.length > 0) {
        commandQueue.unshift(...blockToExecute);
      }
    } else if (command.type === 'while') {
      const conditionMet = evaluateCondition(command.condition);
      document.getElementById("command").innerHTML = command.condition;
      if (conditionMet) {
        console.log(`Condição '${command.condition}' é verdadeira, repetindo bloco.`);
        commandQueue.unshift(command); // Recoloca o `while` para avaliar novamente após o bloco
        commandQueue.unshift(...command.whileBlock); // Executa o bloco associado ao `while`
      } else {
        console.log(`Condição '${command.condition}' é falsa, saindo do while.`);
      }
    }
  }
}

function evaluateCommand(command) {
  if (command === 'move()') {
    moveKarel();
  } else if (command === 'turn_left()') {
    turnLeft();
  } else if (command === 'put_beeper()') {
    putBeeper();
  } else if (command === 'pick_beeper()') {
    pickBeeper();
  } else if (command.startsWith('paint_corner')) {
    const colorMatch = command.match(/\(([^)]+)\)/); // Extrai o argumento dentro dos parênteses
    if (colorMatch && colorMatch[1]) {
      const color = colorMatch[1].trim(); // Extrai e remove espaços da cor
      console.log(`Pintando de cor: ${color}`);
      paintCorner(color); // Chama a função para pintar
    } else {
      console.error(`Comando paint_corner inválido: ${command}`);
    }
  } else if (command.startsWith('print')) {
    const messageMatch = command.match(/\(([^)]+)\)/); // Extrai a mensagem dentro dos parênteses
    if (messageMatch && messageMatch[1]) {
      const message = messageMatch[1].trim().replace(/['"]+/g, ''); // Extrai e remove aspas da mensagem
      console.log(`Mensagem: ${message}`);
      printMessage(message); // Chama a função para exibir a mensagem
    } else {
      console.error(`Comando print inválido: ${command}`);
    }
  } else if (command.startsWith('solve(')) {
    const startIndex = command.indexOf('(') + 1; // Índice logo após o primeiro parêntese
    let endIndex = startIndex; // Inicializa com o início da expressão
    let parenthesesCounter = 1; // Contador de parênteses

    // Percorre a string para encontrar o índice de fechamento do parêntese
    while (endIndex < command.length && parenthesesCounter > 0) {
      if (command[endIndex] === '(') {
        parenthesesCounter++; // Aumenta o contador se encontrar um parêntese aberto
      } else if (command[endIndex] === ')') {
        parenthesesCounter--; // Diminui o contador se encontrar um parêntese fechado
      }
      endIndex++;
    }

    if (parenthesesCounter === 0) { // Verifica se todos os parênteses foram fechados
      const expression = command.slice(startIndex, endIndex - 1).trim(); // Extrai a expressão
      console.log(`Resolvendo expressão: ${expression}`);
      solveExpression(expression); // Chama a função para resolver a expressão
    } else {
      console.error(`Comando solve inválido (parênteses não correspondentes): ${command}`);
    }
  } else {
    console.error(`Comando inválido: ${command}`);
  }
}

function solveExpression(expression) {
  try {
    // Verifica se a expressão é válida antes de usar eval
    if (!isValidExpression(expression)) {
      throw new Error(`Invalid Expression: ${expression}`);
    }

    // Usa eval para avaliar a expressão
    const result = eval(expression);
    const resultElement = document.getElementById('output');

    // Exibe o resultado no console e na tela
    console.log(`Expressão: ${expression} | Resultado: ${result}`);
    if (resultElement) {
      const newResult = document.createElement('p');
      newResult.innerHTML = `<b>>>></b> Expressão: ${expression} | Resultado: ${result}`;
      resultElement.appendChild(newResult);
    } else {
      console.error('Elemento #result não encontrado para exibir a mensagem');
    }
  } catch (error) {
    console.error(`Erro ao resolver a expressão: ${error.message}`);
    const resultElement = document.getElementById('result');
    if (resultElement) {
      const errorMessage = document.createElement('p');
      errorMessage.textContent = `Erro: ${error.message}`;
      errorMessage.style.color = 'red'; // Cor diferente para erros
      resultElement.appendChild(errorMessage);
    }
  }
}

function isValidExpression(expression) {
  // Permitir números, operadores aritméticos, operadores de comparação e parênteses
  const validCharacters = /^[0-9+\-*/().><= ]+$/; // Permitindo números e operadores aritméticos
  const validComparisons = /(^|\s)(==|===|!=|!==|>|<|>=|<=)(\s|$)/; // Verifica se há operadores de comparação válidos

  // Checar se a expressão contém apenas caracteres válidos
  const isValid = validCharacters.test(expression);
  
  // Permitir expressões aritméticas sem comparação
  const hasArithmetic = /[0-9+\-*/()]/.test(expression);

  // Checar se é uma expressão aritmética válida ou contém uma comparação válida
  return isValid && (hasArithmetic || validComparisons.test(expression));
}


// Função para exibir a mensagem na tela
function printMessage(message) {
  const messageContainer = document.getElementById('output');
  if (messageContainer) {
    const newMessage = document.createElement('p');
    newMessage.innerHTML = `<b>>>></b> ${message}`;
    messageContainer.appendChild(newMessage); // Exibe a mensagem no container
  } else {
    console.error('Elemento #output não encontrado para exibir a mensagem');
  }
}

function clearMessages() {
  const messageContainer = document.getElementById('output');
  if (messageContainer) {
    messageContainer.innerHTML = ''; // Limpa todo o conteúdo do container
  } else {
    console.error('Elemento #output não encontrado para limpar as mensagens');
  }
}

function evaluateCondition(condition) {
  console.log(`Avaliar condição: ${condition}`); // Depuração
  switch (condition) {
    case 'front_is_clear()':
      return front_is_clear();
    case 'beepers_present()':
      return beepers_present();
    case 'beepers_in_bag()':
      return beepers_in_bag();
    case 'left_is_clear()':
      return left_is_clear();
    case 'right_is_clear()':
      return right_is_clear();
    case 'facing_north()':
      return facing_north();
    case 'facing_south()':
      return facing_south();
    case 'facing_east()':
      return facing_east();
    case 'facing_west()':
      return facing_west();

    // Condições inversas
    case 'front_is_blocked()':
      return front_is_blocked();
    case 'no_beepers_present()':
      return no_beepers_present();
    case 'no_beepers_in_bag()':
      return no_beepers_in_bag();
    case 'left_is_blocked()':
      return left_is_blocked();
    case 'right_is_blocked()':
      return right_is_blocked();
    case 'not_facing_north()':
      return not_facing_north();
    case 'not_facing_south()':
      return not_facing_south();
    case 'not_facing_east()':
      return not_facing_east();
    case 'not_facing_west()':
      return not_facing_west();

    default:
      console.error(`Condição inválida: ${condition}`);
      return false;
  }
}

function resetKarel() {
  if (isMoving) {
    clearInterval(moveInterval); // Cancela o movimento
    isMoving = false; // Reseta o estado de movimento
  }
  karel.x = 0;
  karel.y = 0;
  camera.x = 0;
  camera.y = 0;
  karel.direction = 'right';
  karel.active = true;
  karel.beeperCount = 0;
  commandQueue = [];
  barriers = [];
  beepers = [];
  isExecuting = false;
  isParsed = false;
  cellColors = [];
  markers = [];
  collectedBeeperPositions = [];
  droppedBeeperPositions = [];
  document.getElementById('feedback').innerHTML = '';
  currentLevelIndex = 0;
  collectedBeepers = 0;
  droppedBeepers = 0;
  currentMoves = 0;
  resetLevel();
  initializeGrid();
  document.getElementById("command").innerHTML = "None";
  drawGrid();
  updateBeeperDisplay();
  enableButtons();
  clearMessages();
}

function front_is_clear() {
  let frontX = karel.x;
  let frontY = karel.y;

  switch (karel.direction) {
    case "up":
      frontY -= 1;  // Norte
      console.log(frontY)
      if (frontY < 0) return false; // Verifica se está na extremidade superior global da grid
      break;
    case "down":
      frontY += 1;  // Sul
      if (frontY >= globalGridHeight) return false; // Verifica se está na extremidade inferior global
      break;
    case "right":
      frontX += 1;  // Leste
      if (frontX >= globalGridWidth) return false; // Verifica se está na extremidade direita global
      break;
    case "left":
      frontX -= 1;  // Oeste
      console.log(frontX)
      if (frontX < 0) return false; // Verifica se está na extremidade esquerda global
      break;
  }

  // Verifica se há uma barreira na posição à frente
  return !barriers.find(barrier => barrier.x === frontX && barrier.y === frontY);
}

function beepers_present() {
  return beepers.some(beeper => beeper.x === karel.x && beeper.y === karel.y);
}

function beepers_in_bag() {
  return karel.beeperCount > 0;
}

function left_is_clear() {
  let leftX = karel.x;
  let leftY = karel.y;

  switch (karel.direction) {
    case "up":
      leftX -= 1;  // Oeste
      break;
    case "down":
      leftX += 1;  // Leste
      break;
    case "right":
      leftY -= 1;  // Norte
      break;
    case "left":
      leftY += 1;  // Sul
      break;
  }

  return !barriers.find(barrier => barrier.x === leftX && barrier.y === leftY);
}

function right_is_clear() {
  let rightX = karel.x;
  let rightY = karel.y;

  switch (karel.direction) {
    case "up":
      rightX += 1;  // Leste
      break;
    case "down":
      rightX -= 1;  // Oeste
      break;
    case "right":
      rightY += 1;  // Sul
      break;
    case "left":
      rightY -= 1;  // Norte
      break;
  }

  return !barriers.find(barrier => barrier.x === rightX && barrier.y === rightY);
}

function facing_north() {
  return karel.direction === "up";
}

function facing_south() {
  return karel.direction === "down";
}

function facing_east() {
  return karel.direction === "right";
}

function facing_west() {
  return karel.direction === "left";
}

function front_is_blocked() {
  return !front_is_clear();
}

function no_beepers_present() {
  return !beepers_present();
}

function no_beepers_in_bag() {
  return !beepers_in_bag();
}

function left_is_blocked() {
  return !left_is_clear();
}

function right_is_blocked() {
  return !right_is_clear();
}

function not_facing_north() {
  return !facing_north();
}

function not_facing_south() {
  return !facing_south();
}

function not_facing_east() {
  return !facing_east();
}

function not_facing_west() {
  return !facing_west();
}

function moveCameraUp() {
  camera.y = Math.max(camera.y - 1, 0);
  drawGrid();
}

function moveCameraDown() {
  camera.y = Math.min(camera.y + 1, totalGridSize - camera.height);
  drawGrid();
}

function moveCameraLeft() {
  camera.x = Math.max(camera.x - 1, 0);
  drawGrid();
}

function moveCameraRight() {
  camera.x = Math.min(camera.x + 1, totalGridSize - camera.width);
  drawGrid();
}

const codeEditor = document.getElementById("karelScript");
const lineNumbers = document.getElementById("line-numbers");

codeEditor.addEventListener('input', function() {
  codeEditor.scrollTop = codeEditor.scrollHeight; // Faz a scrollbar rolar até o final
});

// Inicializa os números de linha ao carregar a página
updateLineNumbers();

// Sincronizar a rolagem do `textarea` e dos números de linha
codeEditor.addEventListener("scroll", () => {
  lineNumbers.scrollTop = codeEditor.scrollTop;
});

// Atualiza os números de linha conforme o usuário digita
codeEditor.addEventListener("input", updateLineNumbers);

// Função para gerar números de linha dinâmicos
function updateLineNumbers() {
  // Calcula o número de linhas com base nas quebras de linha no textarea
  const lines = codeEditor.value.split("\n").length;
  let lineNumberContent = "";

  // Cria os spans com o número das linhas
  for (let i = 1; i <= lines; i++) {
    lineNumberContent += `<span>${i}</span>\n`;
  }
  
  lineNumbers.innerHTML = lineNumberContent;
}

// Permitir usar `Tab` para adicionar indentação de 2 espaços
codeEditor.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    e.preventDefault(); // Impede o comportamento padrão de tabulação
    const start = this.selectionStart;
    const end = this.selectionEnd;

    // Define a indentação para 2 espaços
    const indent = "  ";
    // Insere a indentação na posição do cursor
    codeEditor.value =
      codeEditor.value.substring(0, start) +
      indent +
      codeEditor.value.substring(end);

    // Move o cursor para depois da indentação
    this.selectionStart = this.selectionEnd = start + indent.length;

    // Atualizar os números de linha
    updateLineNumbers();
  }
});

drawGrid();
updateBeeperDisplay();
updateButtonText();
initializeGrid();
loadLevel(levels[currentLevelIndex]);

// Referências aos elementos
const openModalBtn = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModal');

// Abrir o modal quando o botão for clicado
openModalBtn.addEventListener('click', function() {
  modal.style.display = 'flex';
});

// Fechar o modal quando clicar no botão "X"
closeModalBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

// Fechar o modal quando clicar fora do conteúdo do modal
window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', function() {
    const codeBlock = this.nextElementSibling.querySelector('code').textContent.trim(); // Remove espaços extras
    navigator.clipboard.writeText(codeBlock).then(() => {
      alert('Código copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar: ', err);
    });
  });
});

canvas.addEventListener('mousedown', (event) => {
  // Verifica se o botão clicado foi o botão do meio (mouse wheel)
  if (event.button === 1) {
    const rect = canvas.getBoundingClientRect();

    // Pega as coordenadas relativas ao canvas (onde o clique ocorreu)
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Ajusta as coordenadas levando em consideração o zoom (cellSize) e a posição da câmera
    const x = Math.floor(clickX / cellSize + camera.x);
    const y = Math.floor(clickY / cellSize + camera.y);

    // Verifica se há um marcador na posição clicada
    const markerIndex = markers.findIndex(marker => marker.x === x && marker.y === y);

    // Se houver um marcador, remove-o
    if (markerIndex !== -1) {
      markers.splice(markerIndex, 1); // Remove o marcador da lista
    } else {
      // Caso contrário, adiciona a célula com marcador ao array
      markers.push({ x, y });
    }

    // Redesenha o grid com os marcadores
    drawGrid();
  }
});

const textarea = document.querySelector('.wrapper');
const toggleScriptButton = document.getElementById('toggleScriptButton');
textarea.style.margin = '0px';

toggleScriptButton.addEventListener('click', () => {
  if (textarea.classList.contains('hidden')) {
    textarea.classList.remove('hidden'); // Mostra a textarea
    toggleScriptButton.textContent = 'Hide Text Editor'; // Atualiza o texto do botão
    textarea.style.marginBottom = '25px';
    textarea.style.marginTop = '15px';
  } else {
    textarea.classList.add('hidden'); // Esconde a textarea
    textarea.style.margin = '0px';
    toggleScriptButton.textContent = 'Show Text Editor'; // Atualiza o texto do botão
  }
});

function updateCanvasSize(size) {
  canvas.width = size;
  canvas.height = size;
  cellSize = size / gridWidth; // Ajusta o tamanho da célula para caber no novo tamanho do canvas
  drawGrid(); // Redesenha a grid com o novo tamanho
}

// Adiciona o event listener para a mudança do tamanho do canvas
document.getElementById('canvasSizeSelector').addEventListener('change', function() {
  const newSize = parseInt(this.value); // Pega o valor selecionado (ex: 600, 500)
  updateCanvasSize(newSize);
});

const body = document.body;
const themeSelect = document.getElementById('themeSelect');

function changeTheme() {
  // Remover o tema atual
  body.classList.remove(themes[currentThemeIndex]);

  // Atualizar o índice do tema com base na seleção
  currentThemeIndex = themes.indexOf(themeSelect.value);

  // Aplicar o novo tema
  body.classList.add(themes[currentThemeIndex]);
  document.getElementById('karelCanvas').style.background = bgColors[themes[currentThemeIndex]];

  // Redesenhar a grid com a nova cor
  drawGrid();
}

// Inicializar a grid e o tema inicial
window.onload = () => {
  drawGrid(); // Desenhar a grid no carregamento da página
  themeSelect.value = themes[currentThemeIndex]; // Sincronizar o select com o tema atual
};

// Event listener para o select de tema
themeSelect.addEventListener('change', changeTheme);