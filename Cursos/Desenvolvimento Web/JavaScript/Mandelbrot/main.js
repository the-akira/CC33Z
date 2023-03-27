const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

const maxIterations = 100;
const zoomFactor = 1;
const offsetX = -0.5;
const offsetY = 0;
let zoom = 1;

let x, y;
let zx, zy, zx2, zy2;
let iterations;

function drawMandelbrot() {
  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      x = (i - canvas.width / 2) / (0.5 * zoom * canvas.width) + offsetX;
      y = (j - canvas.height / 2) / (0.5 * zoom * canvas.height) - offsetY;

      zx = 0;
      zy = 0;
      zx2 = 0;
      zy2 = 0;
      iterations = 0;

      while (zx2 + zy2 < 4 && iterations < maxIterations) {
        zy = 2 * zx * zy + y;
        zx = zx2 - zy2 + x;
        zx2 = zx * zx;
        zy2 = zy * zy;
        iterations++;
      }

      const color = (iterations == maxIterations) ? "#000" : `hsl(${iterations}, 100%, 40%)`;

      ctx.fillStyle = color;
      ctx.fillRect(i, j, 1, 1);
    }
  }

  zoom *= zoomFactor;
  requestAnimationFrame(drawMandelbrot);
}

drawMandelbrot();