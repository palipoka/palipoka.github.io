// News functionality with Yandex News
class YandexNews {
    constructor() {
        this.currentCategory = 'index';
        this.newsCache = {};
        this.proxyUrl = 'https://your-domain.com/news-proxy.php'; // ЗАМЕНИТЕ на ваш URL
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadNews(this.currentCategory);
    }

    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-news');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.classList.add('loading');
                this.loadNews(this.currentCategory, true).finally(() => {
                    setTimeout(() => {
                        refreshBtn.classList.remove('loading');
                    }, 1000);
                });
            });
        }

        // Category buttons
        document.querySelectorAll('.news-category-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.switchCategory(category, e.target);
            });
        });
    }

    switchCategory(category, button) {
        // Update active button
        document.querySelectorAll('.news-category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.currentCategory = category;
        this.loadNews(category);
    }

    async loadNews(category = 'index', forceRefresh = false) {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer) return;

        newsContainer.innerHTML = '<div class="news-loading">Загрузка новостей...</div>';

        try {
            // Проверяем кэш
            const cacheKey = `${category}_${this.proxyUrl}`;
            if (!forceRefresh && this.newsCache[cacheKey] && 
                Date.now() - this.newsCache[cacheKey].timestamp < 5 * 60 * 1000) {
                this.displayNews(this.newsCache[cacheKey].data);
                return;
            }

            const response = await fetch(`${this.proxyUrl}?category=${category}&t=${Date.now()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.newsCache[cacheKey] = {
                    data: data.news,
                    timestamp: Date.now()
                };
                this.displayNews(data.news, false);
            } else {
                this.displayNews(data.news, true);
            }

        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
            this.showError('Ошибка загрузки. Показываем демо-новости');
            this.showMockNews();
        }
    }

    displayNews(news, isDemo = false) {
        const newsContainer = document.getElementById('news-container');
        
        if (!news || news.length === 0) {
            this.showMockNews();
            return;
        }

        const newsList = document.createElement('ul');
        newsList.className = 'news-list';

        news.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'news-item';
            
            listItem.innerHTML = `
                <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-circle"></i>
                    <span class="news-title">${item.title}</span>
                </a>
            `;
            
            newsList.appendChild(listItem);
        });

        newsContainer.innerHTML = '';
        newsContainer.appendChild(newsList);

        if (isDemo) {
            const demoInfo = document.createElement('div');
            demoInfo.className = 'news-info';
            demoInfo.innerHTML = '<p><small>Демо-режим. Проверьте настройки прокси-сервера.</small></p>';
            newsContainer.appendChild(demoInfo);
        }
    }

    showMockNews() {
        const mockNews = [
            {
                title: "ЦБ РФ сохранил ключевую ставку на уровне 16% годовых",
                link: "https://news.yandex.ru/story/CB_RF_sokhranil_klyuchevuyu_stavku",
                description: "Центробанк России принял решение сохранить ключевую ставку."
            },
            {
                title: "В Москве представлен новый план развития транспорта",
                link: "https://news.yandex.ru/story/Novyj_plan_razvitiya_transporta",
                description: "Власти Москвы анонсировали проект по развитию транспорта."
            },
            {
                title: "Ученые совершили прорыв в квантовых вычислениях",
                link: "https://news.yandex.ru/story/Kvantovye_vychisleniya_proryv",
                description: "Российские исследователи добились прогресса."
            }
        ];

        this.displayNews(mockNews, true);
    }

    showError(message) {
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = `
            <div class="news-error">
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">Попробовать снова</button>
            </div>
        `;
    }
}

// Initialize news when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.newsApp = new YandexNews();
});

// Добавляем стили
const newsStyles = `
    .news-loading {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-secondary);
    }
    
    .news-error {
        text-align: center;
        padding: 30px 20px;
        color: #ff6b6b;
    }
    
    .news-info {
        text-align: center;
        padding: 15px;
        color: var(--text-secondary);
        font-size: 0.8rem;
        margin-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .retry-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        margin-top: 15px;
        transition: all 0.3s ease;
    }
    
    .retry-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .refresh-btn.loading {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = newsStyles;
document.head.appendChild(styleSheet);
