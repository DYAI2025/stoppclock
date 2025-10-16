/* Stoppclock service worker for GitHub Pages */
const CACHE_NAME = "stoppclock-v2";
const MANIFEST_URL = "./manifest.json";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./manifest.json",
  "./favicon.ico",
  "./icons/stoppclock-logo.svg",
  "./icons/icon-32.png",
  "./icons/icon-16.png",
  "./icons/apple-touch-icon.png",
];

async function resolveBuildAssets() {
  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("manifest.json missing");
    }

    const manifest = await res.json();
    const seen = new Set();
    const assets = new Set();

    function collect(key) {
      if (!key || seen.has(key)) {
        return;
      }
      seen.add(key);
      const entry = manifest[key];
      if (!entry || typeof entry !== "object") {
        return;
      }

      if (entry.file) {
        assets.add(`./${entry.file}`);
      }
      if (Array.isArray(entry.css)) {
        entry.css.forEach((cssFile) => assets.add(`./${cssFile}`));
      }
      if (Array.isArray(entry.assets)) {
        entry.assets.forEach((assetFile) => assets.add(`./${assetFile}`));
      }
      if (Array.isArray(entry.imports)) {
        entry.imports.forEach((nextKey) => collect(nextKey));
      }
      if (Array.isArray(entry.dynamicImports)) {
        entry.dynamicImports.forEach((nextKey) => collect(nextKey));
      }
    }

    collect("index.html");
    Object.keys(manifest).forEach((key) => collect(key));

    return Array.from(assets);
  } catch (error) {
    console.warn("SW: Unable to resolve build assets", error);
    return [];
  }
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const buildAssets = await resolveBuildAssets();
      const toCache = Array.from(new Set([...CORE_ASSETS, ...buildAssets]));

      try {
        await cache.addAll(toCache);
      } catch (error) {
        console.warn("SW: Failed to precache some assets", error);
        await Promise.all(
          toCache.map(async (url) => {
            try {
              const response = await fetch(url, { cache: "no-store" });
              if (response && response.ok) {
                await cache.put(url, response.clone());
              }
            } catch (err) {}
          }),
        );
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      caches
        .match("./index.html")
        .then((cached) => cached || fetch(req))
        .catch(() => caches.match("./index.html")),
    );
    return;
  }

  if (["script", "style", "image", "font", "manifest"].includes(req.destination)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(req)
          .then((networkResponse) => {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseClone).catch(() => {});
            });
            return networkResponse;
          })
          .catch(() => new Response("", { status: 500, statusText: "Offline" }));
      }),
    );
  }
});
