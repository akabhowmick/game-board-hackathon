const players = ["red", "blue", "yellow", "green"];
let currentPlayerIndex = 0;
let playerPositions = {
  red: -1,
  blue: -1,
  yellow: -1,
  green: -1,
};

// Define board path (coordinates for each step)
const boardPath = {
  red: [
    [6, 0],
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
    [6, 5], // First vertical path
    [5, 6],
    [4, 6],
    [3, 6],
    [2, 6],
    [1, 6],
    [0, 6], // Left horizontal path
    [0, 7],
    [0, 8],
    [1, 8],
    [2, 8],
    [3, 8],
    [4, 8],
    [5, 8], // Going right
    [6, 9],
    [6, 10],
    [6, 11],
    [6, 12],
    [6, 13],
    [6, 14], // Down to bottom row
    [7, 14],
    [8, 14],
    [8, 13],
    [8, 12],
    [8, 11],
    [8, 10], // Left to home column
    [7, 10], // Home
  ],
  blue: [
    [0, 8],
    [1, 8],
    [2, 8],
    [3, 8],
    [4, 8],
    [5, 8], // Moving down
    [6, 9],
    [6, 10],
    [6, 11],
    [6, 12],
    [6, 13],
    [6, 14], // Moving right
    [7, 14],
    [8, 14],
    [9, 14],
    [10, 14],
    [11, 14],
    [12, 14], // Moving up
    [12, 13],
    [12, 12],
    [11, 12],
    [10, 12],
    [9, 12],
    [8, 12], // Moving left
    [8, 11],
    [8, 10],
    [8, 9],
    [8, 8],
    [8, 7],
    [8, 6], // Moving up to home column
    [8, 7], // Home
  ],
  yellow: [
    [8, 14],
    [8, 13],
    [8, 12],
    [8, 11],
    [8, 10],
    [8, 9], // Moving left
    [7, 8],
    [6, 8],
    [5, 8],
    [4, 8],
    [3, 8],
    [2, 8], // Moving up
    [2, 7],
    [2, 6],
    [3, 6],
    [4, 6],
    [5, 6],
    [6, 6], // Moving right
    [7, 5],
    [7, 4],
    [7, 3],
    [7, 2],
    [7, 1],
    [7, 0], // Moving up
    [8, 0],
    [9, 0],
    [10, 0],
    [11, 0],
    [12, 0],
    [13, 0], // Moving right
    [13, 1], // Home
  ],
  green: [
    [14, 6],
    [13, 6],
    [12, 6],
    [11, 6],
    [10, 6],
    [9, 6], // Moving up
    [8, 5],
    [8, 4],
    [8, 3],
    [8, 2],
    [8, 1],
    [8, 0], // Moving left
    [7, 0],
    [6, 0],
    [5, 0],
    [4, 0],
    [3, 0],
    [2, 0], // Moving down
    [2, 1],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2], // Moving right
    [7, 3],
    [7, 4],
    [7, 5],
    [7, 6],
    [7, 7],
    [7, 8], // Moving down to home column
    [7, 7], // Home
  ],
};

// Roll Dice
document.getElementById("rollDice").addEventListener("click", function () {
  let roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById("diceResult").innerText = `🎲 ${roll}`;

  let currentPlayer = players[currentPlayerIndex];
  let piece = document.getElementById(`${currentPlayer}1`);

  if (playerPositions[currentPlayer] === -1) {
    if (roll === 6) {
      playerPositions[currentPlayer] = 0;
      movePiece(piece, currentPlayer, 0);
    } else {
      switchTurn();
    }
  } else {
    let newPosition = playerPositions[currentPlayer] + roll;
    if (newPosition < boardPath[currentPlayer].length) {
      playerPositions[currentPlayer] = newPosition;
      movePiece(piece, currentPlayer, newPosition);
    }
    switchTurn();
  }
});

// Move Piece
function movePiece(piece, color, position) {
  let [x, y] = boardPath[color][position];
  piece.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
}

// Switch Turn
function switchTurn() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  document.getElementById("current-player").innerText =
    players[currentPlayerIndex].charAt(0).toUpperCase() + players[currentPlayerIndex].slice(1);
}
