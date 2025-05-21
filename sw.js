// sw.js  — must be at site root

const CACHE_NAME = 'lab-8-starter-v1';

/* ----------  B6. Pre-cache the six recipe JSON files ---------- */
const PRE_CACHE = [
  './',
  'assets/scripts/main.js',
  'assets/styles/main.css',
  //  ---- recipe data
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json'
];

/* ---------- install ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();                     // activate immediately
});

/* ---------- activate ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();                   // control pages ASAP
});

/* ---------- B7-B8 fetch handler ---------- */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) {
        /* B8-a. Return cached asset if present */
        return cached;
      }
      /* B8-b. Otherwise fetch from network, cache, and return */
      try {
        const resp = await fetch(event.request);
        cache.put(event.request, resp.clone());
        return resp;
      } catch (err) {
        // Optional: fallback logic (e.g., offline page) can go here
        throw err;
      }
    })
  );
});
