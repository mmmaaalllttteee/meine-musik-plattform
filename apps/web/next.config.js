/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  images: {
    domains: ["images.unsplash.com", "cdn.pixabay.com", "i.scdn.co"],
  },
  reactStrictMode: true
};

module.exports = nextConfig;
