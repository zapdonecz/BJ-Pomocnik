const CACHE_NAME = 'ip-hlidac-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',      // Uprav, pokud máš jiný název souboru s logikou
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalace: otevře cache a uloží vyjmenované soubory
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache otevřená');
        return cache.addAll(urlsToCache);
      })
  );
});

// Posluchač zpráv pro aktualizaci
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Aktivace: odstraní staré cache verze
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Odstraňuji starou cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Přesměrování fetch requestů: nejprve se pokusí najít odpověď v cache, pokud nenajde, stáhne ze sítě
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
