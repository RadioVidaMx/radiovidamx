import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Incluir el Service Worker de notificaciones de Pingram para no romperlo
try {
  self.importScripts(
    "https://unpkg.com/notificationapi-js-client-sdk/dist/notificationapi-service-worker.js"
  );
} catch (e) {
  console.error("NotificationAPI Service Worker error:", e);
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
