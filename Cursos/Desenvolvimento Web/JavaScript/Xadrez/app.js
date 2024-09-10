const chessboard = document.getElementById('chessboard');
const whiteCapturedDiv = document.getElementById('white-captured');
const blackCapturedDiv = document.getElementById('black-captured');

const stopAIBtn = document.getElementById('stopAI');
const startAIBtn = document.getElementById('startAI');
const undoBtn = document.getElementById('undoMove');
const redoBtn = document.getElementById('redoMove');

document.getElementById('exportButton').addEventListener('click', exportBoardToCSV);
document.getElementById('resetButton').addEventListener('click', resetBoard);
undoBtn.addEventListener('click', undoMove);
redoBtn.addEventListener('click', redoMove);
startAIBtn.addEventListener('click', startAI);
stopAIBtn.addEventListener('click', stopAI); 

let aiIntervalId;
let loadingIntervalId;
const loadingBar = document.getElementById('loading-bar');
const loadingContainer = document.getElementById('loading-container');

function startAI() {
    startAIBtn.disabled = true;
    stopAIBtn.disabled = false;
    redoBtn.disabled = true;
    undoBtn.disabled = true;

    resetLoadingBar();
    updateLoadingBar();
    
    // Mostrar a barra de carregamento
    loadingContainer.style.display = 'block';

    // Defina o intervalo para chamar aiMove a cada X milissegundos (por exemplo, 3000 ms = 3 segundos)
    aiIntervalId = setInterval(() => {
        aiMove();
        resetLoadingBar();
        updateLoadingBar();
    }, 3000); // Ajuste o intervalo conforme necessário
}

function stopAI() {
    // Limpa o intervalo para parar a IA
    if (aiIntervalId) {
        clearInterval(aiIntervalId);
        aiIntervalId = null;
    }
    // Limpa o intervalo da barra de carregamento
    if (loadingIntervalId) {
        clearInterval(loadingIntervalId);
        loadingIntervalId = null;
    }
    startAIBtn.disabled = false;
    stopAIBtn.disabled = true;
    redoBtn.disabled = false;
    undoBtn.disabled = false;
    resetLoadingBar();
    loadingContainer.style.display = 'none';
}

function updateLoadingBar() {
    let width = 0;
    loadingIntervalId = setInterval(() => {
        if (width >= 100) {
            clearInterval(loadingIntervalId);
            loadingBar.style.width = '100%';
        } else {
            width += 10; // Aumente o valor conforme necessário
            loadingBar.style.width = width + '%';
        }
    }, 300); // Ajuste o intervalo conforme necessário
}

function resetLoadingBar() {
    if (loadingIntervalId) {
        clearInterval(loadingIntervalId);
        loadingIntervalId = null;
    }
    loadingBar.style.width = '0%';
}

function aiMove() {
    let allMoves = [];
    let captureMoves = [];
    let otherMoves = [];

    // Percorre todo o tabuleiro para encontrar todas as peças da cor atual
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let piece = initialBoard[row][col];
            if ((turn === 'White' && piece === piece.toUpperCase()) || 
                (turn === 'Black' && piece === piece.toLowerCase())) {
                highlightMoves(row, col, piece); // Gera os movimentos válidos para a peça
                validMoves.forEach(move => {
                    let moveDetail = { from: { row, col }, to: move };
                    if (move.type === 'capture') {
                        captureMoves.push(moveDetail);
                    } else {
                        otherMoves.push(moveDetail);
                    }
                });
            }
        }
    }

    // Prioriza movimentos de captura
    let moveList = captureMoves.length > 0 ? captureMoves : otherMoves;

    if (moveList.length > 0) {
        let randomMove = moveList[Math.floor(Math.random() * moveList.length)];

        // Executa o movimento
        movePiece(randomMove.from.row, randomMove.from.col, randomMove.to.row, randomMove.to.col);
        saveState();
    }
}

function exportBoardToCSV() {
    // Supondo que `initialBoard` seja a representação do tabuleiro (8x8 array)
    let csvContent = "data:text/csv;charset=utf-8,";

    initialBoard.forEach(row => {
        const rowContent = row.map(cell => piecesText[cell] || '').join(',');
        csvContent += rowContent + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "chessboard.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
}

function resetBoard() {
    // Criar uma nova matriz do tabuleiro
    const newBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    // Copiar o novo tabuleiro para o estado atual
    for (let i = 0; i < initialBoard.length; i++) {
        for (let j = 0; j < initialBoard[i].length; j++) {
            initialBoard[i][j] = newBoard[i][j];
        }
    }

    // Restaurar variáveis de controle
    moveHistory = [];
    redoHistory = [];
    turn = 'White'; // ou 'Black', conforme a configuração desejada
    document.getElementById('turn').textContent = turn;
    document.getElementById('black-captured').innerHTML = '';
    document.getElementById('white-captured').innerHTML = '';
    selectedPiece = null;
    validMoves = [];
    enPassantTarget = null;
    hasMoved = {
        'K': false,
        'k': false,
        'R': { '0': false, '7': false },
        'r': { '0': false, '7': false }
    };

    loadingContainer.style.display = 'none';
    loadingBar.style.width = '0%';
    stopAI();

    startAIBtn.disabled = false;    

    // Atualizar a interface do usuário
    createBoardFromImage();
    clearSelection();
}

const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const piecesText = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

const pieces = {
    'r': 'images/black-rook.png',
    'n': 'images/black-knight.png',
    'b': 'images/black-bishop.png',
    'q': 'images/black-queen.png',
    'k': 'images/black-king.png',
    'p': 'images/black-pawn.png',
    'R': 'images/white-rook.png',
    'N': 'images/white-knight.png',
    'B': 'images/white-bishop.png',
    'Q': 'images/white-queen.png',
    'K': 'images/white-king.png',
    'P': 'images/white-pawn.png'
};

const promotedPiece = {
    'Q': { 'White': 'Q', 'Black': 'q' },
    'R': { 'White': 'R', 'Black': 'r' },
    'B': { 'White': 'B', 'Black': 'b' },
    'N': { 'White': 'N', 'Black': 'n' }
};

let selectedPiece = null;
let validMoves = [];
let turn = 'White';
let enPassantTarget = null;
let previouslySelectedCell = null;
let moveHistory = [];
let redoStack = [];

let hasMoved = {
    'K': false, 'Q': false, // Reais para Brancas
    'k': false, 'q': false, // Reais para Pretas
    'r': { '0': false, '7': false }, // Torres para Brancas (0 = A1, 7 = H1)
    'R': { '0': false, '7': false }  // Torres para Pretas (0 = A8, 7 = H8)
};

function saveState() {
    const boardClone = initialBoard.map(row => row.slice());
    const state = {
        board: boardClone,
        selectedPiece: { ...selectedPiece },
        turn: turn,
        whiteCapturedPieces: [...document.querySelectorAll('#white-captured img')].map(img => img.src),
        blackCapturedPieces: [...document.querySelectorAll('#black-captured img')].map(img => img.src),
        hasMoved: JSON.parse(JSON.stringify(hasMoved)), // Clonando o estado de hasMoved
    };
    moveHistory.push(state);
    redoStack = [];
}

function undoMove() {
    if (moveHistory.length > 0) {
        const lastState = moveHistory.pop();
        redoStack.push({
            board: initialBoard.map(row => row.slice()),
            selectedPiece: selectedPiece,
            turn: turn,
            whiteCapturedPieces: [...document.querySelectorAll('#white-captured img')].map(img => img.src),
            blackCapturedPieces: [...document.querySelectorAll('#black-captured img')].map(img => img.src),
            hasMoved: JSON.parse(JSON.stringify(hasMoved)), // Clonando o estado de hasMoved
        });

        // Restaure o estado do tabuleiro e outras variáveis
        for (let i = 0; i < initialBoard.length; i++) {
            for (let j = 0; j < initialBoard[i].length; j++) {
                initialBoard[i][j] = lastState.board[i][j];
            }
        }
        selectedPiece = lastState.selectedPiece;
        turn = lastState.turn;
        document.getElementById('turn').textContent = turn;

        // Restaure as peças capturadas
        const lastLastState = moveHistory.slice().pop();
        
        if (lastLastState) {
            hasMoved = JSON.parse(JSON.stringify(lastLastState.hasMoved)); // Restaure hasMoved
            restoreCapturedPieces(lastLastState.whiteCapturedPieces, lastLastState.blackCapturedPieces);
        }

        // Atualize a interface do usuário
        createBoardFromImage();
        clearHighlights();
        clearSelection();
    }
}

function redoMove() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        moveHistory.push({
            board: initialBoard.map(row => row.slice()),
            selectedPiece: selectedPiece,
            turn: turn,
            whiteCapturedPieces: [...document.querySelectorAll('#white-captured img')].map(img => img.src),
            blackCapturedPieces: [...document.querySelectorAll('#black-captured img')].map(img => img.src),
            hasMoved: JSON.parse(JSON.stringify(hasMoved)), // Clonando o estado de hasMoved
        });

        // Restaure o estado do tabuleiro e outras variáveis
        for (let i = 0; i < initialBoard.length; i++) {
            for (let j = 0; j < initialBoard[i].length; j++) {
                initialBoard[i][j] = nextState.board[i][j];
            }
        }
        selectedPiece = nextState.selectedPiece;
        turn = nextState.turn;
        hasMoved = JSON.parse(JSON.stringify(nextState.hasMoved)); // Restaure hasMoved
        document.getElementById('turn').textContent = turn;

        // Restaure as peças capturadas
        restoreCapturedPieces(nextState.whiteCapturedPieces, nextState.blackCapturedPieces);

        // Atualize a interface do usuário
        createBoardFromImage();
        clearHighlights();
        clearSelection();
    }
}

function restoreCapturedPieces(whiteCapturedPieces, blackCapturedPieces) {
    const whiteCapturedDiv = document.getElementById('white-captured');
    const blackCapturedDiv = document.getElementById('black-captured');

    // Limpe as áreas de peças capturadas
    whiteCapturedDiv.innerHTML = '';
    blackCapturedDiv.innerHTML = '';

    // Restaure as peças capturadas para os jogadores correspondentes
    whiteCapturedPieces.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('captured-piece');
        whiteCapturedDiv.appendChild(img);
    });

    blackCapturedPieces.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('captured-piece');
        blackCapturedDiv.appendChild(img);
    });
}

function createBoardFromText() {
    chessboard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', (row + col) % 2 === 0 ? 'white' : 'black');
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            cell.textContent = piecesText[initialBoard[row][col]];
            cell.addEventListener('click', () => handleCellClick(row, col));
            chessboard.appendChild(cell);
        }
    }
}

function createBoardFromImage() {
    chessboard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', (row + col) % 2 === 0 ? 'white' : 'black');
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);

            // Adiciona as coordenadas como rótulos
            if (col === 0) {
                const rowLabel = document.createElement('div');
                rowLabel.classList.add('label', 'row-label');
                rowLabel.textContent = 8 - row;
                cell.appendChild(rowLabel);
            }

            if (row === 7) {
                const colLabel = document.createElement('div');
                colLabel.classList.add('label', 'col-label');
                colLabel.textContent = String.fromCharCode(97 + col).toUpperCase();
                cell.appendChild(colLabel);
            }

            // Se a célula tiver uma peça, adicione uma imagem
            if (initialBoard[row][col] !== '') {
                const piece = document.createElement('img');
                piece.src = pieces[initialBoard[row][col]];
                piece.classList.add('piece');
                cell.appendChild(piece);

                // Adiciona evento de clique à peça
                piece.addEventListener('click', (event) => {
                    event.stopPropagation(); // Previne que o clique na peça acione o clique da célula
                    handleCellClick(row, col);
                    selectPiece(row, col);
                });
            }

            // Adiciona evento de clique à célula
            cell.addEventListener('click', () => handleCellClick(row, col));
            chessboard.appendChild(cell);
        }
    }
}

function selectPiece(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const pieceImg = cell.querySelector('.piece'); // Seleciona o <img> da peça

    // Remove a seleção da célula anteriormente selecionada
    if (previouslySelectedCell) {
        previouslySelectedCell.classList.remove('selected');
    }

    // Verifique se a célula tem uma peça e se a peça pertence à cor do turno atual
    if (pieceImg) {
        const pieceColor = pieceImg.src.includes('white') ? 'White' : 'Black'; // Determina a cor da peça

        if (pieceColor === turn) {
            cell.classList.add('selected'); // Adiciona a classe 'selected' se a peça for da cor do turno atual
            previouslySelectedCell = cell;
        }
    }
}

function clearPieceHighlight() {
    if (previouslySelectedCell) {
        previouslySelectedCell.classList.remove('selected');
        previouslySelectedCell = null;
    }
}

function handleCellClick(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const piece = initialBoard[row][col];
    const isPlayerPiece = (turn === 'White' && piece === piece.toUpperCase()) || 
                          (turn === 'Black' && piece === piece.toLowerCase());

    if (selectedPiece) {
        if (isCastlingMove(selectedPiece.row, selectedPiece.col, row, col)) {
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            saveState();
        }
        // Verifique se é um movimento válido de en passant
        else if (validMoves.some(move => move.row === row && move.col === col && move.type === 'enpassant')) {
            clearHighlights();
            performEnPassant(selectedPiece.row, selectedPiece.col, row, col);
            saveState();
        }
        else if (validMoves.some(move => move.row === row && move.col === col)) {
            clearHighlights();
            clearKingInCheckHighlight();
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            saveState();
            // switchTurn();
        } else {
            clearSelection();
            clearPieceHighlight();
            if (piece !== '' && isPlayerPiece) {
                selectedPiece = { row, col, piece };
                highlightMoves(row, col, piece);
                highlightCastlingMoves(row, col, piece);
                highlightEnPassantMoves(row, col, piece); // Adicione esta linha
            }
        }
    } else if (piece !== '' && isPlayerPiece) {
        selectedPiece = { row, col, piece };
        highlightMoves(row, col, piece);
        highlightCastlingMoves(row, col, piece);
        highlightEnPassantMoves(row, col, piece); // Adicione esta linha
    } else {
        clearSelection();
        clearPieceHighlight();
    }
}

function isCastlingMove(fromRow, fromCol, toRow, toCol) {
    const piece = initialBoard[fromRow][fromCol];
    
    if (piece.toUpperCase() === 'K') { // Verifica tanto para o rei branco quanto para o preto
        if (fromRow === toRow) {  // O movimento deve estar na mesma linha
            if (fromCol === 4) { // O rei começa na coluna 4 (e4 para branco, e8 para preto)
                
                // Verifique o castling para o rei branco
                if (piece === 'K') {
                    if (toCol === 6) { // Pequeno castling branco
                        return !hasMoved['K'] && !hasMoved['R'][7] && isPathClear(fromRow, fromCol, toRow, toCol);
                    } else if (toCol === 2) { // Grande castling branco
                        return !hasMoved['K'] && !hasMoved['R'][0] && isPathClear(fromRow, fromCol, toRow, toCol);
                    }
                }
                
                // Verifique o castling para o rei preto
                if (piece === 'k') {
                    if (toCol === 6) { // Pequeno castling preto
                        return !hasMoved['k'] && !hasMoved['r'][7] && isPathClear(fromRow, fromCol, toRow, toCol);
                    } else if (toCol === 2) { // Grande castling preto
                        return !hasMoved['k'] && !hasMoved['r'][0] && isPathClear(fromRow, fromCol, toRow, toCol);
                    }
                }
            }
        }
    }
    return false;
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
    if (toCol === 6) { // Pequeno castling
        // Verificar se as colunas entre o rei e a torre estão vazias
        return initialBoard[fromRow][5] === '' && initialBoard[fromRow][6] === '';
    } else if (toCol === 2) { // Grande castling
        // Verificar se as colunas entre o rei e a torre estão vazias
        return initialBoard[fromRow][1] === '' && initialBoard[fromRow][2] === '' && initialBoard[fromRow][3] === '';
    }
    return false;
}

function switchTurn() {
    turnIndicator = document.getElementById('turn');
    turn = (turn === 'White') ? 'Black' : 'White';
    turnIndicator.textContent = turn;
}

function highlightMoves(row, col, piece) {
    validMoves = [];
    const lowerPiece = piece.toLowerCase();
    if (lowerPiece === 'p') {
        highlightPawnMoves(row, col, piece);
    } else if (lowerPiece === 'r') {
        highlightRookMoves(row, col);
    } else if (lowerPiece === 'n') {
        highlightKnightMoves(row, col);
    } else if (lowerPiece === 'b') {
        highlightBishopMoves(row, col);
    } else if (lowerPiece === 'q') {
        highlightQueenMoves(row, col);
    } else if (lowerPiece === 'k') {
        highlightKingMoves(row, col);
    }

    validMoves = validMoves.filter(move => !wouldLeaveKingInCheck(row, col, move.row, move.col, piece));
}

function wouldLeaveKingInCheck(fromRow, fromCol, toRow, toCol, piece) {
    // Crie uma cópia do tabuleiro
    const boardCopy = JSON.parse(JSON.stringify(initialBoard));
    
    // Simule o movimento
    boardCopy[toRow][toCol] = piece;
    boardCopy[fromRow][fromCol] = '';
    
    // Encontre a posição do rei após o movimento
    const kingPosition = findKingPosition(boardCopy, turn);
    
    // Verifique se o rei estaria em cheque após o movimento
    const opponentColor = turn === 'White' ? 'Black' : 'White';
    
    return isKingInCheck(boardCopy, kingPosition, opponentColor);
}

function highlightKingInCheck(kingPosition) {
    const kingCell = document.querySelector(`[data-row="${kingPosition.row}"][data-col="${kingPosition.col}"]`);
    kingCell.classList.add('king-in-check');
}

function clearKingInCheckHighlight() {
    const kingInCheckCell = document.querySelector('.king-in-check');
    if (kingInCheckCell) {
        kingInCheckCell.classList.remove('king-in-check');
    }
}

function highlightEnPassantMoves(row, col, piece) {
    if (piece.toLowerCase() !== 'p') return; // Certifique-se de que é um peão

    if (turn === 'White' && row === 3) {
        if (isInBounds(row, col - 1) && initialBoard[row][col - 1] === 'p' && enPassantTarget && enPassantTarget.row === row && enPassantTarget.col === col - 1) {
            highlightCell(row - 1, col - 1, 'enpassant');
        }
        if (isInBounds(row, col + 1) && initialBoard[row][col + 1] === 'p' && enPassantTarget && enPassantTarget.row === row && enPassantTarget.col === col + 1) {
            highlightCell(row - 1, col + 1, 'enpassant');
        }
    } else if (turn === 'Black' && row === 4) {
        if (isInBounds(row, col - 1) && initialBoard[row][col - 1] === 'P' && enPassantTarget && enPassantTarget.row === row && enPassantTarget.col === col - 1) {
            highlightCell(row + 1, col - 1, 'enpassant');
        }
        if (isInBounds(row, col + 1) && initialBoard[row][col + 1] === 'P' && enPassantTarget && enPassantTarget.row === row && enPassantTarget.col === col + 1) {
            highlightCell(row + 1, col + 1, 'enpassant');
        }
    }
}

function highlightCastlingMoves(row, col, piece) {
    const isKing = piece.toUpperCase() === 'K';
    const isWhite = turn === 'White';
    const hasMovedKing = isKing && (isWhite ? hasMoved['K'] : hasMoved['k']);
    const kingStartCol = 4;
    const smallCastlingTargetCol = 6;
    const largeCastlingTargetCol = 2;
    const rookStartCols = [0, 7];
    const rookTargetCol = 4;

    if (isKing) {
        highlightKingCastlingMoves(row, col, hasMovedKing, smallCastlingTargetCol, largeCastlingTargetCol);
    } else if (piece.toUpperCase() === 'R') {
        highlightRookCastlingMoves(row, col, hasMovedKing, rookStartCols, rookTargetCol);
    }
}

function highlightKingCastlingMoves(row, col, hasMovedKing, smallCastlingTargetCol, largeCastlingTargetCol) {
    if (!hasMovedKing) {
        // Verifica e destaca as opções de castling para o rei
        if (col === 4) {
            if (!hasMoved['R'][smallCastlingTargetCol] && isPathClear(row, col, row, smallCastlingTargetCol)) {
                highlightCell(row, smallCastlingTargetCol, 'castling');
            }
            if (!hasMoved['R'][largeCastlingTargetCol] && isPathClear(row, col, row, largeCastlingTargetCol)) {
                highlightCell(row, largeCastlingTargetCol, 'castling');
            }
        }
    }
}

function highlightRookCastlingMoves(row, col, hasMovedKing, rookStartCols, rookTargetCol) {
    // Verifica e destaca as opções de castling para a torre
    if (!hasMovedKing) {
        if (rookStartCols.includes(col)) {
            if (isPathClear(row, col, row, rookTargetCol)) {
                highlightCell(row, rookTargetCol, 'castling');
            }
        }
    }
}

function highlightCaptureMoves(row, col, rowDirection, colDirection) {
    const newRow = row + rowDirection;
    const newCol = col + colDirection;

    if (isInBounds(newRow, newCol)) {
        const targetPiece = initialBoard[newRow][newCol];
        if (targetPiece !== '' && (turn === 'White' && targetPiece === targetPiece.toLowerCase() ||
            turn === 'Black' && targetPiece === targetPiece.toUpperCase())) {
            highlightCell(newRow, newCol, 'capture');
        }
    }
}

function highlightPawnMoves(row, col, piece) {
    const direction = piece === 'P' ? -1 : 1;
    const startRow = piece === 'P' ? 6 : 1;
    const nextRow = row + direction;

    if (isInBounds(nextRow, col) && initialBoard[nextRow][col] === '') {
        highlightCell(nextRow, col);

        if (row === startRow && isInBounds(nextRow + direction, col) && initialBoard[nextRow + direction][col] === '') {
            highlightCell(nextRow + direction, col);
        }
    }

    // Capture moves
    highlightCaptureMoves(row, col, direction, 1);
    highlightCaptureMoves(row, col, direction, -1);
}

function highlightRookMoves(row, col) {
    highlightLineMoves(row, col, 1, 0);  // Vertical
    highlightLineMoves(row, col, -1, 0);
    highlightLineMoves(row, col, 0, 1);  // Horizontal
    highlightLineMoves(row, col, 0, -1);
}

function highlightBishopMoves(row, col) {
    highlightLineMoves(row, col, 1, 1);  // Diagonal down-right
    highlightLineMoves(row, col, -1, -1); // Diagonal up-left
    highlightLineMoves(row, col, 1, -1);  // Diagonal down-left
    highlightLineMoves(row, col, -1, 1);  // Diagonal up-right
}

function highlightQueenMoves(row, col) {
    highlightRookMoves(row, col);
    highlightBishopMoves(row, col);
}

function highlightKingMoves(row, col) {
    highlightSingleStepMoves(row, col, 1, 0);  // Vertical
    highlightSingleStepMoves(row, col, -1, 0);
    highlightSingleStepMoves(row, col, 0, 1);  // Horizontal
    highlightSingleStepMoves(row, col, 0, -1);
    highlightSingleStepMoves(row, col, 1, 1);  // Diagonal
    highlightSingleStepMoves(row, col, -1, -1);
    highlightSingleStepMoves(row, col, 1, -1);
    highlightSingleStepMoves(row, col, -1, 1);
}

function highlightKnightMoves(row, col) {
    const knightMoves = [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];
    knightMoves.forEach(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isInBounds(newRow, newCol)) {
            const targetPiece = initialBoard[newRow][newCol];
            if (targetPiece === '') {
                highlightCell(newRow, newCol);
            } else if ((turn === 'White' && targetPiece === targetPiece.toLowerCase()) ||
                       (turn === 'Black' && targetPiece === targetPiece.toUpperCase())) {
                highlightCell(newRow, newCol, 'capture');
            }
        }
    });
}

function highlightLineMoves(row, col, rowIncrement, colIncrement) {
    let newRow = row + rowIncrement;
    let newCol = col + colIncrement;
    while (isInBounds(newRow, newCol)) {
        const targetPiece = initialBoard[newRow][newCol];
        if (targetPiece === '') {
            highlightCell(newRow, newCol);
        } else {
            if ((turn === 'White' && targetPiece === targetPiece.toLowerCase()) ||
                (turn === 'Black' && targetPiece === targetPiece.toUpperCase())) {
                highlightCell(newRow, newCol, 'capture');
            }
            break; // Stop if we hit any piece
        }
        newRow += rowIncrement;
        newCol += colIncrement;
    }
}

function highlightSingleStepMoves(row, col, rowIncrement, colIncrement) {
    const newRow = row + rowIncrement;
    const newCol = col + colIncrement;
    if (isInBounds(newRow, newCol)) {
        const targetPiece = initialBoard[newRow][newCol];
        if (targetPiece === '') {
            highlightCell(newRow, newCol);
        } else if ((turn === 'White' && targetPiece === targetPiece.toLowerCase()) ||
                   (turn === 'Black' && targetPiece === targetPiece.toUpperCase())) {
            highlightCell(newRow, newCol, 'capture');
        }
    }
}

function highlightCell(row, col, type) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        const highlight = document.createElement('div');
        highlight.classList.add('highlight');
        if (type === 'capture') {
            highlight.classList.add('capture');
        }
        if (type === 'enpassant') {
            highlight.classList.add('enpassant');
        }
        if (type === 'castling') {
            highlight.classList.add('castling');
        }
        cell.appendChild(highlight);
        validMoves.push({ row, col, type });
    }
}

function clearHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => highlight.remove());
}

function clearSelection() {
    selectedPiece = null;
    clearHighlights();
}

function disableCellSelection() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.add('disabled'));
}

function enableCellSelection() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('disabled'));
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = initialBoard[fromRow][fromCol];
    const targetPiece = initialBoard[toRow][toCol];

    const pieceElement = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"] img`);
    const cellSize = document.querySelector('.cell').offsetWidth;

    // Calcule a distância em pixels que a peça deve se mover
    const deltaX = (toCol - fromCol) * cellSize;
    const deltaY = (toRow - fromRow) * cellSize;

    disableCellSelection();
    clearPieceHighlight();

    // Aplique a transformação de transição
    pieceElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Lógica de en passant
    if (piece.toLowerCase() === 'p' && Math.abs(fromRow - toRow) === 2) {
        enPassantTarget = { row: toRow, col: fromCol };
    } else {
        enPassantTarget = null;
    }

    if (targetPiece !== '') {
        capturePieceImage(targetPiece);
    }

    if (piece === 'K') {
        hasMoved['K'] = true;
        // Verifique se o movimento é um castling
        if (fromCol === 4 && (toCol === 6 || toCol === 2)) {
            performCastling(fromRow, fromCol, toRow, toCol);
        }
    }

    if (piece === 'k') { // Rei preto
        hasMoved['k'] = true;
        // Verifique se o movimento é um castling
        if (fromCol === 4 && (toCol === 6 || toCol === 2)) {
            performCastling(fromRow, fromCol, toRow, toCol);
        }
    }

    if (piece === 'R') {
        const rookColumn = fromCol < toCol ? '7' : '0';
        hasMoved[piece][rookColumn] = true;
    }

    if (piece === 'r') { // Torres pretas
        const rookColumn = fromCol < toCol ? '7' : '0';
        hasMoved[piece][rookColumn] = true;
    }

    // Verifique se o peão foi promovido
    const isPawnPromoted = (piece === 'P' && toRow === 0) || (piece === 'p' && toRow === 7);
    if (isPawnPromoted) {
        promotePawn(toRow, toCol);
    } else {
        clearSelection();
    }

    // Após a transição, mova a peça no tabuleiro
    setTimeout(() => {
        // Restaure a posição inicial (sem transformação)
        pieceElement.style.transform = '';

        // Remova a peça da célula inicial
        initialBoard[fromRow][fromCol] = '';

        // Coloque a peça na nova célula
        initialBoard[toRow][toCol] = piece;

        createBoardFromImage();
        enableCellSelection();

        if (!isPawnPromoted) {
            switchTurn();

            const kingPosition = findKingPosition(initialBoard, turn);
            const opponentColor = turn === 'White' ? 'Black' : 'White';

            if (isKingInCheck(initialBoard, kingPosition, opponentColor)) {
                highlightKingInCheck(kingPosition);
                alert(turn + ' está em xeque!');     
            }
        }
    }, 800); // O tempo precisa ser o mesmo definido na transição do CSS
}

function toChessNotation(row, col) {
    const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const file = files[col];
    const rank = 8 - row;
    return `${file}${rank}`;
}

function findKingPosition(board, color) {
    const king = color === 'White' ? 'K' : 'k';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === king) {
                return { row, col };
            }
        }
    }
    return null;  // Rei não encontrado, deve ser um erro
}

function isKingInCheck(board, kingPosition, opponentColor) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece !== '' && ((opponentColor === 'White' && piece === piece.toUpperCase()) || 
                                 (opponentColor === 'Black' && piece === piece.toLowerCase()))) {
                // Obtém todos os movimentos válidos para a peça atual
                const possibleMoves = calculateValidMoves(row, col, piece, board);
                const movesInNotation = possibleMoves.map(move => toChessNotation(move.row, move.col));

                // Verifica se alguma dessas peças pode atacar a posição do rei
                if (possibleMoves.some(move => move.row === kingPosition.row && move.col === kingPosition.col)) {
                    // Para o cavalo, não verifique bloqueio
                    if (piece.toLowerCase() === 'n') {
                        return true; // O cavalo pode atacar o rei sem necessidade de verificação de bloqueio
                    }

                    // // Verifica se a peça atacante está bloqueada por outra peça
                    if (isMoveBlocked(board, piece, row, col, kingPosition.row, kingPosition.col)) {
                        continue; // Se estiver bloqueado, essa peça não pode atacar o rei
                    }
                    return true; // O rei está em xeque
                }
            }
        }
    }
    return false;
}

function isMoveBlocked(board, piece, startRow, startCol, endRow, endCol) {
    const direction = getDirection(startRow, startCol, endRow, endCol);
    let currentRow = startRow + direction.row;
    let currentCol = startCol + direction.col;

    while (currentRow !== endRow || currentCol !== endCol) {
        if (board[currentRow][currentCol] !== '') {
            // Verifique se a peça no caminho é do mesmo time, se for, está bloqueado
            if (isSameColor(piece, board[currentRow][currentCol])) {
                return true;
            }
            // Se for uma peça adversária e estamos na posição final, não está bloqueado (captura)
            if (currentRow === endRow && currentCol === endCol) {
                return false;
            }
            return true; // Caso contrário, há uma peça no caminho bloqueando
        }
        currentRow += direction.row;
        currentCol += direction.col;
    }
    return false;
}

function isSameColor(piece1, piece2) {
    return (piece1 === piece1.toUpperCase() && piece2 === piece2.toUpperCase()) ||
           (piece1 === piece1.toLowerCase() && piece2 === piece2.toLowerCase());
}

function getDirection(startRow, startCol, endRow, endCol) {
    return {
        row: endRow === startRow ? 0 : (endRow > startRow ? 1 : -1),
        col: endCol === startCol ? 0 : (endCol > startCol ? 1 : -1)
    };
}

function calculateValidMoves(row, col) {
    const piece = initialBoard[row][col];
    let validMoves = [];

    // Determine os possíveis movimentos com base na peça selecionada
    if (piece.toLowerCase() === 'p') {
        validMoves = calculatePawnMoves(row, col, piece);
    } else if (piece.toLowerCase() === 'r') {
        validMoves = calculateRookMoves(row, col, piece);
    } else if (piece.toLowerCase() === 'n') {
        validMoves = calculateKnightMoves(row, col, piece);
    } else if (piece.toLowerCase() === 'b') {
        validMoves = calculateBishopMoves(row, col, piece);
    } else if (piece.toLowerCase() === 'q') {
        validMoves = calculateQueenMoves(row, col, piece);
    } else if (piece.toLowerCase() === 'k') {
        validMoves = calculateKingMoves(row, col, piece);
    }

    return validMoves;
}

function calculatePawnMoves(row, col, piece) {
    const moves = [];
    const direction = piece === 'P' ? -1 : 1; // Direção de movimento dependendo da cor
    const startRow = piece === 'P' ? 6 : 1;   // Linha inicial para o peão da cor branca ou preta

    // Captura à esquerda
    if (isInBounds(row + direction, col - 1)) {
        moves.push({ row: row + direction, col: col - 1 });
    }

    // Captura à direita
    if (isInBounds(row + direction, col + 1)) {
        moves.push({ row: row + direction, col: col + 1 });
    }

    return moves;
}

function calculateRookMoves(row, col, piece) {
    return calculateLinearMoves(row, col, piece, [
        { row: -1, col: 0 }, // Para cima
        { row: 1, col: 0 },  // Para baixo
        { row: 0, col: -1 }, // Para a esquerda
        { row: 0, col: 1 }   // Para a direita
    ]);
}

function calculateKnightMoves(row, col, piece) {
    const moves = [
        { row: row - 2, col: col - 1 }, { row: row - 2, col: col + 1 },
        { row: row - 1, col: col - 2 }, { row: row - 1, col: col + 2 },
        { row: row + 1, col: col - 2 }, { row: row + 1, col: col + 2 },
        { row: row + 2, col: col - 1 }, { row: row + 2, col: col + 1 }
    ];

    return filterValidMoves(moves, piece);
}

function calculateBishopMoves(row, col, piece) {
    return calculateLinearMoves(row, col, piece, [
        { row: -1, col: -1 }, // Diagonal superior esquerda
        { row: -1, col: 1 },  // Diagonal superior direita
        { row: 1, col: -1 },  // Diagonal inferior esquerda
        { row: 1, col: 1 }    // Diagonal inferior direita
    ]);
}

function calculateQueenMoves(row, col, piece) {
    return calculateLinearMoves(row, col, piece, [
        { row: -1, col: 0 }, { row: 1, col: 0 },  // Vertical
        { row: 0, col: -1 }, { row: 0, col: 1 },  // Horizontal
        { row: -1, col: -1 }, { row: -1, col: 1 }, // Diagonais
        { row: 1, col: -1 }, { row: 1, col: 1 }
    ]);
}

function calculateKingMoves(row, col, piece) {
    const moves = [
        { row: row - 1, col: col }, { row: row + 1, col: col },
        { row: row, col: col - 1 }, { row: row, col: col + 1 },
        { row: row - 1, col: col - 1 }, { row: row - 1, col: col + 1 },
        { row: row + 1, col: col - 1 }, { row: row + 1, col: col + 1 }
    ];

    return filterValidMoves(moves, piece);
}

function calculateLinearMoves(row, col, piece, directions) {
    const moves = [];

    for (let direction of directions) {
        let r = row + direction.row;
        let c = col + direction.col;

        while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
            moves.push({ row: r, col: c });
            // if (initialBoard[r][c] === '') {
            //     moves.push({ row: r, col: c });
            // } else {
            //     if (isEnemyPiece(r, c, piece)) {
            //         moves.push({ row: r, col: c });
            //     }
            //     break;
            // }
            r += direction.row;
            c += direction.col;
        }
    }

    return moves;
}

function filterValidMoves(moves, piece) {
    return moves.filter(move => {
        return move.row >= 0 && move.row <= 7 && move.col >= 0 && move.col <= 7 &&
            (initialBoard[move.row][move.col] === '' ||
            isEnemyPiece(move.row, move.col, piece));
    });
}

function isEnemyPiece(row, col, piece) {
    const targetPiece = initialBoard[row][col];
    // Verifica se a peça é uma peça inimiga
    return targetPiece !== '' && targetPiece.toLowerCase() !== piece.toLowerCase() && 
           ((piece === piece.toUpperCase() && targetPiece === targetPiece.toLowerCase()) || 
            (piece === piece.toLowerCase() && targetPiece === targetPiece.toUpperCase()));
}

function performCastling(fromRow, fromCol, toRow, toCol) {
    const king = initialBoard[fromRow][fromCol];
    const rookCol = toCol === 6 ? 7 : 0; // Determina a coluna da torre para o castling
    const rook = initialBoard[fromRow][rookCol];
    const kingFinalCol = toCol;
    const rookFinalCol = toCol === 6 ? 5 : 3; // Destino final da torre

    const kingCell = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"] img`);
    const rookCell = document.querySelector(`[data-row="${fromRow}"][data-col="${rookCol}"] img`);
    const cellSize = document.querySelector('.cell').offsetWidth;

    disableCellSelection();

    if (kingCell) {
        // Calcule a distância em pixels que o rei deve se mover
        const kingDeltaX = (kingFinalCol - fromCol) * cellSize;
        const kingDeltaY = (toRow - fromRow) * cellSize;

        kingCell.style.transition = 'transform 0.3s ease';
        kingCell.style.transform = `translate(${kingDeltaX}px, ${kingDeltaY}px)`;
    }

    if (rookCell) {
        // Calcule a distância em pixels que a torre deve se mover
        const rookDeltaX = (rookFinalCol - rookCol) * cellSize;
        const rookDeltaY = (toRow - fromRow) * cellSize;

        rookCell.style.transition = 'transform 0.8s ease';
        rookCell.style.transform = `translate(${rookDeltaX}px, ${rookDeltaY}px)`;
    }

    setTimeout(() => {
        // Restaure a posição inicial (sem transformação) para o rei
        if (kingCell) {
            kingCell.style.transition = '';
            kingCell.style.transform = '';
        }

        // Restaure a posição inicial (sem transformação) para a torre
        if (rookCell) {
            rookCell.style.transition = '';
            rookCell.style.transform = '';
        }

        // Atualize o tabuleiro
        initialBoard[toRow][kingFinalCol] = king;
        initialBoard[toRow][rookFinalCol] = rook;
        initialBoard[fromRow][fromCol] = '';
        initialBoard[fromRow][rookCol] = '';

        // Atualize o estado das peças que se moveram
        if (king === 'K' || king === 'k') {
            hasMoved[king] = true;
        }
        hasMoved[rook] = true;

        clearSelection();
        createBoardFromImage(); // Atualize o tabuleiro para refletir o movimento
        enableCellSelection();
    }, 800); // O tempo precisa ser o mesmo definido na transição do CSS
}

function performEnPassant(fromRow, fromCol, toRow, toCol) {
    const piece = initialBoard[fromRow][fromCol];
    const capturedPawnRow = turn === 'White' ? toRow + 1 : toRow - 1;
    const capturedPawnCol = toCol;
    const cellSize = document.querySelector('.cell').offsetWidth;

    const pawnElement = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"] img`);
    const capturedPawnElement = document.querySelector(`[data-row="${capturedPawnRow}"][data-col="${capturedPawnCol}"] img`);
    const targetCellElement = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);

    // Calcule a distância em pixels que o peão deve se mover
    const deltaX = (toCol - fromCol) * cellSize;
    const deltaY = (toRow - fromRow) * cellSize;

    disableCellSelection();

    // Aplicar a transição de movimento ao peão
    if (pawnElement) {
        pawnElement.style.transition = 'transform 0.5s ease';
        pawnElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    // Remover a peça capturada com um atraso
    if (capturedPawnElement) {
        setTimeout(() => {
            capturedPawnElement.remove();
        }, 300); // O tempo deve ser o mesmo que a transição do peão
    }

    setTimeout(() => {
        // Restaure a posição inicial (sem transformação) do peão
        if (pawnElement) {
            pawnElement.style.transition = '';
            pawnElement.style.transform = '';
        }

        capturePieceImage(initialBoard[capturedPawnRow][toCol]);
        // Atualize o tabuleiro
        initialBoard[fromRow][fromCol] = '';
        initialBoard[toRow][toCol] = piece;
        initialBoard[capturedPawnRow][toCol] = '';

        clearSelection();
        createBoardFromImage(); // Atualize o tabuleiro para refletir o movimento
        enableCellSelection();
        switchTurn();
    }, 500); // O tempo deve ser o mesmo que a transição do peão
}

function capturePieceText(piece) {
    const isWhite = turn === 'White';
    const capturedDiv = isWhite ? whiteCapturedDiv : blackCapturedDiv;
    const pieceElement = document.createElement('div');
    pieceElement.textContent = pieces[piece];
    capturedDiv.appendChild(pieceElement);
}

function capturePieceImage(piece) {
    const isWhite = turn === 'White';
    const capturedDiv = isWhite ? whiteCapturedDiv : blackCapturedDiv;

    // Cria um elemento img para a peça capturada
    const pieceElement = document.createElement('img');
    pieceElement.src = pieces[piece]; // Usa o caminho da imagem correspondente
    pieceElement.classList.add('captured-piece'); // Adiciona uma classe para estilizar, se necessário

    // Adiciona a imagem da peça capturada à área correspondente
    capturedDiv.appendChild(pieceElement);
}

function isInBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function promotePawn(row, col) {
    const promotionDiv = document.createElement('div');
    promotionDiv.classList.add('promotion-menu');

    const promotionOptions = ['Q', 'R', 'B', 'N'];
    promotionOptions.forEach(pieceType => {
        const pieceImg = document.createElement('img');
        // Definir o src corretamente para as peças do turno atual
        if (turn === 'White') {
            pieceImg.src = pieces[pieceType]; // 'b' para peças pretas
        } else {
            pieceImg.src = pieces[pieceType.toLowerCase()];
        }
        
        pieceImg.classList.add('promotion-option');
        
        pieceImg.addEventListener('click', () => {
            // Atualizar a peça promovida corretamente com base no turno
            initialBoard[row][col] = promotedPiece[pieceType][turn];
            document.body.removeChild(promotionDiv);
            createBoardFromImage();
            clearSelection();
            switchTurn();
        });
        promotionDiv.appendChild(pieceImg);
    });

    document.body.appendChild(promotionDiv);
}

// Limpa a seleção e highlights ao clicar fora de uma célula válida
document.body.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.classList.contains('cell')) {
        clearSelection();
        clearPieceHighlight();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault(); // Impede o comportamento padrão do navegador
        undoMove();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'y') {
        event.preventDefault(); // Impede o comportamento padrão do navegador
        redoMove();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault(); // Impede o comportamento padrão do navegador
        resetBoard();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault(); // Impede o comportamento padrão do navegador
        exportBoardToCSV();
    }
});

createBoardFromImage();