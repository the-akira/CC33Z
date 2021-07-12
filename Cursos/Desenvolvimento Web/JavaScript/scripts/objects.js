// Definindo Objetos
var obj = new Object();
let objeto = {};

console.log(obj, typeof objeto);

var alimento = {
    nome: "Tomate",
    detalhes: {
        cor: "Vermelho",
        tamanho: 10
    }
};

console.log(alimento);
console.log(alimento.nome);
console.log(alimento['detalhes']);
console.log(alimento.detalhes.cor)

function Pessoa(nome, idade) {
    this.nome = nome;
    this.idade = idade;
}

var pessoa = new Pessoa('Luiz',50);
console.log(pessoa,typeof pessoa)