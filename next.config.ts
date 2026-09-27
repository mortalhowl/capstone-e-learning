import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "elearningnew.cybersoft.edu.vn",
      },
      {
        protocol: "http",
        hostname: "elearningnew.cybersoft.edu.vn",
      },
      {
        protocol: "https",
        hostname: "**.cybersoft.edu.vn",
      },
      {
        protocol: "http",
        hostname: "**.cybersoft.edu.vn",
      },
    ],
  },
};

export default nextConfig;
