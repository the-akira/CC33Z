// JavaScript para o modal
// Obtém o modal
var modal = document.getElementById("myModal");

// Obtém a imagem e o botão de fechar que abre o modal
var img = document.getElementById("avatarImage");
var span = document.getElementsByClassName("close")[0];

// Quando o usuário clicar na imagem, abra o modal
img.onclick = function() {
    modal.style.display = "block";
}

// Quando o usuário clicar no botão de fechar, feche o modal
span.onclick = function() {
    modal.style.display = "none";
}

// Quando o usuário clicar em qualquer lugar fora do modal, feche-o
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}