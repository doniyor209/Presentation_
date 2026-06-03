document.addEventListener('DOMContentLoaded', () => {
    // === Анимированный фон ===
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let time = 0;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor(x, y, radius, vx, vy, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.vx = vx;
            this.vy = vy;
            this.color = color;
            this.originalX = x;
            this.originalY = y;
            this.waveOffset = Math.random() * Math.PI * 2;
        }
        
        update(time) {
            this.x = this.originalX + Math.sin(time * 0.002 + this.waveOffset) * 1.5;
            this.y = this.originalY + Math.cos(time * 0.0018 + this.waveOffset) * 1.5;
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
            const pulse = Math.sin(time * 0.008 + this.waveOffset) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    function createParticles() {
        const particleCount = Math.min(120, Math.floor(window.innerWidth * window.innerHeight / 7000));
        particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const radius = Math.random() * 2 + 0.5;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const vx = (Math.random() - 0.5) * 0.2;
            const vy = (Math.random() - 0.5) * 0.15;
            // Чередование цветов между DRF и FastAPI
            const isDrf = Math.random() > 0.5;
            const hue = isDrf ? 270 : 160;
            const color = `hsla(${hue}, 70%, 60%, ${Math.random() * 0.3 + 0.1})`;
            
            particles.push(new Particle(x, y, radius, vx, vy, color));
        }
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 0.06 * (1 - distance / 120);
                    ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
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
        requestAnimationFrame(animate);
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
    
    // === Анимация прогресс-баров ===
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
    
    // === Анимация строк таблицы ===
    const tableRows = document.querySelectorAll('.table-row');
    
    const rowObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 80);
                rowObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        row.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
        rowObserver.observe(row);
    });
    
    // === Анимация карточек use-cases ===
    const useCaseCards = document.querySelectorAll('.use-case-card');
    
    const useCaseObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                useCaseObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    useCaseCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        useCaseObserver.observe(card);
    });
    
    // === Анимация детальных пунктов ===
    const detailItems = document.querySelectorAll('.detail-item');
    
    const detailObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                detailObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    detailItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.4s ease ${index * 0.03}s, transform 0.4s ease ${index * 0.03}s`;
        detailObserver.observe(item);
    });
    
    // === Параллакс эффект ===
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const accents = document.querySelectorAll('.light-accent');
        accents.forEach((accent, index) => {
            const speed = 0.02 * (index + 1);
            const x = (mouseX - 0.5) * 40 * speed;
            const y = (mouseY - 0.5) * 40 * speed;
            accent.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // === Плавное появление элементов ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const sections = document.querySelectorAll('.comparison-section, .use-cases-section, .detail-section, .verdict-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(section);
    });
    
    // === Динамическое обновление прогресса ===
    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / scrollHeight;
        
        const dots = document.querySelectorAll('.progress-dots .dot');
        const activeIndex = Math.floor(scrollPercent * dots.length);
        
        dots.forEach((dot, index) => {
            if (index <= activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
    
    // === Эффект появления заголовка ===
    const titleCursor = document.querySelector('.title-cursor');
    if (titleCursor) {
        setInterval(() => {
            titleCursor.style.opacity = titleCursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
    
    // === Ховер эффект для строк таблицы ===
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.background = 'rgba(168, 85, 247, 0.05)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.background = 'transparent';
        });
    });
    
    console.log('⚖️ Страница 9 "Сравнение DRF и FastAPI" загружена!');
});