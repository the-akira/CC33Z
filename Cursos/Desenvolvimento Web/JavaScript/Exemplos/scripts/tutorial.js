// Números Básico
console.log(3/2);
console.log(Math.floor(3/2));

var r = 5;
console.log(Math.sin(3.5));
let circumference = 2 * Math.PI * r;

console.log(`Circunferência = ${circumference}`);

// Conversão: String -> Inteiro
let [a, b, c] = ['333','111','ff'];

console.log(parseInt(a,10));
console.log(parseInt(b,2));
console.log(parseInt(c,16));

// Strings
let nome = "gabriel";
console.log(nome.length);
console.log(nome.charAt(0));
console.log(nome.replace("gabri","rafa"));
console.log(nome.toUpperCase());

// Tipos
console.log(Boolean(''));
console.log(23);
console.log(undefined);

// Variáveis
let x = 100;
const PI = 3.14;
var y;

console.log(`Tipo de x = ${typeof x}, Tipo de y = ${typeof y}`);

// Operadores
y = 6;
y = y + 4
y -= 4
--y;
y++;
console.log(`Valor final de y = ${y}`);

let nome_completo = "Фёдор " + "Миха́йлович " + "Достое́вский";
console.log(nome_completo);

// Comparações
console.log(123 == '123');
console.log(123 === '123');
console.log(1 == true);
console.log(0 == true);