/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // ensures optimal local file display without external remote patterns
  },
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;
