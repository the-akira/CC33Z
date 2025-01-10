class HuffmanNode {
    constructor(char, freq) {
        this.char = char;
        this.freq = freq;
        this.left = null;
        this.right = null;
    }
}

function getTreeMetrics(node, level = 0, position = 0, metrics = { leafCount: 0, maxDepth: 0, positions: new Map() }) {
    if (!node) return metrics;

    metrics.maxDepth = Math.max(metrics.maxDepth, level);

    if (!node.left && !node.right) {
        metrics.positions.set(node, metrics.leafCount);
        metrics.leafCount++;
    }

    getTreeMetrics(node.left, level + 1, position, metrics);
    getTreeMetrics(node.right, level + 1, position, metrics);

    return metrics;
}

function buildHuffmanTree(text) {
    const frequencies = {};
    for (let char of text) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }

    const nodes = Object.entries(frequencies).map(
        ([char, freq]) => new HuffmanNode(char, freq)
    );

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        const left = nodes.shift();
        const right = nodes.shift();
        const parent = new HuffmanNode(null, left.freq + right.freq);
        parent.left = left;
        parent.right = right;
        nodes.push(parent);
    }

    return nodes[0];
}

function generateCodes(node, code = '', codes = {}) {
    if (node.char !== null) {
        codes[node.char] = code;
        return;
    }
    generateCodes(node.left, code + '0', codes);
    generateCodes(node.right, code + '1', codes);
    return codes;
}

function calculateNodePositions(node, level, metrics, positions = new Map()) {
    if (!node) return positions;

    const MIN_NODE_SPACING = 80; // Espaçamento mínimo entre nós
    const LEVEL_HEIGHT = 100; // Altura entre níveis
    
    // Calcular posição x baseada nas folhas
    let x;
    if (!node.left && !node.right) {
        x = metrics.positions.get(node) * MIN_NODE_SPACING;
    } else {
        const leftPositions = calculateNodePositions(node.left, level + 1, metrics, positions);
        const rightPositions = calculateNodePositions(node.right, level + 1, metrics, positions);
        
        const leftX = node.left ? positions.get(node.left).x : 0;
        const rightX = node.right ? positions.get(node.right).x : 0;
        
        x = (leftX + rightX) / 2;
    }

    positions.set(node, {
        x: x,
        y: level * LEVEL_HEIGHT + 50
    });

    return positions;
}

function drawTree(ctx, node, positions) {
    if (!node) return;

    const radius = 25;

    // Desenhar conexões primeiro
    if (node.left) {
        const startPos = positions.get(node);
        const endPos = positions.get(node.left);

        // Desenhar a linha da conexão
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y + radius);
        ctx.lineTo(endPos.x, endPos.y - radius);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label '0' na posição fixa
        const midX = (startPos.x + endPos.x) / 2 - 10;
        const midY = (startPos.y + endPos.y) / 2 - 10; // Ajuste para posicionar mais próximo da linha
        ctx.fillStyle = '#0066cc';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('0', midX, midY);
    }

    if (node.right) {
        const startPos = positions.get(node);
        const endPos = positions.get(node.right);

        // Desenhar a linha da conexão
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y + radius);
        ctx.lineTo(endPos.x, endPos.y - radius);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label '1' na posição fixa
        const midX = (startPos.x + endPos.x) / 2 + 10;
        const midY = (startPos.y + endPos.y) / 2 - 10; // Ajuste para posicionar mais próximo da linha
        ctx.fillStyle = '#0066cc';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('1', midX, midY);
    }

    const pos = positions.get(node);

    // Desenhar nó
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f9f9f9';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Texto do nó
    ctx.fillStyle = '#000';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const displayText = node.char ? (node.char === ' ' ? '␣' : node.char) : node.freq;
    ctx.fillText(displayText, pos.x, pos.y);

    // Recursão para os filhos
    if (node.left) drawTree(ctx, node.left, positions);
    if (node.right) drawTree(ctx, node.right, positions);
}

function calculateStatistics(text, codes) {
    const originalBits = text.length * 8;
    let compressedBits = 0;
    const charFreq = {};
    
    // Calcular frequências
    for (let char of text) {
        charFreq[char] = (charFreq[char] || 0) + 1;
    }

    // Verificar se há apenas um caractere único
    const uniqueChars = Object.keys(charFreq).length;
    if (uniqueChars < 2) {
        return {
            originalBits,
            compressedBits: originalBits, // Sem compressão
            compressionRate: "0.00",
            uniqueChars,
            frequencies: charFreq
        };
    }

    // Calcular tamanho comprimido
    for (let char of text) {
        compressedBits += codes[char].length;
    }

    const compressionRate = ((originalBits - compressedBits) / originalBits * 100).toFixed(2);

    return {
        originalBits,
        compressedBits,
        compressionRate,
        uniqueChars,
        frequencies: charFreq
    };
}

function calculateAdvancedStats(frequencies, codes, totalChars) {
    let entropy = 0;
    let expectedSize = 0;

    // Iterar sobre cada caractere para calcular as métricas
    for (const char in frequencies) {
        const freq = frequencies[char];
        const prob = freq / totalChars; // Probabilidade do caractere
        const codeLength = codes[char].length; // Comprimento do código Huffman

        // Adicionar à entropia
        entropy -= prob * Math.log2(prob);

        // Adicionar ao tamanho esperado
        expectedSize += prob * codeLength;
    }

    return { entropy, expectedSize };
}

let frequencyChart; // Variável global para o gráfico de barras
let bitDistributionChart; // Variável global para o gráfico de pizza
let sizeComparisonChart; // Gráfico de comparação de tamanhos
let bitFrequencyChart; // Gráfico de frequência de bits

function updateDetailedCharts(originalSize, compressedSize, bitFrequencies) {
    // Atualizar ou criar gráfico de comparação de tamanhos
    const sizeCtx = document.getElementById('sizeComparisonChart').getContext('2d');
    if (sizeComparisonChart) {
        sizeComparisonChart.data.datasets[0].data = [originalSize, compressedSize];
        sizeComparisonChart.update();
    } else {
        sizeComparisonChart = new Chart(sizeCtx, {
            type: 'bar',
            data: {
                labels: ['Tamanho Original', 'Tamanho Comprimido'],
                datasets: [{
                    label: 'Tamanho em bits',
                    data: [originalSize, compressedSize],
                    backgroundColor: ['#4CAF50', '#FF9800'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // Atualizar ou criar gráfico de frequência de bits
    const bitCtx = document.getElementById('bitFrequencyChart').getContext('2d');
    if (bitFrequencyChart) {
        bitFrequencyChart.data.labels = ['Bits 0', 'Bits 1'];
        bitFrequencyChart.data.datasets[0].data = [bitFrequencies['0'], bitFrequencies['1']];
        bitFrequencyChart.update();
    } else {
        bitFrequencyChart = new Chart(bitCtx, {
            type: 'pie',
            data: {
                labels: ['Bits 0', 'Bits 1'],
                datasets: [{
                    label: 'Frequência de Bits',
                    data: [bitFrequencies['0'], bitFrequencies['1']],
                    backgroundColor: ['#2196F3', '#FFC107'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: 'Frequência de Bits'
                    }
                }
            }
        });
    }
}

function calculateBitFrequencies(binaryCode) {
    const frequencies = { '0': 0, '1': 0 };

    for (const bit of binaryCode) {
        frequencies[bit]++;
    }

    return frequencies;
}

function updateCharts(stats, codes) {
    // Frequency Chart (Bar)
    const freqCtx = document.getElementById('frequencyChart').getContext('2d');
    if (frequencyChart) {
        frequencyChart.data.labels = Object.keys(stats.frequencies).map(char => char === ' ' ? '␣' : char);
        frequencyChart.data.datasets[0].data = Object.values(stats.frequencies);
        frequencyChart.update();
    } else {
        frequencyChart = new Chart(freqCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(stats.frequencies).map(char => char === ' ' ? '␣' : char),
                datasets: [{
                    label: 'Frequência de Caracteres',
                    data: Object.values(stats.frequencies),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
            }
        });
    }

    // Bit Distribution Chart (Pie)
    const bitLengths = {};
    Object.values(codes).forEach(code => {
        bitLengths[code.length] = (bitLengths[code.length] || 0) + 1;
    });

    const bitCtx = document.getElementById('bitDistributionChart').getContext('2d');
    if (bitDistributionChart) {
        bitDistributionChart.data.labels = Object.keys(bitLengths).map(len => `${len} bits`);
        bitDistributionChart.data.datasets[0].data = Object.values(bitLengths);
        bitDistributionChart.update();
    } else {
        bitDistributionChart = new Chart(bitCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(bitLengths).map(len => `${len} bits`),
                datasets: [{
                    data: Object.values(bitLengths),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#ed823b',
                        '#69ff91',
                        '#f786f0',
                        '#806030',
                    ],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: 'Distribuição do Tamanho dos Códigos'
                    }
                }
            }
        });
    }
}

function textToBinary(text) {
    return text
        .split('') // Divide o texto em caracteres
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0')) // Converte para binário e preenche com 0s
        .join(' '); // Junta os binários com um espaço entre eles
}

function updateTreeOnInput() {
    const text = document.getElementById('input').value;
    const warningMessage = document.getElementById('warningMessage');

    // Verificar caracteres únicos no texto
    const uniqueChars = new Set(text).size;

    if (!text || uniqueChars < 2) {
        // Exibir aviso dinamicamente
        warningMessage.style.display = 'block';

        // Limpar a visualização da árvore e o código binário
        document.getElementById('generatedCode').innerHTML = `<b>Texto codificado:</b> `;
        document.getElementById('originalBinary').innerHTML = '<b>Texto original:</b> ';
        const canvas = document.getElementById('treeCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Atualizar tabela e gráficos para estado vazio
        clearTableAndStats();
        return;
    }

    // Ocultar o aviso se o texto for válido
    warningMessage.style.display = 'none';

    // Gerar a nova árvore
    root = buildHuffmanTree(text);

    // Gerar os códigos e calcular as métricas
    const codes = generateCodes(root);
    const stats = calculateStatistics(text, codes);
    const advancedStats = calculateAdvancedStats(stats.frequencies, codes, text.length);

    // Converter o texto para binário (antes da compressão)
    const binaryBeforeCompression = textToBinary(text);

    // Exibir o binário original
    document.getElementById('originalBinary').innerHTML = `<b>Texto original:</b> ${binaryBeforeCompression}`;

    // Atualizar o código binário gerado
    const binaryCode = text.split('').map(char => codes[char]).join('');
    const originalSize = text.length * 8; // Cada caractere é 8 bits
    const compressedSize = binaryCode.length;
    const bitFrequencies = calculateBitFrequencies(binaryCode);

    // Atualizar gráficos detalhados
    updateDetailedCharts(originalSize, compressedSize, bitFrequencies);
    document.getElementById('generatedCode').innerHTML = `<b>Texto codificado:</b> ${binaryCode}`;

    // Atualizar a visualização da árvore
    updateTreeVisualization();

    // Atualizar tabela e gráficos com novos dados
    updateTableAndStats(stats, codes, advancedStats, text);
}

// Função para limpar a tabela e as estatísticas
function clearTableAndStats() {
    // Limpar tabela de frequências
    const tbody = document.querySelector('#frequencyTable tbody');
    tbody.innerHTML = '';

    // Redefinir estatísticas
    document.getElementById('compressionRate').textContent = '0%';
    document.getElementById('originalSize').textContent = '0 bits';
    document.getElementById('compressedSize').textContent = '0 bits';
    document.getElementById('uniqueChars').textContent = '0';

    // Redefinir estatísticas avançadas
    document.getElementById('entropy').textContent = '0 bits/caractere';
    document.getElementById('expectedSize').textContent = '0 bits';

    // Se você tem gráficos, atualize-os para valores padrão (opcional)
    resetCharts();
}

// Função para atualizar a tabela e as estatísticas
function updateTableAndStats(stats, codes, advancedStats, text) {
    // Atualizar estatísticas básicas
    document.getElementById('compressionRate').textContent = `${stats.compressionRate}%`;
    document.getElementById('originalSize').textContent = `${stats.originalBits} bits`;
    document.getElementById('compressedSize').textContent = `${stats.compressedBits} bits`;
    document.getElementById('uniqueChars').textContent = stats.uniqueChars;

    // Exibir estatísticas avançadas
    document.getElementById('entropy').textContent = `${advancedStats.entropy.toFixed(4)} bits/caractere`;
    document.getElementById('expectedSize').textContent = `${(advancedStats.expectedSize * text.length).toFixed(2)} bits`;

    // Atualizar tabela de frequências
    const tbody = document.querySelector('#frequencyTable tbody');
    tbody.innerHTML = '';
    Object.entries(codes).forEach(([char, code]) => {
        const freq = stats.frequencies[char];
        const originalBits = freq * 8;
        const compressedBits = freq * code.length;
        const savedBits = Math.max(originalBits - compressedBits, 0);

        const row = tbody.insertRow();
        row.insertCell().textContent = char === ' ' ? '(espaço)' : char;
        row.insertCell().textContent = freq;
        row.insertCell().innerHTML = `<span class="code">${code}</span>`;
        row.insertCell().textContent = `${savedBits} bits`;
    });

    // Atualizar gráficos (opcional)
    updateCharts(stats, codes);
}

function resetCharts() {
    // Redefinir gráfico de barras (frequências de caracteres)
    if (frequencyChart) {
        frequencyChart.data.labels = [];
        frequencyChart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        frequencyChart.update();
    }

    // Redefinir gráfico de pizza (distribuição de bits)
    if (bitDistributionChart) {
        bitDistributionChart.data.labels = [];
        bitDistributionChart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        bitDistributionChart.update();
    }

    // Redefinir gráfico de comparação de tamanhos
    if (sizeComparisonChart) {
        sizeComparisonChart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        sizeComparisonChart.update();
    }

    // Redefinir gráfico de frequência de bits
    if (bitFrequencyChart) {
        bitFrequencyChart.data.labels = [];
        bitFrequencyChart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        bitFrequencyChart.update();
    }
}

function updateVisualization() {
    const text = document.getElementById('input').value;
    const root = buildHuffmanTree(text);
    const codes = generateCodes(root);
    const stats = calculateStatistics(text, codes);
    const advancedStats = calculateAdvancedStats(stats.frequencies, codes, text.length);

    if (stats.uniqueChars < 2) {
        alert("O texto deve conter pelo menos dois caracteres únicos para gerar uma árvore de Huffman válida.");
        return;
    }

    // Atualizar estatísticas
    document.getElementById('compressionRate').textContent = `${stats.compressionRate}%`;
    document.getElementById('originalSize').textContent = `${stats.originalBits} bits`;
    document.getElementById('compressedSize').textContent = `${stats.compressedBits} bits`;
    document.getElementById('uniqueChars').textContent = stats.uniqueChars;

    // Exibir estatísticas avançadas
    document.getElementById('entropy').textContent = `${advancedStats.entropy.toFixed(4)} bits/caractere`;
    document.getElementById('expectedSize').textContent = `${(advancedStats.expectedSize * text.length).toFixed(2)} bits`;

    // Atualizar gráficos
    updateCharts(stats, codes);

    // Atualizar tabela
    const tbody = document.querySelector('#frequencyTable tbody');
    tbody.innerHTML = '';
    Object.entries(codes).forEach(([char, code]) => {
        const freq = stats.frequencies[char];
        const originalBits = freq * 8;
        const compressedBits = freq * code.length;
        const savedBits = originalBits - compressedBits;

        const row = tbody.insertRow();
        row.insertCell().textContent = char === ' ' ? '(espaço)' : char;
        row.insertCell().textContent = freq;
        row.insertCell().innerHTML = `<span class="code">${code}</span>`;
        row.insertCell().textContent = `${savedBits} bits`;
    });

    // Calcular métricas e posições da árvore
    const metrics = getTreeMetrics(root);
    const positions = calculateNodePositions(root, 0, metrics);

    // Ajustar tamanho do canvas
    const canvas = document.getElementById('treeCanvas');
    const minWidth = (metrics.leafCount + 1) * 80;
    const minHeight = (metrics.maxDepth + 1) * 100;

    canvas.width = Math.max(1200, minWidth + 100);
    canvas.height = Math.max(600, minHeight + 100);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Centralizar árvore
    const xOffset = (canvas.width - minWidth) / 2 + 40;
    for (let [node, pos] of positions) {
        pos.x += xOffset;
    }

    const binaryCode = text.split('').map(char => codes[char]).join('');
    const originalSize = text.length * 8; // Cada caractere é 8 bits
    const compressedSize = binaryCode.length;
    const bitFrequencies = calculateBitFrequencies(binaryCode);

    // Atualizar gráficos detalhados
    updateDetailedCharts(originalSize, compressedSize, bitFrequencies);
    document.getElementById('generatedCode').innerHTML = `<b>Texto codificado:</b> ${binaryCode}`;

    // Converter o texto para binário (antes da compressão)
    const binaryBeforeCompression = textToBinary(text);

    // Exibir o binário original
    document.getElementById('originalBinary').innerHTML = `<b>Texto original:</b> ${binaryBeforeCompression}`;

    // Desenhar árvore
    drawTree(ctx, root, positions);
    setupStepMode();

    // Adicionar tooltips
    canvas.onmousemove = function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const tooltip = document.getElementById('tooltip');
        let found = false;

        positions.forEach((pos, node) => {
            const dx = x - pos.x;
            const dy = y - pos.y;
            if (dx * dx + dy * dy < 625) { // 25² para o raio
                tooltip.style.display = 'block';
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY + 10) + 'px';
                const freq = node.freq;
                const char = node.char ? (node.char === ' ' ? '␣' : node.char) : 'interno';
                tooltip.textContent = `Nó ${char}: ${freq} ocorrências`;
                found = true;
            }
        });

        if (!found) {
            tooltip.style.display = 'none';
        }
    };
}

function decodeBinary() {
    const binaryCode = document.getElementById('generatedCode').innerHTML.replace('<b>Texto codificado:</b> ', '').trim();
    document.getElementById('decodedText').style.display = 'block';

    if (!binaryCode) {
        alert("Por favor, gere o código binário primeiro.");
        return;
    }

    const text = document.getElementById('input').value;
    const root = buildHuffmanTree(text);
    let node = root;
    let decodedText = '';
    const metrics = getTreeMetrics(root);
    const positions = calculateNodePositions(root, 0, metrics);

    const canvas = document.getElementById('treeCanvas');
    const ctx = canvas.getContext('2d');

    // Ajustar tamanho e centralizar a árvore no canvas
    const minWidth = (metrics.leafCount + 1) * 80;
    const minHeight = (metrics.maxDepth + 1) * 100;

    canvas.width = Math.max(1200, minWidth + 100);
    canvas.height = Math.max(600, minHeight + 100);

    const xOffset = (canvas.width - minWidth) / 2 + 40;
    for (let [node, pos] of positions) {
        pos.x += xOffset;
    }

    let index = 0;
    const codes = generateCodes(root);
    const compressedBinary = text.split('').map(char => codes[char]).join('');
    const totalBits = compressedBinary.length;

    // Desabilitar botão durante a animação
    deactivateButtons();

    function updateProgressBar() {
        const progress = Math.floor((index / totalBits) * 100);
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = `${progress}%`;
    }

    function highlightNode(currentNode) {
        // Redesenha a árvore com o nó atual destacado
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTree(ctx, root, positions);

        const pos = positions.get(currentNode);
        if (pos) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 30, 0, 2 * Math.PI);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    function decodeStep() {
        if (index >= binaryCode.length) {
            // Finalizou a decodificação
            activateButtons(); // Reativar os botões
            return;
        }

        // Avançar na árvore com base no bit atual
        const bit = binaryCode[index];
        node = bit === '0' ? node.left : node.right;

        // Destacar o nó atual
        highlightNode(node);

        // Se alcançar uma folha, decodifica o caractere
        if (!node.left && !node.right) {
            decodedText += node.char;
            document.getElementById('decodedText').innerHTML = `<b>Texto decodificado:</b> ${decodedText}`;
            node = root; // Retorna para a raiz para continuar a decodificação
        }

        index++;
        updateProgressBar();
        setTimeout(decodeStep, 500); // Atraso de 500ms antes de processar o próximo bit
    }

    // Atualiza a interface para o início da decodificação
    document.getElementById('decodedText').innerHTML = `<b>Texto decodificado:</b> `;
    
    // Inicia o processo de decodificação animada
    decodeStep();
}

let binaryCode = '';
let stepIndex = 0;
let stepDecodedText = '';
let currentNode = null;
let root = null;
let positions = null;

// Configuração inicial para o modo passo a passo
function setupStepMode() {
    // Obter o código binário gerado
    binaryCode = document.getElementById('generatedCode').innerHTML.replace('<b>Texto codificado:</b> ', '').trim();

    if (!binaryCode) {
        alert("Por favor, gere o código binário primeiro.");
        return;
    }

    // Configurar árvore e variáveis
    const text = document.getElementById('input').value;
    root = buildHuffmanTree(text);
    currentNode = root;
    stepIndex = 0;
    stepDecodedText = '';

    // Calcular posições dos nós
    const metrics = getTreeMetrics(root);
    positions = calculateNodePositions(root, 0, metrics);

    // Centralizar e desenhar a árvore no canvas
    const canvas = document.getElementById('treeCanvas');
    const ctx = canvas.getContext('2d');
    const minWidth = (metrics.leafCount + 1) * 80;
    const minHeight = (metrics.maxDepth + 1) * 100;

    canvas.width = Math.max(1200, minWidth + 100);
    canvas.height = Math.max(600, minHeight + 100);

    const xOffset = (canvas.width - minWidth) / 2 + 40;
    for (let [node, pos] of positions) {
        pos.x += xOffset;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(ctx, root, positions);

    // Resetar texto decodificado
    document.getElementById('stepDecodedText').innerHTML = `<b>Texto decodificado (passo a passo):</b> `;

    // Habilitar os botões
    toggleButton(document.getElementById('stepButton'), true);
    toggleButton(document.getElementById('resetButton'), true);
}

// Função para destacar o nó atual na árvore
function highlightCurrentNode() {
    const canvas = document.getElementById('treeCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(ctx, root, positions);

    if (currentNode) {
        const pos = positions.get(currentNode);
        if (pos) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 30, 0, 2 * Math.PI);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
}

// Avança um passo na decodificação
function nextStep() {
    if (!binaryCode) {
        alert("Por favor, gere o código binário antes de começar o modo passo a passo.");
        return;
    }

    if (stepIndex >= binaryCode.length) {
        alert("Decodificação completa!");
        toggleButton(document.getElementById('stepButton'), false); // Desativa o botão "Próximo Passo"
        return;
    }

    const codes = generateCodes(root);
    const text = document.getElementById('input').value;
    const compressedBinary = text.split('').map(char => codes[char]).join('');
    const totalBits = compressedBinary.length;

    function updateProgressBar() {
        const progress = Math.floor((stepIndex / totalBits) * 100);
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = `${progress}%`;
    }

    const bit = binaryCode[stepIndex];
    currentNode = bit === '0' ? currentNode.left : currentNode.right;

    if (!currentNode) {
        alert("Erro: Nó atual é nulo. Verifique o processo de geração da árvore.");
        return;
    }

    // Destaca o nó atual
    highlightCurrentNode();
    document.getElementById('stepDecodedText').style.display = 'block';

    // Se alcançar uma folha, decodifica o caractere
    if (!currentNode.left && !currentNode.right) {
        stepDecodedText += currentNode.char;

        // Atualiza o texto decodificado no passo
        document.getElementById('stepDecodedText').innerHTML = `<b>Texto decodificado (passo a passo):</b> ${stepDecodedText}`;

        // Após destacar, volta para a raiz
        currentNode = root;
    }

    stepIndex++;
    updateProgressBar();
}

// Reinicia o processo de decodificação
function resetDecoding() {
    setupStepMode();
    document.getElementById('stepDecodedText').style.display = 'none';
    document.getElementById('decodedText').style.display = 'none';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('fileButton').textContent = 'Carregar e Comprimir Arquivo';
    document.getElementById('decompressButton').textContent = 'Carregar para Descompressão';
    isFileUploaded = false;
    isDecompressionReady = false;
}

function toggleButton(button, isActive) {
    if (isActive) {
        button.classList.remove('disabled');
        button.disabled = false;
    } else {
        button.classList.add('disabled');
        button.disabled = true;
    }
}

const decodeButton = document.querySelector('button[onclick="decodeBinary()"]');
const nextStepButton = document.querySelector('button[onclick="nextStep()"]');
const resetButton = document.querySelector('button[onclick="resetDecoding()"]');
const exportButton = document.querySelector('button[onclick="exportTree()"]');
const importButton = document.getElementById('importTreeInputButton');
const fileButton = document.getElementById('fileButton');
const decompressButton = document.getElementById('decompressButton');

function deactivateButtons() {
    toggleButton(decodeButton, false);
    toggleButton(nextStepButton, false);
    toggleButton(resetButton, false);
    toggleButton(exportButton, false);
    toggleButton(importButton, false);
    toggleButton(fileButton, false);
    toggleButton(decompressButton, false);
}

function activateButtons() {
    toggleButton(decodeButton, true);
    toggleButton(nextStepButton, true);
    toggleButton(resetButton, true);
    toggleButton(exportButton, true);
    toggleButton(importButton, true);
    toggleButton(fileButton, true);
    toggleButton(decompressButton, true);
}

function exportTree() {
    if (!root) {
        alert("Por favor, gere uma árvore antes de exportar.");
        return;
    }

    // Capturar o texto do input
    const textInput = document.getElementById('input').value;

    // Exportar JSON da árvore com o texto do input
    const exportData = {
        tree: root,
        text: textInput
    };

    const treeJSON = JSON.stringify(exportData);

    // Criar o arquivo JSON
    const blobJSON = new Blob([treeJSON], { type: 'application/json' });
    const urlJSON = URL.createObjectURL(blobJSON);
    const aJSON = document.createElement('a');
    aJSON.href = urlJSON;
    aJSON.download = 'huffman_tree.json';
    aJSON.click();

    // Exportar imagem do canvas
    const canvas = document.getElementById('treeCanvas');
    canvas.toBlob(function(blob) {
        const urlImage = URL.createObjectURL(blob);
        const aImage = document.createElement('a');
        aImage.href = urlImage;
        aImage.download = 'huffman_tree.png';
        aImage.click();

        // Limpar os objetos URL
        URL.revokeObjectURL(urlJSON);
        URL.revokeObjectURL(urlImage);
    });
}

function importTree(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("Nenhum arquivo selecionado.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);

            // Restaurar a árvore e o texto do input
            root = importedData.tree;
            const textInput = importedData.text || '';
            document.getElementById('input').value = textInput;

            // Atualizar visualização da árvore
            updateTreeVisualization();
        } catch (error) {
            alert("Erro ao importar a árvore. Certifique-se de que o arquivo é válido.");
            console.error(error);
        }
    };

    reader.readAsText(file);
}

function updateTreeVisualization() {
    const metrics = getTreeMetrics(root);
    const positions = calculateNodePositions(root, 0, metrics);

    const canvas = document.getElementById('treeCanvas');
    const ctx = canvas.getContext('2d');

    const minWidth = (metrics.leafCount + 1) * 80;
    const minHeight = (metrics.maxDepth + 1) * 100;

    canvas.width = Math.max(1200, minWidth + 100);
    canvas.height = Math.max(600, minHeight + 100);

    const xOffset = (canvas.width - minWidth) / 2 + 40;
    for (let [node, pos] of positions) {
        pos.x += xOffset;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(ctx, root, positions);
    updateVisualization();
}

let originalFileContent = ''; // Conteúdo original do arquivo
let compressedBinary = ''; // Código binário comprimido
let huffmanTree = null; // Árvore de Huffman
let isFileUploaded = false; // Estado para alternar entre upload e download

function handleFileUploadOrDownload() {
    if (!isFileUploaded) {
        // Clique inicial: aciona o input de arquivo
        document.getElementById('fileInput').click();
    } else {
        // Clique após upload: baixa o arquivo comprimido
        downloadCompressedFile();
    }
}

function processFile(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('Nenhum arquivo selecionado.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        originalFileContent = e.target.result;

        if (originalFileContent.length < 2) {
            alert('O arquivo deve conter pelo menos dois caracteres únicos.');
            return;
        }

        // Comprimir o conteúdo do arquivo
        huffmanTree = buildHuffmanTree(originalFileContent);
        const codes = generateCodes(huffmanTree);
        compressedBinary = originalFileContent.split('').map(char => codes[char]).join('');

        // Atualizar o botão para "Baixar Arquivo Comprimido"
        isFileUploaded = true;
        document.getElementById('fileButton').textContent = 'Baixar Arquivo Comprimido';
        alert('Arquivo carregado e comprimido com sucesso!');
    };

    reader.readAsText(file);
}

function downloadCompressedFile() {
    if (!compressedBinary || !huffmanTree) {
        alert('Nenhum arquivo foi comprimido ainda.');
        return;
    }

    // Serializa a árvore e o binário
    const data = {
        tree: serializeHuffmanTree(huffmanTree),
        binary: compressedBinary
    };

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed.json';
    a.click();

    URL.revokeObjectURL(url);
}

// Serializar a árvore para JSON
function serializeHuffmanTree(node) {
    if (!node) return null;
    return {
        char: node.char || null,
        freq: node.freq || null,
        left: serializeHuffmanTree(node.left),
        right: serializeHuffmanTree(node.right)
    };
}

let isDecompressionReady = false; // Estado para alternar entre upload e download
let decompressedContent = ''; // Armazena o texto descomprimido

function handleDecompressAction() {
    if (!isDecompressionReady) {
        // Clique inicial: aciona o input de arquivo
        document.getElementById('decompressedFileInput').click();
    } else {
        // Clique após descompressão: baixa o arquivo descomprimido
        downloadDecompressedFile(decompressedContent);
    }
}

function processDecompressedFile(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('Nenhum arquivo selecionado.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);

        if (!data.tree || !data.binary) {
            alert('O arquivo selecionado não é válido para descompressão.');
            return;
        }

        // Reconstruir a árvore
        huffmanTree = deserializeHuffmanTree(data.tree);
        compressedBinary = data.binary;

        // Descomprimir
        decompressedContent = decompressBinary(compressedBinary, huffmanTree);

        // Atualizar o botão para "Baixar Arquivo Descomprimido"
        isDecompressionReady = true;
        document.getElementById('decompressButton').textContent = 'Baixar Arquivo Descomprimido';
        alert('Arquivo descomprimido com sucesso!');
    };

    reader.readAsText(file);
}

// Desserializar a árvore
function deserializeHuffmanTree(data) {
    if (!data) return null;
    return {
        char: data.char,
        freq: data.freq,
        left: deserializeHuffmanTree(data.left),
        right: deserializeHuffmanTree(data.right)
    };
}

function decompressBinary(binary, tree) {
    let currentNode = tree;
    let decompressedText = '';

    for (const bit of binary) {
        currentNode = bit === '0' ? currentNode.left : currentNode.right;

        // Se for um nó folha
        if (!currentNode.left && !currentNode.right) {
            decompressedText += currentNode.char || '';
            currentNode = tree; // Voltar para a raiz
        }
    }

    return decompressedText;
}

function downloadDecompressedFile(decompressedText) {
    const blob = new Blob([decompressedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decompressed.txt';
    a.click();

    URL.revokeObjectURL(url);
}

// Inicializar visualização
updateVisualization();
setupStepMode();