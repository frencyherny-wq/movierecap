/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for Replit: allow external access
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
