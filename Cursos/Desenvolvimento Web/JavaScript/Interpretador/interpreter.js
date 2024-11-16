 // Definindo variáveis e memória
let variables = {};
let functions = {}; 
let programAST = [];
let output = document.getElementById("output");
let currentLine = 0;
let stack = [];
let contextStack = [];
let isFirstStep = true;
let interval = null;
let intervalId = null;
let executionInterval = 1000;
let functionLineMap = {};

let lineMap = {
    main: [], // Para o fluxo normal (fora das funções)
    functions: {} // Para cada função com o nome como chave
};

const builtInFunctions = {
    ABS: Math.abs,
    ATN: Math.atan,
    COS: Math.cos,
    EXP: Math.exp,
    INT: Math.floor,
    LOG: Math.log,
    RND: () => Math.random(),
    SIN: Math.sin,
    SQR: Math.sqrt,
    TAN: Math.tan,
};

function generateCodeLinesMapping() {
    const editor = document.getElementById("editor");
    const lines = editor.value.split("\n");
    lineMap = { main: [], functions: {} };
    
    let currentFunction = null;

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("DEF")) {
            // Inicia o mapeamento para uma nova função
            const functionName = trimmedLine.split(" ")[1];
            lineMap.functions[functionName] = [];
            currentFunction = functionName;
        } else if (trimmedLine === "END DEF") {
            // Finaliza o mapeamento da função atual
            currentFunction = null;
        } else if (trimmedLine !== "" && !trimmedLine.startsWith("#")) {
            // Adiciona a linha ao mapeamento adequado (fluxo normal ou função)
            if (currentFunction) {
                lineMap.functions[currentFunction].push(index);
            } else {
                lineMap.main.push(index);
            }
        }
    });
}

// Função para analisar o código e gerar a AST
function parseCode(code) {
    let program = [];
    let lines = code.split('\n');
    let inFunction = false;
    let functionName = "";
    let functionArgs = [];
    let functionBody = [];

    lines.forEach((line, index) => {
        line = line.trim();
        if (line.length > 0) {
            if (line.startsWith("DEF")) {
                inFunction = true;
                // Modificação para lidar com funções sem argumentos
                const match = line.match(/^DEF\s+(\w+)(?:\s+(.*))?$/i);
                functionName = match[1];
                functionArgs = match[2] ? match[2].split(',').map(arg => arg.trim()) : []; // Argumentos vazios se não houver
                functionLineMap[functionName] = { startLine: index, endLine: null };
            } else if (line === "END DEF" && inFunction) {
                functions[functionName] = { args: functionArgs, body: functionBody, name: functionName };
                functionLineMap[functionName].endLine = index;
                inFunction = false;
                functionBody = [];
            } else if (inFunction) {
                functionBody.push(line);
            } else {
                let statement = parseStatement(line);
                if (statement) {
                    program.push(statement);
                }
            }
        }
    });
    return program;
}

// Função para identificar e separar as instruções
function parseStatement(line) {
    const cleanedLine = line.split('#')[0].trim();

    if (cleanedLine === '') {
        return null; // Ignorar linha se ela estiver vazia (comentário puro)
    }

    const regexLET = /^LET\s+(\w+)\s*=\s*(.*)$/i;
    const regexPRINT = /^PRINT\s+(.*)$/i;
    const regexEND = /^END$/i;
    const regexFOR = /^FOR\s+(\w+)\s*=\s*(\d+)\s*TO\s*(\d+)\s*(STEP\s*(\d+))?/i;
    const regexNEXT = /^NEXT$/i;
    const regexIF = /^IF\s+(.*?)\s+THEN$/i;
    const regexELSE = /^ELSE$/i;
    const regexELSEIF = /^ELSEIF\s+(.*?)\s+THEN$/i;
    const regexCALL = /^CALL\s+(\w+)(?:\s+(.*))?$/i;
    const regexWHILE = /^WHILE\s+(.*)$/i;
    const regexWEND = /^END WHILE$/i;
    const regexINPUT = /^INPUT\s+(\w+)$/i;
    const regexBREAK = /^BREAK$/i;

    line = cleanedLine.replace(/\bAND\b/gi, "&&").replace(/\bOR\b/gi, "||");

    if (match = line.match(regexLET)) {
        return { type: 'LET', varName: match[1], value: match[2] };
    } else if (match = line.match(regexPRINT)) {
        return { type: 'PRINT', value: match[1] };
    } else if (regexEND.test(line)) {
        return { type: 'END' };
    } else if (match = line.match(regexFOR)) {
        return {
            type: 'FOR',
            varName: match[1],
            start: parseInt(match[2]),
            end: parseInt(match[3]),
            step: match[5] ? parseInt(match[5]) : 1
        };
    } else if (regexNEXT.test(line)) {
        return { type: 'NEXT' };
    } else if (match = line.match(regexIF)) {
        return { type: 'IF', condition: match[1] };
    } else if (match = line.match(regexELSEIF)) {
        return { type: 'ELSEIF', condition: match[1] };
    } else if (regexELSE.test(line)) {
        return { type: 'ELSE' };
    } else if (match = line.match(regexCALL)) {
        return {
            type: 'CALL',
            functionName: match[1],
            args: match[2] ? match[2].split(/\s*,\s*/) : [] // Checa se há argumentos
        };
    } else if (match = line.match(regexWHILE)) {
        return { type: 'WHILE', condition: match[1] };
    } else if (regexWEND.test(line)) {
        return { type: 'END WHILE' };
    } else if (match = line.match(regexINPUT)) { // Nova condição para INPUT
        return { type: 'INPUT', varName: match[1] };
    } else if (regexBREAK.test(line)) {
        return { type: 'BREAK' };
    } else {
        return null;
    }
}

// Função para avaliar uma expressão no contexto atual
function evaluateExpression(expr, context) {
    // Remove espaços desnecessários e verifica se a expressão é uma função embutida
    if (typeof expr !== 'string') {
        expr = String(expr); // Converte expr para string, se não for uma
    }

    const cleanedExpr = expr.trim();
    const builtInMatch = cleanedExpr.match(/^(\w+)\((.*)\)$/);

    if (builtInMatch) {
        const funcName = builtInMatch[1].toUpperCase();
        const args = builtInMatch[2].split(',').map(arg => evaluateExpression(arg.trim(), context));

        // Verifica se a função existe em `builtInFunctions`
        if (builtInFunctions[funcName]) {
            return builtInFunctions[funcName](...args);
        } else {
            console.error(`Função embutida ${funcName} não encontrada.`);
            return null;
        }
    }

    // Caso contrário, avalia a expressão como normal
    try {
        return new Function('variables', 'with(variables) { return ' + expr + '; }')(context);
    } catch (e) {
        console.error("Erro ao avaliar expressão:", expr, e);
        return 0;
    }
}

// Função para executar uma instrução em um contexto específico
function executeStatement(statement, context) {
    if (context.breakTriggered) return;

    output.innerHTML += `<strong>Executando linha ${context.currentLine + 1}:</strong> ${JSON.stringify(statement)}<br/>`;

    switch (statement.type) {
        case 'LET':
            const letValue = evaluateExpression(statement.value, context);
            context[statement.varName] = letValue;
            output.innerHTML += `Atribuindo ${letValue} à variável ${statement.varName}.<br/>`;
            break;

        case 'PRINT':
            if (!context.skipPrint) {
                let printValue = evaluateExpression(statement.value, context);
                output.innerHTML += `Imprimindo valor: ${printValue}<br/>`;
            } else {
                output.innerHTML += `Comando PRINT ignorado.<br/>`;
            }
            break;

        case 'IF':
            context.skipPrint = true; // Assuma que PRINT será ignorado inicialmente
            const condition = evaluateExpression(statement.condition, context);
            if (condition) {
                context.skipPrint = false; // Permite PRINT se a condição for verdadeira
                context.blockExecuted = true; // Marca que o bloco IF foi executado
            }
            output.innerHTML += `Avaliando condição IF: ${statement.condition} = ${condition}<br/>`;
            output.innerHTML += condition ? "Bloco IF será executado.<br/>" : "Bloco ELSEIF/ELSE será avaliado.<br/>";
            break;

        case 'ELSEIF':
            if (context.blockExecuted) {
                context.skipPrint = true; // Ignora este bloco pois um bloco IF anterior foi executado
            } else {
                const elseifCondition = evaluateExpression(statement.condition, context);
                context.skipPrint = !elseifCondition; // Permite PRINT apenas se ELSEIF for verdadeiro
                if (elseifCondition) {
                    context.blockExecuted = true; // Marca que um bloco ELSEIF foi executado
                }
                output.innerHTML += `Avaliando condição ELSEIF: ${statement.condition} = ${elseifCondition}<br/>`;
            }
            break;

        case 'ELSE':
            context.skipPrint = context.blockExecuted; // Ignora o ELSE se algum bloco IF/ELSEIF anterior foi executado
            if (!context.skipPrint) {
                output.innerHTML += `Entrando no bloco ELSE.<br/>`;
            }
            break;

        case 'END':
            context.skipPrint = false; // Reseta para o próximo bloco
            context.blockExecuted = false; // Reseta a execução do bloco para o próximo IF
            output.innerHTML += "Fim do bloco de controle IF/ELSEIF/ELSE.<br/>";
            break;

        case 'INPUT':
            const userInput = prompt(`Digite o valor para ${statement.varName}:`);
            context[statement.varName] = isNaN(userInput) ? userInput : Number(userInput);
            output.innerHTML += `Valor inserido pelo usuário para ${statement.varName}: ${context[statement.varName]}<br/>`;
            break;

        case 'FOR':
            // Avalia o valor inicial e outros parâmetros do loop
            const start = evaluateExpression(statement.start, context);
            const end = evaluateExpression(statement.end, context);
            const step = statement.step ? evaluateExpression(statement.step, context) : 1;

            context.forStack = context.forStack || [];
            
            // Define o valor inicial da variável do loop
            context[statement.varName] = start;
            
            // Armazena o contexto do loop na pilha para referência futura
            context.forStack.push({
                varName: statement.varName,
                current: start,
                end: end,
                step: step,
                bodyStart: context.currentLine + 1 // Linha onde o corpo do loop começa
            });
            output.innerHTML += `Iniciando loop FOR: ${statement.varName} de ${start} até ${end}, passo ${step}.<br/>`;
            break;

        case 'NEXT':
            if (context.forStack && context.forStack.length > 0) {
                const forLoop = context.forStack[context.forStack.length - 1];
                forLoop.current += forLoop.step;
                context[forLoop.varName] = forLoop.current;

                // Verifica se o loop deve continuar ou terminar
                if ((forLoop.step > 0 && forLoop.current <= forLoop.end) || 
                    (forLoop.step < 0 && forLoop.current >= forLoop.end)) {
                    // Retorna para o início do corpo do loop
                    context.currentLine = forLoop.bodyStart - 1;
                    output.innerHTML += `Repetindo loop FOR: ${forLoop.varName} = ${forLoop.current}<br/>`;
                } else {
                    // Remove o loop da pilha quando finalizado
                    context.forStack.pop();
                    output.innerHTML += `Finalizando loop FOR para ${forLoop.varName}.<br/>`;
                }
            } else {
                output.innerHTML += "<br/>Erro: NEXT sem FOR correspondente.<br/>";
            }
            break;

        case 'WHILE':
            const whileCondition = evaluateExpression(statement.condition, context);
            if (whileCondition) {
                context.whileStack = context.whileStack || [];
                context.whileStack.push({ condition: statement.condition, startLine: context.currentLine });
                output.innerHTML += `Iniciando loop WHILE: ${statement.condition} é verdadeiro.<br/>`;
            } else {
                while (context.currentLine < context.program.length && context.program[context.currentLine].type !== 'END WHILE') {
                    context.currentLine++;
                }
                output.innerHTML += `Condição do WHILE é falsa. Pulando para o END WHILE.<br/>`;
            }
            break;

        case 'END WHILE':
            if (context.whileStack && context.whileStack.length > 0) {
                const lastWhile = context.whileStack[context.whileStack.length - 1];
                output.innerHTML += `Reavaliando condição WHILE: ${lastWhile.condition} = ${evaluateExpression(lastWhile.condition, context)}<br/>`;
                if (evaluateExpression(lastWhile.condition, context)) {
                    context.currentLine = lastWhile.startLine;
                    resetIfState(context);
                } else {
                    context.whileStack.pop();
                    output.innerHTML += `Finalizando loop WHILE.<br/>`;
                }
            } else {
                output.innerHTML += "<br/>Erro: END WHILE sem WHILE correspondente.<br/>";
            }
            break;

        case 'CALL':
            const func = functions[statement.functionName];
            if (func) {
                const args = statement.args.map(arg => evaluateExpression(arg, context));
                executeFunction(func, args);
            } else {
                output.innerHTML += `Erro: Função ${statement.functionName} não definida.<br/>`;
            }
            break;

        case 'BREAK':
            if (!context.skipPrint) {
                context.breakTriggered = true; // Sinaliza interrupção da função
                output.innerHTML += `Instrução BREAK encontrada. Finalizando função.<br/>`;
                break;    
            }

        case 'END':
            context.executingIfBlock = false;
            context.ifConditionMet = false;
            context.inElseBlock = false;
            context.inElseIfBlock = false;
            context.elseIfCount = 0;
            break;

        default:
            output.innerHTML += `<br/>Erro: Comando desconhecido na linha ${context.currentLine + 1}.<br/>`;
    }
}

// Função para executar uma função com um novo contexto de variáveis (para recursão)
function executeFunction(func, args, isStepMode = false) {
    const functionContext = { program: parseCode(func.body.join('\n')), currentLine: 0, elseIfCount: 0, breakTriggered: false, functionName: func.name };
    func.args.forEach((argName, index) => {
        functionContext[argName] = args[index] || 0;
    });
    contextStack.push(functionContext);
    output.innerHTML += `Iniciando execução da função ${func.name}.<br/>`;

    highlightCurrentFunctionLine(func.name, functionContext.currentLine);

    // Em modo de passo, apenas cria o novo contexto e aguarda a próxima chamada do `stepProgram`.
    if (!isStepMode) {
        // Modo automático com setInterval
        interval = setInterval(() => {
            const currentContext = contextStack[contextStack.length - 1];

            if (!currentContext) {
                return;
            }

            if (currentContext.currentLine >= currentContext.program.length || currentContext.breakTriggered) {
                contextStack.pop();
                output.innerHTML += `Finalizando função ${func.name}.<br/>`;
                clearInterval(interval);
                return;
            }

            const statement = currentContext.program[currentContext.currentLine];
            currentContext.currentLine++;
            executeStatement(statement, currentContext);
        }, executionInterval); // Executa cada instrução com intervalo de 500ms
    }
}

// Função para iniciar o programa principal
function startExecution() {
    resetMemory();
    generateCodeLinesMapping();

    const code = document.getElementById("editor").value;
    const programAST = parseCode(code);

    let programContext = { program: programAST, currentLine: 0, elseIfCount: 0 };
    contextStack.push(programContext);

    intervalId = setInterval(() => {
        if (contextStack.length === 0) {
            clearInterval(intervalId);
            intervalId = null;
            output.innerHTML += "Fim do programa.<br/>";
            return;
        }

        const currentContext = contextStack[contextStack.length - 1];

        if (currentContext.currentLine >= currentContext.program.length || currentContext.breakTriggered) {
            contextStack.pop();
            if (contextStack.length === 0) {
                output.innerHTML += "Fim do programa.<br/>";
                clearInterval(intervalId);
            }
            return;
        }

        const statement = currentContext.program[currentContext.currentLine];

        processStatement(statement, currentContext);
    }, executionInterval);
}

function processStatement(statement, currentContext) {
    if (statement.type === 'CALL') {
        // Executa a função no modo de passo único
        const func = functions[statement.functionName];
        const args = statement.args.map(arg => evaluateExpression(arg, currentContext));
        executeFunction(func, args, true); // Passa true para ativar o modo de passo único
        currentContext.currentLine++; // Avança a linha após a chamada da função
    } 
    else if (currentContext.functionName) {
        executeStatement(statement, currentContext);
        currentContext.currentLine++;
        highlightCurrentFunctionLine(currentContext.functionName, currentContext.currentLine);
    } else {
        executeStatement(statement, currentContext);
        highlightCurrentLine(currentContext.currentLine);
        currentContext.currentLine++;
    }
}

function resetMemory() {
    elseIfCount = 0;
    currentLine = 0;
    output.innerHTML = "";
    variables = {};
    functions = {};              
    programAST = [];
    isFirstStep = true;
    contextStack = [];

    clearHighlight();

    // Parar o intervalo se estiver ativo
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null; // Reinicializar o ID do intervalo
    }
    if (interval !== null) {
        clearInterval(interval);
        interval = null; // Reinicializar o ID do intervalo
    }
}

function resetIfState(context) {
    context.executingIfBlock = false;
    context.ifConditionMet = false;
    context.inElseBlock = false;
    context.inElseIfBlock = false;
    context.elseifConditionMet = false;
    context.elseIfCount = 0;
}

document.getElementById("stepButton").onclick = function() {
    if (isFirstStep) {
        resetMemory();
        generateCodeLinesMapping();

        const code = document.getElementById("editor").value;
        programAST = parseCode(code);

        // Define o contexto inicial do programa
        let programContext = { program: programAST, currentLine: 0, elseIfCount: 0 };
        contextStack.push(programContext);

        isFirstStep = false; // A primeira execução já foi feita
        programFinished = false; // O programa está em execução
    }

    stepProgram(); // Executa um passo por vez quando o botão é clicado
};

function stepProgram() {
    if (contextStack.length === 0) {
        output.innerHTML += "Fim do programa.<br/>";
        programFinished = true;
        isFirstStep = true; // Permite reiniciar no próximo clique
        return;
    }

    const currentContext = contextStack[contextStack.length - 1];

    if (currentContext.currentLine >= currentContext.program.length || currentContext.breakTriggered) {
        contextStack.pop();
        if (contextStack.length === 0) {
            output.innerHTML += "Fim do programa.<br/>";
            programFinished = true;
            isFirstStep = true; // Permite reiniciar no próximo clique
        } else {
            output.innerHTML += `Retornando ao contexto anterior.<br/>`;
        }
        return;
    }

    const statement = currentContext.program[currentContext.currentLine];

    processStatement(statement, currentContext);
}

function highlightCurrentLine(logicalLine) {
    const lineNumbers = document.getElementById("line-numbers");

    // Remove qualquer destaque anterior
    Array.from(lineNumbers.children).forEach(line => line.classList.remove("highlighted"));

    // Obtém a linha física a partir do mapeamento principal (fluxo normal)
    const physicalLine = lineMap.main[logicalLine];
    if (physicalLine !== undefined) {
        const lineToHighlight = lineNumbers.children[physicalLine];
        if (lineToHighlight) {
            lineToHighlight.classList.add("highlighted");
        }
    }
}

function highlightCurrentFunctionLine(functionName, logicalLine) {
    const lineNumbers = document.getElementById("line-numbers");
    const startLine = functionLineMap[functionName].startLine;
    const endLine = functionLineMap[functionName].endLine;

    // Remove qualquer destaque anterior
    Array.from(lineNumbers.children).forEach(line => line.classList.remove("highlighted"));

    // Filtra as linhas vazias ao calcular o índice físico
    let currentLogicalLine = 0;
    let physicalLine = startLine;

    // Itera do início ao fim da função
    while (physicalLine <= endLine) {
        const lineText = document.getElementById("editor").value.split('\n')[physicalLine].trim();
        
        // Apenas considera linhas com código (não vazias) para o mapeamento
        if (lineText.length > 0) {
            if (currentLogicalLine === logicalLine) break; // Linha lógica encontrada
            currentLogicalLine++; // Avança apenas para linhas de código
        }
        physicalLine++; // Avança para a próxima linha física
    }

    // Destaca a linha física correta
    const lineToHighlight = lineNumbers.children[physicalLine];
    if (lineToHighlight) {
        lineToHighlight.classList.add("highlighted");
    }
}

function clearHighlight() {
    const lineNumbers = document.getElementById("line-numbers");
    Array.from(lineNumbers.children).forEach(line => line.classList.remove("highlighted"));
}

function updateLineNumbers() {
    const editor = document.getElementById("editor");
    const lineNumbers = document.getElementById("line-numbers");

    // Conta o número de linhas no editor
    const lines = editor.value.split("\n").length;

    // Checa se o número de linhas mudou; caso contrário, não faz nada
    const currentLineCount = lineNumbers.childElementCount;
    if (currentLineCount === lines) return;

    // Cria um DocumentFragment para evitar manipulações de DOM repetidas
    const fragment = document.createDocumentFragment();

    // Se o número de linhas aumentou
    if (lines > currentLineCount) {
        for (let i = currentLineCount + 1; i <= lines; i++) {
            const lineNumber = document.createElement("div");
            lineNumber.textContent = i;
            fragment.appendChild(lineNumber);
        }
        lineNumbers.appendChild(fragment);
    } else {
        // Se o número de linhas diminuiu, remove as linhas extras
        while (lineNumbers.childElementCount > lines) {
            lineNumbers.removeChild(lineNumbers.lastChild);
        }
    }
}

function syncScroll() {
    const editor = document.getElementById("editor");
    const lineNumbers = document.getElementById("line-numbers");
    lineNumbers.scrollTop = editor.scrollTop;
}

function handleKeyEvents(event) {
    const editor = document.getElementById("editor");

    // Quando o Enter é pressionado, rola para o final do textarea
    if (event.key === "Enter") {
        const isAtBottom = Math.abs(editor.scrollTop - (editor.scrollHeight - editor.clientHeight)) < 2;

        if (isAtBottom) {
            setTimeout(() => {
                editor.scrollTop = editor.scrollHeight;
            }, 0);  // Timeout para garantir que o scroll aconteça após a nova linha ser inserida
        }
    }

    // Quando Tab é pressionado, insere quatro espaços
    if (event.key === "Tab") {
        event.preventDefault();  // Impede o comportamento padrão de navegação para o próximo campo

        // Pega a posição do cursor
        const start = editor.selectionStart;
        const end = editor.selectionEnd;

        // Insere quatro espaços na posição do cursor
        editor.value = editor.value.substring(0, start) + "    " + editor.value.substring(end);

        // Move o cursor para depois dos quatro espaços
        editor.selectionStart = editor.selectionEnd = start + 4;
        
        // Atualiza a numeração de linhas caso necessário
        updateLineNumbers();
    }
}

const scripts = [
`LET A = 8
LET B = 8
LET C = 10
LET D = 10

IF A > B THEN
    PRINT "A é maior que B"
ELSEIF A < B THEN
    PRINT "A é menor que B"
ELSEIF A == C THEN
    PRINT "A é igual a C"
ELSEIF D == C THEN
    PRINT "D é igual a C"
ELSE
    PRINT "Nenhuma das condições acima foi atendida"
END`,

`LET X = 5
LET Y = 10

IF X > Y THEN
    PRINT "X é maior que Y"
ELSEIF X < Y THEN
    PRINT "X é menor que Y"
ELSE
    PRINT "X é igual a Y"
END`,

`DEF Test
    LET arr = [1,2,3,4,5]

    FOR I = 0 TO 4
        PRINT arr[I]
    NEXT
END DEF

Call Test`,

`FOR I = 1 TO 5 STEP 1
    PRINT I
NEXT`,

`DEF Quadrado X
   LET Result = X * X
   PRINT Result
END DEF

CALL Quadrado 4`,

`DEF Quadrado X
    FOR I = 1 TO 5 STEP 1
        PRINT I * X
    NEXT
END DEF

CALL Quadrado 2`,

`DEF AreaRet X, Y
    LET AREA = X * Y
    PRINT AREA
END DEF

CALL AreaRet 2, 5`,

`DEF TesteLogico X, Y
    IF X > Y THEN
        PRINT "X é maior que Y"
    ELSEIF X < Y THEN
        PRINT "X é menor que Y"
    ELSE
        PRINT "X é igual a Y"
    END
END DEF

CALL TesteLogico 5, 1`,

`DEF Quadrado X
    FOR I = 1 TO 5 STEP 1
        FOR J = 1 TO 5 STEP 1
            PRINT J * X
        NEXT
    NEXT
END DEF

CALL Quadrado 2`,

`DEF Teste X
   WHILE X < 3
      PRINT X
      LET X = X + 1
   END WHILE
END DEF

Call Teste 2`,

`LET X = 1

WHILE X < 6
   PRINT X
   LET X = X + 1
END WHILE`,

`INPUT X
PRINT X`,

`DEF Loop X
    INPUT Y
    PRINT X * Y
END DEF

Call Loop 2`,

`DEF Hello
    PRINT "Olá Mundo!"
    FOR I = 1 TO 5 STEP 1
        PRINT I
    NEXT
END DEF

CALL Hello`,

`# Esse é um comentário
LET arr = [0,1,2,3,4,5,6] # Inicializa um array com 7 elementos
FOR i = 0 TO 5
    PRINT arr[i] # Imprime cada elemento do array
NEXT`,

`DEF Quadrado X
    IF X <= 1 THEN
        PRINT "Condição de parada atingida."
        BREAK
    ELSE
        PRINT "Execução continua."
    END
    LET Result = X * X
    PRINT Result
    CALL Quadrado X - 1
END DEF

CALL Quadrado 2
CALL Quadrado 5`
];

function insertRandomScript() {
    const editor = document.getElementById("editor");
    const randomScript = scripts[Math.floor(Math.random() * scripts.length)];
    editor.value = randomScript;
}

function initialize() {
    insertRandomScript();
    updateLineNumbers();
}

function newRandomScript() {
    insertRandomScript();
    updateLineNumbers();
    resetMemory();
    clearHighlight();
}

window.onload = initialize;

// Seleciona os elementos
const modal = document.getElementById("modal");
const theoryModal = document.getElementById("theory-modal");
const openModalBtn = document.getElementById("openModalBtn");
const openModalTheoryBtn = document.getElementById("openModalTheoryBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeModalTeoriaBtn = document.getElementById("close-theory");

// Abre o modal ao clicar no botão "Abrir Modal"
openModalBtn.onclick = function() {
    modal.style.display = "block";
}

// Fecha o modal ao clicar no "x" ou no botão de fechar
closeModalBtn.onclick = function() {
    modal.style.display = "none";
}

openModalTheoryBtn.onclick = function() {
    theoryModal.style.display = "block";
}

closeModalTeoriaBtn.onclick = function() {
    theoryModal.style.display = "none";
}

// Fecha o modal ao clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
    if (event.target === snakeModal && !gameStarted) {
        snakeModal.style.display = "none";
        clearInterval(gameInterval);
    }
    if (event.target === theoryModal) {
        theoryModal.style.display = "none";       
    }
}

const toggleButton = document.getElementById("toggle-snake-game");
const snakeModal = document.getElementById("snake-game-modal");
const closeModal = document.getElementById("close-snake-game");
const canvas = document.getElementById("snake-game-canvas");
const ctx = canvas.getContext("2d");

let snake, food, direction, gameInterval;
let gameStarted = false; // Controle para verificar se o jogo começou
let gameOverState = false; // Controle para verificar se é "Game Over"
let score = 0; 

function startSnakeGame() {
    snake = [{ x: 10, y: 10 }]; // Reinicia a snake com posição inicial
    direction = { x: 0, y: 0 }; // Parada inicialmente
    food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) }; // Gera a comida
    gameStarted = false; // Aguarda o jogador clicar no modal para iniciar
    gameOverState = false; // Reseta o estado de "Game Over"
    score = 0;

    clearInterval(gameInterval); // Para qualquer loop anterior
    drawGame(); // Mostra o estado inicial
}

function gameLoop() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Verifica colisões
    if (
        head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || 
        (snake.length > 1 && snake.some(seg => seg.x === head.x && seg.y === head.y))
    ) {
        clearInterval(gameInterval);
        displayGameOver(); // Exibe "Game Over" no canvas
        gameStarted = false; // Permite reiniciar ao clicar no modal
        gameOverState = true; // Marca o estado como "Game Over"
        return;
    }

    // Move a Snake
    snake.unshift(head);

    // Verifica se a comida foi comida
    if (head.x === food.x && head.y === food.y) {
        food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
        score += 10;
    } else {
        snake.pop(); // Remove a cauda se não comeu
    }

    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStarted) {
        // Desenha a Snake
        snake.forEach(segment => {
            ctx.fillStyle = "#519e16";
            ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
        });

        // Desenha a comida
        ctx.fillStyle = "#9e4116";
        ctx.fillRect(food.x * 20, food.y * 20, 20, 20);      

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`Score: ${score}`, 10, 25); 
    }

    // Exibe uma mensagem para iniciar o jogo, se ainda não começou
    if (!gameStarted && !gameInterval) {
        // Exibe "Game Over" no centro do canvas
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Snake Game", canvas.width / 2, canvas.height / 2);

        // Mensagem para reiniciar
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Clique aqui para iniciar", canvas.width / 2, canvas.height / 2 + 30);
    }
}

function displayGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Exibe "Game Over" no centro do canvas
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

    // Exibe a pontuação final
    ctx.font = "20px Arial";
    ctx.fillText(`Pontuação Final: ${score}`, canvas.width / 2, canvas.height / 2 + 30);

    // Mensagem para reiniciar
    ctx.fillText("Clique para reiniciar", canvas.width / 2, canvas.height / 2 + 60);
}

function changeDirection(event) {
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (keys.includes(event.key) && gameStarted) {
        event.preventDefault();
    }
    if (gameStarted) {
        const keyMap = {
            ArrowUp: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 },
        };

        const newDirection = keyMap[event.key];
        if (newDirection && (newDirection.x !== -direction.x || newDirection.y !== -direction.y)) {
            direction = newDirection;
        }
    }
}

// Inicia ou reinicia o jogo ao clicar no modal
canvas.addEventListener("click", () => {
    if (!gameStarted) {
        startSnakeGame();
        gameStarted = true;
        direction = { x: 1, y: 0 }; // Define movimento inicial
        gameInterval = setInterval(gameLoop, 110); // Inicia o loop do jogo
    }
});

// Abre/fecha o modal
toggleButton.addEventListener("click", () => {
    if (snakeModal.style.display === "flex") {
        snakeModal.style.display = "none";
        clearInterval(gameInterval);
    } else {
        snakeModal.style.display = "flex";

        // Não reinicia o jogo se estiver no estado de "Game Over"
        if (!gameOverState) {
            startSnakeGame();
        }
    }
});

closeModal.addEventListener("click", () => {
    snakeModal.style.display = "none";
    clearInterval(gameInterval);
});

window.addEventListener("keydown", changeDirection);