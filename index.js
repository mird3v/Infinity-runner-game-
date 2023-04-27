const gameContainer = document.getElementById("game-container");
const character = document.getElementById("character");
const playButton = document.getElementById("play-button");
const playAgainButton = document.getElementById("play-again-button");
const gameOver = document.getElementById("game-over-overlay");

let isJumping = false;
let obstaclesInterval;
let score = 0;
let obstacles = [];
let frames = 0;

function jump() {
  if (isJumping) return;
  isJumping = true;
  let position = 0;

  const jumpInterval = setInterval(() => {
    if (position >= 200) {
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
  obstacleElem.style.right = "0px";

  const moveObstacle = setInterval(() => {
    const playerPosition = parseInt(character.style.bottom);
    const obstaclePosition = parseInt(obstacleElem.style.right);
    console.log(obstaclePosition);
    if (
      obstaclePosition > 0 &&
      obstaclePosition < 50 &&
      detectCollision(character, obstacleElem)
    ) {
      clearInterval(moveObstacle);
      clearInterval(obstaclesInterval);
      // alert("Game Over");
    } else if (obstaclePosition <= -50) {
      clearInterval(moveObstacle);
      gameContainer.removeChild(obstacleElem);
      document.getElementById("score").innerText = `Score: ${++score}`;
    } else {
      obstacleElem.style.right = `${obstaclePosition + 10}px`;
    }
  }, 100);
}

function detectCollision(player, obstacle) {
  let playerBounding = player.getBoundingClientRect();
  let obstacleBounding = obstacle.getBoundingClientRect();

  return (
    playerBounding.bottom > obstacleBounding.top &&
    playerBounding.top < obstacleBounding.bottom &&
    playerBounding.right > obstacleBounding.left &&
    playerBounding.left < obstacleBounding.right
  );
}

function launchGame() {
  console.log("3 launch function");

  frames++;
  if (frames % 120 === 0) {
    const obstacleElem = document.createElement("div");
    obstacleElem.classList.add("obstacle");
    gameContainer.appendChild(obstacleElem);
    obstacleElem.style.right = "0px";
    obstacles.push(obstacleElem);
  }

  const playerBounding = character.getBoundingClientRect();

  for (const obs of obstacles) {
    const obstaclePosition = parseInt(obs.style.right);
    const obstacleBounding = obs.getBoundingClientRect();
    if (
      obstacleBounding.left < playerBounding.right &&
      obstacleBounding.right > playerBounding.left &&
      playerBounding.bottom >= obstacleBounding.top
    ) {
      clearInterval(obstaclesInterval);
      console.log("============");
      playButton.style.display = "none";
      playAgainButton.style.display = "block";
    } else if (obstacleBounding.right < playerBounding.left && !obs.scored) {
      obs.scored = true;
      document.getElementById("score").innerText = `Score: ${++score}`;
    } else if (obstaclePosition <= -50) {
      obs.remove();
      obstacles.splice(obstacles.indexOf(obs), 1);
    } else {
      obs.style.right = `${obstaclePosition + 10}px`;
    }
  }
}

function startGame() {
  console.log("2 start function");
  //obstaclesInterval = setInterval(createObstacle, 2000);
  obstaclesInterval = setInterval(launchGame, 1000 / 60);
}

function handlePlayButtonClick() {
  console.log("1 handle function");
  playButton.style.display = "none";
  startGame();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

playButton.addEventListener("click", handlePlayButtonClick);

playAgainButton.addEventListener("click", () => {
  isJumping = false;
  obstaclesInterval = null;
  score = 0;
  obstacles = [];
  frames = 0;

  character.style.bottom = "0";

  const allObstacles = document.querySelectorAll(".obstacle");
  allObstacles.forEach((obstacle) => {
    obstacle.remove();
  });

  playAgainButton.style.display = "none";
  playButton.style.display = "block";
});
