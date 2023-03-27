const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const charSet = "愛 帝 哲 學 智 力 量 火 國 王 耶 穌 穆 罕 默 德 中 國 舍 木 龍 黑 玄 天 上 的 眸";

const columns = Math.floor(canvas.width / 15);
const drops = [];

for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#0F0"; // set the color of the characters
  ctx.font = "20px monospace"; // set the font size and type
  
  for (let i = 0; i < drops.length; i++) {
    const text = charSet[Math.floor(Math.random() * charSet.length)]; 
    ctx.fillText(text, i * 15, drops[i] * 15);
    
    if (drops[i] * 15 > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    
    drops[i]++;
  }
}

setInterval(draw, 50); 