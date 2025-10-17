const PRECACHE = 'sc-precache-__BUILD__';
const PRECACHE_URLS = ['/', './', '/index.html', '/manifest.webmanifest'];

self.skipWaiting();

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    for (const url of PRECACHE_URLS) {
      try {
        await cache.add(new Request(url, { cache: 'reload' }));
      } catch {
        // ignore install miss for optional assets
      }
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => name.startsWith('sc-precache-') && name !== PRECACHE)
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request, { cache: 'reload' });
        const cache = await caches.open(PRECACHE);
        cache.put('/index.html', fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(PRECACHE);
        const cached = await cache.match('/index.html');
        return cached || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  if (/(\.js|\.css|\.svg|\.png|\.jpg|\.jpeg|\.ico|\.webp|\.woff2?|\.ttf|\.txt|\.xml|\.webmanifest)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(PRECACHE);
      const cached = await cache.match(request);
      if (cached) {
        fetch(request)
          .then((fresh) => {
            if (fresh && fresh.ok) cache.put(request, fresh.clone());
          })
          .catch(() => {});
        return cached;
      }
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) cache.put(request, fresh.clone());
        return fresh;
      } catch {
        return new Response('Offline asset missing', { status: 504 });
      }
    })());
  }
});
