const CACHE = '4ever-v2'

const PRECACHE = [
  '/shop',
  '/manifest.json',
  '/favicon.svg',
  '/og-image.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const { request } = e
  if (request.method !== 'GET') return
  if (request.url.includes('/api/')) return
  if (!request.url.startsWith('http')) return

  e.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(res => {
          if (res.ok && !request.url.includes('chrome-extension')) {
            caches.open(CACHE).then(c => c.put(request, res.clone()))
          }
          return res
        })
        .catch(() => cached || new Response(
          `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>4ever Coffee — Offline</title>
          <style>body{margin:0;background:#1a0b06;color:#fdf6ec;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px}
          .o{max-width:420px}.e{font-size:72px;margin-bottom:16px}.t{font-size:2rem;color:#d4a060;margin-bottom:12px}.s{font-size:1rem;opacity:.6;line-height:1.7}
          .b{margin-top:28px;padding:12px 28px;background:#d4a060;color:#1a0b06;border:none;border-radius:10px;font-size:.95rem;font-weight:700;cursor:pointer;font-family:inherit}
          </style></head><body><div class="o"><div class="e">☕</div><div class="t">You're offline</div>
          <p class="s">4ever Coffee will be right back as soon as your connection returns. In the meantime, your cart and loyalty points are safe.</p>
          <button class="b" onclick="location.reload()">Try again</button></div></body></html>`,
          { headers: { 'Content-Type': 'text/html' } }
        ))
      return cached || network
    })
  )
})

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting()
})