// Definição da Máquina de Turing
let tape = ['B', '1', '0', '1', '1', '0', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '0', '1', 'B']; // Fita inicial
let headPosition = 0; // Posição inicial da cabeça da fita
let initialState = 'q0'; // Estado inicial
let inputSymbols = ['0', '1']; // Símbolos de entrada
let finalStates = ['q3']; // Estados finais
const blankSymbol = 'B'; // Símbolo em branco
let currentState = initialState; // Estado atual
let states = ['q0', 'q1', 'q2', 'q3']; // Estados
let tapeAlphabet = ['0', '1', 'B']; // Alfabeto da fita, incluindo o símbolo em branco
let transitions = {
    // Transições: estado atual -> [símbolo atual, próximo estado, símbolo a escrever, movimento da fita (L/R)]
    'q0': [['0', 'q1', '1', 'R'], ['1', 'q1', '1', 'R'], ['B', 'q1', '1', 'R']],
    'q1': [['1', 'q2', '0', 'L'], ['0', 'q2', '1', 'L'], ['B', 'q3', '1', 'L']],
    'q2': [['0', 'q2', '1', 'R'], ['B', 'q3', '1', 'L'], ['1', 'q1', '0', 'R']],
    'q3': []
};

// Configurações
let isAnimating = false; // Flag para controlar a animação
let animationInterval; // Intervalo de animação
let animationSpeed = 500; // Velocidade da animação em milissegundos
let tapeOffset = 0; // Deslocamento para o scroll da fita
let history = [];
let stepCount = 0;
let startTime;
let elapsedTime = 0;
let timerInterval;
let currentTransitionElement = null;

function populateTransitionsTable() {
    const tableBody = document.getElementById('transitionsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Limpar tabela existente

    for (const [state, transitionsList] of Object.entries(transitions)) {
        for (const [readSymbol, nextState, writeSymbol, move] of transitionsList) {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = safeValue(state);
            row.insertCell(1).innerText = safeValue(readSymbol);
            row.insertCell(2).innerText = safeValue(nextState);
            row.insertCell(3).innerText = safeValue(writeSymbol);
            row.insertCell(4).innerText = safeValue(move);
        }
    }
}

function safeValue(value) {
    return value !== undefined ? value : '';
}

function highLightRow() {
    // Destacar a linha correspondente na tabela de transições
    if (currentTransitionElement) {
        currentTransitionElement.classList.remove('highlighted'); // Remove o destaque da transição anterior
    }

    const tableBody = document.getElementById('transitionsTable').getElementsByTagName('tbody')[0];
    const rows = Array.from(tableBody.rows);
    const finalState = findFinalState(transitions);

    // Encontrar a linha correspondente à transição atual
    const currentRow = rows.find(row =>
        row.cells[0].innerText.trim() === currentState.trim() &&
        row.cells[1].innerText.trim() === tape[headPosition].trim() ||
        row.cells[0].innerText.trim() === finalState.trim()
    );

    if (currentRow) {
        currentTransitionElement = currentRow;
        currentRow.classList.add('highlighted');
    }
}

function findFinalState(transitions) {
    for (const state in transitions) {
        if (transitions[state].length === 0 || transitions[state].some(transition => transition.includes(undefined))) {
            return state;
        }
    }
    return null; // Se nenhum estado com lista vazia ou elementos undefined for encontrado
}

function isMachineFinished() {
    // Verifica se o estado atual não tem transições definidas
    const currentStateTransitions = transitions[currentState];
    if (currentStateTransitions.length === 0) {
        return true; // Se não houver transições definidas, a máquina está terminada
    }

    // Verifica se todas as transições têm elementos undefined
    return currentStateTransitions.every(transition => transition.every(element => element === undefined));
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 100); // Atualiza a cada 100ms
}

function pauseTimer() {
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime;
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    startTime = Date.now(); // Reinicia o startTime
    document.getElementById('executionTimeValue').innerText = elapsedTime; // Atualiza a exibição do tempo para 0 ms
}

function updateTimer() {
    const currentTime = Date.now();
    const timeDiff = currentTime - startTime;
    document.getElementById('executionTimeValue').innerText = timeDiff;
}

// Função para executar uma etapa da Máquina de Turing
async function step() {
    // Expande a fita à esquerda, se necessário
    if (headPosition < 0) {
        tape.unshift(blankSymbol);
        headPosition = 0;
        tapeOffset++;
        scrollTape(-1);
    }

    // Expande a fita à direita, se necessário
    if (headPosition >= tape.length) {
        tape.push(blankSymbol);
        scrollTape(1);
    }

    const currentSymbol = tape[headPosition];
    let transitionFound = false;

    console.log(`Estado atual: ${currentState}, Símbolo atual: ${currentSymbol}, Posição da cabeça: ${headPosition}`);

    // Salvar o estado atual no histórico antes de fazer a transição
    if (!isMachineFinished()) {
        history.push({
            currentState,
            headPosition,
            currentSymbol,
            tape: [...tape] // Faz uma cópia da fita
        });

        stepCount++;
    }

    // Procura a transição atual
    for (const [index, [symbol, nextState, writeSymbol, move]] of transitions[currentState].entries()) {
        if (symbol === currentSymbol) {
            tape[headPosition] = writeSymbol; // Escreve o símbolo
            currentState = nextState; // Muda para o próximo estado
            if (move === 'L' && headPosition === 0) {
                console.log("A cabeça já está na extremidade esquerda da fita.");
                playPausebtn.innerHTML = "Play";
                drawTape();
                return false;
            }
            if (move === 'R' && headPosition === tape.length - 1) {
                console.log("A cabeça já está na extremidade direita da fita.");
                playPausebtn.innerHTML = "Play";
                drawTape();
                return false;
            }
            if (move === 'L') {
                headPosition--; // Move a cabeça para a esquerda
                if (headPosition < tapeOffset) {
                    scrollTape(-5);
                }
            } else {
                headPosition++; // Move a cabeça para a direita
                if (headPosition >= tapeOffset + Math.floor(canvas.width / 80)) {
                    scrollTape(5);
                }
            }
            transitionFound = true;
            console.log(`Transição encontrada: Estado: ${currentState}, Símbolo Escrito: ${writeSymbol}, Movimento: ${move}`);

            break;
        }
    }

    // Se não houver transição, a máquina para
    if (!transitionFound) {
        console.log(`Nenhuma transição encontrada para o estado ${currentState} com o símbolo ${currentSymbol}`);
        // Parar a máquina de Turing se não há transição encontrada
        playPausebtn.innerHTML = "Play";
        return false;
    }

    console.log(`Máquina parou no estado final: ${currentState}`);
    console.log(`Fita final: ${tape}`);
    console.log(`Posição da cabeça atual: ${headPosition}`);

    // Atualiza a interface do usuário
    updateUI();
    highLightRow();

    // Redesenha a fita
    drawTape();
    return true; // Indica que a máquina deve continuar
}

async function stepBack() {
    if (history.length === 0) {
        console.log("Não há passos anteriores para voltar.");
        return;
    }

    // Recupera o último estado do histórico
    const lastState = history.pop();

    // Reverte a máquina para o estado anterior
    currentState = lastState.currentState;
    headPosition = lastState.headPosition;
    tape = lastState.tape;

    stepCount--;

    // Atualiza a interface do usuário
    updateUI();

    adjustTapeOffset();

    // Redesenha a fita
    drawTape();

    // Destacar a linha correspondente na tabela de transições
    if (currentTransitionElement) {
        currentTransitionElement.classList.remove('highlighted'); // Remove o destaque da transição anterior
    }

    const currentSymbol = tape[headPosition];
    const tableBody = document.getElementById('transitionsTable').getElementsByTagName('tbody')[0];
    const rows = Array.from(tableBody.rows);

    // Encontrar a linha correspondente à transição atual
    const currentRow = rows.find(row =>
        row.cells[0].innerText === currentState &&
        row.cells[1].innerText === currentSymbol
    );

    console.log("Elemento encontrado:", currentRow); // Log para verificar o elemento

    if (currentRow) {
        currentTransitionElement = currentRow;
        currentRow.classList.add('highlighted');
        console.log("Classe 'highlighted' adicionada ao elemento:", currentRow); // Log para verificar a adição da classe
    } else {
        console.log("Elemento correspondente não encontrado");
    }
}

// Função para desenhar a fita no canvas
function drawTape() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const cellWidth = 80;
    const cellHeight = 80;
    const cellsVisible = Math.floor(canvas.width / cellWidth); // Número de células visíveis no canvas
    const startX = (canvas.width - cellsVisible * cellWidth) / 2; // Posição inicial para centralizar a fita visível

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "35px Arial"; // Definindo o tamanho da fonte
    ctx.textAlign = "center"; // Centralizando o texto horizontalmente
    ctx.textBaseline = "middle"; // Centralizando o texto verticalmente
    ctx.fillStyle = "black";

    // Desenhar todas as células da fita
    for (let i = 0; i < cellsVisible; i++) {
        const tapeIndex = tapeOffset + i;
        const symbol = tape[tapeIndex] || blankSymbol; // Símbolo atual ou símbolo em branco se estiver fora da fita atual

        // Definindo a cor de fundo das células normais
        ctx.fillStyle = "#e1e3e6";
        ctx.fillRect(startX + i * cellWidth, 50, cellWidth, cellHeight);

        // Desenhar o contorno das células
        ctx.strokeStyle = "black"; // Cor do contorno normal
        ctx.lineWidth = 1; // Espessura do contorno normal
        ctx.strokeRect(startX + i * cellWidth, 50, cellWidth, cellHeight);

        // Desenhar o símbolo na célula
        ctx.fillStyle = "black";
        ctx.fillText(symbol, startX + i * cellWidth + cellWidth / 2, cellHeight / 2 + 50); // Desenha o texto centralizado
    }

    // Desenhar os índices das células
    ctx.font = "20px Arial";
    for (let i = 0; i < cellsVisible; i++) {
        const tapeIndex = tapeOffset + i;
        ctx.fillText(tapeIndex, startX + i * cellWidth + cellWidth / 2, cellHeight / 2 - 3);
    }

    // Desenhar a célula da cabeça de leitura com fundo azul e outline vermelho
    const headIndex = headPosition - tapeOffset;
    if (headIndex >= 0 && headIndex < cellsVisible) {
        // Desenhar o fundo azul da célula da cabeça de leitura
        ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
        ctx.fillRect(startX + headIndex * cellWidth, 50, cellWidth, cellHeight);

        // Desenhar o outline vermelho ao redor da célula da cabeça de leitura
        ctx.strokeStyle = "blue"; // Cor do outline
        ctx.lineWidth = 3; // Espessura do outline
        ctx.strokeRect(startX + headIndex * cellWidth, 50, cellWidth, cellHeight);
    }
}

// Função para alternar entre play e pause
let playPausebtn = document.getElementById("playPauseBtn");
function toggleAnimation() {
    if (isAnimating) {
        pauseAnimation();
        playPausebtn.innerHTML = "Play";
    } else {
        startAnimation();
        centerHeadOnTape();
        playPausebtn.innerHTML = "Pause";
    }
}

// Função para iniciar a animação
function startAnimation() {
    if (!isAnimating) {
        isAnimating = true;
        setScrollButtonsEnabled(false);
        startTimer();
        animationInterval = setInterval(async () => {
            if (!await step()) {
                pauseAnimation();
            }
        }, animationSpeed);
    }
}

// Função para pausar a animação
function pauseAnimation() {
    setScrollButtonsEnabled(true);
    clearInterval(animationInterval);
    isAnimating = false;
    updateUI();
    pauseTimer();
}

// Função para atualizar a velocidade da animação
function updateSpeed(speed) {
    animationSpeed = 2000 - speed;
    if (isAnimating) {
        pauseAnimation();
        startAnimation();
    }
}

// Função para inicializar a fita a partir da entrada do usuário
function initializeTape() {
    const input = document.getElementById('tapeInput').value;
    tape = input.split('');
    headPosition = 0;
    currentState = initialState;
    tapeOffset = 0; // Resetar o deslocamento da fita
    stepCount = 0;
    history = [];
    pauseAnimation();
    resetTimer(); 
    updateUI(); // Atualiza a interface do usuário
    drawTape();
    playPausebtn.innerHTML = "Play";
    populateTransitionsTable();
    highLightRow();
}

// Função para executar uma etapa manualmente
async function stepOnce() {
    if (!isAnimating) {
        await step();
    }
}

// Função para atualizar a interface do usuário
function updateUI() {
    document.getElementById('currentState').innerText = currentState;
    document.getElementById('headPosition').innerText = headPosition;
    document.getElementById('stepCount').innerText = stepCount;
    document.getElementById('machineStatusText').innerText = isAnimating ? 'Running' : 'Paused';
}

// Função para resetar a máquina
function resetMachine() {
    tape = document.getElementById('tapeInput').value.split(''); // Reseta a fita para a entrada inicial
    headPosition = 0;
    currentState = initialState;
    tapeOffset = 0; // Resetar o deslococamento da fita
    stepCount = 0;
    history = [];
    pauseAnimation(); // Para qualquer animação em andamento
    resetTimer();
    updateUI(); // Atualiza a interface do usuário
    drawTape(); // Redesenha a fita
    playPausebtn.innerHTML = "Play";
    populateTransitionsTable();
    highLightRow();
}

// Função para executar a simulação até o fim
async function runSimulation() {
    drawTape(); // Desenha a fita inicialmente
    while (isAnimating) {
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        if (!await step()) {
            pauseAnimation();
        }
    }
    console.log(`Máquina parou no estado final: ${currentState}`);
    console.log(`Fita final: ${tape}`);
}

// Função para rolar a fita para a esquerda ou direita
function scrollTape(direction) {
    const maxOffset = Math.max(0, tape.length - Math.floor(canvas.width / 80));
    tapeOffset = Math.min(maxOffset, Math.max(0, tapeOffset + direction));
    drawTape();
}

// Função para rolar a fita até o fim (início ou fim)
function scrollTapeToEnd(direction) {
    const cellsVisible = Math.floor(canvas.width / 80); // Número de células visíveis no canvas
    const maxOffset = Math.max(0, tape.length - cellsVisible);
    
    if (direction === -1) {
        // Rolar para o início da fita
        tapeOffset = 0;
    } else if (direction === 1) {
        // Rolar para o fim da fita
        tapeOffset = maxOffset;
    }
    
    drawTape();
}

// Função para habilitar/desabilitar os botões de scroll
function setScrollButtonsEnabled(enabled) {
    document.getElementById('scrollLeft').disabled = !enabled;
    document.getElementById('scrollRight').disabled = !enabled;
    document.getElementById('scrollLeftEnd').disabled = !enabled;
    document.getElementById('scrollRightEnd').disabled = !enabled;
    document.getElementById('stepBackBtn').disabled = !enabled;
    document.getElementById('stepBtn').disabled = !enabled;
}

// Função para inicializar a máquina de Turing a partir da entrada do usuário
function initializeMachine() {
    const statesInput = document.getElementById('statesInput').value;
    const alphabetInput = document.getElementById('alphabetInput').value;
    const transitionsInput = document.getElementById('transitionsInput').value;

    // Divide os estados e o alfabeto em arrays
    states = statesInput.split(',').map(s => s.trim());
    tapeAlphabet = alphabetInput.split(',').map(s => s.trim());

    // Parse das transições
    const transitionsArray = transitionsInput.split('\n').map(s => s.trim().split(','));

    // Converte as transições para um objeto
    transitions = {};
    for (const [currentState, readSymbol, nextState, writeSymbol, move] of transitionsArray) {
        if (!transitions[currentState]) {
            transitions[currentState] = [];
        }
        transitions[currentState].push([readSymbol, nextState, writeSymbol, move]);
    }

    // Define o estado inicial e os estados finais
    currentState = states[0];

    // Reseta a máquina
    resetMachine();

    // Atualiza a interface do usuário
    updateUI();

    console.log('Máquina de Turing inicializada com sucesso');
    console.log('Estados:', states);
    console.log('Alfabeto:', tapeAlphabet);
    console.log('Transições:', transitions);

    populateTransitionsTable();
}

function populateInputs() {
    document.getElementById('statesInput').value = states.join(',');
    document.getElementById('alphabetInput').value = tapeAlphabet.join(',');
    
    const transitionsLines = [];
    for (const state in transitions) {
        if (transitions[state].length === 0) {
            transitionsLines.push(state);
        } else {
            for (const transition of transitions[state]) {
                transitionsLines.push(`${state},${transition.join(',')}`);
            }
        }
    }
    document.getElementById('transitionsInput').value = transitionsLines.join('\n');
}

function centerHeadOnTape() {
    const canvas = document.getElementById('canvas');
    const cellsVisible = Math.floor(canvas.width / 80);
    const halfVisibleCells = Math.floor(cellsVisible / 2);

    // Verifica se a cabeça de leitura está fora das extremidades
    if (headPosition > halfVisibleCells && headPosition < tape.length - halfVisibleCells) {
        tapeOffset = Math.max(0, headPosition - halfVisibleCells);
    } else if (headPosition <= halfVisibleCells) {
        // Se a cabeça de leitura estiver perto da extremidade esquerda
        tapeOffset = 0;
    } else if (headPosition >= tape.length - halfVisibleCells) {
        // Se a cabeça de leitura estiver perto da extremidade direita
        tapeOffset = Math.max(0, tape.length - cellsVisible);
    }

    drawTape();
}

// Função para ajustar o deslocamento da fita
function adjustTapeOffset() {
    const canvas = document.getElementById('canvas');
    const cellsVisible = Math.floor(canvas.width / 80);
    const halfVisibleCells = Math.floor(cellsVisible / 2);

    if (headPosition > halfVisibleCells && headPosition < tape.length - halfVisibleCells) {
        tapeOffset = Math.max(0, headPosition - halfVisibleCells);
    } else if (headPosition <= halfVisibleCells) {
        tapeOffset = 0;
    } else if (headPosition >= tape.length - halfVisibleCells) {
        tapeOffset = Math.max(0, tape.length - cellsVisible);
    }
}

// Chamada para preencher os inputs com os valores atuais da configuração da máquina de Turing
populateInputs();
initializeMachine();
highLightRow();
drawTape();