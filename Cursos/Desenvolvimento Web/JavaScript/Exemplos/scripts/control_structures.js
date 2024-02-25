// if, else if, else
let num = 20;

if (num == 10) {
    console.log('Número igual a 10')
} else if (num < 10) {
    console.log('Número menor que 10')
} else {
    console.log('Número maior que 10')
}

// while
let x = 1;

while(x < 10){
    console.log(x);
    x++;
}

let y = 10;

while(y >= 1){
    console.log(y);
    --y;
}

// for
for (var i = 0; i < 5; i++) {
    console.log(i);
}

animais = ['coruja','corvo','papagaio'];

for (let animal of animais) {
    console.log(animal);
}

países = {
    "asia": ["china","índia","japão"],
    "américa": ["brasil","chile","méxico"],
    "europa": ["espanha","portugal","grécia"],
    "áfrica": ["senegal","nigéria","angola"]
}

for (let propriedade in países) {
    console.log(`${propriedade}:`);
    console.log(países[propriedade]);
}

// Operadores lógicos
console.log(0 > 1 && 1 > 0)
console.log(0 > 1 || 1 > 0)
console.log(!true)
console.log(!false)
console.log(!!true)

var vivo = false;
var status = (vivo) ? 'você está vivo' : 'você morreu.';
console.log(status);

// switch
let mês = 'janeiro';

switch(mês){
    case 'janeiro':
        console.log("Bom começo de ano!");
        break;
    case 'dezembro':
        console.log("Bom fim de ano!");
        break;
    default:
        console.log("Mês inválido.");
}