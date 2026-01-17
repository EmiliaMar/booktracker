const staticCacheName = "site-static";
const assets = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/app.js",
  "/js/books.js",
  "/js/quotes.js",
  "/js/stats.js",
  "/pages/add-book.html",
  "/pages/library.html",
  "/pages/quotes.html",
  "/pages/stats.html",
];

// 1. install service worker (install event)
// evt - event object which represent install event
self.addEventListener("install", (evt) => {
  console.log("service worker installed");
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// 2. activate service worker
self.addEventListener("activate", (evt) => {
  console.log("service worker has been acvitated");
});

// fetch event
// fetch event occurs whenerver app want to get something from the server
// sw moze przechwytywac requesty bo dziala jako proxy pomiedzy przegladarka a serwerem
self.addEventListener("fetch", (evt) => {
  // console.log("fetch event", evt);
  // najpierw sprawdzam czy to co chce pobrac jest juz w cache
  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return cacheRes || fetch(evt.request);
    })
  );
});
