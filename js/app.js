// navigator - object which represent the browser
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js')
  // reg - registration object. Reprezentuje rejestracje SW
    .then(reg => console.log('service worker registered', reg))
    .catch(err => console.log('service worker not registered', err));
}