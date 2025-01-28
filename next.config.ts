import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "imagedelivery.net" }],
  },
};

export default nextConfig;
