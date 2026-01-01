"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualInstall, setShowManualInstall] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if running as standalone (iOS)
    if ((window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show manual install option after 2 seconds if beforeinstallprompt didn't fire
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        setShowManualInstall(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback: Show manual installation instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      const isChrome = /Chrome/.test(navigator.userAgent);
      const isEdge = /Edg/.test(navigator.userAgent);
      const isFirefox = /Firefox/.test(navigator.userAgent);

      let instructions = "To install this app:\n\n";

      if (isIOS) {
        instructions += "1. Tap the Share button (square with arrow)\n";
        instructions += "2. Scroll down and tap 'Add to Home Screen'\n";
        instructions += "3. Tap 'Add' in the top right";
      } else if (isAndroid) {
        if (isChrome || isEdge) {
          instructions += "1. Tap the menu (3 dots) in the browser\n";
          instructions += "2. Tap 'Install app' or 'Add to Home screen'\n";
          instructions += "3. Confirm installation";
        } else {
          instructions += "1. Tap the menu (3 dots)\n";
          instructions += "2. Look for 'Install' or 'Add to Home screen'\n";
          instructions += "3. Follow the prompts";
        }
      } else if (isChrome || isEdge) {
        instructions += "1. Look for the install icon (➕) in the address bar\n";
        instructions += "2. Click it to install the app\n";
        instructions += "Or go to Menu → Install";
      } else if (isFirefox) {
        instructions += "1. Click the menu (3 lines)\n";
        instructions += "2. Click 'Install'";
      } else {
        instructions += "Look for an install option in your browser's menu";
      }

      alert(instructions);
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowPrompt(false);
        setIsInstalled(true);
        setShowManualInstall(false);
      }

      setDeferredPrompt(null);
    } catch (err) {
      console.error("Install error:", err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowManualInstall(true); // Show manual install button instead
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pwa-install-dismissed", "true");
    }
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  // Check if dismissed (only in browser)
  const isDismissed =
    typeof window !== "undefined" &&
    sessionStorage.getItem("pwa-install-dismissed") === "true";

  // Show full prompt if beforeinstallprompt fired and not dismissed
  if (showPrompt && !isDismissed) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-100 mb-1">
                  Install TrackMe
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Install as an app for a better experience. Works offline and
                  loads faster.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Install
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Show compact install button if manual install should be shown
  if (showManualInstall || isDismissed) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-auto"
      >
        <button
          onClick={handleInstallClick}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          Install App
        </button>
      </motion.div>
    );
  }

  return null;
}
