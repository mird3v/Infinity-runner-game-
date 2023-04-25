const gameContainer = document.getElementById("game-container");
const character = document.getElementById("character");

let isJumping = false;
let obstaclesInterval;
let score = 0;

function jump() {
  if (isJumping) return;
  isJumping = true;
  let position = 0;

  const jumpInterval = setInterval(() => {
    if (position >= 100) {
      clearInterval(jumpInterval);
      const fallInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(fallInterval);
          isJumping = false;
        } else {
          position -= 10;
          character.style.bottom = `${position}px`;
        }
      }, 20);
    } else {
      position += 10;
      character.style.bottom = `${position}px`;
    }
  }, 20);
}

function createObstacle() {
  const obstacleElem = document.createElement("div");
  obstacleElem.classList.add("obstacle");
  gameContainer.appendChild(obstacleElem);
  obstacleElem.style.right = "700px";

  const moveObstacle = setInterval(() => {
    const playerPosition = parseInt(character.style.bottom);
    const obstaclePosition = parseInt(obstacleElem.style.right);

    if (obstaclePosition > 0 && obstaclePosition < 50 && playerPosition < 50) {
      clearInterval(moveObstacle);
      clearInterval(obstaclesInterval);
      alert("Game Over");
    } else if (obstaclePosition <= -50) {
      clearInterval(moveObstacle);
      gameContainer.removeChild(obstacleElem);
      document.getElementById("score").innerText = `Score: ${++score}`;
    } else {
      obstacleElem.style.right = `${obstaclePosition - 10}px`;
    }
  }, 100);
}

function startGame() {
  obstaclesInterval = setInterval(createObstacle, 2000);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

startGame();
