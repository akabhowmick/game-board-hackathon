import { COLORS, HOME_POSITIONS, START_POSITIONS, SAFE_CELLS, PATHS } from "./initialGameConstants.js";
// Game state
const gameState = {
  // TODO not updating
  currentPlayer: "red", // Start with red player
  diceValue: null,
  hasRolled: false,
  //
  tokens: {
    red: [
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
    ],
    green: [
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
    ],
    yellow: [
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
    ],
    blue: [
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
      { inBase: true, position: null, completed: false },
    ],
  },
  winners: [],
};

// DOM elements
const rollDiceBtn = document.getElementById("rollDice");
const diceResult = document.getElementById("diceResult");
console.log(diceResult);
const currentTurnDisplay = document.getElementById("currentTurn");
console.log(currentTurnDisplay);

document.addEventListener("DOMContentLoaded", initializeGame);
rollDiceBtn.addEventListener("click", rollDice);

function initializeGame() {
  // Place tokens in their starting positions
  renderBoard();

  // Set up click handlers for tokens
  setupTokenClickHandlers();

  // Update the current turn display
  updateTurnDisplay();
}

// Setup click handlers for all tokens
function setupTokenClickHandlers() {
  const tokens = document.querySelectorAll(".token");
  tokens.forEach((token) => {
    token.addEventListener("click", handleTokenClick);
  });
}

// Roll the dice
function rollDice() {
  if (gameState.hasRolled) {
    alert("You already rolled the dice. Move a token or pass your turn.");
    return;
  }

  // Generate random number between 1-6
  gameState.diceValue = Math.floor(Math.random() * 6) + 1;

  // Update the dice display
  diceResult.textContent = gameState.diceValue;

  // Mark that player has rolled
  gameState.hasRolled = true;

  // Check if the player can make any moves
  if (!canPlayerMove()) {
    // If player can't move, wait a second and then move to next player
    setTimeout(() => {
      nextTurn();
    }, 1000);
  }
}

// Check if current player can make any valid moves
function canPlayerMove() {
  const currentColor = gameState.currentPlayer;
  const tokens = gameState.tokens[currentColor];
  const diceValue = gameState.diceValue;

  // Check if getting a 6 allows a token to leave base
  if (diceValue === 6) {
    if (tokens.some((token) => token.inBase)) {
      return true;
    }
  }

  // Check if any token on the board can move
  if (tokens.some((token) => !token.inBase && !token.completed)) {
    return true;
  }

  return false;
}

// Handle token click
function handleTokenClick(event) {
  // Only process clicks if player has rolled the dice
  if (!gameState.hasRolled) {
    alert("Please roll the dice first!");
    return;
  }

  // Get the clicked token
  const token = event.target;
  const tokenColor = token.classList[1]; // The second class is the color

  // Only allow current player to move their tokens
  if (tokenColor !== gameState.currentPlayer) {
    alert("It's not your turn!");
    return;
  }

  // Find the token index
  const tokenElement = token;
  const tokenIndex = findTokenIndex(tokenElement);

  // Get the token data
  const tokenData = gameState.tokens[tokenColor][tokenIndex];

  // Handle token movement
  if (moveToken(tokenColor, tokenIndex)) {
    // Check for win condition
    if (checkWinCondition(tokenColor)) {
      alert(`${tokenColor.toUpperCase()} player wins!`);
      gameState.winners.push(tokenColor);
      // Remove this color from play
      COLORS.splice(COLORS.indexOf(tokenColor), 1);

      if (COLORS.length === 1) {
        alert(`Game over! Final rankings: ${gameState.winners.join(", ")}, ${COLORS[0]}`);
      }
    }

    // Move to next player's turn
    nextTurn();
  }
}

// Find the index of a token element in the DOM
function findTokenIndex(tokenElement) {
  // Get all tokens of the same color
  const color = tokenElement.classList[1];
  const allTokensOfColor = document.querySelectorAll(`.token.${color}`);

  // Find the index of the clicked token
  return Array.from(allTokensOfColor).indexOf(tokenElement);
}

// Move a token based on dice roll
function moveToken(color, tokenIndex) {
  const token = gameState.tokens[color][tokenIndex];
  const diceValue = gameState.diceValue;

  // If token is in base, it can only move out with a 6
  if (token.inBase) {
    if (diceValue === 6) {
      // Move token out of base to its start position
      token.inBase = false;
      token.position = START_POSITIONS[color];

      // Check if there's a capture
      checkCapture(color, token.position);

      // Update the board
      renderBoard();
      return true;
    } else {
      alert("You need a 6 to move a token out of the base!");
      return false;
    }
  }

  // If token is already on the board, move it
  if (!token.inBase && !token.completed) {
    // Calculate the new position
    const currentPathIndex = PATHS[color].indexOf(token.position);
    const newPathIndex = currentPathIndex + diceValue;

    // Check if the move would go beyond the home stretch
    if (newPathIndex >= PATHS[color].length) {
      alert("You cannot move this token that far!");
      return false;
    }

    // Move the token
    token.position = PATHS[color][newPathIndex];

    // Check if token has reached home
    // ! issue here
    if (token.position.startsWith(color[0].toUpperCase() + "H")) {
      // Check if reached the end of home path
      if (token.position === `${color[0].toUpperCase()}H5`) {
        token.completed = true;
      }
    } else {
      // Check if there's a capture
      checkCapture(color, token.position);
    }

    // Update the board
    renderBoard();
    return true;
  }

  return false;
}

// Check if moving to this position would capture an opponent's token
function checkCapture(color, position) {
  // Don't capture on safe cells
  if (SAFE_CELLS.includes(position)) {
    return;
  }

  // Check all other players' tokens
  for (const otherColor of COLORS) {
    if (otherColor === color) continue;

    // Check each token of this color
    gameState.tokens[otherColor].forEach((token, index) => {
      if (!token.inBase && token.position === position) {
        // Capture: Send token back to base
        token.inBase = true;
        token.position = null;

        // Alert the players
        alert(`${color} captured ${otherColor}'s token!`);
      }
    });
  }
}

// Check if a player has won
function checkWinCondition(color) {
  // A player wins when all their tokens are completed
  return gameState.tokens[color].every((token) => token.completed);
}

// Move to the next player's turn
function nextTurn() {
  // Reset dice state
  gameState.hasRolled = false;
  gameState.diceValue = null;
  diceResult.textContent = "🎲";

  // Find the next player
  const currentPlayerIndex = COLORS.indexOf(gameState.currentPlayer);
  const nextPlayerIndex = (currentPlayerIndex + 1) % COLORS.length;
  gameState.currentPlayer = COLORS[nextPlayerIndex];

  // Update the turn display
  updateTurnDisplay();
}

// Update the current turn display
function updateTurnDisplay() {
  currentTurnDisplay.textContent =
    gameState.currentPlayer.charAt(0).toUpperCase() + gameState.currentPlayer.slice(1);
  currentTurnDisplay.style.color = gameState.currentPlayer;
}

// Render the game board based on the current state
function renderBoard() {
  // Clear all tokens from the board (except those in base)
  clearBoardTokens();

  // Place tokens according to their positions
  for (const color of COLORS) {
    gameState.tokens[color].forEach((token, index) => {
      if (!token.inBase && !token.completed) {
        // Place token on the board
        const cell = document.getElementById(token.position);
        if (cell) {
          const tokenElement = document.createElement("div");
          tokenElement.classList.add("token", color);
          tokenElement.addEventListener("click", handleTokenClick);
          cell.appendChild(tokenElement);
        }
      } else if (token.completed) {
        // Show completed tokens in their final home spot
        const cell = document.getElementById(`${color[0].toUpperCase()}H5`);
        if (cell) {
          const tokenElement = document.createElement("div");
          tokenElement.classList.add("token", color, "completed");
          cell.appendChild(tokenElement);
        }
      }
    });
  }
}

// Clear all tokens from the board cells
function clearBoardTokens() {
  // Get all board cells
  const cells = document.querySelectorAll(".v_lad_cell, .h_lad_cell");

  // Remove all token elements from cells
  cells.forEach((cell) => {
    const tokens = cell.querySelectorAll(".token");
    tokens.forEach((token) => {
      cell.removeChild(token);
    });
  });
}
