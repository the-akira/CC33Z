const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width = 800;
const height = canvas.height = 800;
const centerX = width / 2;
const centerY = height / 2;

let angle = 0;
let radius = 16000;
let speed = 0.1;

function draw() {
  angle += speed;
  radius *= 0.99;
  let color = "rgb(" + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ")";
  ctx.strokeStyle = color;
  ctx.lineWidth = 4.3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  for (let i = 0; i < 10; i++) {
    let x = centerX + radius * Math.cos(angle * i);
    let y = centerY + radius * Math.sin(angle * i);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  requestAnimationFrame(draw);
}

draw();