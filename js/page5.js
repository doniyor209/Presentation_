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
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 0.06 * (1 - distance / 120);
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
    
    // === Анимация принципов REST при клике ===
    const principleCards = document.querySelectorAll('.principle-card');
    
    principleCards.forEach(card => {
        card.addEventListener('click', () => {
            // Добавляем эффект пульсации
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
        });
    });
    
    // === Интерактивная демонстрация REST API ===
    const restMethodBtns = document.querySelectorAll('.rest-method-btn');
    const sendRestBtn = document.getElementById('sendRestRequest');
    const restEndpoint = document.getElementById('restEndpoint');
    const restStatus = document.getElementById('restStatus');
    const restTiming = document.getElementById('restTiming');
    const restResponseBody = document.getElementById('restResponseBody');
    const requestBodyContainer = document.getElementById('requestBodyContainer');
    const requestBody = document.getElementById('requestBody');
    
    let currentRestMethod = 'GET';
    
    // Переключение методов
    restMethodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            restMethodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRestMethod = btn.dataset.restMethod;
            
            // Показываем/скрываем поле body для методов POST, PUT, PATCH
            if (currentRestMethod === 'POST' || currentRestMethod === 'PUT' || currentRestMethod === 'PATCH') {
                requestBodyContainer.style.display = 'flex';
                // Устанавливаем пример тела запроса
                if (currentRestMethod === 'POST') {
                    requestBody.value = JSON.stringify({
                        title: 'foo',
                        body: 'bar',
                        userId: 1
                    }, null, 2);
                } else if (currentRestMethod === 'PUT') {
                    requestBody.value = JSON.stringify({
                        id: 1,
                        title: 'foo updated',
                        body: 'bar updated',
                        userId: 1
                    }, null, 2);
                } else if (currentRestMethod === 'PATCH') {
                    requestBody.value = JSON.stringify({
                        title: 'patched title'
                    }, null, 2);
                }
            } else {
                requestBodyContainer.style.display = 'none';
                requestBody.value = '';
            }
            
            // Обновляем endpoint для DELETE метода
            if (currentRestMethod === 'DELETE') {
                restEndpoint.value = 'https://jsonplaceholder.typicode.com/posts/1';
            } else {
                restEndpoint.value = 'https://jsonplaceholder.typicode.com/posts/1';
            }
        });
    });
    
    async function sendRestRequest() {
        const endpoint = restEndpoint.value;
        const startTime = performance.now();
        
        // Обновляем статус
        restStatus.innerHTML = '<span class="status-dot"></span> Загрузка...';
        restStatus.className = 'rest-status';
        restResponseBody.innerHTML = `
            <div class="placeholder-content">
                <div class="spinner" style="width: 32px; height: 32px; border: 2px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
                <p>Отправка ${currentRestMethod} запроса...</p>
            </div>
        `;
        
        try {
            const options = {
                method: currentRestMethod,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            // Добавляем body для POST, PUT, PATCH
            if (currentRestMethod === 'POST' || currentRestMethod === 'PUT' || currentRestMethod === 'PATCH') {
                if (requestBody.value.trim()) {
                    try {
                        options.body = requestBody.value;
                    } catch (e) {
                        options.body = requestBody.value;
                    }
                }
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            options.signal = controller.signal;
            
            const response = await fetch(endpoint, options);
            clearTimeout(timeoutId);
            
            const responseTime = Math.round(performance.now() - startTime);
            restTiming.textContent = `${responseTime}ms`;
            
            // Обновляем статус
            const statusClass = response.ok ? 'success' : 'error';
            restStatus.className = `rest-status ${statusClass}`;
            restStatus.innerHTML = `<span class="status-dot"></span> ${response.status} ${response.statusText}`;
            
            // Получаем данные
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
                restResponseBody.innerHTML = `<pre style="margin: 0; font-family: monospace; font-size: 12px; line-height: 1.5; color: #a8e6cf;">${JSON.stringify(data, null, 2)}</pre>`;
            } else {
                data = await response.text();
                restResponseBody.innerHTML = `<pre style="margin: 0;">${data}</pre>`;
            }
            
        } catch (error) {
            const responseTime = Math.round(performance.now() - startTime);
            restTiming.textContent = `${responseTime}ms`;
            
            if (error.name === 'AbortError') {
                restStatus.className = 'rest-status error';
                restStatus.innerHTML = '<span class="status-dot"></span> 408 Request Timeout';
                restResponseBody.innerHTML = `
                    <div class="placeholder-content" style="color: #ef4444;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p>Превышено время ожидания ответа от сервера</p>
                    </div>
                `;
            } else {
                restStatus.className = 'rest-status error';
                restStatus.innerHTML = '<span class="status-dot"></span> 500 Network Error';
                restResponseBody.innerHTML = `
                    <div class="placeholder-content" style="color: #ef4444;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p>Ошибка сети: ${error.message}</p>
                    </div>
                `;
            }
        }
    }
    
    sendRestBtn.addEventListener('click', sendRestRequest);
    
    restEndpoint.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendRestRequest();
        }
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
    
    const sections = document.querySelectorAll('.principles-section, .methods-section, .demo-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(section);
    });
    
    // Анимация для карточек принципов
    const principles = document.querySelectorAll('.principle-card');
    principles.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        card.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
        fadeObserver.observe(card);
    });
    
    // Анимация для карточек методов
    const methods = document.querySelectorAll('.method-card');
    methods.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.4s ease ${index * 0.07 + 0.2}s, transform 0.4s ease ${index * 0.07 + 0.2}s`;
        fadeObserver.observe(card);
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
    
    console.log('🔄 Страница 5 "REST API" загружена!');
});