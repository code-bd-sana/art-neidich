importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

self.addEventListener("notificationclick", (event) => {
  // console.log("Notification clicked:", event.notification);

  event.notification.close();

  const urlToOpen = "/dashboard";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

let messaging = null;

// Listen for config from main app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    // console.log("Service Worker: Received Firebase config");

    try {
      // Initialize Firebase with received config
      firebase.initializeApp(event.data.config);
      messaging = firebase.messaging();

      // console.log("Service Worker: Firebase initialized");

      // Set up background message handler
      messaging.onBackgroundMessage((payload) => {
        // console.log("Service Worker: Background message received", payload);
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "BACKGROUND_NOTIFICATION",
              payload: payload,
            });
          });
        });
      });
    } catch (error) {
      console.error("Service Worker: Firebase initialization failed", error);
    }
  }
});

// Standard service worker events
self.addEventListener("install", (event) => {
  // console.log("Service Worker: Installing");
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", (event) => {
  // console.log("Service Worker: Activated");
  event.waitUntil(clients.claim()); // Take control immediately
});

self.addEventListener("fetch", (event) => {
  // Optional: Add your fetch handling logic here
  event.respondWith(fetch(event.request));
});
