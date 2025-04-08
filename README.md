📌 Overview
This is a digital version of the classic Ludo board game, built using HTML, CSS, and JavaScript. The game supports 2-4 players, with a turn-based dice rolling system and piece movement mechanics.

🚀 Features
1. Turn-based gameplay (2-4 players)
2. Dice rolling mechanic
3. Piece movement along paths
4. Capturing opponent pieces
5. Win condition tracking
6. Simple UI with animations
7. (Optional) AI opponent & multiplayer mode

🛠️ Tech Stack
HTML → Game board layout
CSS → Styling and animations
JavaScript → Game logic, turns, dice rolls, movement

📥 Installation & Setup
Clone the repository:
'''
git clone https://github.com/your-username/ludo-game.git
cd ludo-game
'''
Open index.html in your browser to start playing!

🎮 How to Play
1. Each player starts with 4 pieces in their home zone.
2. Players take turns rolling a 6-sided dice.
3. To move a piece out of the home zone, a player must roll a 6.
4. Move pieces along the Ludo path towards the finish zone.
5. Capturing: Landing on an opponent’s piece sends it back to their home zone.
6. The first player to get all 4 pieces to the final zone wins!

🎨 Customization
- Modify style.css to change colors, board design, and animations.
- Edit game.js to add new rules, AI players, or online multiplayer.

🐞 Known Issues & Future Enhancements
[ ] AI Opponent (Basic logic for single-player mode)
[ ] Multiplayer Mode (Local & Online)
[ ] Leaderboard & Timed Turns


Game.js includes:
- Game Constants and State:
  - Player colors, paths, and special cells
  - Token positions and state tracking 
  - Current player turn and dice values

- Game Mechanics:
  - Rolling the dice (generates random number 1-6)
  - Moving tokens based on dice rolls
  - Token capturing (when landing on an opponent's token)
  - Safe cells (starred cells where tokens can't be captured)
  - Home paths for each color

- Game Rules Implemented:
  - Players need to roll a 6 to move tokens out of base
  - Tokens follow their color-specific paths around the board
  - When landing on an opponent's token, it gets sent back to base
  - Tokens need to enter home stretch in exact count
  - Players take turns in clockwise order (red → green → yellow → blue)
  - Player gets another turn after rolling a 6

- UI Interactions:
  - Click handlers for tokens
  - Visual feedback for current player
  - Dice roll display
  - Board updates after each move
  - Win condition checking
