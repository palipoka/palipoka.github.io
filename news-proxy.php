<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$category = $_GET['category'] ?? 'index';
$allowed_categories = ['index', 'politics', 'society', 'business', 'world', 'science'];
$category = in_array($category, $allowed_categories) ? $category : 'index';

$url = "https://news.yandex.ru/{$category}.rss";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 && $response) {
    $xml = simplexml_load_string($response);
    $news = [];
    
    foreach ($xml->channel->item as $item) {
        $news[] = [
            'title' => (string)$item->title,
            'link' => (string)$item->link,
            'description' => (string)$item->description,
            'pubDate' => (string)$item->pubDate
        ];
    }
    
    echo json_encode(array_slice($news, 0, 10));
} else {
    echo json_encode(['error' => 'Failed to fetch news']);
}
?>