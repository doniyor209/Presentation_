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
    
    // === Интерактивная схема ===
    const flowNodes = document.querySelectorAll('.flow-node');
    const stepCards = document.querySelectorAll('.step-card');
    
    function activateStep(step) {
        // Обновляем активные узлы в схеме
        flowNodes.forEach((node, index) => {
            if (index + 1 === step) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });
        
        // Обновляем активные карточки шагов
        stepCards.forEach((card, index) => {
            if (index + 1 === step) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
    
    // Добавляем обработчики на узлы схемы
    flowNodes.forEach((node, index) => {
        node.addEventListener('click', () => {
            activateStep(index + 1);
        });
    });
    
    // Добавляем обработчики на карточки шагов
    stepCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            activateStep(index + 1);
        });
    });
    
    // === Интерактивная демонстрация API ===
    const methodBtns = document.querySelectorAll('.method-btn');
    const sendBtn = document.getElementById('sendRequest');
    const endpointInput = document.getElementById('endpoint');
    const statusCodeSpan = document.getElementById('statusCode');
    const responseBodyDiv = document.getElementById('responseBody');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const responseTabs = document.querySelectorAll('.response-tab');
    
    let currentMethod = 'GET';
    let responseHeaders = {};
    let responseTime = 0;
    let currentTab = 'response';
    
    // Переключение методов
    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMethod = btn.dataset.method;
        });
    });
    
    // Переключение табов
    responseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            responseTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            updateResponseDisplay();
        });
    });
    
    function updateResponseDisplay() {
        if (currentTab === 'response') {
            // Показываем тело ответа
            const currentContent = responseBodyDiv.innerHTML;
            if (!currentContent.includes('response-data')) {
                // Если нет сохраненных данных, показываем плейсхолдер
                if (!window.lastResponseData) {
                    responseBodyDiv.innerHTML = `
                        <div class="placeholder-content">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v4l3 3"/>
                            </svg>
                            <p>Нажмите "Отправить запрос", чтобы увидеть ответ</p>
                        </div>
                    `;
                }
            }
        } else if (currentTab === 'headers') {
            if (Object.keys(responseHeaders).length > 0) {
                responseBodyDiv.innerHTML = `
                    <div style="font-family: monospace; font-size: 12px;">
                        ${Object.entries(responseHeaders).map(([key, value]) => 
                            `<div style="margin: 4px 0;"><span style="color: #a855f7;">${key}:</span> <span style="color: rgba(255,255,255,0.7);">${value}</span></div>`
                        ).join('')}
                    </div>
                `;
            } else {
                responseBodyDiv.innerHTML = `
                    <div class="placeholder-content">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8v4l3 3"/>
                        </svg>
                        <p>Заголовки ответа появятся здесь после запроса</p>
                    </div>
                `;
            }
        } else if (currentTab === 'timing') {
            responseBodyDiv.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <div style="font-size: 48px; font-weight: 800; background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 10px;">
                        ${responseTime}ms
                    </div>
                    <div style="color: rgba(255,255,255,0.5);">Время выполнения запроса</div>
                    <div style="margin-top: 20px; font-size: 12px; color: rgba(255,255,255,0.3);">
                        Метод: ${currentMethod}<br>
                        Endpoint: ${endpointInput.value}
                    </div>
                </div>
            `;
        }
    }
    
    async function sendRequest() {
        const endpoint = endpointInput.value;
        
        // Показываем загрузку
        loadingOverlay.classList.add('active');
        statusCodeSpan.innerHTML = '<span class="status-dot"></span> Загрузка...';
        statusCodeSpan.className = 'status-code';
        
        const startTime = performance.now();
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(endpoint, {
                method: currentMethod,
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            clearTimeout(timeoutId);
            responseTime = Math.round(performance.now() - startTime);
            
            // Сохраняем заголовки
            responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });
            
            // Обновляем статус код
            const statusClass = response.ok ? 'success' : 'error';
            statusCodeSpan.className = `status-code ${statusClass}`;
            statusCodeSpan.innerHTML = `<span class="status-dot"></span> ${response.status} ${response.statusText}`;
            
            // Получаем данные
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
                window.lastResponseData = data;
                if (currentTab === 'response') {
                    responseBodyDiv.innerHTML = `
                        <pre style="margin: 0; font-family: monospace; font-size: 12px; line-height: 1.5; color: #a8e6cf;">${JSON.stringify(data, null, 2)}</pre>
                    `;
                }
            } else {
                data = await response.text();
                window.lastResponseData = data;
                if (currentTab === 'response') {
                    responseBodyDiv.innerHTML = `<pre style="margin: 0;">${data}</pre>`;
                }
            }
            
            updateResponseDisplay();
            
        } catch (error) {
            responseTime = Math.round(performance.now() - startTime);
            
            if (error.name === 'AbortError') {
                statusCodeSpan.className = 'status-code error';
                statusCodeSpan.innerHTML = '<span class="status-dot"></span> 408 Request Timeout';
                responseBodyDiv.innerHTML = `
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
                statusCodeSpan.className = 'status-code error';
                statusCodeSpan.innerHTML = '<span class="status-dot"></span> 500 Network Error';
                responseBodyDiv.innerHTML = `
                    <div class="placeholder-content" style="color: #ef4444;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p>Ошибка сети: ${error.message}</p>
                        <small>Проверьте подключение к интернету</small>
                    </div>
                `;
            }
            updateResponseDisplay();
        } finally {
            setTimeout(() => {
                loadingOverlay.classList.remove('active');
            }, 500);
        }
    }
    
    sendBtn.addEventListener('click', sendRequest);
    
    endpointInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendRequest();
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
    
    const sections = document.querySelectorAll('.schema-container, .demo-section');
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
    
    console.log('⚡ Страница 4 "Как работает API" загружена!');
});