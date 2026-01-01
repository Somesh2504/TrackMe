"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only register in production
    if (process.env.NODE_ENV !== "production") return;

    // Check if service workers are supported
    if (!("serviceWorker" in navigator)) {
      console.log("Service workers are not supported");
      return;
    }

    // Register service worker
    const registerSW = async () => {
      try {
        // Wait a bit for next-pwa to generate the service worker
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Try to register the service worker from next-pwa
        // next-pwa generates sw.js in the public folder
        let registration;
        
        try {
          registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });
          console.log("Service Worker registered:", registration);
        } catch (swError) {
          // If sw.js doesn't exist, try to find workbox files
          console.log("sw.js not found, checking for workbox files...");
          
          // List of possible service worker files from next-pwa
          const swFiles = ["/sw.js", "/workbox-sw.js"];
          
          for (const swFile of swFiles) {
            try {
              registration = await navigator.serviceWorker.register(swFile, {
                scope: "/",
              });
              console.log(`Service Worker registered from ${swFile}:`, registration);
              break;
            } catch (e) {
              continue;
            }
          }
          
          if (!registration) {
            throw new Error("No service worker file found");
          }
        }

        // Check for updates
        if (registration) {
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("New service worker available");
                }
              });
            }
          });
        }
      } catch (error) {
        console.error("Service Worker registration failed:", error);
        console.log("PWA will still work, but offline functionality may be limited");
      }
    };

    // Wait for page load before registering
    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
    }

    // Cleanup
    return () => {
      window.removeEventListener("load", registerSW);
    };
  }, []);

  return null;
}
