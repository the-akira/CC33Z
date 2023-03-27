var rolls = [0, 0, 0, 0, 0, 0];
var limitRolls = 60

function rollDice() {
    var resultEl = document.getElementById("result");
    var diceEl = document.getElementById("dice");
    var total = document.getElementById("total")
    var sum = rolls.reduce((partialSum, a) => partialSum + a, 0) + 1
    if (sum > limitRolls) { 
        result.innerHTML = "Limite de Rolagens Atingido!"
        return
    }
    var diceValue = Math.floor(Math.random() * 6) + 1;
    diceEl.innerHTML = `<img src="https://rollingdices.netlify.app/${diceValue}.png">`;
    resultEl.innerHTML = diceValue;
    rolls[diceValue - 1]++;
    total.innerHTML = `Rolagens: ${sum}`;
    updateChart();
}

function updateChart() {
    var chartEl = document.getElementById("chart");
    chartEl.innerHTML = "";
    for (var i = 0; i < rolls.length; i++) {
        var labelEl = document.createElement("div");
        labelEl.classList.add("chart-bar-label");
        labelEl.innerHTML = i + 1;
        var fillEl = document.createElement("div");
        fillEl.classList.add("chart-bar-fill");
        fillEl.style.height = rolls[i] * 20 + "px";
        var barEl = document.createElement("div");
        barEl.classList.add("chart-bar");
        barEl.appendChild(labelEl);
        barEl.appendChild(fillEl);
        chartEl.appendChild(barEl);
    }
}