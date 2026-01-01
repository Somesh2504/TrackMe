declare module "next-pwa" {
    import type { NextConfig } from "next";
  
    type PWAOptions = {
      dest?: string;
      register?: boolean;
      skipWaiting?: boolean;
      disable?: boolean;
    };
  
    export default function withPWA(
      config: PWAOptions
    ): (nextConfig: NextConfig) => NextConfig;
  }
  