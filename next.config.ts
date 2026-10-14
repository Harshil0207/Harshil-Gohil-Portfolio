import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow opening the dev server from other devices on the LAN (e.g. phone).
  allowedDevOrigins: ["192.168.1.6"],
};

export default nextConfig;
