const boardSize = 19;
let currentPlayer = 'black'; // Alterna entre 'black' e 'white'
const board = [];
let pieceNumber = 1;
let undoStack = [];
let redoStack = [];

// Posições dos pontos Hoshi no tabuleiro 19x19
const hoshiPoints = [
    { row: 3, col: 3 },
    { row: 3, col: 9 },
    { row: 3, col: 15 },
    { row: 9, col: 3 },
    { row: 9, col: 9 },
    { row: 9, col: 15 },
    { row: 15, col: 3 },
    { row: 15, col: 9 },
    { row: 15, col: 15 }
];

const letters = "ABCDEFGHJKLMNOPQRST".split(""); // Letras de A a T (pula I)

function initializeBoard() {
    const boardElement = document.getElementById('go-board');
    const boardWrapper = document.getElementById('go-board-wrapper');
    const spacing = parseInt(boardElement.offsetWidth / boardSize); // Espaçamento entre as linhas

    boardElement.innerHTML = '';
    // Limpa apenas os elementos com a classe 'coordinate'
    const coordinates = boardWrapper.querySelectorAll('.coordinate');
    coordinates.forEach(coord => coord.remove());

    // Cria as coordenadas horizontais (letras) e verticais (números)
    for (let i = 0; i < boardSize; i++) {
        // Coordenadas horizontais (letras)
        const letter = document.createElement('div');
        letter.classList.add('coordinate', 'horizontal');
        letter.textContent = letters[i];
        letter.style.left = `${i * spacing + 20}px`;
        boardWrapper.appendChild(letter);

        // Coordenadas verticais (números)
        const number = document.createElement('div');
        number.classList.add('coordinate', 'vertical');
        number.textContent = boardSize - i;
        number.style.top = `${i * spacing + 20}px`;
        boardWrapper.appendChild(number);
    }

    // Cria as linhas horizontais e verticais
    for (let i = 0; i < boardSize; i++) {
        // Linha horizontal
        const horizontalLine = document.createElement('div');
        horizontalLine.classList.add('line', 'horizontal');
        horizontalLine.style.top = `${i * spacing + 20}px`; // Ajuste de 20px para bordas
        boardElement.appendChild(horizontalLine);

        // Linha vertical
        const verticalLine = document.createElement('div');
        verticalLine.classList.add('line', 'vertical');
        verticalLine.style.left = `${i * spacing + 20}px`; // Ajuste de 20px para bordas
        boardElement.appendChild(verticalLine);
    }

    // Adiciona os pontos Hoshi nas interseções específicas
    hoshiPoints.forEach(point => {
        const hoshi = document.createElement('div');
        hoshi.classList.add('hoshi');
        hoshi.style.top = `${point.row * spacing + 20}px`;
        hoshi.style.left = `${point.col * spacing + 20}px`;
        boardElement.appendChild(hoshi);
    });

    // Cria interseções (onde as peças serão colocadas)
    for (let row = 0; row < boardSize; row++) {
        board[row] = [];
        for (let col = 0; col < boardSize; col++) {
            const intersection = document.createElement('div');
            intersection.classList.add('intersection');
            intersection.style.top = `${row * spacing + 20}px`;
            intersection.style.left = `${col * spacing + 20}px`;
            intersection.dataset.row = row;
            intersection.dataset.col = col;
            intersection.addEventListener('click', handleMove);
            intersection.addEventListener('mouseover', handleMouseOver);
            intersection.addEventListener('mouseout', handleMouseOut);
            boardElement.appendChild(intersection);
            board[row][col] = null; // Nenhuma pedra inicialmente
        }
    }
}

function redrawBoard() {
    const boardElement = document.getElementById('go-board');
    const boardWrapper = document.getElementById('go-board-wrapper');
    const spacing = parseInt(boardElement.offsetWidth / boardSize); // Espaçamento entre as linhas

    // Limpa as coordenadas (mas não as peças)
    const coordinates = boardWrapper.querySelectorAll('.coordinate');
    coordinates.forEach(coord => coord.remove());

    // Recria as coordenadas horizontais e verticais
    for (let i = 0; i < boardSize; i++) {
        // Coordenadas horizontais (letras)
        const letter = document.createElement('div');
        letter.classList.add('coordinate', 'horizontal');
        letter.textContent = letters[i];
        letter.style.left = `${i * spacing + 20}px`;
        boardWrapper.appendChild(letter);

        // Coordenadas verticais (números)
        const number = document.createElement('div');
        number.classList.add('coordinate', 'vertical');
        number.textContent = boardSize - i;
        number.style.top = `${i * spacing + 20}px`;
        boardWrapper.appendChild(number);
    }

    // Atualiza as posições das linhas sem limpar o tabuleiro
    const horizontalLines = boardElement.querySelectorAll('.line.horizontal');
    horizontalLines.forEach((line, i) => {
        line.style.top = `${i * spacing + 20}px`;
    });

    const verticalLines = boardElement.querySelectorAll('.line.vertical');
    verticalLines.forEach((line, i) => {
        line.style.left = `${i * spacing + 20}px`;
    });

    // Atualiza as posições dos pontos Hoshi
    const hoshiPointsElements = boardElement.querySelectorAll('.hoshi');
    hoshiPointsElements.forEach((hoshi, i) => {
        hoshi.style.top = `${hoshiPoints[i].row * spacing + 20}px`;
        hoshi.style.left = `${hoshiPoints[i].col * spacing + 20}px`;
    });

    // Atualiza as interseções (onde as peças são colocadas)
    const intersections = boardElement.querySelectorAll('.intersection');
    intersections.forEach(intersection => {
        const row = parseInt(intersection.dataset.row);
        const col = parseInt(intersection.dataset.col);
        intersection.style.top = `${row * spacing + 20}px`;
        intersection.style.left = `${col * spacing + 20}px`;
    });
}

function getLiberties(row, col, player, visited = new Set()) {
    const directions = [
        { row: -1, col: 0 }, // cima
        { row: 1, col: 0 },  // baixo
        { row: 0, col: -1 }, // esquerda
        { row: 0, col: 1 }   // direita
    ];

    const liberties = [];
    const group = [];
    const stack = [{ row, col }];

    while (stack.length > 0) {
        const { row, col } = stack.pop();
        const key = `${row},${col}`;

        // Se já visitamos esta posição, continue
        if (visited.has(key)) {
            continue;
        }

        visited.add(key);
        group.push({ row, col });

        // Verifica as 4 direções
        directions.forEach(direction => {
            const newRow = row + direction.row;
            const newCol = col + direction.col;

            // Verifica se está dentro do tabuleiro
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (board[newRow][newCol] === null) {
                    liberties.push({ row: newRow, col: newCol });
                } else if (board[newRow][newCol] === player && !visited.has(`${newRow},${newCol}`)) {
                    stack.push({ row: newRow, col: newCol });
                }
            }
        });
    }

    return { liberties, group };
}

function checkAndCapture(row, col, currentPlayer) {
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    const directions = [
        { row: -1, col: 0 }, // cima
        { row: 1, col: 0 },  // baixo
        { row: 0, col: -1 }, // esquerda
        { row: 0, col: 1 }   // direita
    ];

    let capturedPieces = []; // Acumula as peças capturadas

    directions.forEach(direction => {
        const newRow = parseInt(row) + direction.row;
        const newCol = parseInt(col) + direction.col;

        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            if (board[newRow][newCol] === opponent) {
                const { liberties, group } = getLiberties(newRow, newCol, opponent);

                // Se não houver liberdades, capturar o grupo
                if (liberties.length === 0) {
                    const capturedGroup = captureGroup(group); // Captura o grupo
                    capturedPieces = capturedPieces.concat(capturedGroup); // Adiciona as capturas ao array local
                }
            }
        }
    });

    return capturedPieces; // Retorna todas as peças capturadas
}

function restoreCapturedPieces(captured) {
    captured.forEach(({ row, col, player, number }) => {
        // Restaura visualmente a peça no tabuleiro
        const intersection = document.querySelector(`.intersection[data-row='${row}'][data-col='${col}']`);
        intersection.classList.add(player);
        intersection.textContent = number; // Ou use o número da peça se necessário
        intersection.style.opacity = '1';

        // Restaura a peça na matriz do tabuleiro
        board[row][col] = player;
    });
}

function captureGroup(group) {
    let capturedPieces = []; // Variável global para armazenar capturas
    // Adiciona as peças capturadas à lista global
    group.forEach(({ row, col }) => {
        // Obtém o estado da peça antes de removê-la
        const piece = board[row][col];

        // Remove visualmente a peça do tabuleiro
        const intersection = document.querySelector(`.intersection[data-row='${row}'][data-col='${col}']`);
        const turn = intersection.textContent;

        intersection.classList.remove('black', 'white');
        intersection.textContent = '';
        intersection.style.opacity = '0.5';

        // Remove a peça da matriz do tabuleiro
        board[row][col] = null;

        // Adiciona a peça capturada à lista de capturas
        if (piece !== null) {
            capturedPieces.push({ row, col, player: piece, number: turn });
        }
    });
    return capturedPieces;
}

function getAdjacentLiberties(row, col, player) {
    const directions = [
        { row: -1, col: 0 }, // cima
        { row: 1, col: 0 },  // baixo
        { row: 0, col: -1 }, // esquerda
        { row: 0, col: 1 }   // direita
    ];

    const visited = new Set(); // Para evitar visitar a mesma posição mais de uma vez
    let liberties = []; // Liberdades encontradas
    const allies = []; // Peças aliadas adjacentes que também precisam ser verificadas

    function exploreGroup(r, c) {
        const stack = [{ row: r, col: c }];
        let hasLiberties = false;

        while (stack.length > 0) {
            const { row: curRow, col: curCol } = stack.pop();

            if (visited.has(`${curRow},${curCol}`)) continue;
            visited.add(`${curRow},${curCol}`);

            directions.forEach(direction => {
                const newRow = curRow + direction.row;
                const newCol = curCol + direction.col;

                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    const adjacentPiece = board[newRow][newCol];

                    // Se há um espaço vazio, significa que o grupo tem liberdade
                    if (adjacentPiece === null) {
                        liberties.push({ row: newRow, col: newCol });
                        hasLiberties = true;
                    }
                    // Se a peça adjacente for aliada, exploramos o grupo aliado
                    else if (adjacentPiece === player && !visited.has(`${newRow},${newCol}`)) {
                        stack.push({ row: newRow, col: newCol });
                    }
                }
            });
        }

        return hasLiberties;
    }

    // Verifica as liberdades ao redor da posição onde queremos colocar a peça
    directions.forEach(direction => {
        const newRow = parseInt(row) + direction.row;
        const newCol = parseInt(col) + direction.col;

        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            const adjacentPiece = board[newRow][newCol];

            // Se o espaço estiver vazio, é uma liberdade direta
            if (adjacentPiece === null) {
                liberties.push({ row: newRow, col: newCol });
            }
            // Se a peça adjacente for aliada, verificamos o grupo aliado
            else if (adjacentPiece === player) {
                if (!visited.has(`${newRow},${newCol}`)) {
                    exploreGroup(newRow, newCol);
                }
            }
        }
    });

    liberties = liberties.filter(
        liberty => parseInt(liberty.row) !== parseInt(row) || parseInt(liberty.col) !== parseInt(col)
    );

    // Retorna as liberdades adjacentes (diretas e dos grupos aliados)
    return liberties;
}

function convertToGoNotation(row, col) {
    const columns = 'ABCDEFGHJKLMNOPQRST'; // Pode ajustar se necessário
    const letter = columns[col]; // Convertendo a coluna para a letra correspondente
    const number = boardSize - row; // Convertendo a linha para o número correspondente
    return `${letter}${number}`; // Retorna a notação padrão de Go
}

function handleMouseOver(event) {
    const intersection = event.target;
    const row = intersection.dataset.row;
    const col = intersection.dataset.col;

    document.getElementById('coordinates').innerHTML = `(${convertToGoNotation(row, col)})`;

    if (board[intersection.dataset.row][intersection.dataset.col] === null) {
        intersection.style.setProperty('--hover-color', currentPlayer === 'black' ? 'black' : 'white');
        intersection.style.opacity = '0.5';
    } else {
        intersection.style.setProperty('--hover-color', board[row][col]);
    }
}

function handleMouseOut(event) {
    const intersection = event.target;
    intersection.style.setProperty('--hover-color', 'transparent');
    if (intersection.classList.contains('intersection')) {
        document.getElementById('coordinates').innerHTML = '';
    }
}

function updateHover() {
    const intersections = document.querySelectorAll('.intersection');
    intersections.forEach(intersection => {
        const row = intersection.dataset.row;
        const col = intersection.dataset.col;

        if (board[row][col] === null) {
            intersection.style.setProperty('--hover-color', currentPlayer === 'black' ? 'black' : 'white');
        } else {
            intersection.style.setProperty('--hover-color', board[row][col]);
        }
    });
}

function getCapturedPieces(row, col, currentPlayer) {
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    const directions = [
        { row: -1, col: 0 }, // cima
        { row: 1, col: 0 },  // baixo
        { row: 0, col: -1 }, // esquerda
        { row: 0, col: 1 }   // direita
    ];

    let capturedPieces = [];
    const simulatedBoard = deepCopyBoard(board); // Faz uma cópia do tabuleiro

    // Simula a jogada
    simulatedBoard[row][col] = currentPlayer;

    directions.forEach(direction => {
        const newRow = parseInt(row) + direction.row;
        const newCol = parseInt(col) + direction.col;

        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            if (simulatedBoard[newRow][newCol] === opponent) {
                const { liberties, group } = getLibertiesSimulation(newRow, newCol, opponent, simulatedBoard);

                // Se não houver liberdades, capturar o grupo
                if (liberties.length === 0) {
                    const capturedGroup = getCaptureGroup(group, simulatedBoard); // Captura o grupo na simulação
                    capturedPieces = capturedPieces.concat(capturedGroup); // Adiciona as capturas ao array local
                }
            }
        }
    });

    return capturedPieces; // Retorna as peças capturadas sem modificar o tabuleiro original
}

function getCaptureGroup(group, simulatedBoard) {
    let capturedPieces = []; // Variável para armazenar capturas

    group.forEach(({ row, col }) => {
        const piece = simulatedBoard[row][col]; // Verifica o estado na cópia do tabuleiro
        simulatedBoard[row][col] = null; // Remove a peça da cópia do tabuleiro

        if (piece !== null) {
            capturedPieces.push({ row, col, player: piece });
        }
    });

    return capturedPieces; // Retorna as peças capturadas
}

function getLibertiesSimulation(row, col, player, board, visited = new Set()) {
    const directions = [
        { row: -1, col: 0 }, // cima
        { row: 1, col: 0 },  // baixo
        { row: 0, col: -1 }, // esquerda
        { row: 0, col: 1 }   // direita
    ];

    const liberties = [];
    const group = [];
    const stack = [{ row, col }];

    while (stack.length > 0) {
        const { row, col } = stack.pop();
        const key = `${row},${col}`;

        if (visited.has(key)) {
            continue;
        }

        visited.add(key);
        group.push({ row, col });

        directions.forEach(direction => {
            const newRow = row + direction.row;
            const newCol = col + direction.col;

            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (board[newRow][newCol] === null) {
                    liberties.push({ row: newRow, col: newCol });
                } else if (board[newRow][newCol] === player && !visited.has(`${newRow},${newCol}`)) {
                    stack.push({ row: newRow, col: newCol });
                }
            }
        });
    }

    return { liberties, group }; // Retorna as liberdades e o grupo
}

function deepCopyBoard(board) {
    return board.map(row => [...row]); // Cria uma cópia profunda do tabuleiro
}

function handleMove(event) {
    const intersection = event.target;
    const row = intersection.dataset.row;
    const col = intersection.dataset.col;
    let liberties = getAdjacentLiberties(row, col, currentPlayer);
    const capturedPiecesCheck = getCapturedPieces(row, col, currentPlayer);

    // Verifica se a interseção já está ocupada
    if (board[row][col] !== null) {
        alert('Este local já está ocupado!');
        return;
    }

    if (liberties.length === 0 && capturedPiecesCheck.length === 0) {
        alert('Não há liberdade neste local!');
        return;                
    }

    // Limpa a pilha de refazer, já que um novo movimento invalida as ações que poderiam ser refeitas
    redoStack = [];

    // Coloca a pedra
    intersection.classList.add(currentPlayer);
    intersection.textContent = pieceNumber;
    intersection.style.opacity = '1';

    // Atualiza o estado do tabuleiro
    board[row][col] = currentPlayer;

    if (currentPlayer === 'black') {
        intersection.style.color = 'white';
    } else {
        intersection.style.color = 'black';
    }

    // Verifica se há capturas
    const capturedPieces = checkAndCapture(row, col, currentPlayer);

    // Salva o estado atual na pilha de desfazer
    undoStack.push({ row, col, player: currentPlayer, number: pieceNumber, captured: capturedPieces });
    pieceNumber++;

    // Alterna o jogador
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

function passTurn() {
    // Alterna o jogador
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    updateHover();
    // Salva o estado na pilha de desfazer, mesmo que nenhum movimento tenha sido feito
    undoStack.push({ row: null, col: null, player: currentPlayer, number: pieceNumber, captured: [] });
}

function undoMove() {
    if (undoStack.length === 0) {
        alert('Nada para desfazer!');
        return;
    }

    // Remove o último movimento da pilha de desfazer
    const lastMove = undoStack.pop();
    const { row, col, player, number, captured } = lastMove;

    // Move o último movimento para a pilha de refazer
    redoStack.push(lastMove);

    // Remove a peça do tabuleiro
    if (row && col) {
        const intersection = document.querySelector(`.intersection[data-row='${row}'][data-col='${col}']`);
        intersection.classList.remove(player);
        intersection.textContent = '';
        intersection.style.opacity = '0.5';     
        // Atualiza o estado do tabuleiro
        board[row][col] = null;
        pieceNumber--;
    }

    if (captured) {
        restoreCapturedPieces(captured);
    }

    // Volta o turno para o jogador anterior
    currentPlayer = player;
    updateHover();
}

function redoMove() {
    if (redoStack.length === 0) {
        alert('Nada para refazer!');
        return;
    }

    // Remove o último movimento da pilha de refazer
    const lastMove = redoStack.pop();
    const { row, col, player, number } = lastMove;

    // Move o movimento de volta para a pilha de desfazer
    undoStack.push(lastMove);

    // Coloca a peça de volta no tabuleiro
    const intersection = document.querySelector(`.intersection[data-row='${row}'][data-col='${col}']`);
    intersection.classList.add(player);
    intersection.textContent = number;
    intersection.style.opacity = '1';

    // Atualiza o estado do tabuleiro
    board[row][col] = player;

    checkAndCapture(row, col, currentPlayer);

    pieceNumber++;

    // Alterna o jogador
    currentPlayer = player === 'black' ? 'white' : 'black';
    updateHover();
}

function exportBoardAsCSV() {
    // Inicializa uma variável para armazenar o CSV
    let csvContent = "";

    // Itera sobre as linhas do tabuleiro
    for (let row = 0; row < boardSize; row++) {
        let rowContent = [];

        // Itera sobre as colunas da linha atual
        for (let col = 0; col < boardSize; col++) {
            const piece = board[row][col];  // Pode ser 'black', 'white' ou null
            if (piece === 'black') {
                rowContent.push('⚫');  // B para peças pretas
            } else if (piece === 'white') {
                rowContent.push('⚪');  // W para peças brancas
            } else {
                rowContent.push('⛔');   // Vazio para posições sem peça
            }
        }

        // Junta os valores da linha com vírgulas e adiciona ao conteúdo CSV
        csvContent += rowContent.join(",") + "\n";
    }

    // Cria um Blob com o conteúdo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Cria um link de download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "go_board.csv");

    // Simula um clique para baixar o arquivo
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('keydown', function(event) {
    // Verifica se a tecla Ctrl está pressionada
    if (event.ctrlKey) {
        if (event.key === 'z' || event.key === 'Z') {
            event.preventDefault();  // Evita o comportamento padrão do navegador
            undoMove();
        }
        else if (event.key === 'y' || event.key === 'Y') {
            event.preventDefault();  // Evita o comportamento padrão do navegador
            redoMove();
        }
        else if (event.key === 'p' || event.key === 'p') {
            event.preventDefault();  // Evita o comportamento padrão do navegador
            passTurn();
        }
        else if (event.key === 'u') {
            event.preventDefault();  // Evita o comportamento padrão do navegador
            scale += 0.1; // Aumenta a escala em 10%
            updateBoardScale();
        }
        else if (event.key === 'd') {
            event.preventDefault();  // Evita o comportamento padrão do navegador
            scale = Math.max(0.5, scale - 0.1); // Diminui a escala em 10%, com limite mínimo de 0.5
            updateBoardScale();
        }
        else if (event.key === 'r') {
            event.preventDefault();  // Evita o comportamento padrão do navegador
            initializeBoard();
        }
        else if (event.key === 'e') {
            event.preventDefault();  // Evita o comportamento padrão do navegador
            exportBoardAsCSV();
        }
    }
});

let scale = 1; // Escala inicial do tabuleiro

// Função para atualizar a escala do tabuleiro
function updateBoardScale() {
    const boardWrapper = document.getElementById('go-board-wrapper');
    boardWrapper.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', () => {
    redrawBoard();
});

initializeBoard();