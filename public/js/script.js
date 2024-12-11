// Main visor element
let visorMain = document.getElementById("visor__main");

let level; // Current level
let maxLevels; // Maximum number of levels
let maxJars; // Maximum number of jars (containers)
let maxBalls; // Maximum number of balls
let currentCharacter; // Current character being interacted with
let previousPosition; // Previous position of the ball
let timer; // Timer for the game
let baseTime = 40; // Base time for timer

let jarArray = []; // Array to hold the jars
let jarBalls = []; // Array to hold the balls in each jar
let isClickable = true; // Flag to manage click behavior

let interval; // Interval for the timer

let isGameOver = false; // Flag to indicate the end of the game

// Initialize the background audio globally as backgroundAudio
let backgroundAudio = new Audio("./assets/audio/musicaBackground.wav");
backgroundAudio.volume = 0.1; // Set background audio volume
backgroundAudio.loop = true; // Enable looping for the background audio

// Function to play "remove ball" sound
const playRemoveBallSound = () => {
  let audio = new Audio("./assets/audio/sacarBola.wav");
  audio.volume = 0.6;
  audio.play();
};

// Function to play "place ball" sound
const playPlaceBallSound = () => {
  let audio = new Audio("./assets/audio/meterBola.wav");
  audio.volume = 0.6;
  audio.play();
};


// Function to play "failed move" sound
const playFailedMoveSound = () => {
  let audio = new Audio("./assets/audio/movimientoFallido.wav");
  audio.volume = 0.4;
  audio.play();
};

// Function to play "level up" sound
const playLevelUpSound = () => {
  let audio = new Audio("./assets/audio/lvlUp.wav");
  audio.volume = 0.5;
  audio.play();
};

// Function to play "game lost" sound
const playGameLostSound = () => {
  let audio = new Audio("./assets/audio/juegoPerdido.mp3");
  audio.volume = 0.4;
  audio.play();
};

// Function to play "game won" sound
const playGameWonSound = () => {
  let audio = new Audio("./assets/audio/juegoGanado.wav");
  audio.volume = 0.4;
  audio.play();
};


function updateEnvironment(previousPos = null, currentPos = null) {
  function editEnvironment(previousPos, currentPos) {
    const mainJarsContainer = document.getElementById("main__frascos");

    // Clear all children from the previous position jar
    while (mainJarsContainer.children[previousPos].children.length > 0) {
      mainJarsContainer.children[previousPos].removeChild(
        mainJarsContainer.children[previousPos].firstChild
      );
    }

    // Add balls to the previous position jar
    for (let index = 0; index < jarArray[previousPos].length; index++) {
      let ball = document.createElement("DIV");
      ball.classList.add("pixel-ball");
      ball.classList.add("color" + jarArray[previousPos][index]);
      mainJarsContainer.children[previousPos].append(ball);
    }

    // If the current position is different, update it
    if (previousPos !== currentPos) {
      while (mainJarsContainer.children[currentPos].children.length > 0) {
        mainJarsContainer.children[currentPos].removeChild(
          mainJarsContainer.children[currentPos].firstChild
        );
      }

      for (let index = 0; index < jarArray[currentPos].length; index++) {
        let ball = document.createElement("DIV");
        ball.classList.add("pixel-ball");
        ball.classList.add("color" + jarArray[currentPos][index]);
        mainJarsContainer.children[currentPos].append(ball);
      }
    }
  }

  function generateEnvironment() {
    const mainJarsContainer = document.createElement("DIV");
    mainJarsContainer.style.display = "flex";
    mainJarsContainer.style.justifyContent = "center";
    mainJarsContainer.style.position = "relative";
    mainJarsContainer.style.top = "130px";
    mainJarsContainer.id = "main__frascos";

    // Add a click listener to the jar container
    mainJarsContainer.addEventListener("click", jarAction);

    let jarsFragment = document.createDocumentFragment();
    for (let index = 0; index < jarArray.length; index++) {
      let jar = document.createElement("DIV");
      jar.classList.add("jar_visual");
      jar.style.height = (40 * maxBalls + 15).toString() + "px";
      jar.id = "jar" + index;
      jar.style.position = "relative";
      jar.style.top = "0";

      let ballsFragment = document.createDocumentFragment();

      for (let ballIndex = 0; ballIndex < jarArray[index].length; ballIndex++) {
        let ball = document.createElement("DIV");
        ball.classList.add("pixel-ball");
        ball.classList.add("color" + jarArray[index][ballIndex]);
        ballsFragment.append(ball);
      }

      jar.append(ballsFragment);
      jarsFragment.append(jar);
      mainJarsContainer.append(jarsFragment);
      visorMain.append(mainJarsContainer);
    }
  }

  if (previousPos === null && currentPos === null) {
    generateEnvironment();
  } else {
    editEnvironment(previousPos, currentPos);
  }
}

const initializeEnvironment = () => {
  // Stop and reset background audio if it's playing
  if (!backgroundAudio.paused) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }

  backgroundAudio.play();

  // Reset jar and ball arrays
  if (jarArray.length !== 0) jarArray = [];
  if (jarBalls.length !== 0) jarBalls = [];

  // Remove previous character and UI elements
  const character1 = visorMain.querySelector("#character_1");
  character1?.remove();

  const mainSection = document.getElementById("main__section");
  mainSection?.remove();

  const titleText = visorMain.querySelector("#visor__div__texto");
  titleText?.remove();

  // Set initial game parameters
  timer = 40;
  level = 0;
  maxLevels = 3;
  maxJars = 4;
  maxBalls = 4;

  // Generate a random board and initialize environment
  generateRandomBoard();
  updateEnvironment();
  startTimer();
  updateSkyColor(level);
};


function generateRandomBoard() {
  // Always leave two jars empty for gameplay
  for (let i = 0; i < maxJars; i++) {
    let jarBalls = [];
    jarArray.push(jarBalls);
    if (i < maxJars - 2) {
      // Fill jars with balls up to the maxBalls limit
      for (let j = 0; j < maxBalls; j++) {
        jarBalls.push(i);
      }
    }
  }

  do {
    // Shuffle the balls multiple times based on the number of jars and balls
    for (let i = 0; i < maxJars * (maxJars - 2); i++) {
      const randomJar1 = Math.floor(Math.random() * (maxJars - 2));
      const randomBall1 = Math.floor(Math.random() * maxBalls);
      const randomJar2 = Math.floor(Math.random() * (maxJars - 2));
      const randomBall2 = Math.floor(Math.random() * maxBalls);

      // Swap balls between two randomly selected positions
      let temp = jarArray[randomJar1][randomBall1];
      jarArray[randomJar1][randomBall1] = jarArray[randomJar2][randomBall2];
      jarArray[randomJar2][randomBall2] = temp;
    }
  } while (isBoardSolved()); 
  // Ensure the generated board isn't solved at the start
}

const startTimer = () => {
  const timerElement = document.getElementById("visorHeader__div__temporizador");
  timerElement.classList.add("timerOn");

  // Format and display the initial time
  let minutes = Math.floor(timer / 60).toString();
  let seconds = Math.floor(timer % 60).toString();
  timerElement.children[1].textContent =
    minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0");

  // Start countdown interval
  interval = setInterval(() => {
    timer--;

    // Update time display
    let minutes = Math.floor(timer / 60).toString();
    let seconds = Math.floor(timer % 60).toString();
    timerElement.children[1].textContent =
      minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0");

    // Handle when timer reaches 0
    if (timer === 0) {
      debugger;
      let isWon = false;
      playGameLostSound();
      clearEnvironment();
      showGameEndScreen(isWon);
    }
  }, 1000);
};

function loadCharacter() {
  let characterElement = document.createElement("IMG");
  characterElement.style.position = "absolute";
  characterElement.style.zIndex = "30";
  characterElement.style.height = "400px";
  characterElement.style.width = "400px";
  characterElement.style.left = "650px";
  characterElement.style.top = "90px";
  characterElement.id = "character_1";
  characterElement.alt = "Theo_character";
  debugger;
  characterElement.src = "assets/png/character2";
  return characterElement;
}


const startIntro = () => {
  createTitleText("THE ADVENTURES OF THEO", "BallSortPuzzle");

  setTimeout(() => {
    titleTextContainer.remove();
    createTitleText(null, "Help Theo find the colors");
    smallTitle.style.top = "160px";

    setTimeout(() => {
      titleTextContainer.remove();
      debugger;
      character1 = loadCharacter();
      visorMain.append(character1);
      createStartButton();
      startButton.addEventListener("click", initializeEnvironment);
    }, 4000); // Wait 4 seconds before displaying the start button and character
  }, 4000); // Wait 4 seconds before updating the text
};


function createTitleText(largeText = null, smallText = null) {
  titleTextContainer = document.createElement("DIV");
  titleTextContainer.id = "titleTextContainer";

  const largeTitle = document.createElement("H1");
  largeTitle.textContent = largeText;
  largeTitle.classList.add("largeTitleFont");

  if (smallText) {
    const smallTitle = document.createElement("H2");
    smallTitle.textContent = smallText;
    smallTitle.classList.add("smallTitleFont");
    titleTextContainer.append(smallTitle);
  }

  titleTextContainer.append(largeTitle);
  visorMain.append(titleTextContainer);
}


const handleWinCondition = () => {
  const isWon = isBoardSolved();
  console.log("Win condition: " + isWon);

  // Reset the board, environment, and increase level if won
  if (isWon) {
    level++;
    jarArray = [];
    jarBalls = [];

    // If the maximum level is reached
    if (level === maxLevels) {
      playGameWonSound();
      clearEnvironment();
      timer = 0;
      updateSkyColor(2); // Set sky color for the final level
      showGameEndScreen(isWon);
    } else {
      playLevelUpSound();
      maxBalls++;
      maxJars++;
      clearEnvironment();
      generateRandomBoard();
      updateEnvironment();
      updateSkyColor(level);
      timer = baseTime + 10 * level; // Add 10 seconds per level
    }
  }
};


const updateSkyColor = (level) => {
  if (level > 2) level = 2; // Limit level to 2 for sky color changes

  const sky = visorMain.parentNode;
  const background = sky.firstChild.nextSibling;

  switch (level) {
    case 0:
      sky.classList = [...sky.classList].filter(
        (cls) =>
          cls !== "blueSky" &&
          cls !== "initialSky" &&
          cls !== "graySky" &&
          cls !== "orangeSky"
      );
      sky.classList.add("graySky");

      background.classList = [...background.classList].filter(
        (cls) =>
          cls !== "grayBackground3" &&
          cls !== "grayBackground2" &&
          cls !== "grayBackground1"
      );
      background.classList.add("grayBackground1");
      break;

    case 1:
      sky.classList.remove("graySky");
      sky.classList.add("orangeSky");

      background.classList.remove("grayBackground1");
      background.classList.add("grayBackground2");
      break;

    case 2:
      sky.classList.remove("orangeSky");
      sky.classList.add("blueSky");

      background.classList.remove("grayBackground2");
      background.classList.add("grayBackground3");
      break;

    default:
      break;
  }
};


function clearEnvironment() {
  const mainJars = document.getElementById("main__jars");

  if (mainJars !== null) {
    mainJars.remove();
  }
}


function handleJarClick(event) {
  if (event.target.classList.length > 0) {
    if (event.target.nodeName === "DIV") {
      if (event.target.classList[0].startsWith("pixel")) {
        if (click) {
          playRemoveBallSound();
          previousPosition = parseInt(event.target.parentNode.id.slice(6));

          let ballCount = jarArray[previousPosition].length;
          event.target.parentNode.firstChild.style.top =
            "-" + ((maxBalls - ballCount) * 40 + 75).toString() + "px";

          click = false;
        } else {
          const targetPosition = parseInt(event.target.parentNode.id.slice(6));

          const topBallSource = jarArray[previousPosition][0];
          const topBallTarget = jarArray[targetPosition][0];

          if (jarArray[targetPosition].length > 0) {
            if (
              previousPosition === targetPosition ||
              topBallSource !== topBallTarget
            ) {
              playFailedMoveSound();
              updateEnvironment(previousPosition, targetPosition);
              click = true;
            }
          }

          if (
            !click &&
            previousPosition !== targetPosition &&
            targetPosition >= 0 &&
            targetPosition < jarArray.length
          ) {
            if (jarArray[targetPosition].length < maxBalls) {
              jarArray[targetPosition].unshift(jarArray[previousPosition].shift());
              playPlaceBallSound();
              updateEnvironment(previousPosition, targetPosition);
              click = true;
            }
          }

          checkWinCondition();
        }
      }

      if (event.target.id.startsWith("jar")) {
        if (click) {
          playRemoveBallSound();
          previousPosition = parseInt(event.target.id.slice(6));

          let ballCount = jarArray[previousPosition].length;
          event.target.firstChild.style.top =
            "-" + ((maxBalls - ballCount) * 40 + 75).toString() + "px";

          click = false;
        } else {
          const targetPosition = parseInt(event.target.id.slice(6));

          const topBallSource = jarArray[previousPosition][0];
          const topBallTarget = jarArray[targetPosition][0];

          if (jarArray[targetPosition].length > 0) {
            if (
              previousPosition === targetPosition ||
              topBallSource !== topBallTarget
            ) {
              playFailedMoveSound();
              updateEnvironment(previousPosition, targetPosition);
              click = true;
            }
          }

          if (
            !click &&
            previousPosition !== targetPosition &&
            targetPosition >= 0 &&
            targetPosition < jarArray.length
          ) {
            if (jarArray[targetPosition].length < maxBalls) {
              jarArray[targetPosition].unshift(jarArray[previousPosition].shift());
              playPlaceBallSound();
              updateEnvironment(previousPosition, targetPosition);
              click = true;
            }
          }

          checkWinCondition();
        }
      }
    }
  }
}



function isBoardSolved() {
  let isSolved = true;
  let fullJarCount = 0;

  for (let i = 0; i < jarArray.length; i++) {
    // Check if the jar is full
    if (jarArray[i].length === maxBalls) {
      fullJarCount++;
      let j = 1;
      let firstBall = jarArray[i][0];

      // Ensure all balls in the jar are the same
      while (isSolved && j < jarArray[i].length) {
        if (firstBall !== jarArray[i][j]) {
          isSolved = false;
        }
        j++;
      }
    }
  }

  // Verify if all but two jars are full
  if (fullJarCount !== maxJars - 2) {
    isSolved = false;
  }

  return isSolved;
}


function handleGameEnd(isWon) {
  stopTimer();

  if (isWon) {
    console.log("Game Won");
    createTitleText(
      "YOU WON!",
      "YOU HELPED THEO FIND ALL THE COLORS"
    );
  } else {
    console.log("Game Lost");
    createTitleText("GAME OVER", "YOU LOST");
  }

  setTimeout(() => {
    titleTextContainer.remove();

    if (isWon) {
      createTitleText("TRY AGAIN", "BEAT YOUR RECORD!");
    } else {
      createTitleText("TRY AGAIN", "YOU CAN DO IT!");
    }

    character1 = loadCharacter();
    visorMain.append(character1);
    createStartButton();
    startButton.addEventListener("click", initializeEnvironment);
  }, 4000);
}


function stopTimer() {
  const timerDisplay = visorMain.previousElementSibling.querySelector(
    "#visorHeader__div__temporizador"
  );
  timerDisplay.children[1].textContent = "00:00"; // Set the timer to 0
  clearInterval(interval); // Stop the interval
}


function createStartButton() {
  const mainSection = document.createElement("SECTION");
  const startLink = document.createElement("A");
  const startImage = document.createElement("IMG");

  mainSection.classList.add("main__button");
  mainSection.id = "main__section";
  startImage.classList.add("button__image");
  startImage.src = "assets/png/—Pngtree—start button in pixel art_7949383 (1).png";
  startLink.href = "#";
  startImage.alt = "Start Button Image";

  mainSection.append(startLink);
  startLink.append(startImage);
  visorMain.appendChild(mainSection);
}


document.addEventListener("DOMContentLoaded", startIntro);

