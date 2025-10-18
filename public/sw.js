const PRECACHE = 'sc-precache-__BUILD__';
const SHELL = ['/', '/index.html', '/manifest.webmanifest'];

self.skipWaiting();

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(PRECACHE);
    for (const u of SHELL) { 
      try { await c.add(new Request(u, { cache: 'reload' })); } 
      catch (err) { console.warn('SW install failed for', u, err); }
    }
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k.startsWith('sc-precache-') && k !== PRECACHE)
        .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(request, { cache: 'reload' });
        const c = await caches.open(PRECACHE);
        c.put('/index.html', fresh.clone());
        return fresh;
      } catch {
        const c = await caches.open(PRECACHE);
        return (await c.match('/index.html')) || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  if (/\.(js|css|svg|png|jpg|jpeg|ico|webp|woff2?|ttf|txt|xml|webmanifest)$/i.test(url.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(PRECACHE);
      const cached = await c.match(request);
      if (cached) {
        fetch(request).then(r => { if (r && r.ok) c.put(request, r.clone()); }).catch(() => {});
        return cached;
      }
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) c.put(request, fresh.clone());
        return fresh;
      } catch {
        return new Response('Offline asset missing', { status: 504 });
      }
    })());
  }
});
