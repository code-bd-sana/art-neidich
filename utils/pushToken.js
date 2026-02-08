// lib/pushToken.js
export async function getWebPushToken() {
  // Check if we're in a browser
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.warn("Service workers not supported");
    return `web-no-sw-${Date.now()}`;
  }

  // Check for HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    window.location.protocol !== "https:"
  ) {
    console.warn("Push requires HTTPS in production");
    return `web-no-https-${Date.now()}`;
  }

  // Request notification permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission denied");
  }

  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered:", registration);

    // Wait for service worker to be active
    await navigator.serviceWorker.ready;

    // Import Firebase messaging (dynamic import)
    const { getToken } = await import("firebase/messaging");
    const { messaging } = await import("@/lib/firebase");

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_PUBLIC_KEY;

    if (!vapidKey) {
      console.error("VAPID key is missing");
      return `web-no-vapid-${Date.now()}`;
    }

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.error("Failed to get FCM token");
      return `web-no-token-${Date.now()}`;
    }

    console.log("FCM Token obtained:", token.substring(0, 20) + "...");
    return token;
  } catch (error) {
    console.error("Error getting push token:", error);

    // Fallback for development
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Using development placeholder due to error:",
        error.message,
      );
      return `web-dev-fallback-${Date.now()}`;
    }

    throw error;
  }
}
