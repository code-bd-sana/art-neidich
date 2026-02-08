// public/sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

let messaging = null;

// Listen for config from main app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    console.log("Service Worker: Received Firebase config");

    try {
      // Initialize Firebase with received config
      firebase.initializeApp(event.data.config);
      messaging = firebase.messaging();

      console.log("Service Worker: Firebase initialized");

      // Set up background message handler
      messaging.onBackgroundMessage((payload) => {
        console.log("Service Worker: Background message received", payload);

        const notificationTitle =
          payload.notification?.title || "New Notification";
        const notificationOptions = {
          body: payload.notification?.body || "You have a new message",
          icon: payload.notification?.icon || "/icon.png",
          badge: "/badge.png",
          data: payload.data || {},
        };

        return self.registration.showNotification(
          notificationTitle,
          notificationOptions,
        );
      });
    } catch (error) {
      console.error("Service Worker: Firebase initialization failed", error);
    }
  }
});

// Standard service worker events
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing");
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(clients.claim()); // Take control immediately
});

self.addEventListener("fetch", (event) => {
  // Optional: Add your fetch handling logic here
  event.respondWith(fetch(event.request));
});
