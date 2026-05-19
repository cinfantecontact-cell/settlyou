const CACHE = "settlyou-v1";
const SHELL = [
  "/settlyou-logo-dark.png",
  "/apple-touch-icon.png",
  "/android-chrome-512x512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;

  // Only handle GET requests
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // API calls: network only (never cache)
  if (url.pathname.startsWith("/api/")) return;

  // Navigation requests: network first, offline fallback
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then(
          (cached) =>
            cached ||
            new Response(
              `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Settlyou — Offline</title><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb;color:#111827}.box{text-align:center;padding:2rem}h1{font-size:1.25rem;font-weight:700;margin-bottom:.5rem}p{color:#6b7280;font-size:.875rem;margin-bottom:1.5rem}a{display:inline-block;padding:.625rem 1.25rem;border:1px solid #bae5ba;border-radius:999px;color:#276327;font-weight:600;font-size:.875rem;text-decoration:none}</style></head><body><div class="box"><h1>You're offline</h1><p>Check your connection and try again.</p><a href="">Reload</a></div></body></html>`,
              { headers: { "Content-Type": "text/html" } }
            )
        )
      )
    );
    return;
  }

  // Static assets: cache first
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/static/") || SHELL.includes(url.pathname))
  ) {
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(request, clone));
            return res;
          })
      )
    );
  }
});
