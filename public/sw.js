/* Stoppclock service worker for GitHub Pages */
const CACHE_NAME = 'stoppclock-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/index-DtWKMgRL.js',
  './assets/main-d8bAOZLc.css',
  './assets/main-DW3ZJ3Vd.js',
  './favicon.ico',
  './icons/stoppclock-logo.svg',
  './icons/icon-32.png',
  './icons/icon-16.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => {
        // If some assets fail to cache, that's OK for basic functionality
        console.log('Some assets failed to cache, but continuing...');
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Handle all requests: return index.html for navigation requests (SPA routing)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // For navigation requests (HTML), always return index.html to support client-side routing
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html')
        .then((cached) => cached || fetch(req))
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // For static assets (JS, CSS, images, etc.), use cache-first strategy
  if (req.destination === 'script' || req.destination === 'style' || 
      req.destination === 'image' || req.destination === 'font' || 
      req.destination === 'manifest') {
    event.respondWith(
      caches.match(req)
        .then((cached) => {
          // If found in cache, return it
          if (cached) return cached;

          // Otherwise fetch from network, cache it, and return
          return fetch(req)
            .then((networkResponse) => {
              // Clone the response to store in cache and return to browser
              const responseToCache = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(req, responseToCache).catch(() => {
                    // Ignore cache errors - not critical
                  });
                });
                
              return networkResponse;
            })
            .catch(() => {
              // If both cache and network fail, return error
              return new Response('', { status: 500, statusText: 'Offline' });
            });
        })
    );
  }
});
