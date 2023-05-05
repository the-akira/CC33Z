const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 1000;
canvas.height = 850;

// Set background color
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Set geometry parameters
const triangleCount = 60;
const triangleSize = 230;
const lineWidth = 2;

// Set color gradient
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, "#FD8E00");
gradient.addColorStop(1, "#D40000");

// Draw geometry
for (let i = 0; i < triangleCount; i++) {
  const angle = (2 * Math.PI * i) / triangleCount;
  const x = canvas.width / 2 + triangleSize * Math.cos(angle);
  const y = canvas.height / 2 + triangleSize * Math.sin(angle);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(triangleSize / 2, -triangleSize * Math.sqrt(3) / 2);
  ctx.lineTo(-triangleSize / 2, -triangleSize * Math.sqrt(3) / 2);
  ctx.closePath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = gradient;
  ctx.stroke();
  ctx.restore();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate canvas
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(Math.PI / 480);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // Clear canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw geometry
  for (let i = 0; i < triangleCount; i++) {
    const angle = (2 * Math.PI * i) / triangleCount;
    const x = canvas.width / 2 + triangleSize * Math.cos(angle);
    const y = canvas.height / 2 + triangleSize * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(triangleSize / 2, -triangleSize * Math.sqrt(3) / 2);
    ctx.lineTo(-triangleSize / 2, -triangleSize * Math.sqrt(3) / 2);
    ctx.closePath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = gradient;
    ctx.stroke();
    ctx.restore();
  }
}

// Start animation
animate();