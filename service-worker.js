const CACHE_NAME = 'SimiloV1'; // Уникальное имя для кэша
const URLS_TO_CACHE = [
    'index.html',
    'styles.css',
    'script.js',
    'service-worker.js',
    'manifest.json',
    'sound/click.mp3',
    'sound/drop.mp3',

    // Карты и бонусы
    'img/deck/animals.jpg', 
    'img/deck/wildanimals.jpg', 
    'img/deck/fables.jpg',
    'img/deck/history.jpg', 
    'img/deck/myths.jpg', 
    'img/deck/spookies.jpg',
    'img/deck/hogwarts.jpg', 
    'img/deck/tvary.jpg', 
    'img/deck/starWars.jpg', 
    'img/deck/marveldc.jpg',    
    'img/back/animals.jpg', 
    'img/back/wildanimals.jpg', 
    'img/back/fables.jpg',
    'img/back/history.jpg', 
    'img/back/myths.jpg', 
    'img/back/spookies.jpg',
    'img/back/hogwarts.jpg', 
    'img/back/tvary.jpg', 
    'img/back/starWars.jpg', 
    'img/back/marveldc.jpg',

    // Иконки
    'img/favicon.ico',
    'img/icon_x48.png',
    'img/icon_x72.png',
    'img/icon_x96.png',
    'img/icon_x128.png',
    'img/icon_x192.png',
    'img/icon_x384.png',
    'img/icon_x512.png',
    'img/icon_x1024.png',
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Кэширование ресурсов');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Если есть кэшированный ресурс, возвращаем его
                if (response) {
                    return response;
                }
                // Если нет, загружаем ресурс из сети
                return fetch(event.request);
            })
    );
});

// Обновление кэша при активации нового Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // Массив с допустимыми именами кэшей
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Удаляем старые кэши
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
