// public/_next/static/workers/push.js
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

messaging.onBackgroundMessage((payload) => {
  console.log("[push] Background Message ", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/icon-192x192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
