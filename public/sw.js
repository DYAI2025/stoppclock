/* Stoppclock basic service worker for offline support */
const CACHE_NAME = 'stoppclock-v1';
const CORE_ROUTES = [
  './',
  'stopwatch',
  'countdown',
  'interval',
  'clock',
  'alarm',
  'metronome',
  'chess',
  'pomodoro',
  'impressum.html',
  'privacy.html',
  'imprint.html',
  'privacy-policy.html',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ROUTES).catch(() => undefined))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for navigation requests; cache-first for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((cached) => cached || caches.match('./')))
    );
    return;
  }

  // Assets: stale-while-revalidate
  if (req.destination === 'script' || req.destination === 'style' || req.destination === 'image' || req.destination === 'font') {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req).then((networkRes) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes.clone()));
          return networkRes;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
