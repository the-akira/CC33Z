const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = 500;

// Set initial wave length and amplitude values
let wavelength = 50;
let amplitude = 50;

// Draw x and y axes
ctx.beginPath();
ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2);
ctx.lineWidth = 3;
ctx.stroke();

ctx.beginPath();
ctx.moveTo(canvas.width / 2, 0);
ctx.lineTo(canvas.width / 2, canvas.height);
ctx.lineWidth = 3;
ctx.stroke();

// Draw sine function graph
ctx.beginPath();
ctx.lineWidth = 4;
ctx.strokeStyle = "blue";
for (let x = 0; x <= canvas.width; x += 5) {
  const y = canvas.height / 2 - Math.sin((x - canvas.width / 2) / wavelength) * amplitude;
  ctx.lineTo(x, y);
}
ctx.stroke();

// Listen for changes to the wavelength and amplitude controls
const wavelengthControl = document.getElementById("wavelength");
wavelengthControl.addEventListener("input", () => {
  wavelength = wavelengthControl.value;
  redraw();
});

const amplitudeControl = document.getElementById("amplitude");
amplitudeControl.addEventListener("input", () => {
  amplitude = amplitudeControl.value;
  redraw();
});

// Redraw the graph with the new wave length and amplitude values
function redraw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set stroke style back to default (black)
  ctx.strokeStyle = "black";

  // Redraw the x and y axes
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.lineWidth = 3;
  ctx.stroke();

  // Redraw the sine function graph with the new wave length and amplitude values
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "blue";
  for (let x = 0; x <= canvas.width; x += 5) {
    const y = canvas.height / 2 - Math.sin((x - canvas.width / 2) / wavelength) * amplitude;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}