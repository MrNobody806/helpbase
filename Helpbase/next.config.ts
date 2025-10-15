// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for Cloudflare Pages
  },
  // Remove any API routes, middleware, or server-side features
  env: {
    // Public environment variables will be injected by Cloudflare
  },
};

export default nextConfig;
