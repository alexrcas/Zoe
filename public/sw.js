const CACHE_NAME = 'mi-cache-v1';

const urlsToCache = [
    '/', // la raíz, redirige a index.html
    '/index.html',
    '/manifest.json',

    // CSS y JS principales
    '/assets/css/main.css',
    '/assets/js/main.js',

    // Componentes esenciales
    '/components/product-search.js',
    '/components/scan-component.js',
    '/components/summary-component.js',
    '/components/ApiService.js',
    '/components/Dao.js',
    '/components/JournalService.js',

    // Páginas
    '/pages/home-page.js',
    '/pages/profile-page.js',
    '/pages/recents-page.js',

    // Íconos PWA
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',

    // Librerías externas
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js',
    'https://unpkg.com/lit@3.2.0/index.js?module'
];




self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

