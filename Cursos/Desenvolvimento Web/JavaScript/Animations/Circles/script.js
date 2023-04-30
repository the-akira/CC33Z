const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const colors = [
  "#F9D9B7",
  "#E69F66",
  "#DB6B2C",
  "#A7361F",
  "#520E0A",
  "#2D0206",
  "#00ff04",
  "#d900ff",
  "#5314ff",
  "#e5ff00",
  "#ff7b1c"
];

let colorIndex = 0;
let increment = true;

let angle = 0;
let distance = 0;
let radius = 10;
let lineWidth = 1;
let numCircles = 50;

function drawCircles(numCircles, radius, centerX, centerY, lineWidth, ctx, size) {
  for (let i = 0; i < numCircles; i++) {
    angle = i * (Math.PI * 2) / numCircles;
    distance = Math.sin(radius) * size;
    let x = centerX + Math.sin(angle) * distance;
    let y = centerY + Math.cos(angle) * distance;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (increment) {
    colorIndex++;
  } else {
    colorIndex--;
  }

  if (colorIndex === colors.length - 1) {
    increment = false;
  }

  if (colorIndex === 0) {
    increment = true;
  }

  ctx.strokeStyle = colors[colorIndex];

  for (let size = 0; size < 490; size += 50) {
    drawCircles(numCircles, radius, centerX, centerY, 2,ctx, size)
  }

  radius += 0.005;
  lineWidth += 0.005;
  numCircles += 0.005;

  requestAnimationFrame(draw);
}

draw();