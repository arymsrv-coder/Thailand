import 'server-only';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cookies } from 'next/headers';
import { DATA_DIR } from './store';
import { newSecret, newVisitorId, readVisitorId, signVisitorId } from './signing';

/*
 * Visitor cookie plumbing. Signing itself lives in ./signing.ts.
 *
 * Cookies cannot be written during a render, only from a Server Action or a
 * Route Handler. So the render path reads whatever is already there, and the
 * first favourite toggle mints the cookie.
 */

export const VISITOR_COOKIE = 'amara_visitor';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/*
 * In production the secret comes from the environment. In development there is
 * usually no environment to speak of, so one is generated once and kept in the
 * gitignored data directory — which keeps saved destinations working across
 * restarts instead of silently forgetting every visitor on each `next dev`.
 */
let cachedSecret: Promise<string> | null = null;

async function loadSecret(): Promise<string> {
  const fromEnvironment = process.env.AMARA_SESSION_SECRET;
  if (fromEnvironment) return fromEnvironment;

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[session] AMARA_SESSION_SECRET is not set; saved destinations will not ' +
        'survive a restart or work across multiple instances.'
    );
  }

  const secretFile = join(DATA_DIR, '.secret');
  try {
    const existing = (await readFile(secretFile, 'utf8')).trim();
    if (existing) return existing;
  } catch {
    // No secret yet — fall through and make one.
  }

  const generated = newSecret();
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(secretFile, `${generated}\n`, 'utf8');
  return generated;
}

function sessionSecret(): Promise<string> {
  cachedSecret ??= loadSecret();
  return cachedSecret;
}

/** The current visitor's id, or null when they have never saved anything. */
export async function currentVisitorId(): Promise<string | null> {
  const store = await cookies();
  return readVisitorId(store.get(VISITOR_COOKIE)?.value, await sessionSecret());
}

/**
 * The current visitor's id, minting and setting the cookie when absent.
 * Only callable from a Server Action or Route Handler.
 */
export async function ensureVisitorId(): Promise<string> {
  const store = await cookies();
  const secret = await sessionSecret();

  const existing = readVisitorId(store.get(VISITOR_COOKIE)?.value, secret);
  if (existing) return existing;

  const id = newVisitorId();
  store.set(VISITOR_COOKIE, signVisitorId(id, secret), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
  });
  return id;
}
