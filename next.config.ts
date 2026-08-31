import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray package-lock.json in a parent directory
  // is not mistaken for this project's.
  turbopack: { root: __dirname },
  images: {
    // Local photos in /public are served through next/image's optimizer.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
