/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  serverExternalPackages: ['pdf2json'],
  webpack: (config) => {
    // Avoid "Can't resolve 'fs'" error in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
      path: false,
    };
    return config;
  },
}

module.exports = nextConfig 