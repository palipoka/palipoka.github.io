<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Разрешенные категории новостей
$allowed_categories = ['index', 'politics', 'society', 'business', 'world', 'science', 'sport'];
$category = isset($_GET['category']) ? $_GET['category'] : 'index';

// Проверяем допустимость категории
if (!in_array($category, $allowed_categories)) {
    $category = 'index';
}

// Функция для получения RSS и преобразования в JSON
function getYandexNews($category) {
    $rss_url = "https://news.yandex.ru/{$category}.rss";
    
    // Настройки cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $rss_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 200 && $response) {
        return $response;
    }
    
    return false;
}

// Функция для парсинга RSS в JSON
function parseRssToJson($rssContent) {
    $xml = simplexml_load_string($rssContent);
    $news = [];
    
    if ($xml && isset($xml->channel)) {
        foreach ($xml->channel->item as $item) {
            $title = (string)$item->title;
            $link = (string)$item->link;
            $description = (string)$item->description;
            $pubDate = (string)$item->pubDate;
            
            // Очищаем текст
            $title = strip_tags($title);
            $description = strip_tags($description);
            $title = html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $description = html_entity_decode($description, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            
            if (!empty($title) && !empty($link)) {
                $news[] = [
                    'title' => $title,
                    'link' => $link,
                    'description' => $description,
                    'pubDate' => $pubDate,
                    'timestamp' => strtotime($pubDate)
                ];
            }
        }
    }
    
    return array_slice($news, 0, 8);
}

// Основная логика
try {
    $rssContent = getYandexNews($category);
    
    if ($rssContent) {
        $news = parseRssToJson($rssContent);
        
        echo json_encode([
            'success' => true,
            'category' => $category,
            'news' => $news,
            'count' => count($news)
        ], JSON_UNESCAPED_UNICODE);
        
    } else {
        throw new Exception('Не удалось получить RSS');
    }
    
} catch (Exception $e) {
    // Демо-новости при ошибке
    $demo_news = [
        [
            'title' => 'ЦБ РФ сохранил ключевую ставку на уровне 16% годовых',
            'link' => 'https://news.yandex.ru',
            'description' => 'Центробанк России принял решение сохранить ключевую ставку.',
            'pubDate' => date('r'),
            'timestamp' => time()
        ],
        [
            'title' => 'В Москве представлен новый план развития транспорта',
            'link' => 'https://news.yandex.ru',
            'description' => 'Власти Москвы анонсировали проект по развитию общественного транспорта.',
            'pubDate' => date('r', time() - 3600),
            'timestamp' => time() - 3600
        ],
        [
            'title' => 'Ученые совершили прорыв в квантовых вычислениях',
            'link' => 'https://news.yandex.ru',
            'description' => 'Российские исследователи добились прогресса в создании квантовых процессоров.',
            'pubDate' => date('r', time() - 7200),
            'timestamp' => time() - 7200
        ]
    ];
    
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'category' => $category,
        'news' => $demo_news,
        'count' => count($demo_news),
        'isDemo' => true
    ], JSON_UNESCAPED_UNICODE);
}
?>
