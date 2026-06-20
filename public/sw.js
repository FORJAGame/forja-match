const CACHE_PREFIX = "forja-match-assets";
const CACHE_VERSION = "v1";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

const STATIC_ASSET_URLS = [
  "/FORJAmatch.glb",
  "/forja_match_logo.png",
  "/favicon.svg",
  "/icons.svg",
  "/assets/games/deco-dica.png",
  "/assets/games/ismalia.png",
  "/assets/games/lost-fields.jpeg",
  "/assets/games/mortis-pactum.png",
  "/assets/games/the-party-of-losers.png",
  "/assets/games/you-are-gonna-be-late.png",
];

const CACHEABLE_PATHS = new Set(STATIC_ASSET_URLS);

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function shouldCacheRequest(request) {
  if (request.method !== "GET") {
    return false;
  }

  const url = new URL(request.url);

  if (!isSameOrigin(url)) {
    return false;
  }

  return (
    CACHEABLE_PATHS.has(url.pathname) ||
    url.pathname.startsWith("/assets/games/") ||
    url.pathname.endsWith(".glb")
  );
}

async function cacheAssets(urls) {
  const cache = await caches.open(CACHE_NAME);
  const sameOriginUrls = urls.filter((url) => {
    try {
      return isSameOrigin(new URL(url, self.location.origin));
    } catch {
      return false;
    }
  });

  await Promise.allSettled(sameOriginUrls.map((url) => cache.add(url)));
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request, { ignoreSearch: true });

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);

  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAssets(STATIC_ASSET_URLS).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_ASSETS") {
    return;
  }

  const urls = Array.isArray(event.data.urls) ? event.data.urls : [];

  event.waitUntil(cacheAssets(urls));
});

self.addEventListener("fetch", (event) => {
  if (!shouldCacheRequest(event.request)) {
    return;
  }

  event.respondWith(cacheFirst(event.request));
});
