// JavaScript para o modal
// Obtém o modal
var modal = document.getElementById("myModal");

// Obtém a imagem e o botão de fechar que abre o modal
var img = document.getElementById("control");
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

// Transição de avatares
const avatarContainer = document.getElementById('avatar-container');
const avatar1 = document.getElementById('avatar');
const avatar2 = document.getElementById('avatar2');

avatarContainer.addEventListener('mouseenter', () => {
    avatar1.style.opacity = '0';
    avatar2.style.opacity = '1';
});

avatarContainer.addEventListener('mouseleave', () => {
    avatar1.style.opacity = '1';
    avatar2.style.opacity = '0';
});