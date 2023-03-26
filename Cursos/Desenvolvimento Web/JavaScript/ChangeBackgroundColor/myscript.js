document.getElementById("myButton").addEventListener("click", function() {
  var colors = ["red", "green", "blue", "yellow"];
  var randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.backgroundColor = randomColor;
});