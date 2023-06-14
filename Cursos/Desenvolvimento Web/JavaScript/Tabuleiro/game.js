// Get the Canvas and its 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Calculate the number of tiles to fit the screen
const numTilesX = Math.ceil(canvas.width / 64);
const numTilesY = Math.ceil(canvas.height / 64);

// Define the scenario as a 2D array
const scenario = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const tileWidth = 64; // Width of each tile in pixels
const tileHeight = 64; // Height of each tile in pixels

// Calculate the scenario dimensions based on the number of tiles
const scenarioWidth = scenario[0].length * tileWidth;
const scenarioHeight = scenario.length * tileHeight;

// Define the camera position
let cameraX = 0;
let cameraY = 0;

// Define the player
const player = {
  x: 128,
  y: 128,
  speed: 64, // Fixed speed value
  width: 64,
  height: 64,
  isMoving: false, // Flag to indicate if player is currently moving
  canMove: true // Variable to control player movement
};

// Define the images
const tileWall = new Image();
const tileFloor = new Image();
const tilePlayer = new Image();

// Function to draw the scenario
function drawScenario() {
  for (let row = 0; row < scenario.length; row++) {
    for (let col = 0; col < scenario[row].length; col++) {
      const tile = scenario[row][col];

      // Set the color based on the tile value
      if (tile === 1) {
        tileWall.src = "images/tile1.png";
        ctx.drawImage(tileWall, col * tileWidth - cameraX, row * tileHeight - cameraY);
      } else {
        tileFloor.src = "images/tile2.png";
        ctx.drawImage(tileFloor, col * tileWidth - cameraX, row * tileHeight - cameraY);
      }   
    }
  }
}

// Function to update the camera
function updateCamera() {
  cameraX = Math.max(0, Math.min(player.x - canvas.width / 2, scenarioWidth - canvas.width));
  cameraY = Math.max(0, Math.min(player.y - canvas.height / 2, scenarioHeight - canvas.height));
}

// Variable to keep track of pressed keys
const keysPressed = {};

// Function to handle player movement
function handlePlayerMovement() {
  window.addEventListener("keydown", function (event) {
    if (!player.canMove) {
      return; // If the player can't move, ignore key input
    }

    keysPressed[event.keyCode] = true; // Set the pressed key to true

    // Start moving the player
    movePlayer();
  });

  window.addEventListener("keyup", function (event) {
    delete keysPressed[event.keyCode]; // Remove the released key from the pressed keys

    // Stop moving the player if no keys are pressed
    if (Object.keys(keysPressed).length === 0) {
      stopPlayer();
    }
  });
}

// Function to move the player
function movePlayer() {
  if (!player.canMove) {
    return; // If the player can't move, ignore movement
  }

  player.canMove = false; // Disable player movement temporarily

  let dx = 0;
  let dy = 0;

  // Calculate the movement based on the pressed keys
  if (keysPressed[37]) dx = -player.speed; // Left arrow
  if (keysPressed[39]) dx = player.speed; // Right arrow
  if (keysPressed[38]) dy = -player.speed; // Up arrow
  if (keysPressed[40]) dy = player.speed; // Down arrow

  // Calculate the potential new position of the player
  const newX = player.x + dx;
  const newY = player.y + dy;

  // Check collision with walls
  let collisionDetected = false;
  for (let row = 0; row < scenario.length; row++) {
    for (let col = 0; col < scenario[row].length; col++) {
      const tile = scenario[row][col];
      if (tile === 1) {
        const wall = {
          x: col * tileWidth,
          y: row * tileHeight,
          width: tileWidth,
          height: tileHeight
        };

        if (isColliding(newX, newY, player.width, player.height, wall)) {
          // Collision detected, set flag and break out of the loop
          collisionDetected = true;
          break;
        }
      }
    }
    if (collisionDetected) {
      break;
    }
  }

  if (!collisionDetected) {
    // No collision detected, update player position
    player.x = newX;
    player.y = newY;
  }

  requestAnimationFrame(movePlayer); // Continue moving the player
}

// Function to stop the player movement
function stopPlayer() {
  player.canMove = true; // Enable player movement
}

// Function to check collision between two rectangles
function isColliding(rect1X, rect1Y, rect1Width, rect1Height, rect2) {
  return (
    rect1X < rect2.x + rect2.width &&
    rect1X + rect1Width > rect2.x &&
    rect1Y < rect2.y + rect2.height &&
    rect1Y + rect1Height > rect2.y
  );
}

// Function to check collision between two rectangles
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Function to handle collision
function handleCollision() {
  // Check collision with scenario walls
  for (let row = 0; row < scenario.length; row++) {
    for (let col = 0; col < scenario[row].length; col++) {
      const tile = scenario[row][col];
      if (tile === 1) {
        const wall = {
          x: col * tileWidth,
          y: row * tileHeight,
          width: tileWidth,
          height: tileHeight
        };

        if (checkCollision(player, wall)) {
          // Handle collision with wall here (e.g., stop player movement)
          player.isMoving = false;
        }
      }
    }
  }
}

// Game loop function
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  handlePlayerMovement(); // Handle player movement
  handleCollision(); // Handle collision detection
  updateCamera(); // Update the camera
  drawScenario(); // Draw the scenario

  // Draw the player
  tilePlayer.src = "images/wizard.png";
  ctx.drawImage(tilePlayer, player.x - cameraX, player.y - cameraY);

  requestAnimationFrame(gameLoop); // Run the game loop recursively
}

// Start the game loop
gameLoop();