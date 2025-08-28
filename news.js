// News functionality with Yandex News
class YandexNews {
    constructor() {
        this.currentCategory = 'index';
        this.newsCache = {};
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
                this.loadNews(this.currentCategory, true);
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

        // Показываем заглушки вместо реальных новостей, если API не доступно
        this.showMockNews();
        return;

        // Код ниже будет работать при наличии рабочего CORS прокси
        try {
            newsContainer.innerHTML = '<div class="news-loading">Загрузка новостей...</div>';

            // Проверяем кэш
            if (!forceRefresh && this.newsCache[category] && 
                Date.now() - this.newsCache[category].timestamp < 5 * 60 * 1000) {
                this.displayNews(this.newsCache[category].data);
                return;
            }

            // Пробуем разные прокси
            async tryDifferentProxies(category) {
    try {
        const response = await fetch(`https://palipoka.github.io/news-proxy.php?category=${category}`);
        if (response.ok) {
            const news = await response.json();
            return news;
        }
    } catch (e) {
        console.log('PHP proxy error:', e);
    }
    return null;
}
            
            if (news && news.length > 0) {
                this.newsCache[category] = {
                    data: news,
                    timestamp: Date.now()
                };
                this.displayNews(news);
            } else {
                this.showMockNews();
            }

        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
            this.showMockNews();
        }
    }

    async tryDifferentProxies(category) {
        const proxies = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://news.yandex.ru/${category}.rss`)}`,
            `https://corsproxy.io/?${encodeURIComponent(`https://news.yandex.ru/${category}.rss`)}`,
            `https://api.codetabs.com/v1/proxy?quest=https://news.yandex.ru/${category}.rss`
        ];

        for (const proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl, {
                    headers: {
                        'Accept': 'application/xml',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 5000
                });

                if (response.ok) {
                    const xmlText = await response.text();
                    return this.parseRSS(xmlText);
                }
            } catch (e) {
                console.log(`Прокси ${proxyUrl} не сработал:`, e);
                continue;
            }
        }
        
        return null;
    }

    showMockNews() {
        const newsContainer = document.getElementById('news-container');
        const mockNews = [
            {
                title: "ЦБ РФ сохранил ключевую ставку на уровне 16% годовых",
                link: "https://news.yandex.ru/story/CB_RF_sokhranil_klyuchevuyu_stavku_na_urovne_16--04042024",
                description: "Центробанк России принял решение сохранить ключевую ставку на уровне 16% годовых."
            },
            {
                title: "В Москве представлен новый план развития транспортной инфраструктуры",
                link: "https://news.yandex.ru/story/Novyj_plan_razvitiya_transporta_Moskvy",
                description: "Власти Москвы анонсировали масштабный проект по развитию общественного транспорта."
            },
            {
                title: "Ученые совершили прорыв в области квантовых вычислений",
                link: "https://news.yandex.ru/story/Kvantovye_vychisleniya_proryv",
                description: "Российские исследователи добились значительного прогресса в создании квантовых процессоров."
            },
            {
                title: "Запущена новая космическая программа исследования Марса",
                link: "https://news.yandex.ru/story/Novaya_kosmicheskaya_programma_Mars",
                description: "Роскосмос и международные партнеры начинают совместную миссию по изучению Красной планеты."
            },
            {
                title: "Цифровизация госуслуг: новые сервисы для граждан",
                link: "https://news.yandex.ru/story/Cifrovizaciya_gosuslug_2024",
                description: "Правительство расширяет перечень услуг, доступных в электронном формате."
            }
        ];

        const newsList = document.createElement('ul');
        newsList.className = 'news-list';

        mockNews.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'news-item';
            
            listItem.innerHTML = `
                <a href="${item.link}" target="_blank" rel="noopener">
                    <i class="fas fa-circle"></i>
                    <span class="news-title">${item.title}</span>
                </a>
            `;
            
            newsList.appendChild(listItem);
        });

        const infoMessage = document.createElement('div');
        infoMessage.className = 'news-info';
        infoMessage.innerHTML = '<p><small>Демо-новости. Для реальных новостей нужен CORS-прокси сервер.</small></p>';

        newsContainer.innerHTML = '';
        newsContainer.appendChild(newsList);
        newsContainer.appendChild(infoMessage);
    }

    parseRSS(xmlText) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Проверяем на ошибки парсинга
            if (xmlDoc.querySelector('parsererror')) {
                throw new Error('Ошибка парсинга XML');
            }

            const items = xmlDoc.querySelectorAll('item');
            const news = [];

            items.forEach(item => {
                try {
                    const title = item.querySelector('title')?.textContent || '';
                    const link = item.querySelector('link')?.textContent || '';
                    const description = item.querySelector('description')?.textContent || '';

                    if (title && link) {
                        news.push({
                            title: this.cleanText(title),
                            link: link,
                            description: this.cleanText(description)
                        });
                    }
                } catch (e) {
                    console.log('Ошибка парсинга элемента новости:', e);
                }
            });

            return news.slice(0, 8); // Ограничиваем 8 новостями

        } catch (error) {
            console.error('Ошибка парсинга RSS:', error);
            return [];
        }
    }

    cleanText(text) {
        if (!text) return '';
        
        return text
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&#[0-9]+;/g, '')
            .trim();
    }

    displayNews(news) {
        const newsContainer = document.getElementById('news-container');
        
        if (!news || news.length === 0) {
            this.showMockNews();
            return;
        }

        const newsList = document.createElement('ul');
        newsList.className = 'news-list';

        news.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'news-item';
            
            listItem.innerHTML = `
                <a href="${item.link}" target="_blank" rel="noopener">
                    <i class="fas fa-circle"></i>
                    <span class="news-title">${item.title}</span>
                </a>
            `;
            
            newsList.appendChild(listItem);
        });

        newsContainer.innerHTML = '';
        newsContainer.appendChild(newsList);
    }
}

// Initialize news when page loads
document.addEventListener('DOMContentLoaded', function() {
    new YandexNews();
    
    // Добавляем стиль для информационного сообщения
    const style = document.createElement('style');
    style.textContent = `
        .news-info {
            text-align: center;
            padding: 10px;
            color: var(--text-secondary);
            font-size: 0.8rem;
            margin-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .refresh-btn.loading {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});