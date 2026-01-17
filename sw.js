const staticCacheName = "site-static-v1";
const dynamicCache = "site-dynamic-v1";
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
// event - event object which represent install event
self.addEventListener("install", (event) => {
  console.log("service worker installed");
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// 2. activate service worker
self.addEventListener("activate", (event) => {
  console.log("service worker has been acvitated");
  event.waitUntil(
    caches.keys().then((keys) => {
      // console.log(keys);
      // czeka az wszystkie stare cache zostana usuniete
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event occurs whenerver app want to get something from the server
// sw moze przechwytywac requesty bo dziala jako proxy pomiedzy przegladarka a serwerem
self.addEventListener("fetch", (event) => {
  // console.log("fetch event", event);
  // najpierw sprawdzam czy to co chce pobrac jest juz w cache
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(event.request).then((fetchRes) => {
          return caches.open(dynamicCache).then((cache) => {
            cache.put(event.request.url, fetchRes.clone());
            return fetchRes;
          });
        })
      );
    })
  );
});
