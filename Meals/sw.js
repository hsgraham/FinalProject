const staticCache = 'Static Cache - v18';
const dynamicCache = 'Dynamic Cache - v18';

const assets = [
    "/"
    , "/meals/"
    , "/meals/index.html"
    , "/meals/fallback.html"
    , "/meals/js/app.js" 
    , "/meals/css/style.css" 
    , "/meals/manifest.json" 
];


self.addEventListener("install", function(event){
    console.log(`SW: Event fired: ${event.type}`);
    event.waitUntil(caches.open(staticCache).then(function(cache){
        console.log(`SW: precaching app shell`);
        cache.addAll(assets);
    }));
});

self.addEventListener("activate", function(event){
    console.log(`SW: Event fired: ${event.type}`);

    event.waitUntil(
        caches.keys().then((keys) => {
            console.log(keys);
            console.log('staticCache = ' + staticCache);
            return Promise.all(
                keys.filter((key)  => key !== staticCache).map((key) => caches.delete(key))
            );
        })
    );
});


self.addEventListener("fetch", function(event){
    //console.log(`SW: Event fired: ${event.request.url}`);
    if (event.request.url.indexOf("fire") === -1) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then(fetchRes => {
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(event.request.url, fetchRes.clone());
                        return fetchRes;
                    });
                });
            }).catch(() => caches.match("/meals/fallback.html"))
        );
    }
});