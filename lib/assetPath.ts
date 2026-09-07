/*
 * The public path of a file in /public, with the deployment's base path.
 *
 * `basePath` rewrites the framework's own URLs and every `<Link>`, but not the
 * `src` of a plain `<video>`, `<source>` or `poster` — those strings are used
 * verbatim, so a site served from /Thailand/ needs the prefix added here.
 * `next/image` goes through lib/imageLoader.ts, which does the same thing.
 */

// Must match next.config.ts. Inlined at build time, so it is correct in the
// browser bundle too.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Thailand';

export function asset(path: string): string {
  // Remote and data URLs are already absolute; only site-relative paths move.
  if (!path.startsWith('/')) return path;
  return `${BASE_PATH}${path}`;
}
