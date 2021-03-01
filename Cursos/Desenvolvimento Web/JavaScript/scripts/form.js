const form = document.querySelector('form');
const nome = document.getElementById('nome');
const sobrenome = document.getElementById('sobrenome');
const para = document.querySelector('p');

form.onsubmit = function(e) {
  e.preventDefault();
  if (nome.value === '' || sobrenome.value === '') {
    para.textContent = 'Ambos os nomes devem ser preenchidos!';
  } else {
  	para.textContent = `${nome.value} ${sobrenome.value}`
  }
}

function myFunction() {
  var x = document.getElementById("fname").value;
  var demo = document.getElementById("demo");
  demo.innerHTML = x;
}