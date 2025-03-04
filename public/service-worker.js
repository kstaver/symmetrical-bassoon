const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/js/index.js',
    '/js/idb.js',
    '/manifest.json',
    '/css/style.css',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'  
];

// Add files to the precache list after the install step
// so that the app can use the cache
self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            console.log('installing cache :' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

// Activate the service worker and remove old caches
self.addEventListener('activate', function (e){
    e.waitUntil(
        caches.keys().then(function (keyList){
            let cacheKeepList = keyList.filter(function (key){
                return key.indexOf(APP_PREFIX);
            });
            cacheKeepList.push(CACHE_NAME);
            // Removes caches that aren't in the array
            return Promise.all(keyList.map(function (key, i){
                if (cacheKeepList.indexOf(key) === -1){
                    console.log('deleteing cache' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }))
        })
    )
});

// Retrieve the data from the cache
self.addEventListener('fetch', function (e) {
    console.log('fetching data from cahce: ' + e.request.url);
    e.respondWith(
        caches.matche(e.request).then(function (request){
            if(request){
                console.log('returning data from cache: ' + e.request.url);
                return request;
            }else{
                console.log('file is not in cache: ' + e.request.url);
                return fetch(e.request);
            }
        })
    )
})