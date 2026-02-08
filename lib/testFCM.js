export async function getTestFCMToken() {
  try {
    // 1. Check if we can use notifications
    if (!("Notification" in window)) {
      throw new Error("Browser doesn't support notifications");
    }

    // 2. Request permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Permission denied");
    }

    // 3. Create a simple service worker
    if ("serviceWorker" in navigator) {
      // Create a basic service worker on the fly
      const swContent = `
        self.addEventListener('install', () => self.skipWaiting());
        self.addEventListener('activate', () => self.clients.claim());
      `;

      const blob = new Blob([swContent], { type: "application/javascript" });
      const swUrl = URL.createObjectURL(blob);

      const registration = await navigator.serviceWorker.register(swUrl, {
        scope: "/",
      });

      await navigator.serviceWorker.ready;
    }

    // 4. Generate a mock token (like mobile does)
    // In production, replace with real Firebase
    const mockToken = `fcm_${Math.random().toString(36).substring(2)}_${Date.now()}`;

    return mockToken;
  } catch (error) {
    console.warn("Could not get FCM token:", error);
    return `web_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}
