document.addEventListener('DOMContentLoaded', () => {
  const cardArray = [
    { name: 'knight', img: 'images/knight.jpeg' },
    { name: 'mage', img: 'images/mage.jpeg' },
    { name: 'owl', img: 'images/owl.jpeg' },
    { name: 'warrior', img: 'images/warrior.jpeg' },
    { name: 'wizard', img: 'images/wizard.jpeg' },
    { name: 'witch', img: 'images/witch.jpeg' },
    { name: 'knight', img: 'images/knight.jpeg' },
    { name: 'mage', img: 'images/mage.jpeg' },
    { name: 'owl', img: 'images/owl.jpeg' },
    { name: 'warrior', img: 'images/warrior.jpeg' },
    { name: 'wizard', img: 'images/wizard.jpeg' },
    { name: 'witch', img: 'images/witch.jpeg' }
  ];
  
  cardArray.sort(() => 0.5 - Math.random());

  const grid = document.querySelector('.grid');
  const resultDisplay = document.querySelector('#result');
  const modal = document.getElementById('modal');
  const modalText = document.getElementById('modal-text');
  const modalButton = document.getElementById('modal-button');

  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];
  let onMatchCheckComplete;
  let isCheckingMatch = false;

  modalButton.addEventListener('click', () => {
    modal.style.display = 'none';
    if (onMatchCheckComplete) onMatchCheckComplete();
  });

  function showModal(message, callback) {
    modalText.textContent = message;
    modal.style.display = 'flex';
    onMatchCheckComplete = callback;
  }

  function createBoard() {
    for (let i = 0; i < cardArray.length; i++) {
      const card = document.createElement('img');
      card.setAttribute('src', 'images/skull.jpeg');
      card.setAttribute('data-id', i);
      card.addEventListener('click', flipCard);
      grid.appendChild(card);
    }
  }

  function checkForMatch() {
    const cards = document.querySelectorAll('img');
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if (optionOneId == optionTwoId) {
      showModal('Você clicou na mesma imagem!', () => { 
        cards[optionOneId].setAttribute('src', 'images/skull.jpeg');
        cards[optionTwoId].setAttribute('src', 'images/skull.jpeg');
        resetChosenCards();
      });
    } else if (cardsChosen[0] === cardsChosen[1]) {
      showModal('Você encontrou uma cópia!', () => {
        cards[optionOneId].setAttribute('src', 'images/cross.jpeg');
        cards[optionTwoId].setAttribute('src', 'images/cross.jpeg');
        cards[optionOneId].removeEventListener('click', flipCard);
        cards[optionTwoId].removeEventListener('click', flipCard);
        cardsWon.push(cardsChosen);
        resetChosenCards();
        updateScore();
      });
    } else {
      showModal('Desculpe, tente novamente!', () => {
        cards[optionOneId].setAttribute('src', 'images/skull.jpeg');
        cards[optionTwoId].setAttribute('src', 'images/skull.jpeg');
        resetChosenCards();
      });
    }
    isCheckingMatch = false;  // Permite clicar novamente
  }

  function resetChosenCards() {
    cardsChosen = [];
    cardsChosenId = [];
  }

  function updateScore() {
    resultDisplay.textContent = `Pontos: ${cardsWon.length}`;
    if (cardsWon.length === cardArray.length / 2) {
      resultDisplay.textContent = 'Parabéns! Você completou o jogo!';
    }
  }

  function flipCard() {
    if (isCheckingMatch) return;  // Impede novos cliques durante a verificação
    
    let cardId = this.getAttribute('data-id');
    if (cardsChosenId.includes(cardId)) return;  // Impede escolher a mesma carta duas vezes
    
    cardsChosen.push(cardArray[cardId].name);
    cardsChosenId.push(cardId);
    this.setAttribute('src', cardArray[cardId].img);
    
    if (cardsChosen.length === 2) {
      isCheckingMatch = true;  // Desativa novos cliques temporariamente
      setTimeout(checkForMatch, 500);
    }
  }

  createBoard();
});