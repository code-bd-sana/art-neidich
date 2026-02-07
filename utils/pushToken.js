// utils/pushToken.js
import { getOrCreateDeviceId } from "./deviceId";

export async function getWebPushToken() {
  if (process.env.NODE_ENV === "development") {
    console.warn("[DEV] Bypassing real SW registration for login testing");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("[DEV] Permission not granted, using placeholder");
      }
    } catch (e) {}
    // Return non-empty placeholder so backend accepts
    return `web-dev-placeholder-${Date.now()}`;
  }

  // Real production path (runs on Vercel, etc.)
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notifications required. Please allow them.");
  }

  const registration = await navigator.serviceWorker.register("/fcm-worker.js");

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidKey) throw new Error("VAPID key missing");

  const { getToken } = await import("firebase/messaging");
  const { messaging } = await import("@/lib/firebase");

  const token = await getToken(messaging, { vapidKey });

  if (!token) throw new Error("No token from Firebase");

  return token;
}
