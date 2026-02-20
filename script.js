const envelope = document.getElementById('envelope');
const bgMusic = document.getElementById('bgMusic');
const splashImg = document.getElementById('splash-img');
const musicToggle = document.getElementById('music-control');

// 1. Audio Control
musicToggle.onclick = () => {
    if (bgMusic.paused) { bgMusic.play(); musicToggle.innerText = "🎵"; }
    else { bgMusic.pause(); musicToggle.innerText = "🔇"; }
};

// 2. Open Card Sequence
envelope.onclick = () => {
    envelope.classList.add('open');
    bgMusic.play();

    setTimeout(() => {
        document.getElementById('envelope-stage').style.display = 'none';
        document.getElementById('splash-stage').style.display = 'flex';
        
        // Rotate 3 images for 9 seconds
        const photos = ["photo1.jpg", "photo2.jpg", "photo3.jpg"];
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % photos.length;
            splashImg.style.opacity = 0;
            setTimeout(() => {
                splashImg.src = photos[i];
                splashImg.style.opacity = 1;
            }, 300);
        }, 3000);

        setTimeout(() => {
            clearInterval(interval);
            document.getElementById('splash-stage').style.display = 'none';
            document.getElementById('home-stage').style.display = 'block';
            handleScrollReveal(); // Initialize scroll effects
        }, 9000);
    }, 1500);
};

// 3. Precision Timer
function updateTimer() {
    const birth = new Date("February 22, 1968 00:00:00").getTime();
    const now = new Date().getTime();
    const d = now - birth;

    const y = Math.floor(d / 31557600000);
    const days = Math.floor((d % 31557600000) / 86400000);
    const h = Math.floor((d % 86400000) / 3600000);
    const m = Math.floor((d % 3600000) / 60000);
    const s = Math.floor((d % 60000) / 1000);

    document.getElementById('live-timer').innerText = `${y} Years | ${days} Days | ${h}h ${m}m ${s}s`;
}
setInterval(updateTimer, 1000);

// 4. Scroll Reveal Logic
function handleScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .scroll-item').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}