import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle (node server.js) for deploying to a small VPS.
  output: "standalone",
  // Dev-only: lets a tunnel (e.g. a cloudflared quick tunnel) load dev assets.
  // Set DEV_TUNNEL_HOST in .env.local to the tunnel's hostname.
  allowedDevOrigins: process.env.DEV_TUNNEL_HOST ? [process.env.DEV_TUNNEL_HOST] : [],
  images: {
    // YouTube thumbnails for the Music section's click-to-play facade.
    remotePatterns: [new URL("https://i.ytimg.com/vi/**")],
  },
};

export default nextConfig;
