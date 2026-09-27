import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/logo images are now arbitrary admin-entered URLs (no upload
    // pipeline), so any HTTPS host must be allowed to render — Next.js
    // Image requires an explicit allow-list, and a fixed one would break
    // the moment someone pastes a link from a new host.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
