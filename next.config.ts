import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  serverExternalPackages: ["magnet2torrent-js"],
};

export default nextConfig;
