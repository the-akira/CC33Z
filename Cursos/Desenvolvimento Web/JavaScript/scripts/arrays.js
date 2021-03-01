// Definindo Arrays
var array = new Array();
array[0] = 'cachorro';
array[1] = 'gato';
array[2] = 'lagarto';
console.log(typeof array, array, array.length);

let arr = [5,4,3,2,1]

for (var i = 0; i < arr.length; i++) {
	console.log(arr[i]);
}

console.log(arr.sort());
console.log(arr.reverse());

let linguagens = ['java','javascript','c++','python']

for (const linguagem of linguagens) {
	console.log(linguagem);
}

linguagens.forEach(function(valor, indice, array){
	console.log(valor, indice, array);
});

linguagens.push('fortran');
linguagens.push('lisp');
console.log(linguagens);