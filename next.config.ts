import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray package-lock.json in a parent directory
  // is not mistaken for this project's.
  turbopack: { root: __dirname },
  images: {
    // Local photos in /public are served through next/image's optimizer.
    formats: ['image/avif', 'image/webp'],
    // The Main Booking / Cruises category cards have no local photo to draw
    // on (this site only shoots its own tours and destinations), so those
    // few pull a stock photo from Unsplash's CDN instead.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
