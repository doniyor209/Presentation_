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
            const hue = 160 + Math.random() * 40;
            const color = `hsla(${hue}, 70%, 50%, ${Math.random() * 0.3 + 0.1})`;
            
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
                    ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
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
    
    // === Анимация счетчиков статистики ===
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
    
    // Запуск анимации счетчиков
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.target);
                if (!isNaN(target)) {
                    const suffix = target === 70000 ? '+' : target === 40000 ? '+' : '%';
                    animateCounter(element, target, suffix, 2000);
                }
                statsObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    const statValues = document.querySelectorAll('.hero-stat .stat-value[data-target]');
    statValues.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // === Копирование кода ===
    const copyCodeBtn = document.getElementById('copyFastApiCode');
    
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const codeBlock = document.querySelector('.code-block');
            if (codeBlock) {
                const codeText = codeBlock.textContent;
                navigator.clipboard.writeText(codeText);
                
                const originalText = copyCodeBtn.textContent;
                copyCodeBtn.textContent = '✓ Скопировано!';
                copyCodeBtn.style.background = 'rgba(16, 185, 129, 0.3)';
                
                setTimeout(() => {
                    copyCodeBtn.textContent = originalText;
                    copyCodeBtn.style.background = 'rgba(16, 185, 129, 0.15)';
                }, 2000);
            }
        });
    }
    
    // === Интерактивная демонстрация FastAPI ===
    const methodBtns = document.querySelectorAll('.fastapi-method-btn');
    const sendBtn = document.getElementById('sendFastapiRequest');
    const endpointSelect = document.getElementById('fastapiEndpoint');
    const fastapiStatus = document.getElementById('fastapiStatus');
    const fastapiTiming = document.getElementById('fastapiTiming');
    const fastapiResponseBody = document.getElementById('fastapiResponseBody');
    const bodyContainer = document.getElementById('fastapiBodyContainer');
    const requestBody = document.getElementById('fastapiRequestBody');
    
    let currentMethod = 'GET';
    
    // База данных пользователей для симуляции
    let usersDB = {
        1: { id: 1, name: "Иван Петров", email: "ivan@example.com", age: 25 },
        2: { id: 2, name: "Мария Сидорова", email: "maria@example.com", age: 30 }
    };
    
    // Переключение методов
    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMethod = btn.dataset.method;
            
            // Обновляем выпадающий список в зависимости от метода
            const options = endpointSelect.options;
            if (currentMethod === 'GET') {
                options[0].style.display = '';
                options[1].style.display = '';
                options[2].style.display = 'none';
                options[3].style.display = 'none';
                options[4].style.display = 'none';
                endpointSelect.value = '/';
                bodyContainer.style.display = 'none';
            } else if (currentMethod === 'POST') {
                options[0].style.display = 'none';
                options[1].style.display = 'none';
                options[2].style.display = '';
                options[3].style.display = 'none';
                options[4].style.display = 'none';
                endpointSelect.value = '/users';
                bodyContainer.style.display = 'flex';
                requestBody.value = JSON.stringify({
                    id: 3,
                    name: "Новый пользователь",
                    email: "new@example.com",
                    age: 28
                }, null, 2);
            } else if (currentMethod === 'PUT') {
                options[0].style.display = 'none';
                options[1].style.display = 'none';
                options[2].style.display = 'none';
                options[3].style.display = '';
                options[4].style.display = 'none';
                endpointSelect.value = '/users/1';
                bodyContainer.style.display = 'flex';
                requestBody.value = JSON.stringify({
                    id: 1,
                    name: "Иван Петров (обновлен)",
                    email: "ivan.updated@example.com",
                    age: 26
                }, null, 2);
            } else if (currentMethod === 'DELETE') {
                options[0].style.display = 'none';
                options[1].style.display = 'none';
                options[2].style.display = 'none';
                options[3].style.display = 'none';
                options[4].style.display = '';
                endpointSelect.value = '/users/1';
                bodyContainer.style.display = 'none';
            }
        });
    });
    
    async function sendFastapiRequest() {
        const startTime = performance.now();
        const endpoint = endpointSelect.value;
        
        // Обновляем статус
        fastapiStatus.innerHTML = '<span class="status-dot"></span> Загрузка...';
        fastapiStatus.className = 'fastapi-status';
        fastapiResponseBody.innerHTML = `
            <div class="placeholder-content">
                <div class="spinner" style="width: 32px; height: 32px; border: 2px solid rgba(16,185,129,0.2); border-top-color: #10b981; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
                <p>Отправка ${currentMethod} запроса...</p>
            </div>
        `;
        
        // Симуляция задержки сети
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const responseTime = Math.round(performance.now() - startTime);
        fastapiTiming.textContent = `${responseTime}ms`;
        
        try {
            let statusCode = 200;
            let responseData = {};
            
            // Парсинг endpoint для извлечения ID
            const idMatch = endpoint.match(/\/users\/(\d+)/);
            const userId = idMatch ? parseInt(idMatch[1]) : null;
            
            if (currentMethod === 'GET') {
                if (endpoint === '/') {
                    responseData = { message: "Hello World! Добро пожаловать в FastAPI", version: "1.0.0", endpoints: ["/", "/users/{id}", "/users"] };
                } else if (userId) {
                    if (usersDB[userId]) {
                        responseData = usersDB[userId];
                    } else {
                        statusCode = 404;
                        responseData = { detail: "User not found" };
                    }
                } else {
                    responseData = { users: Object.values(usersDB) };
                }
            } 
            else if (currentMethod === 'POST') {
                try {
                    const newUser = JSON.parse(requestBody.value);
                    if (!newUser.id || !newUser.name || !newUser.email) {
                        statusCode = 400;
                        responseData = { detail: "Missing required fields: id, name, email" };
                    } else if (usersDB[newUser.id]) {
                        statusCode = 409;
                        responseData = { detail: "User with this ID already exists" };
                    } else {
                        usersDB[newUser.id] = newUser;
                        responseData = { status: "created", user: newUser };
                    }
                } catch (e) {
                    statusCode = 400;
                    responseData = { detail: "Invalid JSON body" };
                }
            }
            else if (currentMethod === 'PUT') {
                try {
                    const updatedUser = JSON.parse(requestBody.value);
                    if (userId && usersDB[userId]) {
                        usersDB[userId] = updatedUser;
                        responseData = { status: "updated", user: updatedUser };
                    } else {
                        statusCode = 404;
                        responseData = { detail: "User not found" };
                    }
                } catch (e) {
                    statusCode = 400;
                    responseData = { detail: "Invalid JSON body" };
                }
            }
            else if (currentMethod === 'DELETE') {
                if (userId && usersDB[userId]) {
                    delete usersDB[userId];
                    responseData = { status: "deleted", id: userId };
                } else {
                    statusCode = 404;
                    responseData = { detail: "User not found" };
                }
            }
            
            // Обновляем статус
            const statusClass = statusCode >= 200 && statusCode < 300 ? 'success' : 'error';
            fastapiStatus.className = `fastapi-status ${statusClass}`;
            
            let statusText = '';
            if (statusCode === 200) statusText = 'OK';
            else if (statusCode === 201) statusText = 'Created';
            else if (statusCode === 400) statusText = 'Bad Request';
            else if (statusCode === 404) statusText = 'Not Found';
            else if (statusCode === 409) statusText = 'Conflict';
            else statusText = 'Error';
            
            fastapiStatus.innerHTML = `<span class="status-dot"></span> ${statusCode} ${statusText}`;
            fastapiResponseBody.innerHTML = `<pre style="margin: 0; font-family: monospace; font-size: 12px; line-height: 1.5; color: #a8e6cf;">${JSON.stringify(responseData, null, 2)}</pre>`;
            
        } catch (error) {
            fastapiStatus.className = 'fastapi-status error';
            fastapiStatus.innerHTML = '<span class="status-dot"></span> 500 Internal Server Error';
            fastapiResponseBody.innerHTML = `
                <div class="placeholder-content" style="color: #ef4444;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>Ошибка: ${error.message}</p>
                </div>
            `;
        }
    }
    
    sendBtn.addEventListener('click', sendFastapiRequest);
    
    // === Анимация бенчмарк бара ===
    const benchmarkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = document.querySelectorAll('.bar-fill');
                bars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                benchmarkObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const benchmarkSection = document.querySelector('.benchmark-section');
    if (benchmarkSection) {
        benchmarkObserver.observe(benchmarkSection);
    }
    
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
    
    const sections = document.querySelectorAll('.hero-card, .features-section, .code-section, .demo-section, .benchmark-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(section);
    });
    
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
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
    
    console.log('⚡ Страница 8 "FastAPI" загружена!');
});