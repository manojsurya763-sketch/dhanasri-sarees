import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/logo images are admin-entered URLs from any host (no upload
    // pipeline), so the allow-list has to be a wildcard rather than a fixed
    // set of known domains.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
