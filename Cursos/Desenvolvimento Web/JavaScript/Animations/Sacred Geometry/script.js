const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 1500;
canvas.height = 850;

// Set background color
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Set geometry parameters
const circleCount = 120;
const radius = canvas.width / 8;
const lineWidth = 2;

// Set color gradient
const gradient = ctx.createRadialGradient(
  canvas.width / 2,
  canvas.height / 2,
  0,
  canvas.width / 2,
  canvas.height / 2,
  radius
);
gradient.addColorStop(0, "#fff");
gradient.addColorStop(1, "#7400d9");

// Draw geometry
for (let i = 0; i < circleCount; i++) {
  const angle = (2 * Math.PI * i) / circleCount;
  const x = canvas.width / 2 + radius * Math.cos(angle);
  const y = canvas.height / 2 + radius * Math.sin(angle);

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = gradient;
  ctx.stroke();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate canvas
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(Math.PI / 720);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // Clear canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw geometry
  for (let i = 0; i < circleCount; i++) {
    const angle = (2 * Math.PI * i) / circleCount;
    const x = canvas.width / 2 + radius * Math.cos(angle);
    const y = canvas.height / 2 + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }
}

// Start animation
animate();