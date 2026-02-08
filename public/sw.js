importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyBGNQXe_3qvf-g9rJK5rnUNyR6z_5yoV6s",
  authDomain: "fhainspectorapp-61618.firebaseapp.com",
  projectId: "fhainspectorapp-61618",
  storageBucket: "fhainspectorapp-61618.firebasestorage.app",
  messagingSenderId: "414246258271",
  appId: "1:414246258271:web:2b49045afbfdb41fb6bdea",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 1. FIRST: Handle ALL push events before Firebase does
self.addEventListener("push", function (event) {
  console.log("[SW] Push event received");

  if (!event.data) {
    console.log("[SW] No data in push event");
    return;
  }

  try {
    const payload = event.data.json();
    console.log("[SW] Push payload:", payload);

    // If this is a Firebase notification message
    if (payload.notification) {
      console.log("[SW] Intercepting Firebase notification");

      // Show our own notification instead
      const title = payload.notification.title || "New Notification";
      const options = {
        body: payload.notification.body || "",
        icon: "/icon.png",
        badge: "/badge.png",
        tag: "fcm-notification", // SAME TAG prevents duplicates
        data: {
          click_action: "/dashboard",
          ...payload.data,
        },
      };

      // Show ONE notification
      event.waitUntil(self.registration.showNotification(title, options));

      // STOP Firebase from showing another notification
      return;
    }
  } catch (error) {
    console.log("[SW] Not a JSON payload:", error);
  }
});

// 2. Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  console.log("[SW] Notification clicked");
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      // Focus existing window
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow("/dashboard");
      }
    }),
  );
});

// 3. Firebase background handler - DO NOTHING here
// We're handling everything in the 'push' event above
messaging.onBackgroundMessage(function (payload) {
  console.log("[SW] Firebase onBackgroundMessage - doing nothing");
  // Return nothing - we already handled it in 'push' event
  return null;
});

// 4. Service worker activation
self.addEventListener("install", function (event) {
  console.log("[SW] Install event");
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("[SW] Activate event");
  event.waitUntil(clients.claim());
});
