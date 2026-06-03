document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let time = 0;
    let animationId = null;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor(x, y, radius, vx, vy, color, alpha) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.vx = vx;
            this.vy = vy;
            this.color = color;
            this.alpha = alpha;
            this.originalX = x;
            this.originalY = y;
            this.waveOffset = Math.random() * Math.PI * 2;
        }
        
        update(time) {
            this.x = this.originalX + Math.sin(time * 0.002 + this.waveOffset) * 2;
            this.y = this.originalY + Math.cos(time * 0.0015 + this.waveOffset) * 2;
            
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            
            this.originalX = this.x;
            this.originalY = this.y;
        }
        
        draw(ctx, time) {
            const pulse = Math.sin(time * 0.005 + this.waveOffset) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    function createParticles() {
        const particleCount = Math.min(200, Math.floor(window.innerWidth * window.innerHeight / 5000));
        particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const radius = Math.random() * 2 + 0.5;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const vx = (Math.random() - 0.5) * 0.2;
            const vy = (Math.random() - 0.5) * 0.15;
            const hue = 260 + Math.random() * 60;
            const color = `hsla(${hue}, 70%, 60%, ${Math.random() * 0.3 + 0.1})`;
            
            particles.push(new Particle(x, y, radius, vx, vy, color, Math.random() * 0.3 + 0.1));
        }
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 0.08 * (1 - distance / 150);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.stroke();
                }
            }
        }
    }
    
    function drawBackground() {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#050510');
        grad.addColorStop(0.5, '#0a0a2a');
        grad.addColorStop(1, '#050510');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    function animate() {
        if (!ctx) return;
        
        time++;
        drawBackground();
        
        particles.forEach(particle => {
            particle.update(time);
            particle.draw(ctx, time);
        });
        
        drawConnections();
        
        animationId = requestAnimationFrame(animate);
    }
    
    function initBackground() {
        resizeCanvas();
        createParticles();
        animate();
    }
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
    
    initBackground();
    
    const animatedElements = document.querySelectorAll('.badge-container, .main-title, .subtitle, .tech-stack, .author-section, .scroll-indicator, .stats-floating');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    }
    
    const apiStat = document.getElementById('apiStat');
    const devsStat = document.getElementById('devsStat');
    const companiesStat = document.getElementById('companiesStat');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'apiStat') {
                    animateCounter(apiStat, 25000000000, 2500);
                } else if (entry.target.id === 'devsStat') {
                    animateCounter(devsStat, 20000000, 2500);
                } else if (entry.target.id === 'companiesStat') {
                    animateCounter(companiesStat, 500000, 2500);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (apiStat) statsObserver.observe(apiStat);
    if (devsStat) statsObserver.observe(devsStat);
    if (companiesStat) statsObserver.observe(companiesStat);
    
    const heroSection = document.querySelector('.hero-section');
    const orbs = document.querySelectorAll('.light-orb');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = 0.02 * (index + 1);
            const x = (mouseX - 0.5) * 100 * speed;
            const y = (mouseY - 0.5) * 100 * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.parent.postMessage({ type: 'nextSlide' }, '*');
        });
    }
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
    
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'nextSlide') {
            const content = document.querySelector('.content-wrapper');
            if (content) {
                content.style.animation = 'fadeOutUp 0.3s ease forwards';
            }
        }
    });
    
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
        contentWrapper.addEventListener('animationend', () => {
            contentWrapper.style.animation = '';
        });
    }
    
    function createClickEffect(x, y) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = Math.random() * 6 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = `hsl(${260 + Math.random() * 60}, 80%, 60%)`;
            particle.style.borderRadius = '50%';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.opacity = '0.8';
            document.body.appendChild(particle);
            
            const vx = (Math.random() - 0.5) * 8;
            const vy = (Math.random() - 0.5) * 8 - 5;
            let posX = x;
            let posY = y;
            let opacity = 0.8;
            
            const animateParticle = () => {
                posX += vx;
                posY += vy;
                opacity -= 0.02;
                particle.style.transform = `translate(${posX - x}px, ${posY - y}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animateParticle);
        }
    }
    
    document.addEventListener('click', (e) => {
        createClickEffect(e.clientX, e.clientY);
    });
    
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        const heroContent = document.querySelector('.content-wrapper');
        if (heroContent) {
            heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
    
    console.log('🎉 Титульная страница загружена!');
});