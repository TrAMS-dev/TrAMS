import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "imgur.com"
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ],
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
