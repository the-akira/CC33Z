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
    
    // Procura a transição atual
    for (const [symbol, nextState, writeSymbol, move] of transitions[currentState]) {
        if (symbol === currentSymbol) {
            tape[headPosition] = writeSymbol; // Escreve o símbolo
            currentState = nextState; // Muda para o próximo estado
            if (move === 'L' && headPosition === 0) {
                console.log("A cabeça já está na extremidade esquerda da fita.");
                return false;
            }
            if (move === 'R' && headPosition === tape.length - 1) {
                console.log("A cabeça já está na extremidade direita da fita.");
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
    console.log(`Posição da cabeça atual: ${headPosition}`)

    // Atualiza a interface do usuário
    updateUI();

    // Redesenha a fita
    drawTape();
    return true; // Indica que a máquina deve continuar
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
        playPausebtn.innerHTML = "Pause";
    }
}

// Função para iniciar a animação
function startAnimation() {
    if (!isAnimating) {
        tapeOffset = 0; 
        isAnimating = true;
        setScrollButtonsEnabled(false);
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
    pauseAnimation();
    drawTape();
    playPausebtn.innerHTML = "Play";
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
}

// Função para resetar a máquina
function resetMachine() {
    tape = document.getElementById('tapeInput').value.split(''); // Reseta a fita para a entrada inicial
    headPosition = 0;
    currentState = initialState;
    tapeOffset = 0; // Resetar o deslococamento da fita
    pauseAnimation(); // Para qualquer animação em andamento
    updateUI(); // Atualiza a interface do usuário
    drawTape(); // Redesenha a fita
    playPausebtn.innerHTML = "Play";
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

// Chamada para preencher os inputs com os valores atuais da configuração da máquina de Turing
populateInputs();

// Inicializa a fita e desenha a fita inicialmente
drawTape();