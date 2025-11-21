// BUTTON BLOWOUT
document.getElementById("blowButton").addEventListener("click", blowOut);

function blowOut() {
  document.querySelectorAll(".flame").forEach(f => {
    f.style.display = "none";
  });

  startConfetti();
  showMessage();
  stopSparkler();
}

function stopSparkler() {
  document.querySelectorAll(".spark").forEach(s => s.style.animation = "none");
}

function showMessage() {
  const msg = document.getElementById("message");
  msg.classList.remove("hidden");
  msg.classList.add("visible");
}

/* CONFETTI SYSTEM */
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];

function startConfetti() {
  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -50,
      size: Math.random() * 8 + 4,
      color: Math.random() > 0.5 ? "purple" : "gold",
      speed: Math.random() * 3 + 2
    });
  }
  requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach(c => {
    ctx.fillStyle = c.color;
    ctx.fillRect(c.x, c.y, c.size, c.size);
    c.y += c.speed;
  });

  requestAnimationFrame(updateConfetti);
}
