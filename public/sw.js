const VERSION = 'v' + new Date().getTime();
const CACHE_NAME = `pwa-cache-${VERSION}`;
const urlsToCache = [
    '/', // raíz
    '/index.html',
    '/manifest.json',

    // Estilos y scripts principales
    '/assets/css/main.css',
    '/assets/js/main.js',

    // Componentes
    '/components/ApiService.js',
    '/components/Dao.js',
    '/components/JournalService.js',
    '/components/product-search.js',
    '/components/scan-component.js',
    '/components/summary-component.js',
    '/components/wizard/wizard-step1.js',
    '/components/wizard/wizard-step2.js',
    '/components/wizard/wizard-step3.js',
    '/components/wizard/wizard-step4.js',

    // Páginas
    '/pages/home-page.js',
    '/pages/profile-page.js',
    '/pages/recents-page.js',
    '/pages/wizard-page.js',

    // Iconos
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',

    // Service Worker
    '/sw.js'
];


// -------------------- INSTALACIÓN --------------------
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Archivos cacheados');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// -------------------- ACTIVACIÓN --------------------
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activando...');


    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[ServiceWorker] Borrando caché vieja:', key);
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// -------------------- FETCH --------------------
self.addEventListener('fetch', (event) => {
    // Nunca cachear el propio service worker
    if (event.request.url.endsWith('sw.js')) return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Si está en caché, devuélvelo
            if (response) {
                return response;
            }

            // Si no, intenta desde la red
            return fetch(event.request)
                .then((networkResponse) => {
                    // Solo cachear GET exitosos
                    if (
                        !networkResponse ||
                        networkResponse.status !== 200 ||
                        event.request.method !== 'GET'
                    ) {
                        return networkResponse;
                    }

                    // Clona la respuesta y la guarda
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });

                    return networkResponse;
                })
                .catch(() => {
                    // Fallback básico offline
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
        })
    );
});
