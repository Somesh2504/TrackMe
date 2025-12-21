import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  generateEtags: false,

  // removed unsupported `turbo` experimental flag (caused TS validation error)
};

export default nextConfig;
