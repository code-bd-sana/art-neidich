// lib/service-worker-register.js
import { firebaseConfig } from "./firebase-config";

export async function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service Worker registered with scope:", registration.scope);

      // Wait for service worker to be ready
      if (registration.installing) {
        console.log("Service Worker installing");
      } else if (registration.waiting) {
        console.log("Service Worker installed");
      } else if (registration.active) {
        console.log("Service Worker active");

        // Send Firebase config to the active service worker
        registration.active.postMessage({
          type: "FIREBASE_CONFIG",
          config: firebaseConfig,
        });
      }

      // Listen for updates
      registration.addEventListener("updatefound", () => {
        console.log("Service Worker update found");

        const newWorker = registration.installing;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "activated") {
            // Send config to the newly activated worker
            newWorker.postMessage({
              type: "FIREBASE_CONFIG",
              config: firebaseConfig,
            });
          }
        });
      });

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  }
  return null;
}
