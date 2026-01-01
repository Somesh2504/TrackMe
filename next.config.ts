// next.config.ts
import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  generateEtags: false,
};

export default withPWA(nextConfig);
