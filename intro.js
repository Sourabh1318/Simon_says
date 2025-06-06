const cube = document.getElementById("cube");
const buttons = document.querySelectorAll(".nav-btn");
let angle = 0;

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    angle -= 90;
    cube.style.transform = `rotateY(${angle}deg)`;

    if (btn.id === "start-btn") {
      setTimeout(() => {
        window.location.href = 'game.html';
      }, 1000);
    }
  });
});

const audio = document.getElementById('intro-audio');
audio.play().catch(() => {});
document.body.addEventListener('click', () => {
  audio.muted = false;
  audio.play();
}, { once: true });
