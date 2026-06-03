let currentSlide = 1;
const totalSlides = 10;
const slides = document.querySelectorAll('.slide-frame');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const navProgressFill = document.getElementById('navProgressFill');
const navDots = document.getElementById('navDots');
const ringProgress = document.getElementById('ringProgress');
const currentSlideRing = document.getElementById('currentSlideRing');

function init() {
    createNavDots();
    createSlideMap();
    updateNavigation();
    init3DBackground();
    initCursorGlow();
}

function createNavDots() {
    navDots.innerHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.dataset.slide = i;
        dot.addEventListener('click', () => goToSlide(i));
        navDots.appendChild(dot);
    }
}

function createSlideMap() {
    const mapContent = document.getElementById('slideMapContent');
    const titles = [
        'Титульная', 'Что такое API?', 'Для чего нужен API?', 
        'Как работает API?', 'REST API', 'Что такое DRF?', 
        'Преимущества DRF', 'Что такое FastAPI?', 'Сравнение', 'Заключение'
    ];
    
    for (let i = 0; i < totalSlides; i++) {
        const item = document.createElement('div');
        item.classList.add('map-item');
        item.textContent = `${(i + 1).toString().padStart(2, '0')} | ${titles[i]}`;
        item.dataset.slide = i + 1;
        item.addEventListener('click', () => goToSlide(i + 1));
        mapContent.appendChild(item);
    }
    
    const toggleBtn = document.querySelector('.slide-map-toggle');
    toggleBtn.addEventListener('click', () => {
        mapContent.classList.toggle('active');
    });
}

function updateActiveDot() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    const mapItems = document.querySelectorAll('.map-item');
    mapItems.forEach((item, index) => {
        if (index + 1 === currentSlide) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function updateRingProgress() {
    const circumference = 2 * Math.PI * 16;
    const offset = circumference - (currentSlide / totalSlides) * circumference;
    ringProgress.style.strokeDashoffset = offset;
    currentSlideRing.textContent = currentSlide.toString().padStart(2, '0');
}

function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides && slideNumber !== currentSlide) {
        currentSlide = slideNumber;
        updateNavigation();
    }
}

function formatNumber(num) {
    return num.toString().padStart(2, '0');
}

function updateNavigation() {
    slides.forEach((slide, index) => {
        if (index + 1 === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
    
    const progress = (currentSlide / totalSlides) * 100;
    progressFill.style.width = `${progress}%`;
    navProgressFill.style.width = `${progress}%`;
    
    updateActiveDot();
    updateRingProgress();
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        updateNavigation();
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        updateNavigation();
    }
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
    } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(1);
    } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(totalSlides);
    }
});

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) {
            prevSlide();
        } else {
            nextSlide();
        }
    }
});

function init3DBackground() {
    const canvas = document.getElementById('bgCanvas3D');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    let particles = [];
    let time = 0;
    
    function createParticles() {
        const particleCount = Math.min(150, Math.floor(window.innerWidth * window.innerHeight / 6000));
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.2,
                alpha: Math.random() * 0.3 + 0.1,
                color: `hsl(${260 + Math.random() * 60}, 70%, 60%)`
            });
        }
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#050510');
        grad.addColorStop(0.5, '#0a0a2a');
        grad.addColorStop(1, '#050510');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        time += 0.005;
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            const pulse = Math.sin(time * 2 + particle.x * 0.01) * 0.5 + 0.5;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius + pulse * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 120)})`;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(drawParticles);
    }
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
    
    resizeCanvas();
    createParticles();
    drawParticles();
}

function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
}

const iframes = document.querySelectorAll('.slide-frame');
let loadedCount = 0;

iframes.forEach(iframe => {
    iframe.addEventListener('load', () => {
        loadedCount++;
        if (loadedCount === totalSlides) {
            document.body.style.opacity = '1';
        }
    });
});

init();

let isTransitioning = false;

function smoothTransition(nextSlideFn) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const container = document.querySelector('.slides-container');
    container.style.transform = 'scale(0.98)';
    container.style.opacity = '0.8';
    
    setTimeout(() => {
        nextSlideFn();
        setTimeout(() => {
            container.style.transform = 'scale(1)';
            container.style.opacity = '1';
            isTransitioning = false;
        }, 100);
    }, 150);
}

const originalNext = nextSlide;
const originalPrev = prevSlide;

window.nextSlide = () => smoothTransition(originalNext);
window.prevSlide = () => smoothTransition(originalPrev);