try {
  importScripts(
    "https://unpkg.com/notificationapi-js-client-sdk/dist/notificationapi-service-worker.js"
  );
} catch (e) {
  console.error("NotificationAPI Service Worker error:", e);
}
