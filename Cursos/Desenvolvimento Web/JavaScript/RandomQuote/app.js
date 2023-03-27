const quotes = [
  { text: '"I think, therefore I am"', author: "René Descartes" },
  { text: '"Compassion is the basis of morality"', author: "Arthur Schopenhauer" },
  { text: '"It does not matter how slowly you go as long as you do not stop."', author: "Confucius" },
  { text: '"Happiness is not an ideal of reason, but of imagination."', author: "Immanuel Kant" },
  { text: '"Happiness is not something ready made. It comes from your own actions."', author: "Dalai Lama" },
  { text: '"A love of nature keeps no factories busy"', author: "Aldous Leonard Huxley" },
];

const quoteTextEl = document.getElementById("quote-text");
const quoteAuthorEl = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote-btn");
const spinnerEl = document.getElementById("spinner");

function showSpinner() {
  spinnerEl.style.display = "block";
  newQuoteBtn.disabled = true; // disable button while spinner is loading
}

function hideSpinner() {
  spinnerEl.style.display = "none";
  newQuoteBtn.disabled = false; // enable button after spinner is hidden
}

function getNewQuote() {
  showSpinner(); // show spinner before fetching new quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteTextEl.style.display = "none";
  quoteAuthorEl.style.display = "none";
  setTimeout(() => { // add delay to simulate loading time
    quoteTextEl.style.display = "block";
    quoteAuthorEl.style.display = "block";
    quoteTextEl.textContent = quote.text;
    quoteAuthorEl.textContent = `— ${quote.author}`;
    hideSpinner(); // hide spinner after new quote is displayed
  }, 700);
}

newQuoteBtn.addEventListener("click", getNewQuote);
getNewQuote();