// Service Worker for Mini AI Apps Gallery
const CACHE_NAME = 'mini-ai-apps-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/assets/images/logo.png',
  '/assets/images/logo192.png',
  '/assets/images/logo512.png',
  '/assets/css/index.css',
  '/assets/js/main.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests
  if (event.request.url.includes('/api/')) {
    return handleApiRequest(event);
  }

  // Handle static assets and navigation requests
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached response
        }
        
        return fetch(event.request)
          .then(response => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            // Return a simple error response for other requests
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
  );
});

// Handle API requests separately
function handleApiRequest(event) {
  event.respondWith(
    fetch(event.request)
      .then(response => response)
      .catch(() => {
        return new Response(
          JSON.stringify({ error: 'Network connection lost' }), {
            status: 408,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
  );
}

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'syncForms') {
    event.waitUntil(syncForms());
  }
});

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/assets/images/logo192.png',
    badge: '/assets/images/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'View App' },
      { action: 'close', title: 'Close' },
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Mini AI Apps', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(windowClients => {
          if (windowClients.length > 0) {
            return windowClients[0].focus();
          }
          return clients.openWindow('/');
        })
    );
  }
});