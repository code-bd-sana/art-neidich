// lib/service-worker-register.js
import { firebaseConfig } from "./firebase-config";
import {
  setupForegroundMessages,
  requestNotificationPermission,
} from "./foreground-messages";

export async function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      // First, request notification permission
      await requestNotificationPermission();

      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service Worker registered with scope:", registration.scope);

      // Wait for service worker to be ready
      const sw =
        registration.installing || registration.waiting || registration.active;

      if (sw.state === "activated") {
        // Send Firebase config to the active service worker
        sw.postMessage({
          type: "FIREBASE_CONFIG",
          config: firebaseConfig,
        });

        // Setup foreground messages
        setupForegroundMessages();
      } else {
        sw.addEventListener("statechange", (e) => {
          if (e.target.state === "activated") {
            // Send Firebase config
            e.target.postMessage({
              type: "FIREBASE_CONFIG",
              config: firebaseConfig,
            });

            // Setup foreground messages
            setupForegroundMessages();
          }
        });
      }

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  }
  return null;
}
