const MEMORY_SIZE = 256;
let memory = new Array(MEMORY_SIZE).fill(0);
let breakpoints = new Array(MEMORY_SIZE).fill(false);
let memoryHighlights = {};
const memoryHistory = [];
let stateHistory = []; 
const stack = [];

const programs = {
            program1: `LOAD eax, 20  ; Carrega o valor do endereço 20 para o registrador eax
ADD eax, 21   ; Soma o valor do endereço 21 com eax
STORE eax, 22 ; Armazena o valor de eax no endereço 22
LOAD eax, 22  ; Carrega o valor de eax do endereço 22
MUL eax, 23   ; Multiplica eax pelo valor no endereço 23
STORE eax, 24 ; Armazena o resultado final no endereço 24
HALT          ; Finaliza a execução

; Dados
@20 5         ; Primeiro número
@21 3         ; Segundo número
@23 2         ; Multiplicador
        `,

            program2: `LOAD eax, 10  ; Carrega o valor do endereço 10
ADD eax, 11   ; Soma o valor do endereço 11 com eax
STORE eax, 12 ; Armazena o valor de eax no endereço 12
HALT          ; Finaliza a execução

; Dados
@10 8         ; Número inicial
@11 4         ; Número para somar
        `,

            program3: `LOAD eax, 50  ; Carrega o valor do endereço 50
SUB eax, 51   ; Subtrai o valor do endereço 51 de eax
STORE eax, 52 ; Armazena o valor de eax no endereço 52
HALT          ; Finaliza a execução

; Dados
@50 100        ; Primeiro valor
@51 50         ; Segundo valor
        `,
            program4: `; Entrada
IN eax             ; Recebe o primeiro número
STORE eax, 20      ; Armazena na memória
IN ebx             ; Recebe o segundo número
STORE ebx, 21      ; Armazena na memória

; Processamento
LOAD eax, 20       ; Carrega o primeiro número
ADD eax, 21        ; Soma com o segundo número
STORE eax, 30      ; Armazena o resultado

; Saída
LOAD eax, 30       ; Carrega o resultado
OUT eax            ; Exibe o resultado

; Finalização
HALT`
};

let registers = {
    ac: 0,
    pc: 0,
    ir: '00000000',
    mar: 0,
    mdr: 0,
    eax: 0,
    ebx: 0,
    ecx: 0,
    edx: 0,
    flags: {
        zf: 0, // Zero flag
        nf: 0  // Negative flag
    }
};

const opcodeToBinary = {
    LOAD: '0001',
    STORE: '0010',
    ADD: '0011',
    SUB: '0100',
    MUL: '0101',
    DIV: '0110',
    JUMP: '0111',
    JMPZ: '1000',
    HALT: '1111',
    NOP: '0000',
    CMP: '1001',
    CALL: '1010',
    RET: '1011',
    AND: '1100',
    OR: '1101',
    NOT: '1110',
    XOR: '1111',
    SHIFT: '0011',
    MOD: '0101',
    IN: '1010',   
    OUT: '1011' 
};

const instructionTypes = {
    ARITHMETIC: { icon: '✖️', label: 'Aritmética' },
    CONTROL_FLOW: { icon: '🔄', label: 'Controle de Fluxo' },
    LOGICAL: { icon: '⚙️', label: 'Lógica' },
    MEMORY: { icon: '💾', label: 'Memória' }
};

const opcodeToType = {
    ADD: 'ARITHMETIC',
    SUB: 'ARITHMETIC',
    MUL: 'ARITHMETIC',
    DIV: 'ARITHMETIC',
    MOD: 'ARITHMETIC',
    LOAD: 'MEMORY',
    STORE: 'MEMORY',
    JUMP: 'CONTROL_FLOW',
    JMPZ: 'CONTROL_FLOW',
    CALL: 'CONTROL_FLOW',
    RET: 'CONTROL_FLOW',
    AND: 'LOGICAL',
    OR: 'LOGICAL',
    XOR: 'LOGICAL',
    NOT: 'LOGICAL'
};

let isHalted = false;
let programLoaded = false;
let canExecuteNextStep = true;
let executionInterval = null;
let PAGE_SIZE = 64; // Quantas células cada página tem
let currentPage = 0; // Página inicial
let manualPageNavigation = false; // Controla se a navegação é manual
let registerChart;
let timeStep = 0; // Representa o tempo na execução
let memoryChart;
let heatmapChart;
let programEnd = 0;
const dataAddresses = new Set();
let activeMemoryFilter = 'all'; // Pode ser 'program', 'data', 'temp', ou 'all'

let memoryUsageStats = Array(MEMORY_SIZE).fill(null).map(() => ({
    reads: 0,
    writes: 0,
}));

const memoryAccessFrequency = new Array(MEMORY_SIZE).fill(0); // Inicializa com zeros

let executionLog = [];

let instructionCount = 0;
let instructionFrequency = {}; // Exemplo: { LOAD: 10, STORE: 5 }
let memoryReads = 0;
let memoryWrites = 0;

let BLOCK_SIZE = 40; // Tamanho inicial do bloco
const SCREEN_WIDTH = 16; // Número de blocos horizontais
const SCREEN_HEIGHT = 8; // Número de blocos verticais
const SCREEN_MEMORY_START = 256; // Início da memória gráfica

const pixelColors = new Array(SCREEN_WIDTH * SCREEN_HEIGHT).fill("#FFFFFF");

function initializeGraphicsMemory(defaultValue = 0) {
    for (let y = 0; y < SCREEN_HEIGHT; y++) {
        for (let x = 0; x < SCREEN_WIDTH; x++) {
            const byteIndex = Math.floor((y * SCREEN_WIDTH + x) / 8) + SCREEN_MEMORY_START;
            const bitIndex = x % 8;

            if (defaultValue === 1) {
                memory[byteIndex] |= (1 << (7 - bitIndex)); // Ativa o bit
            } else {
                memory[byteIndex] &= ~(1 << (7 - bitIndex)); // Desativa o bit
            }
        }
    }
    renderGraphics(); // Atualiza a grade
}

function adjustCanvasDimensions() {
    const memorySection = document.getElementById('memory-section');
    const canvas = document.getElementById('graphicsCanvas');

    const availableWidth = memorySection.offsetWidth - 40;
    const availableHeight = memorySection.offsetHeight - 100;

    const dynamicBlockSize = Math.min(
        Math.floor(availableWidth / SCREEN_WIDTH),
        Math.floor(availableHeight / SCREEN_HEIGHT)
    );

    BLOCK_SIZE = dynamicBlockSize;

    canvas.width = SCREEN_WIDTH * BLOCK_SIZE;
    canvas.height = SCREEN_HEIGHT * BLOCK_SIZE;

    renderGraphics();
}

function togglePixel(x, y) {
    const byteIndex = Math.floor((y * SCREEN_WIDTH + x) / 8) + SCREEN_MEMORY_START;
    const bitIndex = x % 8;

    memory[byteIndex] ^= (1 << (7 - bitIndex)); // Inverte o bit do pixel

    // Atualiza a cor do pixel selecionado com a cor escolhida no input
    const selectedColor = document.getElementById('pixelColor').value;
    pixelColors[y * SCREEN_WIDTH + x] = selectedColor; 
    renderGraphics();
}

function renderGraphics() {
    const canvas = document.getElementById('graphicsCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < SCREEN_HEIGHT; y++) {
        for (let x = 0; x < SCREEN_WIDTH; x++) {
            const byteIndex = Math.floor((y * SCREEN_WIDTH + x) / 8) + SCREEN_MEMORY_START;
            const bitIndex = x % 8;

            // Verifica se o pixel está ligado
            const pixelOn = (memory[byteIndex] & (1 << (7 - bitIndex))) !== 0;

            // Usa a cor armazenada para o pixel ou branco caso o pixel esteja desligado
            const pixelColor = pixelOn ? pixelColors[y * SCREEN_WIDTH + x] : '#ffffff'; // Cor específica ou branco
            ctx.fillStyle = pixelColor;
            ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            // Desenha a borda do pixel
            ctx.strokeStyle = '#ccc';
            ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    adjustCanvasDimensions();
});

window.addEventListener('resize', () => {
    adjustCanvasDimensions();
});

const graphicsCanvas = document.getElementById('graphicsCanvas');

graphicsCanvas.addEventListener('click', (event) => {
    const rect = graphicsCanvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / BLOCK_SIZE);
    const y = Math.floor((event.clientY - rect.top) / BLOCK_SIZE);

    if (x >= 0 && x < SCREEN_WIDTH && y >= 0 && y < SCREEN_HEIGHT) {
        togglePixel(x, y);
    }
});

function logExecution(instruction) {
    executionLog.push({
        timestamp: new Date().toISOString(),
        instruction: instruction,
        registers: { ...registers },
        memoryAccess: {
            address: registers.mar,
            value: registers.mdr,
        },
        flags: { ...registers.flags },
        memory: { ...memory }
    });
}

function exportLogsAsJSON() {
    if (executionLog.length === 0) {
        alert("Nenhuma informação para exportar.")
        return;
    }

    const blob = new Blob([JSON.stringify(executionLog, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'execution-log.json';
    link.click();
}

function saveState() {
    // Salva o estado atual na pilha antes de executar a instrução
    stateHistory.push({
        memory: [...memory], // Clona a memória
        registers: { ...registers, flags: { ...registers.flags } }, // Clona registradores e flags
        pc: registers.pc, // Salva o contador do programa
        mar: registers.mar,
        mdr: registers.mdr,
        graphicsMemory: memory.slice(SCREEN_MEMORY_START, SCREEN_MEMORY_START + (SCREEN_WIDTH * SCREEN_HEIGHT) / 8),
        // Adiciona métricas de execução
        instructionCount: instructionCount,
        instructionFrequency: { ...instructionFrequency },
        memoryReads: memoryReads,
        memoryWrites: memoryWrites,
    });
}

function restoreState() {
    // Restaura o último estado salvo
    if (stateHistory.length === 0) {
        alert("Nenhum estado anterior disponível.");
        return;
    }

    const prevState = stateHistory.pop();
    memory = [...prevState.memory]; // Restaura a memória
    registers = { ...prevState.registers }; // Restaura os registradores
    registers.pc = prevState.pc;
    registers.mar = prevState.mar;
    registers.mdr = prevState.mdr;

    // Restaura a memória gráfica
    for (let i = 0; i < prevState.graphicsMemory.length; i++) {
        memory[SCREEN_MEMORY_START + i] = prevState.graphicsMemory[i];
    }

    // Restaura métricas de execução
    instructionCount = prevState.instructionCount;
    instructionFrequency = { ...prevState.instructionFrequency };
    memoryReads = prevState.memoryReads;
    memoryWrites = prevState.memoryWrites;

    if (memoryReads === 0 && memoryWrites === 0) {
        document.getElementById('memoryAccessChart').style.display = 'none';
    }

    renderGraphics(); // Atualiza a tela gráfica
    updateUI(); // Atualiza a interface com o estado restaurado
}

function updatePageSize() {
    const select = document.getElementById('page-size');
    PAGE_SIZE = parseInt(select.value); // Atualiza o tamanho da página
    currentPage = 0; // Reinicia para a primeira página
    updateUI(updateChart = false);
}

function prevPage() {
    if (currentPage > 0) {
        manualPageNavigation = true; // Indica que a navegação é manual
        currentPage--;
        updateUI(updateChart = false);
        setTimeout(() => manualPageNavigation = false, 100); // Restaura a lógica automática após a atualização
    }
}

function nextPage() {
    const maxPage = Math.ceil(MEMORY_SIZE / PAGE_SIZE) - 1;
    if (currentPage < maxPage) {
        manualPageNavigation = true; // Indica que a navegação é manual
        currentPage++;
        updateUI(updateChart = false);
        setTimeout(() => manualPageNavigation = false, 100); // Restaura a lógica automática após a atualização
    }
}

function getFilteredGlobalRange() {
    const allAddresses = [];

    for (let i = 0; i < MEMORY_SIZE; i++) {
        const isProgram = i < programEnd;
        const isData = dataAddresses.has(i);
        const isTemp = !isProgram && !isData;

        // Adiciona endereços conforme o filtro ativo
        if (
            (activeMemoryFilter === 'program' && isProgram) ||
            (activeMemoryFilter === 'data' && isData) ||
            (activeMemoryFilter === 'temp' && isTemp) ||
            activeMemoryFilter === 'all' // Inclui todos
        ) {
            allAddresses.push(i);
        }
    }

    if (allAddresses.length === 0) {
        return null; // Nenhum endereço corresponde ao filtro
    }

    return {
        min: Math.min(...allAddresses),
        max: Math.max(...allAddresses)
    };
}

function validateAddress(address) {
    const range = getFilteredGlobalRange();

    if (!range) {
        alert('Nenhum endereço corresponde ao filtro ativo.');
        return false;
    }

    if (isNaN(address) || address < range.min || address > range.max) {
        alert(`Endereço inválido. Insira um valor entre ${range.min} e ${range.max}.`);
        return false;
    }

    return true;
}

function calculateFilteredPage(address) {
    const filteredAddresses = [];

    // Filtrar endereços com base no filtro ativo
    for (let i = 0; i < MEMORY_SIZE; i++) {
        const isProgram = i < programEnd;
        const isData = dataAddresses.has(i);
        const isTemp = !isProgram && !isData;

        if (
            (activeMemoryFilter === 'program' && isProgram) ||
            (activeMemoryFilter === 'data' && isData) ||
            (activeMemoryFilter === 'temp' && isTemp) ||
            activeMemoryFilter === 'all' // Inclui todos
        ) {
            filteredAddresses.push(i);
        }
    }

    // Encontra a posição do endereço no índice filtrado
    const position = filteredAddresses.indexOf(address);
    if (position === -1) {
        console.error('Endereço fora do intervalo do filtro.');
        return -1; // Endereço não encontrado
    }

    // Calcula a página com base na posição no índice filtrado
    return Math.floor(position / PAGE_SIZE);
}

function goToAddress() {
    const input = document.getElementById('search-address');
    const address = parseInt(input.value);

    // Valida o endereço
    if (!validateAddress(address)) {
        return;
    }

    // Calcula a página do endereço
    const targetPage = calculateFilteredPage(address);

    // Atualiza a página atual
    currentPage = targetPage;
    manualPageNavigation = true;

    // Atualiza a interface
    updateUI(updateChart = false);
    highlightMemorySearchCell(address, 'search'); // Destaca a célula buscada

    setTimeout(() => manualPageNavigation = false, 100); // Retorna ao modo automático
}

function highlightMemorySearchCell(address, type) {
    const memoryDiv = document.getElementById('memory');
    // Seleciona a célula com o atributo data-address igual ao endereço especificado
    const cell = memoryDiv.querySelector(`.memory-cell[data-address='${address}']`);

    if (!cell) {
        alert(`Célula com endereço ${address} não encontrada.`);
        return;
    }

    cell.classList.add(`highlight-${type}`);
    setTimeout(() => cell.classList.remove(`highlight-${type}`), 2000); // Remove destaque após 2s
}

function updateProgramStack() {
    const stackList = document.getElementById('program-stack');
    stackList.innerHTML = ''; // Limpa a lista

    // Adiciona as instruções restantes na pilha
    let hasInstructions = false;
    for (let i = registers.pc; i < MEMORY_SIZE; i++) {
        const instruction = memory[i];
        if (!instruction) break; // Para ao encontrar um espaço vazio

        const listItem = document.createElement('li');
        listItem.textContent = `${i}: ${instruction}`;
        stackList.appendChild(listItem);
        hasInstructions = true;
    }

    // Se não houver instruções, mostra a mensagem padrão
    if (!hasInstructions) {
        const placeholder = document.createElement('li');
        placeholder.textContent = 'Nenhuma instrução carregada.';
        placeholder.classList.add('placeholder');
        stackList.appendChild(placeholder);
    }
}

function applyMemoryFilterDropdown() {
    const filterSelect = document.getElementById('memory-filter-select');
    const selectedFilter = filterSelect.value; // Obtém o valor selecionado no dropdown
    applyMemoryFilter(selectedFilter); // Reutiliza a função existente
}

function applyMemoryFilter(filterType) {
    activeMemoryFilter = filterType; // Atualiza o filtro ativo
    updateUI(updateChart = false); // Re-renderiza a memória com o filtro aplicado
}

function getFilteredAddresses() {
    const filtered = [];
    for (let i = 0; i < MEMORY_SIZE; i++) {
        const isProgram = i < programEnd;
        const isData = dataAddresses.has(i);
        const isTemp = !isProgram && !isData;

        if (
            (activeMemoryFilter === 'program' && isProgram) ||
            (activeMemoryFilter === 'data' && isData) ||
            (activeMemoryFilter === 'temp' && isTemp) ||
            activeMemoryFilter === 'all'
        ) {
            filtered.push(i);
        }
    }
    return filtered;
}

function getPageAddresses(pageIndex) {
    const filteredAddresses = getFilteredAddresses();
    const start = pageIndex * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, filteredAddresses.length);
    return filteredAddresses.slice(start, end);
}

function updateGlobalAddressRangeDisplay() {
    const range = getFilteredGlobalRange();

    const rangeDisplay = document.getElementById('global-range');
    if (range) {
        rangeDisplay.textContent = `Endereços globais: ${range.min} - ${range.max}`;
    } else {
        rangeDisplay.textContent = 'Nenhum endereço corresponde ao filtro ativo.';
    }
}

function updateUI(updateChart = true, updateFlow = true, updateSecondaryChart = true) {
    document.getElementById('ac').textContent = registers.ac;
    document.getElementById('pc').textContent = registers.pc;
    document.getElementById('ir').textContent = registers.ir;
    document.getElementById('mar').textContent = registers.mar;
    document.getElementById('mdr').textContent = registers.mdr;

    document.getElementById('eax').textContent = registers.eax;
    document.getElementById('ebx').textContent = registers.ebx;
    document.getElementById('ecx').textContent = registers.ecx;
    document.getElementById('edx').textContent = registers.edx;

    updateFlags();

    const memoryDiv = document.getElementById('memory');
    memoryDiv.innerHTML = '';

    // Obter endereços filtrados para a página atual
    const filteredAddresses = getFilteredAddresses();
    const maxPage = Math.ceil(filteredAddresses.length / PAGE_SIZE) - 1;

    // Ajustar página se necessário
    currentPage = Math.max(0, Math.min(currentPage, maxPage));
    const pageAddresses = getPageAddresses(currentPage);

    for (const i of pageAddresses) {
        const isProgram = i < programEnd;
        const isData = dataAddresses.has(i);
        const isTemp = !isProgram && !isData;

        const cell = document.createElement('div');
        cell.className = 'memory-cell';
        cell.setAttribute('data-address', i);

        if (isProgram) cell.classList.add('program');
        if (isData) cell.classList.add('data');
        if (isTemp) cell.classList.add('temp');

        if (breakpoints[i]) cell.classList.add('breakpoint');
        if (i === registers.pc && programLoaded) cell.classList.add('active');

        if (memoryHighlights[i] === 'read') {
            cell.classList.add('highlight-read');
        } else if (memoryHighlights[i] === 'write') {
            cell.classList.add('highlight-write');
        }

        cell.innerHTML = `${i}: ${memory[i]}`;
        cell.setAttribute('title', `Endereço: ${i}\nDados: ${memory[i]}`);
        memoryDiv.appendChild(cell);
    }

    // Atualizar o indicador de página
    if (maxPage + 1 === 0 || maxPage + 1 === 1) {
        document.getElementById('page-indicator').textContent = ``;
        document.getElementById('prevPageBtn').style.display = 'none';
        document.getElementById('nextPageBtn').style.display = 'none';
        document.getElementById('searchAddressBtn').style.display = 'none';
        document.getElementById('search-address').style.display = 'none';
    } else {
        document.getElementById('page-indicator').textContent = `Página ${currentPage + 1} de ${maxPage + 1}`;
        document.getElementById('prevPageBtn').style.display = 'inline';
        document.getElementById('nextPageBtn').style.display = 'inline';
        document.getElementById('searchAddressBtn').style.display = 'inline';
        document.getElementById('search-address').style.display = 'inline';
    }

    // Atualizações complementares
    updateGlobalAddressRangeDisplay();
    updateProgramStack();
    updateMemoryStatsTable();

    if (updateFlow) {
        updateProgramFlow(registers.pc);
        updateFlowchart(registers.pc);
    }

    const instruction = memory[registers.pc];

    if (instruction) {
        const parts = instruction.trim().split(/[\s,]+/);
        const opcode = parts[0].toUpperCase();
        const operands = parts.slice(1).join(', ');
        // Determina o tipo da instrução
        const instructionType = opcodeToType[opcode];
        const icon = instructionTypes[instructionType]?.icon || '❓';

        updateDecodedInstruction(instruction, opcode, operands, icon);
    }

    if (updateChart) {
        updateRegisterChart();
    }

    if (updateSecondaryChart) {
        updateMemoryChart();
        updateStatsPanel();        
    }
}

function updateMemoryStatsTable() {
    const tableBody = document.getElementById('memory-stats-table').querySelector('tbody');
    tableBody.innerHTML = ''; // Limpa o conteúdo anterior

    // Filtra os endereços que foram acessados
    const accessedAddresses = memoryUsageStats
        .map((stats, address) => ({ address, ...stats }))
        .filter(stats => stats.reads > 0 || stats.writes > 0);

    if (accessedAddresses.length === 0) {
        // Exibe uma mensagem caso nenhuma operação tenha sido registrada
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Nenhum dado registrado ainda.</td></tr>';
        return;
    }

    // Ordena pelo número total de acessos
    accessedAddresses.sort((a, b) => (b.reads + b.writes) - (a.reads + a.writes));

    accessedAddresses.forEach(({ address, reads, writes }) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${address}</td>
            <td>${reads}</td>
            <td>${writes}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateFlags() {
    // Atualiza os flags visualmente
    const zfElement = document.getElementById('zf-flag');
    const nfElement = document.getElementById('nf-flag');

    if (registers.flags.zf === 1) {
        zfElement.classList.add('active');
    } else {
        zfElement.classList.remove('active');
    }

    if (registers.flags.nf === 1) {
        nfElement.classList.add('active');
    } else {
        nfElement.classList.remove('active');
    }
}

function updateALU(operand1, operator, operand2, result) {
    const operand1Elem = document.getElementById('alu-operand1');
    const operatorElem = document.getElementById('alu-operator');
    const operand2Elem = document.getElementById('alu-operand2');
    const resultElem = document.getElementById('alu-result');

    // Atualiza os valores da ULA
    operand1Elem.textContent = operand1 !== undefined ? operand1 : '-';
    operatorElem.textContent = operator || '?';
    operand2Elem.textContent = operand2 !== undefined ? operand2 : '-';
    resultElem.textContent = result !== undefined ? result : '-';

    // Aplica animação
    operand1Elem.classList.add('animate');
    operand2Elem.classList.add('animate');
    resultElem.classList.add('animate');

    // Remove animação após 500ms
    setTimeout(() => {
        operand1Elem.classList.remove('animate');
        operand2Elem.classList.remove('animate');
        resultElem.classList.remove('animate');
    }, 500);
}

function addToHistory(operation) {
    const history = document.getElementById('alu-history');
    history.innerHTML = operation + '<br>' + history.innerHTML;
}

function updateMemoryHistory(address, operation, value) {
    // Adiciona o novo registro ao início do histórico
    memoryHistory.unshift({ address, operation, value });

    // Mantém no máximo 5 registros
    if (memoryHistory.length > 5) {
        memoryHistory.pop();
    }

    // Atualiza a tabela no HTML
    const historyTableBody = document.getElementById('memory-history').querySelector('tbody');
    historyTableBody.innerHTML = ''; // Limpa a tabela

    if (memoryHistory.length === 0) {
        historyTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Nenhum acesso registrado</td></tr>';
    } else {
        memoryHistory.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.address}</td>
                <td>${entry.operation}</td>
                <td>${entry.value}</td>
            `;
            historyTableBody.appendChild(row);

            if (index === 0) {
                row.classList.add('new-entry');
                setTimeout(() => row.classList.remove('new-entry'), 1000);
            }
        });
    }
}

function makeMemoryEditable() {
    const memoryDiv = document.getElementById('memory');
    memoryDiv.addEventListener('click', (event) => {
        const cell = event.target;

        if (!cell.classList.contains('memory-cell')) return;

        const address = parseInt(cell.getAttribute('data-address'));
        const currentValue = memory[address];

        // Usa um textarea para múltiplas linhas
        const textarea = document.createElement('textarea');
        textarea.value = currentValue;
        textarea.addEventListener('blur', () => saveMemoryEdit(cell, textarea, address));
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') textarea.blur();
            if (e.key === 'Escape') cancelMemoryEdit(cell, currentValue);
        });

        cell.innerHTML = ''; // Limpa o conteúdo
        cell.appendChild(textarea);
        textarea.focus();
        cell.classList.add('editing');
    });
    memoryDiv.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Previne o menu padrão do botão direito
        const cell = event.target;

        // Certifica-se de que é uma célula de memória
        if (!cell.classList.contains('memory-cell')) return;

        const address = parseInt(cell.getAttribute('data-address'));

        // Alterna o estado do breakpoint
        breakpoints[address] = !breakpoints[address];
        cell.classList.toggle('breakpoint', breakpoints[address]); // Adiciona ou remove a classe visual
    });
}

function saveMemoryEdit(cell, input, address) {
    const newValue = input.value.trim();

    memory[address] = newValue;
    cell.textContent = `${address}: ${newValue}`;
    cell.classList.remove('editing');
    updateUI(updateChart = false, updateFlow = false);
}

function cancelMemoryEdit(cell, oldValue) {
    cell.textContent = oldValue !== undefined ? `${cell.getAttribute('data-address')}: ${oldValue}` : '-';
    cell.classList.remove('editing'); // Remove o estado de edição
}

function highlightRegister(register) {
    const regElement = document.getElementById(register);
    if (regElement) {
        regElement.parentElement.classList.add('active');
        // Remove o destaque após 500ms
        setTimeout(() => regElement.parentElement.classList.remove('active'), 500);
    }
}

function highlightMemoryCell(address, type) {
    if (!['read', 'write'].includes(type)) return;

    // Adiciona o destaque ao mapeamento
    memoryHighlights[address] = type;
    memoryAccessFrequency[address]++; // Incrementa o contador de acessos
    updateHeatmapChart(); // Atualiza o heatmap

    // Remove destaque após 500ms
    setTimeout(() => {
        delete memoryHighlights[address];
        updateUI(); // Atualiza o UI para remover o destaque
    }, 800);

    updateUI(); // Atualiza o UI imediatamente para aplicar o destaque
}

function parseProgram(programText) {
    const lines = programText.split('\n'); // Divide o texto em linhas
    const program = []; // Instruções sequenciais
    const data = {}; // Dados e instruções associadas a endereços

    for (let line of lines) {
        // Remove comentários
        line = line.split(';')[0].trim();
        if (!line) continue; // Ignora linhas vazias ou comentários

        // Processa linhas que começam com '@' (endereços específicos)
        if (line.startsWith('@')) {
            const [addressPart, ...rest] = line.substring(1).trim().split(/\s+/);
            const address = parseInt(addressPart);

            if (isNaN(address)) {
                console.error(`Endereço inválido: "${line}"`);
                continue;
            }

            // Verifica se o restante é uma instrução ou um dado
            const value = rest.join(' ').trim();
            if (!isNaN(value)) {
                data[address] = parseInt(value); // Armazena como dado
            } else {
                data[address] = value; // Armazena como instrução
            }
            continue;
        }

        // Processa instruções sequenciais (sem endereço explícito)
        program.push(line);
    }

    return { program, data };
}

function loadProgram() {
    reset();
    const programText = document.getElementById('program-input').value;

    if (!programText) {
        return;
    }

    const { program, data } = parseProgram(programText);

    // Carrega dados na memória
    for (const [address, value] of Object.entries(data)) {
        memory[address] = value;
    }

    // Carrega programa na memória
    program.forEach((instruction, index) => {
        memory[index] = instruction;
        programEnd = index + 1;
    });

    Object.keys(data).forEach(address => dataAddresses.add(parseInt(address)));

    programLoaded = true;
    updateUI(updateChart = false);
    addToHistory('Programa carregado');
    updateAluStatus('Programa carregado');
}

function updateAluStatus(operation) {
    document.getElementById('alu-status').textContent = `Última operação: ${operation}`;
}

function updateOperationResult(result) {
    document.getElementById('operation-status').textContent = 
        `Último resultado: Decimal=${result}, Hex=0x${result.toString(16)}, Bin=${result.toString(2).padStart(8, '0')}`;
}

function updateDecodedInstruction(instruction, opcode, operands, icon) {
    const binaryInstruction = instruction
        .replace(/[A-Z]+/g, (mnemonic) => opcodeToBinary[mnemonic] || '????') // Mapeia mnemônicos para binário
        .replace(/\s+/g, ' ') // Remove espaços extras
        .split(' ')
        .join(' '); // Divide os binários visualmente

    document.getElementById('binary-instruction').textContent = binaryInstruction;
    document.getElementById('mnemonic-instruction').textContent = `${icon} ${opcode} ${operands}`;
}

function updateProgramFlow(currentInstructionIndex) {
    const programFlowList = document.getElementById('program-flow');
    programFlowList.innerHTML = ''; // Limpa o fluxo anterior

    memory.forEach((instruction, index) => {
        if (!instruction || typeof instruction !== 'string') return;

        const listItem = document.createElement('li');
        listItem.textContent = `${index}: ${instruction}`;

        if (index < currentInstructionIndex) {
            listItem.classList.add('executed'); // Marcado como executado
        } else if (index === currentInstructionIndex) {
            listItem.classList.add('current'); // Marcado como atual
        }

        programFlowList.appendChild(listItem);
    });
}

function executeInstruction(instruction) {
    if (isHalted) {
        updateAluStatus('Programa finalizado');
        return;
    }

    saveState();
    logExecution(instruction);

    const parts = instruction.trim().split(/[\s,]+/);
    const opcode = parts[0].toUpperCase();
    const operands = parts.slice(1).join(', ');

    // Incrementa o contador de instruções
    instructionCount++;
    instructionFrequency[opcode] = (instructionFrequency[opcode] || 0) + 1;

    switch (opcode) {
        case 'LOAD': {
            const reg = parts[1].toLowerCase();
            const address = parseInt(parts[2]);

            memoryReads++;

            registers.mar = address; // Atualiza MAR
            registers.mdr = memory[address]; // Atualiza MDR com o valor da memória
            registers[reg] = registers.mdr; // Carrega o valor para o registrador
            registers.ac = registers.mdr;

            memoryUsageStats[address].reads++;

            highlightRegister(reg);

            updateALU('-', 'LOAD', address, registers[reg]);
            addToHistory(`LOAD ${reg} <- mem[${address}] = ${memory[address]}`);
            updateAluStatus(`LOAD: Carregado mem[${address}] para ${reg}`);
            updateOperationResult(registers[reg]);
            highlightMemoryCell(address, 'read');
            updateMemoryHistory(address, 'Leitura', memory[address]);
            break;
        }
        case 'STORE': {
            const reg = parts[1].toLowerCase();
            const address = parseInt(parts[2]);

            memoryWrites++;

            registers.mar = address; // Atualiza MAR
            registers.mdr = registers[reg]; // Atualiza MDR com o valor do registrador
            memory[address] = registers.mdr; // Armazena na memória

            memoryUsageStats[address].writes++;

            updateALU(registers[reg], 'STORE', address, '-');
            addToHistory(`STORE mem[${address}] <- ${reg} = ${registers[reg]}`);
            updateAluStatus(`STORE: Armazenado ${reg} em mem[${address}]`);
            updateOperationResult(registers[reg]);
            highlightMemoryCell(address, 'write');
            updateMemoryHistory(address, 'Escrita', memory[address]);
            break;
        }
        case 'ADD': {
            const reg = parts[1].toLowerCase();
            const address = parseInt(parts[2]);

            registers.mar = address; // Atualiza MAR
            registers.mdr = memory[address]; // Atualiza MDR com o valor da memória.
            const prevValue = registers[reg];
            registers[reg] += registers.mdr; // Soma ao registrador
            registers.ac += registers.mdr;

            highlightRegister(reg);

            updateALU(prevValue, '+', registers.mdr, registers[reg])
            addToHistory(`ADD ${reg} <- ${reg} + mem[${address}] = ${registers[reg]}`);
            updateAluStatus(`ADD: ${reg} + mem[${address}]`);
            updateOperationResult(registers[reg]);
            break;
        }
        case 'SUB': {
            const reg = parts[1].toLowerCase();
            const address = parseInt(parts[2]);

            registers.mar = address; // Atualiza MAR
            registers.mdr = memory[address]; // Atualiza MDR com o valor da memória
            const prevValue = registers[reg];
            registers[reg] -= registers.mdr; // Subtrai do registrador
            registers.ac -= registers.mdr;

            highlightRegister(reg);

            updateALU(prevValue, '-', registers.mdr, registers[reg]);
            addToHistory(`SUB ${reg} <- ${reg} - mem[${address}] = ${registers[reg]}`);
            updateAluStatus(`SUB: ${reg} - mem[${address}]`);
            updateOperationResult(registers[reg]);
            break;
        }
        case 'MUL': {
            const reg = parts[1].toLowerCase();
            const address = parseInt(parts[2]);

            registers.mar = address; // Atualiza MAR
            registers.mdr = memory[address]; // Atualiza MDR com o valor da memória
            const prevValue = registers[reg];
            registers[reg] *= registers.mdr; // Multiplica o registrador
            registers.ac *= registers.mdr;

            highlightRegister(reg);

            updateALU(prevValue, '*', registers.mdr, registers[reg]);
            addToHistory(`MUL ${reg} <- ${reg} * mem[${address}] = ${registers[reg]}`);
            updateAluStatus(`MUL: ${reg} * mem[${address}]`);
            updateOperationResult(registers[reg]);
            break;
        }
        case 'DIV': {
            const reg = parts[1].toLowerCase();
            const address = parseInt(parts[2]);

            registers.mar = address; // Atualiza MAR
            registers.mdr = memory[address]; // Atualiza MDR com o valor da memória
            const prevValue = registers[reg];
            registers[reg] = Math.floor(registers[reg] / registers.mdr); // Divide o registrador
            registers.ac = Math.floor(registers.ac / registers.mdr); 

            highlightRegister(reg);

            updateALU(prevValue, '/', registers.mdr, registers[reg]);
            addToHistory(`DIV ${reg} <- ${reg} / mem[${address}] = ${registers[reg]}`);
            updateAluStatus(`DIV: ${reg} / mem[${address}]`);
            updateOperationResult(registers[reg]);
            break;
        }
        case 'JUMP': {
            const address = parseInt(parts[1]);
            registers.pc = address - 1; // -1 porque o PC será incrementado depois

            updateALU('-', 'JUMP', address, '-');
            addToHistory(`JUMP: Pulando para ${address}`);
            updateAluStatus(`JUMP: Para endereço ${address}`);
            break;
        }
        case 'JMPZ': {
            const address = parseInt(parts[1]);
            if (registers.ac === 0) {
                registers.pc = address - 1;
                updateALU(registers.ac, 'JMPZ', address, '-');
                addToHistory(`JMPZ: AC é zero, pulando para ${address}`);
                updateAluStatus(`JMPZ: Pulando para ${address}`);
            } else {
                addToHistory('JMPZ: AC não é zero, continuando');
                updateAluStatus('JMPZ: Condição não satisfeita');
            }
            break;
        }
        case 'HALT': {
            isHalted = true;
            updateALU('-', 'HALT', '-', '-');
            addToHistory('HALT - Programa finalizado');
            updateAluStatus('HALT: Programa finalizado');
            break;
        }
        case 'NOP': {
            addToHistory('NOP: Nenhuma operação realizada');
            updateAluStatus('NOP: Avançando o PC');
            break; // O contador de programa será incrementado automaticamente
        }
        case 'CMP': {
            const address = parseInt(parts[2]);

            registers.mar = address; // Atualiza MAR
            registers.mdr = memory[address]; // Atualiza MDR com o valor da memória
            const comparison = registers.ac - registers.mdr;

            registers.flags.zf = comparison === 0 ? 1 : 0; // Define zero flag
            registers.flags.nf = comparison < 0 ? 1 : 0; // Define negative flag

            updateALU(registers.ac, '-', registers.mdr, comparison); // Atualiza a ALU
            addToHistory(`CMP: Comparado AC (${registers.ac}) com mem[${address}] (${registers.mdr})`);
            updateAluStatus('CMP: Comparação realizada');
            break;
        }
        case 'CALL': {
            const address = parseInt(parts[1]);

            if (isNaN(address) || memory[address] === undefined) {
                console.error(`CALL: Endereço inválido ou vazio (${address})`);
                addToHistory('CALL: Endereço inválido ou vazio');
                return;
            }

            // Salva o próximo endereço na pilha (retorno)
            stack.push(registers.pc + 1);

            // Atualiza o PC para a sub-rotina
            registers.pc = address - 1; // -1 porque será incrementado após a execução

            addToHistory(`CALL: Salvo retorno em ${stack[stack.length - 1]}, pulando para ${address}`);
            updateAluStatus(`CALL: Pulando para ${address}`);
            break;
        }
        case 'RET': {
            if (stack.length === 0) {
                console.error('RET: Pilha vazia, não há endereço para retornar');
                addToHistory('RET: Pilha vazia, não há endereço para retornar');
                updateAluStatus('RET: Erro - Pilha vazia');
                return;
            }

            // Recupera o endereço de retorno
            const returnAddress = stack.pop();

            // Atualiza o PC para o endereço de retorno
            registers.pc = returnAddress - 1; // -1 porque será incrementado após a execução

            addToHistory(`RET: Retornando para ${returnAddress}`);
            updateAluStatus(`RET: Retornando para ${returnAddress}`);
            break;
        }
        case 'AND': {
            const address = parseInt(parts[2]);

            registers.mar = address; // Atualiza MAR
            registers.mdr = memory[address]; // Atualiza MDR com o valor da memória
            const prevValue = registers.ac;
            registers.ac &= registers.mdr; // Operação lógica AND

            updateALU(prevValue, '&', registers.mdr, registers.ac); // Atualiza a ALU
            addToHistory(`AND AC <- AC & mem[${address}] = ${registers.ac}`);
            updateAluStatus(`AND: AC & mem[${address}]`);
            break;
        }
        case 'OR': {
            const address = parseInt(parts[2]);

            registers.mar = address; // Atualiza MAR
            registers.mdr = memory[address]; // Atualiza MDR com o valor da memória
            const prevValue = registers.ac;
            registers.ac |= registers.mdr; // Operação lógica OR

            updateALU(prevValue, '|', registers.mdr, registers.ac); // Atualiza a ALU
            addToHistory(`OR AC <- AC | mem[${address}] = ${registers.ac}`);
            updateAluStatus(`OR: AC | mem[${address}]`);
            break;
        }
        case 'NOT': {
            const prevValue = registers.ac;
            registers.ac = ~registers.ac; // Operação lógica NOT (complemento)

            updateALU(prevValue, '~', '-', registers.ac); // Atualiza a ALU
            addToHistory(`NOT AC <- ~AC = ${registers.ac}`);
            updateAluStatus('NOT: ~AC');
            break;
        }
        case 'IN': {
            const reg = parts[1].toLowerCase();

            // Roda a animação normalmente
            animateClockCycle();

            // Só pede input no fim do ciclo
            setTimeout(() => {
                const input = prompt(`Digite um valor para ${reg}:`);
                registers[reg] = parseInt(input);
                highlightRegister(reg);
                addToHistory(`IN: Registrador ${reg} <- ${input}`);
                updateUI();
            }, 3 * (executionSpeed / SPEED_RATIO)); // tempo total do ciclo
            break;
        }
        case 'OUT': {
            const reg = parts[1].toLowerCase();

            // Roda a animação completa antes do alert
            animateClockCycle();

            setTimeout(() => {
                alert(`Valor de ${reg}: ${registers[reg]}`);
                addToHistory(`OUT: Valor de ${reg} -> ${registers[reg]}`);
            }, 3 * (executionSpeed / SPEED_RATIO)); // espera o ciclo inteiro

            break;
        }
        case 'XOR': {
            const address = parseInt(parts[2]);
            registers.mar = address; // Atualiza MAR
            registers.mdr = memory[address]; // Atualiza MDR com o valor da memória
            const prevValue = registers.ac;
            registers.ac ^= registers.mdr; // Operação XOR no acumulador

            updateALU(prevValue, '^', registers.mdr, registers.ac); // Atualiza a ALU
            addToHistory(`XOR AC <- AC ^ mem[${address}] = ${registers.ac}`);
            updateAluStatus(`XOR: AC ^ mem[${address}]`);
            break;
        }
        case 'SHIFT': {
            const direction = parts[1].toLowerCase(); // Direção: 'left' ou 'right'
            const amount = parseInt(parts[2]); // Número de bits a deslocar
            const prevValue = registers.ac;

            if (direction === 'left') {
                registers.ac <<= amount; // Deslocamento para a esquerda
                updateAluStatus(`SHIFT: AC << ${amount}`);
            } else if (direction === 'right') {
                registers.ac >>= amount; // Deslocamento para a direita
                updateAluStatus(`SHIFT: AC >> ${amount}`);
            } else {
                addToHistory('SHIFT: Direção inválida (use left ou right)');
                return;
            }

            updateALU(prevValue, direction === 'left' ? '<<' : '>>', amount, registers.ac);
            addToHistory(`SHIFT AC ${direction} ${amount} = ${registers.ac}`);
            break;
        }
        case 'MOD': {
            const address = parseInt(parts[2]);
            registers.mar = address; // Atualiza MAR
            registers.mdr = memory[address]; // Atualiza MDR com o valor da memória
            const prevValue = registers.ac;

            if (registers.mdr === 0) {
                addToHistory('MOD: Divisão por zero');
                updateAluStatus('MOD: Erro - Divisão por zero');
                return;
            }

            registers.ac %= registers.mdr; // Operação de módulo
            updateALU(prevValue, '%', registers.mdr, registers.ac);
            addToHistory(`MOD AC <- AC % mem[${address}] = ${registers.ac}`);
            updateAluStatus(`MOD: AC % mem[${address}]`);
            break;
        }
        case 'POW': {
            const reg = parts[1].toLowerCase();
            const power = parseInt(parts[2]);

            if (isNaN(power)) {
                addToHistory('POW: Expoente inválido');
                updateAluStatus('POW: Erro - Expoente inválido');
                return;
            }

            const prevValue = registers[reg];
            registers[reg] = Math.pow(registers[reg], power);

            highlightRegister(reg);

            updateALU(prevValue, '^', power, registers[reg]);
            addToHistory(`POW ${reg} <- ${prevValue} ^ ${power} = ${registers[reg]}`);
            updateAluStatus(`POW: ${prevValue} ^ ${power} = ${registers[reg]}`);
            break;
        }
        case 'LOG': {
            const reg = parts[1].toLowerCase();
            const prevValue = registers[reg];

            if (registers[reg] <= 0) {
                addToHistory('LOG: Valor inválido para logaritmo');
                updateAluStatus('LOG: Erro - Valor inválido');
                return;
            }

            registers[reg] = Math.log10(registers[reg]);

            highlightRegister(reg);

            updateALU(prevValue, 'LOG', '-', registers[reg]);
            addToHistory(`LOG ${reg} <- log10(${prevValue}) = ${registers[reg]}`);
            updateAluStatus(`LOG: log10(${prevValue}) = ${registers[reg]}`);
            break;
        }
        case 'SIN': {
            const reg = parts[1].toLowerCase();
            const prevValue = registers[reg];

            registers[reg] = Math.sin(registers[reg]);

            highlightRegister(reg);

            updateALU(prevValue, 'SIN', '-', registers[reg]);
            addToHistory(`SIN ${reg} <- sin(${prevValue}) = ${registers[reg]}`);
            updateAluStatus(`SIN: sin(${prevValue}) = ${registers[reg]}`);
            break;
        }
        case 'COS': {
            const reg = parts[1].toLowerCase();
            const prevValue = registers[reg];

            registers[reg] = Math.cos(registers[reg]);

            highlightRegister(reg);

            updateALU(prevValue, 'COS', '-', registers[reg]);
            addToHistory(`COS ${reg} <- cos(${prevValue}) = ${registers[reg]}`);
            updateAluStatus(`COS: cos(${prevValue}) = ${registers[reg]}`);
            break;
        }
        case 'TAN': {
            const reg = parts[1].toLowerCase();
            const prevValue = registers[reg];

            registers[reg] = Math.tan(registers[reg]);

            highlightRegister(reg);

            updateALU(prevValue, 'TAN', '-', registers[reg]);
            addToHistory(`TAN ${reg} <- tan(${prevValue}) = ${registers[reg]}`);
            updateAluStatus(`TAN: tan(${prevValue}) = ${registers[reg]}`);
            break;
        }
        case 'PIXEL': {
            const x = parseInt(parts[1]);
            const y = parseInt(parts[2]);
            const state = parseInt(parts[3]); // 1 = ligado, 0 = desligado
            const color = document.getElementById('pixelColor').value; // Cor selecionada pelo usuário

            // Verifica se as coordenadas estão dentro dos limites
            if (isNaN(x) || isNaN(y) || isNaN(state)) {
                addToHistory('PIXEL: Parâmetros inválidos');
                updateAluStatus('PIXEL: Erro - Parâmetros inválidos');
                return;
            }

            if (x >= 0 && x < SCREEN_WIDTH && y >= 0 && y < SCREEN_HEIGHT) {
                const byteIndex = Math.floor((y * SCREEN_WIDTH + x) / 8) + SCREEN_MEMORY_START;
                const bitIndex = x % 8;

                // Atualiza o estado do pixel
                if (state === 1) {
                    memory[byteIndex] |= (1 << (7 - bitIndex)); // Ativa o bit
                } else if (state === 0) {
                    memory[byteIndex] &= ~(1 << (7 - bitIndex)); // Desativa o bit
                } else {
                    addToHistory('PIXEL: Estado inválido (use 1 para ligado ou 0 para desligado)');
                    updateAluStatus('PIXEL: Erro - Estado inválido');
                    return;
                }

                // Atualiza a cor do pixel
                pixelColors[y * SCREEN_WIDTH + x] = color; // Altera a cor do pixel

                renderGraphics(); // Atualiza a tela gráfica
                addToHistory(`PIXEL: (${x}, ${y}) ${state === 1 ? 'ligado' : 'desligado'}`);
                updateAluStatus(`PIXEL: Pixel (${x}, ${y}) ${state === 1 ? 'ligado' : 'desligado'}`);
            } else {
                addToHistory('PIXEL: Coordenadas fora dos limites');
                updateAluStatus('PIXEL: Erro - Coordenadas fora dos limites');
            }
            break;
        }
        case 'CLS': {
            initializeGraphicsMemory(); // Limpa a tela (todos os pixels desligados)
            renderGraphics(); // Atualiza a tela gráfica
            addToHistory('CLS: Tela limpa');
            updateAluStatus('CLS: Tela limpa');
            break;
        }
        case 'MOV': {
            const dest = parts[1].toLowerCase(); // Registrador de destino
            const src = parts[2].toLowerCase();  // Registrador de origem

            // Verifica se os registradores são válidos
            if (!(dest in registers) || !(src in registers)) {
                addToHistory(`MOV: Registrador inválido (${dest} ou ${src})`);
                updateAluStatus('MOV: Erro - Registrador inválido');
                return;
            }

            const prevValue = registers[dest];
            registers[dest] = registers[src]; // Move o valor do registrador de origem para o destino

            highlightRegister(dest); // Destaca o registrador alterado

            updateALU(prevValue, 'MOV', registers[src], registers[dest]); // Atualiza a ULA
            addToHistory(`MOV ${dest}, ${src}: ${dest} <- ${src} (${registers[src]})`);
            updateAluStatus(`MOV: ${src} para ${dest}`);
            break;
        }
        default: {
            addToHistory(`Instrução desconhecida: ${opcode}`);
            updateAluStatus('Instrução desconhecida');
            break;
        }
    }
    updateMemoryAccessChart(memoryReads, memoryWrites);
}

function updateFlowchart(currentInstructionIndex) {
    const flowchartDiv = document.getElementById('instruction-flowchart');
    flowchartDiv.innerHTML = ''; // Limpa o fluxograma anterior

    memory.forEach((instruction, index) => {
        if (!instruction || typeof instruction !== 'string') return;

        const node = document.createElement('div');
        node.className = 'flowchart-node';
        node.textContent = `${index}: ${instruction}`;

        // Destaque a instrução atual
        if (index === currentInstructionIndex) {
            node.classList.add('active');
        }

        flowchartDiv.appendChild(node);

        // Adiciona conectores, exceto no último
        if (index < memory.length - 1) {
            const connector = document.createElement('div');
            connector.className = 'flowchart-connector';
            flowchartDiv.appendChild(connector);
        }
    });
}

function createRegisterChart() {
    const ctx = document.getElementById('registerChart').getContext('2d');
    registerChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Adicionaremos os passos da execução
            datasets: [
                { label: 'eax', data: [], borderColor: 'red', fill: false },
                { label: 'ebx', data: [], borderColor: 'blue', fill: false },
                { label: 'ecx', data: [], borderColor: 'green', fill: false },
                { label: 'edx', data: [], borderColor: 'orange', fill: false }
            ]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Ciclo de Clock' } },
                y: { title: { display: true, text: 'Valor do Registrador' } }
            }
        }
    });
}

function createMemoryChart() {
    const ctx = document.getElementById('memoryChart').getContext('2d');
    memoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: MEMORY_SIZE }, (_, i) => i), // Endereços da memória
            datasets: [{
                label: 'Valor da Memória',
                data: memory,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Endereço de Memória' } },
                y: { title: { display: true, text: 'Valor' }, beginAtZero: true }
            }
        }
    });
}

function createHeatmapChart() {
    const ctx = document.getElementById('memory-heatmap').getContext('2d');
    heatmapChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Mapa de Calor da Memória',
                    data: [], // Os dados serão adicionados dinamicamente
                    backgroundColor: (context) => {
                        const rawData = context.raw || {}; // Verifica se context.raw existe
                        const value = rawData.frequency || 0; // Garante que frequency tenha um valor
                        if (value === 0) return 'rgba(255, 255, 255, 0.8)'; // Nenhum acesso
                        if (value < 5) return 'rgba(144, 238, 144, 0.8)'; // Verde claro
                        if (value < 15) return 'rgba(255, 255, 102, 0.8)'; // Amarelo
                        return 'rgba(255, 99, 71, 0.8)'; // Vermelho
                    },
                    pointRadius: 10, // Tamanho dos pontos
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Endereço de Memória',
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Frequência',
                    },
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const { x, y } = context.raw;
                            return `Endereço: ${x}, Acessos: ${y}`;
                        },
                    },
                },
            },
        },
    });
}

let instructionChart;
let memoryAccessChart;

function createStatsCharts() {
    // Gráfico de Barras para Instruções
    const instructionCtx = document.getElementById('instructionChart').getContext('2d');
    instructionChart = new Chart(instructionCtx, {
        type: 'bar',
        data: {
            labels: [], // Nomes das instruções
            datasets: [{
                label: 'Frequência de Instruções',
                data: [], // Frequência de cada instrução
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Instruções' } },
                y: { title: { display: true, text: 'Frequência' }, beginAtZero: true }
            }
        }
    });

    // Gráfico de Pizza para Acessos à Memória
    const memoryCtx = document.getElementById('memoryAccessChart').getContext('2d');
    memoryAccessChart = new Chart(memoryCtx, {
        type: 'pie',
        data: {
            labels: ['Leituras', 'Escritas'],
            datasets: [{
                label: 'Acessos à Memória',
                data: [0, 0], // Leituras e Escritas
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        }
    });
    const memoryChartContainer = document.getElementById('memoryAccessChart');
    memoryChartContainer.style.display = 'none';
}

function updateStatsPanel() {
    // Atualizar contadores
    document.getElementById('total-instructions').textContent = instructionCount;

    // Atualizar instrução mais frequente
    const mostFrequent = Object.keys(instructionFrequency).reduce((a, b) =>
        instructionFrequency[a] > instructionFrequency[b] ? a : b, '-');
    document.getElementById('most-frequent-instruction').textContent = mostFrequent;

    // Atualizar gráfico de barras (Frequência de Instruções)
    if (instructionChart) {
        instructionChart.data.labels = Object.keys(instructionFrequency);
        instructionChart.data.datasets[0].data = Object.values(instructionFrequency);
        instructionChart.update();
    }

    // Atualizar gráfico de pizza (Acessos à Memória)
    if (memoryAccessChart) {
        memoryAccessChart.data.datasets[0].data = [memoryReads, memoryWrites];
        memoryAccessChart.update();
    }
}

function updateMemoryAccessChart(reads, writes) {
    // Atualize os dados do gráfico de pizza
    memoryAccessChart.data.datasets[0].data = [reads, writes];

    // Atualiza o gráfico
    memoryAccessChart.update();

    // Se ambos os dados forem zero, ocultar o gráfico de pizza
    const memoryChartContainer = document.getElementById('memoryAccessChart');

    if (reads === 0 && writes === 0) {
        memoryChartContainer.style.display = 'none';  // Esconde o gráfico de pizza
    } else {
        memoryChartContainer.style.display = 'block'; // Exibe o gráfico de pizza
    }
}

function updateRegisterChart() {
    if (registerChart) {
        timeStep++;
        registerChart.data.labels.push(timeStep); // Adiciona o ciclo atual

        // Adiciona os valores dos registradores ao dataset
        registerChart.data.datasets[0].data.push(registers.eax);
        registerChart.data.datasets[1].data.push(registers.ebx);
        registerChart.data.datasets[2].data.push(registers.ecx);
        registerChart.data.datasets[3].data.push(registers.edx);

        registerChart.update(); // Atualiza o gráfico
    }
}

function updateMemoryChart() {
    if (memoryChart) {
        memoryChart.data.datasets[0].data = memory; // Atualiza os valores
        memoryChart.update(); // Redesenha o gráfico
    }
}

function updateHeatmapChart() {
    const dataset = heatmapChart.data.datasets[0];

    // Filtra os dados para incluir apenas endereços acessados
    dataset.data = memoryAccessFrequency
        .map((freq, address) => ({ x: address, y: freq, frequency: freq }))
        .filter(dataPoint => dataPoint.frequency > 0); // Exclui os que não têm acesso

    heatmapChart.update(); // Atualiza o gráfico
}

function updateClockProgress(percentage) {
    const clockProgress = document.getElementById('clock-progress');
    clockProgress.style.width = `${percentage}%`;
}

function updateGlobalProgress() {
    if (!programLoaded) {
        document.getElementById('global-progress-bar').style.width = '0%';
        return;
    }

    const totalInstructions = programEnd; // Assume que `programEnd` marca o fim do programa na memória
    const currentInstruction = registers.pc;

    // Calcula a porcentagem concluída
    const progress = Math.min((currentInstruction / totalInstructions) * 100, 100);

    // Atualiza a barra de progresso
    document.getElementById('global-progress-bar').style.width = `${progress}%`;
}

function reverseStep() {
    isHalted = false;
    restoreState(); // Restaura o estado anterior
    addToHistory('Execução reversa realizada.');
    updateAluStatus('Execução reversa.');
    updateGlobalProgress();
}

function nextStep() {
    if (!programLoaded) {
        alert('Por favor, carregue um programa primeiro.');
        return;
    }

    if (isHalted) {
        updateClockProgress(0);
        alert('Programa finalizado. Use Reset para executar novamente.');
        updateGlobalProgress();
        return;
    }

    if (!canExecuteNextStep) {
        return;
    }

    // Bloqueia a execução até o próximo ciclo
    canExecuteNextStep = false;
    document.getElementById("stepBtn").disabled = true;

    // Verifica se a instrução atual é bloqueante
    const blockingInstructions = new Set(['IN', 'OUT']);
    const currentInstruction = memory[registers.pc];

    // Se não for string, não tenta interpretar como instrução
    let opcode = "";
    if (typeof currentInstruction === "string") {
        opcode = currentInstruction.trim().split(/[\s,]+/)[0].toUpperCase();
    }

    if (!blockingInstructions.has(opcode)) {
        animateClockCycle();
    }

    // Reseta o clock
    updateClockProgress(0);

    // Simula o ciclo de clock
    setTimeout(() => {
        updateClockProgress(100); // Conclui o ciclo de clock

        const instruction = memory[registers.pc];
        if (typeof instruction === 'string') {
            registers.ir = instruction;

            // Verifica se é um breakpoint
            if (breakpoints[registers.pc]) {
                addToHistory(`Breakpoint atingido em ${registers.pc}`);
                updateAluStatus(`Breakpoint: Execução pausada em ${registers.pc}`);
                stopProgram(); // Pausa a execução automática
                canExecuteNextStep = true; // Libera a execução para o próximo ciclo
                document.getElementById("stepBtn").disabled = false;
                return;
            }

            executeInstruction(instruction);
            registers.pc++;
        }

        updateUI();
        updateGlobalProgress();

        // Libera a execução após 500ms
        const cycleDuration = 3 * (executionSpeed / SPEED_RATIO); // 3 etapas
        setTimeout(() => {
            canExecuteNextStep = true;
            document.getElementById("stepBtn").disabled = false;
        }, cycleDuration);
    }, executionSpeed / SPEED_RATIO); // Delay para o ciclo de clock
}

function runProgram() {
    if (!programLoaded) {
        alert('Por favor, carregue um programa primeiro.');
        return;
    }

    if (isHalted) {
        alert('Programa finalizado. Use Reset para executar novamente.');
        return;
    }

    if (executionInterval) {
        alert('Execução automática já está em andamento.');
        return;
    }

    nextStep();

    // Inicia o temporizador para executar instruções a cada 500ms
    executionInterval = setInterval(() => {
        if (isHalted) {
            stopProgram(); // Interrompe a execução se o programa terminou
            return;
        }
        nextStep(); // Executa a próxima instrução
    }, executionSpeed); // Pausa de 1500ms entre cada instrução
}

function stopProgram() {
    if (executionInterval) {
        clearInterval(executionInterval); // Para o temporizador
        executionInterval = null; // Reseta o controle
        updateClockProgress(0);
        alert('Execução automática interrompida.');
    }
}

let executionSpeed = 1500; 
const SPEED_RATIO = 3;

document.getElementById('speedRange').addEventListener('input', (event) => {
    executionSpeed = parseInt(event.target.value);
    document.getElementById('speedDisplay').textContent = `${executionSpeed}ms`;
});

function animateClockCycle() {
    const stages = ['fetch-stage', 'decode-stage', 'execute-stage'];

    stages.forEach((stage, index) => {
        setTimeout(() => {
            // Limpa as classes ativas de todas as etapas
            stages.forEach(s => document.getElementById(s).classList.remove('active'));

            // Ativa a etapa atual
            document.getElementById(stage).classList.add('active');
        }, index * executionSpeed / SPEED_RATIO); // 500ms por etapa
    });

    // Finaliza o ciclo após todas as etapas
    setTimeout(() => {
        stages.forEach(stage => document.getElementById(stage).classList.remove('active'));
    }, stages.length * executionSpeed / SPEED_RATIO);
}

function reset() {
    memory = new Array(MEMORY_SIZE).fill(0);
    registers = {
        ac: 0,
        pc: 0,
        ir: '00000000',
        mar: 0,
        mdr: 0,
        eax: 0,
        ebx: 0,
        ecx: 0,
        edx: 0,
        flags: {
            zf: 0, // Zero flag
            nf: 0  // Negative flag
        }
    };
    isHalted = false;
    programLoaded = false;
    
    document.getElementById('alu-history').innerHTML = 'Nenhuma operação registrada ainda.';
    document.getElementById('alu-status').textContent = 'Última operação: Nenhuma';
    document.getElementById('operation-status').textContent = 'Último resultado: -';

    document.getElementById('alu-operand1').textContent = '-';
    document.getElementById('alu-operator').textContent = '?';
    document.getElementById('alu-operand2').textContent = '-';
    document.getElementById('alu-result').textContent = '-';

    document.getElementById('global-progress-bar').style.width = '0%';

    memoryHistory.length = 0;
    memoryAccessFrequency.fill(0);
    timeStep = 0; 
    stateHistory = [];
    executionLog = [];
    instructionCount = 0;
    instructionFrequency = {}; // Exemplo: { LOAD: 10, STORE: 5 }
    memoryReads = 0;
    memoryWrites = 0;

    adjustCanvasDimensions();
    resetDecodingAndFlow();
    resetMemoryTable();
    resetMemoryStatsTable(); 
    resetBreakpoints();
    resetProgramStack();
    resetFlowchart();
    resetCharts();

    updateClockProgress(0);
    resetMemoryStyles();
    updateUI();
    stopProgram();
}

function resetFlowchart() {
    const flowchartDiv = document.getElementById('instruction-flowchart');
    flowchartDiv.innerHTML = '<div>Nenhuma instrução carregada.</div>';
}

function resetDecodingAndFlow() {
    document.getElementById('binary-instruction').textContent = '-';
    document.getElementById('mnemonic-instruction').textContent = '-';
    document.getElementById('program-flow').innerHTML = '<li>Nenhuma instrução carregada.</li>';
}

function resetMemoryStatsTable() {
    memory = new Array(MEMORY_SIZE).fill(0);
    memoryUsageStats = Array(MEMORY_SIZE).fill(null).map(() => ({
        reads: 0,
        writes: 0,
    }));
    // Outras ações de reset...
    updateMemoryStatsTable(); // Atualiza a tabela após o reset
}

function resetMemoryStyles() {
    const memoryDiv = document.getElementById('memory');
    const cells = memoryDiv.querySelectorAll('.memory-cell');

    memoryHighlights = new Array(MEMORY_SIZE).fill(null); // Reseta destaques de leitura/escrita
    dataAddresses.clear(); // Limpa os endereços de dados
    programEnd = 0; // Marca o fim do programa como 0
    breakpoints.fill(false); // Reseta todos os breakpoints
    
    cells.forEach(cell => {
        cell.classList.remove('program', 'data', 'temp', 'highlight-read', 'highlight-write', 'breakpoint', 'active');
    });
}

function resetCharts() {
    if (memoryChart) {
        memoryChart.destroy(); // Remove o gráfico atual
        createMemoryChart(); // Cria um novo gráfico
    }
    if (registerChart) {
        registerChart.destroy(); // Remove o gráfico atual
        createRegisterChart(); // Cria um novo gráfico
    }
    if (heatmapChart) {
        heatmapChart.destroy();
        createHeatmapChart();
    }
    if (instructionChart && memoryAccessChart) {
        instructionChart.destroy();
        memoryAccessChart.destroy();
        createStatsCharts();
    }
}

function resetBreakpoints() {
    breakpoints.fill(false);
    const cells = document.querySelectorAll('.memory-cell');
    cells.forEach(cell => cell.classList.remove('breakpoint'));
}

function resetMemoryTable() {
    const historyTableBody = document.getElementById('memory-history').querySelector('tbody');
    historyTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Nenhum acesso registrado</td></tr>';
}

function resetProgramStack() {
    const stackList = document.getElementById('program-stack');
    stackList.innerHTML = ''; // Limpa qualquer conteúdo existente

    const placeholder = document.createElement('li');
    placeholder.textContent = 'Nenhuma instrução carregada.';
    placeholder.classList.add('placeholder');
    stackList.appendChild(placeholder);
}

function saveProgram() {
    const programText = document.getElementById('program-input').value;
    const blob = new Blob([programText], { type: 'text/plain' }); // Cria o arquivo
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'programa.txt'; // Nome do arquivo
    link.click(); // Simula o clique para baixar o arquivo
}

function loadProgramFromFile(event) {
    const file = event.target.files[0]; // Obtém o arquivo selecionado
    if (!file) {
        alert('Nenhum arquivo selecionado.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        document.getElementById('program-input').value = content; // Atualiza o textarea
        document.getElementById('loadFileInput').value = ''; // Reseta o input para permitir novo upload
    };
    reader.readAsText(file); // Lê o conteúdo do arquivo como texto
}

// Mapeamento dos atalhos para as funções
document.addEventListener('keydown', (event) => {
    if (event.key === 'F5') {
        event.preventDefault(); // Evita o comportamento padrão do F5 (recarregar a página)
        loadProgram();
    } else if (event.key === 'F6') {
        event.preventDefault();
        const stepBtn = document.getElementById('stepBtn');
        if (!stepBtn.disabled) {
            nextStep();
        }
    } else if (event.key === 'F7') {
        event.preventDefault();
        reset();
    } else if (event.key === 'F8') {
        event.preventDefault();
        runProgram();
    } else if (event.key === 'F9') {
        event.preventDefault();
        stopProgram();
    } else if (event.key === 'F10') {
        event.preventDefault();
        reverseStep();
    }
});

function loadProgramFromDropdown() {
    const selectedProgram = document.getElementById('program-selector').value;
    const programTextArea = document.getElementById('program-input');

    if (selectedProgram && programs[selectedProgram]) {
        programTextArea.value = programs[selectedProgram]; // Carrega o programa na textarea
    } else {
        programTextArea.value = ''; // Limpa a textarea se nenhum programa for selecionado
    }
}

const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("close-modal");
const openModalBtn = document.getElementById("openModalBtn");

openModalBtn.onclick = function() {
    modal.style.display = "block";
}

closeModalBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function changeTheme() {
    const theme = document.getElementById('theme-selector').value;
    document.body.className = theme; // Define a classe do tema no <body>

    // Opcional: Salvar a preferência no localStorage
    localStorage.setItem('selectedTheme', theme);
}

// Aplicar o tema salvo ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'theme-light';
    document.body.className = savedTheme;
    document.getElementById('theme-selector').value = savedTheme;
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    makeMemoryEditable();
    reset();
    loadProgramFromDropdown();
    createRegisterChart();
    createMemoryChart();
    createHeatmapChart();
    createStatsCharts();
});