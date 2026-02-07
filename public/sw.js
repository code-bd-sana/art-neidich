// public/sw.js - Firebase Cloud Messaging Service Worker

// Import Firebase scripts (compat version for service workers)
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js",
);

// Your Firebase project config (these are PUBLIC keys - safe to have here)
const firebaseConfig = {
  apiKey: "AIzaSyBGNQXe_3qvf-g9rJK5rnUNyR6z_5yoV6s",
  authDomain: "fhainspectorapp-61618.firebaseapp.com",
  projectId: "fhainspectorapp-61618",
  storageBucket: "fhainspectorapp-61618.firebasestorage.app",
  messagingSenderId: "414246258271",
  appId: "1:414246258271:web:2b49045afbfdb41fb6bdea",
};

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages (when app is closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log("[sw.js] Background Message received: ", payload);

  // Customize notification here
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/icon-192x192.png", // ← change to your actual icon path
    badge: "/badge.png", // optional
    // tag: 'unique-tag',             // optional - prevent duplicate notifications
    // renotify: true,                // optional
    // vibrate: [200, 100, 200],      // optional vibration pattern
    // actions: [                     // optional buttons
    //   { action: 'open', title: 'Open' },
    //   { action: 'dismiss', title: 'Dismiss' }
    // ]
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

// Optional: Handle notification click (when user clicks the notification)
self.addEventListener("notificationclick", (event) => {
  console.log("[sw.js] Notification clicked: ", event.notification.tag);

  event.notification.close();

  // Example: open your app or specific page
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open → focus it
        for (const client of clientList) {
          if (client.url.includes("/") && "focus" in client) {
            return client.focus();
          }
        }
        // If no window open → open one
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      }),
  );
});

// Optional: Handle push subscription change
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("[sw.js] Push subscription changed");
  // You can re-subscribe here if needed
});
