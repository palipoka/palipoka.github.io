<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Разрешенные категории новостей
$allowed_categories = ['index', 'politics', 'society', 'business', 'world', 'science', 'sport'];
$category = isset($_GET['category']) ? $_GET['category'] : 'index';

// Проверяем допустимость категории
if (!in_array($category, $allowed_categories)) {
    $category = 'index';
}

// URL RSS-ленты Яндекса
$rss_url = "https://news.yandex.ru/{$category}.rss";

// Настройки cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $rss_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($http_code === 200 && $response) {
    // Парсим RSS
    $xml = simplexml_load_string($response);
    $news = [];
    
    if ($xml && isset($xml->channel)) {
        foreach ($xml->channel->item as $item) {
            $title = (string)$item->title;
            $link = (string)$item->link;
            $description = (string)$item->description;
            $pubDate = (string)$item->pubDate;
            
            // Очищаем текст от HTML тегов
            $title = strip_tags($title);
            $description = strip_tags($description);
            
            // Заменяем HTML entities
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
    
    // Ограничиваем количество новостей
    $news = array_slice($news, 0, 10);
    
    echo json_encode([
        'success' => true,
        'category' => $category,
        'news' => $news,
        'count' => count($news)
    ]);
    
} else {
    // Возвращаем демо-новости в случае ошибки
    $demo_news = [
        [
            'title' => 'ЦБ РФ сохранил ключевую ставку на уровне 16% годовых',
            'link' => 'https://news.yandex.ru/story/CB_RF_sokhranil_klyuchevuyu_stavku',
            'description' => 'Центробанк России принял решение сохранить ключевую ставку на уровне 16% годовых.',
            'pubDate' => date('r'),
            'timestamp' => time()
        ],
        [
            'title' => 'В Москве представлен новый план развития транспорта',
            'link' => 'https://news.yandex.ru/story/Novyj_plan_razvitiya_transporta',
            'description' => 'Власти Москвы анонсировали масштабный проект по развитию общественного транспорта.',
            'pubDate' => date('r', time() - 3600),
            'timestamp' => time() - 3600
        ],
        [
            'title' => 'Ученые совершили прорыв в квантовых вычислениях',
            'link' => 'https://news.yandex.ru/story/Kvantovye_vychisleniya_proryv',
            'description' => 'Российские исследователи добились прогресса в создании квантовых процессоров.',
            'pubDate' => date('r', time() - 7200),
            'timestamp' => time() - 7200
        ],
        [
            'title' => 'Новая космическая программа исследования Марса',
            'link' => 'https://news.yandex.ru/story/Novaya_kosmicheskaya_programma',
            'description' => 'Роскосмос начинает совместную миссию по изучению Красной планеты.',
            'pubDate' => date('r', time() - 10800),
            'timestamp' => time() - 10800
        ],
        [
            'title' => 'Цифровизация госуслуг: новые сервисы для граждан',
            'link' => 'https://news.yandex.ru/story/Cifrovizaciya_gosuslug',
            'description' => 'Правительство расширяет перечень услуг, доступных в электронном формате.',
            'pubDate' => date('r', time() - 14400),
            'timestamp' => time() - 14400
        ]
    ];
    
    echo json_encode([
        'success' => false,
        'error' => 'Не удалось загрузить новости: ' . $error,
        'category' => $category,
        'news' => $demo_news,
        'count' => count($demo_news),
        'isDemo' => true
    ]);
}
?>
