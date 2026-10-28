// Домашка — service worker.
// Always tries the network first so students and teachers get fresh pages;
// falls back to the last saved copy when offline. Supabase and other
// cross-origin requests are never touched.
const CACHE = "domashka-v3";
const CORE = ["index_3_updated.html", "auth.html", "teacher.html", "teacher-app.html",
              "manifest.json", "manifest-teacher.json", "icons/icon-192.png", "icons/icon-512.png",
              "app-config.js", "themes.js", "settings.js", "privacy.html", "terms.html", "support.html", "legal.css", "legal.js", "tabbar.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
