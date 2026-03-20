const STATIC_CACHE_NAME = 'borderless-builder-static-v1';
const STATIC_PATH_MARKERS = [
  '/Fonts/',
  '/Overlays/',
  '/SetSymbols/',
  '/TextboxGuideImages/',
  '/vendor/'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map((name) => {
      if(name !== STATIC_CACHE_NAME) return Promise.resolve();
      return Promise.resolve();
    }));
    await self.clients.claim();
  })());
});

function isCacheableStaticRequest(request){
  if(!request || request.method !== 'GET') return false;
  const url = new URL(request.url);
  if(url.origin !== self.location.origin) return false;
  return STATIC_PATH_MARKERS.some((marker) => url.pathname.includes(marker));
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if(!isCacheableStaticRequest(request)) return;

  event.respondWith((async () => {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cached = await cache.match(request);

    const networkPromise = fetch(request)
      .then((response) => {
        if(response && response.ok){
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      })
      .catch(() => null);

    if(cached){
      event.waitUntil(networkPromise);
      return cached;
    }

    const networkResponse = await networkPromise;
    if(networkResponse) return networkResponse;

    return new Response('', { status: 504, statusText: 'Gateway Timeout' });
  })());
});