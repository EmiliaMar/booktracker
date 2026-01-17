const staticCacheName = "site-static-v4";
const dynamicCacheName = "site-dynamic-v4";
const assets = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/app.js",
  "/js/utils.js",
  "/js/db.js",
  "/js/books.js",
  "/js/quotes.js",
  "/js/stats.js",
  "/js/chart.js",
  "/pages/fallback.html",
];

// cache size limit func
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

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
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event occurs whenerver app want to get something from the server
// sw moze przechwytywac requesty bo dziala jako proxy pomiedzy przegladarka a serwerem
self.addEventListener("fetch", (event) => {
  console.log("fetch event", event);
  // najpierw sprawdzam czy to co chce pobrac jest juz w cache

  // sprawdza czy url ządania nie zawiera firestore zeby nie cachowac zapytac do firestore
  if (event.request.url.indexOf("firestore.googleapis.com") === -1) {
    event.respondWith(
      caches
        .match(event.request)
        .then((cacheRes) => {
          return (
            cacheRes ||
            fetch(event.request).then((fetchRes) => {
              return caches.open(dynamicCacheName).then((cache) => {
                cache.put(event.request.url, fetchRes.clone());
                // check cache size
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              });
            })
          );
        })
        // catch error jesli nie udalo sie pobrac pliku z cache ani z sieci
        .catch(() => {
          // sprawdza czy ządany plik to strona html
          if (event.request.url.indexOf(".html") > -1) {
            return caches.match("/pages/fallback.html");
          }
        })
    );
  }
});
