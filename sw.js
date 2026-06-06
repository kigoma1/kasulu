const CACHE='vaccination-v1';
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(['./'])}))});
self.addEventListener('fetch',function(e){e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request).then(function(res){if(!res||res.status!==200||res.type!=='basic')return res;var rc=res.clone();caches.open(CACHE).then(function(c){c.put(e.request,rc)});return res})}))});
