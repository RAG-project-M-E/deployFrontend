import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack root to this project to avoid lockfile root confusion
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
