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
        const particleCount = Math.min(120, Math.floor(window.innerWidth * window.innerHeight / 8000));
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
    
    // === ИНТЕРАКТИВНЫЕ КАРТОЧКИ ===
    const cards = document.querySelectorAll('.example-card');
    const demoContent = document.getElementById('demoContent');
    const demoSection = document.getElementById('demoSection');
    const demoBadge = document.getElementById('demoBadge');
    
    // Данные для демонстрации (стильные, с подробным описанием)
    const demoData = {
        1: {
            title: '🍽️ Ресторан (API как официант)',
            description: 'В реальном мире API работает как официант в ресторане. Вы делаете заказ, официант передает его на кухню, а затем приносит готовое блюдо.',
            flow: 'КЛИЕНТ (Вы) → ОФИЦИАНТ (API) → КУХНЯ (Сервер)',
            code: `// 1. Клиент делает запрос
POST /api/order
{
  "dish": "Паста Карбонара",
  "quantity": 1
}

// 2. API передает запрос на сервер
// 3. Сервер обрабатывает заказ

// 4. API возвращает ответ клиенту
{
  "status": "готово",
  "order_id": 12345,
  "estimated_time": "15 минут"
}`,
            analogy: 'Вы не заходите на кухню сами — это работа API! Он изолирует клиента от сложностей бэкенда.'
        },
        2: {
            title: '🏦 Банкомат (Безопасный доступ к финансам)',
            description: 'API банка — это как защищенный мост между мобильным приложением и банковской системой. Он проверяет права доступа и шифрует все данные.',
            flow: 'МОБИЛЬНОЕ ПРИЛОЖЕНИЕ → API БАНКА → БАЗА ДАННЫХ',
            code: `// Запрос баланса через API
GET /api/v1/account/balance
Authorization: Bearer eyJhbGciOiJIUzI1...

// Ответ API
{
  "status": "success",
  "balance": 12500.50,
  "currency": "RUB",
  "account_number": "****1234"
}

// Перевод средств
POST /api/v1/transfer
{
  "to": "****5678",
  "amount": 1000
}`,
            analogy: 'API защищает ваши деньги и личные данные, не давая приложению прямого доступа к банковской системе.'
        },
        3: {
            title: '✈️ Поиск авиабилетов (Агрегация данных)',
            description: 'API позволяет собирать данные из разных источников в реальном времени, сравнивать цены и показывать лучшие предложения.',
            flow: 'АГРЕГАТОР → API АВИАКОМПАНИЙ → ОБЪЕДИНЕНИЕ ДАННЫХ',
            code: `// Запрос к API авиакомпании
GET /api/flights?from=MOW&to=LED&date=2026-06-01

// Ответ от API
{
  "flights": [
    {
      "airline": "Aeroflot",
      "price": 4500,
      "departure": "10:00",
      "arrival": "11:30"
    },
    {
      "airline": "S7 Airlines",
      "price": 4200,
      "departure": "14:00",
      "arrival": "15:30"
    }
  ]
}`,
            analogy: 'API собирает информацию с разных серверов и показывает её в удобном виде, как туристический агрегатор.'
        },
        4: {
            title: '🌤️ Погодное приложение (Real-time данные)',
            description: 'API погодного сервиса предоставляет актуальные данные о погоде в формате JSON, который легко использовать в любом приложении.',
            flow: 'ПРИЛОЖЕНИЕ → API ПОГОДЫ → JSON ОТВЕТ',
            code: `// Запрос погоды в Москве
GET /api/weather?city=Moscow

// Ответ API в формате JSON
{
  "city": "Moscow",
  "temperature": 22.5,
  "feels_like": 21.0,
  "humidity": 65,
  "wind_speed": 3.2,
  "forecast": [
    { "day": "ПН", "temp": 20 },
    { "day": "ВТ", "temp": 23 },
    { "day": "СР", "temp": 19 }
  ]
}`,
            analogy: 'JSON — самый популярный формат ответов API, как универсальный язык для общения программ.'
        },
        5: {
            title: '💳 Платежный шлюз (Безопасные транзакции)',
            description: 'Платежные API обрабатывают миллионы транзакций ежедневно, обеспечивая безопасность и соответствие стандартам PCI DSS.',
            flow: 'МАГАЗИН → API STRIPE/PAYPAL → БАНК → ПОДТВЕРЖДЕНИЕ',
            code: `// Создание платежа через Stripe API
POST /api/payment/charge
{
  "amount": 1000,
  "currency": "USD",
  "source": "tok_visa",
  "description": "Заказ #12345"
}

// Успешный ответ
{
  "id": "ch_1ABC123",
  "status": "succeeded",
  "amount": 1000,
  "currency": "usd",
  "customer": "cus_XYZ789"
}`,
            analogy: 'Магазин никогда не видит данные вашей карты — только API получает результат оплаты.'
        },
        6: {
            title: '📱 Вход через соцсети (OAuth 2.0)',
            description: 'OAuth API позволяет пользователям входить на сайты без создания нового пароля, используя аккаунты Google, Facebook или Apple.',
            flow: 'САЙТ → API GOOGLE → ПОДТВЕРЖДЕНИЕ → ДОСТУП',
            code: `// 1. Перенаправление на Google
GET /auth/google
→ redirect to accounts.google.com

// 2. Пользователь входит в Google
// 3. Google возвращает authorization code

// 4. Обмен кода на access_token
POST /token
{
  "code": "4/0AY0e-g7...",
  "client_id": "xxx.apps.googleusercontent.com"
}

// 5. Получение данных пользователя
GET /api/user?access_token=ya29...

// Ответ с данными пользователя
{
  "id": "123456789",
  "email": "user@gmail.com",
  "name": "Иван Петров",
  "avatar": "https://..."
}`,
            analogy: 'API делегирует аутентификацию проверенным провайдерам — вы доверяете свой пароль только Google, а не каждому сайту.'
        }
    };
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showDemo(cardId) {
        const data = demoData[cardId];
        if (!data) return;
        
        // Обновляем бейдж
        if (demoBadge) {
            demoBadge.innerHTML = `
                <span class="badge-dot"></span>
                Демонстрация: ${data.title.split(' ')[0]} ${data.title.split(' ')[1]}
            `;
        }
        
        // Добавляем класс активности для демо-секции
        demoSection.classList.add('active-demo');
        
        // Анимируем появление контента
        demoContent.style.opacity = '0';
        
        setTimeout(() => {
            demoContent.innerHTML = `
                <div class="demo-card" style="animation: scaleIn 0.4s ease;">
                    <div class="demo-card-title">${escapeHtml(data.title)}</div>
                    <div class="demo-card-desc">${escapeHtml(data.description)}</div>
                    
                    <div class="demo-flow" style="background: rgba(99,102,241,0.1); border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; font-family: monospace;">
                        <span style="color: var(--primary);">📡 Схема работы:</span> ${escapeHtml(data.flow)}
                    </div>
                    
                    <div class="demo-card-code">
                        <div class="code-header">
                            <span>📋 Пример работы API</span>
                            <button class="copy-btn" onclick="window.copyToClipboard(this)">Копировать</button>
                        </div>
                        <pre><code>${escapeHtml(data.code)}</code></pre>
                    </div>
                    
                    <div class="demo-card-analogy">
                        <span class="analogy-icon">💡</span>
                        <span>${escapeHtml(data.analogy)}</span>
                    </div>
                </div>
            `;
            demoContent.style.opacity = '1';
        }, 150);
        
        // Подсветка активной карточки
        cards.forEach(card => {
            card.classList.remove('active-card');
            card.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            card.style.transform = 'translateY(0)';
        });
        
        const activeCard = document.querySelector(`.example-card[data-card="${cardId}"]`);
        if (activeCard) {
            activeCard.classList.add('active-card');
            activeCard.style.borderColor = 'var(--primary)';
            activeCard.style.transform = 'translateY(-5px)';
            
            // Прокрутка к демо-секции на мобильных
            if (window.innerWidth < 768) {
                demoSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }
    
    // Глобальная функция для копирования
    window.copyToClipboard = (btn) => {
        const codeBlock = btn.closest('.demo-card-code');
        const code = codeBlock.querySelector('code').textContent;
        navigator.clipboard.writeText(code);
        
        const originalText = btn.textContent;
        btn.textContent = '✓ Скопировано!';
        btn.style.background = 'rgba(16, 185, 129, 0.3)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'rgba(99, 102, 241, 0.2)';
        }, 2000);
    };
    
    // Добавляем обработчики на карточки
    cards.forEach(card => {
        const cardId = card.getAttribute('data-card');
        
        card.addEventListener('click', () => {
            showDemo(cardId);
        });
        
        // Эффект при наведении
        card.addEventListener('mouseenter', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) glow.style.opacity = '0.5';
        });
        
        card.addEventListener('mouseleave', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) glow.style.opacity = '0';
        });
    });
    
    // === Плавное появление элементов ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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
    
    const definitionSection = document.querySelector('.definition-section');
    if (definitionSection) {
        definitionSection.style.opacity = '0';
        definitionSection.style.transform = 'translateY(30px)';
        definitionSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(definitionSection);
    }
    
    const examplesHeader = document.querySelector('.examples-header');
    if (examplesHeader) {
        examplesHeader.style.opacity = '0';
        examplesHeader.style.transform = 'translateY(20px)';
        examplesHeader.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(examplesHeader);
    }
    
    const demoSectionObs = document.querySelector('.demo-section');
    if (demoSectionObs) {
        demoSectionObs.style.opacity = '0';
        demoSectionObs.style.transform = 'translateY(30px)';
        demoSectionObs.style.transition = 'opacity 0.6s ease, transform 0.6s ease 0.3s';
        fadeObserver.observe(demoSectionObs);
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
    
    console.log('📖 Страница 2 "Что такое API" загружена!');
});