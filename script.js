let gameseq = [];
let userseq = [];
const btns = ["red", "yellow", "blue", "purple"];
let started = false;
let level = 0;
let canClick = false;
let hintUsed = false;

const h2 = document.getElementById("status");
const h3 = document.getElementById("level-title");
const restartBtn = document.getElementById("restart-btn");
const hintBtn = document.getElementById("hint-btn");

document.addEventListener("keypress", () => {
  if (!started) {
    startGame();
  }
});

restartBtn.addEventListener("click", () => {
  if (!started) {
    startGame();
  }
});

hintBtn.addEventListener("click", () => {
  if (!hintUsed && started && canClick) {
    hintUsed = true;
    hintBtn.disabled = true;
    canClick = false;
    userseq = [];
    playFullSequence(() => {
      canClick = true;
    });
  }
});

function startGame() {
  started = true;
  gameseq = [];
  userseq = [];
  level = 0;
  hintUsed = false;
  h2.innerText = "Game is started";
  h3.innerText = "Level : 0";
  restartBtn.style.display = "none";
  hintBtn.disabled = true;
  levelUp();
}

function levelUp() {
  userseq = [];
  level++;
  hintUsed = false;
  h3.innerText = `Level : ${level}`;
  hintBtn.disabled = false;

  const randColor = btns[Math.floor(Math.random() * 4)];
  gameseq.push(randColor);

  playNewColor(() => {
    canClick = true;
  });
}

// Play ONLY the new color added at the end of gameseq
function playNewColor(callback) {
  canClick = false;
  const color = gameseq[gameseq.length - 1];
  const btn = document.getElementById(color);

  const maxSpeed = 800;
  const minSpeed = 300;
  const speed = Math.max(minSpeed, maxSpeed - (level - 1) * 50);

  gameflash(btn);
  playSound(color);

  setTimeout(() => {
    if (callback) callback();
  }, speed);
}

// Play full sequence - used only for hint
function playFullSequence(callback) {
  let i = 0;

  const maxSpeed = 800;
  const minSpeed = 300;
  const speed = Math.max(minSpeed, maxSpeed - (level - 1) * 50);

  const interval = setInterval(() => {
    const color = gameseq[i];
    const btn = document.getElementById(color);
    gameflash(btn);
    playSound(color);
    i++;
    if (i >= gameseq.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

function gameflash(btn) {
  btn.classList.add("gameflash");
  setTimeout(() => {
    btn.classList.remove("gameflash");
  }, 300);
}

function userflash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => {
    btn.classList.remove("userflash");
  }, 300);
}

function playSound(color) {
  const sounds = {
    red: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
    yellow: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
    blue: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
    purple: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3",
    wrong: "https://s3.amazonaws.com/adam-recvlohe-sounds/error.wav"
  };

  const audio = new Audio(sounds[color]);
  audio.play();
}

function checkAnswer(index) {
  if (userseq[index] === gameseq[index]) {
    if (userseq.length === gameseq.length) {
      canClick = false;
      setTimeout(levelUp, 1000);
    }
  } else {
    playSound("wrong");
    document.body.style.backgroundColor = "red";
    setTimeout(() => {
      document.body.style.backgroundColor = "#f0f0f0";
    }, 500);
    h2.innerText = `Game Over! Your score is: ${level}`;
    h3.innerText = "Press any key or Restart to try again.";
    restartBtn.style.display = "block";
    hintBtn.disabled = true;
    started = false;
    canClick = false;
  }
}

function handleButtonPress() {
  if (!canClick) return;

  const btn = this;
  const color = btn.id;

  userseq.push(color);
  userflash(btn);
  playSound(color);
  checkAnswer(userseq.length - 1);
}

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", handleButtonPress);
});
