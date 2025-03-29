document.getElementById("rollDice").addEventListener("click", function () {
  let roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById("diceResult").innerText = `🎲 ${roll}`;
  
  let redPiece = document.getElementById("red1");
  let currentPosition = redPiece.dataset.position ? parseInt(redPiece.dataset.position) : 0;
  
  let newPosition = currentPosition + roll;
  redPiece.dataset.position = newPosition;

  redPiece.style.transform = `translate(${newPosition * 40}px, 0px)`;
});
