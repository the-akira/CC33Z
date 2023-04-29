const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const shapes = [];

class Shape {
  constructor(x, y, size, color, angle) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.angle = angle;
    this.speed = 0.005 + Math.random() * 0.02;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.opacity = 0;
    this.direction = 1;
    this.vertices = Math.floor(3 + Math.random() * 3) * 2;
  }

  update() {
    this.angle += this.speed;
    this.opacity += this.direction * 0.01;
    if (this.opacity <= 0) {
      this.direction = 1;
    } else if (this.opacity >= 1) {
      this.direction = -1;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    for (let i = 0; i < this.vertices; i++) {
      const angle = (Math.PI * 2) / this.vertices * i;
      const x = Math.cos(angle) * this.size;
      const y = Math.sin(angle) * this.size;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(${this.color.join(",")},${this.opacity})`;
    ctx.fill();
    ctx.restore();
  }
}

function init() {
  for (let i = 0; i < 160; i++) {
    setTimeout(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 50 + Math.random() * 100;
      const color = [
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255,
      ];
      const angle = Math.random() * Math.PI * 2;
      const shape = new Shape(x, y, size, color, angle);
      shapes.push(shape);
    }, Math.random() * 5000);
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  shapes.forEach((shape) => {
    shape.update();
    shape.draw();
  });
}

init();
animate();