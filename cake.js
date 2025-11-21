// ===== MICROPHONE + BLOW DETECTION =====

let audioContext;
let analyser;
let dataArray;
let micStream;

const startBtn = document.getElementById("startBtn");
const candles = document.querySelectorAll(".purple-flame");
const sparkler = document.querySelector(".sparkler");
const message = document.getElementById("message");

// Threshold for detecting blowing (adjustable)
const blowThreshold = 55;

startBtn.addEventListener("click", async () => {
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(micStream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;

        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);

        startBtn.style.display = "none";
        listenForBlow();

    } catch (err) {
        alert("Microphone access was denied.");
        console.error(err);
    }
});

function listenForBlow() {
    analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    let volume = sum / dataArray.length;

    if (volume > blowThreshold) {
        extinguishCandles();
        launchConfetti();
        revealMessage();
    } else {
        requestAnimationFrame(listenForBlow);
    }
}

// ===== CANDLE EXTINGUISHING =====
function extinguishCandles() {
    candles.forEach(c => {
        c.style.animation = "none";
        c.style.opacity = "0";
    });

    sparkler.style.display = "none";
}



// ===== CONFETTI =====

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confettiPieces = [];

function launchConfetti() {
    const colors = ["#b084f5", "#d7a7ff", "#f7d86d", "#ffd700"];

    for (let i = 0; i < 250; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            w: 6,
            h: 12,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            drift: (Math.random() - 0.5) * 2
        });
    }

    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((p, index) => {
        p.y += p.speed;
        p.x += p.drift;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        if (p.y > canvas.height) {
            confettiPieces.splice(index, 1);
        }
    });

    if (confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}



// ===== MESSAGE REVEAL =====
function revealMessage() {
    message.classList.remove("hidden");
    setTimeout(() => {
        message.classList.add("show");
    }, 300);
}
