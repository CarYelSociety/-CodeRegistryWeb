const CACHE = "code-registry-v1", ARCHIVOS = ["/", "/index.html", "/style.css", "/app.js", "/manifest.json"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS))));
self.addEventListener("fetch", e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
