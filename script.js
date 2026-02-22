// =============================
// EDIT THESE ONLY ✅
// =============================
const SETTINGS = {
  momName: "Isatu Timi Bangura",
  momBirthDate: "February 22, 1968 00:00:00",
  rotateEvery: 5000, // 5 seconds
};

// =============================
// Elements
// =============================
const envelope = document.getElementById("envelope");
const bgMusic = document.getElementById("bgMusic");
const splashImg = document.getElementById("splash-img");
const musicToggle = document.getElementById("music-control");

const splashText = document.getElementById("splash-text");
const splashSubtext = document.getElementById("splash-subtext");

if (splashImg) splashImg.style.opacity = 1;

// Name targets
const momNameTargets = [
  document.getElementById("mom-name-letter"),
  document.getElementById("mom-name"),
  document.getElementById("mom-name-footer"),
];
momNameTargets.forEach(el => { if (el) el.textContent = SETTINGS.momName; });

// =============================
// Music Toggle
// =============================
if (musicToggle && bgMusic) {
  musicToggle.onclick = () => {
    if (bgMusic.paused) { bgMusic.play(); musicToggle.innerText = "🎵"; }
    else { bgMusic.pause(); musicToggle.innerText = "🔇"; }
  };
}

// =============================
// Envelope -> Splash -> Home
// =============================
function openSequence() {
  if (!envelope) return;

  envelope.classList.add("open");
  if (bgMusic) bgMusic.play().catch(() => {});

  setTimeout(() => {
    const envStage = document.getElementById("envelope-stage");
    const splashStage = document.getElementById("splash-stage");
    if (envStage) envStage.style.display = "none";
    if (splashStage) splashStage.style.display = "flex";
    runSplashSequence();
  }, 1200);
}

if (envelope) {
  envelope.onclick = openSequence;
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openSequence();
  });
}

// =============================
// Splash story (3 steps) - uses mom pics
// =============================
function runSplashSequence() {
  const steps = [
    {
      img: "MOM1.jpeg",
      title: "Today is not just a birthday…",
      sub: "It’s a celebration of a life that blessed our family.",
    },
    {
      img: "MOM2.jpeg",
      title: "A woman of strength and dignity 👑",
      sub: "Your love built the home we stand in today.",
    },
    {
      img: "MOM3.jpeg",
      title: "Happy Birthday, Mom 💛",
      sub: "We thank God for your life, your love, and your prayers.",
    },
  ];

  let i = 0;

  function applyStep(step) {
    if (!splashImg) return;

    splashImg.style.opacity = 0;

    if (splashText) splashText.textContent = step.title;
    if (splashSubtext) splashSubtext.textContent = step.sub;

    // re-trigger text animation
    if (splashText) {
      splashText.style.animation = "none";
      void splashText.offsetWidth;
      splashText.style.animation = "";
    }
    if (splashSubtext) {
      splashSubtext.style.animation = "none";
      void splashSubtext.offsetWidth;
      splashSubtext.style.animation = "";
    }

    const nextSrc = step.img;

    splashImg.onload = () => { splashImg.style.opacity = 1; };
    splashImg.onerror = () => {
      splashImg.style.opacity = 1;
      splashImg.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
            <rect width='100%' height='100%' fill='#ffffff'/>
            <text x='50%' y='48%' dominant-baseline='middle' text-anchor='middle'
              font-family='Montserrat, Arial' font-size='28' fill='#AA8222'>
              Missing image
            </text>
            <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
              font-family='Montserrat, Arial' font-size='18' fill='#777'>
              ${nextSrc}
            </text>
          </svg>
        `);
    };

    setTimeout(() => { splashImg.src = nextSrc; }, 250);
  }

  applyStep(steps[i]);

  const interval = setInterval(() => {
    i += 1;

    if (i >= steps.length) {
      clearInterval(interval);
      setTimeout(() => {
        const splashStage = document.getElementById("splash-stage");
        const homeStage = document.getElementById("home-stage");
        if (splashStage) splashStage.style.display = "none";
        if (homeStage) homeStage.style.display = "block";

        handleScrollReveal();
        startSweetWords();
        startAllRotations(); // ✅ start main page rotations
      }, 1000);

      return;
    }

    applyStep(steps[i]);
  }, 3200);
}

// =============================
// Live Timer
// =============================
function updateTimer() {
  const birth = new Date(SETTINGS.momBirthDate).getTime();
  const now = Date.now();
  const d = now - birth;

  const y = Math.floor(d / 31557600000);
  const days = Math.floor((d % 31557600000) / 86400000);
  const h = Math.floor((d % 86400000) / 3600000);
  const m = Math.floor((d % 3600000) / 60000);
  const s = Math.floor((d % 60000) / 1000);

  const el = document.getElementById("live-timer");
  if (el) el.innerHTML = `${y} Years <br> ${days} Days, ${h} Hrs, ${m} Mins, ${s} Secs`;
}
setInterval(updateTimer, 1000);
updateTimer();

// =============================
// Scroll Reveal
// =============================
function handleScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("active"); }),
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal, .section-card").forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

// =============================
// Floating Words (mom-themed)
// =============================
function startSweetWords() {
  const container = document.getElementById("sweet-words");
  if (!container) return;

  const words = [
    "Our Queen 👑",
    "Our Strength",
    "Our Prayer Warrior",
    "Grace & Favor",
    "A Heart of Gold",
    "Loved Beyond Words",
  ];

  function spawnWord() {
    const w = document.createElement("div");
    w.className = "floating-word";
    w.textContent = words[Math.floor(Math.random() * words.length)];

    const left = Math.random() * 90 + 5;
    const top = Math.random() * 40 + 10;
    w.style.left = `${left}%`;
    w.style.top = `${top}%`;

    const dur = Math.random() * 4 + 5;
    w.style.animationDuration = `${dur}s`;

    container.appendChild(w);
    setTimeout(() => w.remove(), dur * 1000);
  }

  injectFloatingWordStyles();
  spawnWord();
  setInterval(spawnWord, 950);
}

function injectFloatingWordStyles() {
  if (document.getElementById("floating-word-style")) return;

  const style = document.createElement("style");
  style.id = "floating-word-style";
  style.textContent = `
    .floating-word{
      position:absolute;
      z-index: 0;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(192,192,192,0.35);
      box-shadow: 0 14px 30px rgba(0,0,0,0.05);
      color: rgba(170,130,34,0.98);
      font-weight: 700;
      font-size: 0.95rem;
      opacity: 0;
      transform: translateY(12px);
      animation: floatUp linear forwards;
      pointer-events:none;
      white-space: nowrap;
      backdrop-filter: blur(8px);
    }
    @keyframes floatUp{
      0%{ opacity: 0; transform: translateY(18px) scale(0.98); }
      15%{ opacity: 1; }
      100%{ opacity: 0; transform: translateY(-60px) scale(1.02); }
    }
  `;
  document.head.appendChild(style);
}

// =============================
// ✅ Rotations using YOUR filenames
// =============================
function makeRange(prefix, start, end, ext = "jpeg") {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(`${prefix}${i}.${ext}`);
  return arr;
}

function rotateImages(imgEl, sources, everyMs = 5000) {
  if (!imgEl || !Array.isArray(sources) || sources.length === 0) return;

  let idx = 0;
  imgEl.style.opacity = 1;

  function setSrc(next) {
    imgEl.style.opacity = 0;

    imgEl.onload = () => { imgEl.style.opacity = 1; };
    imgEl.onerror = () => {
      imgEl.style.opacity = 1;
      imgEl.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg xmlns='http://www.w3.org/2000/svg' width='900' height='600'>
            <rect width='100%' height='100%' fill='#ffffff'/>
            <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
              font-family='Montserrat, Arial' font-size='26' fill='#AA8222'>
              Missing image: ${next}
            </text>
          </svg>
        `);
    };

    setTimeout(() => { imgEl.src = next; }, 250);
  }

  setSrc(sources[idx]);

  setInterval(() => {
    idx = (idx + 1) % sources.length;
    setSrc(sources[idx]);
  }, everyMs);
}

function startAllRotations() {
  // MOM1..MOM14
  rotateImages(
    document.getElementById("rot-mom-solo"),
    makeRange("MOM", 1, 14, "jpeg"),
    SETTINGS.rotateEvery
  );

  // MOMANDSIS1..MOMANDSIS7
  rotateImages(
    document.getElementById("rot-mom-mary"),
    makeRange("MOMANDSIS", 1, 7, "jpeg"),
    SETTINGS.rotateEvery
  );

  // MOMANDME1..MOMANDME3
  rotateImages(
    document.getElementById("rot-me-mom"),
    makeRange("MOMANDME", 1, 3, "jpeg"),
    SETTINGS.rotateEvery
  );

  // FAMILY1..FAMILY6
  rotateImages(
    document.getElementById("rot-family3"),
    makeRange("FAMILY", 1, 6, "jpeg"),
    SETTINGS.rotateEvery
  );
}

// =============================
// Particle Engine (gold)
// =============================
const canvas = document.getElementById("bg-particles");
const ctx = canvas?.getContext("2d");
let particlesArray = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
if (canvas) {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

function getAccentRGB() {
  const rgb = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-rgb")
    .trim();
  return rgb || "212, 175, 55";
}

class Particle {
  constructor(accentRGB) {
    this.accentRGB = accentRGB;
    this.reset();
    this.y = Math.random() * canvas.height;
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 80;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * -1 - 0.5;
    this.opacity = Math.random() * 0.35 + 0.15;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < -20) this.reset();
  }
  draw() {
    ctx.fillStyle = `rgba(${this.accentRGB}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  if (!canvas || !ctx) return;
  particlesArray = [];
  const accentRGB = getAccentRGB();
  for (let i = 0; i < 110; i++) particlesArray.push(new Particle(accentRGB));
}

function animateParticles() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();