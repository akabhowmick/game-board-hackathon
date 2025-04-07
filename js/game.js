import {
  COLORS,
  HOME_POSITIONS,
  START_POSITIONS,
  SAFE_CELLS,
  PATHS,
} from "./initialGameConstants.js";

// Game state
const gameState = {
  currentPlayer: "red", // Start with red player
  diceValue: null,
  hasRolled: false,
  tokens: {
    red: [
      { inBase: true, position: null, completed: false, baseIndex: 0 },
      { inBase: true, position: null, completed: false, baseIndex: 1 },
      { inBase: true, position: null, completed: false, baseIndex: 2 },
      { inBase: true, position: null, completed: false, baseIndex: 3 },
    ],
    green: [
      { inBase: true, position: null, completed: false, baseIndex: 0 },
      { inBase: true, position: null, completed: false, baseIndex: 1 },
      { inBase: true, position: null, completed: false, baseIndex: 2 },
      { inBase: true, position: null, completed: false, baseIndex: 3 },
    ],
    yellow: [
      { inBase: true, position: null, completed: false, baseIndex: 0 },
      { inBase: true, position: null, completed: false, baseIndex: 1 },
      { inBase: true, position: null, completed: false, baseIndex: 2 },
      { inBase: true, position: null, completed: false, baseIndex: 3 },
    ],
    blue: [
      { inBase: true, position: null, completed: false, baseIndex: 0 },
      { inBase: true, position: null, completed: false, baseIndex: 1 },
      { inBase: true, position: null, completed: false, baseIndex: 2 },
      { inBase: true, position: null, completed: false, baseIndex: 3 },
    ],
  },
  winners: [],
};

// DOM elements
const rollDiceBtn = document.getElementById("rollDice");
const diceResult = document.getElementById("diceResult");
const currentTurnDisplay = document.getElementById("currentTurn");

document.addEventListener("DOMContentLoaded", initializeGame);
rollDiceBtn.addEventListener("click", rollDice);

function initializeGame() {
  // Each token has a handler so that it can work properly
  setupTokenClickHandlers();
  updateTurnDisplay();
}

// Setup click handlers for all tokens
function setupTokenClickHandlers() {
  setupBaseTokenHandlers();
}

// Setup handlers for tokens in base areas
function setupBaseTokenHandlers() {
  COLORS.forEach((color) => {
    const baseTokens = document.querySelectorAll(`.box .circle.border_${color} .token.${color}`);
    baseTokens.forEach((token, index) => {
      token.setAttribute("data-index", index);
      token.setAttribute("token-in-base", true);
      token.addEventListener("click", handleTokenClick);
    });
  });
}

// Roll the dice
function rollDice() {
  if (gameState.hasRolled) {
    alert("You already rolled the dice. Move a token or pass your turn.");
    return;
  }

  gameState.diceValue = Math.floor(Math.random() * 6) + 1;
  diceResult.textContent = gameState.diceValue;
  gameState.hasRolled = true;

  // Check if the player can make any moves
  if (!canPlayerMove()) {
    // If player can't move, wait a second and then move to next player
    setTimeout(() => {
      alert(`No moves available for ${gameState.currentPlayer}. Moving to next player.`);
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
  return tokens.some((token) => !token.inBase && !token.completed);
}

// Handle token click
function handleTokenClick(event) {
  if (!gameState.hasRolled) {
    alert("Please roll the dice first!");
    return;
  }

  // Get the clicked token
  const token = event.target;
  const tokenColor = token.classList[1];

  // Only allow current player to move their tokens
  if (tokenColor !== gameState.currentPlayer) {
    alert("It's not your turn!");
    return;
  }

  let tokenIndex;
  if (token.hasAttribute("data-index")) {
    tokenIndex = parseInt(token.getAttribute("data-index"));
  } else {
    const position = token.parentElement.id;
    tokenIndex = findTokenIndexByPosition(tokenColor, position);
  }

  if (tokenIndex === -1) {
    console.error("Token index not found!");
    return;
  }

  console.log(`Clicked ${tokenColor} token at index ${tokenIndex}`);

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

// Find token index by its position on the board
function findTokenIndexByPosition(color, position) {
  return gameState.tokens[color].findIndex(
    (token) => !token.inBase && !token.completed && token.position === position
  );
}

// Move a token based on dice roll
function moveToken(color, tokenIndex) {
  const token = gameState.tokens[color][tokenIndex];
  const diceValue = gameState.diceValue;

  // If token is in base, it can only move out with a 6
  if (token.inBase) {
    if (diceValue === 6) {
      // hide the token when it goes out of base
      const baseTokenElement = findBaseTokenElement(color, tokenIndex);
      if (baseTokenElement) {
        baseTokenElement.classList.add("hidden");
      }

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
    const currentPathIndex = PATHS[color].indexOf(String(token.position));

    if (currentPathIndex === -1) {
      console.error(`Invalid position: ${token.position} for color ${color}`);
      return false;
    }

    const newPathIndex = currentPathIndex + diceValue;

    // Check if the move would go beyond the home stretch
    if (newPathIndex >= PATHS[color].length) {
      alert("You cannot move this token that far!");
      return false;
    }

    // Move the token
    token.position = PATHS[color][newPathIndex];

    // Check if token has reached home
    if (String(token.position).startsWith(color[0].toUpperCase() + "H")) {
      // Check if reached the end of home path
      if (token.position === `${color[0].toUpperCase()}H5`) {
        token.completed = true;
        alert(`${color} token has reached home!`);
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

// Helper function to find the DOM element of a base token
function findBaseTokenElement(color, tokenIndex) {
  const baseTokens = document.querySelectorAll(`.box .circle.border_${color} .token.${color}`);
  for (let i = 0; i < baseTokens.length; i++) {
    const index = parseInt(baseTokens[i].getAttribute('data-index'));
    if (index === tokenIndex) {
      return baseTokens[i];
    }
  }
  return null;
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
      if (!token.inBase && !token.completed && token.position === position) {
        // Capture: Send token back to base
        token.inBase = true;
        token.position = null;

        // Show the token in base again by removing the hidden class
        const baseTokenElement = findBaseTokenElement(otherColor, index);
        if (baseTokenElement) {
          baseTokenElement.classList.remove("hidden");
        }

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
  console.log("Rendering board...");

  // Clear all tokens from the board (except those in base)
  clearBoardTokens();

  // Place tokens according to their positions
  for (const color of COLORS) {
    gameState.tokens[color].forEach((token, index) => {
      if (!token.inBase && !token.completed) {
        // Place token on the board in the cell with matching ID
        const cell = document.getElementById(String(token.position));
        if (cell) {
          const tokenElement = document.createElement("div");
          tokenElement.classList.add("token", color);
          tokenElement.addEventListener("click", handleTokenClick);
          cell.appendChild(tokenElement);
        } else {
          console.error(`Cell with ID ${token.position} not found`);
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

  console.log("Board rendering complete");
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

// Modal for the rules and gameplay
document.addEventListener('DOMContentLoaded', function() {
  const showRulesBtn = document.createElement('button');
  showRulesBtn.id = 'showRules';
  showRulesBtn.textContent = 'Game Rules';
  
  const gameControls = document.querySelector('.game-controls') || document.body;
  gameControls.prepend(showRulesBtn);
  
  document.getElementById('showRules').addEventListener('click', function() {
    document.getElementById('gameRules').classList.add('show-rules');
  });
  
  document.getElementById('closeRules').addEventListener('click', function() {
    document.getElementById('gameRules').classList.remove('show-rules');
  });
  
  window.addEventListener('click', function(event) {
    const rulesModal = document.getElementById('gameRules');
    if (event.target === rulesModal) {
      rulesModal.classList.remove('show-rules');
    }
  });
});
