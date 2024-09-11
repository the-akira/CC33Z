function createEmptyBoard() {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) {
            return false;
        }
    }

    const startRow = row - row % 3;
    const startCol = col - col % 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }

    return true;
}

function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function generateSudoku(difficulty) {
    const board = createEmptyBoard();
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Preenche diagonalmente as subgrades 3x3
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                board[i + j][i + k] = nums[j * 3 + k];
            }
        }
    }

    solveSudoku(board);

    // Ajusta o número de células a serem removidas com base na dificuldade
    const attempts = difficulty; // quantidade de números a remover
    for (let i = 0; i < attempts; i++) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        board[row][col] = 0;
    }

    return board;
}

function exportSudokuBoard() {
    const table = document.getElementById('sudoku-board');
    let csvContent = '';

    // Percorre as linhas e colunas do tabuleiro
    for (let row = 0; row < 9; row++) {
        const rowData = [];
        for (let col = 0; col < 9; col++) {
            const cell = table.rows[row].cells[col].querySelector('input');
            const value = cell.value === '' ? 0 : cell.value;
            rowData.push(value);
        }
        csvContent += rowData.join(',') + '\n'; // Junta os valores separados por vírgula e adiciona uma nova linha
    }

    // Cria um blob para o arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Cria um link para download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sudoku_board.csv';
    a.click();

    // Libera o objeto URL
    URL.revokeObjectURL(url);
}

function createNotes(td) {
    const notesContainer = document.createElement('div');
    notesContainer.className = 'notes-container';
    td.appendChild(notesContainer);

    for (let num = 1; num <= 9; num++) {
        const note = document.createElement('div');
        note.className = 'note';
        note.innerText = num;
        notesContainer.appendChild(note);
    }
}

function createCandidates(td) {
    const notesContainer = document.createElement('div');
    notesContainer.className = 'candidates-container';
    td.appendChild(notesContainer);

    for (let num = 1; num <= 9; num++) {
        const note = document.createElement('div');
        note.className = 'candidate';
    }
}

function checkInput(input) {
    // Garante que o valor está entre 1 e 9
    if (input.value < 1 || input.value > 9) {
        input.value = ''; // Limpa o valor inválido
    }
}

let selectedCell = null;

function createBoard(board) {
    const table = document.getElementById('sudoku-board');
    table.innerHTML = ''; // Limpa o tabuleiro

    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            const value = board[row][col];

            const input = document.createElement('input');
            if (value !== 0) {
                input.type = 'text';
                input.value = value;
                input.disabled = true;
            } else {
                input.type = 'text';
                input.maxLength = 1;
                input.style.fontWeight = "bold";
                input.addEventListener('input', highlightErrors);
                input.addEventListener('click', function() {
                    showNumericBox(this);
                    selectedCell = this; // Armazena a célula clicada
                    document.getElementById('clear-cell-btn').disabled = false; // Habilita o botão de limpeza
                });
                input.addEventListener('focus', function() {
                    showNumericBox(this);
                });
                input.addEventListener('input', function() {
                    checkInput(this);
                });
                input.addEventListener('keydown', function(event) {
                    // Permite backspace, delete, tab, setas, e números de 1 a 9
                    if ([8, 46, 9, 37, 39].includes(event.keyCode) || (event.key >= 1 && event.key <= 9)) {
                        return;
                    }

                    // Impede a inserção de caracteres fora do intervalo
                    event.preventDefault();
                });
            }

            // Adiciona classes de borda para os quadrantes 3x3
            if (row % 3 === 0) td.classList.add('top-border');
            if (row % 3 === 2) td.classList.add('bottom-border');
            if (col % 3 === 0) td.classList.add('left-border');
            if (col % 3 === 2) td.classList.add('right-border');

            // Adiciona os atributos data-row e data-col
            td.setAttribute('data-row', row);
            td.setAttribute('data-col', col);

            // Configura o evento de clique para destacar a célula, linha, coluna e quadrante
            td.addEventListener('click', function() {
                highlightRelatedCells(this);
            });

            createNotes(td);
            createCandidates(td);

            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function highlightRelatedCells(cell) {
    if (noteVisibility) {
        return;
    }
    clearHighlights(); // Limpa os destaques anteriores
    const row = cell.getAttribute('data-row');
    const col = cell.getAttribute('data-col');
    const subgridRowStart = Math.floor(row / 3) * 3;
    const subgridColStart = Math.floor(col / 3) * 3;

    // Destaque a linha e a coluna
    document.querySelectorAll(`[data-row="${row}"]`).forEach(el => el.classList.add('highlight-group'));
    document.querySelectorAll(`[data-col="${col}"]`).forEach(el => el.classList.add('highlight-group'));

    // Destaque o quadrante (subgrade 3x3)
    for (let i = subgridRowStart; i < subgridRowStart + 3; i++) {
        for (let j = subgridColStart; j < subgridColStart + 3; j++) {
            document.querySelector(`[data-row="${i}"][data-col="${j}"]`).classList.add('highlight-group');
        }
    }
}

function clearHighlights() {
    // Remove todas as classes de destaque
    document.querySelectorAll('.highlight-cell').forEach(el => el.classList.remove('highlight-cell'));
    document.querySelectorAll('.highlight-group').forEach(el => el.classList.remove('highlight-group'));
}

function getBoard() {
    const board = [];
    const rows = document.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
        const rowData = [];
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, colIndex) => {
            const input = cell.querySelector('input');
            const value = parseInt(input.value) || 0;
            rowData.push(value);
        });
        board.push(rowData);
    });
    return board;
}

function setBoard(board, disableFilled = true, animate = false) {
    const rows = document.querySelectorAll('tr');

    if (animate) {
        toggleButtons([
            'solve-button', 
            'reset-button', 
            'check-button', 
            'notes-trigger', 
            'hint-btn', 
            'undo-btn', 
            'export-btn', 
            'toggle-candidates-btn', 
        ], false);
        let delay = 0;
        let totalDelay = 0;

        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, colIndex) => {
                const value = board[rowIndex][colIndex];
                const input = cell.querySelector('input');

                if (value !== 0 && !disableFilled) {
                    setTimeout(() => {
                        input.value = value;
                        input.classList.add('fill-animation'); // Adiciona a animação
                        input.disabled = false;
                        input.addEventListener('animationend', () => {
                            input.classList.remove('fill-animation');
                        });
                        input.style.backgroundColor = 'white';
                    }, delay);
                    delay += 100; // Incrementa o delay para cada célula
                }
                else if (value !== 0) {
                    setTimeout(() => {
                        input.value = value;
                        input.disabled = true;
                        input.classList.add('fill-animation'); // Adiciona a animação
                        input.addEventListener('animationend', () => {
                            input.classList.remove('fill-animation');
                        });
                    }, delay);
                    delay += 100; // Incrementa o delay para cada célula
                } else {
                    setTimeout(() => {
                        input.value = '';
                        input.disabled = false;
                    }, delay);
                }
                totalDelay = delay;
            });

            // Reativa o botão após o tempo total das animações
            setTimeout(() => {
                toggleButtons([
                    'solve-button', 
                    'reset-button', 
                    'check-button', 
                    'notes-trigger', 
                    'hint-btn', 
                    'undo-btn', 
                    'export-btn', 
                    'toggle-candidates-btn', 
                ], true);
            }, totalDelay + 8000); // 8000ms é o tempo da animação fill-animation
        });
    } else {
        // Preenchimento normal (sem animação)
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, colIndex) => {
                const value = board[rowIndex][colIndex];
                const input = cell.querySelector('input');
                if (value !== 0 && !disableFilled) {
                    input.value = value;
                }
                else if (value !== 0) {
                    input.value = value;
                    input.disabled = true;
                } else {
                    input.value = '';
                    input.disabled = false;
                }
            });
        });
    }
}

function clearUserInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (!input.disabled) {
            input.value = '';
            input.disabled = false; // Permite que o solver possa preencher             
        }
    });
}

function resetBoard() {
    const difficulty = parseInt(document.getElementById('difficulty').value);
    const newBoard = generateSudoku(difficulty); // Passa a dificuldade para a função generateSudoku
    createBoard(newBoard);
    document.getElementById('validation-message').innerText = '';
    document.getElementById('hint-count').innerText = 0; 
    const notes = document.querySelectorAll('.note');

    toggleButtons([
        'solve-button', 
        'reset-button', 
        'check-button', 
        'notes-trigger', 
        'hint-btn', 
        'undo-btn', 
        'export-btn', 
        'toggle-candidates-btn', 
    ], true);

    // Adiciona um evento de clique a cada elemento
    notes.forEach(note => {
        note.addEventListener('click', function () {
            note.classList.toggle('active');
        });
    });
}

function isBoardValid(board) {
    // Verifica se o tabuleiro está completamente preenchido
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) return false; // Há células vazias
        }
    }

    // Verifica linhas e colunas
    for (let i = 0; i < 9; i++) {
        const rowSet = new Set();
        const colSet = new Set();

        for (let j = 0; j < 9; j++) {
            // Verifica linha
            if (rowSet.has(board[i][j])) return false;
            rowSet.add(board[i][j]);

            // Verifica coluna
            if (colSet.has(board[j][i])) return false;
            colSet.add(board[j][i]);
        }
    }

    // Verifica subgrades 3x3
    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            const boxSet = new Set();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const num = board[row + i][col + j];
                    if (boxSet.has(num)) return false;
                    boxSet.add(num);
                }
            }
        }
    }

    return true;
}

function highlightErrors() {
    // Remove todas as classes de erro e cores de fundo/texto existentes
    clearErrorHighlights();

    const rows = document.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, colIndex) => {
            const input = cell.querySelector('input');
            const value = parseInt(input.value);

            if (value) {
                // Verifica valores repetidos na linha
                const rowInputs = Array.from(rows[rowIndex].querySelectorAll('input'));
                const duplicateInRow = rowInputs.filter(otherInput => parseInt(otherInput.value) === value && otherInput !== input);

                if (duplicateInRow.length > 0) {
                    rowInputs.forEach(input => {
                        input.classList.add('highlight-row');
                        input.style.backgroundColor = '#ffb0b5';
                    });
                    duplicateInRow.forEach(input => {
                        input.classList.add('duplicate-number');
                        input.style.color = 'red'; // Muda a cor do texto
                    });
                }

                // Verifica valores repetidos na coluna
                const colInputs = Array.from(document.querySelectorAll(`tr td:nth-child(${colIndex + 1}) input`));
                const duplicateInCol = colInputs.filter(otherInput => parseInt(otherInput.value) === value && otherInput !== input);

                if (duplicateInCol.length > 0) {
                    colInputs.forEach(input => {
                        input.classList.add('highlight-col');
                        input.style.backgroundColor = '#ffb0b5';
                    });
                    duplicateInCol.forEach(input => {
                        input.classList.add('duplicate-number');
                        input.style.color = 'red'; // Muda a cor do texto
                    });
                }

                // Verifica valores repetidos no quadrante
                const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
                const boxStartRow = Math.floor(rowIndex / 3) * 3;
                const boxStartCol = Math.floor(colIndex / 3) * 3;
                const boxInputs = [];

                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const boxInput = document.querySelector(`tr:nth-child(${boxStartRow + i + 1}) td:nth-child(${boxStartCol + j + 1}) input`);
                        if (boxInput) {
                            boxInputs.push(boxInput);
                        }
                    }
                }

                const duplicateInBox = boxInputs.filter(otherInput => parseInt(otherInput.value) === value && otherInput !== input);

                if (duplicateInBox.length > 0) {
                    boxInputs.forEach(input => {
                        input.classList.add('highlight-box');
                        input.style.backgroundColor = '#ffb0b5';
                    });
                    duplicateInBox.forEach(input => {
                        input.classList.add('duplicate-number');
                        input.style.color = 'red'; // Muda a cor do texto
                    });
                }
            }
        });
    });
}

function clearErrorHighlights() {
    document.querySelectorAll('.incorrect, .highlight-row, .highlight-col, .highlight-box, .duplicate-number').forEach(input => {
        input.classList.remove('incorrect', 'highlight-row', 'highlight-col', 'highlight-box', 'duplicate-number');
        input.style.backgroundColor = ''; // Remove a cor de fundo
        input.style.color = ''; // Remove a cor do texto
    });
}

let noteVisibility = false;

function toggleNotesVisibility() {
    if (isBoardComplete(getBoard())) {
        alert('O tabuleiro está completo.');
    } else {
        noteVisibility = !noteVisibility;
        clearHighlightedCells();

        if (noteVisibility) {
            toggleButtons([
                'solve-button', 
                'reset-button', 
                'check-button', 
                'hint-btn', 
                'undo-btn', 
                'export-btn', 
                'toggle-candidates-btn', 
            ], false);
        } else {
            toggleButtons([
                'solve-button', 
                'reset-button', 
                'check-button', 
                'hint-btn', 
                'undo-btn', 
                'export-btn', 
                'toggle-candidates-btn', 
            ], true);
        }
        // Seleciona todas as células com anotações
        const cellsWithNotes = document.querySelectorAll('td .notes-container');

        cellsWithNotes.forEach(notesContainer => {
            // Verifica se a célula associada ao contêiner de notas é editável
            const td = notesContainer.parentElement;
            const input = td.querySelector('input');

            if (!input || input.disabled) {
                // Se o input está desativado, não faz nada
                return;
            }

            // Seleciona todas as notas dentro do contêiner de notas
            const notes = notesContainer.querySelectorAll('.note');

            notes.forEach(note => {
                // Adiciona ou remove a classe 'visible'
                note.classList.toggle('visible');
                if (note.classList.contains('visible')) {
                    document.getElementById('notes-trigger').innerHTML = "Ocultar Anotações";
                } else {
                    document.getElementById('notes-trigger').innerHTML = "Visualizar Anotações";
                }
            });
        });
    }
}

let timerInterval;
let elapsedTime = 0; // Tempo decorrido em milissegundos
let isRunning = false;

function startTimer() {
    if (!isRunning) {
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
        isRunning = true;
        const startTime = Date.now() - elapsedTime;

        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateTimerDisplay();
        }, 1000);
    }
}

function stopTimer() {
    if (isRunning) {
        isRunning = false;
        document.getElementById('stop-btn').disabled = true;
        document.getElementById('start-btn').disabled = false;
        clearInterval(timerInterval);
    }
}

function resetTimer() {
    stopTimer();
    document.getElementById('stop-btn').disabled = false;
    elapsedTime = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;
}

function isBoardComplete(board) {
    // Verifica se há alguma célula vazia no tabuleiro
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return false; // Existe pelo menos uma célula vazia
            }
        }
    }
    return true; // Todas as células estão preenchidas
}

let hintCount = 0;

function giveHint() {
    const board = getBoard(); // Captura o estado atual do tabuleiro
    clearHighlightedCells();
    if (isBoardComplete(board)) {
        alert('O tabuleiro já está completo!');
        return; // Não adiciona uma dica se o tabuleiro estiver completo
    }
    saveState();
    const solvedBoard = JSON.parse(JSON.stringify(board)); // Cria uma cópia para resolver
    if (solveSudoku(solvedBoard)) {
        // Preenche a próxima célula vazia com a solução correta
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const input = document.querySelector(`#sudoku-board tr:nth-child(${row + 1}) td:nth-child(${col + 1}) input`);
                    input.value = solvedBoard[row][col];
                    input.disabled = true; // Desabilita a célula para que não seja editada novamente
                    input.style.fontWeight = "bold";
                    hintCount++; // Incrementa o contador de dicas usadas
                    document.getElementById('hint-count').textContent = hintCount; // Atualiza o contador na interface
                    highlightHint(row, col);
                    return; // Dá uma dica por vez
                }
            }
        }
    } else {
        alert('Não foi possível resolver o Sudoku.');
    }
}

let highlightedCells = [];

function highlightHint(row, col) {
    const cellsToHighlight = [];
    toggleButtons([
        'solve-button', 
        'reset-button', 
        'check-button', 
        'notes-trigger', 
        'hint-btn', 
        'undo-btn', 
        'export-btn', 
        'toggle-candidates-btn', 
    ], false);

    // Adiciona a linha e coluna à lista de células a destacar
    for (let i = 0; i < 9; i++) {
        cellsToHighlight.push(document.querySelector(`#sudoku-board tr:nth-child(${row + 1}) td:nth-child(${i + 1}) input`));
        cellsToHighlight.push(document.querySelector(`#sudoku-board tr:nth-child(${i + 1}) td:nth-child(${col + 1}) input`));
    }

    for (let i = 0; i < 9; i++) {
        highlightedCells.push(document.querySelector(`#sudoku-board tr:nth-child(${row + 1}) td:nth-child(${i + 1}) input`));
        highlightedCells.push(document.querySelector(`#sudoku-board tr:nth-child(${i + 1}) td:nth-child(${col + 1}) input`));
    }

    // Adiciona o quadrante (subgrade 3x3) à lista de células a destacar
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            cellsToHighlight.push(document.querySelector(`#sudoku-board tr:nth-child(${startRow + i + 1}) td:nth-child(${startCol + j + 1}) input`));
            highlightedCells.push(document.querySelector(`#sudoku-board tr:nth-child(${startRow + i + 1}) td:nth-child(${startCol + j + 1}) input`));
        }
    }

    // Adiciona a classe de destaque
    cellsToHighlight.forEach(cell => cell.classList.add('highlight'));

    // Remove o destaque após 2 segundos
    setTimeout(() => {
        cellsToHighlight.forEach(cell => cell.classList.remove('highlight'));
        toggleButtons([
            'solve-button', 
            'reset-button', 
            'check-button', 
            'notes-trigger', 
            'hint-btn', 
            'undo-btn', 
            'export-btn', 
            'toggle-candidates-btn', 
        ], true);
    }, 2000);
}

function clearHighlightedCells() {
    highlightedCells.forEach(cell => cell.classList.remove('highlight'));
    highlightedCells = []; 
}

function removeBoldFromCellValue() {
    const board = getBoard();
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const input = document.querySelector(`#sudoku-board tr:nth-child(${row + 1}) td:nth-child(${col + 1}) input`);
                input.style.fontWeight = "normal";
            }
        }
    }
}

let history = [];

function saveState() {
    const board = getBoard();
    history.push(JSON.parse(JSON.stringify(board))); // Armazena uma cópia profunda do estado atual
}

function undo() {
    clearHighlightedCells();

    if (history.length === 0) {
        alert('Não há dicas para desfazer.');
    }
    else if (history.length > 0) {
        const lastState = history.pop(); // Remove o estado mais recente
        setBoard(lastState, false); // Restaura o estado anterior
    } else {
        console.warn('Nenhum estado anterior para desfazer.');
    }
}

function findCandidates(board, row, col) {
    const candidates = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Verificar a linha
    for (let i = 0; i < 9; i++) {
        candidates.delete(board[row][i]);
    }

    // Verificar a coluna
    for (let i = 0; i < 9; i++) {
        candidates.delete(board[i][col]);
    }

    // Verificar o bloco 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            candidates.delete(board[i][j]);
        }
    }

    return Array.from(candidates);
}

function displayCandidates(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) { // Célula vazia
                const candidates = findCandidates(board, row, col);
                const td = document.querySelector(`#sudoku-board tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
                const candidatesContainer = td.querySelector('.candidates-container');

                // Preenche com candidatos, mantendo a estrutura de grid 3x3
                let candidatesHTML = '';
                for (let num = 1; num <= 9; num++) {
                    if (candidates.includes(num)) {
                        candidatesHTML += `<div class="candidate visible">${num}</div>`;
                    } else {
                        candidatesHTML += `<div class="candidate"></div>`;
                    }
                }

                candidatesContainer.innerHTML = candidatesHTML;
            }
        }
    }
}

function hideCandidates() {
    const notesContainers = document.querySelectorAll('#sudoku-board .candidates-container');

    notesContainers.forEach(container => {
        container.innerHTML = ''; // Limpa os candidatos exibidos
    });
}

let activeInput = null;

function showNumericBox(inputElement) {
    const numericBox = document.getElementById('numeric-box');
    
    // Definir a posição da caixa numérica ao lado do input
    const rect = inputElement.getBoundingClientRect();
    numericBox.style.left = `${rect.right + 10}px`;
    numericBox.style.top = `${rect.top}px`;
    
    numericBox.style.display = 'block';
    activeInput = inputElement; // Armazena o input atual para inserir o número selecionado
}

function insertNumber(number) {
    if (activeInput) {
        activeInput.focus();
        activeInput.value = number;
        activeInput = null;
        highlightErrors();
        hideNumericBox(); // Esconde a caixa após a seleção
    }
}

function hideNumericBox() {
    document.getElementById('numeric-box').style.display = 'none';
}

function toggleButtons(buttonIds, enable = true) {
    buttonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.disabled = !enable; // Habilita se 'enable' for true, desabilita se for false
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    resetBoard();

    document.getElementById('solve-button').addEventListener('click', function () {
        const board = getBoard();
        if (isBoardComplete(board)) {
            alert('O tabuleiro já está completo!');
        }
        else if (!noteVisibility && !candidatesVisible) {
            // removeBoldFromCellValue();
            clearUserInputs();
            clearErrorHighlights();
            solveSudoku(board);
            setBoard(board, false, true);    
        }
    });

    document.getElementById('reset-button').addEventListener('click', function () {
        if (!noteVisibility) {
            resetBoard();
            hintCount = 0;
            history = [];
        }
    });

    document.getElementById('check-button').addEventListener('click', function () {
        const board = getBoard();

        if (isBoardComplete(board)) {     
            const messageElement = document.getElementById('validation-message');
            const message = isBoardValid(board) ? 'Solução Correta!' : 'Solução Incorreta!';
            
            // Exibe a mensagem
            messageElement.innerText = message;

            // Define um tempo para a mensagem desaparecer
            setTimeout(function() {
                messageElement.innerText = ''; // Esvazia o texto para esconder a mensagem
            }, 5000); // 5000 ms = 5 segundos
        } else {
            alert('O tabuleiro está incompleto!');
        }
    });

    document.getElementById('export-btn').addEventListener('click', exportSudokuBoard);
    document.getElementById('notes-trigger').addEventListener('click', toggleNotesVisibility);
    document.getElementById('start-btn').addEventListener('click', startTimer);
    document.getElementById('stop-btn').addEventListener('click', stopTimer);
    document.getElementById('reset-btn').addEventListener('click', resetTimer);
    document.getElementById('hint-btn').addEventListener('click', giveHint);
    document.getElementById('undo-btn').addEventListener('click', undo);
    
    // Seleciona todos os botões dentro do numeric-box
    const numericButtons = document.querySelectorAll('#numeric-box button');

    // Evento para desmarcar a célula selecionada ao clicar fora do tabuleiro e fora dos botões numéricos
    document.addEventListener('click', function(event) {
        const board = document.getElementById('sudoku-board');
        const clearCellButton = document.getElementById('clear-cell-btn');
        const numericBox = document.getElementById('numeric-box');
        
        // Verifica se o clique ocorreu fora do tabuleiro e dos botões numéricos
        if (!board.contains(event.target) && 
            !Array.from(numericButtons).some(button => button.contains(event.target)) &&
            !numericBox.contains(event.target)) {
            clearHighlights();
            selectedCell = null; // Nenhuma célula selecionada
            clearCellButton.disabled = true; // Desabilita o botão de limpar
            hideNumericBox(); // Esconde a caixa numérica
        }
    });

    const board = document.getElementById('sudoku-board');
    // Evento global para detectar o foco em qualquer input do tabuleiro
    board.addEventListener('focusin', function(event) {
        if (event.target.tagName === 'INPUT') {
            const cell = event.target.parentElement;
            highlightRelatedCells(cell);
        }
    });

    let candidatesVisible = false;

    document.getElementById('toggle-candidates-btn').addEventListener('click', function() {

        if (isBoardComplete(getBoard())) {
            alert('O tabuleiro está completo.');
        } else {
            candidatesVisible = !candidatesVisible;

            if (candidatesVisible) {
                displayCandidates(getBoard()); // Chama a função para exibir os candidatos
                this.textContent = 'Ocultar Candidatos';
                toggleButtons([
                    'solve-button', 
                    'reset-button', 
                    'check-button', 
                    'hint-btn', 
                    'undo-btn', 
                    'export-btn', 
                    'notes-trigger', 
                ], false);
            } else {
                hideCandidates();
                this.textContent = 'Visualizar Candidatos';
                toggleButtons([
                    'solve-button', 
                    'reset-button', 
                    'check-button', 
                    'hint-btn', 
                    'undo-btn', 
                    'export-btn', 
                    'notes-trigger', 
                ], true);
            }     
        }
    });

    document.getElementById('difficulty').addEventListener('change', function() {
        resetBoard(); // Atualiza o tabuleiro com a nova dificuldade
        candidatesVisible = false;
        noteVisibility = false;
        document.getElementById('notes-trigger').textContent = 'Visualizar Anotações';
        document.getElementById('toggle-candidates-btn').textContent = 'Visualizar Candidatos';
        history = [];
        hintCount = 0;
    });

    // Esconde a caixa numérica se clicar fora dela
    document.addEventListener('click', function(event) {
        const numericBox = document.getElementById('numeric-box');
        if (!numericBox.contains(event.target) && !activeInput?.contains(event.target)) {
            hideNumericBox();
        }
    });

    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            selectedCell = this; // Atualiza a célula selecionada quando o campo recebe foco
        });
    });

    // Função para limpar a célula selecionada
    document.getElementById('clear-cell-btn').addEventListener('click', function () {
        const board = document.getElementById('sudoku-board');
        if (selectedCell) {
            // Verifica se a célula contém algum valor antes de limpá-la
            if (selectedCell.value !== '') {
                selectedCell.value = ''; // Limpa o conteúdo da célula
                selectedCell.disabled = false; // Reativa a célula para que possa ser editada novamente, se necessário
                highlightErrors();
            }

            selectedCell = null; // Reseta a célula selecionada
            this.disabled = true; // Desativa o botão de limpeza após uso
        }
    });
});