import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  generateEtags: false,

  turbopack: {}, // tells Next "do NOT auto-enable turbopack"
};

export default withPWA(nextConfig);
