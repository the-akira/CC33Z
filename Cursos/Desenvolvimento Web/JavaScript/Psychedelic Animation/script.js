var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Generate random colors
var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Set up animation
var t = 0;
var scale = 100;
var speed = 0.01;

function animate() {
    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pattern
    for (var i = 0; i < canvas.width; i += scale) {
        for (var j = 0; j < canvas.height; j += scale) {
            var x = i + scale/2;
            var y = j + scale/2;
            var color = getRandomColor();
            var radius = scale/2 + Math.sin(t + i/scale + j/scale) * scale/2;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2*Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    // Update time
    t += speed;

    // Repeat animation
    requestAnimationFrame(animate);
}

animate();