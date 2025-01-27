import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "imagedelivery.net" }],
  },
  manifest: "/manifest.json",
};

export default nextConfig;
