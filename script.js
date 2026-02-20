// --- Elements ---
const envelope = document.getElementById('envelope');
const bgMusic = document.getElementById('bgMusic');
const splashImg = document.getElementById('splash-img');
const musicToggle = document.getElementById('music-control');

// --- 1. Audio Control ---
musicToggle.onclick = () => {
    if (bgMusic.paused) { bgMusic.play(); musicToggle.innerText = "🎵"; }
    else { bgMusic.pause(); musicToggle.innerText = "🔇"; }
};

// --- 2. Open Card Sequence ---
envelope.onclick = () => {
    envelope.classList.add('open');
    bgMusic.play(); // Starts music on interaction

    setTimeout(() => {
        document.getElementById('envelope-stage').style.display = 'none';
        document.getElementById('splash-stage').style.display = 'flex';
        
        // Rotate 3 images for 9 seconds (3 seconds each)
        const photos = ["photo1.jpg", "photo2.jpg", "photo3.jpg"];
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % photos.length;
            splashImg.style.opacity = 0; // Fade out
            setTimeout(() => {
                splashImg.src = photos[i];
                splashImg.style.opacity = 1; // Fade in
            }, 400); // 400ms transition
        }, 3000);

        // Move to Home Page after 9 seconds
        setTimeout(() => {
            clearInterval(interval);
            document.getElementById('splash-stage').style.display = 'none';
            document.getElementById('home-stage').style.display = 'block';
            handleScrollReveal(); 
        }, 9000);
    }, 1800); // Wait for letter to slide out before changing screen
};

// --- 3. Precision Live Timer ---
function updateTimer() {
    const birth = new Date("February 22, 1968 00:00:00").getTime();
    const now = new Date().getTime();
    const d = now - birth;

    const y = Math.floor(d / 31557600000); // Years including leap years
    const days = Math.floor((d % 31557600000) / 86400000);
    const h = Math.floor((d % 86400000) / 3600000);
    const m = Math.floor((d % 3600000) / 60000);
    const s = Math.floor((d % 60000) / 1000);

    document.getElementById('live-timer').innerHTML = 
        `${y} Years <br> ${days} Days, ${h} Hrs, ${m} Mins, ${s} Secs`;
}
setInterval(updateTimer, 1000);
updateTimer();

// --- 4. Scroll Reveal Logic ---
function handleScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .scroll-item').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// --- 5. Continuous Gold Particle Engine ---
const canvas = document.getElementById('bg-particles');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Size between 1 and 4
        this.speedX = Math.random() * 1 - 0.5; // Drift left/right
        this.speedY = Math.random() * -1 - 0.5; // Float upwards
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // If particle goes off top, reset to bottom
        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Gold color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 100; i++) { // 100 particles on screen
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();