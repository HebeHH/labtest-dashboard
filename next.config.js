/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we're using App Router correctly
  appDir: true,
  // Default output directory
  distDir: '.next',
}

module.exports = nextConfig 