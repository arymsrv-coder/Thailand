import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray package-lock.json in a parent directory
  // is not mistaken for this project's.
  turbopack: { root: __dirname },
  images: {
    /*
     * Local photos in /public are served through next/image's optimizer.
     * AVIF is deliberately left off: the car listing photos (public/Content/
     * cars) include at least two — the Honda Jazz and Toyota Hiace shots —
     * whose content makes the AVIF encoder pathologically slow in this dev
     * environment, hanging the request instead of erroring, which renders as
     * a permanently blank <img> with no console error. WebP alone gets
     * nearly the same size win without that risk.
     */
    formats: ['image/webp'],
    // The Main Booking / Cruises category cards have no local photo to draw
    // on (this site only shoots its own tours and destinations), so those
    // few pull a stock photo from Unsplash's CDN instead.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
