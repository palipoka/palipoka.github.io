// News functionality - local version without external dependencies
class YandexNews {
    constructor() {
        this.currentCategory = 'index';
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
                setTimeout(() => {
                    this.loadNews(this.currentCategory);
                    refreshBtn.classList.remove('loading');
                }, 500);
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
        document.querySelectorAll('.news-category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.currentCategory = category;
        this.loadNews(category);
    }

    loadNews(category = 'index') {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer) return;

        // Показываем заглушку загрузки
        newsContainer.innerHTML = '<div class="news-loading">Загрузка новостей...</div>';

        // Имитируем загрузку
        setTimeout(() => {
            const newsData = this.getNewsByCategory(category);
            this.displayNews(newsData, true);
        }, 800);
    }

    getNewsByCategory(category) {
        const categories = {
            'index': [
                {
                    title: "ЦБ РФ сохранил ключевую ставку на уровне 16% годовых",
                    link: "https://news.yandex.ru/story/CB_RF_sokhranil_klyuchevuyu_stavku",
                    description: "Центробанк России принял решение сохранить ключевую ставку на уровне 16% годовых"
                },
                {
                    title: "В Москве представлен новый план развития транспортной инфраструктуры",
                    link: "https://news.yandex.ru/story/Novyj_plan_razvitiya_transporta",
                    description: "Власти Москвы анонсировали масштабный проект по развитию общественного транспорта"
                },
                {
                    title: "Ученые совершили прорыв в области квантовых вычислений",
                    link: "https://news.yandex.ru/story/Kvantovye_vychisleniya_proryv",
                    description: "Российские исследователи добились значительного прогресса в создании квантовых процессоров"
                }
            ],
            'politics': [
                {
                    title: "Состоялась встреча глав государств на экономическом форуме",
                    link: "https://news.yandex.ru/politics",
                    description: "Лидеры стран обсудили вопросы международного сотрудничества"
                },
                {
                    title: "Подписаны новые международные соглашения",
                    link: "https://news.yandex.ru/politics",
                    description: "Страны договорились о расширении экономического партнерства"
                },
                {
                    title: "Обсуждается реформа избирательной системы",
                    link: "https://news.yandex.ru/politics",
                    description: "Эксперты предлагают изменения в избирательном законодательстве"
                }
            ],
            'society': [
                {
                    title: "Запущены новые социальные программы поддержки населения",
                    link: "https://news.yandex.ru/society",
                    description: "Правительство расширяет меры социальной поддержки"
                },
                {
                    title: "Активно развивается волонтерское движение",
                    link: "https://news.yandex.ru/society",
                    description: "Волонтеры помогают в решении социальных вопросов"
                },
                {
                    title: "Образовательные инициативы для молодежи",
                    link: "https://news.yandex.ru/society",
                    description: "Новые программы поддержки молодых специалистов"
                }
            ],
            'business': [
                {
                    title: "Фондовый рынок показывает рост на этой неделе",
                    link: "https://news.yandex.ru/business",
                    description: "Инвесторы проявляют активность на финансовых рынках"
                },
                {
                    title: "Запущены новые инвестиционные проекты",
                    link: "https://news.yandex.ru/business",
                    description: "Бизнес расширяет присутствие в регионах"
                },
                {
                    title: "Технологические стартапы привлекают инвестиции",
                    link: "https://news.yandex.ru/business",
                    description: "Венчурные фонды активно инвестируют в инновации"
                }
            ],
            'world': [
                {
                    title: "Международный экономический саммит собрал лидеров",
                    link: "https://news.yandex.ru/world",
                    description: "Обсуждаются вопросы глобальной экономики"
                },
                {
                    title: "Климатические инициативы мировых лидеров",
                    link: "https://news.yandex.ru/world",
                    description: "Страны договорились о совместных экологических проектах"
                },
                {
                    title: "Развитие международного культурного обмена",
                    link: "https://news.yandex.ru/world",
                    description: "Укрепляются культурные связи между странами"
                }
            ],
            'science': [
                {
                    title: "Новые открытия в области медицинских исследований",
                    link: "https://news.yandex.ru/science",
                    description: "Ученые представили результаты клинических испытаний"
                },
                {
                    title: "Развитие искусственного интеллекта и машинного обучения",
                    link: "https://news.yandex.ru/science",
                    description: "Новые алгоритмы показывают впечатляющие результаты"
                },
                {
                    title: "Космические исследования: новые горизонты",
                    link: "https://news.yandex.ru/science",
                    description: "Ученые планируют новые миссии по изучению космоса"
                }
            ],
            'sport': [
                {
                    title: "Подготовка к международным спортивным соревнованиям",
                    link: "https://news.yandex.ru/sport",
                    description: "Спортсмены активно готовятся к предстоящим турнирам"
                },
                {
                    title: "Достижения российских спортсменов на мировых аренах",
                    link: "https://news.yandex.ru/sport",
                    description: "Атлеты показывают высокие результаты на соревнованиях"
                },
                {
                    title: "Развитие спортивной инфраструктуры в регионах",
                    link: "https://news.yandex.ru/sport",
                    description: "Строятся новые спортивные объекты и комплексы"
                }
            ]
        };

        return categories[category] || categories['index'];
    }

    displayNews(news, isDemo = false) {
        const newsContainer = document.getElementById('news-container');
        
        if (!news || news.length === 0) {
            newsContainer.innerHTML = '<div class="news-error">Новости не найдены</div>';
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
            demoInfo.innerHTML = '<p><small>Демо-новости. Для реальных новостей необходим серверный прокси.</small></p>';
            newsContainer.appendChild(demoInfo);
        }
    }
}

// Добавляем стили для новостей
const newsStyles = `
    .news-loading {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-secondary);
        font-size: 1.1rem;
    }
    
    .news-error {
        text-align: center;
        padding: 30px 20px;
        color: #ff6b6b;
        font-size: 1rem;
    }
    
    .news-info {
        text-align: center;
        padding: 15px;
        color: var(--text-secondary);
        font-size: 0.8rem;
        margin-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .news-info p {
        margin: 0;
    }
    
    .refresh-btn.loading {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .news-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .news-item {
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transition: background-color 0.3s ease;
    }
    
    .news-item:hover {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
    }
    
    .news-item:last-child {
        border-bottom: none;
    }
    
    .news-item a {
        color: var(--text-primary);
        text-decoration: none;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        transition: color 0.3s ease;
        padding: 0 5px;
    }
    
    .news-item a:hover {
        color: #ffd43b;
    }
    
    .news-item i {
        font-size: 0.7rem;
        margin-top: 6px;
        color: #ffd43b;
        min-width: 12px;
    }
    
    .news-title {
        font-size: 0.95rem;
        line-height: 1.4;
        margin: 0;
        flex: 1;
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = newsStyles;
document.head.appendChild(styleSheet);

// Initialize news when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.newsApp = new YandexNews();
});
