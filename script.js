let score = 0;
let cross = true;
let gameEnded = false; // Flag to check if the game has ended
let gameStarted = false; // Flag to check if the game has started
let firstAttempt = true; // Flag to track if this is the first attempt

const audio = new Audio("music.mp3");
const audiogo = new Audio("gameover.mp3");

// Play background music after 1 second
setTimeout(() => {
  audio.play().catch((error) => console.error("Playback failed:", error));
}, 1000);

document.onkeydown = function (e) {
  if (gameEnded) return; // Prevent further key actions if the game has ended

  console.log("Key code is:", e.keyCode);
  let boy = document.querySelector(".boy");

  if (!boy) {
    console.error(".boy element not found");
    return;
  }

  if (e.keyCode == 38) {
    // Up arrow
    boy.classList.add("animateBoy");
    setTimeout(() => {
      boy.classList.remove("animateBoy");
    }, 1000);
  } else if (e.keyCode == 39) {
    // Right arrow
    let boyX = parseInt(
      window.getComputedStyle(boy, null).getPropertyValue("left")
    );
    boy.style.left = boyX + 112 + "px";
  } else if (e.keyCode == 37) {
    // Left arrow
    let boyX = parseInt(
      window.getComputedStyle(boy, null).getPropertyValue("left")
    );
    boy.style.left = boyX - 112 + "px";
  }

  // Set gameStarted to true when any key is pressed
  gameStarted = true;
};

// Game loop
setInterval(() => {
  if (gameEnded) return; // Stop updates if the game has ended

  let boy = document.querySelector(".boy");
  let gameOver = document.querySelector(".gameOver");
  let obstacle = document.querySelector(".obstacle");

  if (!boy || !gameOver || !obstacle) {
    console.error("Required elements not found");
    return;
  }

  let dx = parseInt(
    window.getComputedStyle(boy, null).getPropertyValue("left")
  );
  let dy = parseInt(window.getComputedStyle(boy, null).getPropertyValue("top"));
  let ox = parseInt(
    window.getComputedStyle(obstacle, null).getPropertyValue("left")
  );
  let oy = parseInt(
    window.getComputedStyle(obstacle, null).getPropertyValue("top")
  );

  let offsetX = Math.abs(dx - ox);
  let offsetY = Math.abs(dy - oy);

  console.log("Boy position: ", dx, dy);
  console.log("Obstacle position: ", ox, oy);
  console.log("Offset: ", offsetX, offsetY);

  if (offsetX < 113 && offsetY < 52) {
    // Collision detected
    gameOver.style.visibility = "visible";
    gameOver.innerHTML = "Game Over - Reload to Play Again";
    obstacle.classList.remove("obstacleAni");
    audiogo.play().catch((error) => console.error("Playback failed:", error));
    setTimeout(() => {
      audiogo.pause();
      audio.pause();
    }, 1000);

    if (firstAttempt) {
      // If this is the first attempt and the game ends, reset score to 0
      score = 0;
      updateScore(score);
      firstAttempt = false; // No longer the first attempt after the game ends
    }

    gameEnded = true; // Set gameEnded to true to stop further updates and actions
  } else if (offsetX < 200 && cross && !gameEnded) {
    // Increment score only if the game has started and hasn't ended
    if (gameStarted) {
      score += 1;
      updateScore(score);
      cross = false;
      setTimeout(() => {
        cross = true;
      }, 1000);

      setTimeout(() => {
        let aniDur = parseInt(
          window
            .getComputedStyle(obstacle, null)
            .getPropertyValue("animation-duration")
        );
        let newDur = aniDur - 0.1;
        obstacle.style.animationDuration = newDur + "s";
        console.log("New animation duration:", newDur);
      }, 500);
    }
  }
}, 10);

// Update score display
function updateScore(score) {
  let scoreCount = document.querySelector("#scoreCount");
  if (scoreCount) {
    scoreCount.innerHTML = "Your Score: " + score;
  } else {
    console.error("#scoreCount element not found");
  }
}
