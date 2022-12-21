/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["ipfs.ternoa.dev", "ipfs-dev.ternoa.dev", "ipfs-dev.trnnfr.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 1500000,
  },
};

module.exports = nextConfig;
