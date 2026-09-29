const CACHE = 'ebx-v3';

const ASSETS = [
  // Core
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',

  // CSS
  './css/main.css',
  './css/tokens.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/screens.css',

  // JS core
  './js/app.js',
  './js/router.js',
  './js/state.js',
  './js/ui.js',
  './js/data.js',

  // JS screens
  './js/screens/welcome.js',
  './js/screens/home.js',
  './js/screens/chapter.js',
  './js/screens/values.js',
  './js/screens/quiz.js',
  './js/screens/certificate.js',
  './js/screens/explore.js',

  // Imagens (opcional — se não existirem, o catch ignora)
  './assets/images/logo-ecobank.png',
  './assets/images/welcome-bg.jpg',
];

// ---------- INSTALL ----------
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            // Não falha a instalação se um ficheiro opcional não existir
            console.warn('[SW] Ignorado (não encontrado):', url);
          })
        )
      )
    )
  );
});

// ---------- ACTIVATE ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ---------- FETCH ----------
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Ignora métodos que não sejam GET
  if (req.method !== 'GET') return;

  // Ignora pedidos a outros domínios (ex: fonts, analytics)
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Guarda cópia no cache (apenas respostas válidas)
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches
            .open(CACHE)
            .then((cache) => cache.put(req, copy))
            .catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => {
          if (cached) return cached;

          // Se for navegação (HTML), devolve o index
          if (req.mode === 'navigate') {
            return caches.match('./index.html');
          }

          // Fallback final
          return caches.match('./offline.html');
        })
      )
  );
});

// ---------- MENSAGENS (opcional) ----------
// Permite forçar o SW a atualizar via postMessage
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});