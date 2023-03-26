var randomNumber = Math.floor(Math.random() * 100) + 1;
var guessInput = document.getElementById("guess");
var submitButton = document.getElementById("submitGuess");
var resultText = document.getElementById("result");
var guesses = 0;

submitButton.addEventListener("click", function() {
  var guess = parseInt(guessInput.value);
  if (guess === randomNumber) {
    resultText.innerHTML = "Congratulations! You guessed the number in " + guesses + " guesses.";
    submitButton.disabled = true;
  } else if (guess > randomNumber) {
    resultText.innerHTML = "Too high. Guess again.";
    guesses++;
  } else if (guess < randomNumber) {
    resultText.innerHTML = "Too low. Guess again.";
    guesses++;
  }
});