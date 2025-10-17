/* Stoppclock Service Worker - GitHub Pages Edition */
const CACHE_NAME = "stoppclock-v3";
const MANIFEST_URL = "./manifest.json";
const CORE_ASSETS = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./favicon.ico",
    "./icons/stoppclock-logo.svg",
    "./icons/icon-32.png",
    "./icons/icon-16.png",
    "./icons/apple-touch-icon.png",
];

async function resolveBuildAssets() {
    try {
        const manifestRes = await fetch(MANIFEST_URL, { cache: "no-store" });
        if (!manifestRes.ok) {
            console.warn("SW: manifest.json not found, skipping asset resolution");
            return [];
        }
        const manifest = await manifestRes.json();
        const assets = new Set();

        function collectAssets(key, visited = new Set()) {
            if (!key || visited.has(key)) return;
            visited.add(key);
            const entry = manifest[key];
            if (!entry || typeof entry !== "object") return;
            if (entry.file) assets.add(`./${entry.file}`);
            if (Array.isArray(entry.css)) entry.css.forEach(f => assets.add(`./${f}`));
            if (Array.isArray(entry.assets)) entry.assets.forEach(f => assets.add(`./${f}`));
            if (Array.isArray(entry.imports)) entry.imports.forEach(k => collectAssets(k, visited));
            if (Array.isArray(entry.dynamicImports)) entry.dynamicImports.forEach(k => collectAssets(k, visited));
        }

        collectAssets("index.html");
        Object.keys(manifest).forEach(key => collectAssets(key));
        return Array.from(assets);
    } catch (error) {
        console.warn("SW: Asset resolution failed", error);
        return [];
    }
}

self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(CACHE_NAME);
                const buildAssets = await resolveBuildAssets();
                const toCache = [...new Set([...CORE_ASSETS, ...buildAssets])];
                await cache.addAll(toCache).catch(async error => {
                    console.warn("SW: Batch cache failed, caching individually", error);
                    await Promise.all(toCache.map(url => cache.add(url).catch(() => {})));
                });
            } catch (err) {
                console.error("SW: Install failed", err);
            }
        })()
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null));
            await self.clients.claim();
        })()
    );
});

self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;
    const isNavigate = event.request.mode === "navigate";
    const isAsset = ["script", "style", "image", "font", "manifest"].includes(event.request.destination);

    if (isNavigate) {
        event.respondWith(
            caches.match("./index.html", { cacheName: CACHE_NAME }).then(r => r || fetch(event.request)).catch(() => caches.match("./index.html", { cacheName: CACHE_NAME }))
        );
        return;
    }

    if (isAsset) {
        event.respondWith(
            caches.match(event.request, { cacheName: CACHE_NAME }).then(cached => cached || fetch(event.request).then(response => {
                if (response && response.status === 200) {
                    caches.open(CACHE_NAME).then(c => c.put(event.request, response.clone())).catch(() => {});
                }
                return response;
            })).catch(() => new Response("", { status: 503 }))
        );
        return;
    }

    event.respondWith(fetch(event.request));
});