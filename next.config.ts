import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "icon.horse",
        port: "",
        pathname: "/icon/**",
      },
    ],
  },
};

export default nextConfig;
