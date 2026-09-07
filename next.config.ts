import type { NextConfig } from 'next';

/*
 * Built as a static export for GitHub Pages.
 *
 * Pages is a file server: it can serve HTML, CSS, JS and images, and nothing
 * else. There is no Node process behind it, so `output: 'export'` is what
 * makes this deployable at all — every route is prerendered to HTML at build
 * time and everything dynamic happens in the visitor's browser.
 *
 * The consequences are deliberate, not accidental:
 *   - no image optimizer, so images are served as plain files (lib/imageLoader.ts)
 *   - no Route Handlers or Server Actions (see lib/forms.ts)
 *   - search state is read from the URL on the client (see lib/useRawQuery.ts)
 */

/*
 * The site lives at /<repo>/ on github.io, so every asset and link needs that
 * prefix. Set NEXT_PUBLIC_BASE_PATH to '' when serving from a custom domain or
 * a user/org Pages site, where the site is at the root instead.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Thailand';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  // Pages resolves /flights/ to /flights/index.html but not /flights.html, so
  // emit directories rather than sibling files.
  trailingSlash: true,
  // Pin the workspace root so a stray package-lock.json in a parent directory
  // is not mistaken for this project's.
  turbopack: { root: __dirname },
  images: {
    /*
     * A custom loader instead of `unoptimized`, purely so that `basePath`
     * reaches the photo URLs — see lib/imageLoader.ts for why it has to.
     */
    loader: 'custom',
    loaderFile: './lib/imageLoader.ts',
  },
};

export default nextConfig;
