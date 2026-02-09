import { onMessage, getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export function setupForegroundMessages() {
  if (!messaging) {
    console.error("Firebase messaging not available");
    return;
  }

  console.log("Setting up foreground messages...");

  // Listen for messages when app is in FOREGROUND
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    // Show notification ONLY in foreground (not in background)
    if (Notification.permission === "granted") {
      const title = payload.notification?.title || "New Message";
      const options = {
        body: payload.notification?.body || "You have a new message",
        icon: payload.notification?.icon || "/icon.svg",
        badge: "/badge.svg",
        tag: payload.messageId || Date.now().toString(),
        renotify: false,
      };

      // Show notification
      const notification = new Notification(title, options);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();

        // Custom action
        if (payload.data?.url) {
          window.location.href = payload.data.url;
        }
      };
    }

    // Update UI
    const event = new CustomEvent("new-notification", {
      detail: payload,
    });
    window.dispatchEvent(event);
  });

  // Also listen for messages from service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.type === "BACKGROUND_NOTIFICATION") {
        console.log(
          "Received background notification in foreground:",
          event.data.payload,
        );
        // You can update UI here too
      }
    });
  }
}

// Also add this function to request notification permission
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    return permission;
  } catch (error) {
    console.error("Failed to request notification permission:", error);
    return "default";
  }
}
