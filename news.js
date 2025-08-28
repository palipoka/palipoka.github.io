<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$category = $_GET['category'] ?? 'index';
$allowed = ['index', 'politics', 'society', 'business', 'world', 'science', 'sport'];

if (!in_array($category, $allowed)) {
    $category = 'index';
}

// Просто возвращаем демо-данные в JSON формате
$news = [
    [
        'title' => 'ЦБ РФ сохранил ключевую ставку на уровне 16%',
        'link' => 'https://news.yandex.ru',
        'description' => 'Центробанк России принял решение о сохранении ставки'
    ],
    [
        'title' => 'Новый транспортный план для Москвы',
        'link' => 'https://news.yandex.ru', 
        'description' => 'Представлены проекты развития инфраструктуры'
    ],
    [
        'title' => 'Прорыв в квантовых вычислениях',
        'link' => 'https://news.yandex.ru',
        'description' => 'Ученые достигли новых результатов'
    ]
];

echo json_encode([
    'success' => true,
    'news' => $news
]);
?>
