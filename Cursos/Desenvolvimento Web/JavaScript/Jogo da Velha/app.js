let currentPlayer = "X";
const cells = document.querySelectorAll("td");
const resetButton = document.querySelector("#reset");

function handleCellClick(e) {
  const cell = e.target;
  if (cell.textContent !== "") return;
  cell.textContent = currentPlayer;
  if (checkForWin()) {
    alert(`${currentPlayer} venceu!`);
    resetGame();
  } else if (checkForDraw()) {
    alert("É um empate!");
    resetGame();
  } else {
    togglePlayer();
  }
}

function togglePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkForWin() {
  const cells = document.querySelectorAll("td");
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  return combos.some(([a, b, c]) => {
    return cells[a].textContent !== "" && cells[a].textContent === cells[b].textContent && cells[b].textContent === cells[c].textContent;
  });
}

function checkForDraw() {
  const cells = document.querySelectorAll("td");
  return Array.from(cells).every(cell => cell.textContent !== "");
}

function resetGame() {
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);