const CACHE_NAME = 'valentine-proposal-v4';
const STATIC_ASSETS = [
  '/assets/generated/rose-bg.dim_1920x1080.png',
  '/assets/generated/vignette-overlay.dim_1920x1080.png',
  '/assets/generated/ornament-corners.dim_1024x1024.png',
  '/assets/generated/sparkle-sprite.dim_512x512.png',
  '/assets/generated/heart-sprite.dim_512x512.png',
  '/assets/audio/romantic-instrumental.mp3',
  '/assets/audio/soft-ambient.mp3',
  '/assets/audio/heartbeat-once.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Only precache static assets, not index.html or bundles
      // (bundles will be cached on first load via runtime caching)
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.error('[SW] Cache addAll failed:', error);
      });
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activated and claimed clients');
      // Claim all clients immediately
      return self.clients.claim();
    })
  );
});

/**
 * Enhanced fetch handler with strict HTML-never-for-scripts guard
 * and boot-critical bundle caching for offline support
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      // For navigation requests (HTML pages)
      if (request.mode === 'navigate') {
        try {
          // Try network first for navigations to get latest HTML
          const networkResponse = await fetch(request);
          
          // Cache the successful navigation response for offline use
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put('/index.html', networkResponse.clone());
            
            // CRITICAL: After caching HTML, extract and cache boot-critical bundles
            // This ensures offline boot works after first successful load
            try {
              const htmlText = await networkResponse.clone().text();
              const bundleMatches = htmlText.matchAll(/["'](\/assets\/[^"']+\.(?:js|mjs|css))["']/g);
              
              for (const match of bundleMatches) {
                const bundleUrl = match[1];
                // Proactively fetch and cache boot-critical bundles
                fetch(bundleUrl).then(bundleResponse => {
                  if (bundleResponse.ok) {
                    cache.put(bundleUrl, bundleResponse);
                    console.log('[SW] Cached boot-critical bundle:', bundleUrl);
                  }
                }).catch(err => {
                  console.warn('[SW] Failed to cache bundle:', bundleUrl, err);
                });
              }
            } catch (err) {
              console.warn('[SW] Failed to extract bundles from HTML:', err);
            }
          }
          
          return networkResponse;
        } catch (error) {
          // If offline, serve cached app shell
          const cachedResponse = await caches.match('/index.html');
          if (cachedResponse) {
            console.log('[SW] Serving cached app shell (offline)');
            return cachedResponse;
          }
          throw error;
        }
      }

      // For scripts, styles, and workers - CRITICAL for offline boot
      // NEVER return cached HTML for these requests
      if (
        request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'worker' ||
        request.destination === 'module' ||
        url.pathname.startsWith('/assets/') ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.mjs') ||
        url.pathname.endsWith('.css')
      ) {
        try {
          // Try network first
          const networkResponse = await fetch(request);
          
          // Cache successful responses for offline use
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          // Offline: return cached asset only if it's NOT HTML
          const cachedResponse = await caches.match(request);
          
          if (cachedResponse) {
            const contentType = cachedResponse.headers.get('content-type') || '';
            
            // STRICT CHECK: never serve HTML for script/style/module/asset requests
            // This prevents the "Expected JavaScript module but got HTML" error
            if (!contentType.includes('text/html')) {
              console.log('[SW] Serving cached asset (offline):', url.pathname);
              return cachedResponse;
            } else {
              console.error('[SW] Blocked HTML response for asset request:', url.pathname);
              throw new Error('Cached response is HTML, not an asset');
            }
          }
          
          throw error;
        }
      }

      // For images, audio, fonts - cache first for performance
      if (
        request.destination === 'image' ||
        request.destination === 'audio' ||
        request.destination === 'font'
      ) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          throw error;
        }
      }

      // Default: network first, then cache
      try {
        const networkResponse = await fetch(request);
        return networkResponse;
      } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        throw error;
      }
    })()
  );
});
