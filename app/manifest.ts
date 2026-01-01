import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrackMe | Gym Weight Tracker",
    short_name: "TrackMe",
    description:
      "Log workouts, track weights, and see your strength progress with TrackMe.",
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "window-controls-overlay"],
    orientation: "portrait-primary",
    background_color: "#0f172a",
    theme_color: "#000000",
    categories: ["health", "fitness", "lifestyle"],
    dir: "ltr",
    lang: "en",
    icons: [
      {
        src: "/Icon.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/Icon.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/Icon.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "maskable",
      },
      {
        src: "/Icon.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
    prefer_related_applications: false,
    shortcuts: [],
  };
}

