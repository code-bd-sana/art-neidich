// lib/foreground-messages.js
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export function setupForegroundMessages() {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    // MANUALLY show notification in foreground
    if (Notification.permission === "granted") {
      const title = payload.notification?.title || "New Message";
      const options = {
        body: payload.notification?.body,
        icon: "/icon.svg",
        badge: "/badge.svg",
        tag: payload.messageId, // Prevent duplicates
        requireInteraction: false,
      };

      // Show notification
      new Notification(title, options);
    }

    // Optional: Update your UI
    const event = new CustomEvent("new-notification", {
      detail: payload,
    });
    window.dispatchEvent(event);
  });
}
