const CACHE_NAME = 'pwa-firestore-cache-v1';
const urlsToCache = [
    './', 
    './index.html',
    './app.js',
    './manifest.json',
    // 🔑 Ajout des bibliothèques Firebase pour le fonctionnement hors ligne
    'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js',
    './icon-192x192.png', // Assurez-vous que les icônes sont là !
    './icon-512x512.png'
];

// Installation du Service Worker et mise en cache des ressources statiques
self.addEventListener('install', event => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Échec de la mise en cache, vérifiez les erreurs 404:', err);
            })
    );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interception des requêtes (stratégie Cache-First)
self.addEventListener('fetch', event => {
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    response => {
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        var responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                        return response;
                    }
                );
            })
    );
});
