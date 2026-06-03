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
        const particleCount = Math.min(130, Math.floor(window.innerWidth * window.innerHeight / 7000));
        particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const radius = Math.random() * 2 + 0.5;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const vx = (Math.random() - 0.5) * 0.2;
            const vy = (Math.random() - 0.5) * 0.15;
            const hue = 260 + Math.random() * 40;
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
                
                if (distance < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 0.06 * (1 - distance / 130);
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
    
    // === Анимация счетчиков ===
    function animateCounter(element, target, suffix = '', duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        };
        
        updateCounter();
    }
    
    // Запуск анимации счетчиков при попадании в область видимости
    const countersObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                const value = parseInt(text);
                
                if (!isNaN(value)) {
                    const suffix = text.replace(value.toString(), '');
                    animateCounter(element, value, suffix, 2000);
                }
                countersObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    // Наблюдаем за всеми элементами со статистикой
    document.querySelectorAll('.stat-value').forEach(el => {
        countersObserver.observe(el);
    });
    
    // === Интерактивность карточек ===
    const purposeCards = document.querySelectorAll('.purpose-card');
    const realCards = document.querySelectorAll('.real-card');
    
    // Эффект при наведении на карточки целей
    purposeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) glow.style.opacity = '0.5';
        });
        
        card.addEventListener('mouseleave', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) glow.style.opacity = '0';
        });
        
        // Клик для показа детальной информации
        card.addEventListener('click', () => {
            const purpose = card.dataset.purpose;
            const titles = {
                data: 'Обмен данными',
                integration: 'Интеграция сервисов',
                mobile: 'Мобильные приложения',
                automation: 'Автоматизация',
                scalability: 'Масштабирование',
                security: 'Безопасность'
            };
            
            // Создаем всплывающую подсказку
            const tooltip = document.createElement('div');
            tooltip.className = 'purpose-tooltip';
            tooltip.innerHTML = `
                <div class="tooltip-content">
                    <strong>📊 ${titles[purpose] || purpose}</strong>
                    <p>Нажмите на карточку, чтобы узнать больше об этом аспекте API</p>
                    <small>✨ API делает возможным современный цифровой мир</small>
                </div>
            `;
            
            tooltip.style.position = 'fixed';
            tooltip.style.bottom = '20px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.background = 'rgba(10, 10, 25, 0.95)';
            tooltip.style.backdropFilter = 'blur(20px)';
            tooltip.style.border = '1px solid rgba(99, 102, 241, 0.3)';
            tooltip.style.borderRadius = '16px';
            tooltip.style.padding = '16px 24px';
            tooltip.style.zIndex = '1000';
            tooltip.style.animation = 'fadeInUp 0.3s ease';
            
            document.body.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
            }, 3000);
        });
    });
    
    // Эффект при наведении на реальные примеры
    realCards.forEach(card => {
        card.addEventListener('click', () => {
            const company = card.dataset.company;
            const companyNames = {
                stripe: 'Stripe',
                google: 'Google Maps',
                twitter: 'X (Twitter)',
                paypal: 'PayPal',
                openweather: 'OpenWeather',
                openai: 'OpenAI'
            };
            
            // Показать уведомление
            const notification = document.createElement('div');
            notification.className = 'company-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <span>🔗</span>
                    <span>${companyNames[company]} API — один из самых популярных API в мире</span>
                </div>
            `;
            notification.style.position = 'fixed';
            notification.style.bottom = '100px';
            notification.style.right = '30px';
            notification.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.9))';
            notification.style.borderRadius = '40px';
            notification.style.padding = '12px 24px';
            notification.style.zIndex = '1000';
            notification.style.animation = 'slideInUp 0.3s ease';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 2500);
        });
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
        
        // Параллакс для карточек
        const cards = document.querySelectorAll('.purpose-card');
        cards.forEach((card, index) => {
            const speed = 0.01;
            const x = (mouseX - 0.5) * 20 * speed * (index % 2 === 0 ? 1 : -1);
            const y = (mouseY - 0.5) * 10 * speed;
            card.style.transform = `translate(${x}px, ${y}px)`;
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
    
    // Наблюдаем за секциями
    const sections = document.querySelectorAll('.purposes-section, .real-examples-section, .insights-section');
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
    
    // === Анимация при скролле для реальных примеров ===
    const realObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                realObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    realCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        realObserver.observe(card);
    });
    
    console.log('🎯 Страница 3 "Для чего нужен API" загружена!');
});