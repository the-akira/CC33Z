// Definição dos estados
const states = {
    LOW: "LOW",
    HIGH: "HIGH",
};

// Variáveis para controle
let base1State = states.LOW;
let base2State = states.LOW;
let outputState = states.LOW;
let currentGate = "AND";

// Função para mudar o estado das bases
function toggleBase1() {
    base1State = base1State === states.LOW ? states.HIGH : states.LOW;
    if (base1State === "LOW") {
        toggleButton1.innerHTML = "Ligar Input 1"
        console.log('teste')
    } else {
        toggleButton1.innerHTML = "Desligar Input 1"
    }
    updateOutput();
}

function toggleBase2() {
    base2State = base2State === states.LOW ? states.HIGH : states.LOW;
    if (base2State === "LOW") {
        toggleButton2.innerHTML = "Ligar Input 2"
    } else {
        toggleButton2.innerHTML = "Desligar Input 2"
    }
    updateOutput();
}

// Função para mudar o tipo de porta lógica
function changeGate(event) {
    currentGate = event.target.value;
    updateOutput();
    if (currentGate === "NOT") {
        document.getElementById("toggleBase2").style.display = "none";
        document.getElementById("base2Indicator").style.display = "none";
    } else {
        document.getElementById("toggleBase2").style.display = "inline-block";
        document.getElementById("base2Indicator").style.display = "block";
    }
}

// Função para atualizar a saída da porta lógica
function updateOutput() {
    switch (currentGate) {
        case "AND":
            outputState = (base1State === states.HIGH && base2State === states.HIGH) ? states.HIGH : states.LOW;
            break;
        case "OR":
            outputState = (base1State === states.HIGH || base2State === states.HIGH) ? states.HIGH : states.LOW;
            break;
        case "XOR":
            outputState = (base1State !== base2State) ? states.HIGH : states.LOW;
            break;
        case "NOT":
            outputState = (base1State === states.LOW) ? states.HIGH : states.LOW;
            break;
    }
    update();
}

// Função para desenhar a porta lógica
function drawGate(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (currentGate) {
        case "AND":
            drawAndGate(ctx);
            break;
        case "OR":
            drawOrGate(ctx);
            break;
        case "XOR":
            drawXorGate(ctx);
            break;
        case "NOT":
            drawNotGate(ctx);
            break;
    }

    // Desenhar a saída
    if (outputState === states.HIGH) {
        ctx.fillStyle = "green";
        ctx.fillRect(300, 188, 25, 25);
        ctx.fillStyle = "black";
        document.getElementById("outputIndicator").style.backgroundColor = "#50fa6f";
        document.getElementById("outputIndicator").innerHTML = "ON";
    } else {
        ctx.fillStyle = "red";
        ctx.fillRect(300, 188, 25, 25);
        ctx.fillStyle = "black";
        document.getElementById("outputIndicator").style.backgroundColor = "#f55f73";
        document.getElementById("outputIndicator").innerHTML = "OFF";
    }
}

// Função para desenhar o transistor
function drawTransistor(ctx, x, y, isOn) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.stroke();

    if (isOn) {
        ctx.beginPath();
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x, y + 20);
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.strokeStyle = "black";
    }
}

// Funções para desenhar cada porta lógica
function drawAndGate(ctx) {
    ctx.lineWidth = 3;
    drawTransistor(ctx, 100, 150, base1State === states.HIGH);
    drawTransistor(ctx, 100, 250, base2State === states.HIGH);

    // Desenhar linhas de conexão
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(200, 150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, 250);
    ctx.lineTo(200, 250);
    ctx.stroke();

    // Desenhar linhas verticais centrais
    ctx.beginPath();
    ctx.moveTo(175, 150); // Ajuste aqui
    ctx.lineTo(175, 250); // Ajuste aqui
    ctx.stroke();

    // Desenhar linha horizontal para a saída
    ctx.beginPath();
    ctx.moveTo(175, 200); // Ajuste aqui
    ctx.lineTo(300, 200); 
    ctx.stroke();
}


function drawOrGate(ctx) {
    drawTransistor(ctx, 100, 150, base1State === states.HIGH);
    drawTransistor(ctx, 100, 250, base2State === states.HIGH);

    // Desenhar linhas de conexão
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(200, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, 250);
    ctx.lineTo(200, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(250, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(250, 200);
    ctx.lineTo(300, 200);
    ctx.stroke();
}

function drawXorGate(ctx) {
    drawTransistor(ctx, 100, 150, base1State === states.HIGH);
    drawTransistor(ctx, 100, 250, base2State === states.HIGH);

    // Desenhar linhas de conexão
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(200, 150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, 250);
    ctx.lineTo(200, 250);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(200, 150);
    ctx.lineTo(200, 200);
    ctx.lineTo(250, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(200, 250);
    ctx.lineTo(200, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(250, 200);
    ctx.lineTo(300, 200);
    ctx.stroke();
}

function drawNotGate(ctx) {
    drawTransistor(ctx, 100, 200, base1State === states.HIGH);

    // Desenhar linhas de conexão mais espessas
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(120, 200);
    ctx.stroke();

    // Desenhar símbolo de inversão (círculo)
    ctx.beginPath();
    ctx.arc(120, 200, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(125, 200);
    ctx.lineTo(300, 200);
    ctx.stroke();
}

// Função para atualizar a animação
function update() {
    drawGate(ctx);
    updateStateIndicator();
}

// Função para atualizar o indicador de estado
function updateStateIndicator() {
    const base1Indicator = document.getElementById("base1Indicator");
    const base2Indicator = document.getElementById("base2Indicator");
    base1Indicator.innerText = `Base 1: ${base1State}`;
    base2Indicator.innerText = `Base 2: ${base2State}`;
    if (base1State === states.HIGH) {
        base1Indicator.style.backgroundColor = "#50fa6f";
    } else {
        base1Indicator.style.backgroundColor = "#f55f73";
    }
    if (base2State === states.HIGH) {
        base2Indicator.style.backgroundColor = "#50fa6f";
    } else {
        base2Indicator.style.backgroundColor = "#f55f73";
    }
}

// Inicialização
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
drawGate(ctx);

// Eventos de clique nos botões de controle
const toggleButton1 = document.getElementById("toggleBase1");
toggleButton1.addEventListener("click", toggleBase1);

const toggleButton2 = document.getElementById("toggleBase2");
toggleButton2.addEventListener("click", toggleBase2);

// Evento de mudança no seletor de portas lógicas
const gateSelect = document.getElementById("gateSelect");
gateSelect.addEventListener("change", changeGate);

// Atualiza o indicador de estado inicialmente
updateStateIndicator();