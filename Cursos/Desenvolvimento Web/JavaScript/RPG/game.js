const gameContainer = document.getElementById("game-container");
const tileSize = 50;
let numRows = 10;
let numCols = 10;
let playerRow = 0;
let playerCol = 0;
let mapData;
let keydownListener;

function createMap() {
  for (let row = 0; row < mapData.length; row++) {
    for (let col = 0; col < mapData[row].length; col++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.style.top = row * tileSize + 'px';
      tile.style.left = col * tileSize + 'px';

      if (mapData[row][col] === 0) {
        tile.classList.add('map-tile-0');
      } else if (mapData[row][col] === 1) {
        tile.classList.add('map-tile-1');
      } else if (mapData[row][col] === 2) {
        tile.classList.add('door');
      } else if (mapData[row][col] === 3) {
        tile.classList.add('door')
      }

      gameContainer.appendChild(tile);
    }
  }
}

function loadMap(mapUrl) {
  if (keydownListener) {
    document.removeEventListener('keydown', keydownListener);
  }

  fetch(mapUrl)
    .then(response => response.json())
    .then(data => {
      mapData = data.map;
      numRows = mapData.length;
      numCols = mapData[0].length;
      createMap();

      const player = document.createElement("div");
      player.id = "player";
      player.style.top = playerRow * tileSize + "px";
      player.style.left = playerCol * tileSize + "px";
      gameContainer.appendChild(player);

      keydownListener = function(event) {
        switch (event.key) {
          case "ArrowUp":
            if (playerRow > 0) {
              playerRow--;
              player.style.top = playerRow * tileSize + "px";
            }
            break;
          case "ArrowDown":
            if (playerRow < numRows - 1) {
              playerRow++;
              player.style.top = playerRow * tileSize + "px";
            }
            break;
          case "ArrowLeft":
            if (playerCol > 0) {
              playerCol--;
              player.style.left = playerCol * tileSize + "px";
            }
            break;
          case "ArrowRight":
            if (playerCol < numCols - 1) {
              playerCol++;
              player.style.left = playerCol * tileSize + "px";
            }
            break;
        }

        if (mapData[playerRow][playerCol] === 2) {
          gameContainer.innerHTML = '';
          loadMap('https://gist.githubusercontent.com/the-akira/1415eab48fe60840dd403223b1048bb0/raw/a791c715bbe4f82dd99cb45a1a8775dbb69a8c72/map2.json');
          playerRow = 9;
          playerCol = 9;
        }
        if (mapData[playerRow][playerCol] === 3) {
          gameContainer.innerHTML = '';
          loadMap('https://gist.githubusercontent.com/the-akira/8dd4b8760a86c0aefda7e249780fe702/raw/07596751468213933031b3d53bfde407abf767ee/map3.json');
          playerRow = 0;
          playerCol = 9;
        }
      };

      document.addEventListener("keydown", keydownListener);
    });
}

loadMap('https://gist.githubusercontent.com/the-akira/3aeca1d24713c2ae0c88eb843a64e0c1/raw/3830dbfdf274aab5c75e711293c3dc5658a78958/map1.json');