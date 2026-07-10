const CACHE_NAME = 'money-plan-cache-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Network-first, falling back to cache when offline — and caching
// everything (including Google Fonts) as it's successfully fetched,
// so the app keeps working once you've opened it at least once online.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const networkResponse = await fetch(event.request);
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch (err) {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          const fallback = await cache.match('./index.html');
          if (fallback) return fallback;
        }
        throw err;
      }
    })
  );
});
