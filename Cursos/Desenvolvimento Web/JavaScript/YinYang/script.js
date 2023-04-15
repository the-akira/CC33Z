const modeToggle = document.getElementById('modeToggle');
const bodyElement = document.body;
const modeText = document.getElementById('modeText');

modeToggle.addEventListener('click', function() {
  if (bodyElement.classList.contains('light-mode')) {
    bodyElement.classList.remove('light-mode');
    bodyElement.classList.add('dark-mode');
    modeText.textContent = 'FIAT LUX';
  } else {
    bodyElement.classList.remove('dark-mode');
    bodyElement.classList.add('light-mode');
    modeText.textContent = 'TENEBRIS';
  }
});