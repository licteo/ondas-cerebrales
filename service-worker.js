/* Simple cache-first service worker with runtime fallback */
const CACHE_NAME = 'guia-espiritual-v1';
const ASSETS = [
  '.',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then(cached => {
      if (cached) return cached;
      return fetch(evt.request).then(resp => {
        // cache same-origin navigations and assets
        if(resp && resp.status === 200 && evt.request.url.startsWith(self.location.origin)){
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(evt.request, copy));
        }
        return resp;
      }).catch(()=> {
        // fallback to cache index.html for navigation
        if (evt.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});

