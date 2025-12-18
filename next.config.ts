import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  generateEtags: false,

  experimental: {
    turbo: false,   // ❗ TURN OFF T U R B O P A C K
  },
};

export default nextConfig;
