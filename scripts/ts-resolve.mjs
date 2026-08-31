import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';

/*
 * Resolver hook for `node --test`.
 *
 * The application is bundled by Next, which resolves extensionless relative
 * imports ("./types") and the "@/" alias from tsconfig. Node's ESM resolver
 * does neither. Rather than litter the app with ".ts" extensions to suit the
 * test runner, this hook teaches the test runner the project's own two
 * conventions. It is loaded only by `npm test`.
 */

const projectRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), '..');
const EXTENSIONS = ['.ts', '.tsx', '.js', '.mjs'];

function firstExisting(basePath) {
  for (const extension of EXTENSIONS) {
    if (existsSync(basePath + extension)) return basePath + extension;
  }
  // A directory import ("./server") resolves to its index file.
  for (const extension of EXTENSIONS) {
    const indexPath = resolvePath(basePath, `index${extension}`);
    if (existsSync(indexPath)) return indexPath;
  }
  return null;
}

/*
 * Bare specifiers that only a bundler can resolve, mapped to stand-ins so the
 * modules that depend on them stay testable. "server-only" throws unless
 * resolved through React's export condition; "next/headers" needs a live
 * request. Neither substitution reaches a `next build`.
 */
const STUBS = {
  'server-only': 'scripts/stubs/empty.mjs',
  'client-only': 'scripts/stubs/empty.mjs',
  'next/headers': 'scripts/stubs/next-headers.mjs',
};

export async function resolve(specifier, context, nextResolve) {
  const stub = STUBS[specifier];
  if (stub) {
    return nextResolve(pathToFileURL(resolvePath(projectRoot, stub)).href, context);
  }

  let basePath = null;

  if (specifier.startsWith('@/')) {
    basePath = resolvePath(projectRoot, specifier.slice(2));
  } else if (specifier.startsWith('.') && context.parentURL?.startsWith('file:')) {
    basePath = resolvePath(dirname(fileURLToPath(context.parentURL)), specifier);
  }

  if (basePath && !EXTENSIONS.some((extension) => basePath.endsWith(extension))) {
    const match = firstExisting(basePath);
    if (match) return nextResolve(pathToFileURL(match).href, context);
  }

  if (specifier.startsWith('@/') && basePath) {
    return nextResolve(pathToFileURL(basePath).href, context);
  }

  return nextResolve(specifier, context);
}
