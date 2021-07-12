// Definindo uma função básica
function multiplicar(x,y) {
    var total = x * y;
    return total;
}

z = multiplicar(3,30);
console.log(z);
console.log(multiplicar()) 
console.log(multiplicar(2,3)) 
console.log(multiplicar(2,3,4))

// Função de multiplicação melhorada
function multiply() {
    var soma = 1;
    for (var i = 0, j = arguments.length; i < j; i++) {
        soma *= arguments[i];
    }
    return soma;
}

console.log(multiply(2,2,2,2,2,2,2,2))

// Função de cálculo de média
function media() {
    var soma = 0;
    for (var i = 0, j = arguments.length; i < j; i++) {
        soma += arguments[i];
    }
    return soma / arguments.length;
}

console.log(media(10,5,6))

// Função de cálculo de média melhorada
function average(...args) {
    var soma = 0;
    for (let valor of args) {
        soma += valor;
    }
    return soma / args.length;
}

console.log(average(10,5,6))

// Função que cálcula a média dos valores de um array
function mediaArray(arr) {
    var soma = 0;
    for (var i = 0, j = arr.length; i < j; i++) {
        soma += arr[i];
    }
    return soma / arr.length;
}

console.log(mediaArray([5,5,5,5,5,5,5]));

// Definindo uma função anônima
let média = function () {
    var soma = 0;
    for(var i = 0, j = arguments.length; i < j; i++) {
        soma += arguments[i];
    }
    return soma / arguments.length;
}

console.log(média(2,3))

// Funções aninhadas
function f1(){
    var a = 1;
    function f2() {
        var b = 4;
        return a + b;
    }
    return f2;
}

console.log(f1()())

// Closures
function adder(a) {
    return function(b) {
        return a + b;
    };
}
var add5 = adder(5);
var add20 = adder(20);
console.log(add5(6)); // 11
console.log(add20(7)); // 27

// Criando contadores com Closures
function counter(x) {
    let k = 0;
    return function() {
        k = k + x;
        return k;
    }
}

var c = counter(2);
for (var i = 0; i < 10; i++) {
    console.log(c());
}

var contador = counter(1)
for (var i = 0; i < 20; i++) {
    console.log(contador());
}